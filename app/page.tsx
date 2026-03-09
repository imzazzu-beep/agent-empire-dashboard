import { supabaseAdmin } from '@/lib/supabase';
import Link from 'next/link';
import { Bot, Users, CheckSquare, Calendar, Activity, Clock, Zap, ArrowRight } from 'lucide-react';

async function getDashboardStats() {
  const { data: agents } = await supabaseAdmin.from('agents').select('status');
  const { data: tasks } = await supabaseAdmin.from('tasks').select('status, completed_at');
  const { data: departments } = await supabaseAdmin.from('departments').select('id');
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return {
    totalAgents: agents?.length || 0,
    activeAgents: agents?.filter(a => a.status === 'active').length || 0,
    pendingTasks: tasks?.filter(t => t.status === 'pending' || t.status === 'in_progress').length || 0,
    completedToday: tasks?.filter(t => {
      if (!t.completed_at) return false;
      const completedDate = new Date(t.completed_at);
      return completedDate >= today;
    }).length || 0,
    departments: departments?.length || 0,
  };
}

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const stats = await getDashboardStats();
  
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top Bar */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <h1 className="text-xl font-bold">Agent Empire OS</h1>
              <span className="text-xs text-slate-500 ml-2">v1.0.0</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/agents/new"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
              >
                <Bot className="w-4 h-4" />
                Create Agent
              </Link>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Clock className="w-4 h-4" />
                <span suppressHydrationWarning>{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <MetricCard
            label="Total Agents"
            value={stats.totalAgents.toString()}
            change={stats.totalAgents > 0 ? `+${stats.totalAgents}` : '0'}
            icon={<Bot className="w-5 h-5" />}
            color="blue"
          />
          <MetricCard
            label="Active Now"
            value={stats.activeAgents.toString()}
            change={stats.activeAgents > 0 ? '●' : '○'}
            icon={<Activity className="w-5 h-5" />}
            color="green"
          />
          <MetricCard
            label="Pending Tasks"
            value={stats.pendingTasks.toString()}
            change="+0"
            icon={<CheckSquare className="w-5 h-5" />}
            color="yellow"
          />
          <MetricCard
            label="Done Today"
            value={stats.completedToday.toString()}
            change="+0"
            icon={<Zap className="w-5 h-5" />}
            color="purple"
          />
          <MetricCard
            label="Departments"
            value={stats.departments.toString()}
            change="+0"
            icon={<Users className="w-5 h-5" />}
            color="orange"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Link href="/agents" className="block">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-blue-500/50 transition-colors cursor-pointer group h-full">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                    <Bot className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Agents</h3>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400 transition-colors" />
              </div>
              <p className="text-sm text-slate-400">Manage your AI workforce · {stats.totalAgents} active</p>
            </div>
          </Link>

          <Link href="/tasks" className="block">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-green-500/50 transition-colors cursor-pointer group h-full">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                    <CheckSquare className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Tasks</h3>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-green-400 transition-colors" />
              </div>
              <p className="text-sm text-slate-400">Track and assign work · {stats.pendingTasks} pending</p>
            </div>
          </Link>

          <Link href="/departments" className="block">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-purple-500/50 transition-colors cursor-pointer group h-full">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                    <Users className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Departments</h3>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-purple-400 transition-colors" />
              </div>
              <p className="text-sm text-slate-400">Organize your teams · {stats.departments} departments</p>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <Link href="/agents" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {stats.totalAgents === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No activity yet. Create your first agent to get started.</p>
                <Link
                  href="/agents/new"
                  className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Create First Agent
                </Link>
              </div>
            ) : (
              <div className="text-sm text-slate-400 space-y-2">
                <div className="flex items-center gap-3 py-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>System initialized with {stats.totalAgents} agent{stats.totalAgents !== 1 ? 's' : ''}</span>
                  <span className="text-slate-600 ml-auto">Just now</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  change,
  icon,
  color,
}: {
  label: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
}) {
  const colors = {
    blue: 'text-blue-400 bg-blue-500/10',
    green: 'text-green-400 bg-green-500/10',
    yellow: 'text-yellow-400 bg-yellow-500/10',
    purple: 'text-purple-400 bg-purple-500/10',
    orange: 'text-orange-400 bg-orange-500/10',
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-500 uppercase font-medium">{label}</span>
        <div className={`p-1.5 rounded ${colors[color as keyof typeof colors]}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold">{value}</span>
        <span className="text-xs text-slate-500">{change}</span>
      </div>
    </div>
  );
}
