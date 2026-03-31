import React, { useState } from 'react';
import axios from 'axios';
import { Lock, Mail, LogIn } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading('Authenticating...');
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/accounts/login/', formData);
            localStorage.setItem('access_token', res.data.access);
            localStorage.setItem('refresh_token', res.data.refresh);
            const loggedInUser = res.data.username || formData.username;
            toast.success(`Welcome back, ${loggedInUser}! 👋`, { id: loadingToast });
            navigate('/');
        } catch (err) {
           toast.error("Invalid Credentials! Please try again.", { id: loadingToast });
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-slate-800/50 border border-slate-700 p-8 rounded-3xl shadow-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-slate-400">Login to your dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-slate-500" size={20} />
                        <input 
                            type="text" placeholder="Username" required
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-blue-500 outline-none transition-all"
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-slate-500" size={20} />
                        <input 
                            type="password" placeholder="Password" required
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-blue-500 outline-none transition-all"
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]">
                        Log In <LogIn size={18} />
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-700 text-center">
                    <p className="text-slate-500 text-sm">
                        Don't have an account? <Link to="/register" className="text-blue-400 hover:underline font-medium">Sign Up Free</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;