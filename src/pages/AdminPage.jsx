import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../comp/Sidebar';
import {
    FaPaperPlane,
    FaTimes,
    FaCloudUploadAlt,
    FaRegNewspaper,
    FaCheckCircle,
    FaExclamationCircle
} from 'react-icons/fa';

const AdminPage = () => {
    const [formData, setFormData] = useState({
        newsheadline: '',
        newstype: 'Technology',
        location: 'Karnataka',
        newscontent: ''
    });

    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleFile = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const removeFile = () => {
        setFile(null);
        setPreviewUrl('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMsg({ type: '', text: '' });
        setIsSubmitting(true);

        const allformData = new FormData();
        if (file) allformData.append("pic", file);
        allformData.append("newstype", formData.newstype);
        allformData.append("newsheadline", formData.newsheadline);
        allformData.append("newscontent", formData.newscontent);
        allformData.append("location", formData.location);

        try {
            const res = await axios.post('https://newsprojectbackend.onrender.com/api/create-news', allformData);

            if (res.data.success) {
                setStatusMsg({ type: 'success', text: res.data.message || 'News published successfully!' });
                handleCancel();
            } else {
                setStatusMsg({ type: 'error', text: res.data.message || 'Failed to publish news.' });
            }
        } catch (error) {
            console.error('Error posting news:', error);
            setStatusMsg({
                type: 'error',
                text: error.response?.data?.message || error.message || 'An error occurred while posting.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            newsheadline: '',
            newstype: 'Technology',
            location: 'Karnataka',
            newscontent: ''
        });
        setFile(null);
        setPreviewUrl('');
    };

    return (
        /* Screen wrapper: keeps sidebar fixed left, main content scrollable */
        <div className="flex h-screen w-full bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 overflow-hidden">

            {/* Sidebar docked to the left side */}
            <div className="w-64 flex-shrink-0 h-full border-r border-slate-800/80">
                <Sidebar />
            </div>

            {/* Scrollable Main Area */}
            <main className="flex-1 h-full overflow-y-auto p-6 md:p-10">
                <div className="max-w-4xl mx-auto rounded-3xl bg-slate-900 border border-slate-800/80 p-6 md:p-8 shadow-2xl">

                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-5">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/20">
                                <FaRegNewspaper className="text-xl" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white tracking-tight">
                                    Publish New Article
                                </h2>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Fill in the details below to broadcast a news item across the platform.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Status Message */}
                    {statusMsg.text && (
                        <div className={`mt-5 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 transition-all duration-300 ${statusMsg.type === 'success'
                                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                                : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                            }`}>
                            {statusMsg.type === 'success' ? (
                                <FaCheckCircle className="text-base flex-shrink-0" />
                            ) : (
                                <FaExclamationCircle className="text-base flex-shrink-0" />
                            )}
                            <span>{statusMsg.text}</span>
                        </div>
                    )}

                    {/* Form Controls */}
                    <form className="mt-6 space-y-6" onSubmit={handleSubmit}>

                        {/* Headline */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                                News Headline <span className="text-amber-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="newsheadline"
                                value={formData.newsheadline}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Major Tech Breakthrough Announced in AI Sector"
                                className="w-full rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition"
                            />
                        </div>

                        {/* Category & Location Row */}
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                                    Category <span className="text-amber-500">*</span>
                                </label>
                                <select
                                    name="newstype"
                                    value={formData.newstype}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5 text-sm font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 cursor-pointer transition"
                                >
                                    <option value="Technology">Technology</option>
                                    <option value="Political">Political</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Science">Science</option>
                                    <option value="Social">Social</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                                    Location (State) <span className="text-amber-500">*</span>
                                </label>
                                <select
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5 text-sm font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 cursor-pointer transition"
                                >
                                    <option value="Karnataka">Karnataka</option>
                                    <option value="Goa">Goa</option>
                                    <option value="TamilNadu">TamilNadu</option>
                                    <option value="Kerala">Kerala</option>
                                </select>
                            </div>
                        </div>

                        {/* Dropzone Attachment */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                                Article Attachment Image
                            </label>

                            {!previewUrl ? (
                                <label className="flex flex-col items-center justify-center w-full h-36 rounded-2xl border-2 border-dashed border-slate-800 bg-slate-950/40 hover:bg-slate-950/80 hover:border-amber-500/50 cursor-pointer transition">
                                    <FaCloudUploadAlt className="text-3xl text-amber-500/70 mb-2" />
                                    <p className="text-xs font-semibold text-slate-300">
                                        Click to upload image
                                    </p>
                                    <p className="text-[10px] text-slate-500 mt-1">PNG, JPG, or WEBP supported</p>
                                    <input
                                        type="file"
                                        name="pic"
                                        onChange={handleFile}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </label>
                            ) : (
                                <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-slate-800 group shadow-md">
                                    <img
                                        src={previewUrl}
                                        alt="Upload preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeFile}
                                        className="absolute top-3 right-3 p-2 bg-slate-950/80 hover:bg-rose-600 text-white rounded-full transition shadow-md active:scale-90"
                                        title="Remove Image"
                                    >
                                        <FaTimes className="text-xs" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Article Content */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                                Article Body Content <span className="text-amber-500">*</span>
                            </label>
                            <textarea
                                name="newscontent"
                                rows={6}
                                value={formData.newscontent}
                                onChange={handleChange}
                                required
                                placeholder="Write the full body of the news article here..."
                                className="w-full resize-none rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80">
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={isSubmitting}
                                className="rounded-xl px-5 py-2.5 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition active:scale-95"
                            >
                                Reset
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-500 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-md active:scale-95 transition disabled:opacity-50 cursor-pointer"
                            >
                                {isSubmitting ? (
                                    <span>Publishing...</span>
                                ) : (
                                    <>
                                        <FaPaperPlane className="text-xs" />
                                        <span>Publish News</span>
                                    </>
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </main>
        </div>
    );
};

export default AdminPage;