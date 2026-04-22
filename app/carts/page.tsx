"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { useCarts } from "@/hooks/useCarts";
import { 
  LayoutGrid, 
  List as ListIcon, 
  User, 
  ShoppingCart, 
  ArrowRight, 
  Tag,
  ChevronLeft,
  ChevronRight,
  WifiOff,
  RefreshCcw
} from "lucide-react";

// Helper to format currency
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export default function CartsPage() {
  // --- STATE ---
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(0);
  const pageSize = 9; 

  // --- DATA FETCHING ---
  const { data, isLoading, isPlaceholderData, error, refetch } = useCarts({
    skip: page * pageSize,
    limit: pageSize
  });

  const carts = data?.carts || [];
  const totalItems = data?.total || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  // --- HANDLERS ---
  const handlePrev = () => setPage((old) => Math.max(old - 1, 0));
  const handleNext = () => {
    if (!isPlaceholderData && (page + 1) < totalPages) {
      setPage((old) => old + 1);
    }
  };

  // 🔴 1. LOADING SKELETON
  if (isLoading) {
    return <CartsSkeleton />;
  }

  // 🔴 2. ERROR STATE UI
  if (error) {
    return (
      <DashboardLayout pageName="All Carts">
        <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
          <div className="p-6 bg-[var(--surface)] border border-[var(--glass-border)] rounded-full shadow-lg">
            <WifiOff size={48} className="text-[var(--primary)] opacity-80" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Connection Failed</h2>
            <p className="text-[var(--foreground)] opacity-60 max-w-md mx-auto">
              We couldn't reach the server. Please check your internet connection and try again.
            </p>
          </div>
          <button 
            onClick={() => refetch()}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-white font-medium rounded-xl hover:bg-[var(--primary-light)] transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <RefreshCcw size={18} />
            Retry Connection
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageName="All Carts">
      <div className="space-y-6">
        
        {/* --- Header & Controls --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[var(--glass-bg)] p-4 rounded-2xl border border-[var(--glass-border)] backdrop-blur-md">
          <div>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Cart History</h2>
            <p className="text-sm text-[var(--foreground)] opacity-60">
              Showing {carts.length > 0 ? page * pageSize + 1 : 0} - {Math.min((page + 1) * pageSize, totalItems)} of {totalItems} orders
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-[var(--surface)] p-1 rounded-xl border border-[var(--glass-border)]">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid" 
                    ? "bg-[var(--glass-bg)] shadow-sm text-[var(--primary)]" 
                    : "text-[var(--foreground)] opacity-50 hover:opacity-100"
                }`}
              >
                <LayoutGrid size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list" 
                    ? "bg-[var(--glass-bg)] shadow-sm text-[var(--primary)]" 
                    : "text-[var(--foreground)] opacity-50 hover:opacity-100"
                }`}
              >
                <ListIcon size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* --- Content Area --- */}
        <div className={
          viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" 
            : "flex flex-col gap-4"
        }>
          {carts.map((cart: any) => (
            viewMode === "grid" 
              ? <CartGridCard key={cart.id} cart={cart} />
              : <CartListCard key={cart.id} cart={cart} />
          ))}
        </div>

        {/* --- Pagination Controls --- */}
        {/* --- Pagination Controls --- */}
        <div className="flex justify-between items-center bg-[var(--glass-bg)] p-3 sm:p-4 rounded-2xl border border-[var(--glass-border)] backdrop-blur-md">
          
          <button
            onClick={handlePrev}
            disabled={page === 0}
            className="flex items-center gap-2 px-3 py-2 sm:px-4 rounded-xl text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--surface-hover)] text-[var(--foreground)] active:scale-95"
            aria-label="Previous Page"
          >
            <ChevronLeft size={18} />
            {/* Hidden on mobile, visible on small screens and up */}
            <span className="hidden sm:inline">Previous</span>
          </button>

          <span className="text-xs sm:text-sm font-medium text-[var(--foreground)] opacity-80">
            Page {page + 1} of {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={page >= totalPages - 1}
            className="flex items-center gap-2 px-3 py-2 sm:px-4 rounded-xl text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--surface-hover)] text-[var(--foreground)] active:scale-95"
            aria-label="Next Page"
          >
            {/* Hidden on mobile, visible on small screens and up */}
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={18} />
          </button>
        </div>

      </div>
    </DashboardLayout>
  );
}

// ----------------------------------------------------------------------
// 🦴 SKELETON COMPONENT
// ----------------------------------------------------------------------
function CartsSkeleton() {
  return (
    <DashboardLayout pageName="All Carts">
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="h-20 bg-[var(--surface)] rounded-2xl border border-[var(--glass-border)]" />
        
        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="h-80 bg-[var(--surface)] rounded-2xl border border-[var(--glass-border)] relative overflow-hidden">
              <div className="h-48 bg-[var(--surface-hover)] w-full" />
              <div className="p-5 space-y-3">
                <div className="h-4 w-1/3 bg-[var(--surface-hover)] rounded" />
                <div className="h-4 w-2/3 bg-[var(--surface-hover)] rounded" />
                <div className="h-8 w-full bg-[var(--surface-hover)] rounded mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

// ----------------------------------------------------------------------
// 🔲 GRID VIEW CARD
// ----------------------------------------------------------------------
function CartGridCard({ cart }: { cart: any }) {
  const firstProduct = cart.products[0];
  const itemsCount = cart.totalQuantity; 
  const distinctProducts = cart.totalProducts;

  return (
    <div className="group relative flex flex-col h-full overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-gradient-to-br from-[var(--glass-bg)] to-[var(--surface)] backdrop-blur-xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-[var(--primary)]">
      
      {/* Image Header */}
      <div className="h-48 w-full bg-[var(--surface)]/50 relative overflow-hidden flex items-center justify-center p-6">
        {firstProduct ? (
          <img 
            src={firstProduct.thumbnail} 
            alt={firstProduct.title} 
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-md z-0"
          />
        ) : (
          <ShoppingCart className="text-gray-300 w-12 h-12" />
        )}
        
        {/* 🔴 3. FIXED DISCOUNT BADGE */}
        {/* Added z-10 to stay on top, max-w to truncate, and moved to top-2 right-2 */}
        <div className="absolute top-2 right-2 z-10 bg-[var(--primary)]/90 backdrop-blur-md text-white text-[10px] uppercase font-bold px-2 py-1 rounded-lg shadow-lg flex items-center gap-1 max-w-[120px]">
          <Tag size={10} className="flex-shrink-0" />
          <span className="truncate">Save {formatCurrency(cart.total - cart.discountedTotal)}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs font-bold bg-[var(--surface-hover)] text-[var(--primary)] px-2 py-1 rounded-md">
            #{cart.id}
          </span>
          <div className="flex items-center gap-1 text-xs text-[var(--foreground)] opacity-60">
            <User size={12} />
            <span>User {cart.userId}</span>
          </div>
        </div>

        <p className="text-[var(--foreground)] font-semibold mb-1">
          {itemsCount} items <span className="text-[var(--primary)]">•</span> {distinctProducts} products
        </p>
        <p className="text-xs text-[var(--foreground)] opacity-50 mb-5 line-clamp-1">
          {firstProduct.title} {cart.totalProducts > 1 ? `& ${cart.totalProducts - 1} more` : ''}
        </p>

        <div className="mt-auto pt-4 border-t border-[var(--glass-border)] flex items-end justify-between">
          <div>
             <p className="text-xs text-[var(--foreground)] opacity-40 line-through">{formatCurrency(cart.total)}</p>
             <p className="text-xl font-bold text-[var(--foreground)]">{formatCurrency(cart.discountedTotal)}</p>
          </div>
          
          <Link 
            href={`/carts/${cart.id}`}
            className="p-2.5 rounded-full bg-[var(--surface-hover)] text-[var(--foreground)] group-hover:bg-[var(--primary)] group-hover:text-white transition-colors duration-300 shadow-sm"
          >
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 📜 LIST VIEW CARD
// ----------------------------------------------------------------------
function CartListCard({ cart }: { cart: any }) {
  const firstProduct = cart.products[0];

  return (
    <div className="group relative bg-gradient-to-r from-[var(--glass-bg)] to-[var(--surface)] border border-[var(--glass-border)] rounded-xl p-4 transition-all duration-300 hover:border-[var(--primary)] hover:shadow-md flex flex-col sm:flex-row items-center gap-6">
      
      {/* Thumbnail */}
      <div className="w-full sm:w-20 h-20 bg-[var(--surface)] rounded-lg flex-shrink-0 flex items-center justify-center border border-[var(--glass-border)] overflow-hidden">
         <img 
            src={firstProduct?.thumbnail} 
            alt="Product" 
            className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-110"
          />
      </div>

      {/* Info */}
      <div className="flex-1 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-3 mb-1">
          <h3 className="font-bold text-[var(--foreground)]">Order #{cart.id}</h3>
          <span className="text-[10px] uppercase font-bold bg-[var(--surface-hover)] text-[var(--foreground)] px-2 py-0.5 rounded-full flex items-center gap-1 opacity-70">
            <User size={10} /> {cart.userId}
          </span>
        </div>
        
        <p className="text-sm text-[var(--foreground)] opacity-80">
          Contains <strong className="text-[var(--primary)]">{cart.totalQuantity} items</strong>
        </p>
        <p className="text-xs text-[var(--foreground)] opacity-50 mt-1">
          {firstProduct.title} ...
        </p>
      </div>

      {/* Pricing & Action */}
      <div className="flex flex-col items-center sm:items-end gap-2 min-w-[140px]">
        <div className="text-right">
          <span className="block text-xs text-[var(--foreground)] opacity-40 line-through">{formatCurrency(cart.total)}</span>
          <span className="block text-xl font-bold text-[var(--foreground)]">{formatCurrency(cart.discountedTotal)}</span>
          <span className="text-[10px] font-bold text-[var(--primary)]">
             Saved {formatCurrency(cart.total - cart.discountedTotal)}
          </span>
        </div>
        
        <Link href={`/carts/${cart.id}`} className="text-sm font-medium text-[var(--primary)] hover:underline flex items-center gap-1">
          View Details <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}