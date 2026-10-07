import React, { useState, useEffect } from 'react'
import { FaSearch, FaUserShield, FaNewspaper, FaMapMarkerAlt, FaRegClock, FaExclamationTriangle } from "react-icons/fa";
import axios from 'axios'

const Science = () => {
  const [data, setdata] = useState([])

  useEffect(() => {
    axios.get("http://localhost:5001/api/getbytype/Science")
      .then((res) => {
        const newsArray = Array.isArray(res.data)
          ? res.data
          : res.data.news || res.data.data || [];

        setdata(newsArray);
        console.log("Fetched news data:", res.data);
      })
      .catch((error) => {
        console.error("Error fetching news:", error);
      })
  }, [])

  return (
    <div className="relative min-h-screen bg-white font-sans text-slate-800 p-6 md:p-12 overflow-hidden flex flex-col items-center">

      {/* Background Glow Accent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-cyan-100/40 via-blue-100/30 to-slate-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container - Centered Maximized Card Layout */}
      <main className="relative z-10 w-full  mx-auto flex flex-col items-center gap-10 my-auto">
        {data && data.length > 0 ? (
          data.map((item, index) => (
            <article
              key={item._id || index}
              className="group relative w-full bg-white rounded-3xl border border-slate-200 shadow-[0_10px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.12)] hover:border-cyan-500/40 transition-all duration-300 overflow-hidden"
            >
              {/* Top Color Accent Line */}
              <div className="h-full w-full" />

              {/* Maximized Image Section */}
              <div className="relative h-full md:h-[400px] w-full overflow-hidden bg-slate-100">
                <img
                  src={`https://res.cloudinary.com/c39rbbrm/image/upload/${item.pic}`}
                  alt={item.newsheadline || "News headline image"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1507668077129-56e32842fceb?q=80&w=1200&auto=format&fit=crop";
                  }}
                />

                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Category Badge */}
                <span className="absolute top-5 left-5 bg-red-600 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
                  {item.newstype || "SCIENCE"}
                </span>

                {/* Location Overlay Badge */}
                <span className="absolute bottom-5 left-5 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md text-cyan-400 text-xs font-bold px-3.5 py-1.5 rounded-full">
                  <FaMapMarkerAlt className="text-red-500" />
                  {item.location || "National"}
                </span>
              </div>

              {/* Maximized Content Body */}
              <div className="p-8 md:p-10 flex flex-col gap-6">

                {/* Meta Bar */}
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span className="flex items-center gap-2 text-slate-500">
                    <FaRegClock className="text-slate-400" />
                    Published on {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="text-cyan-600 font-bold tracking-wider uppercase">Verified News</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-snug tracking-tight group-hover:text-cyan-600 transition-colors duration-200">
                  {item.newsheadline || "Science Update Headline"}
                </h1>

                {/* Full Article Text */}
                <p className="text-slate-600 text-base md:text-lg leading-relaxed font-normal text-justify">
                  {item.newscontent || "No detailed content provided for this news article."}
                </p>

                {/* Card Action Footer */}
                <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-2">
                  <span className="text-xs text-slate-400 font-medium">Digital News Editorial Board</span>
                  <a
                    href="/report"
                    className="flex items-center gap-2 border border-slate-200 bg-slate-50 hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-slate-700 px-5 py-2.5 rounded-xl text-xs font-bold transition duration-200"
                  >
                    <FaExclamationTriangle className="text-xs text-red-500" />
                    Report Article
                  </a>
                </div>

              </div>
            </article>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-8 bg-slate-50 border border-slate-200 rounded-3xl max-w-lg w-full text-center shadow-sm">
            <FaNewspaper className="text-5xl text-slate-400 mb-4" />
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">No Science Coverage Available</h3>
            <p className="text-sm text-slate-500">There are currently no science news reports published. Please check back later.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-4xl text-center pt-8 mt-12 border-t border-slate-200">
        <p className="text-xs text-slate-400 font-medium">
          © {new Date().getFullYear()} Digital News Portal • <a href="/about" className="text-slate-600 hover:underline font-semibold ml-1">About Us</a>
        </p>
      </footer>

    </div>
  )
}

export default Science