"use client";

import React from 'react';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

interface ChartsProps {
  monthlyRevenue: any[];
  orderStatusCount: {
    NEW: number;
    WORKING: number;
    REVIEW: number;
    REVISION: number;
    APPROVAL: number;
    COMPLETED: number;
  };
  paymentStatusCount: {
    PAID: number;
    PARTIAL: number;
    PENDING: number;
    OVERDUE: number;
  };
}

export default function DashboardCharts({ monthlyRevenue, orderStatusCount, paymentStatusCount }: ChartsProps) {
  
  // Mapped project status data
  const projectStatusData = [
    { name: 'New', value: orderStatusCount.NEW || 0, color: '#A1A1AA' },
    { name: 'Designing', value: orderStatusCount.WORKING || 0, color: '#6C4CF1' },
    { name: 'Review', value: orderStatusCount.REVIEW || 0, color: '#3B82F6' },
    { name: 'Revision', value: orderStatusCount.REVISION || 0, color: '#F59E0B' },
    { name: 'Approval', value: orderStatusCount.APPROVAL || 0, color: '#8B5CF6' },
    { name: 'Completed', value: orderStatusCount.COMPLETED || 0, color: '#10B981' }
  ].filter(d => d.value > 0);

  // Mapped payment status data
  const paymentStatusData = [
    { name: 'Paid', value: paymentStatusCount.PAID || 0, color: '#10B981' },
    { name: 'Partial', value: paymentStatusCount.PARTIAL || 0, color: '#6C4CF1' },
    { name: 'Pending', value: paymentStatusCount.PENDING || 0, color: '#F59E0B' },
    { name: 'Overdue', value: paymentStatusCount.OVERDUE || 0, color: '#EF4444' }
  ].filter(d => d.value > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* 1. Revenue & Billing Area Chart */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-premium">
        <div className="mb-4">
          <h3 className="font-bold text-sm">Monthly Revenue Trend</h3>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">Billed revenue & active retainers</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6C4CF1" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6C4CF1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F4F4F5" className="dark:stroke-zinc-800" />
              <XAxis dataKey="name" stroke="#A1A1AA" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#A1A1AA" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card-bg)', 
                  borderColor: 'var(--card-border)', 
                  borderRadius: '16px', 
                  fontSize: '11px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)'
                }} 
              />
              <Area type="monotone" dataKey="revenue" stroke="#6C4CF1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Orders Volume Bar Chart */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-premium">
        <div className="mb-4">
          <h3 className="font-bold text-sm">Campaigns & Orders Volume</h3>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">Monthly active order deliverable index</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F4F4F5" className="dark:stroke-zinc-800" />
              <XAxis dataKey="name" stroke="#A1A1AA" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#A1A1AA" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card-bg)', 
                  borderColor: 'var(--card-border)', 
                  borderRadius: '16px', 
                  fontSize: '11px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)'
                }} 
              />
              <Bar dataKey="orders" fill="#6C4CF1" radius={[8, 8, 0, 0]} barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Project Status Pie Chart */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-premium flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 w-full text-center md:text-left">
          <h3 className="font-bold text-sm">Campaign Pipeline Share</h3>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium block mb-4">Breakdown of orders in production</span>
          
          <div className="space-y-2 text-xs">
            {projectStatusData.length === 0 ? (
              <p className="text-zinc-400 dark:text-zinc-500">No active projects</p>
            ) : (
              projectStatusData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">{item.name}</span>
                  <span className="ml-auto font-bold">{item.value}</span>
                </div>
              ))
            )}
          </div>
        </div>
        
        {projectStatusData.length > 0 && (
          <div className="w-44 h-44 shrink-0 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="text-[10px] text-zinc-400 font-bold block leading-none">TOTAL</span>
              <span className="text-xl font-black">{projectStatusData.reduce((s, d) => s + d.value, 0)}</span>
            </div>
          </div>
        )}
      </div>

      {/* 4. Payment Settlement Donut Chart */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-premium flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 w-full text-center md:text-left">
          <h3 className="font-bold text-sm">Invoice Settlements</h3>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium block mb-4">Breakdown of billing states</span>
          
          <div className="space-y-2 text-xs">
            {paymentStatusData.length === 0 ? (
              <p className="text-zinc-400 dark:text-zinc-500">No active invoices</p>
            ) : (
              paymentStatusData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">{item.name}</span>
                  <span className="ml-auto font-bold">{item.value}</span>
                </div>
              ))
            )}
          </div>
        </div>
        
        {paymentStatusData.length > 0 && (
          <div className="w-44 h-44 shrink-0 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {paymentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="text-[10px] text-zinc-400 font-bold block leading-none">INVOICES</span>
              <span className="text-xl font-black">{paymentStatusData.reduce((s, d) => s + d.value, 0)}</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
