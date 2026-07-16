"use client";

import React, { useState } from 'react';
import { 
  Search, Plus, Calendar as CalendarIcon, List, Eye, Trash2, X, Clock, 
  User, CheckCircle2, ChevronRight, AlertTriangle, Paperclip, 
  TrendingUp, FileText, CheckSquare, MessageSquare, ChevronLeft
} from 'lucide-react';
import { createTask, updateTask, deleteTask } from '@/lib/actions';

interface Task {
  id: string;
  name: string;
  description: string | null;
  assignedToId: string | null;
  assignedTo: any;
  deadline: any;
  priority: string;
  status: string;
  workingHours: number;
  attachments: string | null;
  comments: string | null;
  checklist: string | null; // stringified JSON
}

export default function TasksClientPage({ 
  initialTasks, users, payments, followUps, orders 
}: { 
  initialTasks: Task[], users: any[], payments: any[], followUps: any[], orders: any[] 
}) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [search, setSearch] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Forms
  const [taskForm, setTaskForm] = useState({ name: '', description: '', assignedToId: '', deadline: '', priority: 'MEDIUM', checklistItems: '' });
  const [taskEditForm, setTaskEditForm] = useState({ name: '', description: '', assignedToId: '', deadline: '', priority: 'MEDIUM', workingHours: '0', status: 'PENDING', comments: '', checklist: [] as any[] });

  // Calendar states
  const [currentDate, setCurrentDate] = useState(new Date());

  const refreshTasks = async () => {
    try {
      const res = await fetch('/api/tasks-data');
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
        if (selectedTask) {
          const updated = data.find((t: any) => t.id === selectedTask.id);
          if (updated) {
            setSelectedTask(updated);
            try {
              setTaskEditForm({
                name: updated.name,
                description: updated.description || '',
                assignedToId: updated.assignedToId || '',
                deadline: updated.deadline.split('T')[0],
                priority: updated.priority,
                workingHours: String(updated.workingHours || 0),
                status: updated.status,
                comments: updated.comments || '',
                checklist: updated.checklist ? JSON.parse(updated.checklist) : []
              });
            } catch (err) {
              console.error(err);
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const checklistArray = taskForm.checklistItems
        ? taskForm.checklistItems.split('\n').filter(item => item.trim() !== '').map(text => ({ text, completed: false }))
        : [];
      
      await createTask({
        name: taskForm.name,
        description: taskForm.description,
        assignedToId: taskForm.assignedToId,
        deadline: taskForm.deadline,
        priority: taskForm.priority,
        checklist: checklistArray.length > 0 ? JSON.stringify(checklistArray) : null
      });

      setCreateModalOpen(false);
      setTaskForm({ name: '', description: '', assignedToId: '', deadline: '', priority: 'MEDIUM', checklistItems: '' });
      await refreshTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenDetail = (task: Task) => {
    setSelectedTask(task);
    try {
      setTaskEditForm({
        name: task.name,
        description: task.description || '',
        assignedToId: task.assignedToId || '',
        deadline: task.deadline.split('T')[0],
        priority: task.priority,
        workingHours: String(task.workingHours || 0),
        status: task.status,
        comments: task.comments || '',
        checklist: task.checklist ? JSON.parse(task.checklist) : []
      });
    } catch (err) {
      console.error(err);
    }
    setDetailModalOpen(true);
  };

  const handleUpdateChecklist = async (index: number, completed: boolean) => {
    if (!selectedTask) return;
    const updatedChecklist = [...taskEditForm.checklist];
    updatedChecklist[index].completed = completed;
    
    setTaskEditForm({ ...taskEditForm, checklist: updatedChecklist });
    
    try {
      await updateTask(selectedTask.id, {
        ...taskEditForm,
        checklist: JSON.stringify(updatedChecklist)
      });
      await refreshTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTaskDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;
    try {
      await updateTask(selectedTask.id, {
        ...taskEditForm,
        checklist: JSON.stringify(taskEditForm.checklist)
      });
      setDetailModalOpen(false);
      setSelectedTask(null);
      await refreshTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTask(id);
      setDetailModalOpen(false);
      await refreshTasks();
    }
  };

  const filteredTasks = tasks.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    (t.assignedTo?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  // ==========================================
  // CUSTOM CALENDAR GENERATOR
  // ==========================================
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const daysInMonth = endOfMonth.getDate();
  const startDayOfWeek = startOfMonth.getDay(); // 0: Sunday, 1: Monday, etc.

  const calendarDays: any[] = [];
  
  // Fill preceding empty buffer days
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Fill actual dates
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Match items to date helper
  const getDayItems = (date: Date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    const items: any[] = [];

    // Match Tasks
    tasks.forEach(t => {
      const dStr = new Date(t.deadline).toISOString().split('T')[0];
      if (dStr === dateStr) {
        items.push({ type: 'task', text: `📝 ${t.name}`, priority: t.priority });
      }
    });

    // Match FollowUps
    followUps.forEach(f => {
      const dStr = new Date(f.date).toISOString().split('T')[0];
      if (dStr === dateStr) {
        items.push({ type: 'followup', text: `📞 CRM: ${f.purpose}`, status: f.status });
      }
    });

    // Match Orders Delivery Dates
    orders.forEach(o => {
      const dStr = new Date(o.expectedDelivery).toISOString().split('T')[0];
      if (dStr === dateStr) {
        items.push({ type: 'order', text: `🚚 CPD-O: ${o.serviceName}` });
      }
    });

    // Match Payment Invoices Due
    payments.forEach(p => {
      const dStr = new Date(p.dueDate).toISOString().split('T')[0];
      if (dStr === dateStr) {
        items.push({ type: 'payment', text: `💰 Due: ${p.invoiceNumber}` });
      }
    });

    return items;
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Tasks & Checklists Workspace</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Coordinate developer workloads, checklist items, and working hours.</p>
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
              onClick={() => setViewMode('calendar')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${viewMode === 'calendar' ? 'bg-white dark:bg-zinc-900 shadow-sm text-brand-purple' : 'text-zinc-400 hover:text-zinc-700'}`}
            >
              <CalendarIcon className="w-4 h-4" />
            </button>
          </div>

          <button 
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-1.5 bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-md transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* VIEW 1: ACTIVE TASKS LIST */}
      {/* ========================================== */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search tasks or assignees..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-brand-purple focus:border-brand-purple shadow-sm"
            />
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-premium overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="text-zinc-400 font-bold border-b border-zinc-100 dark:border-zinc-800 pb-2">
                  <th className="pb-3">Task Name</th>
                  <th className="pb-3">Assigned To</th>
                  <th className="pb-3">Deadline</th>
                  <th className="pb-3">Priority</th>
                  <th className="pb-3">Working Hours</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-zinc-400 font-medium">No tasks logged.</td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10">
                      <td className="py-4">
                        <p className="font-bold">{task.name}</p>
                        {task.description && <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium truncate max-w-[200px] mt-0.5">{task.description}</p>}
                      </td>
                      <td className="py-4 font-semibold">{task.assignedTo?.name || 'Unassigned'}</td>
                      <td className="py-4 text-zinc-500 font-medium">{new Date(task.deadline).toLocaleDateString()}</td>
                      <td className="py-4">
                        <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase ${
                          task.priority === 'URGENT' ? 'bg-red-100 dark:bg-red-950/20 text-red-700' :
                          task.priority === 'HIGH' ? 'bg-amber-100 dark:bg-amber-950/20 text-amber-700' :
                          'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="py-4 font-semibold text-zinc-500">{task.workingHours || 0} hrs</td>
                      <td className="py-4">
                        <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase ${
                          task.status === 'COMPLETED' ? 'bg-green-100 dark:bg-green-950/20 text-green-700 dark:text-green-400' :
                          task.status === 'WORKING' ? 'bg-brand-purple-light dark:bg-brand-purple/10 text-brand-purple' :
                          'bg-zinc-105 text-zinc-500'
                        }`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="py-4 text-right space-x-1 whitespace-nowrap">
                        <button 
                          onClick={() => handleOpenDetail(task)}
                          className="inline-flex p-1.5 text-zinc-500 hover:text-brand-purple rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
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
      {/* VIEW 2: TASK CALENDAR MONTH VIEW */}
      {/* ========================================== */}
      {viewMode === 'calendar' && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-premium space-y-4">
          
          {/* Calendar Header Controls */}
          <div className="flex justify-between items-center pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <h3 className="font-black text-sm uppercase tracking-wider text-brand-purple">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h3>
            
            <div className="flex gap-1.5">
              <button onClick={handlePrevMonth} className="p-1.5 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={handleNextMonth} className="p-1.5 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition cursor-pointer">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {/* Days of Week */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="font-extrabold text-zinc-400 uppercase tracking-wide py-2">{day}</div>
            ))}

            {/* Calendar Cells */}
            {calendarDays.map((date, idx) => {
              const dayItems = date ? getDayItems(date) : [];
              return (
                <div 
                  key={idx} 
                  className={`border border-zinc-100 dark:border-zinc-800/80 rounded-2xl p-2.5 min-h-[100px] flex flex-col text-left transition select-none ${
                    date ? 'bg-zinc-50/20 hover:bg-zinc-50 dark:hover:bg-zinc-800/20' : 'bg-transparent border-none'
                  }`}
                >
                  {date && (
                    <>
                      <span className="font-bold text-[10px] text-zinc-500 mb-1">{date.getDate()}</span>
                      
                      <div className="space-y-1 overflow-y-auto max-h-20 pr-0.5">
                        {dayItems.map((item, id) => (
                          <div 
                            key={id} 
                            className={`text-[8px] px-1 py-0.5 rounded leading-normal font-bold truncate ${
                              item.type === 'task' ? 'bg-brand-purple-light dark:bg-brand-purple/15 text-brand-purple' :
                              item.type === 'followup' ? 'bg-amber-100 dark:bg-amber-950/20 text-amber-700' :
                              item.type === 'order' ? 'bg-blue-100 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400' :
                              'bg-green-105 text-green-700'
                            }`}
                            title={item.text}
                          >
                            {item.text}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================== */}
      {/* CREATE TASK MODAL */}
      {/* ========================================== */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCreateModalOpen(false)} />
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto z-10 text-xs">
            <h3 className="font-bold text-lg mb-4">Add Project Task</h3>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="font-semibold block mb-1">Task Name *</label>
                <input type="text" required placeholder="e.g. Home page grid layout" value={taskForm.name} onChange={(e) => setTaskForm({ ...taskForm, name: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Assigned To *</label>
                  <select required value={taskForm.assignedToId} onChange={(e) => setTaskForm({ ...taskForm, assignedToId: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850">
                    <option value="">Choose team member...</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Priority</label>
                  <select value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Deadline Date *</label>
                <input type="date" required value={taskForm.deadline} onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
              </div>
              <div>
                <label className="font-semibold block mb-1">Checklist Items (One item per line)</label>
                <textarea rows={3} placeholder="Add color palette&#10;Finalize mobile icons&#10;Verify image contrasts" value={taskForm.checklistItems} onChange={(e) => setTaskForm({ ...taskForm, checklistItems: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850 font-mono" />
              </div>
              <div>
                <label className="font-semibold block mb-1">Description</label>
                <textarea rows={2} value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button type="button" onClick={() => setCreateModalOpen(false)} className="px-4 py-2 border border-zinc-200 dark:border-zinc-850 rounded-xl">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand-purple text-white rounded-xl font-bold cursor-pointer">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TASK DETAILS MODAL (WITH CHECKLIST & WORKING HOURS) */}
      {/* ========================================== */}
      {detailModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDetailModalOpen(false)} />
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto z-10 text-xs">
            
            <div className="flex justify-between items-start mb-4 pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3 className="font-bold text-base">{selectedTask.name}</h3>
                <span className="text-[9px] text-zinc-400">Assigned to: {selectedTask.assignedTo?.name || 'Unassigned'}</span>
              </div>
              <button onClick={() => setDetailModalOpen(false)} className="text-zinc-400 hover:text-zinc-600"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleUpdateTaskDetails} className="space-y-4">
              
              {/* Description */}
              <div>
                <span className="text-[10px] text-zinc-400 font-bold block mb-1">TASK DESCRIPTION</span>
                <p className="bg-zinc-50 dark:bg-zinc-800/30 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/80 font-medium leading-relaxed">{selectedTask.description || 'No description provided.'}</p>
              </div>

              {/* Checklist Section */}
              {taskEditForm.checklist.length > 0 && (
                <div>
                  <span className="text-[10px] text-zinc-400 font-bold block mb-2">Checklist items</span>
                  <div className="space-y-2">
                    {taskEditForm.checklist.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-zinc-50/40 dark:bg-zinc-800/10 p-2 rounded-xl border border-zinc-100 dark:border-zinc-800/40">
                        <input 
                          type="checkbox" 
                          checked={item.completed} 
                          onChange={(e) => handleUpdateChecklist(idx, e.target.checked)} 
                          className="w-4 h-4 text-brand-purple rounded"
                        />
                        <span className={`font-semibold ${item.completed ? 'line-through text-zinc-400' : ''}`}>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Working Hours & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Logged Working Hours</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input 
                      type="number" 
                      step="0.5" 
                      value={taskEditForm.workingHours} 
                      onChange={(e) => setTaskEditForm({ ...taskEditForm, workingHours: e.target.value })} 
                      className="w-full pl-9 p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" 
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Task Status</label>
                  <select 
                    value={taskEditForm.status} 
                    onChange={(e) => setTaskEditForm({ ...taskEditForm, status: e.target.value })} 
                    className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="WORKING">Working</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="OVERDUE">Overdue</option>
                  </select>
                </div>
              </div>

              {/* Internal comments */}
              <div>
                <label className="font-semibold block mb-1">Internal Comments & Activity Notes</label>
                <textarea 
                  rows={2} 
                  value={taskEditForm.comments} 
                  onChange={(e) => setTaskEditForm({ ...taskEditForm, comments: e.target.value })} 
                  className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-850" 
                />
              </div>

              {/* Footer */}
              <div className="flex justify-between gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button 
                  type="button" 
                  onClick={() => handleDelete(selectedTask.id)} 
                  className="px-3 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
                
                <div className="flex gap-2">
                  <button type="button" onClick={() => setDetailModalOpen(false)} className="px-4 py-2 border border-zinc-200 dark:border-zinc-850 rounded-xl">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-brand-purple text-white rounded-xl font-bold cursor-pointer">Save Changes</button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
