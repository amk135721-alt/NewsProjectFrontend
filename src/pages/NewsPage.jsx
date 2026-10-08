import React, { useState, useEffect } from 'react';
import {
  FaSearch,
  FaRegClock,
  FaMapMarkerAlt,
  FaArrowRight,
  FaRegNewspaper,
  FaStar,
  FaGlobe
} from "react-icons/fa";
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


// Import Swiper React components & styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from "gsap";
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(useGSAP, ScrollTrigger)


const NewsPage = () => {

  const containerRef = useRef();
  const colRef = useRef(null);
  const textRef = useRef(null);
  const colRef1 = useRef(null);

  useGSAP(() => {
    gsap.to(colRef.current, {
      x: 725,
      y: 0,
      duration: 2,
      scale: 1,

    });
    gsap.from(textRef.current, {
      x: 1455,
      y: 0,
      duration: 2,
      scale: 1.1,

    })
     gsap.to(textRef.current, {
      x: 900,
      y: 0,
      duration: 2,
      scale: 1.1,

    })
    
  gsap.fromTo(
  colRef1.current,
  {
    x: 1455,
    y: 0,
    scale: 1.1,
  },
  {
    x: -1455,
    y: 0,
    duration: 12, // Higher number = slower movement
    ease: "none",  // Keeps the speed completely steady throughout
    repeat: -1,    // Infinite loop
  }
);
  },)
  const nav = useNavigate();
  const [data, setdata] = useState([]);
  const [data2, setdata2] = useState([]);
  const [high, sethigh] = useState([]);
    const [head, sethighhead] = useState([]);
       const [loc, sethighloc] = useState([]);

  const [selectedLocation, setSelectedLocation] = useState("Karnataka");
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [count, setcount] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;

  // Helper function to handle logout
  const performLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("selectedNewsId");
    nav("/");
  };

  const handleincreament = () => {
    setcount(prev => (prev < totalPages ? prev + 1 : prev));
  };

  const handledecrement = () => {
    setcount(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
    setcount(1);
  };

  const handleSearchLocation = () => {
    nav('/find', { state: { location: selectedLocation } });
  };

  const handleReadMore = (id) => {
    if (id) {
      localStorage.setItem("selectedNewsId", id);
    }
    nav('/readmore');
  };

  // 1. Proactive JWT Expiration Check & Timer
  useEffect(() => {




    const token = localStorage.getItem("token");

    if (!token) {
      performLogout();
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      // Check if already expired
      if (decoded.exp && decoded.exp < currentTime) {
        performLogout();
        return;
      }

      // Set timeout for exact expiration moment
      if (decoded.exp) {
        const timeRemaining = (decoded.exp - currentTime) * 1000;
        const logoutTimer = setTimeout(() => {
          performLogout();
        }, timeRemaining);

        return () => clearTimeout(logoutTimer);
      }
    } catch (err) {
      console.error("Invalid token format:", err);
      performLogout();
    }
  }, [nav]);

  // 2. Global Axios Response Interceptor for 401/403 Expiration Statuses
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          performLogout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [nav]);

  // Check user account status
  const getUserStatus = async () => {
    const tkn = localStorage.getItem("token");
    if (!tkn) {
      performLogout();
      return;
    }

    try {
      const res = await axios.post(
        `https://newsprojectbackend.onrender.com/api/getbyuserid`,
        {},
        {
          headers: {
            token: tkn,
          },
        }
      );

      if (res.data?.data?.status === "blocked") {
        performLogout();
      }

    } catch (err) {
      console.error("Error fetching user status:", err);
    }
  };

  useEffect(() => {
    getUserStatus();
  }, []);

  // Fetch Highlights
  useEffect(() => {
    axios.get("https://newsprojectbackend.onrender.com/api/highlights")
      .then((res) => {
        const newsArray2 = Array.isArray(res.data)
          ? res.data
          : res.data.news || res.data.data || [];
        setdata2(newsArray2);
      })
      .catch((error) => {
        console.error("Error fetching highlights:", error);
      });
  }, []);


  useEffect(() => {
    axios.get("https://newsprojectbackend.onrender.com/api/onehighlight")
      .then((res) => {
        const newsArray3 = Array.isArray(res.data)
          ? res.data
          : res.data.news || res.data.data || [];
        sethigh(res.data.data.pic)
        console.log(res.data.data)
        sethighhead(res.data.data.newsheadline)
         sethighloc(res.data.data.location)
        console.log(res.data.data.pic);

      })
      .catch((error) => {
        console.error("Error fetching highlights:", error);
      });
  }, []);

  // Fetch Main News
  useEffect(() => {
    setLoading(true);
    axios.get("https://newsprojectbackend.onrender.com/api/getallnews", {
      params: {
        page: count,
        limit: limit,
      },
    })
      .then((res) => {
        const newsArray = Array.isArray(res.data)
          ? res.data
          : res.data.news || res.data.data || [];
        setdata(newsArray);

        if (res.data.totalPages) {
          setTotalPages(res.data.totalPages);
        } else if (res.data.totalCount) {
          setTotalPages(Math.ceil(res.data.totalCount / limit));
        } else {
          setTotalPages(newsArray.length === limit ? count + 1 : count);
        }
      })
      .catch((error) => {
        console.error("Error fetching news:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [count]);

  return (
    <>
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -20px) scale(1.08); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-20px, 30px) scale(1.1); }
        }
        .animate-blob-1 { animation: float-slow 16s ease-in-out infinite; }
        .animate-blob-2 { animation: float-reverse 18s ease-in-out infinite; }

        .swiper-pagination-bullet {
          background: #fda4af !important;
          opacity: 0.6;
        }
        .swiper-pagination-bullet-active {
          background: #9f1239 !important;
          width: 20px !important;
          border-radius: 6px !important;
          opacity: 1;
        }
      `}</style>

      {/* Main Container */}
      <div className="w-screen min-h-screen overflow-x-hidden bg-gradient-to-br from-[#FFF8F8] via-[#FFF5F5] to-[#FFF0F0] text-rose-950 flex flex-col justify-between font-sans selection:bg-rose-900 selection:text-white">

        {/* Header */}
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-rose-100/80 shadow-xs transition-all">
          <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-gradient-to-tr from-rose-950 to-rose-800 p-2.5 rounded-2xl shadow-md text-white group-hover:scale-105 transition-all duration-300">
                <FaRegNewspaper className="text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-serif font-black text-rose-950 tracking-tight leading-none">
                  DIGITAL NEWS
                </h1>
                <p className="text-rose-500 text-[9px] font-bold tracking-widest uppercase mt-0.5">
                  Global Insights & Editorial Updates
                </p>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 font-serif text-xs font-bold text-rose-900/80 bg-rose-50/50 p-1.5 rounded-full border border-rose-100">
              <Link to="/political" className="px-3 py-1.5 rounded-full hover:bg-white hover:text-rose-950 hover:shadow-xs transition duration-200">Political</Link>
              <Link to="/sports" className="px-3 py-1.5 rounded-full hover:bg-white hover:text-rose-950 hover:shadow-xs transition duration-200">Sports</Link>
              <Link to="/science" className="px-3 py-1.5 rounded-full hover:bg-white hover:text-rose-950 hover:shadow-xs transition duration-200">Science</Link>
              <Link to="/tech" className="px-3 py-1.5 rounded-full hover:bg-white hover:text-rose-950 hover:shadow-xs transition duration-200">Technology</Link>
              <Link to="/social" className="px-3 py-1.5 rounded-full hover:bg-white hover:text-rose-950 hover:shadow-xs transition duration-200">Social</Link>
              <Link to="/about" className="px-3 py-1.5 rounded-full hover:bg-white hover:text-rose-950 hover:shadow-xs transition duration-200">About</Link>
            </nav>

            {/* Location Selector & Logout */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-xl bg-white border border-rose-200/80 p-1 shadow-sm hover:border-rose-300 focus-within:ring-2 focus-within:ring-rose-400/20 transition">
                <FaGlobe className="text-rose-400 text-xs ml-2.5" />
                <select
                  value={selectedLocation}
                  onChange={handleLocationChange}
                  className="bg-transparent text-rose-950 text-xs font-serif font-bold px-2 py-1 outline-none cursor-pointer"
                >
                  <option value="Karnataka">Karnataka</option>
                  <option value="Goa">Goa</option>
                  <option value="TamilNadu">Tamil Nadu</option>
                  <option value="Kerala">Kerala</option>
                </select>

                <button
                  onClick={handleSearchLocation}
                  className="bg-rose-900 hover:bg-rose-950 p-2 rounded-lg text-white font-bold transition active:scale-90 shadow-sm cursor-pointer"
                  title="Search location"
                >
                  <FaSearch className="text-xs" />
                </button>
              </div>

              <button
                onClick={performLogout}
                className="w-20 bg-rose-900 hover:bg-rose-950 py-2 text-center rounded text-white font-bold text-xs transition active:scale-95 shadow-sm cursor-pointer"
              >
                LOGOUT
              </button>
            </div>

          </div>
        </header>

        {/* Main Content */}
        <main className="relative flex-1 w-full max-w-[1920px] mx-auto px-4 sm:px-8 py-6 overflow-hidden">




          {(() => {
             // Accesses the single/first item directly

            const imageUrl =`https://res.cloudinary.com/c39rbbrm/image/upload/${high}`
             

            return (
              <div className="w-[100%] h-100 mb-10">
                <div ref={colRef}>
                  <img
                    src={imageUrl}
                    alt={ "Highlight"}
                    className="w-100 h-100 rounded-2xl"
                    onError={(e) => {
                      
                        e.target.src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop";
                      
                    }}
                  />
                  
              
                </div>

                <div ref={colRef1}>
                  <h3 className="font-serif  text-3xl font-bold line-clamp-3 leading-snug group-hover:text-rose-200 transition">
                    {head}
                  </h3>
                </div>

                <div ref={textRef}>
                  <h3 className="font-serif  font-bold text-4xl line-clamp-3 leading-snug group-hover:text-rose-200 transition">
                    {loc}
                  </h3>
                </div>
              </div>
            );
          })()}

