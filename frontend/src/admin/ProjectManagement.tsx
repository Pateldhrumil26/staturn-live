import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api.js';
import { Project } from '../types/index.js';
import { ArrowLeft, Trash2, Edit2, Plus, X, Upload } from 'lucide-react';

import { AdminSidebar } from '../components/AdminSidebar.js';

export const ProjectManagement: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [year, setYear] = useState('');
  const [client, setClient] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await API.get('/projects');
      if (response.data.success) {
        setProjects(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenModal = (proj?: Project) => {
    setError('');
    setImageFile(null);
    if (proj) {
      setEditId(proj._id);
      setTitle(proj.title);
      setDescription(proj.description || '');
      setLocation(proj.location || '');
      setYear(proj.year || '');
      setClient(proj.client || '');
      setImagePreview(proj.image || '');
    } else {
      setEditId(null);
      setTitle('');
      setDescription('');
      setLocation('');
      setYear('2025');
      setClient('');
      setImagePreview('');
    }
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setEditId(null);
    setTitle('');
    setDescription('');
    setLocation('');
    setYear('');
    setClient('');
    setImageFile(null);
    setImagePreview('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      setError('Project title is required.');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('location', location);
      formData.append('year', year);
      formData.append('client', client);
      
      if (imageFile) {
        formData.append('image', imageFile);
      } else if (!editId) {
        // Fallback default project image
        formData.append('image', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600');
      }

      let response;
      if (editId) {
        response = await API.put(`/projects/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await API.post('/projects', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      if (response.data.success) {
        fetchProjects();
        handleCloseModal();
      } else {
        setError(response.data.message || 'Action failed.');
      }
    } catch (err: any) {
      console.error('Submit project error:', err);
      setError(err.response?.data?.message || 'Error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this project case study?')) {
      return;
    }
    try {
      const response = await API.delete(`/projects/${id}`);
      if (response.data.success) {
        fetchProjects();
      }
    } catch (err) {
      console.error('Delete project error:', err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-[#FAF9F6] min-h-screen">
      {/* Persistent Admin Sidebar */}
      <AdminSidebar />

      {/* Main Projects Console Area */}
      <div className="flex-1 p-6 md:p-10 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-gray-200 pb-5">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Projects Showcase</h1>
            <p className="text-xs text-gray-500 mt-0.5">Control the details, clients, and images in the installation gallery.</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-1.5 rounded-full bg-brand px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-hover shadow-md transition-all self-start cursor-pointer"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Add New Project</span>
          </button>
        </div>

        {/* List projects */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
            <p className="text-gray-500 text-sm">No project items found. Click the button to add a project.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <div key={proj._id} className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-sm flex flex-col justify-between hover:border-brand/35 transition-all">
                <div className="aspect-video w-full bg-gray-900 relative">
                  <img
                    src={proj.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400'}
                    alt=""
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-display font-bold text-base">{proj.title}</h3>
                    <p className="text-[10px] text-gray-300 font-semibold uppercase">{proj.location} • {proj.year}</p>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{proj.description}</p>
                  
                  {proj.client && (
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-3">
                      Client: <span className="text-gray-600">{proj.client}</span>
                    </div>
                  )}

                  <div className="mt-5 border-t border-gray-100 pt-4 flex justify-end gap-2">
                    <button
                      onClick={() => handleOpenModal(proj)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-brand/10 hover:text-brand transition-colors cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(proj._id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Overlay */}
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-gray-150 relative">
              <button onClick={handleCloseModal} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 focus:outline-none">
                <X className="h-5 w-5" />
              </button>

              <h2 className="font-display text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">
                {editId ? 'Edit Project' : 'Create Project'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="text-xs font-bold text-brand">{error}</div>}

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Luxuria Heights Lobby"
                    className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Mumbai, Maharashtra"
                      className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Year</label>
                    <input
                      type="text"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="e.g. 2025"
                      className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Client Name</label>
                    <input
                      type="text"
                      value={client}
                      onChange={(e) => setClient(e.target.value)}
                      placeholder="e.g. Luxuria Builders Group"
                      className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Case study summary details..."
                    className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                  />
                </div>

                {/* Upload project photo */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Project Photo</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 rounded-xl border border-dashed border-gray-300 px-4 py-3 bg-[#FAF9F6] hover:bg-gray-50 cursor-pointer text-xs text-gray-500 font-bold shrink-0">
                      <Upload className="h-4 w-4 text-brand" />
                      <span>Choose File</span>
                      <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
                    </label>
                    
                    {imagePreview && (
                      <div className="h-12 w-12 rounded-lg border border-gray-150 overflow-hidden bg-gray-50 shrink-0">
                        <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 text-xs font-bold uppercase tracking-wider">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="rounded-full border border-gray-300 px-5 py-2.5 text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-full bg-brand px-6 py-2.5 text-white hover:bg-brand-hover disabled:bg-gray-400 shadow-md cursor-pointer"
                  >
                    {submitting ? 'Saving...' : 'Save Project'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ProjectManagement;
