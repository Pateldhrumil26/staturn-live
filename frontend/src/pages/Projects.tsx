import React, { useEffect, useState } from 'react';
import API from '../services/api.js';
import { Project } from '../types/index.js';
import { ProjectCard } from '../components/ProjectCard.js';
import { Image, Layers } from 'lucide-react';

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await API.get('/projects');
        if (response.data.success) {
          setProjects(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand/10 border border-brand/20 px-4 py-1 text-xs font-bold text-brand uppercase tracking-wider mb-3">
            <Image className="h-3.5 w-3.5" />
            <span>Case Studies Portfolio</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Lighting That Transforms Spaces</h1>
          <p className="mt-4 text-gray-500 text-sm">
            Observe how RentaLite’s lighting fixture placements bring comfort, clarity, and energy efficiency to workspace and showroom environments.
          </p>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200">
            <p className="text-gray-500 font-medium">No projects showcase added yet. Run seeder to initialize.</p>
          </div>
        ) : (
          /* Grid list */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Projects;