<br /><br /> <br /><br /><br />
          <div className="absolute top-0 -left-20 w-80 h-80 bg-rose-200/40 rounded-full blur-[100px] pointer-events-none animate-blob-1" />
          <div className="absolute bottom-10 -right-20 w-80 h-80 bg-pink-200/30 rounded-full blur-[100px] pointer-events-none animate-blob-2" />

          {/* Featured Highlights Carousel */}
          {data2 && data2.length > 0 && (
            <section className="relative z-10 mb-8">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-rose-100 rounded-lg text-rose-900">
                  <FaStar className="text-xs" />
                </div>
                <h2 className="font-serif text-sm font-black text-rose-950 uppercase tracking-widest">
                  Featured Highlights
                </h2>
              </div>

              <Swiper
                spaceBetween={20}
                slidesPerView={1}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1280: { slidesPerView: 3 },
                  1600: { slidesPerView: 4 },
                }}
                modules={[Autoplay, Pagination, Navigation]}
                className="pb-10"
              >
                {data2.map((item, index) => {
                  const imageUrl = item.pic
                    ? (item.pic.startsWith('http') ? item.pic : `https://res.cloudinary.com/c39rbbrm/image/upload/${item.pic}`)
                    : "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop";

                  return (
                    <SwiperSlide key={item._id || index}>
                      <div
                        onClick={() => handleReadMore(item._id)}
                        className="group relative h-64 rounded-2xl overflow-hidden border border-rose-200/60 bg-rose-950 flex flex-col justify-end p-5 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                      >
                        <img

                          src={imageUrl}
                          alt={item.newsheadline || "Highlight"}
                          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                          onError={(e) => {
                            if (item.pic && !e.target.dataset.triedFallback) {
                              e.target.dataset.triedFallback = "true";
                              e.target.src = `https://res.cloudinary.com/c39rbbrm/image/upload/${item.pic}`;
                            } else {
                              e.target.src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop";
                            }
                          }}
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-black/40 to-transparent z-0" />

                        <div className="relative z-10 flex flex-col gap-2 text-white">
                          <div className="flex items-center justify-between text-[10px] font-serif uppercase tracking-wider text-rose-300">
                            <span className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                              <FaMapMarkerAlt className="text-rose-400" /> {item.location || "Global"}
                            </span>
                            <span className="bg-rose-800/90 text-white px-2 py-0.5 rounded-md font-bold text-[9px] tracking-wider">
                              HIGHLIGHT
                            </span>
                          </div>
                          <h3 className="font-serif text-base font-bold line-clamp-3 leading-snug group-hover:text-rose-200 transition">
                            {item.newsheadline || "Untitled Highlight"}
                          </h3>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </section>
          )}

          {/* Latest News Header */}
          <div className="relative z-10 flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-5 bg-rose-900 rounded-full" />
              <h2 className="font-serif text-lg font-black text-rose-950 uppercase tracking-wider">
                Latest News
              </h2>
            </div>
            <span className="text-xs font-serif text-rose-700/70 font-bold">
              Showing Page {count} of {totalPages} ({data.length} Dispatches)
            </span>
          </div>

          <hr className="relative z-10 border-t border-rose-200/80 mb-6" />

          {/* Articles Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
              <div className="w-9 h-9 border-3 border-rose-900 border-t-transparent rounded-full animate-spin" />
              <p className="text-rose-800/70 font-serif text-xs font-medium tracking-wide">Retrieving latest news...</p>
            </div>
          ) : data && data.length > 0 ? (
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data.map((item, index) => (
                <article
                  key={item._id || index}
                  className="group relative flex flex-col h-[400px] bg-white border border-rose-100 rounded-2xl overflow-hidden hover:border-rose-300 hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-rose-50 border-b border-rose-100 flex-shrink-0">
                    <img
                      src={item.pic ? `https://res.cloudinary.com/c39rbbrm/image/upload/${item.pic}` : "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop"}
                      alt={item.newsheadline || "News"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop";
                      }}
                    />

                    <span className="absolute top-3 left-3 bg-rose-950/90 backdrop-blur-md text-white text-[9px] font-serif font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm border border-white/10">
                      {item.newstype || "General"}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col flex-1 justify-between gap-3 bg-gradient-to-b from-white to-rose-50/30">
                    <div>
                      <div className="flex items-center justify-between font-serif text-[11px] font-semibold text-rose-500 mb-2">
                        <span className="flex items-center gap-1 text-rose-800">
                          <FaMapMarkerAlt className="text-rose-600" />
                          {item.location || "Global"}
                        </span>
                        <span className="flex items-center gap-1 text-rose-400">
                          <FaRegClock className="text-[10px]" />
                          {item.date ? new Date(item.date).toLocaleDateString() : new Date().toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="font-serif text-base font-bold text-rose-950 group-hover:text-rose-800 transition-colors duration-200 line-clamp-3 leading-snug">
                        {item.newsheadline || "Untitled Headline"}
                      </h3>
                    </div>

                    <div className="pt-3 border-t border-rose-100/80 flex items-center justify-end">
                      <button
                        onClick={() => handleReadMore(item._id)}
                        className="inline-flex items-center gap-1.5 font-serif text-xs font-black text-rose-900 hover:text-rose-950 transition group-hover:translate-x-1 duration-200 cursor-pointer"
                      >
                        <span>Read Full Story</span>
                        <FaArrowRight className="text-[10px]" />
                      </button>
                    </div>

                  </div>
                </article>
              ))}
            </div>

          ) : (
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[40vh] text-center p-8 bg-white/80 backdrop-blur-md rounded-2xl border border-rose-200/80 shadow-xs">
              <FaRegNewspaper className="text-4xl text-rose-200 mb-3" />
              <h3 className="font-serif text-lg font-bold text-rose-950">No News Available</h3>
              <p className="font-serif text-rose-700/70 text-xs mt-1 max-w-xs">
                There are currently no articles reported for this section. Try choosing a different location above.
              </p>
            </div>
          )}

          {/* Pagination Controls */}
          <div className="w-full flex items-center justify-center mt-8 gap-3">
            <button
              className="text-rose-950 text-sm font-bold w-9 h-9 rounded-lg bg-amber-300 hover:bg-amber-400 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center shadow-xs cursor-pointer"
              disabled={count === 1}
              onClick={handledecrement}
              title="Previous Page"
            >
              -
            </button>

            <span className="text-xs font-serif font-bold px-4 py-2 bg-white rounded-lg border border-rose-100 shadow-xs text-rose-950">
              Page {count} of {totalPages}
            </span>

            <button
              className="text-rose-950 text-sm font-bold w-9 h-9 rounded-lg bg-amber-300 hover:bg-amber-400 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center shadow-xs cursor-pointer"
              disabled={count >= totalPages}
              onClick={handleincreament}
              title="Next Page"
            >
              +
            </button>
          </div>

        </main>

        {/* Footer */}
        <footer className="relative z-10 w-full border-t border-rose-100 bg-white/80 backdrop-blur-md mt-10">
          <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-serif text-rose-800/80">
            <p>© {new Date().getFullYear()} Digital News Portal. All rights reserved.</p>
            <div className="flex gap-5 font-semibold">
              <Link to="/about" className="hover:text-rose-950 transition">About Us</Link>
              <Link to="/privacy" className="hover:text-rose-950 transition">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-rose-950 transition">Terms of Service</Link>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
};

export default NewsPage;