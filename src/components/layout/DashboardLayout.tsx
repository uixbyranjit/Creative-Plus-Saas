"use client";

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, Users, ShoppingBag, CheckSquare, 
  CreditCard, Calendar, BarChart2, Settings, LogOut, 
  Menu, X, Bell, Search, Sun, Moon, Sparkles, ChevronRight,
  TrendingUp, FolderGit
} from 'lucide-react';
import { getNotifications, markNotificationRead, clearAllNotifications } from '@/lib/actions';
import AiCopilotDrawer from '@/components/dashboard/AiCopilotDrawer';

interface SearchResult {
  type: 'client' | 'order' | 'task' | 'payment';
  id: string;
  title: string;
  subtitle: string;
  link: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Search Overlay
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  // Notifications
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // AI Copilot
  const [aiOpen, setAiOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if ((session?.user as any)?.role === 'CLIENT' && !pathname.startsWith('/client-portal')) {
      router.push('/client-portal');
    }
  }, [status, session, router, pathname]);

  useEffect(() => {
    // Sync Dark Mode
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  };

  // Fetch Notifications
  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      loadNotifications();
      // Poll every 30s
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [status]);

  const handleMarkNotificationRead = async (id: string) => {
    await markNotificationRead(id);
    loadNotifications();
  };

  const handleClearNotifications = async () => {
    await clearAllNotifications();
    loadNotifications();
  };

  // Global search implementation
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    // Simulate searching through records
    try {
      const searchData: SearchResult[] = [];
      
      // Perform mock lookup of endpoints
      const res = await fetch('/api/search?q=' + encodeURIComponent(query));
      if (res.ok) {
        const results = await res.json();
        setSearchResults(results);
      } else {
        // Mock fallback search
        const q = query.toLowerCase();
        if ("vikram malhotra client".includes(q)) {
          searchData.push({ type: 'client', id: 'c-1', title: 'Vikram Malhotra', subtitle: 'Client • Malhotra Retail Group', link: '/clients' });
        }
        if ("rebrand logo mobile".includes(q)) {
          searchData.push({ type: 'order', id: 'o-1', title: 'E-Commerce Web Portal Rebrand', subtitle: 'Order • Review Status', link: '/orders' });
          searchData.push({ type: 'task', id: 't-1', title: 'Design Homepage UI Draft', subtitle: 'Task • In Progress', link: '/tasks' });
        }
        setSearchResults(searchData);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-brand-purple/20 border-t-brand-purple rounded-full animate-spin" />
          <span className="text-xs font-semibold text-zinc-500 tracking-wider">CREATIVE PLUS</span>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const role = (session?.user as any)?.role || 'EMPLOYEE';

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['ADMIN', 'MANAGER', 'DESIGNER', 'EMPLOYEE'] },
    { label: 'Leads Pipeline', icon: TrendingUp, path: '/leads', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
    { label: 'Clients CRM', icon: Users, path: '/clients', roles: ['ADMIN', 'MANAGER', 'DESIGNER', 'EMPLOYEE'] },
    { label: 'Orders Module', icon: FolderGit, path: '/orders', roles: ['ADMIN', 'MANAGER', 'DESIGNER', 'EMPLOYEE'] },
    { label: 'Tasks & Checklists', icon: CheckSquare, path: '/tasks', roles: ['ADMIN', 'MANAGER', 'DESIGNER', 'EMPLOYEE'] },
    { label: 'Payments Tracker', icon: CreditCard, path: '/payments', roles: ['ADMIN', 'MANAGER'] },
    { label: 'Follow-ups CRM', icon: Calendar, path: '/followups', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
    { label: 'Performance & Reports', icon: BarChart2, path: '/reports', roles: ['ADMIN', 'MANAGER'] },
    { label: 'Settings Panel', icon: Settings, path: '/settings', roles: ['ADMIN', 'MANAGER', 'DESIGNER', 'EMPLOYEE'] },
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(role));

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen flex bg-zinc-50 dark:bg-zinc-950">
      
      {/* 1. DESKTOP SIDEBAR */}
      <aside className={`hidden md:flex flex-col border-r border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 transition-all duration-300 shrink-0 sticky top-0 h-screen ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        
        {/* Header/Logo */}
        <div className="p-5 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-brand-purple flex items-center justify-center text-white shrink-0 shadow-md">
              <span className="font-extrabold text-sm">C+</span>
            </div>
            {sidebarOpen && (
              <div className="transition-opacity duration-200">
                <h1 className="font-bold text-sm leading-none whitespace-nowrap">Creative Plus</h1>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">Ops Hub</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {filteredMenuItems.map((item, idx) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.path);
            return (
              <Link
                key={idx}
                href={item.path}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  active 
                    ? 'bg-brand-purple-light dark:bg-brand-purple/10 text-brand-purple' 
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4.5 h-4.5 shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Card / Logout */}
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800">
          {sidebarOpen ? (
            <div className="bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-2xl flex items-center gap-2.5">
              <img 
                src={session?.user?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"} 
                alt="Profile" 
                className="w-9 h-9 rounded-full object-cover shrink-0 border border-zinc-200 dark:border-zinc-700"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold truncate leading-tight">{session?.user?.name}</p>
                <span className="text-[9px] bg-brand-purple-light dark:bg-brand-purple/10 text-brand-purple px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">{role}</span>
              </div>
              <button 
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="p-1.5 text-zinc-400 hover:text-red-500 rounded-lg hover:bg-white dark:hover:bg-zinc-800 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="w-full flex items-center justify-center p-3 text-zinc-400 hover:text-red-500 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          )}
        </div>
      </aside>

      {/* 2. MOBILE NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <aside className="relative flex flex-col w-72 max-w-xs bg-white dark:bg-zinc-900 h-full p-5 shadow-2xl z-10 border-r border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-brand-purple flex items-center justify-center text-white shadow-md">
                  <span className="font-extrabold text-sm">C+</span>
                </div>
                <div>
                  <h1 className="font-bold text-sm leading-none">Creative Plus</h1>
                  <span className="text-[9px] text-zinc-500 dark:text-zinc-400 font-medium">Ops Hub</span>
                </div>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="flex-1 space-y-1 overflow-y-auto">
              {filteredMenuItems.map((item, idx) => {
                const Icon = item.icon;
                const active = pathname.startsWith(item.path);
                return (
                  <Link
                    key={idx}
                    href={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                      active 
                        ? 'bg-brand-purple-light dark:bg-brand-purple/10 text-brand-purple' 
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 flex items-center gap-3">
              <img 
                src={session?.user?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"} 
                alt="Profile" 
                className="w-9 h-9 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate leading-tight">{session?.user?.name}</p>
                <span className="text-[8px] bg-brand-purple-light dark:bg-brand-purple/15 text-brand-purple px-1 rounded font-bold uppercase">{role}</span>
              </div>
              <button 
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="p-1.5 text-zinc-400 hover:text-red-500 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* 3. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden md:flex p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition cursor-pointer"
            >
              <Menu className="w-4.5 h-4.5" />
            </button>
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="flex md:hidden p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition cursor-pointer"
            >
              <Menu className="w-4.5 h-4.5" />
            </button>

            {/* Global Search Bar Trigger */}
            <div 
              onClick={() => setSearchOpen(true)}
              className="relative w-48 sm:w-64 bg-zinc-100/80 dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 rounded-xl py-1.5 pl-9 pr-3 text-xs text-zinc-400 cursor-pointer flex items-center transition select-none"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
              <span>Search dashboard...</span>
              <kbd className="hidden sm:inline-block ml-auto text-[9px] bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 rounded font-mono text-zinc-500 dark:text-zinc-400">⌘K</kbd>
            </div>
          </div>

          <div className="flex items-center gap-3">
            
            {/* AI Copilot Trigger */}
            <button 
              onClick={() => setAiOpen(true)}
              className="p-2 text-brand-purple hover:text-brand-purple-hover rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer relative"
              title="AI Agency Co-Pilot"
            >
              <Sparkles className="w-4.5 h-4.5 animate-pulse" />
            </button>

            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 text-zinc-500 hover:text-brand-purple rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
            >
              {darkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Notifications Trigger */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 text-zinc-500 hover:text-brand-purple rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer relative"
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-zinc-900" />
                )}
              </button>
              
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl z-50 p-4">
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-xs font-bold">Notifications ({unreadCount})</span>
                    <button 
                      onClick={handleClearNotifications}
                      className="text-[10px] text-brand-purple font-semibold hover:underline cursor-pointer"
                    >
                      Clear all
                    </button>
                  </div>
                  
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="text-center py-4 text-xs text-zinc-400 dark:text-zinc-500">No new alerts</div>
                    ) : (
                      notifications.map((notif) => (
                        <div 
                          key={notif.id} 
                          onClick={() => handleMarkNotificationRead(notif.id)}
                          className={`p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition cursor-pointer ${notif.read ? 'opacity-60' : 'bg-brand-purple/5 border-brand-purple/10'}`}
                        >
                          <p className="text-[11px] font-bold">{notif.title}</p>
                          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">{notif.message}</p>
                          <span className="text-[8px] text-zinc-400 block mt-1.5">{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Dropdown */}
            <div className="flex items-center gap-2 border-l border-zinc-200 dark:border-zinc-800 pl-3">
              <img 
                src={session?.user?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"} 
                alt="Avatar" 
                className="w-8 h-8 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
              />
              <span className="hidden sm:inline-block text-xs font-semibold">{session?.user?.name?.split(' ')[0]}</span>
            </div>

          </div>
        </header>

        {/* Core page workspace content container */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* 4. GLOBAL SEARCH OVERLAY */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
          
          <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-4 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="relative mb-3">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search clients, orders, tasks..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3 pl-11 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple"
              />
              <button 
                onClick={() => setSearchOpen(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1 max-h-80 overflow-y-auto p-1">
              {searchQuery === '' ? (
                <div className="text-center py-8 text-xs text-zinc-400 dark:text-zinc-500">
                  <p className="font-semibold">Quick Search</p>
                  <p className="mt-1">Type to locate client folders, design orders, active tasks.</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-8 text-xs text-zinc-400 dark:text-zinc-500">
                  No records match "{searchQuery}"
                </div>
              ) : (
                searchResults.map((result) => (
                  <div
                    key={result.id}
                    onClick={() => {
                      setSearchOpen(false);
                      router.push(result.link);
                    }}
                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/40 border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800 transition cursor-pointer"
                  >
                    <div>
                      <p className="text-xs font-bold">{result.title}</p>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">{result.subtitle}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3 mt-2 flex justify-between items-center px-2 text-[9px] text-zinc-400 dark:text-zinc-500 font-medium">
              <span>Search includes active clients, leads, tasks, invoicing.</span>
              <span>ESC to close</span>
            </div>

          </div>
        </div>
      )}

      {/* AI Copilot Drawer */}
      <AiCopilotDrawer isOpen={aiOpen} onClose={() => setAiOpen(false)} />

    </div>
  );
}
