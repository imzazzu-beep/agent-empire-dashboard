'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Bot, Plus, Activity, Pause, Power } from 'lucide-react';

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading agents...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Agents</h1>
            <p className="text-slate-300">Manage your AI agent workforce</p>
          </div>
          <Link
            href="/agents/new"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Agent
          </Link>
        </div>

        {/* Agents List */}
        {agents.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-12 border border-white/20 text-center">
            <Bot className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-white text-xl font-bold mb-2">No agents yet</h3>
            <p className="text-slate-300 mb-6">Create your first AI agent to get started</p>
            <Link
              href="/agents/new"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Create First Agent
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  const statusColors = {
    active: 'text-green-400',
    idle: 'text-yellow-400',
    offline: 'text-slate-400',
    paused: 'text-orange-400',
  };

  const statusIcons = {
    active: <Activity className="w-4 h-4" />,
    idle: <Pause className="w-4 h-4" />,
    offline: <Power className="w-4 h-4" />,
    paused: <Pause className="w-4 h-4" />,
  };

  return (
    <Link href={`/agents/${agent.id}`}>
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
        <div className="flex items-start justify-between mb-4">
          <div className="bg-purple-600 p-3 rounded-lg group-hover:scale-110 transition-transform">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div className={`flex items-center gap-1 ${statusColors[agent.status as keyof typeof statusColors]}`}>
            {statusIcons[agent.status as keyof typeof statusIcons]}
            <span className="text-sm capitalize">{agent.status}</span>
          </div>
        </div>

        <h3 className="text-white text-xl font-bold mb-1">{agent.name}</h3>
        <p className="text-slate-300 text-sm mb-4">{agent.role || 'No role assigned'}</p>

        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{agent.model}</span>
          <span>{new Date(agent.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
}
