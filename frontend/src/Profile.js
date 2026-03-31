import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Briefcase, CheckCircle, FileText, Zap, Award, 
    Target, Search, Trash2, ExternalLink, Filter,
    User, Edit3, Save, X, Upload, Phone 
} from 'lucide-react'; 
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Profile = () => {
    const [applications, setApplications] = useState([]);
    const [filteredApps, setFilteredApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [profileData, setProfileData] = useState({
        first_name: '',
        last_name: '',
        skills: '',
        role: '',
    });
    const fetchData = async () => {
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    
    try {
        const profileRes = await axios.get('http://127.0.0.1:8000/api/accounts/profile/', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log("PROFILE DATA:", profileRes.data); 
        setProfileData(profileRes.data);

        const appsRes = await axios.get('http://127.0.0.1:8000/api/jobs/my-applications/', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        setApplications(appsRes.data);
        setFilteredApps(appsRes.data);

    } catch (err) {
        console.error("Fetch Error:", err);
    } finally {
        setLoading(false);
    }
};
    const fetchMyApps = async () => {
        const token = localStorage.getItem('access_token');
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/jobs/my-applications/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log("FULL BACKEND RESPONSE:", res.data);
            setApplications(res.data);
            setFilteredApps(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Profile Error:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://127.0.0.1:8000/api/accounts/profile/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfileData(res.data); 
        } catch (err) {
            console.error("Fetch Error:", err);
        }
    };
        fetchMyApps();
    }, []);

    useEffect(() => {
        const results = applications.filter(app => {
            const title = app.job_details?.title?.toLowerCase() || "";
            const company = app.job_details?.company?.toLowerCase() || "";
            const query = searchTerm.toLowerCase();
            return title.includes(query) || company.includes(query);
        });
        setFilteredApps(results);
    }, [searchTerm, applications]);

    const handleWithdraw = async (appId) => {
        if (!window.confirm("Are you sure you want to withdraw this application?")) return;
        const token = localStorage.getItem('access_token');
        console.log("Checking Token:", token);
        try {
            await axios.delete(`http://127.0.0.1:8000/api/jobs/applications/${appId}/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            toast.success("Application withdrawn");
            fetchMyApps();
        } catch (err) {
            toast.error("Could not withdraw application");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6 lg:p-12">
            <div className="max-w-6xl mx-auto">
                
                {/* Header Section */}
                <div className="mb-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        {/* Profile.js */}
                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            {profileData.first_name 
                                ? `${profileData.first_name}'s Dashboard` 
                                : `${profileData.username || 'User'}'s Dashboard`}
                        </h1>
                        <p className="text-slate-400 mb-10">Manage your applications and AI match profiles.</p>
                        <Link 
                                to="/edit-profile" 
                                className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all"
                            >
                                <User size={18} className="text-blue-400" />
                                <span className="font-medium text-sm text-slate-200">Manage Profile</span>
                            </Link>
                    </div>
                    <div className="flex gap-4 w-full lg:w-auto">
                        <StatCard icon={<Target className="text-blue-400"/>} label="Applied" value={applications.length} />
                        <StatCard icon={<Award className="text-green-400"/>} label="Avg Match" value={`${Math.round(applications.reduce((acc, a) => acc + (a.match_percentage || 0), 0) / (applications.length || 1))}%`} />
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative mb-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                        type="text"
                        placeholder="Search by job title or company..."
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500/50 transition-all text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Applications List */}
                <div className="space-y-4">
                    {filteredApps.length > 0 ? (
                        filteredApps.map((app) => (
                            <div key={app.id} className="group bg-slate-800/20 border border-slate-700/50 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-slate-800/40 transition-all">
                                
                                <div className="flex items-center gap-4 w-full md:w-1/3">
                                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
                                        <Briefcase className="text-slate-400" size={20} />
                                    </div>
                                    <div className="truncate">
                                        <h3 className="font-bold text-lg truncate">
                                            {app.job_details?.title || "Position Unavailable"}
                                        </h3>
                                        <p className="text-slate-400 text-sm">
                                            {app.job_details?.company || "Company N/A"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center">
                                    <div className="text-xl font-black text-blue-400">{app.match_percentage || 0}%</div>
                                    <div className="text-[10px] uppercase text-slate-600 font-bold tracking-tighter">AI Match</div>
                                </div>

                                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                                    <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg text-xs font-bold">
                                        Applied
                                    </span>
                                    <div className="flex gap-2">
                                        {app.job_details?.id && (
                                            <Link 
                                                to={`/job/${app.job_details.id}`}
                                                className="p-2 bg-slate-700/50 hover:bg-blue-600/20 hover:text-blue-400 rounded-lg transition-all"
                                            >
                                                <ExternalLink size={18} />
                                            </Link>
                                        )}
                                        
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-slate-800/10 rounded-3xl border border-dashed border-slate-800 text-slate-500">
                            No applications found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value }) => (
    <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-2xl flex items-center gap-4 flex-1 min-w-[150px]">
        <div className="bg-slate-900 p-2 rounded-lg">{icon}</div>
        <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold">{label}</p>
            <p className="text-xl font-bold">{value}</p>
        </div>
    </div>
);

export default Profile;