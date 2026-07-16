"use client";

import React, { useState } from 'react';
import { 
  Search, Plus, Kanban, List, Eye, Trash2, X, Clock, 
  User, CheckCircle2, ChevronRight, AlertTriangle, Paperclip, 
  TrendingUp, FileText, ArrowRight, ArrowLeft
} from 'lucide-react';
import { createOrder, updateOrderStage, deleteOrder } from '@/lib/actions';

interface Order {
  id: string;
  orderId: string;
  clientId: string;
  client: any;
  serviceName: string;
  workType: string;
  description: string | null;
  assignedToId: string | null;
  assignedDesigner: any;
  priority: string;
  startDate: any;
  endDate: any;
  expectedDelivery: any;
  status: string;
  advanceAmount: number;
  remainingAmount: number;
  totalAmount: number;
  notes: string | null;
  history: any[];
  files: any[];
}

const KANBAN_COLUMNS = [
  { id: 'NEW', name: 'New Orders', color: 'border-zinc-200 dark:border-zinc-800' },
  { id: 'WORKING', name: 'Working', color: 'border-brand-purple/30' },
  { id: 'REVIEW', name: 'Review', color: 'border-blue-200 dark:border-blue-900/30' },
  { id: 'REVISION', name: 'Revision', color: 'border-amber-200 dark:border-amber-900/30' },
  { id: 'APPROVAL', name: 'Approval', color: 'border-indigo-200 dark:border-indigo-900/30' },
  { id: 'COMPLETED', name: 'Completed', color: 'border-emerald-200 dark:border-emerald-900/30' }
];

const WORKFLOW_STAGES = [
  "New Order",
  "Advance Received",
  "Work Started",
  "Design Draft",
  "Client Review",
  "Revision 1",
  "Revision 2",
  "Final Approval",
  "Final Payment",
  "Files Delivered",
  "Project Completed"
];

