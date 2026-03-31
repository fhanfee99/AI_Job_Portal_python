import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MapPin, Building2, Clock, Search, X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Home = () => {
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const jobsSectionRef = useRef(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
        const API_URL = process.env.REACT_APP_API_URL || "https://farhanahanfee.pythonanywhere.com";
        const response = await axios.get(`${API_URL}/api/jobs/?search=${searchQuery}&location=${locationQuery}`);
    //   const response = await axios.get(`http://127.0.0.1:8000/api/jobs/?search=${searchQuery}&location=${locationQuery}`);
      setJobs(response.data);
      setLoading(false);

      if(searchQuery || locationQuery) {
        jobsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setLoading(false);
    }
  };

  const fetchAppliedJobs = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
        console.log("No token found, skipping applied jobs fetch.");
        return;
    }

    try {
        const API_URL = process.env.REACT_APP_API_URL || "https://farhanahanfee.pythonanywhere.com";
        const res = await axios.get(`${API_URL}/api/jobs/my-applications/`,{
        //const res = await axios.get('http://127.0.0.1:8000/api/jobs/my-applications/', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const ids = res.data.map(app => {
            if (typeof app.job === 'object') return Number(app.job.id);
            return Number(app.job);
        });

        console.log("Fetched Applied IDs on Reload:", ids);
        setAppliedJobIds(ids);
    } catch (err) {
        console.error("Error fetching applied jobs on reload:", err);
    }
};

  useEffect(() => {
    fetchJobs();
    fetchAppliedJobs();
  }, []);

  const [selectedJob, setSelectedJob] = useState(null);
  const [resume, setResume] = useState(null);

  const handleApplySubmit = async () => {
    if (!selectedJob) return;

    const jobIdToStore = selectedJob?.id;
    if (!jobIdToStore) {
        toast.error("Job ID not found!");
        return;
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
        toast.error("Please Login first!");
        return;
    }

    if (!resume) {
        toast.error("Please upload a resume first!");
        return;
    }

    const formData = new FormData();
    formData.append('resume', resume);

    try {
        const API_URL = process.env.REACT_APP_API_URL || "https://farhanahanfee.pythonanywhere.com";

        //await axios.post(
            //`http://127.0.0.1:8000/api/jobs/${jobIdToStore}/apply/`,
            await axios.get(`${API_URL}/api/jobs${jobIdToStore}/apply/`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        toast.success("Applied Successfully!");

        // Update State immediately so button turns to "Applied"
        setAppliedJobIds((prev) => [...prev, jobIdToStore]);
        setSelectedJob(null);

        // Redirect after delay
        setTimeout(() => {
            navigate('/profile');
        }, 1500);

    } catch (err) {
        const serverMessage = err.response?.data?.error || err.response?.data?.detail;
        if (err.response?.status === 400 && serverMessage?.toLowerCase().includes('already applied')) {
            toast.error("Already applied!");
            setAppliedJobIds((prev) => [...prev, jobIdToStore]);
            setSelectedJob(null);
        } else {
            toast.error(serverMessage || "Application failed!");
        }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* HERO SECTION */}
      <div className="relative overflow-hidden bg-slate-900">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-blue-600 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-indigo-800 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28 flex flex-col items-center text-center">
          <span className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
            🚀 FIZO AI — The Next-Gen Job Portal for Developers
          </span>

          <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 tracking-tight">
            Find Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">FIZO AI Role</span>
          </h1>

          <div className="w-full max-w-4xl p-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col md:flex-row items-center gap-2 shadow-2xl">
            <div className="flex items-center w-full px-4 py-3">
              <Search className="text-slate-500 mr-2" size={20} />
              <input
                type="text"
                placeholder="Job title or skills..."
                className="w-full bg-transparent outline-none placeholder:text-slate-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="hidden md:block w-px h-8 bg-white/10"></div>
            <div className="flex items-center w-full px-4 py-3">
              <MapPin className="text-slate-500 mr-2" size={20} />
              <input
                type="text"
                placeholder="Location..."
                className="w-full bg-transparent outline-none placeholder:text-slate-500"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
              />
            </div>
            <button
              onClick={fetchJobs}
              className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* JOBS SECTION */}
      <div ref={jobsSectionRef} className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-10">Latest Opportunities</h2>
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApply={() => setSelectedJob(job)}
                // Using Number conversion to ensure strict matching
                isApplied={appliedJobIds.some(id => Number(id) === Number(job.id))}
              />
            ))}
          </div>
        )}
      </div>

      {/* APPLY MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-md p-8 rounded-3xl shadow-2xl relative">
            <button onClick={() => setSelectedJob(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X /></button>
            <h3 className="text-xl font-bold mb-2">Apply for {selectedJob.title}</h3>
            <p className="text-slate-400 text-sm mb-6">{selectedJob.company}</p>

            <div className="border-2 border-dashed border-slate-700 rounded-2xl p-8 text-center hover:border-blue-500/50 transition-colors">
              <input type="file" id="resume" className="hidden" onChange={(e) => setResume(e.target.files[0])} accept=".pdf" />
              <label htmlFor="resume" className="cursor-pointer flex flex-col items-center">
                <Upload className="text-blue-500 mb-2" size={32} />
                <span className="text-sm font-medium">{resume ? resume.name : "Click to upload Resume (PDF)"}</span>
              </label>
            </div>

            <button onClick={handleApplySubmit} className="w-full bg-blue-600 mt-6 py-3 rounded-xl font-bold hover:bg-blue-500 transition-all">Submit CV</button>
          </div>
        </div>
      )}
    </div>
  );
};

const JobCard = ({ job, onApply, isApplied }) => {
  const skillsArray = job.skills ? job.skills.split(',') : [];
  return (
    <div className={`group bg-slate-800/40 backdrop-blur-sm border ${isApplied ? 'border-green-500/50' : 'border-slate-700/50'} p-6 rounded-2xl hover:border-blue-500/50 hover:bg-slate-800 transition-all duration-300 shadow-xl`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
            <Building2 className="text-blue-400" size={24} />
          </div>
          <div>
            <Link to={`/job/${job.id}`}>
            <h3 className="text-lg font-bold group-hover:text-blue-400 transition-colors line-clamp-1">{job.title}</h3>
            </Link>
            <p className="text-slate-400 text-sm">{job.company}</p>
          </div>
        </div>
      </div>
      <p className="text-slate-400 text-sm line-clamp-2 mb-6 h-10">{job.description}</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {skillsArray.slice(0, 3).map((skill, index) => (
          <span key={index} className="px-3 py-1 rounded-lg bg-slate-700/30 border border-slate-600/50 text-slate-300 text-[10px] uppercase font-bold tracking-wider">{skill.trim()}</span>
        ))}
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
        <div className="text-slate-500 text-xs">
          <span className="flex items-center gap-1 mb-1"><MapPin size={12} /> {job.location}</span>
          <span className="flex items-center gap-1 font-semibold text-green-500/80 uppercase"><Clock size={12} /> {job.job_type}</span>
        </div>

        {isApplied ? (
          <button
            disabled
            className="px-4 py-2 bg-slate-800 text-slate-500 text-xs font-bold rounded-lg cursor-not-allowed border border-slate-700"
          >
            Applied
          </button>
        ) : (
          <button
            onClick={onApply}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-blue-600/20 transition-all active:scale-95"
          >
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
