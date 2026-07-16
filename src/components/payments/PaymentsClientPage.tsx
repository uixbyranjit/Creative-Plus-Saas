"use client";

import React, { useState } from 'react';
import { 
  Plus, Search, Download, CreditCard, RefreshCw, X, Eye, 
  CheckCircle2, DollarSign, Calendar, FileText, AlertTriangle, 
  Layers, Printer, ShieldCheck
} from 'lucide-react';
import { 
  createPayment, updatePaymentStatus, createSubscription, 
  processRecurringBilling, getInvoiceSettings 
} from '@/lib/actions';

interface Payment {
  id: string;
  orderId: string | null;
  order: any;
  clientId: string;
  client: any;
  totalAmount: number;
  advance: number;
  balance: number;
  paymentMode: string;
  invoiceNumber: string;
  gst: number;
  dueDate: any;
  status: string;
  createdAt: any;
}

interface Subscription {
  id: string;
  clientId: string;
  client: any;
  serviceName: string;
  amount: number;
  status: string;
  lastBilled: any;
  nextBilling: any;
}

export default function PaymentsClientPage({ 
  initialPayments, clients, orders, initialSubscriptions 
}: { 
  initialPayments: Payment[], clients: any[], orders: any[], initialSubscriptions: Subscription[] 
}) {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions);
  const [activeTab, setActiveTab] = useState('invoices');
  const [search, setSearch] = useState('');

  // Modals
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [invoiceViewerOpen, setInvoiceViewerOpen] = useState(false);
  
  // Selected Objects
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Forms
  const [paymentForm, setPaymentForm] = useState({ orderId: '', clientId: '', totalAmount: '', advance: '0', paymentMode: 'UPI', gst: '18', dueDate: '' });
  const [subForm, setSubForm] = useState({ clientId: '', serviceName: '', amount: '' });

  // Retainer run activity banner
  const [runLogs, setRunLogs] = useState<string[]>([]);
  const [runBannerOpen, setRunBannerOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const refreshPayments = async () => {
    try {
      const res = await fetch('/api/payments-data');
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments);
        setSubscriptions(data.subscriptions);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createPayment({
        ...paymentForm,
        totalAmount: parseFloat(paymentForm.totalAmount),
        advance: parseFloat(paymentForm.advance || '0'),
        gst: parseFloat(paymentForm.gst || '18')
      });
      setPaymentModalOpen(false);
      setPaymentForm({ orderId: '', clientId: '', totalAmount: '', advance: '0', paymentMode: 'UPI', gst: '18', dueDate: '' });
      await refreshPayments();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createSubscription(subForm);
      setSubscriptionModalOpen(false);
      setSubForm({ clientId: '', serviceName: '', amount: '' });
      await refreshPayments();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async (id: string, mode: string) => {
    if (confirm("Mark this invoice as fully PAID?")) {
      await updatePaymentStatus(id, "PAID", mode);
      await refreshPayments();
    }
  };

  const handleTriggerBillingRun = async () => {
    setLoading(true);
    try {
      const res = await processRecurringBilling();
      setRunLogs(res.logs);
      setRunBannerOpen(true);
      await refreshPayments();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenInvoice = (payment: Payment) => {
    setSelectedPayment(payment);
    setInvoiceViewerOpen(true);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const filteredPayments = payments.filter(p => 
    p.invoiceNumber.toLowerCase().includes(search.toLowerCase()) || 
    p.client?.name.toLowerCase().includes(search.toLowerCase()) ||
    p.client?.companyName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Payments & Subscriptions Portal</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Oversee agency accounts receivable, subscription packages, and client invoicing.</p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'invoices' ? (
            <button 
              onClick={() => setPaymentModalOpen(true)}
              className="flex items-center gap-1.5 bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-md transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Payment</span>
            </button>
          ) : (
            <button 
              onClick={() => setSubscriptionModalOpen(true)}
              className="flex items-center gap-1.5 bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-md transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Retainer Subscription</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 flex gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`pb-3 capitalize transition cursor-pointer relative ${activeTab === 'invoices' ? 'text-brand-purple' : 'text-zinc-500 hover:text-zinc-800'}`}
        >
          <span>Invoice Tracker</span>
          {activeTab === 'invoices' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple rounded-full" />}
        </button>
        
        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`pb-3 capitalize transition cursor-pointer relative ${activeTab === 'subscriptions' ? 'text-brand-purple' : 'text-zinc-500 hover:text-zinc-800'}`}
        >
          <span>Subscription Retainers</span>
          {activeTab === 'subscriptions' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple rounded-full" />}
        </button>
      </div>

      {/* ========================================== */}
      {/* VIEW 1: INVOICE TRACKER */}
      {/* ========================================== */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search invoices by client name, company, or number..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-brand-purple focus:border-brand-purple shadow-sm"
            />
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-premium overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="text-zinc-400 font-bold border-b border-zinc-100 dark:border-zinc-800 pb-2">
                  <th className="pb-3">Invoice Number</th>
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Total Amount</th>
                  <th className="pb-3">Advance Settled</th>
                  <th className="pb-3">Balance Receivable</th>
                  <th className="pb-3">Mode</th>
                  <th className="pb-3">Due Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-zinc-400 font-medium">No invoices registered.</td>
                  </tr>
                ) : (
                  filteredPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10">
                      <td className="py-4 font-bold font-mono text-zinc-500">{p.invoiceNumber}</td>
                      <td className="py-4">
                        <p className="font-bold">{p.client?.name}</p>
                        {p.client?.companyName && <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium mt-0.5">{p.client?.companyName}</p>}
                      </td>
                      <td className="py-4 font-bold">${p.totalAmount}</td>
                      <td className="py-4 text-emerald-600 font-bold">${p.advance}</td>
                      <td className="py-4 text-amber-600 font-bold">${p.balance}</td>
                      <td className="py-4 text-zinc-500 font-semibold">{p.paymentMode}</td>
                      <td className="py-4 text-zinc-500 font-medium">{new Date(p.dueDate).toLocaleDateString()}</td>
                      <td className="py-4">
                        <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase ${
                          p.status === 'PAID' ? 'bg-green-100 dark:bg-green-950/20 text-green-700 dark:text-green-400' :
                          p.status === 'PARTIAL' ? 'bg-brand-purple-light dark:bg-brand-purple/10 text-brand-purple' :
                          'bg-red-100 dark:bg-red-950/20 text-red-700 dark:text-red-400'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-4 text-right space-x-1 whitespace-nowrap">
                        <button 
                          onClick={() => handleOpenInvoice(p)}
                          className="inline-flex p-1.5 text-zinc-500 hover:text-brand-purple rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition cursor-pointer"
                          title="View Printable Invoice"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {p.status !== 'PAID' && (
                          <button 
                            onClick={() => handleMarkAsPaid(p.id, p.paymentMode)}
                            className="inline-flex p-1.5 text-emerald-600 hover:text-emerald-700 rounded-lg hover:bg-green-50 dark:hover:bg-zinc-800 transition cursor-pointer"
                            title="Mark as Paid"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* VIEW 2: SUBSCRIPTION RETAINERS */}
      {/* ========================================== */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-6">
          
          {/* Billing run options panel */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-3xl shadow-premium flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-sm">Monthly Subscription Billing Routine</h3>
              <p className="text-[11px] text-zinc-400 font-medium mt-1">Run retainer billing sweeps. System checks active contracts due for billing and auto-generates recurring invoices.</p>
            </div>
            
            <button 
              onClick={handleTriggerBillingRun}
              disabled={loading}
              className="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Trigger Retainer Billing Run</span>
            </button>
          </div>

          {/* Activity Logs of the billing run */}
          {runBannerOpen && (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 p-4 rounded-3xl space-y-2 relative text-xs">
              <button onClick={() => setRunBannerOpen(false)} className="absolute right-4 top-4 text-zinc-400"><X className="w-4 h-4" /></button>
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Billing Sweep Complete</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 font-semibold text-zinc-600 dark:text-zinc-400">
                {runLogs.length === 0 ? (
                  <li>No subscriptions were due for billing inside this cycle.</li>
                ) : (
                  runLogs.map((log, id) => <li key={id}>{log}</li>)
                )}
              </ul>
            </div>
          )}

          {/* Subscriptions Table */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-premium overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="text-zinc-400 font-bold border-b border-zinc-100 dark:border-zinc-800 pb-2">
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Retainer Service Name</th>
                  <th className="pb-3">Billing Cycle Amount</th>
                  <th className="pb-3">Last Billed</th>
                  <th className="pb-3">Next Billing Date</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {subscriptions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-zinc-400">No recurring retainer packages registered.</td>
                  </tr>
                ) : (
                  subscriptions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10">
                      <td className="py-4">
                        <p className="font-bold">{sub.client?.name}</p>
                        {sub.client?.companyName && <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">{sub.client?.companyName}</p>}
                      </td>
                      <td className="py-4 font-semibold">{sub.serviceName}</td>
                      <td className="py-4 font-bold text-zinc-850 dark:text-zinc-100">${sub.amount}/mo</td>
                      <td className="py-4 text-zinc-500">{new Date(sub.lastBilled).toLocaleDateString()}</td>
                      <td className="py-4 text-zinc-500 font-medium">{new Date(sub.nextBilling).toLocaleDateString()}</td>
                      <td className="py-4 text-right">
                        <span className="px-2 py-0.5 rounded font-bold text-[9px] bg-green-100 dark:bg-green-950/20 text-green-700 dark:text-green-400 uppercase">
                          {sub.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: RECORD PAYMENT */}
      {/* ========================================== */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setPaymentModalOpen(false)} />
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto z-10 text-xs">
            <h3 className="font-bold text-lg mb-4">Record Payment & Raise Invoice</h3>
            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Select Client *</label>
                  <select required value={paymentForm.clientId} onChange={(e) => setPaymentForm({ ...paymentForm, clientId: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850">
                    <option value="">Select client...</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Related Order</label>
                  <select value={paymentForm.orderId} onChange={(e) => setPaymentForm({ ...paymentForm, orderId: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850">
                    <option value="">Select order...</option>
                    {orders.filter(o => o.clientId === paymentForm.clientId || !paymentForm.clientId).map(o => <option key={o.id} value={o.id}>{o.serviceName} ({o.orderId})</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Total Amount ($) *</label>
                  <input type="number" required placeholder="3000" value={paymentForm.totalAmount} onChange={(e) => setPaymentForm({ ...paymentForm, totalAmount: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Advance Settled ($)</label>
                  <input type="number" placeholder="1000" value={paymentForm.advance} onChange={(e) => setPaymentForm({ ...paymentForm, advance: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Payment Mode</label>
                  <select value={paymentForm.paymentMode} onChange={(e) => setPaymentForm({ ...paymentForm, paymentMode: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850">
                    <option value="UPI">UPI</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="CARD">Credit/Debit Card</option>
                    <option value="CASH">Cash</option>
                    <option value="CHEQUE">Cheque</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">GST Percentage (%)</label>
                  <input type="number" placeholder="18" value={paymentForm.gst} onChange={(e) => setPaymentForm({ ...paymentForm, gst: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Due Date *</label>
                <input type="date" required value={paymentForm.dueDate} onChange={(e) => setPaymentForm({ ...paymentForm, dueDate: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button type="button" onClick={() => setPaymentModalOpen(false)} className="px-4 py-2 border border-zinc-200 dark:border-zinc-850 rounded-xl">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-brand-purple text-white rounded-xl font-bold cursor-pointer disabled:opacity-50">
                  {loading ? 'Saving...' : 'Record Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: CREATE RETAINER SUBSCRIPTION */}
      {/* ========================================== */}
      {subscriptionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSubscriptionModalOpen(false)} />
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-md shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto z-10 text-xs">
            <h3 className="font-bold text-lg mb-4">Create Retainer Subscription</h3>
            <form onSubmit={handleCreateSubscription} className="space-y-4">
              <div>
                <label className="font-semibold block mb-1">Select Client *</label>
                <select required value={subForm.clientId} onChange={(e) => setSubForm({ ...subForm, clientId: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850">
                  <option value="">Select client...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1">Retainer Package Title *</label>
                <input type="text" required placeholder="e.g. Monthly Social Media Retainer (15 Posts)" value={subForm.serviceName} onChange={(e) => setSubForm({ ...subForm, serviceName: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
              </div>
              <div>
                <label className="font-semibold block mb-1">Monthly Billing Rate ($) *</label>
                <input type="number" required placeholder="1200" value={subForm.amount} onChange={(e) => setSubForm({ ...subForm, amount: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button type="button" onClick={() => setSubscriptionModalOpen(false)} className="px-4 py-2 border border-zinc-200 dark:border-zinc-850 rounded-xl">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-brand-purple text-white rounded-xl font-bold cursor-pointer disabled:opacity-50">
                  {loading ? 'Creating...' : 'Create Retainer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: INVOICE PDF VIEW PREVIEW */}
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
                    <p className="text-[9px] text-zinc-500 mt-2 font-medium leading-relaxed">
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
                    <p className="font-bold text-zinc-800 text-xs leading-none mb-1">{selectedPayment.client?.name}</p>
                    <p className="font-semibold text-zinc-600 mb-2">{selectedPayment.client?.companyName || 'Independent portfolio'}</p>
                    <p className="text-zinc-500 leading-normal mb-2">
                      {selectedPayment.client?.address || 'No Address saved'}<br />
                      {selectedPayment.client?.city}
                    </p>
                    {selectedPayment.client?.gstNumber && (
                      <p className="font-bold text-zinc-700">GSTIN: {selectedPayment.client.gstNumber}</p>
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
                        <p className="text-[8px] text-zinc-400 mt-0.5">Campaign contract deliverables for Creative Plus client accounts</p>
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
