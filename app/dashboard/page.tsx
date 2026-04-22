"use client";

import { useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useCarts } from "@/hooks/useCarts";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  RadialBarChart,
  RadialBar,
} from "recharts";
import {
  DollarSign,
  Percent,
  Layers,
  ShoppingCart,
  TrendingUp,
  Package,
  ArrowUpRight,
  WifiOff,
  RefreshCcw
} from "lucide-react";
// import { DashboardSkeleton } from "@/components/DashboardSkeleton"; // Assuming you extracted this or kept it in file

// Helper to format currency
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export default function DashboardPage() {
  const { data, isLoading, error, refetch } = useCarts();

  // Process data for Metrics, Charts, and Table
  const dashboardData = useMemo(() => {
    if (!data || !data.carts) return null;

    const carts = data.carts;
    const totalCarts = data.total || carts.length;

    // 1. Calculate Metrics
    const totalRevenue = carts.reduce((acc: number, cart: any) => acc + cart.discountedTotal, 0);
    const sumOfTotalRaw = carts.reduce((acc: number, cart: any) => acc + cart.total, 0);
    const totalDiscountSavings = sumOfTotalRaw - totalRevenue;
    const avgOrderValue = carts.length > 0 ? sumOfTotalRaw / carts.length : 0;
    const totalProductsAdded = carts.reduce((acc: number, cart: any) => acc + cart.totalProducts, 0);
    const totalQuantityOrdered = carts.reduce((acc: number, cart: any) => acc + cart.totalQuantity, 0);

    // 2. Prepare Chart Data
    const lineBarData = carts.slice(0, 10).map((cart: any) => ({
      name: `Cart #${cart.id}`,
      revenue: cart.discountedTotal,
      products: cart.totalProducts,
    }));

    // Radial Data
    const radialColors = [
      "#ABC41D", "#8E9E24", "#727D22", "#546618", "#4C5215", "#D4E66A", "#E8F0A8"
    ];

    const radialData = carts
      .map((cart: any) => ({
        name: `Cart #${cart.id}`,
        discountRatio: parseFloat(((1 - cart.discountedTotal / cart.total) * 100).toFixed(1)),
        fill: "#ABC41D"
      }))
      .sort((a: any, b: any) => b.discountRatio - a.discountRatio)
      .slice(0, 7)
      .map((item: any, index: number) => ({
        ...item,
        fill: radialColors[index % radialColors.length]
      }));

    return {
      carts: carts.slice(0, 5),
      metrics: {
        totalCarts,
        totalRevenue,
        totalDiscountSavings,
        avgOrderValue,
        totalProductsAdded,
        totalQuantityOrdered,
      },
      lineBarData,
      radialData,
    };
  }, [data]);

  // --- LOADING & ERROR STATES ---
  if (isLoading) return <DashboardSkeleton />;
  
  if (error) {
    return (
      <DashboardLayout pageName="Dashboard">
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

  if (!dashboardData) return null;

  const { metrics, lineBarData, radialData, carts } = dashboardData;

  return (
    <DashboardLayout pageName="Dashboard">
      <div className="space-y-8">
        
        {/* --- Top Metrics Cards --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          <MetricCard title="Total Revenue" value={formatCurrency(metrics.totalRevenue)} icon={<DollarSign className="h-6 w-6 text-[var(--primary)]" />} trend="+12.5%" />
          <MetricCard title="Total Savings" value={formatCurrency(metrics.totalDiscountSavings)} icon={<Percent className="h-6 w-6 text-green-500" />} trend="Savings" />
          <MetricCard title="Total Carts" value={metrics.totalCarts} icon={<ShoppingCart className="h-6 w-6 text-orange-500" />} />
          <MetricCard title="Avg Order Value" value={formatCurrency(metrics.avgOrderValue)} icon={<TrendingUp className="h-6 w-6 text-blue-500" />} />
          <MetricCard title="Products Sold" value={metrics.totalProductsAdded} icon={<Package className="h-6 w-6 text-purple-500" />} />
          <MetricCard title="Total Items" value={metrics.totalQuantityOrdered} icon={<Layers className="h-6 w-6 text-pink-500" />} />
        </div>

        {/* --- Charts Section --- */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          {/* 📊 Revenue per Cart (Bar Chart) */}
          <div className="bg-[var(--glass-bg)] backdrop-blur-xl p-6 rounded-2xl border border-[var(--glass-border)] shadow-sm min-w-0">
            <h3 className="text-lg font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
              <DollarSign size={18} className="text-[var(--primary)]" />
              Revenue per Cart
            </h3>
            
            {/* 🟢 FIX: Added overflow-x-auto and min-w to inner container */}
            <div className="w-full overflow-x-auto pb-2">
              <div className="h-72 min-w-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={lineBarData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--glass-border)" />
                    <XAxis dataKey="name" hide />
                    <YAxis stroke="var(--foreground)" fontSize={12} tickFormatter={(val) => `$${val}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="revenue" 
                      fill="var(--primary)" 
                      radius={[4, 4, 0, 0]} 
                      barSize={30}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 📉 Discount Ratio (Radial Chart) */}
          <div className="bg-[var(--glass-bg)] backdrop-blur-xl p-6 rounded-2xl border border-[var(--glass-border)] shadow-sm min-w-0">
            <h3 className="text-lg font-bold text-[var(--foreground)] mb-2 flex items-center gap-2">
              <Percent size={18} className="text-[var(--primary)]" />
              Top Discount Ratios
            </h3>
            
            {/* 🟢 FIX: Added overflow-x-auto and min-w to inner container */}
            <div className="w-full overflow-x-auto pb-2">
              <div className="h-72 min-w-[450px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    cx="50%" 
                    cy="50%" 
                    innerRadius="20%" 
                    outerRadius="100%" 
                    barSize={15} 
                    data={radialData}
                  >
                    <RadialBar
                      label={{ position: 'insideStart', fill: '#fff', fontSize: 10, fontWeight: 'bold' }}
                      background={{ fill: 'var(--surface-hover)' }}
                      dataKey="discountRatio"
                      cornerRadius={10}
                    />
                    <Legend 
                      iconSize={10} 
                      layout="vertical" 
                      verticalAlign="middle" 
                      wrapperStyle={{ right: 0, fontSize: '12px', color: 'var(--foreground)' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 📈 Products Trend (Line Chart) */}
          <div className="bg-[var(--glass-bg)] backdrop-blur-xl p-6 rounded-2xl border border-[var(--glass-border)] shadow-sm xl:col-span-2 min-w-0">
            <h3 className="text-lg font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
              <Layers size={18} className="text-[var(--primary)]" />
              Products Quantity Trend
            </h3>
            
            {/* 🟢 FIX: Added overflow-x-auto and min-w to inner container */}
            <div className="w-full overflow-x-auto pb-2">
              <div className="h-72 min-w-[600px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineBarData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--glass-border)" />
                    <XAxis dataKey="name" hide />
                    <YAxis stroke="var(--foreground)" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="products" 
                      stroke="var(--primary)" 
                      strokeWidth={3} 
                      dot={{ fill: 'var(--background)', stroke: 'var(--primary)', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: 'var(--primary)' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>

        {/* --- Table Section --- */}
        <div className="bg-[var(--glass-bg)] backdrop-blur-xl rounded-2xl border border-[var(--glass-border)] overflow-hidden shadow-sm min-w-0">
          <div className="p-6 border-b border-[var(--glass-border)] bg-[var(--surface)]/50">
            <h3 className="text-lg font-bold text-[var(--foreground)]">Latest Orders</h3>
          </div>
          {/* Table handles its own scrolling via overflow-x-auto on this wrapper */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-[var(--foreground)]">
              <thead className="text-xs uppercase bg-[var(--surface)] opacity-70">
                <tr>
                  <th className="px-6 py-4 whitespace-nowrap">Cart ID</th>
                  <th className="px-6 py-4 whitespace-nowrap">Items</th>
                  <th className="px-6 py-4 whitespace-nowrap">Total Price</th>
                  <th className="px-6 py-4 whitespace-nowrap">Discounted</th>
                  <th className="px-6 py-4 whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--glass-border)]">
                {carts.map((cart: any, index: number) => (
                  <tr key={cart.id} className="hover:bg-[var(--surface-hover)] transition-colors">
                    <td className="px-6 py-4 font-bold">#{cart.id}</td>
                    <td className="px-6 py-4">{cart.totalProducts}</td>
                    <td className="px-6 py-4 opacity-50 line-through">{formatCurrency(cart.total)}</td>
                    <td className="px-6 py-4 font-bold text-[var(--primary)]">{formatCurrency(cart.discountedTotal)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase
                        ${index % 3 === 0 ? 'bg-green-500/10 text-green-500' : 
                          index % 3 === 1 ? 'bg-blue-500/10 text-blue-500' : 
                          'bg-yellow-500/10 text-yellow-500'}`
                      }>
                        {index % 3 === 0 ? 'Completed' : index % 3 === 1 ? 'Processing' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

// ---------------------------------------------
// SKELETON COMPONENT (Same as before)
// ---------------------------------------------
function DashboardSkeleton() {
  return (
    <DashboardLayout pageName="Dashboard">
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[var(--surface)] h-32 rounded-2xl border border-[var(--glass-border)] p-6">
              <div className="h-4 w-24 bg-[var(--surface-hover)] rounded mb-4" />
              <div className="h-8 w-16 bg-[var(--surface-hover)] rounded mb-2" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-[var(--surface)] h-80 rounded-2xl border border-[var(--glass-border)] p-6">
             <div className="h-6 w-32 bg-[var(--surface-hover)] rounded mb-6" />
             <div className="h-60 w-full bg-[var(--surface-hover)] rounded" />
          </div>
          <div className="bg-[var(--surface)] h-80 rounded-2xl border border-[var(--glass-border)] p-6">
             <div className="h-6 w-32 bg-[var(--surface-hover)] rounded mb-6" />
             <div className="h-60 w-full rounded-full bg-[var(--surface-hover)] mx-auto aspect-square" />
          </div>
        </div>
        <div className="bg-[var(--surface)] h-96 rounded-2xl border border-[var(--glass-border)] p-6">
           <div className="h-6 w-48 bg-[var(--surface-hover)] rounded mb-6" />
           <div className="space-y-4">
             {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 w-full bg-[var(--surface-hover)] rounded" />
             ))}
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Sub-components
function MetricCard({ title, value, icon, trend }: any) {
  return (
    <div className="bg-[var(--glass-bg)] backdrop-blur-xl p-6 rounded-2xl border border-[var(--glass-border)] shadow-sm hover:-translate-y-1 transition-transform duration-300 min-w-0">
      <div className="flex justify-between items-start">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[var(--foreground)] opacity-60 truncate">{title}</p>
          <h4 className="text-3xl font-bold text-[var(--foreground)] mt-2 truncate">{value}</h4>
          {trend && (
             <div className="flex items-center gap-1 mt-2 text-xs font-bold text-[var(--primary)]">
               <ArrowUpRight size={12} /> {trend}
             </div>
          )}
        </div>
        <div className="p-3 bg-[var(--surface)] border border-[var(--glass-border)] rounded-xl text-[var(--foreground)] flex-shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--surface)] border border-[var(--glass-border)] p-4 rounded-xl shadow-xl backdrop-blur-md z-50">
        <p className="text-sm font-bold text-[var(--foreground)] mb-2">{label || payload[0].name}</p>
        {payload.map((entry: any, index: number) => (
           <p key={index} className="text-xs text-[var(--foreground)] flex items-center gap-2">
             <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }}></span>
             {entry.name}: <span className="font-bold">{entry.value}</span>
             {entry.name === 'revenue' && '$'}
             {entry.name === 'discountRatio' && '%'}
           </p>
        ))}
      </div>
    );
  }
  return null;
};