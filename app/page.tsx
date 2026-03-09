import Link from 'next/link';
import { Bot, Users, CheckSquare, Calendar, Activity, Clock, Zap, ArrowRight } from 'lucide-react';

export default function Dashboard() {
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
            value="1"
            icon={<Bot className="w-5 h-5" />}
            color="blue"
          />
          <MetricCard
            label="Active Now"
            value="1"
            icon={<Activity className="w-5 h-5" />}
            color="green"
          />
          <MetricCard
            label="Pending Tasks"
            value="0"
            icon={<CheckSquare className="w-5 h-5" />}
            color="yellow"
          />
          <MetricCard
            label="Done Today"
            value="0"
            icon={<Zap className="w-5 h-5" />}
            color="purple"
          />
          <MetricCard
            label="Departments"
            value="1"
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
              <p className="text-sm text-slate-400">Manage your AI workforce</p>
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
              <p className="text-sm text-slate-400">Track and assign work</p>
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
              <p className="text-sm text-slate-400">Organize your teams</p>
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
            <div className="text-sm text-slate-400 space-y-2">
              <div className="flex items-center gap-3 py-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span>System initialized with 1 agent</span>
                <span className="text-slate-600 ml-auto">Just now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
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
      </div>
    </div>
  );
}
