"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  Search, Plus, Download, Upload, Eye, Edit2, 
  Trash2, X, AlertCircle, RefreshCw, FileSpreadsheet 
} from 'lucide-react';
import { createClient, updateClient, deleteClient } from '@/lib/actions';

interface Client {
  id: string;
  clientId: string;
  name: string;
  companyName: string | null;
  mobile: string;
  email: string;
  city: string;
  pinCode: string;
  leadSource: string;
  gstNumber: string | null;
  address: string | null;
  industry: string | null;
  status: string;
  profileImage: string | null;
  createdAt: any;
}

export default function ClientsClientPage({ initialClients }: { initialClients: Client[] }) {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('name');
  
  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Form States
  const [form, setForm] = useState({ name: '', companyName: '', email: '', mobile: '', city: '', pinCode: '', leadSource: 'Website', gstNumber: '', address: '', industry: '', status: 'Active' });
  const [editForm, setEditForm] = useState({ name: '', companyName: '', email: '', mobile: '', city: '', pinCode: '', leadSource: 'Website', gstNumber: '', address: '', industry: '', status: 'Active' });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshClients = async () => {
    try {
      const res = await fetch('/api/clients-data');
      if (res.ok) {
        const data = await res.json();
        setClients(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createClient(form);
      setForm({ name: '', companyName: '', email: '', mobile: '', city: '', pinCode: '', leadSource: 'Website', gstNumber: '', address: '', industry: '', status: 'Active' });
      setModalOpen(false);
      await refreshClients();
    } catch (err: any) {
      setError(err?.message || 'Failed to create client');
    } finally {
      setLoading(false);
    }
  };

  const handleEditOpen = (client: Client) => {
    setSelectedClient(client);
    setEditForm({
      name: client.name,
      companyName: client.companyName || '',
      email: client.email,
      mobile: client.mobile,
      city: client.city,
      pinCode: client.pinCode,
      leadSource: client.leadSource,
      gstNumber: client.gstNumber || '',
      address: client.address || '',
      industry: client.industry || '',
      status: client.status
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;
    setLoading(true);
    setError('');
    try {
      await updateClient(selectedClient.id, editForm);
      setEditModalOpen(false);
      setSelectedClient(null);
      await refreshClients();
    } catch (err: any) {
      setError(err?.message || 'Failed to update client');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this client? This will delete all their orders, payments, subscriptions, and follow-ups.")) {
      await deleteClient(id);
      await refreshClients();
    }
  };

  // CSV EXPORT GENERATOR
  const handleExportCSV = () => {
    const headers = ["Client ID", "Name", "Company Name", "Email", "Mobile", "City", "Pin Code", "Source", "GST Number", "Industry", "Status", "Date Added"];
    const rows = clients.map(c => [
      c.clientId,
      c.name,
      c.companyName || "",
      c.email,
      c.mobile,
      c.city,
      c.pinCode,
      c.leadSource,
      c.gstNumber || "",
      c.industry || "",
      c.status,
      new Date(c.createdAt).toLocaleDateString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `creative_plus_clients_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV IMPORT PARSER
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      
      // Assume header: clientName,companyName,email,mobile,city,pinCode,leadSource,gstNumber,address,industry
      // Skip header line
      const dataRows = lines.slice(1);
      
      setLoading(true);
      setError('');
      let count = 0;
      
      for (const row of dataRows) {
        // Parse CSV fields (accounting for quotes)
        const fields = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || row.split(',');
        const cleanFields = fields.map(f => f.replace(/^"|"$/g, '').trim());
        
        if (cleanFields.length >= 4) {
          try {
            await createClient({
              name: cleanFields[0],
              companyName: cleanFields[1] || '',
              email: cleanFields[2],
              mobile: cleanFields[3],
              city: cleanFields[4] || 'Mumbai',
              pinCode: cleanFields[5] || '400001',
              leadSource: cleanFields[6] || 'Other',
              gstNumber: cleanFields[7] || '',
              address: cleanFields[8] || '',
              industry: cleanFields[9] || 'Tech',
              status: 'Active'
            });
            count++;
          } catch (err) {
            console.error("Row import failed:", err);
          }
        }
      }

      setLoading(false);
      alert(`Successfully imported ${count} client records.`);
      await refreshClients();
      if (fileInputRef.current) fileInputRef.current.value = '';
    };

    reader.readAsText(file);
  };

  // Filters logic
  const filteredClients = clients
    .filter(c => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.companyName?.toLowerCase().includes(search.toLowerCase()) || 
                          c.email.toLowerCase().includes(search.toLowerCase()) ||
                          c.clientId.toLowerCase().includes(search.toLowerCase());
      
      const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Clients CRM Directory</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Manage active client accounts, profiles, invoicing settings, and delivery folders.</p>
        </div>
        
        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-1 bg-white border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-100 text-xs font-bold px-3 py-2.5 rounded-xl shadow-sm transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 bg-white border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-100 text-xs font-bold px-3 py-2.5 rounded-xl shadow-sm transition cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import CSV</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImportCSV} 
            accept=".csv" 
            className="hidden" 
          />

          <button 
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-md transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Client</span>
          </button>
        </div>
      </div>

      {/* Filters bar */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search clients by ID, name, company..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-brand-purple focus:border-brand-purple"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end text-xs">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Blocked">Blocked</option>
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850 focus:outline-none"
          >
            <option value="name">Sort by Name</option>
            <option value="date">Sort by Date Added</option>
          </select>
        </div>

      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-premium overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="text-zinc-400 font-bold border-b border-zinc-100 dark:border-zinc-800 pb-2">
              <th className="pb-3">Client ID</th>
              <th className="pb-3">Client details</th>
              <th className="pb-3">Contact</th>
              <th className="pb-3">City</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Added</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-zinc-400 font-medium">No clients directory match.</td>
              </tr>
            ) : (
              filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10">
                  <td className="py-4 font-bold text-brand-purple font-mono">{client.clientId}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2.5">
                      <img src={client.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(client.name)}`} alt={client.name} className="w-8 h-8 rounded-full object-cover shrink-0 border border-zinc-200 dark:border-zinc-700" />
                      <div>
                        <p className="font-bold">{client.name}</p>
                        {client.companyName && <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium mt-0.5">{client.companyName}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <p className="font-medium">{client.email}</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">{client.mobile}</p>
                  </td>
                  <td className="py-4 text-zinc-500 font-medium">{client.city}</td>
                  <td className="py-4">
                    <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase ${
                      client.status === 'Active' ? 'bg-green-100 dark:bg-green-950/20 text-green-700 dark:text-green-400' :
                      client.status === 'Blocked' ? 'bg-red-100 dark:bg-red-950/20 text-red-700 dark:text-red-400' :
                      'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="py-4 text-zinc-500">{new Date(client.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 text-right space-x-1 whitespace-nowrap">
                    <Link 
                      href={`/clients/${client.id}`}
                      className="inline-flex p-1.5 text-zinc-500 hover:text-brand-purple rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button 
                      onClick={() => handleEditOpen(client)}
                      className="p-1.5 text-zinc-500 hover:text-brand-purple rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(client.id)}
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

      {/* ========================================== */}
      {/* ADD CLIENT MODAL */}
      {/* ========================================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto z-10 text-xs">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-bold text-base">Add Client Profile</h3>
              <button onClick={() => setModalOpen(false)} className="text-zinc-400 hover:text-zinc-600"><X className="w-4 h-4" /></button>
            </div>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Client Name *</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Company Name</label>
                  <input type="text" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Email Address *</label>
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Mobile Number *</label>
                  <input type="text" required value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold block mb-1">City</label>
                  <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Pin Code</label>
                  <input type="text" value={form.pinCode} onChange={(e) => setForm({ ...form, pinCode: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Lead Source</label>
                  <select value={form.leadSource} onChange={(e) => setForm({ ...form, leadSource: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850">
                    <option value="Website">Website</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Reference">Reference</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">GST Number</label>
                  <input type="text" placeholder="27AAAAA1111A1Z1" value={form.gstNumber} onChange={(e) => setForm({ ...form, gstNumber: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Industry</label>
                  <input type="text" placeholder="Retail" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Billing Address</label>
                <textarea rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border border-zinc-200 dark:border-zinc-850 rounded-xl">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-brand-purple text-white rounded-xl font-bold cursor-pointer disabled:opacity-50">
                  {loading ? 'Saving...' : 'Create Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* EDIT CLIENT MODAL */}
      {/* ========================================== */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditModalOpen(false)} />
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto z-10 text-xs">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-bold text-base">Edit Client Portfolio</h3>
              <button onClick={() => setEditModalOpen(false)} className="text-zinc-400 hover:text-zinc-600"><X className="w-4 h-4" /></button>
            </div>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Client Name *</label>
                  <input type="text" required value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Company Name</label>
                  <input type="text" value={editForm.companyName} onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Email Address *</label>
                  <input type="email" required value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Mobile Number *</label>
                  <input type="text" required value={editForm.mobile} onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold block mb-1">City</label>
                  <input type="text" value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Pin Code</label>
                  <input type="text" value={editForm.pinCode} onChange={(e) => setEditForm({ ...editForm, pinCode: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Lead Source</label>
                  <select value={editForm.leadSource} onChange={(e) => setEditForm({ ...editForm, leadSource: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850">
                    <option value="Website">Website</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Reference">Reference</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold block mb-1">GST Number</label>
                  <input type="text" value={editForm.gstNumber} onChange={(e) => setEditForm({ ...editForm, gstNumber: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Industry</label>
                  <input type="text" value={editForm.industry} onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Status</label>
                  <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Billing Address</label>
                <textarea rows={2} value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button type="button" onClick={() => setEditModalOpen(false)} className="px-4 py-2 border border-zinc-200 dark:border-zinc-850 rounded-xl">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-brand-purple text-white rounded-xl font-bold cursor-pointer disabled:opacity-50">
                  {loading ? 'Saving...' : 'Update Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
