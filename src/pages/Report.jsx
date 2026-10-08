import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Report = () => {
  const [reportText, setReportText] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reportText.trim()) {
      setMessage({ type: 'error', text: 'Please enter a reason for reporting.' });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      const token = localStorage.getItem('token');
      const id=localStorage.getItem("selectedNewsId")
      console.log("Token retrieved from localStorage:", token);

      if (!token) {
        setMessage({ type: 'error', text: 'Authorization token not found. Please log in again.' });
        setLoading(false);
        return;
      }

      const response = await axios.post(
        'https://newsprojectbackend.onrender.com/api/report',
        { report: reportText,id:id },
        {
          headers: {
            token: token,
            
          },
        }
      );

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Report submitted successfully!' });
        setReportText('');

        setTimeout(() => {
          navigate("/news");
        }, 5000);
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to submit report.' });
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Server error. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 p-4">
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg"
      >
        {/* Header */}
        <div className="mb-4">
          <h3 className='text-amber-900 font-bold'><a href="/news">BACK </a></h3>
          <h3 className="text-lg font-black text-white">Report Content</h3>
          <p className="text-xs text-slate-400">
            Help us understand what's wrong with this post.
          </p>
        </div>

        {/* Status Message Alert */}
        {message.text && (
          <div
            className={`mb-4 rounded-xl p-3 text-xs ${message.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}
          >
            {message.text}
          </div>
        )}

        {/* Textarea Fix */}
        <div className="relative">
          <textarea
            rows={4}
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            placeholder="Why Report?"
            className="w-full resize-none rounded-xl border border-slate-700 bg-slate-800 p-3 text-sm text-white placeholder-slate-400 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20"
          />
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 hover:bg-slate-800 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-amber-900 px-4 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-amber-800 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Report;