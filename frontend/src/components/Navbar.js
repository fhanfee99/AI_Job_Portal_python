import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Home, UserPlus } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('access_token');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
        setIsOpen(false);
    };

    return (
        <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    
                    {/* Brand Logo */}
                    <Link to="/" className="flex items-center gap-3 group px-2">
  {/* Unique X-Pulse Icon */}
  <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 p-2.5 rounded-2xl group-hover:rotate-[15deg] transition-all duration-300 shadow-lg shadow-blue-500/20">
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="white" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      {/* Dynamic X Shape */}
      <text x='62%' y='55%' 
      font-size='8' 
      text-anchor='middle' 
      fill='black'
      stroke='white'
      stroke-width='0.2'
      font-family='Arial, sans-serif' 
      font-weight='300' 
      letter-spacing='0'
      dy='.1em'>FIZOAI</text>
      {/* AI Pulse Dot */}
      <circle cx="12" cy="12" r="2" fill="white" className="animate-ping" />
    </svg>
  </div>

  {/* Brand Name */}
  <div className="flex flex-col">
    <span className="text-2xl font-black text-white tracking-tighter leading-none">
      <span className="text-blue-500 italic">FIZO </span>AI
    </span>
    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">
      AI Powered Hiring Platform
    </span>
  </div>
</Link>

                    {/* Desktop Menu (Visible on md and up) */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/" className="text-slate-300 hover:text-white font-medium flex items-center gap-2 px-3 py-2 rounded-lg transition-colors">
                            <Home size={18} /> Home
                        </Link>
                        
                        
                        {token ? (
                            <>
                                <Link to="/profile" className="text-slate-300 hover:text-white font-medium flex items-center gap-2 px-3 py-2 rounded-lg transition-colors">
                                    <User size={18} /> My Profile
                                </Link>
                                <button 
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 bg-red-500/10 text-red-400 px-5 py-2.5 rounded-xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all font-bold text-sm"
                                >
                                    <LogOut size={18} /> Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-slate-300 hover:text-white font-medium flex items-center gap-2 px-3 py-2 rounded-lg transition-colors">
                                   <User size={18} /> Login
                                </Link>
                                <Link to="/register" className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-600/20">
                                    <UserPlus size={18} /> Join Free
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button 
                            onClick={() => setIsOpen(!isOpen)} 
                            className="p-2 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar (Slide Down) */}
            {isOpen && (
                <div className="md:hidden bg-slate-900 border-t border-slate-800 animate-in fade-in slide-in-from-top duration-300">
                    <div className="px-4 py-6 space-y-3">
                        <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-slate-300 p-4 hover:bg-slate-800 rounded-2xl transition-colors">
                            <Home size={22}/> Home
                        </Link>
                        
                        {token ? (
                            <>
                                <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-slate-300 p-4 hover:bg-slate-800 rounded-2xl transition-colors">
                                    <User size={22}/> My Profile
                                </Link>
                                <button 
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 text-red-400 p-4 hover:bg-red-500/10 rounded-2xl transition-colors font-bold"
                                >
                                    <LogOut size={22}/> Logout
                                </button>
                            </>
                        ) : (
                            <div className="pt-4 space-y-3">
                                <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center text-slate-300 p-4 border border-slate-700 rounded-2xl font-bold">
                                    Login
                                </Link>
                                <Link to="/register" onClick={() => setIsOpen(false)} className="block w-full text-center bg-blue-600 text-white p-4 rounded-2xl font-bold shadow-lg shadow-blue-600/30">
                                    Join Free
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;