"use client";

import React, { useState } from 'react';
import { 
  BarChart2, Users, FolderCheck, DollarSign, Award, Clock, 
  TrendingUp, Download, Eye, ShieldCheck, UserCheck, AlertTriangle
} from 'lucide-react';

interface ReportsProps {
  stats: any;
  teamStats: any[];
}

export default function ReportsClientPage({ stats, teamStats }: ReportsProps) {
  const [activeTab, setActiveTab] = useState('monthly');

  // Export report as CSV helper
  const handleExportCSV = () => {
    const headers = ["Metric", "Value", "Notes"];
    const rows = [
      ["Total Clients", stats.kpis.totalClients, "All registered clients"],
      ["New Clients (30d)", stats.kpis.newClients, "Acquired in last 30 days"],
      ["Active Projects", stats.kpis.activeProjects, "Orders currently in production"],
      ["Completed Projects", stats.kpis.completedProjects, "All-time completed orders"],
      ["Total Revenue Billed", stats.kpis.totalRevenue, "Advance amount + settled invoices"],
      ["Pending Accounts Receivable", stats.kpis.pendingPayments, "Outstanding invoices balance due"]
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `creative_plus_growth_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Analytics & Operational Reports</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Verify agency growth multipliers, designer workloads, and campaign deliveries.</p>
        </div>

        <button 
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-md transition cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Growth Report</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 flex gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('monthly')}
          className={`pb-3 capitalize transition cursor-pointer relative ${activeTab === 'monthly' ? 'text-brand-purple' : 'text-zinc-500 hover:text-zinc-850'}`}
        >
          <span>Agency Performance Summary</span>
          {activeTab === 'monthly' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple rounded-full" />}
        </button>
        
        <button
          onClick={() => setActiveTab('team')}
          className={`pb-3 capitalize transition cursor-pointer relative ${activeTab === 'team' ? 'text-brand-purple' : 'text-zinc-500 hover:text-zinc-850'}`}
        >
          <span>Team Workloads & Productivity</span>
          {activeTab === 'team' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple rounded-full" />}
        </button>
      </div>

      {/* ========================================== */}
      {/* VIEW 1: MONTHLY PERFORMANCE SUMMARY */}
      {/* ========================================== */}
      {activeTab === 'monthly' && (
        <div className="space-y-6">
          
          {/* Main KPI metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-3xl shadow-premium">
              <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Acquisition Rate</span>
              <h3 className="text-xl font-black mt-2">+{stats.kpis.newClients} new clients</h3>
              <p className="text-[10px] text-zinc-500 mt-1 font-medium">Billed client portfolios inside past 30 days.</p>
            </div>
            
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-3xl shadow-premium">
              <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Project Completion Rate</span>
              <h3 className="text-xl font-black mt-2">
                {Math.round((stats.kpis.completedProjects / (stats.kpis.completedProjects + stats.kpis.activeProjects || 1)) * 100)}% Complete
              </h3>
              <p className="text-[10px] text-zinc-500 mt-1 font-medium">{stats.kpis.completedProjects} campaigns delivered all-time.</p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-3xl shadow-premium">
              <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Outstanding Invoices</span>
              <h3 className="text-xl font-black text-amber-600 mt-2">${stats.kpis.pendingPayments.toLocaleString()}</h3>
              <p className="text-[10px] text-zinc-500 mt-1 font-medium">Outstanding payments due from clients.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Top performing channels */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-3xl shadow-premium">
              <h3 className="font-bold text-sm mb-4 pb-2 border-b border-zinc-100 dark:border-zinc-850">Lead Generation Channels</h3>
              
              <div className="space-y-3 text-xs font-semibold">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500">Website Referral</span>
                  <span>45% of leads</span>
                </div>
                <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full">
                  <div className="bg-brand-purple h-full rounded-full" style={{ width: '45%' }} />
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-zinc-500">Instagram Campaign</span>
                  <span>30% of leads</span>
                </div>
                <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full">
                  <div className="bg-brand-purple h-full rounded-full" style={{ width: '30%' }} />
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-zinc-500">Client Recommendations</span>
                  <span>15% of leads</span>
                </div>
                <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full">
                  <div className="bg-brand-purple h-full rounded-full" style={{ width: '15%' }} />
                </div>
              </div>
            </div>

            {/* Best performing services */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-3xl shadow-premium flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm mb-4 pb-2 border-b border-zinc-100 dark:border-zinc-850">Best Selling Services</h3>
                <div className="space-y-3 text-xs font-semibold">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">E-Commerce Design Rebranding</span>
                    <span className="bg-brand-purple-light dark:bg-brand-purple/15 text-brand-purple px-2 py-0.5 rounded text-[10px]">Top Service</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Social Media Retainer Packages</span>
                    <span className="text-zinc-400 font-normal">Active Retainers</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Mobile Application UI/UX</span>
                    <span className="text-zinc-400 font-normal">High Budget</span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-center gap-2 mt-4 text-[10px] text-zinc-500 dark:text-zinc-400">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Monthly revenue metrics increased by 14% compared to previous quarter index.</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================== */}
      {/* VIEW 2: TEAM WORKLOADS & PRODUCTIVITY */}
      {/* ========================================== */}
      {activeTab === 'team' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teamStats.map((designer) => (
            <div key={designer.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-premium space-y-4 text-xs">
              
              {/* Profile Card */}
              <div className="flex items-center gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <img 
                  src={designer.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(designer.name)}`} 
                  alt={designer.name} 
                  className="w-10 h-10 rounded-xl object-cover border border-zinc-250 dark:border-zinc-700" 
                />
                <div>
                  <h4 className="font-bold text-sm leading-none">{designer.name}</h4>
                  <span className="text-[10px] text-zinc-400 block mt-1 font-semibold">{designer.role}</span>
                </div>
                
                {/* Workload Indicator badge */}
                <div className="ml-auto text-right">
                  <span className={`px-2 py-0.5 rounded font-bold text-[8px] uppercase ${
                    designer.workload > 3 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-emerald-600 border border-green-100'
                  }`}>
                    {designer.workload > 3 ? 'High Load' : 'Optimal Load'}
                  </span>
                </div>
              </div>

              {/* Workload metrics split */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3 font-semibold">
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Task Completion Rate</span>
                    <span className="text-base font-black">{designer.completionRate}%</span>
                    <span className="text-[9px] text-zinc-400 block font-normal">{designer.completedTasks} / {designer.totalTasks} tasks complete</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-brand-purple h-full rounded-full" style={{ width: `${designer.completionRate}%` }} />
                  </div>
                </div>

                <div className="space-y-2 border-l border-zinc-100 dark:border-zinc-800 pl-4 font-semibold">
                  <div className="flex justify-between py-1 border-b border-zinc-50 dark:border-zinc-800">
                    <span className="text-zinc-400">Total Workload</span>
                    <span className="font-bold text-zinc-850 dark:text-zinc-50">{designer.workload} active items</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-50 dark:border-zinc-800">
                    <span className="text-zinc-400">Hours Logged</span>
                    <span className="font-bold text-zinc-850 dark:text-zinc-50">{designer.hoursLogged} hrs</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-zinc-400">Completed Campaigns</span>
                    <span className="font-bold text-zinc-850 dark:text-zinc-50">{designer.completedProjectsCount} orders</span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
