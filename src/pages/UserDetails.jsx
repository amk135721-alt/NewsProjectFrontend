import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../comp/Sidebar';
import { 
  FaUsers, 
  FaUserShield, 
  FaLock, 
  FaSync, 
  FaExclamationTriangle,
  FaBan,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

const UserDetails = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchUsers = (page = 1) => {
    setLoading(true);
    setError(null);

    axios.get(`https://newsbackend-3-q0cj.onrender.com/api/getalluser?page=${page}`)
      .then((res) => {
        const responseData = res.data;

        const userList = Array.isArray(responseData)
          ? responseData
          : responseData.data || responseData.users || [];

        setUsers(userList);

        if (responseData.pagination) {
          setTotalPages(responseData.pagination.totalPages || 1);
          setTotalUsers(responseData.pagination.totalUsers || userList.length);
          setCurrentPage(responseData.pagination.currentPage || page);
        } else {
          setTotalPages(1);
          setTotalUsers(userList.length);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching users:', err);
        setError('Failed to fetch user details');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleToggleBlock = async (userId) => {
    if (!userId) {
      alert("Invalid User ID");
      return;
    }

    setActionLoading((prev) => ({ ...prev, [userId]: true }));

    try {
      const response = await axios.put(`https://newsbackend-3-q0cj.onrender.com/api/block/${userId}`);
      const updatedUser = response.data?.user;

      setUsers((prevUsers) =>
        prevUsers.map((u) => {
          if (u._id === userId) {
            const nextStatus = updatedUser?.status 
              ? updatedUser.status 
              : u.status === 'blocked' ? 'active' : 'blocked';
            return { ...u, status: nextStatus };
          }
          return u;
        })
      );
    } catch (err) {
      console.error('Error toggling user status:', err);
      alert(err.response?.data?.message || 'Failed to update user status');
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 overflow-hidden">
      
      {/* Docked Sidebar */}
      <div className="w-64 flex-shrink-0 h-full border-r border-slate-800/80">
        <Sidebar />
      </div>

      {/* Main Content Viewport */}
      <main className="flex-1 h-full overflow-y-auto p-6 md:p-10">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/20">
                <FaUsers className="text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  User Directory
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage and monitor registered platform user accounts.
                </p>
              </div>
            </div>

            <button
              onClick={() => fetchUsers(currentPage)}
              disabled={loading}
              className="flex items-center gap-2 self-start sm:self-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 rounded-xl transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <FaSync className={`text-xs ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Metrics Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-slate-900 border border-slate-800/80 p-5 flex items-center justify-between shadow-lg">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Registered</p>
                <h3 className="text-2xl font-extrabold text-white mt-1">{totalUsers} Users</h3>
              </div>
              <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
                <FaUsers className="text-lg" />
              </div>
            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800/80 p-5 flex items-center justify-between shadow-lg">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Security Status</p>
                <h3 className="text-2xl font-extrabold text-emerald-400 mt-1">Encrypted</h3>
              </div>
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <FaUserShield className="text-lg" />
              </div>
            </div>
          </div>

          {/* User Table Container */}
          <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900 shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email Address</th>
                  <th className="px-6 py-4">Password Hash</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FaSync className="animate-spin text-lg text-amber-500" />
                        <p className="text-xs font-medium">Fetching accounts...</p>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-rose-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FaExclamationTriangle className="text-lg" />
                        <p className="text-xs font-semibold">{error}</p>
                      </div>
                    </td>
                  </tr>
                ) : users.length > 0 ? (
                  users.map((user, index) => {
                    const initials = user.name && user.name !== 'N/A' 
                      ? user.name.charAt(0).toUpperCase() 
                      : '?';

                    const isBlocked = user.status === 'blocked';
                    const isBtnLoading = actionLoading[user._id];

                    return (
                      <tr 
                        key={user._id || index} 
                        className="hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="px-6 py-4 font-semibold text-white">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 font-bold border border-amber-500/20">
                              {initials}
                            </div>
                            <span>{user.name || 'N/A'}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-slate-300">
                          {user.email || 'N/A'}
                        </td>

                        <td className="px-6 py-4 text-slate-500 font-mono">
                          <div className="flex items-center gap-1.5 bg-slate-950/50 px-2.5 py-1 rounded-md border border-slate-800/50 w-fit">
                            <FaLock className="text-[10px] text-slate-600" />
                            <span>{user.password ? '••••••••' : 'N/A'}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          {isBlocked ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-400"></span>
                              Blocked
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                              Active
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleToggleBlock(user._id)}
                            disabled={isBtnLoading}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 disabled:opacity-50 cursor-pointer ${
                              isBlocked
                                ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {isBtnLoading ? (
                              <FaSync className="animate-spin text-xs" />
                            ) : isBlocked ? (
                              <>
                                <FaCheckCircle className="text-xs" />
                                <span>Unblock</span>
                              </>
                            ) : (
                              <>
                                <FaBan className="text-xs" />
                                <span>Block</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                      No accounts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Dynamic Pagination Bar */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-950/50 border-t border-slate-800/80">
              <p className="text-xs text-slate-400">
                Page <span className="font-bold text-white">{currentPage}</span> of{' '}
                <span className="font-bold text-white">{totalPages}</span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  title="Previous Page"
                >
                  <FaChevronLeft className="text-xs" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      currentPage === page
                        ? 'bg-amber-500 text-slate-950 font-extrabold'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  title="Next Page"
                >
                  <FaChevronRight className="text-xs" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default UserDetails;