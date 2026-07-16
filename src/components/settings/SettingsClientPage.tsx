"use client";

import React, { useState, useRef } from 'react';
import { 
  Building, ShieldAlert, CheckCircle, Database, Download, 
  Upload, Terminal, Mail, Phone, Moon, Sun, Save, Cloud, Key
} from 'lucide-react';
import { 
  downloadBackup, restoreDatabase, getInvoiceSettings, updateInvoiceSettings 
} from '@/lib/actions';

export default function SettingsClientPage({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState('agency');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Invoice settings
  const [agencyForm, setAgencyForm] = useState({
    companyName: 'Creative Plus Digital Marketing Agency',
    agencyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
    gstNumber: '27AAAAA1111A1Z1',
    address: '101, Maker Chambers, Nariman Point, Mumbai, India',
    email: 'contact@creativeplus.com',
    whatsappApi: '+91 99999 88888'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch invoice settings on mount
  React.useEffect(() => {
    async function loadSettings() {
      const settings = await getInvoiceSettings();
      if (settings) {
        setAgencyForm(settings);
      }
    }
    loadSettings();
  }, []);

  const handleAgencySave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await updateInvoiceSettings(agencyForm);
      setSuccess('Agency settings saved successfully.');
    } catch (err: any) {
      setError(err?.message || 'Failed to save settings.');
    } finally {
      setLoading(false);
    }
  };

  // BACKUP EXPORTER
  const handleBackup = async () => {
    setLoading(true);
    try {
      const backupJson = await downloadBackup();
      const blob = new Blob([backupJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `creative_plus_db_backup_${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setSuccess('Database backup file generated and downloaded successfully.');
    } catch (err) {
      setError('Backup failed.');
    } finally {
      setLoading(false);
    }
  };

  // RESTORE PARSER
  const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setSuccess('');

    const reader = new FileReader();
    reader.onload = async (event) => {
      const jsonString = event.target?.result as string;
      try {
        const res = await restoreDatabase(jsonString);
        if (res.success) {
          setSuccess(res.message);
        } else {
          setError(res.message);
        }
      } catch (err: any) {
        setError(err?.message || 'Restore processing failed.');
      } finally {
        setLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black tracking-tight">System Settings & Operations</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Configure agency billing profiles, backup archives, and developer API settings.</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 flex gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('agency')}
          className={`pb-3 capitalize transition cursor-pointer relative ${activeTab === 'agency' ? 'text-brand-purple' : 'text-zinc-500 hover:text-zinc-850'}`}
        >
          <span>Agency Details</span>
          {activeTab === 'agency' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple rounded-full" />}
        </button>
        
        <button
          onClick={() => setActiveTab('database')}
          className={`pb-3 capitalize transition cursor-pointer relative ${activeTab === 'database' ? 'text-brand-purple' : 'text-zinc-500 hover:text-zinc-850'}`}
        >
          <span>Database Backup & Restore</span>
          {activeTab === 'database' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple rounded-full" />}
        </button>

        <button
          onClick={() => setActiveTab('integrations')}
          className={`pb-3 capitalize transition cursor-pointer relative ${activeTab === 'integrations' ? 'text-brand-purple' : 'text-zinc-500 hover:text-zinc-850'}`}
        >
          <span>Email & WhatsApp API</span>
          {activeTab === 'integrations' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple rounded-full" />}
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-3 rounded-2xl text-xs border border-red-100 dark:border-red-900/30">
          <ShieldAlert className="w-4.5 h-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 p-3 rounded-2xl text-xs border border-green-100 dark:border-green-900/30">
          <CheckCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 1: AGENCY SETTINGS FORM */}
      {/* ========================================== */}
      {activeTab === 'agency' && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-premium max-w-xl">
          <h3 className="font-bold text-sm mb-4 pb-2 border-b border-zinc-150 dark:border-zinc-800">Agency Billing Profile</h3>
          
          <form onSubmit={handleAgencySave} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold block mb-1">Agency Trading Name *</label>
              <input 
                type="text" 
                required 
                value={agencyForm.companyName} 
                onChange={(e) => setAgencyForm({ ...agencyForm, companyName: e.target.value })} 
                className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold block mb-1">Agency Support Email *</label>
                <input 
                  type="email" 
                  required 
                  value={agencyForm.email} 
                  onChange={(e) => setAgencyForm({ ...agencyForm, email: e.target.value })} 
                  className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" 
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">WhatsApp API Contact Number *</label>
                <input 
                  type="text" 
                  required 
                  value={agencyForm.whatsappApi} 
                  onChange={(e) => setAgencyForm({ ...agencyForm, whatsappApi: e.target.value })} 
                  className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold block mb-1">Agency GSTIN *</label>
                <input 
                  type="text" 
                  required 
                  value={agencyForm.gstNumber} 
                  onChange={(e) => setAgencyForm({ ...agencyForm, gstNumber: e.target.value })} 
                  className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850 font-mono" 
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Logo URL (Preview URL)</label>
                <input 
                  type="text" 
                  value={agencyForm.agencyLogo} 
                  onChange={(e) => setAgencyForm({ ...agencyForm, agencyLogo: e.target.value })} 
                  className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" 
                />
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1">Agency Billing Office Address</label>
              <textarea 
                rows={3} 
                value={agencyForm.address} 
                onChange={(e) => setAgencyForm({ ...agencyForm, address: e.target.value })} 
                className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" 
              />
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
              <button 
                type="submit" 
                disabled={loading}
                className="flex items-center gap-1.5 bg-brand-purple hover:bg-brand-purple-hover text-white px-4 py-2 rounded-xl font-bold cursor-pointer transition disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </button>
            </div>
          </form>

        </div>
      )}

      {/* ========================================== */}
      {/* TAB 2: DATABASE BACKUP & RESTORE */}
      {/* ========================================== */}
      {activeTab === 'database' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Backup Panel */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-premium flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3 text-brand-purple">
                <Database className="w-5 h-5" />
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Export Database Backup</h3>
              </div>
              <p className="text-zinc-500 font-medium leading-relaxed text-xs">
                Downloads a serialized JSON file containing a complete backup dump of the database (Users, Clients, Orders, Tasks, Payments, Follow-ups, and logs). Recommended before performing major updates.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <button 
                onClick={handleBackup}
                disabled={loading}
                className="w-full flex items-center justify-center gap-1.5 bg-brand-purple hover:bg-brand-purple-hover text-white py-2.5 rounded-xl font-bold transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Database Dump (.json)</span>
              </button>
            </div>
          </div>

          {/* Restore Panel */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-premium flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3 text-red-500">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Restore Database Backup</h3>
              </div>
              <p className="text-zinc-500 font-medium leading-relaxed text-xs">
                Upload a previously exported JSON backup file to overwrite/restore database states. <strong>WARNING:</strong> This will replace all current clients, payments, tasks, and system logs. This operation cannot be undone.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="w-full flex items-center justify-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white py-2.5 rounded-xl font-bold transition cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Upload and Restore Dump (.json)</span>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleRestore} 
                accept=".json" 
                className="hidden" 
              />
            </div>
          </div>

        </div>
      )}

      {/* ========================================== */}
      {/* TAB 3: INTEGRATIONS SETTINGS */}
      {/* ========================================== */}
      {activeTab === 'integrations' && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-premium max-w-xl space-y-6 text-xs">
          <div>
            <div className="flex items-center gap-2 mb-2 text-brand-purple pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <Cloud className="w-4.5 h-4.5" />
              <h3 className="font-bold text-sm text-zinc-950 dark:text-white">Cloud API Integrations</h3>
            </div>
            <p className="text-zinc-500 font-medium">Configure credentials for live notification pings.</p>
          </div>

          <div className="space-y-4">
            
            {/* Email api */}
            <div className="bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 space-y-3">
              <h4 className="font-bold flex items-center gap-1 text-zinc-800 dark:text-white">
                <Mail className="w-4 h-4 text-brand-purple" />
                <span>Resend / SMTP Gateway API</span>
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-0.5">API Secret Key</label>
                  <input type="password" placeholder="re_123456789" className="w-full p-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 font-mono" />
                </div>
                <div>
                  <label className="font-semibold block mb-0.5">Sender Email Identity</label>
                  <input type="text" placeholder="ops@creativeplus.com" className="w-full p-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900" />
                </div>
              </div>
            </div>

            {/* Whatsapp api */}
            <div className="bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 space-y-3">
              <h4 className="font-bold flex items-center gap-1 text-zinc-800 dark:text-white">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Twilio / WhatsApp Business Gateway API</span>
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-0.5">Account SID</label>
                  <input type="text" placeholder="AC123456789" className="w-full p-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 font-mono" />
                </div>
                <div>
                  <label className="font-semibold block mb-0.5">Auth Token</label>
                  <input type="password" placeholder="••••••••" className="w-full p-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900" />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                type="button" 
                className="bg-brand-purple hover:bg-brand-purple-hover text-white px-4 py-2 rounded-xl font-bold cursor-pointer transition flex items-center gap-1"
              >
                <Key className="w-4 h-4" />
                <span>Validate & Save Keys</span>
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
