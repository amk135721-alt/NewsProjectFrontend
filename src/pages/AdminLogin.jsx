import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '' // Changed key name from 'pass' to 'password'
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await axios.post('https://newsprojectbackend.onrender.com/api/adminlogin', formData);

      // Verify explicit success flag from backend
      if (res.data && res.data.success) {
        navigate('/admin');
      } else {
        // Display authentication failure error message
        setErrorMsg(res.data?.message || 'Invalid email or password.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg(
        err.response?.data?.message || 'Failed to authenticate. Please check your connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        /* Floating Blob Keyframes */
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(80px, -60px) scale(1.2); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-70px, 70px) scale(1.25); }
        }
        /* Grid Pulse Keyframes */
        @keyframes grid-pulse {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.35; }
        }
        /* Slow Rotation for Glowing Ring */
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-blob-1 { animation: float-slow 16s ease-in-out infinite; }
        .animate-blob-2 { animation: float-reverse 20s ease-in-out infinite; }
        .animate-grid { animation: grid-pulse 8s ease-in-out infinite; }
        .animate-spin-ring { animation: spin-slow 35s linear infinite; }
      `}</style>

      <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden px-4 selection:bg-cyan-500 selection:text-white">
        {/* Background Animation Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950 pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] animate-grid pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-cyan-500/10 border-dashed animate-spin-ring pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] rounded-full border border-indigo-500/10 pointer-events-none" />
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-600/30 to-purple-600/20 rounded-full blur-[140px] pointer-events-none animate-blob-1" />
        <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/25 to-blue-600/20 rounded-full blur-[140px] pointer-events-none animate-blob-2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/15 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(2,6,23,0.8)] pointer-events-none" />

        {/* Login Card */}
        <div className="relative z-10 w-full max-w-md bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] p-8 md:p-10 transition-all duration-300 hover:border-white/20 hover:shadow-[0_25px_60px_-10px_rgba(6,182,212,0.15)]">
          <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200 tracking-tight">
              ADMIN LOGIN
            </h1>
            <p className="text-slate-400 text-sm mt-2 font-medium">
              Enter your credentials to LOGIN
            </p>
          </div>

          {/* Error Alert Display */}
          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold text-center">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-slate-200 text-sm font-semibold tracking-wide">
                Email
              </label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white placeholder-slate-500 focus:bg-slate-950/90 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all duration-300 shadow-inner"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-slate-200 text-sm font-semibold tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white placeholder-slate-500 focus:bg-slate-950/90 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all duration-300 shadow-inner"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-950/50 hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer tracking-wider disabled:opacity-50"
            >
              {loading ? 'SUBMITTING...' : 'SUBMIT'}
            </button>

            {/* Back Button */}
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="group inline-flex items-center gap-2 px-5 py-2.5 bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-sm rounded-xl border border-slate-700/80 hover:border-slate-500 shadow-md transition-all duration-200 active:scale-95"
              >
                <svg className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;