import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api.js';
import { Category } from '../types/index.js';
import { Layers, ArrowRight } from 'lucide-react';

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await API.get('/categories');
        if (response.data.success) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand/10 border border-brand/20 px-4 py-1 text-xs font-bold text-brand uppercase tracking-wider mb-3">
            <Layers className="h-3.5 w-3.5" />
            <span>Product Classifications</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Explore Categories</h1>
          <p className="mt-4 text-gray-500 text-sm">
            Browse our curated ranges of high-efficiency architectural lighting fixtures, profiles, and driving systems.
          </p>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200">
            <p className="text-gray-500 font-medium">No categories found. Run database seeder to initialize.</p>
          </div>
        ) : (
          /* Grid of Categories */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => {
              const imageSrc = category.image || 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&q=80&w=400';
              return (
                <div
                  key={category._id}
                  className="group relative flex flex-col rounded-2xl bg-white border border-gray-150 overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-brand/30"
                >
                  {/* Category Image Zoom */}
                  <div className="zoom-container aspect-square relative bg-gray-50 w-full flex items-center justify-center border-b border-gray-100">
                    <img
                      src={imageSrc}
                      alt={category.name}
                      className="zoom-image h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="font-display text-xl font-bold tracking-tight uppercase">
                        {category.name}
                      </h3>
                    </div>
                  </div>

                  {/* Description and Action Link */}
                  <div className="flex flex-1 flex-col p-5">
                    <p className="flex-1 text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {category.description || 'Premium commercial and residential lighting solutions.'}
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <Link
                        to={`/products?category=${category.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand uppercase tracking-wider group-hover:text-brand-hover"
                      >
                        <span>View Catalog</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
export default Categories;
