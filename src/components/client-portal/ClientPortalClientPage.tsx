"use client";

import React, { useState } from 'react';
import { signOut } from 'next-auth/react';
import { 
  Building, LogOut, Moon, Sun, ShoppingBag, CreditCard, 
  FolderCheck, Sparkles, Download, MessageSquare, Check, X, 
  FileText, ShieldCheck, Printer, FileDown, RefreshCw, ChevronRight, Eye 
} from 'lucide-react';
import { updateOrderStage } from '@/lib/actions';
import confetti from 'canvas-confetti';

interface ClientPortalProps {
  client: any;
  user: any;
}

export default function ClientPortalClientPage({ client: initialClient, user }: ClientPortalProps) {
  const [client, setClient] = useState(initialClient);
  const [activeTab, setTab] = useState('orders');
  const [darkMode, setDarkMode] = useState(false);
  
  // Modal / Drawer
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [invoiceViewerOpen, setInvoiceViewerOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  // Forms
  const [revisionComments, setRevisionComments] = useState('');
  const [approvalComments, setApprovalComments] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleDarkMode = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  };

  const refreshPortalData = async () => {
    try {
      const res = await fetch(`/api/client-portal-data?email=${encodeURIComponent(user.email)}`);
      if (res.ok) {
        const data = await res.json();
        setClient(data);
        if (selectedOrder) {
          const updated = data.orders.find((o: any) => o.id === selectedOrder.id);
          if (updated) setSelectedOrder(updated);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRevisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setLoading(true);
    try {
      await updateOrderStage(
        selectedOrder.id,
        "REVISION",
        client.name,
        `Revision Requested by Client: ${revisionComments}`
      );
      setRevisionComments('');
      await refreshPortalData();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setLoading(true);
    try {
      await updateOrderStage(
        selectedOrder.id,
        "APPROVAL",
        client.name,
        `Design Approved by Client! Comments: ${approvalComments}`
      );
      setApprovalComments('');
      
      // Trigger canvas-confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      await refreshPortalData();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenInvoice = (p: any) => {
    setSelectedPayment(p);
    setInvoiceViewerOpen(true);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-xs flex flex-col font-sans">
      
      {/* 1. PORTAL TOP NAV */}
      <header className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-brand-purple flex items-center justify-center text-white shadow-md">
            <span className="font-extrabold text-sm">C+</span>
          </div>
          <div>
            <h1 className="font-bold text-sm leading-none">Creative Plus</h1>
            <span className="text-[9px] text-zinc-500 dark:text-zinc-400 font-medium">Client Collaboration Portal</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={toggleDarkMode}
            className="p-2 text-zinc-500 hover:text-brand-purple rounded-xl hover:bg-zinc-150 dark:hover:bg-zinc-800 transition cursor-pointer"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4.5 h-4.5" />}
          </button>
          
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-1.5 border border-zinc-250 dark:border-zinc-850 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-3 py-2 rounded-xl font-bold transition cursor-pointer"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span className="hidden sm:inline-block">Log Out</span>
          </button>
        </div>
      </header>

      {/* 2. CORE PORTAL LAYOUT */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Side: Client profile card & quick dashboard stats */}
        <div className="space-y-6">
          
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-premium text-center">
            <img 
              src={client.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(client.name)}`} 
              alt={client.name} 
              className="w-16 h-16 rounded-3xl object-cover mx-auto mb-4 border border-zinc-250 dark:border-zinc-700" 
            />
            <h2 className="font-bold text-sm">{client.name}</h2>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 font-medium">{client.companyName || 'Independent Workspace'}</p>
            
            <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-around text-center">
              <div>
                <span className="text-[9px] text-zinc-400 block font-bold uppercase">Active Orders</span>
                <span className="text-base font-black text-brand-purple mt-1 block">
                  {client.orders?.filter((o: any) => o.status !== 'COMPLETED').length || 0}
                </span>
              </div>
              <div className="border-l border-zinc-100 dark:border-zinc-800 h-8" />
              <div>
                <span className="text-[9px] text-zinc-400 block font-bold uppercase">Payments Due</span>
                <span className="text-base font-black text-amber-600 mt-1 block">
                  ${(client.payments?.filter((p: any) => p.status !== 'PAID').reduce((sum: number, p: any) => sum + p.balance, 0) || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 text-zinc-300 rounded-3xl p-5 border border-zinc-800 shadow-xl space-y-3">
            <h3 className="font-bold text-xs text-white">Need Support?</h3>
            <p className="leading-relaxed font-medium">Contact your Creative Plus account manager immediately regarding ongoing campaigns.</p>
            <div className="space-y-2 pt-2 text-[10px] font-semibold text-zinc-400">
              <div className="flex items-center gap-2">
                <span>Email Support:</span>
                <span className="text-white hover:underline">ops@creativeplus.com</span>
              </div>
              <div className="flex items-center gap-2">
                <span>WhatsApp:</span>
                <span className="text-white hover:underline">+91 99999 88888</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Tab panel workspace */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Tabs bar selector */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-2xl shadow-sm inline-flex gap-1 font-bold">
            <button 
              onClick={() => setTab('orders')}
              className={`px-4 py-2 rounded-xl transition cursor-pointer ${activeTab === 'orders' ? 'bg-brand-purple text-white shadow' : 'text-zinc-500 hover:text-zinc-800'}`}
            >
              <ShoppingBag className="w-4 h-4 inline-block mr-1.5" />
              <span>Design Orders & Delivery</span>
            </button>
            <button 
              onClick={() => setTab('payments')}
              className={`px-4 py-2 rounded-xl transition cursor-pointer ${activeTab === 'payments' ? 'bg-brand-purple text-white shadow' : 'text-zinc-500 hover:text-zinc-800'}`}
            >
              <CreditCard className="w-4 h-4 inline-block mr-1.5" />
              <span>Invoices & Billing</span>
            </button>
          </div>

          {/* ========================================== */}
          {/* TAB 1: DESIGN ORDERS WORKSPACE */}
          {/* ========================================== */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-premium">
                <h3 className="font-bold text-sm mb-4">Active Campaign Design Work</h3>
                
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {client.orders?.length === 0 ? (
                    <p className="text-center py-6 text-zinc-400 font-medium">No design campaigns active in workspace.</p>
                  ) : (
                    client.orders?.map((o: any) => (
                      <div 
                        key={o.id} 
                        onClick={() => setSelectedOrder(o)}
                        className={`py-4 flex items-center justify-between hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10 px-3 rounded-2xl transition cursor-pointer ${selectedOrder?.id === o.id ? 'bg-zinc-50/80 dark:bg-zinc-800/20' : ''}`}
                      >
                        <div className="space-y-1">
                          <span className="text-[8px] font-mono text-zinc-400 font-bold">{o.orderId}</span>
                          <h4 className="font-bold text-xs">{o.serviceName}</h4>
                          <span className="text-[9px] bg-brand-purple-light dark:bg-brand-purple/10 text-brand-purple px-1.5 py-0.5 rounded font-extrabold">{o.status}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-400" />
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Dynamic order workspace detail (if selected) */}
              {selectedOrder && (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-premium space-y-6">
                  
                  <div className="flex justify-between items-center pb-3 border-b border-zinc-100 dark:border-zinc-800">
                    <div>
                      <span className="text-[8px] font-mono text-zinc-400 font-bold">{selectedOrder.orderId}</span>
                      <h3 className="font-bold text-sm mt-1">{selectedOrder.serviceName}</h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded font-bold text-[8px] uppercase bg-brand-purple-light dark:bg-brand-purple/15 text-brand-purple">
                      {selectedOrder.status}
                    </span>
                  </div>

                  {/* Description */}
                  {selectedOrder.description && (
                    <div>
                      <span className="text-[8px] text-zinc-400 font-bold uppercase block mb-1">Project briefing details</span>
                      <p className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800 p-3.5 rounded-2xl leading-relaxed text-zinc-600 dark:text-zinc-400 font-semibold">{selectedOrder.description}</p>
                    </div>
                  )}

                  {/* Stage History Timeline */}
                  <div>
                    <span className="text-[8px] text-zinc-400 font-bold uppercase block mb-3">Work delivery history</span>
                    <div className="relative pl-3 border-l border-zinc-100 dark:border-zinc-800 space-y-4">
                      {selectedOrder.history?.map((h: any) => (
                        <div key={h.id} className="relative text-[10px]">
                          <span className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-brand-purple border-2 border-white dark:border-zinc-900" />
                          <div>
                            <span className="text-[8px] text-zinc-400 font-bold">{new Date(h.timestamp).toLocaleString()} • {h.completedBy}</span>
                            <p className="font-bold mt-0.5">{h.stage || 'STAGE CHANGE'}</p>
                            <p className="text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">{h.comments}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Uploaded Design files download list */}
                  <div>
                    <span className="text-[8px] text-zinc-400 font-bold uppercase block mb-3">Download assets & drafts</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedOrder.files?.length === 0 ? (
                        <p className="text-zinc-400 italic">No files uploaded yet by designer.</p>
                      ) : (
                        selectedOrder.files?.map((file: any) => (
                          <div key={file.id} className="bg-zinc-50/50 dark:bg-zinc-800/20 border border-zinc-100 dark:border-zinc-800/50 p-3 rounded-2xl flex items-center justify-between">
                            <div>
                              <p className="font-bold truncate max-w-[150px]">{file.name}</p>
                              <span className="text-[8px] text-zinc-400 block mt-0.5">{file.type} • {(file.size / 1000000).toFixed(2)} MB</span>
                            </div>
                            <a 
                              href={file.path} 
                              download 
                              className="p-1.5 bg-white dark:bg-zinc-800 text-zinc-500 hover:text-brand-purple rounded-xl border border-zinc-200 dark:border-zinc-700 transition cursor-pointer"
                            >
                              <FileDown className="w-4 h-4" />
                            </a>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Collaborative actions (Request revision / Approve) */}
                  {selectedOrder.status !== 'COMPLETED' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-zinc-150 dark:border-zinc-800">
                      
                      {/* Request Revision Form */}
                      <div className="bg-amber-50/20 dark:bg-amber-950/10 border border-amber-200/50 dark:border-amber-900/30 p-4 rounded-2xl space-y-3">
                        <h4 className="font-bold flex items-center gap-1.5 text-amber-700">
                          <X className="w-4 h-4" />
                          <span>Request Design Revision</span>
                        </h4>
                        <form onSubmit={handleRevisionSubmit} className="space-y-2">
                          <textarea 
                            rows={2} 
                            required
                            placeholder="Detail needed design changes, typography edits, color swaps..." 
                            value={revisionComments}
                            onChange={(e) => setRevisionComments(e.target.value)}
                            className="w-full bg-white dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 rounded-xl p-2.5" 
                          />
                          <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 rounded-xl transition cursor-pointer disabled:opacity-50"
                          >
                            Submit Revision Request
                          </button>
                        </form>
                      </div>

                      {/* Approve Design Form */}
                      <div className="bg-emerald-50/20 dark:bg-emerald-950/10 border border-emerald-200/50 dark:border-emerald-900/30 p-4 rounded-2xl space-y-3">
                        <h4 className="font-bold flex items-center gap-1.5 text-emerald-700">
                          <Check className="w-4 h-4" />
                          <span>Approve Design Draft</span>
                        </h4>
                        <form onSubmit={handleApprovalSubmit} className="space-y-2">
                          <textarea 
                            rows={2} 
                            placeholder="Add approval comments..." 
                            value={approvalComments}
                            onChange={(e) => setApprovalComments(e.target.value)}
                            className="w-full bg-white dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 rounded-xl p-2.5" 
                          />
                          <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl transition cursor-pointer disabled:opacity-50"
                          >
                            Approve Draft & Sign-off
                          </button>
                        </form>
                      </div>

                    </div>
                  )}

                </div>
              )}

            </div>
          )}

          {/* ========================================== */}
          {/* TAB 2: INVOICES & PAYMENTS */}
          {/* ========================================== */}
          {activeTab === 'payments' && (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-premium overflow-x-auto">
              <h3 className="font-bold text-sm mb-4">My Payments Invoices</h3>
              
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="text-zinc-400 font-bold border-b border-zinc-100 dark:border-zinc-800 pb-2">
                    <th className="pb-3">Invoice No</th>
                    <th className="pb-3">Total Amount</th>
                    <th className="pb-3">Advance Paid</th>
                    <th className="pb-3">Outstanding Balance</th>
                    <th className="pb-3">Mode</th>
                    <th className="pb-3">Due Date</th>
                    <th className="pb-3 text-right font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {client.payments?.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-zinc-400">No payment invoices raised for this workspace.</td>
                    </tr>
                  ) : (
                    client.payments?.map((p: any) => (
                      <tr key={p.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10">
                        <td className="py-4 font-bold font-mono text-zinc-500">{p.invoiceNumber}</td>
                        <td className="py-4 font-bold">${p.totalAmount}</td>
                        <td className="py-4 text-emerald-600 font-bold">${p.advance}</td>
                        <td className="py-4 text-amber-600 font-bold">${p.balance}</td>
                        <td className="py-4 text-zinc-500 font-semibold">{p.paymentMode}</td>
                        <td className="py-4 text-zinc-500">{new Date(p.dueDate).toLocaleDateString()}</td>
                        <td className="py-4 text-right">
                          <div className="flex justify-end items-center gap-2">
                            <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase ${
                              p.status === 'PAID' ? 'bg-green-105 text-green-700' : 'bg-amber-105 text-amber-700'
                            }`}>
                              {p.status}
                            </span>
                            <button 
                              onClick={() => handleOpenInvoice(p)}
                              className="p-1 text-zinc-400 hover:text-brand-purple rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>

      {/* ========================================== */}
      {/* MODAL: INVOICE PREVIEW */}
      {/* ========================================== */}
      {invoiceViewerOpen && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setInvoiceViewerOpen(false)} />
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-2xl shadow-2xl relative p-6 max-h-[95vh] overflow-y-auto z-10 text-xs">
            
            {/* Header controls (hidden on print) */}
            <div className="flex justify-between items-center mb-6 pb-2 border-b border-zinc-100 dark:border-zinc-800 print:hidden">
              <span className="font-bold text-sm">Invoice PDF Viewer</span>
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={handlePrintInvoice}
                  className="flex items-center gap-1 bg-brand-purple hover:bg-brand-purple-hover text-white px-3 py-1.5 rounded-lg font-bold cursor-pointer transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Invoice</span>
                </button>
                <button onClick={() => setInvoiceViewerOpen(false)} className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"><X className="w-5 h-5" /></button>
              </div>
            </div>

            {/* Printable Invoice Page Block */}
            <div className="bg-white p-8 text-black border border-zinc-100 rounded-2xl print:border-none print:p-0 min-h-[500px] flex flex-col justify-between" id="printable-invoice">
              
              <div className="space-y-6">
                
                {/* Header branding */}
                <div className="flex justify-between items-start pb-6 border-b border-zinc-100">
                  <div>
                    <h2 className="text-base font-black tracking-tight uppercase text-zinc-900">Creative Plus</h2>
                    <p className="text-[10px] text-zinc-400 font-medium">Digital Marketing Agency</p>
                    <p className="text-[9px] text-zinc-500 mt-2 font-medium leading-relaxed font-semibold">
                      101, Maker Chambers, Nariman Point,<br />
                      Mumbai, MH - 400001
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <h1 className="text-lg font-black tracking-tight text-brand-purple uppercase">INVOICE</h1>
                    <p className="text-[10px] font-bold font-mono text-zinc-600 mt-1">{selectedPayment.invoiceNumber}</p>
                    <p className="text-[9px] text-zinc-400 mt-1">Date: {new Date(selectedPayment.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Billing Addresses splits */}
                <div className="grid grid-cols-2 gap-8 text-[9px]">
                  <div>
                    <span className="text-[8px] text-zinc-400 font-bold uppercase block mb-1">Bill To</span>
                    <p className="font-bold text-zinc-800 text-xs leading-none mb-1">{client.name}</p>
                    <p className="font-semibold text-zinc-600 mb-2">{client.companyName || 'Independent Workspace'}</p>
                    <p className="text-zinc-500 leading-normal mb-2">
                      {client.address || 'No Address saved'}<br />
                      {client.city}
                    </p>
                    {client.gstNumber && (
                      <p className="font-bold text-zinc-700">GSTIN: {client.gstNumber}</p>
                    )}
                  </div>
                  
                  <div>
                    <span className="text-[8px] text-zinc-400 font-bold uppercase block mb-1">Details</span>
                    <div className="space-y-1.5 font-semibold text-zinc-600">
                      <div className="flex justify-between">
                        <span>Due Date:</span>
                        <span className="text-zinc-900">{new Date(selectedPayment.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Payment Mode:</span>
                        <span className="text-zinc-900">{selectedPayment.paymentMode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Settlement Status:</span>
                        <span className="text-zinc-900 uppercase">{selectedPayment.status}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Line Items Table */}
                <table className="w-full text-[9px] text-left border-collapse mt-8">
                  <thead>
                    <tr className="text-zinc-400 font-bold border-b border-zinc-200 pb-1 uppercase">
                      <th className="pb-1.5">Description</th>
                      <th className="pb-1.5 text-right">Tax (GST)</th>
                      <th className="pb-1.5 text-right">Net Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-150">
                    <tr>
                      <td className="py-3">
                        <p className="font-bold text-zinc-800">{selectedPayment.order?.serviceName || 'Social Media Retainer Packages'}</p>
                        <p className="text-[8px] text-zinc-400 mt-0.5 font-semibold">Campaign contract deliverables for Creative Plus client accounts</p>
                      </td>
                      <td className="py-3 text-right font-medium">{selectedPayment.gst}%</td>
                      <td className="py-3 text-right font-bold text-zinc-800">${selectedPayment.totalAmount}</td>
                    </tr>
                  </tbody>
                </table>

              </div>

              {/* Summary calculations */}
              <div className="border-t border-zinc-100 pt-6 mt-8 flex justify-end">
                <div className="w-64 text-[9px] font-semibold text-zinc-600 space-y-1.5">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="text-zinc-800">${selectedPayment.totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST ({selectedPayment.gst}%):</span>
                    <span className="text-zinc-800">${(selectedPayment.totalAmount * (selectedPayment.gst / 100)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-zinc-100 pt-1.5 text-xs font-black text-zinc-900">
                    <span>Total Settled:</span>
                    <span>${selectedPayment.advance}</span>
                  </div>
                  <div className="flex justify-between text-xs font-black text-brand-purple">
                    <span>Balance Due:</span>
                    <span>${selectedPayment.balance}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
