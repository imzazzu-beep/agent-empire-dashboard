'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Bot, Plus, Activity, Pause, Power, ArrowLeft, Search } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  role: string;
  status: string;
  department_id: string | null;
  model: string;
  created_at: string;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAgents();
  }, []);

  async function loadAgents() {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading agents:', error);
    } else {
      setAgents(data || []);
    }
    setLoading(false);
  }

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading agents...</div>
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
              <h1 className="text-xl font-bold">Agents</h1>
              <span className="text-sm text-slate-500">
                {filteredAgents.length} total
              </span>
            </div>
            <Link
              href="/agents/new"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Agent
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>
        </div>

        {filteredAgents.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-12 text-center">
            <Bot className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No agents yet</h3>
            <p className="text-slate-400 mb-6">Create your first AI agent to get started</p>
            <Link
              href="/agents/new"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Create First Agent
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  const statusConfig = {
    active: {
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/50',
      icon: <Activity className="w-3 h-3" />,
    },
    idle: {
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/50',
      icon: <Pause className="w-3 h-3" />,
    },
    offline: {
      color: 'text-slate-400',
      bg: 'bg-slate-500/10',
      border: 'border-slate-500/50',
      icon: <Power className="w-3 h-3" />,
    },
    paused: {
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/50',
      icon: <Pause className="w-3 h-3" />,
    },
  };

  const config = statusConfig[agent.status as keyof typeof statusConfig] || statusConfig.offline;

  return (
    <Link href={`/agents/${agent.id}`}>
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 hover:border-blue-500/50 transition-all cursor-pointer group">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2.5 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
            <Bot className="w-5 h-5 text-blue-400" />
          </div>
          <div
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border ${config.color} ${config.bg} ${config.border}`}
          >
            {config.icon}
            <span className="capitalize">{agent.status}</span>
          </div>
        </div>

        <h3 className="text-base font-semibold mb-1">{agent.name}</h3>
        <p className="text-sm text-slate-400 mb-4">{agent.role || 'No role assigned'}</p>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-mono">{agent.model.split('/').pop()}</span>
          <span>{new Date(agent.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
}
