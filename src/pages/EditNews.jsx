import React, { useState, useEffect } from 'react';
import Sidebar from '../comp/Sidebar';
import {
  FaMapMarkerAlt,
  FaRegNewspaper,
  FaNewspaper,
  FaEdit,
  FaTrash,
  FaTimes,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";
import axios from 'axios';
import { Link } from 'react-router-dom';

const ManageNews = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal and Form States (for Editing)
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({
    newsheadline: '',
    newscontent: '',
    newstype: '',
    location: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Fetch all news articles on mount
  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = () => {
    setLoading(true);
    axios.get("http://localhost:5001/api/getallnews")
      .then((res) => {
        const newsArray = Array.isArray(res.data)
          ? res.data
          : res.data.news || res.data.data || [];
        setNewsList(newsArray);
      })
      .catch((error) => {
        console.error("Error fetching news:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Pagination Calculations
  const totalPages = Math.ceil(newsList.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNewsList = newsList.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Open modal with pre-filled article values
  const handleOpenEditModal = (item) => {
    setEditingNews(item);
    setFormData({
      newsheadline: item.newsheadline || '',
      newscontent: item.newscontent || '',
      newstype: item.newstype || '',
      location: item.location || ''
    });
    setSelectedFile(null);
  };

  // Close modal and reset file state
  const handleCloseModal = () => {
    setEditingNews(null);
    setSelectedFile(null);
  };

  // Handle text input changes inside modal
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit Update to Backend
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const payload = new FormData();
      payload.append("id", editingNews._id);
      payload.append("newsheadline", formData.newsheadline);
      payload.append("newscontent", formData.newscontent);
      payload.append("newstype", formData.newstype);
      payload.append("location", formData.location);

      if (selectedFile) {
        payload.append("pic", selectedFile);
      }

      const res = await axios.put("http://localhost:5001/api/edit", payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.success) {
        alert(res.data.message || "News article updated successfully!");
        handleCloseModal();
        fetchNews();
      } else {
        alert(res.data.message || "Failed to update news article");
      }
    } catch (error) {
      console.error("Error updating news:", error);
      alert(error.response?.data?.message || "Failed to update news article");
    } finally {
      setUpdating(false);
    }
  };

  // Delete Single News Handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this news article?")) return;

    try {
      await axios.delete(`http://localhost:5001/api/deletenews/${id}`);

      setNewsList((prevData) => {
        const updatedList = prevData.filter((item) => item._id !== id);
        const newTotalPages = Math.ceil(updatedList.length / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }
        return updatedList;
      });
    } catch (error) {
      console.error("Error deleting news:", error);
      alert("Failed to delete news article");
    }
  };

  // Delete All News Handler
  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete ALL news articles? This action cannot be undone.")) return;

    try {
      await axios.delete("http://localhost:5001/api/deleteallnews");
      setNewsList([]);
      setCurrentPage(1);
      alert("All news articles deleted successfully.");
    } catch (error) {
      console.error("Error deleting all news:", error);
      alert("Failed to delete all news articles");
    }
  };

  return (
    <>
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -30px) scale(1.1); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 40px) scale(1.15); }
        }
        .animate-blob-1 { animation: float-slow 14s ease-in-out infinite; }
        .animate-blob-2 { animation: float-reverse 16s ease-in-out infinite; }
      `}</style>

      <div className="flex">
        <Sidebar />

        <div className="min-h-screen bg-[#FFF8F8] text-rose-950 flex-1 flex flex-col justify-between font-sans">

          {/* Header */}
          <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-rose-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

              {/* Logo */}
              <Link to="/" className="flex items-center gap-3 group">
                <div className="bg-rose-900 p-2.5 rounded-2xl shadow-sm text-white group-hover:bg-rose-950 transition duration-300">
                  <FaRegNewspaper className="text-xl" />
                </div>
                <div>
                  <h1 className="text-2xl font-serif font-black text-rose-950 tracking-tight">
                    DIGITAL NEWS
                  </h1>
                  <p className="text-rose-500 text-[10px] font-bold tracking-widest uppercase">
                    Manage News
                  </p>
                </div>
              </Link>

              {/* Header Actions */}
              <div className="flex items-center gap-3">
                {newsList.length > 0 && (
                  <button
                    onClick={handleDeleteAll}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-serif uppercase tracking-wider font-semibold transition duration-300 shadow-sm active:scale-95 cursor-pointer"
                  >
                    <FaTrash />
                    <span>Delete All</span>
                  </button>
                )}
              </div>

            </div>
          </header>

          {/* Main Content */}
          <main className="relative flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 overflow-hidden">

            {/* Background Ambient Glow */}
            <div className="absolute top-10 -left-20 w-96 h-96 bg-rose-200/40 rounded-full blur-[120px] pointer-events-none animate-blob-1" />
            <div className="absolute bottom-10 -right-20 w-96 h-96 bg-pink-200/30 rounded-full blur-[120px] pointer-events-none animate-blob-2" />

            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-2">
                <FaNewspaper className="text-rose-800 text-base" />
                <h2 className="font-serif text-xl font-bold text-rose-950 uppercase tracking-wider">
                  Manage, Edit & Delete News
                </h2>
              </div>
              {newsList.length > 0 && (
                <span className="text-xs font-serif font-semibold text-rose-800 bg-rose-100 px-3 py-1 rounded-full">
                  Total: {newsList.length} Articles
                </span>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
                <div className="w-10 h-10 border-4 border-rose-800 border-t-transparent rounded-full animate-spin" />
                <p className="text-rose-800/70 font-serif text-sm font-medium italic">Fetching news articles...</p>
              </div>
            ) : newsList && newsList.length > 0 ? (
              <>
                <section className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentNewsList.map((item, index) => (
                    <div key={item._id || index} className="group relative h-72 rounded-2xl overflow-hidden shadow-md border border-rose-200 bg-rose-950 flex flex-col justify-end p-6">

                      {/* Background Image */}
                      <img
                        src={item.pic ? `https://res.cloudinary.com/c39rbbrm/image/upload/${item.pic}` : "https://via.placeholder.com/400x250"}
                        alt={item.newsheadline || "News"}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop";
                        }}
                      />

                      {/* Dark Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                      {/* Action Buttons: Edit (Left) and Delete (Right) */}
                      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="bg-rose-600 hover:bg-rose-700 text-white p-2.5 rounded-full shadow-lg transition duration-200 active:scale-90 cursor-pointer"
                          title="Edit News"
                        >
                          <FaEdit className="text-xs" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-full shadow-lg transition duration-200 active:scale-90 cursor-pointer"
                          title="Delete News"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>

                      {/* Content Overlay */}
                      <div className="relative z-10 flex flex-col gap-2 text-white">
                        <div className="flex items-center justify-between text-[11px] font-serif uppercase tracking-wider text-rose-300">
                          <span className="flex items-center gap-1">
                            <FaMapMarkerAlt /> {item.location || "Global"}
                          </span>
                          <span className="bg-rose-900/80 px-2 py-0.5 rounded text-[10px]">
                            {item.newstype || "GENERAL"}
                          </span>
                        </div>
                        <h3 className="font-serif text-lg font-bold line-clamp-2 leading-snug group-hover:text-rose-200 transition">
                          {item.newsheadline || "Untitled News"}
                        </h3>
                      </div>
                    </div>
                  ))}
                </section>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="relative z-10 flex items-center justify-between border-t border-rose-200 mt-8 pt-4">
                    <p className="text-xs font-serif text-rose-800">
                      Showing <span className="font-bold">{indexOfFirstItem + 1}</span> to{' '}
                      <span className="font-bold">{Math.min(indexOfLastItem, newsList.length)}</span> of{' '}
                      <span className="font-bold">{newsList.length}</span> articles
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 text-rose-900 hover:bg-rose-100 rounded-lg disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer disabled:cursor-not-allowed"
                        title="Previous Page"
                      >
                        <FaChevronLeft className="text-xs" />
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 rounded-lg text-xs font-serif font-bold transition cursor-pointer ${currentPage === page
                              ? 'bg-rose-900 text-white'
                              : 'text-rose-900 hover:bg-rose-100'
                            }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 text-rose-900 hover:bg-rose-100 rounded-lg disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer disabled:cursor-not-allowed"
                        title="Next Page"
                      >
                        <FaChevronRight className="text-xs" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="relative z-10 flex flex-col items-center justify-center min-h-[40vh] text-center p-8 bg-white rounded-2xl border border-rose-200 shadow-sm">
                <FaNewspaper className="text-5xl text-rose-200 mb-4" />
                <h3 className="font-serif text-xl font-bold text-rose-950">No News Found</h3>
                <p className="font-serif text-rose-700/70 text-sm mt-1 max-w-sm">
                  There are currently no news articles available to manage.
                </p>
              </div>
            )}
          </main>

          {/* Edit Modal */}
          {editingNews && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-rose-100 relative max-h-[90vh] overflow-y-auto">

                <div className="flex justify-between items-center mb-4 pb-2 border-b border-rose-100">
                  <h3 className="font-serif text-lg font-bold text-rose-950">Edit Article</h3>
                  <button onClick={handleCloseModal} className="text-rose-400 hover:text-rose-700 p-1">
                    <FaTimes />
                  </button>
                </div>

                <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-serif font-bold text-rose-900 mb-1">Headline</label>
                    <input
                      type="text"
                      name="newsheadline"
                      value={formData.newsheadline}
                      onChange={handleChange}
                      required
                      className="w-full text-sm px-3 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-serif font-bold text-rose-900 mb-1">Type/Category</label>
                      <input
                        type="text"
                        name="newstype"
                        value={formData.newstype}
                        onChange={handleChange}
                        required
                        className="w-full text-sm px-3 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-serif font-bold text-rose-900 mb-1">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="w-full text-sm px-3 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-serif font-bold text-rose-900 mb-1">Content</label>
                    <textarea
                      name="newscontent"
                      rows="4"
                      value={formData.newscontent}
                      onChange={handleChange}
                      required
                      className="w-full text-sm px-3 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-serif font-bold text-rose-900 mb-1">
                      Replace Image (Optional)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        className="text-xs text-rose-700 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-serif file:bg-rose-100 file:text-rose-900 hover:file:bg-rose-200"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-rose-100">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2 text-xs font-serif font-bold text-rose-700 hover:bg-rose-50 rounded-lg transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updating}
                      className="px-4 py-2 bg-rose-900 hover:bg-rose-950 text-white text-xs font-serif font-bold rounded-lg transition disabled:opacity-50"
                    >
                      {updating ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>

              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="relative z-10 border-t border-rose-100 bg-white/80 backdrop-blur-md mt-12">
            <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-serif text-rose-800/80">
              <p>© {new Date().getFullYear()} Digital News Portal. All rights reserved.</p>
            </div>
          </footer>

        </div>
      </div>
    </>
  );
};

export default ManageNews;