import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api.js';
import { Product, Category } from '../types/index.js';
import { ProductCard } from '../components/ProductCard.js';
import { SlidersHorizontal, Search, RefreshCw, AlertCircle } from 'lucide-react';

export const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected filters from searchParams
  const selectedCategory = searchParams.get('category') || '';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await API.get('/categories');
        if (response.data.success) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `/products?status=Active`;
        if (selectedCategory) {
          url += `&category=${selectedCategory}`;
        }
        if (searchQuery) {
          url += `&search=${searchQuery}`;
        }
        
        const response = await API.get(url);
        if (response.data.success) {
          setProducts(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const handleCategorySelect = (slug: string) => {
    if (slug) {
      setSearchParams({ category: slug });
    } else {
      setSearchParams({});
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSearchParams({});
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Page title banner */}
        <div className="border-b border-gray-200 pb-5 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Product Catalog</h1>
            <p className="text-sm text-gray-500 mt-1">Explore our range of architectural spot lights, cylinder housings, and power transformers.</p>
          </div>
          
          {/* Dynamic Search box */}
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-150 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2 font-display font-bold text-gray-900 text-sm">
                  <SlidersHorizontal className="h-4 w-4 text-brand" />
                  <span>Filters</span>
                </div>
                {(selectedCategory || searchQuery) && (
                  <button
                    onClick={handleResetFilters}
                    className="flex items-center gap-1 text-[11px] font-bold text-brand hover:underline uppercase"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Categories list */}
              <div>
                <h3 className="font-display text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Categories</h3>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleCategorySelect('')}
                    className={`text-left text-sm font-semibold px-3 py-2 rounded-xl transition-all ${
                      !selectedCategory
                        ? 'bg-brand/10 text-brand font-bold'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-brand'
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => handleCategorySelect(cat.slug)}
                      className={`text-left text-sm font-semibold px-3 py-2 rounded-xl transition-all ${
                        selectedCategory === cat.slug
                          ? 'bg-brand/10 text-brand font-bold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-brand'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Catalog grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center py-24">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand border-t-transparent"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-200 p-8 text-center shadow-sm">
                <AlertCircle className="h-12 w-12 text-gray-300 mb-3" />
                <h3 className="font-display text-lg font-bold text-gray-800">No Products Found</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-md">
                  No matching active products found. Try modifying your search criteria or reset filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-6 rounded-full bg-brand px-6 py-2.5 text-xs font-bold text-white hover:bg-brand-hover shadow-md transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Products;
