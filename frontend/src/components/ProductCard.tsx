import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types/index.js';
import { ArrowRight, Tag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Use fallback dummy image if none is loaded or if it's relative but served locally
  const imageSrc =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=500';

  // Get category name
  const categoryName = typeof product.category === 'object' ? product.category.name : 'LED Lighting';

  // Find wattage or display standard specs
  const wattageSpec = product.specifications.find((s) => s.key.toLowerCase() === 'wattage')?.value || 'Premium LED';

  return (
    <div className="group relative flex flex-col rounded-2xl bg-white border border-gray-150 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md glow-hover overflow-hidden">
      {/* Category Badge overlay */}
      <div className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
        <Tag className="h-3.5 w-3.5 text-brand" />
        <span>{categoryName}</span>
      </div>

      {/* Image Container with zoom */}
      <div className="zoom-container relative aspect-square w-full bg-gray-50 border-b border-gray-100 flex items-center justify-center">
        <img
          src={imageSrc}
          alt={product.name}
          className="zoom-image h-full w-full object-cover"
        />
        
        {/* Specification pill */}
        <div className="absolute right-3 bottom-3 rounded-md bg-white px-2.5 py-1 text-xs font-extrabold text-gray-800 shadow-sm border border-gray-100">
          {wattageSpec}
        </div>
      </div>

      {/* Product Text Details */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1">
          <h3 className="font-display text-lg font-bold text-gray-900 group-hover:text-brand transition-colors uppercase">
            {product.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-gray-500 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* View Details action */}
        <div className="mt-5 border-t border-gray-100 pt-4 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-brand">
            View Specifications
          </span>
          <Link
            to={`/products/${product.slug || product._id}`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-all group-hover:bg-brand group-hover:text-white"
          >
            <ArrowRight className="h-4.5 w-4.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
