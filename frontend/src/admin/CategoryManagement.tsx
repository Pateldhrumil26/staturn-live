import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api.js';
import { Category } from '../types/index.js';
import { ArrowLeft, Trash2, Edit2, Plus, X, Upload } from 'lucide-react';

import { AdminSidebar } from '../components/AdminSidebar.js';

export const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal / Form states
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await API.get('/categories');
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (cat?: Category) => {
    setError('');
    setImageFile(null);
    if (cat) {
      setEditId(cat._id);
      setName(cat.name);
      setDescription(cat.description || '');
      setImagePreview(cat.image || '');
    } else {
      setEditId(null);
      setName('');
      setDescription('');
      setImagePreview('');
    }
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setEditId(null);
    setName('');
    setDescription('');
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
    if (!name) {
      setError('Category name is required.');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      if (imageFile) {
        formData.append('image', imageFile);
      } else if (!editId) {
        // Dummy default image if creating new category without uploading
        formData.append('image', 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&q=80&w=400');
      }

      let response;
      if (editId) {
        response = await API.put(`/categories/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await API.post('/categories', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      if (response.data.success) {
        fetchCategories();
        handleCloseModal();
      } else {
        setError(response.data.message || 'Action failed.');
      }
    } catch (err: any) {
      console.error('Submit category error:', err);
      setError(err.response?.data?.message || 'Error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category? All associated products will lose this reference.')) {
      return;
    }
    try {
      const response = await API.delete(`/categories/${id}`);
      if (response.data.success) {
        fetchCategories();
      }
    } catch (err) {
      console.error('Delete category error:', err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-[#FAF9F6] min-h-screen">
      {/* Persistent Admin Sidebar */}
      <AdminSidebar />

      {/* Main Category Console Area */}
      <div className="flex-1 p-6 md:p-10 max-w-7xl">
        {/* Navigation back and trigger header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-gray-200 pb-5">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Category Manager</h1>
            <p className="text-xs text-gray-500 mt-0.5">Define classifications like Cylinder Lights, COB Spots, or Strip light lines.</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-1.5 rounded-full bg-brand px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-hover shadow-md transition-all self-start cursor-pointer"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Add New Category</span>
          </button>
        </div>

        {/* Display categories in a clean card list */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
            <p className="text-gray-500 text-sm">No categories found. Click the button to add one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div key={cat._id} className="bg-white rounded-2xl p-5 border border-gray-150 shadow-sm flex flex-col justify-between hover:border-brand/30 transition-all">
                <div className="flex gap-4">
                  <div className="h-16 w-16 rounded-xl border border-gray-100 overflow-hidden bg-gray-50 shrink-0">
                    <img
                      src={cat.image || 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&q=80&w=100'}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-gray-900 text-sm uppercase">{cat.name}</h3>
                    <p className="text-[10px] text-gray-400 font-semibold tracking-wider">slug: {cat.slug}</p>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">{cat.description}</p>
                  </div>
                </div>

                <div className="mt-5 border-t border-gray-100 pt-4 flex justify-end gap-2">
                  <button
                    onClick={() => handleOpenModal(cat)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-brand/10 hover:text-brand transition-colors cursor-pointer"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
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
                {editId ? 'Edit Category' : 'Create Category'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="text-xs font-bold text-brand">{error}</div>}

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Cylinder Lights"
                    className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe this category..."
                    className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                  />
                </div>

                {/* File Upload Selector */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Upload Photo</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 rounded-xl border border-dashed border-gray-300 px-4 py-3 bg-[#FAF9F6] hover:bg-gray-50 cursor-pointer transition-colors text-xs text-gray-500 font-bold shrink-0">
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
                    {submitting ? 'Saving...' : 'Save Category'}
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
export default CategoryManagement;
