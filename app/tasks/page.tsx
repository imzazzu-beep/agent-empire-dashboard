'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowLeft, Plus, CheckSquare, Clock, Zap, AlertCircle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  assigned_to: string | null;
  due_date: string | null;
  created_at: string;
  agent?: { name: string };
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    const { data } = await supabase
      .from('tasks')
      .select(`
        *,
        agent:assigned_to(name)
      `)
      .order('created_at', { ascending: false });
    
    setTasks(data || []);
    setLoading(false);
  }

  const tasksByStatus = {
    pending: tasks.filter(t => t.status === 'pending'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    completed: tasks.filter(t => t.status === 'completed'),
    blocked: tasks.filter(t => t.status === 'blocked'),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        Loading tasks...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top Bar */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-bold">Tasks</h1>
              <span className="text-sm text-slate-500">
                {tasks.length} total
              </span>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Task
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="container mx-auto px-6 py-8">
        {tasks.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-12 text-center">
            <CheckSquare className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No tasks yet</h3>
            <p className="text-slate-400 mb-6">Create your first task to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Create First Task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <KanbanColumn
              title="Pending"
              icon={<Clock className="w-4 h-4" />}
              count={tasksByStatus.pending.length}
              color="yellow"
              tasks={tasksByStatus.pending}
              onTaskClick={(id) => console.log('Task clicked:', id)}
            />
            <KanbanColumn
              title="In Progress"
              icon={<Zap className="w-4 h-4" />}
              count={tasksByStatus.in_progress.length}
              color="blue"
              tasks={tasksByStatus.in_progress}
              onTaskClick={(id) => console.log('Task clicked:', id)}
            />
            <KanbanColumn
              title="Completed"
              icon={<CheckSquare className="w-4 h-4" />}
              count={tasksByStatus.completed.length}
              color="green"
              tasks={tasksByStatus.completed}
              onTaskClick={(id) => console.log('Task clicked:', id)}
            />
            <KanbanColumn
              title="Blocked"
              icon={<AlertCircle className="w-4 h-4" />}
              count={tasksByStatus.blocked.length}
              color="red"
              tasks={tasksByStatus.blocked}
              onTaskClick={(id) => console.log('Task clicked:', id)}
            />
          </div>
        )}
      </div>

      {/* Create Modal (simplified for now) */}
      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            loadTasks();
          }}
        />
      )}
    </div>
  );
}

function KanbanColumn({
  title,
  icon,
  count,
  color,
  tasks,
  onTaskClick,
}: {
  title: string;
  icon: React.ReactNode;
  count: number;
  color: string;
  tasks: Task[];
  onTaskClick: (id: string) => void;
}) {
  const colors = {
    yellow: 'text-yellow-400 bg-yellow-500/10',
    blue: 'text-blue-400 bg-blue-500/10',
    green: 'text-green-400 bg-green-500/10',
    red: 'text-red-400 bg-red-500/10',
  };

  const priorityColors = {
    urgent: 'border-l-red-500',
    high: 'border-l-orange-500',
    medium: 'border-l-blue-500',
    low: 'border-l-slate-500',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded ${colors[color as keyof typeof colors]}`}>
            {icon}
          </div>
          <h3 className="font-semibold">{title}</h3>
        </div>
        <span className="text-sm text-slate-500">{count}</span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => onTaskClick(task.id)}
            className={`bg-slate-900 border border-slate-800 border-l-4 ${
              priorityColors[task.priority as keyof typeof priorityColors]
            } rounded-lg p-4 hover:border-slate-700 transition-colors cursor-pointer`}
          >
            <h4 className="font-medium mb-2">{task.title}</h4>
            {task.description && (
              <p className="text-sm text-slate-400 mb-3 line-clamp-2">{task.description}</p>
            )}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{task.agent?.name || 'Unassigned'}</span>
              {task.due_date && (
                <span>{new Date(task.due_date).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CreateTaskModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.from('tasks').insert({
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      status: 'pending',
    });

    if (!error) {
      onCreated();
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Create New Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Create Task
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
