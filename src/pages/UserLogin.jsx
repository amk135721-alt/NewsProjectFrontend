import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserLogin = () => {
  const navigate = useNavigate();
  const [data, setdata] = useState({
    email: '',
    password: '',
  });

  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setdata({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const res = await axios.post('https://newsprojectbackend.onrender.com/api/userlogin', data);
      if (res.data.status === 'blocked') {
        navigate('/');
        return;
      }

      if (res.data.success === false) {
        setErrorMsg(res.data.message || 'Invalid email or password.');
        return;
      }

      console.log('Login successful:', res.data.token);
      localStorage.setItem('token', res.data.token);
      navigate('/news');
    } catch (error) {
      console.error(error);
      setErrorMsg(
        error.response?.data?.message || 'Login failed. Invalid email or password.'
      );
    }
  };

  return (
    <>
      {/* Container with Newspaper Print Background */}
      <div 
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2000&auto=format&fit=crop')`
        }}
      >
        {/* White Header Banner */}
        <header className="absolute top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-md">
          <div className="w-28 hidden md:block"></div>
          <h2 className="text-3xl md:text-5xl font-black tracking-widest text-slate-900 uppercase text-center flex-1 font-serif">
            THE DIGITAL NEWS
          </h2>
        </header>

        {/* Dark Slate Login Card */}
        <div className="relative z-10 w-full max-w-md bg-slate-900/90 border border-slate-700/80 rounded-3xl shadow-2xl p-8 md:p-10 mt-16 backdrop-blur-xl">
          <h1 className="text-4xl font-black text-center text-white mb-2 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-center text-slate-400 mb-8 font-medium text-sm">
            Login to access your feed
          </p>

          {errorMsg && (
            <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-center text-sm font-semibold">
              {errorMsg}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-slate-300 text-sm font-bold mb-2">
                Email Address
              </label>
              <input
                className="w-full px-4 py-3.5 rounded-xl bg-slate-800/80 text-white placeholder-slate-500 border border-slate-700 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 outline-none transition duration-200 text-sm font-medium"
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                placeholder="email"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-bold mb-2">
                Password
              </label>
              <input
                className="w-full px-4 py-3.5 rounded-xl bg-slate-800/80 text-white placeholder-slate-500 border border-slate-700 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 outline-none transition duration-200 text-sm font-medium"
                type="password"
                name="password"
                value={data.password}
                onChange={handleChange}
                placeholder="password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm transition duration-200 shadow-lg shadow-cyan-600/30"
            >
              LOG IN
            </button>

            <p className="text-center text-slate-400 text-sm font-medium pt-2">
              Don't have an account?{" "}
              <a
                href="/userregister"
                className="text-cyan-400 hover:text-cyan-300 hover:underline font-bold ml-1"
              >
                Register here
              </a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default UserLogin;