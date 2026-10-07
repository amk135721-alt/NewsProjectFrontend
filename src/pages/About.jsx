import React, { useState } from 'react'
import {
  FaShieldAlt,
  FaUserLock,
  FaClipboardList,
  FaDatabase,
  FaExternalLinkAlt,
  FaTerminal,
  FaUserGraduate,
  FaServer,
  FaLayerGroup
} from "react-icons/fa";

const About = () => {
  const [imgError, setImgError] = useState(false);

  return (
    <>
      {/* Blueprint Grid + Neon Sweep Animations */}
      <style>{`
        .bg-cyber-grid {
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(1000%); }
        }
        .animate-scan {
          animation: scanline 8s linear infinite;
        }
      `}</style>

      <div className="relative min-h-screen bg-neutral-950 bg-cyber-grid text-slate-100 py-16 px-4 sm:px-8 flex items-center justify-center overflow-hidden font-sans">

        {/* Top Floating Glow Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent blur-[1px]" />

        {/* Subtle Scanline Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none animate-scan" />

        {/* Main Content Container */}
        <div className="relative z-10 w-full max-w-5xl">
          <button className='w-20  h-8 rounded-2xl bg-red-600'><a href="/news">GO BACK</a></button>
          {/* Header Dashboard Banner */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-8 mb-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 text-cyan-400 pointer-events-none">
              <FaTerminal className="text-9xl" />
            </div>

            <div className="flex items-center gap-3 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-widest mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping inline-block" />
              <span>System Architecture & Documentation</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
              Project Specification
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
              Comprehensive overview of the Express.js management system, authentication pipeline, and content moderation infrastructure.
            </p>
          </div>

          {/* Grid Layout (Bento Style) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Banner Card - Spans 3 columns */}
            <div className="md:col-span-3 relative h-72 rounded-2xl overflow-hidden border border-neutral-800 group shadow-xl">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhbfvtUMr1dyNqsx2OXO88Alj_QlWIk5wlAa7DDxi3fQ&s=10"
                alt="Project Overview"
                className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition duration-700 opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold tracking-wider">
                    <FaServer /> Node.js / Express.js Backend
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
                    News Publishing & Administration Portal
                  </h2>
                </div>
              </div>
            </div>

            {/* Section 1: Domain & Purpose - Spans 3 columns */}
            <div className="md:col-span-3 bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 transition rounded-2xl p-6 sm:p-8 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-neutral-800 rounded-xl text-cyan-400 border border-neutral-700">
                  <FaLayerGroup />
                </div>
                <h2 className="text-xl font-bold text-white tracking-wide">
                  1. Project Domain & Purpose
                </h2>
              </div>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                This backend architecture powers secure administrator operations, user access control, and platform monitoring. It supports news publication, category filtering, user engagement, and administrative oversight to audit and moderate reported submissions.
              </p>
            </div>

            {/* Section 2 Title Card */}
            <div className="md:col-span-3 mt-2">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="w-3 h-3 bg-cyan-500 rounded-sm inline-block" />
                2. Controller Infrastructure Breakdown
              </h2>
            </div>

            {/* Controller A */}
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 hover:border-cyan-500/40 transition duration-300 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-lg mb-4">
                  <FaUserLock />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  createAdmin
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-800 text-slate-400 border border-neutral-700 inline-block mb-3">
                  Admin Registration
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Processes user creation, checks existing records, and hashes credentials using <code className="text-cyan-400 bg-neutral-800 px-1 py-0.5 rounded">bcrypt</code> (10 salt rounds) before storing in MongoDB.
                </p>
              </div>
            </div>

            {/* Controller B */}
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 hover:border-cyan-500/40 transition duration-300 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-lg mb-4">
                  <FaShieldAlt />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  adminLogin
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-800 text-slate-400 border border-neutral-700 inline-block mb-3">
                  Authentication
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Authenticates admins via email, validates passwords through <code className="text-cyan-400 bg-neutral-800 px-1 py-0.5 rounded">bcrypt.compare</code>, and generates JWT session tokens.
                </p>
              </div>
            </div>

            {/* Controller C */}
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 hover:border-cyan-500/40 transition duration-300 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-lg mb-4">
                  <FaClipboardList />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  viewReport
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-800 text-slate-400 border border-neutral-700 inline-block mb-3">
                  Report Monitoring
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Queries <code className="text-cyan-400 bg-neutral-800 px-1 py-0.5 rounded">reportModel</code> to fetch user-flagged items for administrator inspection.
                </p>
              </div>
            </div>

            {/* Section 3: Database Models - Spans 3 columns */}
            <div className="md:col-span-3 bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 transition rounded-2xl p-6 sm:p-8 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-neutral-800 rounded-xl text-cyan-400 border border-neutral-700">
                  <FaDatabase />
                </div>
                <h2 className="text-xl font-bold text-white tracking-wide">
                  3. Database Models & Schema
                </h2>
              </div>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                MongoDB schemas manage collection structures for Admin identities, user interaction logs, news post entries, and moderation ticket queues.
              </p>
            </div>

          </div>

          {/* Footer Metadata */}
          <div className="mt-8 pt-6 border-t border-neutral-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
            <div className=" items-center gap-3 bg-neutral-900 px-4 py-2.5 rounded-xl border border-neutral-800">
              <FaUserGraduate className="text-cyan-400 gap-3" />
              <span className="text-slate-400 ">Developer:</span>
              <span className="font-bold text-white">Adithya </span>
              

   
            </div>
           

            {/* Organization with White High-Contrast Logo Badge */}
            <div className="flex items-center gap-3 bg-neutral-900 px-4 py-2.5 rounded-xl border border-neutral-800">
              <div className="w-25 h-25 bg-white rounded-lg p-1.5 flex items-center justify-center border border-slate-200 shadow-sm overflow-hidden">

                <img
                  src="https://www.codelabsystems.in/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flight.983cd8c7.png&w=640&q=75"
                  alt="Code Lab System Logo"
                  className="w-full h-full object-contain"

                />



              </div>
              <span className="text-slate-400">Organization:</span>
              <a
                href="https://www.codelabsystems.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-cyan-400 hover:text-cyan-300 transition flex items-center gap-1.5 hover:underline"
              >
                Code Lab System <FaExternalLinkAlt className="text-xs" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default About