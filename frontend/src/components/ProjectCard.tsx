import React from 'react';
import { Project } from '../types/index.js';
import { MapPin, Calendar, Building } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="group relative rounded-2xl bg-white shadow-sm border border-gray-150 overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-brand/35">
      
      {/* Visual Image Showcase */}
      <div className="zoom-container aspect-video w-full bg-gray-900">
        <img
          src={project.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600'}
          alt={project.title}
          className="zoom-image h-full w-full object-cover opacity-90 transition-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      </div>

      {/* Text Details Area */}
      <div className="p-5">
        <h3 className="font-display text-lg font-bold text-gray-900 group-hover:text-brand transition-colors">
          {project.title}
        </h3>
        
        {project.description && (
          <p className="mt-2 line-clamp-2 text-xs text-gray-500 leading-relaxed">
            {project.description}
          </p>
        )}

        {/* Project Meta Metrics */}
        <div className="mt-4 border-t border-gray-100 pt-3 grid grid-cols-2 gap-2 text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
          {project.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-brand shrink-0" />
              <span className="truncate">{project.location}</span>
            </div>
          )}
          {project.client && (
            <div className="flex items-center gap-1.5 justify-end">
              <Building className="h-3.5 w-3.5 text-brand shrink-0" />
              <span className="truncate">{project.client}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
