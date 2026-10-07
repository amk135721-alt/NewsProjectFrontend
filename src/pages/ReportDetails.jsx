import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../comp/Sidebar';
import { FaNewspaper, FaMapMarkerAlt, FaTag } from 'react-icons/fa';

const UserDetails = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get("http://localhost:5001/api/viewreport")
      .then((res) => {
        const reportData = Array.isArray(res.data)
          ? res.data
          : res.data.reports || res.data.data || [];

        setReports(reportData);
        console.log(reportData);
      })
      .catch((error) => {
        console.error("Error fetching reports:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Extract user identifier
  const getUserIdentifier = (item) => {
    if (!item) return 'Anonymous';
    if (typeof item.userId === 'object' && item.userId !== null) {
      return item.userId.email || item.userId.username || item.userId._id || 'Anonymous';
    }
    return item.email || item.user || item.userId || 'Anonymous';
  };

  // Extract user name
  const getUserName = (item) => {
    if (typeof item?.userId === 'object' && item?.userId !== null) {
      return item.userId.name || '';
    }
    return item?.name || '';
  };

  // Extract report message
  const getReportMessage = (item) => {
    if (!item) return 'No message detailed';
    return item.report || item.message || item.reason || 'No message detailed';
  };

  // Filter with safe string conversions
  const filteredReports = reports.filter((item) => {
    const userVal = String(getUserIdentifier(item)).toLowerCase();
    const nameVal = String(getUserName(item)).toLowerCase();
    const msgVal = String(getReportMessage(item)).toLowerCase();
    const newsTitle = typeof item.newsId === 'object' && item.newsId !== null
      ? String(item.newsId.newsheadline || '').toLowerCase()
      : '';
    const newsContent = typeof item.newsId === 'object' && item.newsId !== null
      ? String(item.newsId.newscontent || '').toLowerCase()
      : '';
    const query = searchTerm.toLowerCase();

    return (
      userVal.includes(query) ||
      nameVal.includes(query) ||
      msgVal.includes(query) ||
      newsTitle.includes(query) ||
      newsContent.includes(query)
    );
  });

  return (
    <div className="flex min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-rose-500 selection:text-white">
      {/* Sidebar */}
      <div className="shrink-0 z-20">
        <Sidebar />
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-[#07090e]/90 backdrop-blur-2xl border-b border-slate-800/80 px-6 py-6 md:px-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                <h1 className="text-2xl font-black text-white tracking-wide">
                  USER REPORTS
                </h1>
              </div>
              <p className="text-slate-400 text-xs mt-1">
                Feed of submitted user tickets and system flags
              </p>
            </div>

            {/* Search Input Box */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search user, message or news..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500/50"
              />
            </div>
          </div>
        </header>

        {/* Card Grid Stream */}
        <main className="p-6 md:p-10 max-w-7xl w-full mx-auto flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-64 rounded-3xl bg-slate-900/40 border border-slate-800/60 animate-pulse p-6" />
              ))}
            </div>
          ) : filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((item, index) => {
                const userVal = String(getUserIdentifier(item));
                const nameVal = String(getUserName(item));
                const messageVal = String(getReportMessage(item));
                const itemId = item._id ? String(item._id) : null;
                const avatarInitial = (nameVal || userVal).charAt(0).toUpperCase();
                const news = typeof item.newsId === 'object' ? item.newsId : null;

                const dateVal = item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })
                  : null;

                return (
                  <div
                    key={itemId || index}
                    className="group relative flex flex-col justify-between bg-gradient-to-b from-slate-900/80 to-slate-950/90 border border-slate-800 hover:border-rose-500/50 rounded-3xl p-6 transition-all duration-300 hover:shadow-[0_10px_30px_-10px_rgba(244,63,94,0.15)] hover:-translate-y-1"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 font-extrabold flex items-center justify-center shrink-0">
                            {avatarInitial}
                          </div>
                          <div className="truncate">
                            {nameVal && (
                              <h3 className="font-bold text-slate-100 text-sm truncate group-hover:text-rose-400 transition-colors">
                                {nameVal}
                              </h3>
                            )}
                            <p className="text-xs text-slate-400 truncate">
                              {userVal}
                            </p>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                          NEW
                        </span>
                      </div>

                      {/* Card Body (Report Message) */}
                      <div className="bg-[#05070b]/60 border border-slate-800/80 rounded-2xl p-4 text-xs text-slate-300 leading-relaxed mb-4">
                        <p className="text-[10px] text-rose-400 font-bold uppercase tracking-wider mb-1">Reported Details</p>
                        {messageVal}
                      </div>

                      {/* Attached News Section */}
                      {news ? (
                        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
                          <a
                            href="/edit"
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 hover:border-rose-500/40 transition-all duration-200"
                          >
                            EDIT
                          </a>
                          <div className="flex gap-3 items-center">

                            {news.pic && (
                              <img
                                src={`https://res.cloudinary.com/c39rbbrm/image/upload/${news.pic}`}
                                alt={news.newsheadline || "Reported News"}
                                className="w-14 h-14 object-cover rounded-xl border border-slate-700 shrink-0"
                                onError={(e) => {
                                  e.target.src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=200&auto=format&fit=crop";
                                }}
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-0.5">
                                {news.newstype && (
                                  <span className="flex items-center gap-1 text-rose-400 font-semibold">
                                    <FaTag className="text-[9px]" /> {news.newstype}
                                  </span>
                                )}
                                {news.location && (
                                  <span className="flex items-center gap-1">
                                    <FaMapMarkerAlt className="text-[9px]" /> {news.location}
                                  </span>
                                )}
                              </div>
                              <h4 className="text-xs font-bold text-slate-200 leading-snug">
                                {news.newsheadline || "Untitled Article"}
                              </h4>
                            </div>
                          </div>

                          {/* News Content */}
                          {(news.newscontent || news.content) && (
                            <div className="pt-2 border-t border-slate-800/80">
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Content</p>
                              <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                                {news.newscontent || news.content}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : item.newsId ? (
                        <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-3 text-[11px] text-slate-400 flex items-center gap-2">
                          <FaNewspaper className="text-slate-500" />
                          <span>Article ID: <span className="text-slate-300">{String(item.newsId)}</span></span>
                        </div>
                      ) : null}
                    </div>

                    {/* Card Footer */}
                    {dateVal && (
                      <div className="mt-4 pt-3 border-t border-slate-800/60 flex justify-between items-center text-[10px] text-slate-500">
                        <span>Reported on</span>
                        <span className="font-medium text-slate-400">{dateVal}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 mb-3">
                ?
              </div>
              <p className="text-slate-300 font-bold text-sm">No Reports Recorded</p>
              <p className="text-slate-500 text-xs mt-1">
                {searchTerm ? 'Try clearing your search query.' : 'There are currently no report entries available.'}
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserDetails;