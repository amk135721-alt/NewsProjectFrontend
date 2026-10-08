import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaRegClock, FaFlag, FaArrowLeft, FaShareAlt, FaTimes, FaComments, FaUser } from "react-icons/fa";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const ReadMore = () => {
  const navigate = useNavigate();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Comment Modal & Form State
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // Inline Comments State
  const [commentsList, setCommentsList] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  // Retrieve storage data
  const id = localStorage.getItem('selectedNewsId');
  const token = localStorage.getItem('token');

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) {
      alert('Please enter a comment.');
      return;
    }

    if (!token) {
      alert('Please log in first to submit a comment.');
      return;
    }

    setSubmittingComment(true);

    try {
      const res = await axios.post(
        'https://newsprojectbackend.onrender.com/api/create-comment',
        {
          comments: commentText,
          postid: id,
        },
        {
          headers: {
            userid: token,
            token: token,
            Authorization: `Bearer ${token}`
          },
        }
      );

      if (res.data.success || res.status === 200) {
        alert('Comment posted successfully!');
        setCommentText('');
        setIsCommentOpen(false);
        if (showComments) {
          fetchComments();
        }
      } else {
        alert(res.data.message || 'Failed to post comment.');
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert(error.response?.data?.message || 'Error submitting comment. Check server console.');
    } finally {
      setSubmittingComment(false);
    }
  };

  // Fetch comments directly by postid param
  const fetchComments = async () => {
    if (!id) return;
    setLoadingComments(true);
    try {
      const res = await axios.get(`https://newsprojectbackend.onrender.com/api/viewcomment/${id}`);

      const rawData = res.data.data || res.data || [];
      // Ensure comments is always an array
      const postComments = Array.isArray(rawData) ? rawData : [rawData];

      setCommentsList(postComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      alert('Failed to load comments.');
    } finally {
      setLoadingComments(false);
    }
  };

  // Toggle comments section visibility
  const handleToggleComments = () => {
    if (!showComments) {
      fetchComments();
    }
    setShowComments(!showComments);
  };

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    axios.get(`https://newsprojectbackend.onrender.com/api/readmore/${id}`)
      .then((res) => {
        const item = res.data.data || res.data;
        setNewsItem(item);
      })
      .catch((error) => {
        console.error("Error fetching news:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: newsItem?.newsheadline || 'News Article',
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Article link copied to clipboard!");
    }
  };

  // Helper function to extract user name cleanly regardless of object structure
  const getUserName = (userid) => {
    if (!userid) return 'Anonymous User';
    if (typeof userid === 'object') {
      if (Array.isArray(userid) && userid.length > 0) {
        return userid[0].name || userid[0].username || 'Anonymous User';
      }
      return userid.name || userid.username || 'Anonymous User';
    }
    return String(userid);
  };

  return (
    <div className="relative min-h-screen w-full bg-pink-50/70 text-slate-800 flex flex-col justify-between overflow-x-hidden font-sans">

      {/* Light Pink Soft Ambient Glowing Bulbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-pink-200/60 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-rose-200/50 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-pink-300/30 rounded-full blur-[150px] pointer-events-none" />

      {/* Main Full-Width Container */}
      <main className="relative z-10 w-full min-h-screen flex flex-col justify-between">
        {loading ? (
          <div className="flex flex-col items-center justify-center my-auto space-y-4 py-24">
            <div className="w-12 h-12 border-4 border-pink-400/30 border-t-pink-600 rounded-full animate-spin" />
            <p className="text-pink-600 font-medium tracking-wide text-sm animate-pulse">Loading article details...</p>
          </div>
        ) : newsItem ? (
          <article className="w-full bg-white/90 backdrop-blur-xl border-b border-pink-100 shadow-sm flex-1 flex flex-col">

            {/* Header Navigation Bar */}
            <div className="px-4 sm:px-10 md:px-16 lg:px-24 py-3 sm:py-4 border-b border-pink-100 flex items-center justify-between bg-pink-50/40">
              <button
                onClick={() => navigate(-1)}
                className="group flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-pink-600 transition-colors duration-200"
              >
                <FaArrowLeft className="text-xs group-hover:-translate-x-1 transition-transform duration-200" /> Back to News
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-pink-600 bg-pink-100/60 hover:bg-pink-100 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-pink-200/60 transition-all duration-200"
              >
                <FaShareAlt className="text-xs text-pink-500" /> Share
              </button>
            </div>

            {/* Full-Width Media Banner Section */}
            <div className="relative group w-full overflow-hidden">
              <img
                src={newsItem.pic ? `https://res.cloudinary.com/c39rbbrm/image/upload/${newsItem.pic}` : "https://via.placeholder.com/800x400"}
                alt={newsItem.newsheadline || "News"}
                className="w-full h-56 sm:h-80 md:h-[420px] md:max-h-[50vh] lg:h-[580px] object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/30 to-transparent" />

              {/* Tag & Meta Badge Overlays */}
              <div className="absolute bottom-3 left-4 right-4 sm:bottom-6 sm:left-10 sm:right-10 md:left-16 md:right-16 lg:left-24 lg:right-24 flex items-center justify-between flex-wrap gap-2 sm:gap-3">
                <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] sm:text-xs font-extrabold tracking-wider px-3 py-1 sm:px-4 sm:py-2 rounded-full shadow-md uppercase">
                  {newsItem.newstype || "GLOBAL NEWS"}
                </span>

                <div className="flex items-center gap-2 sm:gap-4 text-[11px] sm:text-sm font-medium text-white bg-slate-900/60 backdrop-blur-md px-3 py-1 sm:px-4 sm:py-2 rounded-full border border-white/20">
                  <span className="flex items-center gap-1.5 text-pink-300">
                    <FaMapMarkerAlt className="text-[10px] sm:text-xs" /> {newsItem.location || "Global"}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="flex items-center gap-1.5 text-slate-200">
                    <FaRegClock className="text-[10px] sm:text-xs" /> {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="w-full p-10 justify-center items-center flex-1">

              {/* Headline */}
              <h1 className="text-xl  sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-snug md:leading-tight">
                {newsItem.newsheadline || "Untitled Headline"}
              </h1>

              {/* Accent Line */}
              <div className="h-px w-full p-6  to-transparent" />

              {/* Body */}
              <p className="text-slate-700 text-sm sm:text-lg md:text-xl lg:text-xl leading-relaxed md:leading-loose text-left font-normal whitespace-pre-line">
                {newsItem.newscontent || newsItem.newsdescription || "No detailed content available."}
              </p>

              {/* Action Footer */}
              <div className="flex flex-wrap gap-3 justify-between items-center pt-5 md:pt-8 border-t border-pink-100">
                <Link
                  to="/report"
                  className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-200/80 px-3.5 sm:px-5 py-2 sm:py-3 rounded-xl transition-all duration-200"
                >
                  <FaFlag className="text-xs" />
                  Report Issue
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCommentOpen(true)}
                    className="rounded-lg bg-amber-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-amber-800 active:scale-95 transition cursor-pointer"
                  >
                    COMMENT
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleComments}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-200 active:scale-95 transition cursor-pointer"
                  >
                    <FaComments className="text-xs text-amber-900" />
                    {showComments ? 'HIDE COMMENTS' : 'VIEW COMMENTS'}
                  </button>
                </div>
              </div>

              {/* Inline Comments Display Section */}
              {showComments && (
                <div className="mt-8 pt-6 border-t border-slate-200 space-y-4 animate-in fade-in duration-300">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <FaComments className="text-amber-900" />
                    Comments ({commentsList.length})
                  </h3>

                  {loadingComments ? (
                    <div className="py-6 text-center text-sm text-slate-500 animate-pulse">
                      Loading comments...
                    </div>
                  ) : commentsList.length > 0 ? (
                    <div className="space-y-3">
                      {commentsList.map((item, index) => (
                        <div
                          key={item._id || item.id || index}
                          className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex flex-col space-y-1"
                        >
                          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                            <FaUser className="text-slate-400" />
                            <span>{getUserName(item.userid)}</span>
                          </div>

                          <p className="text-sm text-slate-800 pt-1 leading-relaxed">
                            {item.comments || item.comment || 'No comment text'}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 bg-slate-50 rounded-xl text-center text-sm text-slate-500 border border-slate-200/60">
                      No comments on this article yet. Be the first to share your thoughts!
                    </div>
                  )}
                </div>
              )}

            </div>
          </article>
        ) : (
          <div className="text-center text-slate-600 py-16 my-auto bg-white/80 backdrop-blur-xl rounded-3xl border border-pink-100 shadow-xl max-w-md mx-4 sm:mx-auto">
            <p className="text-lg font-semibold text-slate-800">No news details found.</p>
            <p className="text-xs text-slate-500 mt-1">The requested article ID might be missing or invalid.</p>
            <Link to="/" className="mt-5 inline-block text-xs font-semibold text-pink-600 hover:text-pink-700 bg-pink-50 border border-pink-200 px-5 py-2.5 rounded-xl transition-colors">
              Return to Homepage
            </Link>
          </div>
        )}

        {/* Footer Navigation */}
        <footer className=" relative z-10 py-5 text-12 text-slate-500 text-center tracking-wide bg-pink-50/50 border-t border-pink-100">
          <Link to="/about" className="hover:text-pink-600 transition-colors duration-200">About Us</Link>
          <span className='mx-2'>•</span>
          <Link to="https://www.instagram.com/codelab_systems/" className='hover:text-pink-600 transition-colors duration-200'>Instagram</Link>
          <span className="mx-2">•</span>
          <span>© {new Date().getFullYear()} Digital News Portal</span>
        </footer>
      </main>

      {/* Comment Popup Modal */}
      {isCommentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-pink-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add a Comment</h3>
              <button
                type="button"
                onClick={() => setIsCommentOpen(true)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCommentSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                  Your Comment
                </label>
                <textarea
                  rows="4"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts on this article..."
                  required
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-800 bg-slate-50"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCommentOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingComment}
                  className="rounded-xl bg-amber-900 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-amber-800 active:scale-95 transition disabled:opacity-50 cursor-pointer"
                >
                  {submittingComment ? 'Submitting...' : 'Submit Comment'}
                </button>
              </div>
            </form>
            
          </div>
        </div>
      )}

    </div>
  );
};

export default ReadMore;