import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaRegClock, FaArrowLeft, FaExclamationTriangle, FaNewspaper } from "react-icons/fa";
import axios from 'axios';
import { useLocation, Link, useNavigate } from 'react-router-dom';

const FindByLocation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Retrieve the passed location (with fallback)
  const selectedLocation = location.state?.location || "Location";

  useEffect(() => {
    if (!selectedLocation || selectedLocation === "Location") {
      setLoading(false);
      return;
    }

    axios.get(`https://newsbackend-3-q0cj.onrender.com/api/getbylocation/${selectedLocation}`)
      .then((res) => {
        const newsArray = Array.isArray(res.data)
          ? res.data
          : res.data.news || res.data.data || [];

        setData(newsArray);
      })
      .catch((error) => {
        console.error("Error fetching news:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedLocation]);

  return (
    <div className="relative min-h-screen bg-white font-sans text-slate-800 p-6 md:p-10 overflow-hidden flex flex-col justify-between">

      {/* Subtle Background Glow Accent */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-cyan-100/40 via-blue-100/30 to-slate-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <header className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between mb-10 pb-6 border-b border-slate-200">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide border border-slate-300 transition duration-300 active:scale-95 cursor-pointer"
        >
          <FaArrowLeft className="text-xs" />
          <span>Back</span>
        </button>

        <div className="text-center">
          <p className="text-cyan-600 text-[11px] font-bold tracking-widest uppercase mb-1">
            Regional Coverage
          </p>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
            <FaMapMarkerAlt className="text-red-500 text-xl" />
            <span>{selectedLocation}</span>
          </h1>
        </div>

        <div className="w-16 hidden md:block" />
      </header>

      {/* Main Grid Section */}
      <main className="relative z-10 max-w-7xl mx-auto w-full flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
            <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-500 font-medium text-sm">Loading articles for {selectedLocation}...</p>
          </div>
        ) : data && data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.map((item, index) => (
              <article
                key={item._id || index}
                className="group relative flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] hover:border-cyan-500/50 transition-all duration-300"
              >
                {/* Image Section */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                  <img
                    src={item.pic ? `https://res.cloudinary.com/c39rbbrm/image/upload/${item.pic}` : "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop"}
                    alt={item.newsheadline || "News thumbnail"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop";
                    }}
                  />

                  {/* Category Badge */}
                  <span className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    {item.newstype || "NEWS"}
                  </span>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    {/* Meta Info Bar */}
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3 font-medium">
                      <span className="flex items-center gap-1.5 text-cyan-600 font-semibold">
                        <FaMapMarkerAlt className="text-xs" />
                        {item.location || selectedLocation}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FaRegClock className="text-xs text-slate-400" />
                        {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    {/* Headline */}
                    <h2 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-cyan-600 transition-colors duration-200 leading-snug">
                      {item.newsheadline || "Untitled News Article"}
                    </h2>

                    {/* Article Content */}
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-4 font-normal mb-6">
                      {item.newscontent || "No detailed content provided for this news item."}
                    </p>
                  </div>

                  {/* Card Action Footer */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400 italic">Verified Source</span>
                    <Link
                      to="/report"
                      className="text-xs font-semibold text-slate-600 hover:text-red-500 transition-colors flex items-center gap-1"
                    >
                      <FaExclamationTriangle className="text-[10px]" />
                      Report Story
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[45vh] bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center max-w-md mx-auto shadow-sm">
            <FaNewspaper className="text-5xl text-slate-400 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">No News Articles Found</h3>
            <p className="text-sm text-slate-500 mb-6">
              There are currently no reported stories for <span className="text-cyan-600 font-semibold">{selectedLocation}</span>.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-4 py-2.5 rounded-xl font-semibold transition cursor-pointer"
            >
              Choose Another Location
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full pt-10 mt-12 border-t border-slate-200 text-center">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} Digital News Portal. All rights reserved. • <Link to="/about" className="hover:underline text-slate-700 font-medium">About Us</Link>
        </p>
      </footer>

    </div>
  );
};

export default FindByLocation;