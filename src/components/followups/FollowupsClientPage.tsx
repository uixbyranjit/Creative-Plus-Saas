"use client";

import React, { useState } from 'react';
import { 
  Plus, Calendar, Clock, MessageSquare, AlertCircle, X, Check, 
  Trash2, Phone, Mail, Terminal, Send 
} from 'lucide-react';
import { createFollowUp, updateFollowUpStatus, deleteFollowUp } from '@/lib/actions';

interface FollowUp {
  id: string;
  clientId: string;
  client: any;
  purpose: string;
  date: any;
  time: string;
  reminder: boolean;
  remarks: string | null;
  status: string;
  createdAt: any;
}

export default function FollowupsClientPage({ 
  initialFollowUps, clients 
}: { 
  initialFollowUps: FollowUp[], clients: any[] 
}) {
  const [followUps, setFollowUps] = useState<FollowUp[]>(initialFollowUps);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Forms
  const [form, setForm] = useState({ clientId: '', purpose: '', date: '', time: '', remarks: '', reminder: true });
  
  // simulated integration logs state
  const [integrationLogs, setIntegrationLogs] = useState<string[]>([
    "[SMS/WhatsApp] Webhook initialized. Twilio API Sandbox is Listening...",
    "[Email Outbox] SMTP Server connected. Listening on port 587...",
    "[Log] Scheduled task daemon listening for follow-up triggers..."
  ]);

  const [loading, setLoading] = useState(false);

  const refreshFollowUps = async () => {
    try {
      const res = await fetch('/api/followups-data');
      if (res.ok) {
        const data = await res.json();
        setFollowUps(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newFollowUp = await createFollowUp(form);
      const client = clients.find(c => c.id === form.clientId);
      
      // Add simulated log
      const timeStr = new Date().toLocaleTimeString();
      const newLogs = [
        `[${timeStr}] 📤 Outbox Queue: Triggered follow-up event scheduling to ${client?.name || 'Client'}.`,
        `[${timeStr}] ✉️ Email Sent: Drafted proposal reminder dispatched to ${client?.email}.`,
        `[${timeStr}] 💬 WhatsApp Triggered: Outbox template pinged to ${client?.mobile || 'number'}: "Hi ${client?.name}, reminding you of our upcoming briefing regarding '${form.purpose}' scheduled for ${new Date(form.date).toLocaleDateString()} at ${form.time}."`,
        ...integrationLogs
      ];
      setIntegrationLogs(newLogs);

      setModalOpen(false);
      setForm({ clientId: '', purpose: '', date: '', time: '', remarks: '', reminder: true });
      await refreshFollowUps();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    await updateFollowUpStatus(id, status);
    
    const fu = followUps.find(f => f.id === id);
    const client = fu?.client;
    const timeStr = new Date().toLocaleTimeString();
    setIntegrationLogs([
      `[${timeStr}] ⚙️ Status Update: Follow-up CPD-FU-${id.slice(0,4).toUpperCase()} marked as ${status} for ${client?.name || 'Client'}.`,
      ...integrationLogs
    ]);

    await refreshFollowUps();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this follow-up schedule?")) {
      await deleteFollowUp(id);
      await refreshFollowUps();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Follow-ups CRM Operations</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Coordinate client callbacks, follow-ups, and automated notifications logs.</p>
        </div>

        <button 
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-md transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Schedule Follow-up</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Schedule List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-premium overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="text-zinc-400 font-bold border-b border-zinc-100 dark:border-zinc-800 pb-2">
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Purpose</th>
                  <th className="pb-3">Scheduled Date</th>
                  <th className="pb-3">Time</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {followUps.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-zinc-400 font-medium">No follow-ups scheduled.</td>
                  </tr>
                ) : (
                  followUps.map((f) => (
                    <tr key={f.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10">
                      <td className="py-4">
                        <p className="font-bold">{f.client?.name}</p>
                        {f.client?.companyName && <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium mt-0.5">{f.client?.companyName}</p>}
                      </td>
                      <td className="py-4 font-semibold">{f.purpose}</td>
                      <td className="py-4 text-zinc-500 font-medium">{new Date(f.date).toLocaleDateString()}</td>
                      <td className="py-4 text-zinc-500 font-bold">{f.time}</td>
                      <td className="py-4">
                        <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase ${
                          f.status === 'COMPLETED' ? 'bg-green-100 dark:bg-green-950/20 text-green-700 dark:text-green-400' :
                          f.status === 'CANCELLED' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400' :
                          'bg-amber-100 dark:bg-amber-950/20 text-amber-700'
                        }`}>
                          {f.status}
                        </span>
                      </td>
                      <td className="py-4 text-right space-x-1 whitespace-nowrap">
                        {f.status === 'PENDING' && (
                          <>
                            <button 
                              onClick={() => handleUpdateStatus(f.id, 'COMPLETED')}
                              className="p-1.5 text-emerald-600 hover:bg-green-50 dark:hover:bg-zinc-800 rounded-lg transition cursor-pointer"
                              title="Mark Complete"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(f.id, 'CANCELLED')}
                              className="p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition cursor-pointer"
                              title="Cancel Meeting"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => handleDelete(f.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-500 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
                          title="Delete Schedule"
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
        </div>

        {/* Right Side: Simulated API Outbox logs */}
        <div className="space-y-4">
          <div className="bg-zinc-950 text-zinc-250 rounded-3xl p-5 border border-zinc-800 shadow-xl flex flex-col h-[400px]">
            <div className="flex items-center gap-2 mb-4 text-brand-purple pb-3 border-b border-zinc-800 shrink-0">
              <Terminal className="w-4.5 h-4.5 text-brand-purple" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-white">Email & WhatsApp Logs</h3>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 font-mono text-[9px] leading-relaxed scrollbar-thin scrollbar-thumb-zinc-800">
              {integrationLogs.map((log, idx) => (
                <div key={idx} className="whitespace-pre-wrap">
                  <span className="text-zinc-500">&gt;&nbsp;</span>
                  <span className={log.includes("WhatsApp") ? "text-emerald-400" : log.includes("Email") ? "text-blue-400 font-semibold" : "text-zinc-300"}>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* MODAL: SCHEDULE FOLLOW-UP */}
      {/* ========================================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto z-10 text-xs">
            <h3 className="font-bold text-lg mb-4">Schedule Client Follow-up</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-semibold block mb-1">Select Client *</label>
                <select required value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850">
                  <option value="">Select client...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1">Follow-up Purpose *</label>
                <input type="text" required placeholder="e.g. Logo draft design review call" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Follow-up Date *</label>
                  <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Preferred Time *</label>
                  <input type="time" required value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Remarks & Details</label>
                <textarea rows={2} value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="reminder" checked={form.reminder} onChange={(e) => setForm({ ...form, reminder: e.target.checked })} className="w-4 h-4 text-brand-purple rounded" />
                <label htmlFor="reminder" className="font-semibold cursor-pointer">Simulate automatic Email & WhatsApp alert reminders</label>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border border-zinc-200 dark:border-zinc-855 rounded-xl">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-brand-purple text-white rounded-xl font-bold cursor-pointer disabled:opacity-50">
                  {loading ? 'Scheduling...' : 'Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