export default function OrdersClientPage({ initialOrders, clients, users }: { initialOrders: Order[], clients: any[], users: any[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [search, setSearch] = useState('');
  
  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Forms
  const [orderForm, setOrderForm] = useState({ clientId: '', serviceName: '', workType: 'Project', description: '', assignedToId: '', priority: 'MEDIUM', startDate: '', endDate: '', expectedDelivery: '', totalAmount: '', advanceAmount: '', notes: '' });
  const [stageUpdateForm, setStageUpdateForm] = useState({ stage: 'WORKING', completedBy: '', comments: '', attachment: '' });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refreshOrders = async () => {
    try {
      const res = await fetch('/api/orders-data');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
        if (selectedOrder) {
          const updated = data.find((o: any) => o.id === selectedOrder.id);
          if (updated) setSelectedOrder(updated);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createOrder({
        ...orderForm,
        totalAmount: parseFloat(orderForm.totalAmount),
        advanceAmount: parseFloat(orderForm.advanceAmount || '0')
      });
      setCreateModalOpen(false);
      setOrderForm({ clientId: '', serviceName: '', workType: 'Project', description: '', assignedToId: '', priority: 'MEDIUM', startDate: '', endDate: '', expectedDelivery: '', totalAmount: '', advanceAmount: '', notes: '' });
      await refreshOrders();
    } catch (err: any) {
      setError(err?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const handleStageUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setLoading(true);
    try {
      // Map stages properly to status column: if it's "Project Completed", set status to COMPLETED, etc.
      let dbStatus = selectedOrder.status;
      const stage = stageUpdateForm.stage;
      if (stage === "Project Completed") dbStatus = "COMPLETED";
      else if (stage === "New Order") dbStatus = "NEW";
      else if (stage === "Design Draft" || stage === "Client Review") dbStatus = "REVIEW";
      else if (stage === "Revision 1" || stage === "Revision 2") dbStatus = "REVISION";
      else if (stage === "Final Approval") dbStatus = "APPROVAL";
      else dbStatus = "WORKING";

      await updateOrderStage(
        selectedOrder.id,
        dbStatus,
        stageUpdateForm.completedBy || 'Admin',
        `${stageUpdateForm.stage}: ${stageUpdateForm.comments}`,
        stageUpdateForm.attachment || undefined
      );

      setStageUpdateForm({ stage: 'WORKING', completedBy: '', comments: '', attachment: '' });
      await refreshOrders();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this order? All invoice payments and stage histories will be deleted.")) {
      await deleteOrder(id);
      setDetailDrawerOpen(false);
      await refreshOrders();
    }
  };

  const handleOpenDetail = (order: Order) => {
    setSelectedOrder(order);
    setDetailDrawerOpen(true);
  };

  const filteredOrders = orders.filter(o => 
    o.serviceName.toLowerCase().includes(search.toLowerCase()) || 
    o.orderId.toLowerCase().includes(search.toLowerCase()) ||
    o.client?.name.toLowerCase().includes(search.toLowerCase())
  );

  // Workflow progress percentage builder
  const getWorkflowProgress = (status: string) => {
    switch (status) {
      case 'NEW': return 15;
      case 'WORKING': return 40;
      case 'REVIEW': return 65;
      case 'REVISION': return 75;
      case 'APPROVAL': return 90;
      case 'COMPLETED': return 100;
      default: return 10;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Campaign Orders Hub</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Coordinate design deliveries and client approval lifecycles.</p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggles */}
          <div className="bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-xl flex border border-zinc-200/50 dark:border-zinc-700/50">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${viewMode === 'list' ? 'bg-white dark:bg-zinc-900 shadow-sm text-brand-purple' : 'text-zinc-400 hover:text-zinc-700'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${viewMode === 'kanban' ? 'bg-white dark:bg-zinc-900 shadow-sm text-brand-purple' : 'text-zinc-400 hover:text-zinc-700'}`}
            >
              <Kanban className="w-4 h-4" />
            </button>
          </div>

          <button 
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-1.5 bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-md transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Order</span>
          </button>
        </div>
      </div>

      {/* Search filter bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input 
          type="text" 
          placeholder="Search orders by ID, service name, client..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-brand-purple focus:border-brand-purple shadow-sm"
        />
      </div>

      {/* ========================================== */}
      {/* VIEW 1: LIST VIEW */}
      {/* ========================================== */}
      {viewMode === 'list' && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-premium overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="text-zinc-400 font-bold border-b border-zinc-100 dark:border-zinc-800 pb-2">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Client</th>
                <th className="pb-3">Service Campaign</th>
                <th className="pb-3">Priority</th>
                <th className="pb-3">Delivery Expected</th>
                <th className="pb-3">Budget</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-zinc-400 font-medium">No campaign orders registered.</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10">
                    <td className="py-4 font-bold text-brand-purple font-mono">{order.orderId}</td>
                    <td className="py-4 font-semibold">{order.client?.name}</td>
                    <td className="py-4">
                      <p className="font-bold">{order.serviceName}</p>
                      <span className="text-[9px] text-zinc-400 font-medium">{order.workType}</span>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase ${
                        order.priority === 'URGENT' ? 'bg-red-100 dark:bg-red-950/20 text-red-700 dark:text-red-400' :
                        order.priority === 'HIGH' ? 'bg-amber-100 dark:bg-amber-950/20 text-amber-700' :
                        'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                      }`}>
                        {order.priority}
                      </span>
                    </td>
                    <td className="py-4 text-zinc-500 font-medium">{new Date(order.expectedDelivery).toLocaleDateString()}</td>
                    <td className="py-4 font-bold">${order.totalAmount}</td>
                    <td className="py-4">
                      <span className="px-2 py-0.5 rounded font-bold text-[9px] bg-brand-purple-light dark:bg-brand-purple/10 text-brand-purple uppercase">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 text-right space-x-1 whitespace-nowrap">
                      <button 
                        onClick={() => handleOpenDetail(order)}
                        className="inline-flex p-1.5 text-zinc-500 hover:text-brand-purple rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(order.id)}
                        className="p-1.5 text-zinc-500 hover:text-red-500 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ========================================== */}
      {/* VIEW 2: KANBAN BOARD VIEW */}
      {/* ========================================== */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {KANBAN_COLUMNS.map((col) => {
            const colOrders = filteredOrders.filter(o => o.status === col.id);
            return (
              <div key={col.id} className="bg-zinc-100/50 dark:bg-zinc-900/30 rounded-3xl p-4 border border-zinc-200/50 dark:border-zinc-800/80 min-w-[210px] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-wide">{col.name}</span>
                  <span className="text-[9px] bg-zinc-200 dark:bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full font-bold">{colOrders.length}</span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[70vh] min-h-[400px]">
                  {colOrders.map((o) => (
                    <div 
                      key={o.id} 
                      onClick={() => handleOpenDetail(o)}
                      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/60 p-4 rounded-2xl shadow-sm space-y-3 hover:shadow-md hover:border-brand-purple/20 transition cursor-pointer"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] font-mono text-zinc-400 font-bold">{o.orderId}</span>
                        <span className={`px-1.5 py-0.5 rounded font-extrabold text-[8px] uppercase ${
                          o.priority === 'URGENT' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-zinc-50 text-zinc-500'
                        }`}>{o.priority}</span>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-xs leading-snug">{o.serviceName}</h4>
                        <p className="text-[9px] text-zinc-400 dark:text-zinc-500 mt-0.5">{o.client?.name}</p>
                      </div>

                      <div className="flex justify-between items-center text-[9px] font-bold text-zinc-400">
                        <span>Due: {new Date(o.expectedDelivery).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                        <span className="text-zinc-800 dark:text-zinc-200 font-extrabold">${o.totalAmount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================== */}
      {/* CREATE ORDER MODAL */}
      {/* ========================================== */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCreateModalOpen(false)} />
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto z-10 text-xs">
            <h3 className="font-bold text-lg mb-4">Create Campaign Order</h3>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="font-semibold block mb-1">Client Name *</label>
                <select required value={orderForm.clientId} onChange={(e) => setOrderForm({ ...orderForm, clientId: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850">
                  <option value="">Select client...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.companyName || 'No Company'})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Service Name *</label>
                  <input type="text" required placeholder="e.g. Website Development" value={orderForm.serviceName} onChange={(e) => setOrderForm({ ...orderForm, serviceName: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Work Type</label>
                  <select value={orderForm.workType} onChange={(e) => setOrderForm({ ...orderForm, workType: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850">
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
                  <select value={orderForm.assignedToId} onChange={(e) => setOrderForm({ ...orderForm, assignedToId: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850">
                    <option value="">Choose team member...</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Priority</label>
                  <select value={orderForm.priority} onChange={(e) => setOrderForm({ ...orderForm, priority: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850">
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
                  <input type="date" required value={orderForm.startDate} onChange={(e) => setOrderForm({ ...orderForm, startDate: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">End Date</label>
                  <input type="date" required value={orderForm.endDate} onChange={(e) => setOrderForm({ ...orderForm, endDate: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Expected Delivery</label>
                  <input type="date" required value={orderForm.expectedDelivery} onChange={(e) => setOrderForm({ ...orderForm, expectedDelivery: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Total Amount ($) *</label>
                  <input type="number" required placeholder="5000" value={orderForm.totalAmount} onChange={(e) => setOrderForm({ ...orderForm, totalAmount: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Advance Amount Paid ($)</label>
                  <input type="number" placeholder="1500" value={orderForm.advanceAmount} onChange={(e) => setOrderForm({ ...orderForm, advanceAmount: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Description</label>
                <textarea rows={2} value={orderForm.description} onChange={(e) => setOrderForm({ ...orderForm, description: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button type="button" onClick={() => setCreateModalOpen(false)} className="px-4 py-2 border border-zinc-200 dark:border-zinc-850 rounded-xl">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-brand-purple text-white rounded-xl font-bold cursor-pointer disabled:opacity-50">
                  {loading ? 'Creating...' : 'Create Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* WORKFLOW DETAILS DRAWER (MODAL) */}
      {/* ========================================== */}
      {detailDrawerOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDetailDrawerOpen(false)} />
          <aside className="relative w-full max-w-lg bg-white dark:bg-zinc-900 h-full shadow-2xl p-6 overflow-y-auto z-10 border-l border-zinc-200 dark:border-zinc-800 flex flex-col text-xs">
            
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <span className="text-[10px] bg-brand-purple-light dark:bg-brand-purple/10 text-brand-purple px-1.5 py-0.5 rounded font-extrabold">{selectedOrder.orderId}</span>
                <h3 className="font-bold text-sm mt-1.5">{selectedOrder.serviceName}</h3>
              </div>
              <button onClick={() => setDetailDrawerOpen(false)} className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-6 flex-1">
              
              {/* Client & Assigned Details */}
              <div className="grid grid-cols-2 gap-4 bg-zinc-50 dark:bg-zinc-800/30 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/80">
                <div>
                  <span className="text-zinc-400 block font-semibold mb-0.5">CLIENT</span>
                  <p className="font-bold">{selectedOrder.client?.name}</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">{selectedOrder.client?.companyName || 'No Company'}</p>
                </div>
                <div>
                  <span className="text-zinc-400 block font-semibold mb-0.5">ASSIGNED DESIGNER</span>
                  <p className="font-bold">{selectedOrder.assignedDesigner?.name || 'Unassigned'}</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">{selectedOrder.assignedDesigner?.role || 'N/A'}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between items-center mb-1.5 font-bold">
                  <span>Production Progress</span>
                  <span className="text-brand-purple">{getWorkflowProgress(selectedOrder.status)}%</span>
                </div>
                <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-purple h-full rounded-full transition-all duration-300" style={{ width: `${getWorkflowProgress(selectedOrder.status)}%` }} />
                </div>
              </div>

              {/* Budget breakdown */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 bg-zinc-50 dark:bg-zinc-800/20 rounded-xl">
                  <span className="text-[9px] text-zinc-400 font-bold block">Contract</span>
                  <span className="text-xs font-extrabold">${selectedOrder.totalAmount}</span>
                </div>
                <div className="p-2.5 bg-green-50 dark:bg-green-950/20 rounded-xl text-green-700 dark:text-green-400">
                  <span className="text-[9px] text-green-400 font-bold block">Advance</span>
                  <span className="text-xs font-extrabold">${selectedOrder.advanceAmount}</span>
                </div>
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/20 rounded-xl text-amber-700">
                  <span className="text-[9px] text-amber-400 font-bold block">Balance</span>
                  <span className="text-xs font-extrabold">${selectedOrder.remainingAmount}</span>
                </div>
              </div>

              {/* Timeline log history */}
              <div>
                <h4 className="font-bold text-xs mb-3">Workflow Logs & Approval History</h4>
                <div className="relative pl-3 border-l border-zinc-100 dark:border-zinc-800 space-y-4">
                  {selectedOrder.history?.map((h: any) => (
                    <div key={h.id} className="relative">
                      <span className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-brand-purple border-2 border-white dark:border-zinc-900" />
                      <div>
                        <span className="text-[8px] text-zinc-400 block font-bold">{new Date(h.timestamp).toLocaleString()} • {h.completedBy}</span>
                        <p className="font-bold mt-0.5 text-zinc-800 dark:text-zinc-200">{h.stage || 'STAGE CHANGE'}</p>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-snug mt-0.5">{h.comments}</p>
                        {h.attachments && (
                          <div className="mt-1.5 flex items-center gap-1.5 text-[9px] text-brand-purple font-semibold">
                            <Paperclip className="w-3 h-3" />
                            <a href="#" className="hover:underline">View Attachment</a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stage transition forms */}
              <div className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200/50 dark:border-zinc-800 p-4 rounded-2xl space-y-3">
                <h4 className="font-bold text-xs text-brand-purple flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>Update Work Stage</span>
                </h4>
                
                <form onSubmit={handleStageUpdateSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold block mb-0.5">Workflow Target Stage *</label>
                      <select 
                        value={stageUpdateForm.stage} 
                        onChange={(e) => setStageUpdateForm({ ...stageUpdateForm, stage: e.target.value })} 
                        className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900"
                      >
                        {WORKFLOW_STAGES.map((stg) => (
                          <option key={stg} value={stg}>{stg}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold block mb-0.5">Signed Off By</label>
                      <input 
                        type="text" 
                        placeholder="Your Name" 
                        required
                        value={stageUpdateForm.completedBy} 
                        onChange={(e) => setStageUpdateForm({ ...stageUpdateForm, completedBy: e.target.value })} 
                        className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold block mb-0.5">Workflow Comments & Remarks</label>
                    <textarea 
                      rows={2} 
                      placeholder="e.g. Uploaded client rebrand drafts to assets folder, awaiting review..." 
                      value={stageUpdateForm.comments} 
                      onChange={(e) => setStageUpdateForm({ ...stageUpdateForm, comments: e.target.value })} 
                      className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900" 
                    />
                  </div>

                  <div>
                    <label className="font-semibold block mb-0.5">Attachment URL (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="https://cloudinary.com/assets/file.zip" 
                      value={stageUpdateForm.attachment} 
                      onChange={(e) => setStageUpdateForm({ ...stageUpdateForm, attachment: e.target.value })} 
                      className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900" 
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-brand-purple hover:bg-brand-purple-hover text-white py-2.5 rounded-xl font-bold cursor-pointer transition disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Authorize & Transition Stage'}
                  </button>
                </form>
              </div>

            </div>

          </aside>
        </div>
      )}

    </div>
  );
}
