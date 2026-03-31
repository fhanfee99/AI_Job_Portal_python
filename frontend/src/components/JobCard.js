import React from 'react';
import { Briefcase, MapPin, Code, Building2, Clock } from 'lucide-react'; // Icons ke liye

const JobCard = ({ job }) => {
  const skillsArray = job.skills ? job.skills.split(',') : [];

  return (
    <div className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-6 rounded-2xl hover:border-blue-500/50 hover:bg-slate-800 transition-all duration-300 shadow-xl">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4">
          {/* Company Icon Placeholder */}
          <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/20">
            <Building2 className="text-blue-400" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
              {job.title}
            </h3>
            <p className="text-slate-400 flex items-center gap-1 text-sm">
              <Building2 size={14} /> {job.company}
            </p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold">
          {job.job_type}
        </span>
      </div>

      <p className="text-slate-400 text-sm line-clamp-2 mb-4">
        {job.description}
      </p>

      {/* Skills Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {skillsArray.map((skill, index) => (
          <span 
            key={index}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-300 text-xs"
          >
            <Code size={12} className="text-blue-400" />
            {skill.trim()}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
        <div className="flex items-center gap-4 text-slate-500 text-xs">
          <span className="flex items-center gap-1">
            <MapPin size={14} /> {job.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} /> {new Date(job.created_at).toLocaleDateString()}
          </span>
        </div>
        <button className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition-all transform active:scale-95">
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobCard;