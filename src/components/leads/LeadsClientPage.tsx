"use client";

import React, { useState } from 'react';
import { 
  Plus, ArrowRight, ArrowLeft, Trash2, CheckCircle2, 
  Sparkles, Mail, Phone, ExternalLink, RefreshCw 
} from 'lucide-react';
import { createLead, updateLead, deleteLead, convertLeadToClient } from '@/lib/actions';

interface Lead {
  id: string;
  leadId: string;
  clientName: string;
  companyName: string | null;
  email: string;
  mobile: string;
  source: string;
  status: string;
  remarks: string | null;
  createdAt: any;
}

const COLUMNS = [
  { id: 'NEW_LEAD', name: 'New Leads', color: 'border-zinc-200 dark:border-zinc-800' },
  { id: 'CONTACTED', name: 'Contacted', color: 'border-blue-200 dark:border-blue-900/30' },
  { id: 'PROPOSAL', name: 'Proposal Sent', color: 'border-amber-200 dark:border-amber-900/30' },
  { id: 'WON', name: 'Won (Converted)', color: 'border-emerald-200 dark:border-emerald-900/30' },
  { id: 'LOST', name: 'Lost / Closed', color: 'border-red-200 dark:border-red-900/30' }
];

export default function LeadsClientPage({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // New lead form
  const [leadForm, setLeadForm] = useState({ clientName: '', companyName: '', email: '', mobile: '', source: 'Website', remarks: '' });
  
  // Convert client form
  const [convertForm, setConvertForm] = useState({ city: '', pinCode: '', address: '', industry: 'Tech' });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refreshLeads = async () => {
    try {
      const res = await fetch('/api/leads-data');
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createLead(leadForm);
      setLeadForm({ clientName: '', companyName: '', email: '', mobile: '', source: 'Website', remarks: '' });
      setLeadModalOpen(false);
      await refreshLeads();
    } catch (err: any) {
      setError(err?.message || 'Failed to create lead');
    } finally {
      setLoading(false);
    }
  };

  const handleMoveStatus = async (leadId: string, nextStatus: string) => {
    try {
      const lead = leads.find(l => l.id === leadId);
      if (lead) {
        await updateLead(leadId, { ...lead, status: nextStatus });
        await refreshLeads();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (leadId: string) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      await deleteLead(leadId);
      await refreshLeads();
    }
  };

  const handleOpenConvert = (lead: Lead) => {
    setSelectedLead(lead);
    setConvertModalOpen(true);
  };

  const handleConvertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    setLoading(true);
    setError('');
    try {
      await convertLeadToClient(
        selectedLead.id,
        convertForm.city,
        convertForm.pinCode,
        convertForm.address,
        convertForm.industry
      );
      setConvertModalOpen(false);
      setConvertForm({ city: '', pinCode: '', address: '', industry: 'Tech' });
      setSelectedLead(null);
      await refreshLeads();
    } catch (err: any) {
      setError(err?.message || 'Failed to convert lead to client');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title block */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Leads Management Board</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Nurture marketing leads into billing clients.</p>
        </div>
        
        <button 
          onClick={() => setLeadModalOpen(true)}
          className="flex items-center gap-1.5 bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-md transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Lead</span>
        </button>
      </div>

      {/* Board Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const colLeads = leads.filter(l => l.status === col.id);
          
          return (
            <div key={col.id} className={`bg-zinc-100/50 dark:bg-zinc-900/30 rounded-3xl p-4 border border-zinc-200/50 dark:border-zinc-800/80 min-w-[220px] flex flex-col`}>
              
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wide">{col.name}</span>
                <span className="text-[10px] bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded-full font-bold">{colLeads.length}</span>
              </div>

              {/* Cards wrapper */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[70vh] min-h-[400px]">
                {colLeads.map((lead) => (
                  <div key={lead.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/60 p-4 rounded-2xl shadow-sm space-y-3 hover:shadow-md transition">
                    
                    {/* Source tag & short id */}
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] bg-brand-purple-light dark:bg-brand-purple/10 text-brand-purple px-1.5 py-0.5 rounded font-extrabold">{lead.source}</span>
                      <span className="text-[8px] font-mono text-zinc-400 font-bold">{lead.leadId}</span>
                    </div>

                    {/* Details */}
                    <div>
                      <h4 className="font-bold text-xs leading-snug">{lead.clientName}</h4>
                      {lead.companyName && (
                        <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-medium mt-0.5">{lead.companyName}</p>
                      )}
                    </div>

                    {/* Contact links */}
                    <div className="space-y-1 text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-zinc-400" />
                        <span className="truncate">{lead.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-zinc-400" />
                        <span>{lead.mobile}</span>
                      </div>
                    </div>

                    {/* Remarks summary */}
                    {lead.remarks && (
                      <p className="text-[9px] text-zinc-400 italic leading-snug bg-zinc-50 dark:bg-zinc-800/30 p-2 rounded-xl border border-zinc-100/50 dark:border-zinc-800">{lead.remarks}</p>
                    )}

                    {/* Action row */}
                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/50 flex justify-between items-center gap-1">
                      
                      <div className="flex gap-1">
                        <button 
                          onClick={() => handleDelete(lead.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-500 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {lead.status !== 'WON' && (
                          <button
                            onClick={() => handleOpenConvert(lead)}
                            className="flex items-center gap-0.5 text-[9px] bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-lg font-bold border border-emerald-100 dark:border-emerald-900/50 hover:bg-emerald-100 transition cursor-pointer"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Convert</span>
                          </button>
                        )}
                      </div>

                      {/* Moving buttons */}
                      <div className="flex gap-0.5">
                        {col.id !== 'NEW_LEAD' && (
                          <button 
                            onClick={() => handleMoveStatus(lead.id, COLUMNS[COLUMNS.findIndex(c => c.id === col.id) - 1].id)}
                            className="p-1 text-zinc-400 hover:text-brand-purple rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
                          >
                            <ArrowLeft className="w-3 h-3" />
                          </button>
                        )}
                        {col.id !== 'LOST' && col.id !== 'WON' && (
                          <button 
                            onClick={() => handleMoveStatus(lead.id, COLUMNS[COLUMNS.findIndex(c => c.id === col.id) + 1].id)}
                            className="p-1 text-zinc-400 hover:text-brand-purple rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
                          >
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                    </div>

                  </div>
                ))}
              </div>

            </div>
          );
        })}
      </div>

      {/* ========================================== */}
      {/* ADD LEAD MODAL */}
      {/* ========================================== */}
      {leadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setLeadModalOpen(false)} />
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-md shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto z-10 text-xs">
            <h3 className="font-bold text-lg mb-4">Register New Lead</h3>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <form onSubmit={handleCreateLead} className="space-y-4">
              <div>
                <label className="font-semibold block mb-1">Lead Contact Name *</label>
                <input type="text" required value={leadForm.clientName} onChange={(e) => setLeadForm({ ...leadForm, clientName: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
              </div>
              <div>
                <label className="font-semibold block mb-1">Company Name</label>
                <input type="text" value={leadForm.companyName} onChange={(e) => setLeadForm({ ...leadForm, companyName: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Email Address *</label>
                  <input type="email" required value={leadForm.email} onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Mobile Number *</label>
                  <input type="text" required value={leadForm.mobile} onChange={(e) => setLeadForm({ ...leadForm, mobile: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Lead Source</label>
                <select value={leadForm.source} onChange={(e) => setLeadForm({ ...leadForm, source: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850">
                  <option value="Website">Website</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Reference">Reference</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1">Remarks & Requirements</label>
                <textarea rows={3} value={leadForm.remarks} onChange={(e) => setLeadForm({ ...leadForm, remarks: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button type="button" onClick={() => setLeadModalOpen(false)} className="px-4 py-2 border border-zinc-200 dark:border-zinc-855 rounded-xl">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-brand-purple text-white rounded-xl font-bold cursor-pointer disabled:opacity-50">
                  {loading ? 'Registering...' : 'Save Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* CONVERT TO CLIENT MODAL */}
      {/* ========================================== */}
      {convertModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConvertModalOpen(false)} />
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-md shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto z-10 text-xs">
            <div className="flex items-center gap-2 mb-4 text-emerald-600">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-bold text-base">Convert Lead to CRM Client</h3>
            </div>
            
            <p className="text-zinc-500 mb-4 font-medium leading-relaxed">
              Converting <strong>{selectedLead.clientName}</strong> will add them as an active Client portfolio, automatically generate secure Client Portal user credentials, and mark this lead as WON.
            </p>

            {error && <p className="text-red-500 mb-2">{error}</p>}
            
            <form onSubmit={handleConvertSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">City *</label>
                  <input type="text" required value={convertForm.city} onChange={(e) => setConvertForm({ ...convertForm, city: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Pin Code *</label>
                  <input type="text" required value={convertForm.pinCode} onChange={(e) => setConvertForm({ ...convertForm, pinCode: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Industry Vertical *</label>
                <input type="text" required value={convertForm.industry} onChange={(e) => setConvertForm({ ...convertForm, industry: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
              </div>
              <div>
                <label className="font-semibold block mb-1">Full Billing Address</label>
                <textarea rows={2} value={convertForm.address} onChange={(e) => setConvertForm({ ...convertForm, address: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button type="button" onClick={() => setConvertModalOpen(false)} className="px-4 py-2 border border-zinc-200 dark:border-zinc-850 rounded-xl">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer disabled:opacity-50 flex items-center gap-1.5">
                  <span>Authorize & Convert</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
