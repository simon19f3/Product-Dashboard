"use client";

import { useProduct } from "@/hooks/useProduct";
import { X, Star, Box, Tag, Factory, Info, Calendar } from "lucide-react";

interface ProductDetailsModalProps {
  productId: number;
  onClose: () => void;
}

export default function ProductDetailsModal({ productId, onClose }: ProductDetailsModalProps) {
  const { data: product, isLoading, error } = useProduct(productId);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--glass-bg)] backdrop-blur-lg p-4 transition-all duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-[var(--surface)] rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-[var(--surface-hover)] hover:bg-red-500/10 hover:text-red-500 rounded-full transition-colors z-10 text-[var(--foreground)] border border-[var(--glass-border)]"
        >
          <X size={20} />
        </button>

        {/* 🔴 SKELETON STATE */}
        {isLoading && (
          <div className="flex flex-col md:flex-row h-[70vh] animate-pulse">
            {/* Left: Image Skeleton */}
            <div className="w-full md:w-1/2 bg-[var(--surface-hover)] flex items-center justify-center border-r border-[var(--glass-border)]">
               <div className="w-48 h-48 bg-[var(--surface)] rounded-2xl opacity-50" />
            </div>
            {/* Right: Details Skeleton */}
            <div className="w-full md:w-1/2 p-8 space-y-6">
               <div className="flex gap-2">
                 <div className="h-6 w-20 bg-[var(--surface-hover)] rounded-full" />
                 <div className="h-6 w-16 bg-[var(--surface-hover)] rounded-full" />
               </div>
               <div className="h-10 w-3/4 bg-[var(--surface-hover)] rounded-lg" />
               <div className="h-8 w-1/3 bg-[var(--surface-hover)] rounded-lg" />
               <div className="space-y-2 pt-4">
                 <div className="h-4 w-full bg-[var(--surface-hover)] rounded" />
                 <div className="h-4 w-full bg-[var(--surface-hover)] rounded" />
                 <div className="h-4 w-2/3 bg-[var(--surface-hover)] rounded" />
               </div>
               <div className="mt-auto pt-8 space-y-4">
                 {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-4">
                      <div className="h-10 w-10 bg-[var(--surface-hover)] rounded-lg" />
                      <div className="flex-1 space-y-2">
                         <div className="h-3 w-16 bg-[var(--surface-hover)] rounded" />
                         <div className="h-4 w-32 bg-[var(--surface-hover)] rounded" />
                      </div>
                    </div>
                 ))}
               </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="h-72 flex flex-col items-center justify-center text-red-500 p-6 text-center">
            <p className="font-semibold text-lg">Failed to load product info.</p>
            <button onClick={onClose} className="mt-4 px-5 py-2 rounded-lg bg-[var(--primary)] text-white font-medium">Close</button>
          </div>
        )}

        {/* Success State */}
        {product && (
          <div className="flex flex-col md:flex-row h-full max-h-[75vh] overflow-y-auto animate-in fade-in zoom-in duration-300">
            {/* Left: Image */}
            <div className="w-full md:w-1/2 bg-[var(--surface-hover)] p-8 flex items-center justify-center border-r border-[var(--glass-border)]">
              <img 
                src={product.images?.[0] ?? product.thumbnail} 
                alt={product.title} 
                className="max-h-72 w-auto object-contain drop-shadow-lg" 
              />
            </div>

            {/* Right: Details */}
            <div className="w-full md:w-1/2 p-8 flex flex-col">
              <div className="mb-6">
                 <div className="flex items-center gap-2 mb-3">
                    <span className="bg-[var(--primary)]/10 text-[var(--primary)] text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                      <Tag size={12} /> {product.category}
                    </span>
                    <span className="flex items-center gap-1 text-orange-500 text-xs font-bold bg-orange-50 px-2.5 py-1 rounded-full">
                      <Star size={12} fill="currentColor" /> {product.rating} / 5
                    </span>
                 </div>
                 <h2 className="text-3xl font-bold text-[var(--foreground)] leading-tight mb-3">{product.title}</h2>
                 <div className="flex items-baseline gap-3">
                   <span className="text-base text-[var(--foreground)] opacity-50 line-through">{formatCurrency(product.price)}</span>
                   <span className="text-3xl font-bold text-[var(--primary)]">{formatCurrency(product.price * (1 - product.discountPercentage / 100))}</span>
                   <span className="text-xs font-bold bg-[var(--primary)]/20 text-[var(--primary)] px-2 py-1 rounded-md">-{product.discountPercentage}%</span>
                 </div>
              </div>

              <p className="text-[var(--foreground)] text-sm leading-relaxed mb-8 opacity-70 flex-grow">
                {product.description}
              </p>

              <div className="space-y-4 mt-auto pt-4 border-t border-[var(--glass-border)]">
                <DetailRow icon={<Factory size={16} className="text-[var(--primary)]"/>} label="Brand" value={product.brand || "Generic"} />
                <DetailRow icon={<Box size={16} className="text-[var(--primary)]"/>} label="Stock" value={`${product.stock} units available`} />
                <DetailRow icon={<Calendar size={16} className="text-[var(--primary)]"/>} label="Added" value={new Date().toLocaleDateString()} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }: any) {
  return (
    <div className="flex items-center gap-3 text-sm text-[var(--foreground)]">
      <span className="text-[var(--primary)]">{icon}</span>
      <div className="flex-1">
        <p className="text-xs font-bold uppercase opacity-50 tracking-wider">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}