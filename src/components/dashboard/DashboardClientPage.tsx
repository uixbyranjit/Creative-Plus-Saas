"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { 
  Users, ShoppingBag, FolderGit, CheckSquare, 
  CreditCard, Calendar, BarChart2, Plus, ArrowUpRight, 
  Clock, CheckCircle2, ChevronRight, UserPlus, AlertCircle, FileText
} from 'lucide-react';
import { 
  createClient, createOrder, createTask, createPayment, createFollowUp 
} from '@/lib/actions';
import { isDbFallbackActive } from '@/lib/dbState';

// Dynamically import Recharts component to avoid SSR hydration issues
const DashboardCharts = dynamic(() => import('./DashboardCharts'), { ssr: false });

interface DashboardClientPageProps {
  initialStats: any;
  users: any[];
  clients: any[];
  orders: any[];
}

export default function DashboardClientPage({ initialStats, users, clients, orders }: DashboardClientPageProps) {
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Modals state
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [followUpModalOpen, setFollowUpModalOpen] = useState(false);

  // Form states
  const [clientForm, setClientForm] = useState({ name: '', companyName: '', email: '', mobile: '', city: '', pinCode: '', leadSource: 'Website', address: '', industry: '', gstNumber: '', status: 'Active' });
  const [orderForm, setOrderForm] = useState({ clientId: '', serviceName: '', workType: 'Project', description: '', assignedToId: '', priority: 'MEDIUM', startDate: '', endDate: '', expectedDelivery: '', totalAmount: '', advanceAmount: '', notes: '' });
  const [taskForm, setTaskForm] = useState({ name: '', description: '', assignedToId: '', deadline: '', priority: 'MEDIUM', checklistItems: '' });
  const [paymentForm, setPaymentForm] = useState({ orderId: '', clientId: '', totalAmount: '', advance: '0', paymentMode: 'UPI', gst: '18', dueDate: '' });
  const [followUpForm, setFollowUpForm] = useState({ clientId: '', purpose: '', date: '', time: '', remarks: '', reminder: true });

  const refreshStats = async () => {
    // Quick reload
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const newStats = await res.json();
        setStats(newStats);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createClient(clientForm);
      setClientModalOpen(false);
      setClientForm({ name: '', companyName: '', email: '', mobile: '', city: '', pinCode: '', leadSource: 'Website', address: '', industry: '', gstNumber: '', status: 'Active' });
      await refreshStats();
    } catch (err: any) {
      setError(err?.message || 'Failed to create client');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createOrder({
        ...orderForm,
        totalAmount: parseFloat(orderForm.totalAmount),
        advanceAmount: parseFloat(orderForm.advanceAmount || '0')
      });
      setOrderModalOpen(false);
      setOrderForm({ clientId: '', serviceName: '', workType: 'Project', description: '', assignedToId: '', priority: 'MEDIUM', startDate: '', endDate: '', expectedDelivery: '', totalAmount: '', advanceAmount: '', notes: '' });
      await refreshStats();
    } catch (err: any) {
      setError(err?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const checklistArray = taskForm.checklistItems
        ? taskForm.checklistItems.split('\n').filter(item => item.trim() !== '').map(text => ({ text, completed: false }))
        : [];
      
      await createTask({
        name: taskForm.name,
        description: taskForm.description,
        assignedToId: taskForm.assignedToId,
        deadline: taskForm.deadline,
        priority: taskForm.priority,
        checklist: checklistArray.length > 0 ? JSON.stringify(checklistArray) : null
      });
      
      setTaskModalOpen(false);
      setTaskForm({ name: '', description: '', assignedToId: '', deadline: '', priority: 'MEDIUM', checklistItems: '' });
      await refreshStats();
    } catch (err: any) {
      setError(err?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createPayment({
        ...paymentForm,
        totalAmount: parseFloat(paymentForm.totalAmount),
        advance: parseFloat(paymentForm.advance || '0'),
        gst: parseFloat(paymentForm.gst || '18')
      });
      setPaymentModalOpen(false);
      setPaymentForm({ orderId: '', clientId: '', totalAmount: '', advance: '0', paymentMode: 'UPI', gst: '18', dueDate: '' });
      await refreshStats();
    } catch (err: any) {
      setError(err?.message || 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  const handleFollowUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createFollowUp(followUpForm);
      setFollowUpModalOpen(false);
      setFollowUpForm({ clientId: '', purpose: '', date: '', time: '', remarks: '', reminder: true });
      await refreshStats();
    } catch (err: any) {
      setError(err?.message || 'Failed to schedule follow-up');
    } finally {
      setLoading(false);
    }
  };

  const kpis = [
    { label: 'Total Clients', value: stats.kpis.totalClients, trend: `+${stats.kpis.newClients} new`, icon: Users, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/20' },
    { label: 'Active Projects', value: stats.kpis.activeProjects, trend: `${stats.kpis.pendingProjects} pending`, icon: FolderGit, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/20' },
    { label: 'Total Revenue Billed', value: `$${stats.kpis.totalRevenue.toLocaleString()}`, trend: 'Settled funds', icon: CreditCard, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20' },
    { label: 'Pending Payments', value: `$${stats.kpis.pendingPayments.toLocaleString()}`, trend: 'Invoices due', icon: Clock, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/20' }
  ];

  return (
    <div className="space-y-8">
      
      {/* Fallback Banner Alert */}
      {isDbFallbackActive.value && (
        <div className="flex items-center gap-3 bg-brand-purple/5 border border-brand-purple/20 text-brand-purple p-4 rounded-2xl text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Running in Offline/Demo Mode with Local Storage fallback (Postgres connection is offline). Changes will persist locally.</span>
        </div>
      )}

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Creative Plus Dashboard</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Real-time campaigns operations, design pipeline, and invoicing summary.</p>
        </div>
        
        {/* Quick Action Pills */}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setClientModalOpen(true)} className="flex items-center gap-1.5 bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-md transition cursor-pointer">
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Client</span>
          </button>
          <button onClick={() => setOrderModalOpen(true)} className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-md transition cursor-pointer">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Create Order</span>
          </button>
          <button onClick={() => setTaskModalOpen(true)} className="flex items-center gap-1.5 bg-white border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-100 text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-sm transition cursor-pointer">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
          <button onClick={() => setPaymentModalOpen(true)} className="flex items-center gap-1.5 bg-white border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-100 text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-sm transition cursor-pointer">
            <Plus className="w-3.5 h-3.5" />
            <span>Add Payment</span>
          </button>
          <button onClick={() => setFollowUpModalOpen(true)} className="flex items-center gap-1.5 bg-white border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-100 text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-sm transition cursor-pointer">
            <Calendar className="w-3.5 h-3.5" />
            <span>Schedule Follow-up</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-premium hover:translate-y-[-2px] transition duration-200">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{kpi.label}</span>
                <div className={`p-2 rounded-xl ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black leading-none">{kpi.value}</h3>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold block mt-1.5">{kpi.trend}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Block */}
      <DashboardCharts 
        monthlyRevenue={stats.charts.monthlyRevenue} 
        orderStatusCount={stats.charts.orderStatusCount} 
        paymentStatusCount={stats.charts.paymentStatusCount} 
      />

      {/* Timeline and Table Splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Recent Orders & Upcoming Deadlines */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Latest Orders Table */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-premium">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3 className="font-bold text-sm">Latest Campaign Orders</h3>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">Recently registered deliverables</span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="text-zinc-400 font-bold border-b border-zinc-100 dark:border-zinc-800 pb-2">
                    <th className="pb-2">Order ID</th>
                    <th className="pb-2">Service Name</th>
                    <th className="pb-2">Work Type</th>
                    <th className="pb-2">Total Amount</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {stats.latestOrders.map((o: any) => (
                    <tr key={o.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20">
                      <td className="py-3 font-semibold text-brand-purple">{o.orderId}</td>
                      <td className="py-3 font-medium">{o.serviceName}</td>
                      <td className="py-3 text-zinc-500">{o.workType}</td>
                      <td className="py-3 font-semibold">${o.totalAmount}</td>
                      <td className="py-3 text-right">
                        <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase ${
                          o.status === 'COMPLETED' ? 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400' :
                          o.status === 'REVIEW' ? 'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400' :
                          'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-premium">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3 className="font-bold text-sm">Upcoming Task Deadlines</h3>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">Critical team deliverables due</span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </div>

            <div className="space-y-3">
              {stats.upcomingDeadlines.length === 0 ? (
                <p className="text-center py-4 text-zinc-400 text-xs">No pending deadlines</p>
              ) : (
                stats.upcomingDeadlines.map((t: any) => (
                  <div key={t.id} className="flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/20 border border-zinc-100 dark:border-zinc-800/50 p-3 rounded-2xl">
                    <div>
                      <p className="text-xs font-bold">{t.name}</p>
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">Due: {new Date(t.deadline).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase ${
                      t.priority === 'URGENT' ? 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400' :
                      t.priority === 'HIGH' ? 'bg-amber-100 dark:bg-amber-950/30 text-amber-700' :
                      'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400'
                    }`}>
                      {t.priority}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Side: Activity Timeline */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-premium">
            <h3 className="font-bold text-sm mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">Recent Activity Timeline</h3>
            
            <div className="relative pl-4 border-l border-zinc-100 dark:border-zinc-800 space-y-6">
              {stats.recentActivity.map((log: any) => (
                <div key={log.id} className="relative">
                  {/* Dot mark */}
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-brand-purple border-2 border-white dark:border-zinc-900" />
                  
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 block">{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <p className="text-xs font-bold mt-0.5">{log.action}</p>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">{log.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* 1. ADD CLIENT MODAL */}
      {/* ========================================== */}
      {clientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setClientModalOpen(false)} />
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl relative p-6 max-h-[90vh] overflow-y-auto z-10">
            <h3 className="font-bold text-lg mb-4">Add Client</h3>
            {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
            
            <form onSubmit={handleClientSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Client Name *</label>
                  <input type="text" required value={clientForm.name} onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Company Name</label>
                  <input type="text" value={clientForm.companyName} onChange={(e) => setClientForm({ ...clientForm, companyName: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Email *</label>
                  <input type="email" required value={clientForm.email} onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Mobile Number *</label>
                  <input type="text" required value={clientForm.mobile} onChange={(e) => setClientForm({ ...clientForm, mobile: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold block mb-1">City</label>
                  <input type="text" value={clientForm.city} onChange={(e) => setClientForm({ ...clientForm, city: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Pin Code</label>
                  <input type="text" value={clientForm.pinCode} onChange={(e) => setClientForm({ ...clientForm, pinCode: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Lead Source</label>
                  <select value={clientForm.leadSource} onChange={(e) => setClientForm({ ...clientForm, leadSource: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850">
                    <option value="Website">Website</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Reference">Reference</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">GST Number</label>
                <input type="text" value={clientForm.gstNumber} onChange={(e) => setClientForm({ ...clientForm, gstNumber: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
              </div>
              <div>
                <label className="font-semibold block mb-1">Full Address</label>
                <textarea rows={2} value={clientForm.address} onChange={(e) => setClientForm({ ...clientForm, address: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button type="button" onClick={() => setClientModalOpen(false)} className="px-4 py-2 border border-zinc-200 dark:border-zinc-850 rounded-xl">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-brand-purple text-white rounded-xl font-bold cursor-pointer disabled:opacity-50">
                  {loading ? 'Adding...' : 'Save Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 2. CREATE ORDER MODAL */}
      {/* ========================================== */}
      {orderOpenModals(orderModalOpen, setOrderModalOpen, clientForm, orderForm, setOrderForm, clients, users, loading, handleOrderSubmit, error)}

      {/* ========================================== */}
      {/* 3. ADD TASK MODAL */}
      {/* ========================================== */}
      {taskOpenModals(taskModalOpen, setTaskModalOpen, taskForm, setTaskForm, users, loading, handleTaskSubmit, error)}

      {/* ========================================== */}
      {/* 4. ADD PAYMENT MODAL */}
      {/* ========================================== */}
      {paymentOpenModals(paymentModalOpen, setPaymentModalOpen, paymentForm, setPaymentForm, clients, orders, loading, handlePaymentSubmit, error)}

      {/* ========================================== */}
      {/* 5. SCHEDULE FOLLOW-UP MODAL */}
      {/* ========================================== */}
      {followUpOpenModals(followUpModalOpen, setFollowUpModalOpen, followUpForm, setFollowUpForm, clients, loading, handleFollowUpSubmit, error)}

    </div>
  );
}

// Subordinate render modal builders to keep files tidy
function orderOpenModals(open: boolean, setOpen: any, cf: any, f: any, setF: any, clients: any[], users: any[], loading: boolean, submit: any, err: string) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto z-10 text-xs">
        <h3 className="font-bold text-lg mb-4">Create Campaign Order</h3>
        {err && <p className="text-red-500 mb-2">{err}</p>}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="font-semibold block mb-1">Client Name *</label>
            <select required value={f.clientId} onChange={(e) => setF({ ...f, clientId: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850">
              <option value="">Select client...</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.companyName || 'No Company'})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1">Service Name *</label>
              <input type="text" required placeholder="e.g. Website Development" value={f.serviceName} onChange={(e) => setF({ ...f, serviceName: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
            </div>
            <div>
              <label className="font-semibold block mb-1">Work Type</label>
              <select value={f.workType} onChange={(e) => setF({ ...f, workType: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850">
                <option value="Single Design">Single Design</option>
                <option value="Monthly Package">Monthly Package</option>
                <option value="Project">Project</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1">Assigned Designer/Lead</label>
              <select value={f.assignedToId} onChange={(e) => setF({ ...f, assignedToId: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850">
                <option value="">Choose team member...</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
              </select>
            </div>
            <div>
              <label className="font-semibold block mb-1">Priority</label>
              <select value={f.priority} onChange={(e) => setF({ ...f, priority: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="font-semibold block mb-1">Start Date</label>
              <input type="date" required value={f.startDate} onChange={(e) => setF({ ...f, startDate: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
            </div>
            <div>
              <label className="font-semibold block mb-1">End Date</label>
              <input type="date" required value={f.endDate} onChange={(e) => setF({ ...f, endDate: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
            </div>
            <div>
              <label className="font-semibold block mb-1">Expected Delivery</label>
              <input type="date" required value={f.expectedDelivery} onChange={(e) => setF({ ...f, expectedDelivery: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1">Total Amount ($) *</label>
              <input type="number" required placeholder="5000" value={f.totalAmount} onChange={(e) => setF({ ...f, totalAmount: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
            </div>
            <div>
              <label className="font-semibold block mb-1">Advance Amount Paid ($)</label>
              <input type="number" placeholder="1500" value={f.advanceAmount} onChange={(e) => setF({ ...f, advanceAmount: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
            </div>
          </div>
          <div>
            <label className="font-semibold block mb-1">Description</label>
            <textarea rows={2} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 border border-zinc-200 dark:border-zinc-850 rounded-xl">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-brand-purple text-white rounded-xl font-bold cursor-pointer disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function taskOpenModals(open: boolean, setOpen: any, f: any, setF: any, users: any[], loading: boolean, submit: any, err: string) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto z-10 text-xs">
        <h3 className="font-bold text-lg mb-4">Add Project Task</h3>
        {err && <p className="text-red-500 mb-2">{err}</p>}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="font-semibold block mb-1">Task Name *</label>
            <input type="text" required placeholder="e.g. Home page grid layout" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1">Assigned To *</label>
              <select required value={f.assignedToId} onChange={(e) => setF({ ...f, assignedToId: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850">
                <option value="">Choose team member...</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
              </select>
            </div>
            <div>
              <label className="font-semibold block mb-1">Priority</label>
              <select value={f.priority} onChange={(e) => setF({ ...f, priority: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>
          <div>
            <label className="font-semibold block mb-1">Deadline Date *</label>
            <input type="date" required value={f.deadline} onChange={(e) => setF({ ...f, deadline: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
          </div>
          <div>
            <label className="font-semibold block mb-1">Checklist Items (One item per line)</label>
            <textarea rows={3} placeholder="Add color palette&#10;Finalize mobile icons&#10;Verify image contrasts" value={f.checklistItems} onChange={(e) => setF({ ...f, checklistItems: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850 font-mono" />
          </div>
          <div>
            <label className="font-semibold block mb-1">Description</label>
            <textarea rows={2} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 border border-zinc-200 dark:border-zinc-850 rounded-xl">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-brand-purple text-white rounded-xl font-bold cursor-pointer disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function paymentOpenModals(open: boolean, setOpen: any, f: any, setF: any, clients: any[], orders: any[], loading: boolean, submit: any, err: string) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto z-10 text-xs">
        <h3 className="font-bold text-lg mb-4">Record Payment & Invoice</h3>
        {err && <p className="text-red-500 mb-2">{err}</p>}
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1">Client Name *</label>
              <select required value={f.clientId} onChange={(e) => setF({ ...f, clientId: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850">
                <option value="">Select client...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="font-semibold block mb-1">Related Order</label>
              <select value={f.orderId} onChange={(e) => setF({ ...f, orderId: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850">
                <option value="">Select order...</option>
                {orders.filter(o => o.clientId === f.clientId || !f.clientId).map(o => <option key={o.id} value={o.id}>{o.serviceName} ({o.orderId})</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1">Total Amount ($) *</label>
              <input type="number" required placeholder="3000" value={f.totalAmount} onChange={(e) => setF({ ...f, totalAmount: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
            </div>
            <div>
              <label className="font-semibold block mb-1">Advance Paid ($)</label>
              <input type="number" placeholder="1000" value={f.advance} onChange={(e) => setF({ ...f, advance: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1">Payment Mode</label>
              <select value={f.paymentMode} onChange={(e) => setF({ ...f, paymentMode: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850">
                <option value="UPI">UPI</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="CARD">Credit/Debit Card</option>
                <option value="CASH">Cash</option>
                <option value="CHEQUE">Cheque</option>
              </select>
            </div>
            <div>
              <label className="font-semibold block mb-1">GST Percentage (%)</label>
              <input type="number" placeholder="18" value={f.gst} onChange={(e) => setF({ ...f, gst: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
            </div>
          </div>
          <div>
            <label className="font-semibold block mb-1">Due Date *</label>
            <input type="date" required value={f.dueDate} onChange={(e) => setF({ ...f, dueDate: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 border border-zinc-200 dark:border-zinc-850 rounded-xl">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-brand-purple text-white rounded-xl font-bold cursor-pointer disabled:opacity-50">
              {loading ? 'Saving...' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function followUpOpenModals(open: boolean, setOpen: any, f: any, setF: any, clients: any[], loading: boolean, submit: any, err: string) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto z-10 text-xs">
        <h3 className="font-bold text-lg mb-4">Schedule Client Follow-up</h3>
        {err && <p className="text-red-500 mb-2">{err}</p>}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="font-semibold block mb-1">Select Client *</label>
            <select required value={f.clientId} onChange={(e) => setF({ ...f, clientId: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850">
              <option value="">Select client...</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="font-semibold block mb-1">Follow-up Purpose *</label>
            <input type="text" required placeholder="e.g. UI Draft v1 Review Call" value={f.purpose} onChange={(e) => setF({ ...f, purpose: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1">Follow-up Date *</label>
              <input type="date" required value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
            </div>
            <div>
              <label className="font-semibold block mb-1">Preferred Time *</label>
              <input type="time" required value={f.time} onChange={(e) => setF({ ...f, time: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
            </div>
          </div>
          <div>
            <label className="font-semibold block mb-1">Remarks & Details</label>
            <textarea rows={2} value={f.remarks} onChange={(e) => setF({ ...f, remarks: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="reminder" checked={f.reminder} onChange={(e) => setF({ ...f, reminder: e.target.checked })} className="w-4 h-4 text-brand-purple" />
            <label htmlFor="reminder" className="font-semibold cursor-pointer">Simulate automatic Email & WhatsApp alert reminders</label>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 border border-zinc-200 dark:border-zinc-850 rounded-xl">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-brand-purple text-white rounded-xl font-bold cursor-pointer disabled:opacity-50">
              {loading ? 'Scheduling...' : 'Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
