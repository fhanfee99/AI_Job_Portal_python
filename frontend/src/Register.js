import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Code, ArrowRight, Loader2 } from 'lucide-react';

function Register() {
    const [formData, setFormData] = useState({ username: '', password: '', email: '', skills: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Creating your account... ✨');

    try {
        const res = await axios.post('http://127.0.0.1:8000/api/accounts/register/', formData);
        
        console.log("Signup Success:", res.data);
        toast.success("Welcome to FIZOAI! Please login. 🚀", { id: toastId });
        
        setTimeout(() => {
            navigate('/login');
        }, 1500);

    } catch (err) {
        console.error("Signup Error Details:", err.response?.data);
        
        let errorMsg = "Error: Something went wrong! 🔑";
        if (err.response?.data) {
            const data = err.response.data;
            if (data.username) errorMsg = `Username: ${data.username[0]}`;
            else if (data.email) errorMsg = `Email: ${data.email[0]}`;
            else if (data.password) errorMsg = `Password: ${data.password[0]}`;
        }
        
        toast.error(errorMsg, { id: toastId });
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
            </div>

            <div className="w-full max-w-md bg-slate-800/40 border border-slate-700/50 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">Join now</h2>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    {/* Username */}
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input type="text" placeholder="Username" required
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:border-blue-500 outline-none transition-all"
                            onChange={e => setFormData({...formData, username: e.target.value})} />
                    </div>

                    {/* Email */}
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input type="email" placeholder="Email Address" required
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:border-blue-500 outline-none transition-all"
                            onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input type="password" placeholder="Password" required
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:border-blue-500 outline-none transition-all"
                            onChange={e => setFormData({...formData, password: e.target.value})} />
                    </div>

                    {/* Skills */}
                    <div className="relative">
                        <Code className="absolute left-4 top-4 text-slate-500" size={18} />
                        <textarea placeholder="Skills (Shopify, React, Python...)" 
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:border-blue-500 outline-none transition-all h-24 resize-none"
                            onChange={e => setFormData({...formData, skills: e.target.value})} />
                    </div>

                    <button 
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <>Create Account <ArrowRight size={18} /></>}
                    </button>
                </form>

                <p className="text-center text-sm text-slate-500 mt-6">
                    Already part of FIZOAI? <Link to="/login" className="text-blue-400 font-semibold hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;