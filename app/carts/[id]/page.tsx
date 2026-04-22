"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useCarts } from "@/hooks/useCarts"; 
import UserProfileBadge from "@/components/UserProfileBadge";
import ProductDetailsModal from "@/components/ProductDetailsModal";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  ArrowLeft, Package, CreditCard, Tag, AlertCircle, Info 
} from "lucide-react";

// Helper for currency
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

export default function CartDetailsPage() {
  const params = useParams();
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const { data, isLoading, error } = useCarts();

  const cart = useMemo(() => {
    if (!data || !data.carts) return null;
    return data.carts.find((c: any) => c.id === Number(params.id));
  }, [data, params.id]);

  // 🔴 1. NEW SKELETON STATE
  if (isLoading) {
    return <CartDetailsSkeleton />;
  }

  // --- NOT FOUND STATE ---
  if (!cart) {
    return (
      <DashboardLayout pageName="Not Found">
        <div className="h-96 flex flex-col items-center justify-center text-[var(--foreground)]">
          <AlertCircle size={48} className="mb-4 text-red-500" />
          <h2 className="text-xl font-bold">Cart #{params.id} Not Found</h2>
          <Link href="/carts" className="mt-4 text-[var(--primary)] hover:underline">
            Return to Cart History
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageName={`Order #${cart.id}`}>
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation */}
        <Link 
          href="/carts" 
          className="inline-flex items-center text-sm font-medium text-[var(--foreground)] opacity-60 hover:opacity-100 hover:text-[var(--primary)] transition-all"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to carts
        </Link>

        {/* --- Top Summary Card --- */}
        <div className="relative z-20 bg-[var(--glass-bg)] backdrop-blur-xl rounded-2xl shadow-sm border border-[var(--glass-border)] p-6 md:p-8">
           
           <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-[var(--glass-border)] pb-6 mb-6">
             <div>
               <div className="flex items-center gap-3 mb-4">
                 <h1 className="text-3xl font-bold text-[var(--foreground)]">Cart #{cart.id}</h1>
                 <span className="bg-[var(--surface-hover)] text-[var(--foreground)] border border-[var(--glass-border)] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                   Completed
                 </span>
               </div>
               
               <div>
                  <p className="text-[10px] text-[var(--foreground)] opacity-50 uppercase font-bold mb-2 tracking-widest">
                    Customer
                  </p>
                  <UserProfileBadge userId={cart.userId} />
               </div>
             </div>

             <div className="text-left md:text-right">
                <p className="text-sm text-[var(--foreground)] opacity-60 mb-1">Grand Total</p>
                <h2 className="text-4xl font-bold text-[var(--primary)] tracking-tight">
                  {formatCurrency(cart.discountedTotal)}
                </h2>
                <div className="flex items-center justify-end gap-2 mt-2">
                  <span className="text-xs font-medium text-[var(--foreground)] bg-[var(--primary)]/20 px-2 py-1 rounded text-right">
                    You Saved {formatCurrency(cart.total - cart.discountedTotal)}
                  </span>
                </div>
             </div>
           </div>

           {/* Stats Grid */}
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatBox icon={<Package size={20}/>} label="Total Items" value={cart.totalQuantity} />
              <StatBox icon={<CreditCard size={20}/>} label="Subtotal (Raw)" value={formatCurrency(cart.total)} />
              <StatBox icon={<Tag size={20}/>} label="Unique Products" value={cart.totalProducts} />
           </div>
        </div>

        {/* --- Product List Table --- */}
        <div className="relative z-10 bg-[var(--glass-bg)] backdrop-blur-xl rounded-2xl shadow-sm border border-[var(--glass-border)] overflow-hidden">
          <div className="p-6 border-b border-[var(--glass-border)] bg-[var(--surface)]/30">
            <h3 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
              <Package size={20} className="text-[var(--primary)]" />
              Products in this Order
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[var(--surface)] text-xs text-[var(--foreground)] opacity-70 uppercase border-b border-[var(--glass-border)]">
                <tr>
                  <th className="px-6 py-4 font-semibold tracking-wider">Product Details</th>
                  <th className="px-6 py-4 text-center font-semibold tracking-wider">Qty</th>
                  <th className="px-6 py-4 text-right font-semibold tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--glass-border)]">
                {cart.products.map((product: any) => (
                  <tr key={product.id} className="hover:bg-[var(--surface-hover)] transition-colors group">
                    <td className="px-6 py-4">
                      <div 
                        onClick={() => setSelectedProductId(product.id)}
                        className="flex items-center gap-4 cursor-pointer"
                      >
                        <div className="h-16 w-16 flex-shrink-0 border border-[var(--glass-border)] rounded-xl bg-[var(--background)] p-1 group-hover:border-[var(--primary)] transition-colors duration-300">
                          <img src={product.thumbnail} alt={product.title} className="h-full w-full object-contain" />
                        </div>
                        <div className="group-hover:translate-x-2 transition-transform duration-300">
                          <p className="font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] flex items-center gap-2 text-lg">
                            {product.title}
                            <Info size={16} className="text-[var(--primary)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"/>
                          </p>
                          <div className="flex items-center gap-3 mt-1.5">
                             <span className="text-xs text-[var(--foreground)] opacity-50 font-mono">ID: {product.id}</span>
                             {product.discountPercentage > 0 && (
                               <span className="text-[10px] font-bold bg-[var(--primary)] text-white px-2 py-0.5 rounded-full">
                                 -{product.discountPercentage}% OFF
                               </span>
                             )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-[var(--surface)] border border-[var(--glass-border)] text-[var(--foreground)] px-3 py-1 rounded-lg text-sm font-bold">x{product.quantity}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-bold text-[var(--foreground)] text-lg">{formatCurrency(product.discountedTotal)}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedProductId && (
        <ProductDetailsModal 
          productId={selectedProductId} 
          onClose={() => setSelectedProductId(null)} 
        />
      )}
    </DashboardLayout>
  );
}

// ----------------------------------------------------------------------
// 🦴 CART DETAILS SKELETON
// ----------------------------------------------------------------------
function CartDetailsSkeleton() {
  return (
    <DashboardLayout pageName="Loading Order...">
      <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
        
        {/* Nav Skeleton */}
        <div className="h-4 w-32 bg-[var(--surface-hover)] rounded" />

        {/* Summary Card Skeleton */}
        <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl p-8">
           <div className="flex justify-between items-start mb-8 pb-8 border-b border-[var(--glass-border)]">
             <div className="space-y-4">
               <div className="h-10 w-48 bg-[var(--surface-hover)] rounded-lg" />
               <div className="h-12 w-40 bg-[var(--surface-hover)] rounded-full" />
             </div>
             <div className="space-y-2 flex flex-col items-end">
               <div className="h-4 w-20 bg-[var(--surface-hover)] rounded" />
               <div className="h-12 w-64 bg-[var(--surface-hover)] rounded-lg" />
             </div>
           </div>
           {/* Stats */}
           <div className="grid grid-cols-3 gap-4">
             {[1, 2, 3].map((i) => (
               <div key={i} className="h-20 bg-[var(--surface-hover)] rounded-xl border border-[var(--glass-border)]" />
             ))}
           </div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl overflow-hidden">
          <div className="h-16 bg-[var(--surface)] border-b border-[var(--glass-border)]" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-6 flex items-center gap-6 border-b border-[var(--glass-border)]">
              <div className="h-16 w-16 bg-[var(--surface-hover)] rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-6 w-1/3 bg-[var(--surface-hover)] rounded" />
                <div className="h-4 w-1/4 bg-[var(--surface-hover)] rounded" />
              </div>
              <div className="h-8 w-24 bg-[var(--surface-hover)] rounded" />
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

// Helper (StatBox)
function StatBox({ icon, label, value }: { icon: any, label: string, value: string | number }) {
  return (
    <div className="p-4 bg-[var(--surface)] border border-[var(--glass-border)] rounded-xl flex items-center gap-4">
      <div className="p-3 bg-[var(--background)] text-[var(--primary)] rounded-full border border-[var(--glass-border)]">{icon}</div>
      <div>
         <p className="text-[10px] uppercase font-bold text-[var(--foreground)] opacity-50 tracking-wider">{label}</p>
         <p className="text-xl font-bold text-[var(--foreground)]">{value}</p>
      </div>
    </div>
  );
}