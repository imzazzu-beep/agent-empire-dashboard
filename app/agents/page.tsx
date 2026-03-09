'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Bot, Plus, Activity, Pause, Power, ArrowLeft } from 'lucide-react';

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-lg">Loading agents...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Agents</h1>
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
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {agents.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No agents yet</h3>
            <p className="text-gray-600 mb-6">Create your first AI agent to get started</p>
            <Link
              href="/agents/new"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
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
    active: 'text-green-600',
    idle: 'text-yellow-600',
    offline: 'text-gray-400',
    paused: 'text-orange-600',
  };

  const statusBgColors = {
    active: 'bg-green-50',
    idle: 'bg-yellow-50',
    offline: 'bg-gray-50',
    paused: 'bg-orange-50',
  };

  const statusIcons = {
    active: <Activity className="w-3 h-3" />,
    idle: <Pause className="w-3 h-3" />,
    offline: <Power className="w-3 h-3" />,
    paused: <Pause className="w-3 h-3" />,
  };

  return (
    <Link href={`/agents/${agent.id}`}>
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <Bot className="w-6 h-6 text-blue-600" />
          </div>
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
              statusColors[agent.status as keyof typeof statusColors]
            } ${statusBgColors[agent.status as keyof typeof statusBgColors]}`}
          >
            {statusIcons[agent.status as keyof typeof statusIcons]}
            <span className="capitalize">{agent.status}</span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-1">{agent.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{agent.role || 'No role assigned'}</p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="font-mono">{agent.model.split('/').pop()}</span>
          <span>{new Date(agent.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
}
