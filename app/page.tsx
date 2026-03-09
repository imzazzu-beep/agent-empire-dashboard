import Link from 'next/link';
import { Bot, Users, CheckSquare, Calendar, FileText, Settings } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-4">
            Agent Empire Dashboard
          </h1>
          <p className="text-xl text-slate-300">
            Mission Control for your AI agent workforce
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard title="Agents" value="0" icon={<Bot className="w-8 h-8" />} />
          <StatCard title="Active Tasks" value="0" icon={<CheckSquare className="w-8 h-8" />} />
          <StatCard title="Departments" value="1" icon={<Users className="w-8 h-8" />} />
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NavCard
            title="Agents"
            description="Create and manage AI agents"
            href="/agents"
            icon={<Bot className="w-12 h-12" />}
          />
          <NavCard
            title="Tasks"
            description="Assign and track work"
            href="/tasks"
            icon={<CheckSquare className="w-12 h-12" />}
          />
          <NavCard
            title="Meetings"
            description="Schedule agent meetings"
            href="/meetings"
            icon={<Calendar className="w-12 h-12" />}
          />
          <NavCard
            title="Departments"
            description="Organize teams"
            href="/departments"
            icon={<Users className="w-12 h-12" />}
          />
          <NavCard
            title="Files"
            description="Edit agent files"
            href="/files"
            icon={<FileText className="w-12 h-12" />}
          />
          <NavCard
            title="Settings"
            description="System configuration"
            href="/settings"
            icon={<Settings className="w-12 h-12" />}
          />
        </div>

        {/* Quick Actions */}
        <div className="mt-16 text-center">
          <Link
            href="/agents/new"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
          >
            + Create Your First Agent
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm">{title}</p>
          <p className="text-white text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className="text-purple-400">{icon}</div>
      </div>
    </div>
  );
}

function NavCard({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link href={href}>
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
        <div className="text-purple-400 mb-4 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h3 className="text-white text-xl font-bold mb-2">{title}</h3>
        <p className="text-slate-300">{description}</p>
      </div>
    </Link>
  );
}
