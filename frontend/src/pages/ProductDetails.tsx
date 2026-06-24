import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api.js';
import { Product } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import { ArrowLeft, Send, CheckCircle, Tag, Eye } from 'lucide-react';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeImage, setActiveImage] = useState<string>('');

  // Inquiry Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Prefill details if user is logged in
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone || '');
    }
  }, [user]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await API.get(`/products/${id}`);
        if (response.data.success) {
          const prod: Product = response.data.data;
          setProduct(prod);
          if (prod.images && prod.images.length > 0) {
            setActiveImage(prod.images[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProductDetails();
  }, [id]);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const response = await API.post('/contact', {
        name,
        email,
        phone,
        subject: `Product Inquiry: ${product?.name}`,
        message: `Inquiry regarding ${product?.name} (Category: ${
          typeof product?.category === 'object' ? product?.category.name : 'N/A'
        }). Customer comments: ${message}`,
      });

      if (response.data.success) {
        setSuccess(true);
        setMessage('');
      } else {
        setError(response.data.message || 'Error submitting inquiry.');
      }
    } catch (err: any) {
      console.error('Inquiry submission error:', err);
      setError(err.response?.data?.message || 'Error communicating with server.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center bg-[#FAF9F6]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h2 className="text-2xl font-extrabold text-gray-800">Product Not Found</h2>
        <p className="text-gray-500 mt-2">The product you are trying to view does not exist or has been disabled.</p>
        <Link to="/products" className="mt-6 inline-flex items-center gap-1 text-brand font-bold uppercase hover:underline">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  const categoryName = typeof product.category === 'object' ? product.category.name : 'LED Lighting';

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link to="/products" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-brand uppercase mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Catalog</span>
        </Link>

        {/* Product Summary layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl p-8 border border-gray-150 shadow-sm">
          
          {/* Images Display Area */}
          <div className="flex flex-col gap-4">
            <div className="aspect-square w-full rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center relative">
              <img
                src={activeImage || 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=600'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-xs flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                <span>Zoom View</span>
              </div>
            </div>

            {/* Thumbnails grid */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`aspect-square rounded-lg border overflow-hidden bg-gray-50 ${
                      activeImage === img ? 'border-brand ring-2 ring-brand/10' : 'border-gray-200'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Texts details area */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand uppercase tracking-wider mb-3">
                <Tag className="h-3.5 w-3.5" />
                <span>{categoryName}</span>
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 uppercase tracking-tight">{product.name}</h1>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">{product.description}</p>

              {/* Technical Specifications Table */}
              {product.specifications && product.specifications.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-display text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 uppercase tracking-wide">
                    Technical Specifications
                  </h3>
                  <table className="mt-3 w-full border-collapse text-left text-xs">
                    <tbody>
                      {product.specifications.map((spec, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="px-4 py-2.5 font-bold text-gray-500 w-1/3 border border-gray-100">{spec.key}</td>
                          <td className="px-4 py-2.5 font-medium text-gray-800 border border-gray-100">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* BIS / Safety Badge */}
            <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-150 flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs text-gray-500 font-semibold">BIS Quality Tested Component • 3 Years Corporate Warranty</span>
            </div>
          </div>
        </div>

        {/* Prefilled Inquiry Launcher */}
        <div className="mt-12 bg-white rounded-3xl p-8 border border-gray-150 shadow-sm max-w-3xl">
          <h2 className="font-display text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">
            Direct Product Inquiry
          </h2>
          <p className="text-xs text-gray-500 mt-2 mb-6">
            Interested in adding {product.name} to your residential or commercial project? Complete the checklist below to receive layouts, trade pricing, and Dialux lighting simulations.
          </p>

          {success ? (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-250 p-6 flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-display font-bold text-emerald-800">Inquiry Submitted Successfully!</h4>
                <p className="text-xs text-emerald-600 mt-1">
                  Thank you. Our commercial engineers will review your request and get back with calculations within 24 working hours.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleInquirySubmit} className="space-y-4">
              {error && <div className="text-xs font-bold text-brand">{error}</div>}
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Message *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Hi RentaLite, I would like to request a quote, catalog, and Dialux simulation support for the ${product.name} fixtures...`}
                  className="w-full rounded-xl border border-gray-300 bg-[#FAF9F6] px-3 py-2 text-xs focus:ring-1 focus:ring-brand focus:outline-none"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-xs font-bold text-white hover:bg-brand-hover shadow-md disabled:bg-gray-400 hover:scale-102 transition-all cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{submitting ? 'Sending Request...' : 'Submit Inquiry'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProductDetails;
