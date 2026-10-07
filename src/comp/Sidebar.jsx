import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaPlusCircle, 
  FaChartBar, 
  FaUsers, 
  FaHighlighter, 
  FaTrashAlt, 
  FaEdit,
  FaSignOutAlt,
  FaShieldAlt 
} from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      // Clear all authentication tokens or user details from local storage / session storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.clear();

      // Navigate back to the admin login page
      navigate('/adminlogin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { label: 'Publish', path: '/admin', icon: FaPlusCircle },
    { label: 'Reports', path: '/reportdetail', icon: FaChartBar },
    { label: 'User Details', path: '/userdetail', icon: FaUsers },
    { label: 'Upload Highlight', path: '/highlightupload', icon: FaHighlighter },
    // { label: ' News', path: '/deletenews', icon: FaTrashAlt },
    { label: 'Delete Highlight', path: '/deletehighlight', icon: FaTrashAlt },
    { label: 'Manage News', path: '/edit', icon: FaEdit },
  ];

  return (
    <aside className="flex min-h-screen w-full flex-col justify-between border-r border-rose-100/60 bg-white/90 dark:border-slate-800/80 dark:bg-slate-950 p-4 md:w-64 backdrop-blur-md shadow-xs transition-all duration-300">
      
      {/* Top Section: Brand & Navigation */}
      <div className="space-y-6">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-950 to-rose-800 text-white shadow-md shadow-rose-950/20 font-serif font-black text-lg">
            <FaShieldAlt className="text-base" />
          </div>
          <div>
            <h1 className="text-sm font-serif font-black text-rose-950 dark:text-white tracking-tight leading-tight">
              News Admin
            </h1>
            <p className="text-[10px] font-sans font-bold tracking-widest text-rose-500 dark:text-rose-400 uppercase">
              Control Panel
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="space-y-1.5">
          <p className="px-3 pb-1 text-[10px] font-sans font-black uppercase tracking-widest text-rose-400 dark:text-slate-500">
            Overview
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <React.Fragment key={item.path}>
                {item.isDivider && (
                  <div className="my-2 border-t border-rose-100 dark:border-slate-800/80" />
                )}
                
                <Link
                  to={item.path}
                  className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-serif font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-rose-950 text-white shadow-sm shadow-rose-950/20 dark:bg-rose-900 dark:text-white'
                      : 'text-rose-900/80 hover:bg-rose-100/60 hover:text-rose-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <Icon className={`text-sm transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-rose-700/70 dark:text-slate-400'
                  }`} />
                  <span className="tracking-wide">{item.label}</span>
                </Link>
              </React.Fragment>
            );
          })}
             {/* Bottom Section: Profile & Logout */}
      <div className="border-t border-rose-100/80 pt-4 dark:border-slate-800/80">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-900 to-rose-700 font-serif text-xs font-black text-white shadow-xs">
              A
            </div>
            <div className="truncate">
              <p className="text-xs font-serif font-bold text-rose-950 dark:text-white truncate">
                Adithya
              </p>
              <p className="text-[10px] font-sans text-rose-500 dark:text-slate-400 truncate">
                amk135721@gmail.com
              </p>
            </div>
          </div>

          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-400 hover:bg-rose-100 hover:text-rose-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition active:scale-95 cursor-pointer"
            title="Logout"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="text-xs" />
          </button>
        </div>
      </div>
        </nav>
      </div>

   

    </aside>
  );
};

export default Sidebar;