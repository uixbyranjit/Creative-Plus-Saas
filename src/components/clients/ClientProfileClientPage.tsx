"use client";

import React, { useState } from 'react';
import { 
  Building, Mail, Phone, MapPin, Briefcase, FileText, 
  DollarSign, Clock, Sparkles, CheckCircle2, ChevronRight,
  Download, Calendar, AlertTriangle, ArrowLeft, RefreshCw
} from 'lucide-react';
import Link from 'next/link';

interface ClientProfileProps {
  client: any;
}

export default function ClientProfileClientPage({ client }: ClientProfileProps) {
  const [activeTab, setActiveTab] = useState('overview');
  
  // AI summary state
  const [aiSummary, setAiSummary] = useState(
    `${client.name} is an active client in the ${client.industry || 'General'} industry. They registered via ${client.leadSource || 'Direct'}. Currently, they have ${client.orders?.length || 0} active orders and subscriptions.`
  );
  const [generatingAi, setGeneratingAi] = useState(false);

  const handleGenerateAiSummary = () => {
    setGeneratingAi(true);
    setTimeout(() => {
      const activeOrd = client.orders?.filter((o: any) => o.status !== 'COMPLETED') || [];
      const completedOrd = client.orders?.filter((o: any) => o.status === 'COMPLETED') || [];
      const totalBilled = client.payments?.reduce((sum: number, p: any) => sum + p.totalAmount, 0) || 0;
      const totalPaid = client.payments?.reduce((sum: number, p: any) => sum + p.advance, 0) || 0;
      const balance = totalBilled - totalPaid;

      const summary = `AI Portfolio Summary for ${client.name} (${client.companyName || 'Private Individual'}):
• Status: Active portfolio inside ${client.industry || 'unspecified'} vertical.
• Project pipeline: ${activeOrd.length} active projects in production, ${completedOrd.length} projects completed successfully.
• Financial balance sheet: Total billed contract value of $${totalBilled.toLocaleString()}. Settled advance funds equal $${totalPaid.toLocaleString()}, leaving an outstanding accounts receivable balance of $${balance.toLocaleString()} due.
• Recommended next step: Schedule follow-up discussion regarding ongoing deliverables for "${activeOrd[0]?.serviceName || 'active campaigns'}".`;

      setAiSummary(summary);
      setGeneratingAi(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      
      {/* Back button */}
      <div>
        <Link href="/clients" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-brand-purple font-semibold transition">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Clients Directory</span>
        </Link>
      </div>

      {/* Profile Header Header Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-premium relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img 
            src={client.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(client.name)}`} 
            alt={client.name} 
            className="w-16 h-16 rounded-3xl object-cover border border-zinc-200 dark:border-zinc-700"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tight">{client.name}</h2>
              <span className={`px-2 py-0.5 rounded font-bold text-[8px] uppercase ${
                client.status === 'Active' ? 'bg-green-100 dark:bg-green-950/20 text-green-700 dark:text-green-400' :
                'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
              }`}>
                {client.status}
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">{client.companyName || 'Independent Client'}</p>
            <span className="text-[9px] text-zinc-400 font-mono font-bold block mt-1.5">{client.clientId}</span>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="flex gap-4 text-xs">
          <div className="bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex flex-col items-center min-w-[100px]">
            <span className="text-[9px] text-zinc-400 font-bold uppercase">Orders</span>
            <span className="text-base font-black mt-1">{client.orders?.length || 0}</span>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex flex-col items-center min-w-[100px]">
            <span className="text-[9px] text-zinc-400 font-bold uppercase">Settled</span>
            <span className="text-base font-black text-emerald-600 mt-1">
              ${(client.payments?.reduce((sum: number, p: any) => sum + p.advance, 0) || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs list bar */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 flex gap-4 text-xs font-semibold">
        {['overview', 'orders', 'payments', 'documents'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 capitalize transition cursor-pointer relative ${
              activeTab === tab ? 'text-brand-purple' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
            }`}
          >
            <span>{tab}</span>
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Content wrapper */}
      <div className="space-y-6">
        
        {/* ========================================== */}
        {/* OVERVIEW TAB */}
        {/* ========================================== */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Metadata Card */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-premium space-y-4 text-xs">
              <h3 className="font-bold text-sm">Client CRM Info</h3>
              
              <div className="space-y-3 font-medium">
                <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-400 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email</span>
                  <span className="font-bold">{client.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-400 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Mobile</span>
                  <span className="font-bold">{client.mobile}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-400 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> City</span>
                  <span className="font-bold">{client.city} ({client.pinCode})</span>
                </div>
                <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-400 flex items-center gap-1.5"><Building className="w-3.5 h-3.5" /> Industry</span>
                  <span className="font-bold">{client.industry || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-400 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> GST Number</span>
                  <span className="font-bold font-mono">{client.gstNumber || 'N/A'}</span>
                </div>
                <div className="py-2">
                  <span className="text-zinc-400 block mb-1">Billing Address</span>
                  <p className="bg-zinc-50 dark:bg-zinc-800/40 p-2.5 rounded-xl border border-zinc-100/50 dark:border-zinc-800 font-bold leading-normal">{client.address || 'No billing address saved'}</p>
                </div>
              </div>
            </div>

            {/* AI Summary Card & Client Notes */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* AI Co-Pilot Summary Card */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-premium relative overflow-hidden">
                {/* Glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-purple/5 dark:bg-brand-purple/10 rounded-full blur-xl pointer-events-none" />
                
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-1.5 text-brand-purple">
                    <Sparkles className="w-4.5 h-4.5" />
                    <h3 className="font-bold text-sm">AI Portfolio Analyzer</h3>
                  </div>
                  
                  <button 
                    onClick={handleGenerateAiSummary}
                    disabled={generatingAi}
                    className="flex items-center gap-1 text-[10px] bg-brand-purple-light dark:bg-brand-purple/15 text-brand-purple px-2 py-1 rounded-lg font-bold hover:bg-brand-purple/20 transition cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${generatingAi ? 'animate-spin' : ''}`} />
                    <span>{generatingAi ? 'Summarizing...' : 'Regenerate'}</span>
                  </button>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100/50 dark:border-zinc-800 p-4 rounded-2xl text-xs leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium whitespace-pre-line">
                  {aiSummary}
                </div>
              </div>

              {/* Client Operations Notes */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-premium">
                <h3 className="font-bold text-sm mb-3">CRM Account Notes</h3>
                <textarea 
                  rows={4}
                  defaultValue={client.notes || ''}
                  placeholder="Record client requirements, branding details, design preferences..."
                  className="w-full bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3.5 text-xs focus:outline-none focus:ring-1 focus:ring-brand-purple focus:border-brand-purple"
                />
                <div className="mt-3 flex justify-end">
                  <button className="bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">
                    Save Notes
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================== */}
        {/* ORDERS TAB */}
        {/* ========================================== */}
        {activeTab === 'orders' && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-premium overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="text-zinc-400 font-bold border-b border-zinc-100 dark:border-zinc-800 pb-2">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Campaign / Service</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Contract Value</th>
                  <th className="pb-3">Priority</th>
                  <th className="pb-3 text-right">Workflow status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {client.orders?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-zinc-400">No active orders registered for this client.</td>
                  </tr>
                ) : (
                  client.orders?.map((o: any) => (
                    <tr key={o.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10">
                      <td className="py-4 font-bold text-brand-purple font-mono">{o.orderId}</td>
                      <td className="py-4 font-semibold">{o.serviceName}</td>
                      <td className="py-4 text-zinc-500 font-medium">{o.workType}</td>
                      <td className="py-4 font-bold">${o.totalAmount}</td>
                      <td className="py-4">
                        <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase ${
                          o.priority === 'URGENT' ? 'bg-red-100 dark:bg-red-950/20 text-red-700 dark:text-red-400' :
                          o.priority === 'HIGH' ? 'bg-amber-100 dark:bg-amber-950/20 text-amber-700' :
                          'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                        }`}>
                          {o.priority}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <span className="px-2 py-0.5 rounded font-bold text-[9px] bg-brand-purple-light dark:bg-brand-purple/10 text-brand-purple uppercase">
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ========================================== */}
        {/* PAYMENTS TAB */}
        {/* ========================================== */}
        {activeTab === 'payments' && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-premium overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="text-zinc-400 font-bold border-b border-zinc-100 dark:border-zinc-800 pb-2">
                  <th className="pb-3">Invoice No</th>
                  <th className="pb-3">Total Amount</th>
                  <th className="pb-3">Advance Paid</th>
                  <th className="pb-3">Balance Receivable</th>
                  <th className="pb-3">Mode</th>
                  <th className="pb-3">Due Date</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {client.payments?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-zinc-400">No payment invoices raised.</td>
                  </tr>
                ) : (
                  client.payments?.map((p: any) => (
                    <tr key={p.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10">
                      <td className="py-4 font-bold font-mono text-zinc-600 dark:text-zinc-400">{p.invoiceNumber}</td>
                      <td className="py-4 font-bold">${p.totalAmount}</td>
                      <td className="py-4 text-emerald-600 font-bold">${p.advance}</td>
                      <td className="py-4 text-amber-600 font-bold">${p.balance}</td>
                      <td className="py-4 text-zinc-500 font-semibold">{p.paymentMode}</td>
                      <td className="py-4 text-zinc-500">{new Date(p.dueDate).toLocaleDateString()}</td>
                      <td className="py-4 text-right">
                        <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase ${
                          p.status === 'PAID' ? 'bg-green-100 dark:bg-green-950/20 text-green-700 dark:text-green-400' :
                          p.status === 'PARTIAL' ? 'bg-brand-purple-light dark:bg-brand-purple/15 text-brand-purple' :
                          'bg-amber-100 dark:bg-amber-950/20 text-amber-700'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ========================================== */}
        {/* DOCUMENTS TAB */}
        {/* ========================================== */}
        {activeTab === 'documents' && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-premium">
            <h3 className="font-bold text-sm mb-4">Branding Deliverables & Files</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {client.orders?.flatMap((o: any) => o.files || []).length === 0 ? (
                <p className="col-span-2 text-center py-6 text-zinc-400 text-xs">No project files uploaded yet.</p>
              ) : (
                client.orders?.flatMap((o: any) => o.files || []).map((file: any) => (
                  <div key={file.id} className="bg-zinc-50/50 dark:bg-zinc-800/20 border border-zinc-100 dark:border-zinc-800/50 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold truncate max-w-[200px]">{file.name}</p>
                      <span className="text-[9px] text-zinc-400 dark:text-zinc-500 block mt-1">{file.type} • {(file.size / 1000000).toFixed(2)} MB</span>
                    </div>
                    <button className="p-2 text-zinc-400 hover:text-brand-purple rounded-xl hover:bg-white dark:hover:bg-zinc-800 transition cursor-pointer">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
