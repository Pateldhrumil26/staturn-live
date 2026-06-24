import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api.js';
import { Product, Category, Specification } from '../types/index.js';
import { ArrowLeft, Trash2, Edit2, Plus, X, Upload, Check, AlertCircle } from 'lucide-react';

import { AdminSidebar } from '../components/AdminSidebar.js';

export const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal / Form states
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [featured, setFeatured] = useState(false);
  const [specifications, setSpecifications] = useState<Specification[]>([]);
  
  // Image Upload States
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catsRes, prodsRes] = await Promise.all([
        API.get('/categories'),
        API.get('/products?status='), // Fetch all (omitting status query lets Express show all for Admin if configured, but let's query explicitly. Wait, our product controller filters by default, so we need to make sure we query stats or adjust query params. In productController we support passing '?status=' explicitly. Let's make it fetch '/products?status=Active' and '/products?status=Inactive' combined, or make the controller fetch all if we pass status='')
      ]);

      if (catsRes.data.success) {
        setCategories(catsRes.data.data);
      }
      
      // Let's query products. Since productController defaults to 'Active' when status is omitted,
      // but if we pass status=Active and status=Inactive explicitly we can get both.
      // Wait, in productController: `if (status) { query.status = status; } else { query.status = 'Active'; }`.
      // To get ALL products (both Active and Inactive) for Admin, we can pass a special flag or we can query active and inactive and merge.
      // Wait! Let's query with status=Active first and status=Inactive and merge, or let's check what our controller does if we pass status=Active/Inactive.
      // Better yet, we can query both status=Active and status=Inactive.
      const [activeProds, inactiveProds] = await Promise.all([
        API.get('/products?status=Active'),
        API.get('/products?status=Inactive'),
      ]);

      let allProducts: Product[] = [];
      if (activeProds.data.success) allProducts = [...allProducts, ...activeProds.data.data];
      if (inactiveProds.data.success) allProducts = [...allProducts, ...inactiveProds.data.data];
      setProducts(allProducts);
    } catch (err) {
      console.error('Error fetching admin products data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (prod?: Product) => {
    setError('');
    setImageFiles(null);
    if (prod) {
      setEditId(prod._id);
      setName(prod.name);
      setDescription(prod.description);
      setCategory(typeof prod.category === 'object' ? prod.category._id : prod.category);
      setStatus(prod.status);
      setFeatured(prod.featured);
      setSpecifications(prod.specifications || []);
      setExistingImages(prod.images || []);
    } else {
      setEditId(null);
      setName('');
      setDescription('');
      setCategory(categories[0]?._id || '');
      setStatus('Active');
      setFeatured(false);
      setSpecifications([
        { key: 'Wattage', value: '12W' },
        { key: 'Color Temperature (CCT)', value: '3000K' },
      ]);
      setExistingImages([]);
    }
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setEditId(null);
    setName('');
    setDescription('');
    setCategory('');
    setStatus('Active');
    setFeatured(false);
    setSpecifications([]);
    setImageFiles(null);
    setExistingImages([]);
  };

  // Spec rows handlers
  const handleAddSpecRow = () => {
    setSpecifications([...specifications, { key: '', value: '' }]);
  };

  const handleSpecChange = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...specifications];
    updated[index][field] = val;
    setSpecifications(updated);
  };

  const handleRemoveSpecRow = (index: number) => {
    setSpecifications(specifications.filter((_, idx) => idx !== index));
  };

  const handleRemoveExistingImage = (imgUrl: string) => {
    setExistingImages(existingImages.filter((img) => img !== imgUrl));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !category) {
      setError('Please fill in required fields.');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('status', status);
      formData.append('featured', String(featured));
      formData.append('specifications', JSON.stringify(specifications));

      // Append new image files
      if (imageFiles) {
        for (let i = 0; i < imageFiles.length; i++) {
          formData.append('images', imageFiles[i]);
        }
      }

      // If editing, also pass the remaining existing images array
      if (editId) {
        formData.append('images', JSON.stringify(existingImages));
      }

      let response;
      if (editId) {
        response = await API.put(`/products/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await API.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      if (response.data.success) {
        fetchData();
        handleCloseModal();
      } else {
        setError(response.data.message || 'Action failed.');
      }
    } catch (err: any) {
      console.error('Submit product error:', err);
      setError(err.response?.data?.message || 'Error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this product from the catalog?')) {
      return;
    }
    try {
      const response = await API.delete(`/products/${id}`);
      if (response.data.success) {
        fetchData();
      }
    } catch (err) {
      console.error('Delete product error:', err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-[#FAF9F6] min-h-screen">
      {/* Persistent Admin Sidebar */}
      <AdminSidebar />

      {/* Main Products Console Area */}
      <div className="flex-1 p-6 md:p-10 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-gray-200 pb-5">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Products Manager</h1>
            <p className="text-xs text-gray-500 mt-0.5">Control the public specifications, active display state, and images for lighting items.</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-1.5 rounded-full bg-brand px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-hover shadow-md transition-all self-start cursor-pointer"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Product Records list */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
            <p className="text-gray-500 text-sm">No products found in the database. Run the seeder script or add one.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-150 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Product Info</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-center">Featured</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((prod) => {
                    const catName = typeof prod.category === 'object' ? prod.category.name : 'N/A';
                    return (
                      <tr key={prod._id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg border border-gray-100 overflow-hidden bg-gray-50 shrink-0">
                              <img
                                src={prod.images[0] || 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=100'}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-display font-bold text-gray-900 text-sm uppercase">{prod.name}</div>
                              <div className="text-[10px] text-gray-400 mt-0.5 truncate max-w-xs">{prod.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-600 uppercase">{catName}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            prod.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {prod.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {prod.featured ? (
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand/10 text-brand">
                              <Check className="h-3.5 w-3.5" />
                            </span>
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleOpenModal(prod)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-brand/10 hover:text-brand transition-colors cursor-pointer"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(prod._id)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Overlay */}
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-xl border border-gray-150 relative my-8">
              <button onClick={handleCloseModal} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 focus:outline-none">
                <X className="h-5 w-5" />
              </button>

              <h2 className="font-display text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">
                {editId ? 'Edit Product' : 'Add Product'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                {error && <div className="text-xs font-bold text-brand">{error}</div>}

                {/* Name / Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. GLOW"
                      className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Category *</label>
                    <select
                      required
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Product summary and details..."
                    className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                  />
                </div>

                {/* Status / Featured checkbox */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-150">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Display Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-1/2 rounded-xl border border-gray-300 bg-white px-3 py-1.5 text-xs focus:outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="h-4 w-4 text-brand focus:ring-brand border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="text-xs font-bold text-gray-700 select-none">
                      Show in Featured Products Grid
                    </label>
                  </div>
                </div>

                {/* Dynamic Specifications Editor */}
                <div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Technical Specifications
                    </label>
                    <button
                      type="button"
                      onClick={handleAddSpecRow}
                      className="flex items-center gap-1 text-[10px] font-bold text-brand hover:underline"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Row</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {specifications.map((spec, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          required
                          value={spec.key}
                          onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                          placeholder="Property (e.g. Wattage)"
                          className="w-1/2 rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-1.5 text-xs focus:outline-none"
                        />
                        <input
                          type="text"
                          required
                          value={spec.value}
                          onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                          placeholder="Value (e.g. 12W / 18W)"
                          className="w-1/2 rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-1.5 text-xs focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSpecRow(idx)}
                          className="text-gray-400 hover:text-rose-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Images Manager */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Product Images</label>
                  
                  {/* Upload new */}
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 rounded-xl border border-dashed border-gray-300 px-4 py-3 bg-[#FAF9F6] hover:bg-gray-50 cursor-pointer text-xs text-gray-500 font-bold shrink-0">
                      <Upload className="h-4 w-4 text-brand" />
                      <span>Upload Photos</span>
                      <input
                        type="file"
                        multiple
                        onChange={(e) => setImageFiles(e.target.files)}
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
                    {imageFiles && (
                      <span className="text-xs text-gray-500 font-semibold">{imageFiles.length} files selected</span>
                    )}
                  </div>

                  {/* Existing list */}
                  {existingImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-6 gap-2">
                      {existingImages.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg border border-gray-150 overflow-hidden bg-gray-50 group">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingImage(img)}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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
                    {submitting ? 'Saving...' : 'Save Product'}
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
export default ProductManagement;
