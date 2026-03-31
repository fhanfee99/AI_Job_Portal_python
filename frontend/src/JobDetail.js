import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    ArrowLeft, Building2, MapPin, Briefcase, Clock, 
    CheckCircle, Upload, DollarSign, Globe, ShieldCheck, 
    Zap, Users, Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [resume, setResume] = useState(null);
    const [isApplied, setIsApplied] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobAndStatus = async () => {
            const token = localStorage.getItem('access_token');
            try {
                const res = await axios.get(`http://127.0.0.1:8000/api/jobs/${id}/`);
                setJob(res.data);

                if (token) {
                    const appRes = await axios.get('http://127.0.0.1:8000/api/jobs/my-applications/', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const found = appRes.data.some(app => Number(app.job_details?.id) === Number(id));
                    setIsApplied(found);
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchJobAndStatus();
    }, [id]);

    const handleApply = async () => {
        const token = localStorage.getItem('access_token');
        if (!resume) {
            toast.error("Please select a resume first");
            return;
        }
        const formData = new FormData();
        formData.append('resume', resume);

        try {
            await axios.post(`http://127.0.0.1:8000/api/jobs/${id}/apply/`, formData, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success("Application submitted to FIZO AI!");
            setIsApplied(true);
            setTimeout(() => {
            navigate('/profile'); 
        }, 1500);
        } catch (err) {
            toast.error(err.response?.data?.error || "Apply failed");
        }
    };

    if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white italic">AI is loading job insights...</div>;
    if (!job) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Job Not Found</div>;

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 pb-20">
            {/* Header / Cover Section */}
            <div className="h-48 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border-b border-slate-800">
                <div className="max-w-6xl mx-auto px-6 pt-10">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-all bg-slate-900/50 px-4 py-2 rounded-full border border-slate-700">
                        <ArrowLeft size={18} /> Back to Listings
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 -mt-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Main Content (2/3) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Title Card */}
                        <div className="bg-slate-800/40 border border-slate-700 p-8 rounded-[2.5rem] backdrop-blur-md">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                                <div className="flex gap-6">
                                    <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center border border-slate-700 shadow-xl">
                                        <Building2 className="text-blue-400" size={40} />
                                    </div>
                                    <div>
                                        <h1 className="text-4xl font-black text-white tracking-tight">{job.title}</h1>
                                        <p className="text-xl text-blue-400 font-medium">{job.company}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="px-4 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-bold uppercase tracking-widest">
                                        {job.job_type || 'Full Time'}
                                    </span>
                                </div>
                            </div>

                            {/* Quick Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-slate-700/50">
                                <div className="flex items-center gap-3">
                                    <MapPin className="text-slate-500" size={20} />
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase font-bold">Location</p>
                                        <p className="text-sm font-semibold">{job.location || 'Remote'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <DollarSign className="text-slate-500" size={20} />
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase font-bold">Salary</p>
                                        <p className="text-sm font-semibold">{job.salary || 'Competitive'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="text-slate-500" size={20} />
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase font-bold">Posted</p>
                                        <p className="text-sm font-semibold">2 days ago</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Users className="text-slate-500" size={20} />
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase font-bold">Applicants</p>
                                        <p className="text-sm font-semibold">45+</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-xl font-bold text-white mb-4">Job Description</h3>
                                <p className="text-slate-400 leading-relaxed text-lg whitespace-pre-line">
                                    {job.description}
                                </p>
                            </div>
                        </div>

                        {/* Requirements / Skills Section */}
                        <div className="bg-slate-800/20 border border-slate-700/50 p-8 rounded-[2rem]">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <ShieldCheck className="text-green-400" /> Key Requirements & Skills
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {job.skills?.split(',').map((skill, i) => (
                                    <span key={i} className="px-5 py-2 bg-slate-900 border border-slate-700 rounded-2xl text-sm font-medium hover:border-blue-500/50 transition-colors">
                                        {skill.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sidebar (1/3) */}
                    <div className="space-y-6">
                        {/* Application Card */}
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-[1px] rounded-[2.5rem] shadow-2xl shadow-blue-900/20">
                            <div className="bg-[#1e293b] p-8 rounded-[2.5rem]">
                                <h3 className="text-2xl font-black text-white mb-2">Apply Now</h3>
                                <p className="text-slate-400 text-sm mb-6 font-medium">Get your profile analyzed by FIZO AI</p>

                                {!isApplied ? (
                                    <div className="space-y-4">
                                        <div className="border-2 border-dashed border-slate-700 rounded-2xl p-6 text-center hover:border-blue-500/50 transition-all group cursor-pointer relative">
                                            <input 
                                                type="file" 
                                                onChange={(e) => setResume(e.target.files[0])}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <Upload className="mx-auto text-slate-500 group-hover:text-blue-400 mb-2 transition-colors" size={32} />
                                            <p className="text-xs font-bold text-slate-400 group-hover:text-slate-200">
                                                {resume ? resume.name : "Click to upload Resume (PDF)"}
                                            </p>
                                        </div>
                                        <button 
                                            onClick={handleApply}
                                            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Zap size={20} fill="white" /> Submit via AI
                                        </button>
                                    </div>
                                ) : (
                                    <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl text-center">
                                        <CheckCircle className="mx-auto text-green-400 mb-2" size={32} />
                                        <p className="text-green-400 font-black">APPLICATION SENT</p>
                                        <p className="text-[10px] text-green-500/70 font-bold uppercase mt-1 tracking-widest">Awaiting AI Match Result</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Company Quick Info */}
                        <div className="bg-slate-800/40 border border-slate-700 p-6 rounded-[2rem]">
                            <h4 className="font-bold text-white mb-4 uppercase text-xs tracking-widest text-slate-500">About Company</h4>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <Globe size={16} className="text-blue-400" />
                                    <span className="text-slate-300">www.{job.company?.toLowerCase().replace(/\s/g, '')}.com</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Users size={16} className="text-blue-400" />
                                    <span className="text-slate-300">500-1000 Employees</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Calendar size={16} className="text-blue-400" />
                                    <span className="text-slate-300">Founded in 2012</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default JobDetail;