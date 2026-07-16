"use client";

import React, { useState } from 'react';
import { Sparkles, X, Copy, Check, Send, BrainCircuit, Wand2 } from 'lucide-react';

export default function AiCopilotDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeTab, setTab] = useState('task');
  const [inputVal, setInputVal] = useState('');
  const [outputVal, setOutputVal] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!inputVal.trim()) return;
    setGenerating(true);
    setError('');

    setTimeout(() => {
      let result = '';
      if (activeTab === 'task') {
        result = `### AI Suggested Task Checklist:\n- [ ] Research typography and branding guidelines related to "${inputVal}"\n- [ ] Draft 3 moodboard variations and color palettes\n- [ ] Create vector wireframes for feedback validation\n- [ ] Test color contrast ratios and responsive grids\n- [ ] Export final assets in SVG, PNG, and PSD print-ready formats`;
      } else if (activeTab === 'message') {
        result = `💬 **WhatsApp Reminder Template:**\n"Hi ${inputVal}, this is Priya from Creative Plus Agency. Just checking in regarding the pending design draft review. Let me know if you would like to hop on a quick feedback sync! Thanks."\n\n✉️ **Email Campaign Draft:**\n"Subject: Follow-up regarding your ongoing design campaign - Creative Plus\n\nHi ${inputVal},\n\nI hope you are doing well.\n\nOur design team has updated the drafts for your campaign. Please log in to your Client Portal to review the updates and request any edits.\n\nBest regards,\nPriya Patel\nCreative Plus Operations"`;
      } else {
        result = `### Agency Proposal Outline:\n**Client Target Focus:** ${inputVal}\n\n**1. Objective & Deliverables**\n- Creative rebranding identity assets\n- 12 Custom social posts + food styling layouts\n- SEO and monthly performance reporting\n\n**2. Development Timeline**\n- Phase 1: Brand moodboarding & logo sign-off (7 days)\n- Phase 2: Graphic post styling drafts (10 days)\n- Phase 3: Deliverable files package handover (3 days)\n\n**3. Estimated Retainer Pricing**\n- Flat project rate: $2,500 USD (50% advance due to initialize campaign operations)`;
      }

      setOutputVal(result);
      setGenerating(false);
    }, 1200);
  };

  const [error, setError] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(outputVal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end text-xs">
      <div className="fixed inset-0 bg-black/35 backdrop-blur-sm" onClick={onClose} />
      
      <aside className="relative w-full max-w-sm bg-white dark:bg-zinc-900 h-full shadow-2xl p-5 overflow-y-auto z-10 border-l border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
        
        {/* Top Header */}
        <div className="space-y-4 shrink-0">
          <div className="flex justify-between items-center pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-1.5 text-brand-purple">
              <BrainCircuit className="w-5 h-5 text-brand-purple" />
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white">AI Agency Co-Pilot</h3>
            </div>
            <button onClick={onClose} className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"><X className="w-5 h-5" /></button>
          </div>

          {/* Prompt Tab selectors */}
          <div className="bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-xl flex border border-zinc-250/20 dark:border-zinc-700/50 font-bold">
            <button 
              onClick={() => { setTab('task'); setOutputVal(''); }}
              className={`flex-1 py-1.5 rounded-lg text-center transition cursor-pointer ${activeTab === 'task' ? 'bg-white dark:bg-zinc-900 shadow-sm text-brand-purple' : 'text-zinc-500'}`}
            >
              Task Checklist
            </button>
            <button 
              onClick={() => { setTab('message'); setOutputVal(''); }}
              className={`flex-1 py-1.5 rounded-lg text-center transition cursor-pointer ${activeTab === 'message' ? 'bg-white dark:bg-zinc-900 shadow-sm text-brand-purple' : 'text-zinc-500'}`}
            >
              CRM Messages
            </button>
            <button 
              onClick={() => { setTab('proposal'); setOutputVal(''); }}
              className={`flex-1 py-1.5 rounded-lg text-center transition cursor-pointer ${activeTab === 'proposal' ? 'bg-white dark:bg-zinc-900 shadow-sm text-brand-purple' : 'text-zinc-500'}`}
            >
              Proposals
            </button>
          </div>
        </div>

        {/* Dynamic prompt form fields */}
        <div className="flex-1 my-6 space-y-4 flex flex-col">
          
          {/* Input field */}
          <div className="shrink-0">
            <label className="font-semibold block mb-1.5">
              {activeTab === 'task' ? 'Design Campaign Brief / Service Name:' :
               activeTab === 'message' ? 'Client Contact Name:' :
               'Target Focus (e.g. Gym UI/UX Retainer):'}
            </label>
            <div className="relative">
              <input 
                type="text" 
                placeholder={
                  activeTab === 'task' ? 'e.g. E-Commerce logo rebrand' :
                  activeTab === 'message' ? 'e.g. Vikram Malhotra' :
                  'e.g. FitLife Social Retainer'
                }
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-brand-purple"
              />
              <button 
                onClick={handleGenerate}
                disabled={generating}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-brand-purple hover:bg-brand-purple-hover text-white rounded-lg cursor-pointer disabled:opacity-50"
              >
                <Wand2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Loader or Output text area */}
          <div className="flex-1 flex flex-col min-h-0 border border-zinc-150 dark:border-zinc-800 rounded-2xl overflow-hidden bg-zinc-50/50 dark:bg-zinc-950/20">
            <div className="bg-zinc-100 dark:bg-zinc-850 px-3 py-2 flex justify-between items-center border-b border-zinc-150 dark:border-zinc-800">
              <span className="font-bold text-[10px] text-zinc-400">CO-PILOT CONTEXT OUTPUT</span>
              {outputVal && (
                <button 
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[9px] text-zinc-500 hover:text-brand-purple cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>
            
            <div className="flex-1 p-3.5 overflow-y-auto leading-relaxed text-zinc-700 dark:text-zinc-300 font-semibold whitespace-pre-line">
              {generating ? (
                <div className="flex flex-col items-center justify-center h-full gap-2">
                  <div className="w-6 h-6 border-2 border-brand-purple/20 border-t-brand-purple rounded-full animate-spin" />
                  <span className="text-[10px] text-zinc-400 font-bold">Drafting context vectors...</span>
                </div>
              ) : outputVal ? (
                outputVal
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-zinc-400 max-w-xs mx-auto space-y-1">
                  <Sparkles className="w-6 h-6 text-zinc-300 mb-1" />
                  <p className="font-bold">Ready to Generate</p>
                  <p className="font-normal text-[10px] text-zinc-500">Provide prompt details above and tap the wand to generate contextual briefs.</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3 text-[10px] text-zinc-400 text-center font-medium shrink-0">
          <span>AI outputs are mock simulations. Live integrations can connect to LLMs via API keys.</span>
        </div>

      </aside>
    </div>
  );
}
