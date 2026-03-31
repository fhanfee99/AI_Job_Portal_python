import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Upload, Mail, Lock } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '', 
        last_name: '',     
        skills: '',      
        role: 'developer',       
        email: '',
        password: '',
        resume: null
    });

    useEffect(() => {
        const fetchCurrentProfile = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) return;
            try {
                const res = await axios.get('http://127.0.0.1:8000/api/accounts/profile/manage/',{
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setFormData({
                    first_name: res.data.first_name || '',
                    last_name: res.data.last_name || '',
                    email: res.data.email || '',
                    skills: res.data.skills || '',
                    role: 'seeker',
                    password: '', 
                    resume: null 
                });
            } catch (err) {
                toast.error("Could not load profile data");
            }
        };
        fetchCurrentProfile();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('access_token');
        
        const data = new FormData();
        data.append('first_name', formData.first_name);
        data.append('last_name', formData.last_name);
        data.append('skills', formData.skills);
        data.append('role', formData.role);
        
        if (formData.password) {
            data.append('password', formData.password);
        }
        if (formData.resume) {
            data.append('resume', formData.resume);
        }

        try {
            await axios.patch('http://127.0.0.1:8000/api/accounts/profile/manage/', data, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success("Profile Updated!");
            navigate('/profile');
        } catch (err) {
            console.error(err.response?.data);
            toast.error("Update failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-6 lg:p-12">
            <div className="max-w-2xl mx-auto">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 mb-8 text-slate-400 hover:text-white transition-all"
                >
                    <ArrowLeft size={20}/> Back to Profile
                </button>
                
                <div className="bg-slate-800/40 p-8 rounded-[2.5rem] border border-slate-700 backdrop-blur-md shadow-2xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-black mb-2">Account Settings</h1>
                        <p className="text-slate-400 text-sm">Update your profile details and technical skills.</p>
                    </div>

                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">First Name</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-900/50 border border-slate-700 p-4 rounded-2xl outline-none focus:border-blue-500"
                                    value={formData.first_name}
                                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Last Name</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-900/50 border border-slate-700 p-4 rounded-2xl outline-none focus:border-blue-500"
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Role</label>
                            <select 
                                className="w-full bg-slate-900/50 border border-slate-700 p-4 rounded-2xl outline-none focus:border-blue-500 text-white"
                                value={formData.role}
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                            >
                                <option value="seeker">Job Seeker</option>
                                <option value="employer">Employer</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Skills (Comma separated)</label>
                            <input 
                                type="text" 
                                className="w-full bg-slate-900/50 border border-slate-700 p-4 rounded-2xl outline-none focus:border-blue-500"
                                value={formData.skills}
                                onChange={(e) => setFormData({...formData, skills: e.target.value})}
                                placeholder="React, Django, Shopify"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input 
                                    type="email" 
                                    className="w-full bg-slate-700/30 border border-slate-700 p-4 pl-12 rounded-2xl outline-none cursor-not-allowed text-slate-500"
                                    value={formData.email}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input 
                                    type="password" 
                                    className="w-full bg-slate-900/50 border border-slate-700 p-4 pl-12 rounded-2xl outline-none focus:border-blue-500 transition-all"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Resume (PDF)</label>
                            <div className="border-2 border-dashed border-slate-700 rounded-[2rem] p-8 text-center hover:border-blue-500/50 transition-all cursor-pointer relative group">
                                <input 
                                    type="file" 
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e) => setFormData({...formData, resume: e.target.files[0]})}
                                    accept=".pdf"
                                />
                                <Upload className="mx-auto text-slate-500 group-hover:text-blue-400 mb-2 transition-colors" size={32} />
                                <p className="text-sm text-slate-300">
                                    {formData.resume ? formData.resume.name : "Upload new resume"}
                                </p>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`w-full py-4 rounded-2xl font-black text-lg shadow-lg transition-all flex items-center justify-center gap-2 
                                ${loading ? 'bg-slate-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'}`}
                        >
                            {loading ? "Saving..." : <><Save size={20}/> Save Settings</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;