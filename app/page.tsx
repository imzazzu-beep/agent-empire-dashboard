import Link from 'next/link';
import { Bot, Users, CheckSquare, Calendar, FileText, Settings, Activity } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Agent Empire</h1>
            </div>
            <nav className="flex gap-6">
              <Link href="/agents" className="text-gray-600 hover:text-gray-900">Agents</Link>
              <Link href="/tasks" className="text-gray-600 hover:text-gray-900">Tasks</Link>
              <Link href="/meetings" className="text-gray-600 hover:text-gray-900">Meetings</Link>
              <Link href="/settings" className="text-gray-600 hover:text-gray-900">Settings</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Your Own AI Team
            <br />
            <span className="text-blue-600">Without the Headache</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Build and manage your AI agent workforce. Create agents, assign tasks, and scale your business operations.
          </p>
          <Link
            href="/agents/new"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Create Your First Agent
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            icon={<Bot className="w-6 h-6 text-blue-600" />}
            label="Total Agents"
            value="0"
          />
          <StatCard
            icon={<CheckSquare className="w-6 h-6 text-green-600" />}
            label="Active Tasks"
            value="0"
          />
          <StatCard
            icon={<Users className="w-6 h-6 text-purple-600" />}
            label="Departments"
            value="1"
          />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Bot className="w-8 h-8 text-blue-600" />}
            title="Agents"
            description="Create and manage AI agents with different roles and capabilities"
            href="/agents"
          />
          <FeatureCard
            icon={<CheckSquare className="w-8 h-8 text-green-600" />}
            title="Tasks"
            description="Assign work, track progress, and manage priorities"
            href="/tasks"
          />
          <FeatureCard
            icon={<Calendar className="w-8 h-8 text-purple-600" />}
            title="Meetings"
            description="Schedule agent meetings and review transcripts"
            href="/meetings"
          />
          <FeatureCard
            icon={<Users className="w-8 h-8 text-orange-600" />}
            title="Departments"
            description="Organize agents into teams and departments"
            href="/departments"
          />
          <FeatureCard
            icon={<FileText className="w-8 h-8 text-red-600" />}
            title="Files"
            description="Edit agent personalities and knowledge bases"
            href="/files"
          />
          <FeatureCard
            icon={<Settings className="w-8 h-8 text-gray-600" />}
            title="Settings"
            description="Configure system settings and integrations"
            href="/settings"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>Agent Empire Dashboard · Built with OpenClaw</p>
        </div>
      </footer>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group">
        <div className="mb-4 group-hover:scale-110 transition-transform inline-block">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </Link>
  );
}
