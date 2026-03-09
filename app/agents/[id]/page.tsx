'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowLeft, Bot, Activity, FileText, Wrench, CheckSquare, MessageSquare, Trash2 } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  role: string;
  status: string;
  department_id: string | null;
  model: string;
  thinking_level: string;
  session_key: string;
  created_at: string;
}

interface AgentFile {
  id: string;
  file_type: string;
  content: string;
  updated_at: string;
}

type Tab = 'overview' | 'files' | 'skills' | 'tasks' | 'logs';

export default function AgentDetailPage() {
  const params = useParams();
  const agentId = params.id as string;
  
  const [agent, setAgent] = useState<Agent | null>(null);
  const [files, setFiles] = useState<AgentFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [editingFile, setEditingFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState('');

  useEffect(() => {
    loadAgent();
    loadFiles();
  }, [agentId]);

  async function loadAgent() {
    const { data } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single();
    
    setAgent(data);
    setLoading(false);
  }

  async function loadFiles() {
    const { data } = await supabase
      .from('agent_files')
      .select('*')
      .eq('agent_id', agentId)
      .order('file_type');
    
    setFiles(data || []);
  }

  async function handleSaveFile() {
    if (!editingFile) return;

    const existingFile = files.find(f => f.file_type === editingFile);

    if (existingFile) {
      // Update existing
      await supabase
        .from('agent_files')
        .update({ content: fileContent })
        .eq('id', existingFile.id);
    } else {
      // Create new
      await supabase.from('agent_files').insert({
        agent_id: agentId,
        file_type: editingFile,
        content: fileContent,
        version: 1,
      });
    }

    setEditingFile(null);
    loadFiles();
  }

  function handleEditFile(fileType: string) {
    const file = files.find(f => f.file_type === fileType);
    setEditingFile(fileType);
    setFileContent(file?.content || getDefaultContent(fileType));
  }

  function getDefaultContent(fileType: string): string {
    const defaults: Record<string, string> = {
      SOUL: `# ${agent?.name}

You are ${agent?.name}, ${agent?.role || 'an AI agent'}.

## Personality

[Define personality here]

## Rules

- [Add rules here]

## Responsibilities

- [Add responsibilities here]
`,
      MEMORY: `# Memory

## Key Information

[Store important context here]

## Decisions

[Track decisions made]

## Learnings

[Document learnings]
`,
      IDENTITY: `# Identity

**Name:** ${agent?.name}
**Role:** ${agent?.role || 'Not assigned'}
**Department:** TBD
**Emoji:** 🤖

## About

[Describe this agent]
`,
    };

    return defaults[fileType] || '';
  }

  if (loading || !agent) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        Loading agent...
      </div>
    );
  }

  const statusColors = {
    active: 'text-green-400 bg-green-500/10 border-green-500/50',
    idle: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/50',
    offline: 'text-slate-400 bg-slate-500/10 border-slate-500/50',
    paused: 'text-orange-400 bg-orange-500/10 border-orange-500/50',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top Bar */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/agents" className="text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Bot className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">{agent.name}</h1>
                  <p className="text-sm text-slate-400">{agent.role || 'No role assigned'}</p>
                </div>
              </div>
            </div>
            <div className={`px-3 py-1.5 rounded-lg border text-sm font-medium ${statusColors[agent.status as keyof typeof statusColors]}`}>
              {agent.status}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-800 bg-slate-900/30">
        <div className="container mx-auto px-6">
          <div className="flex gap-6">
            <TabButton
              active={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
              icon={<Activity className="w-4 h-4" />}
              label="Overview"
            />
            <TabButton
              active={activeTab === 'files'}
              onClick={() => setActiveTab('files')}
              icon={<FileText className="w-4 h-4" />}
              label="Files"
            />
            <TabButton
              active={activeTab === 'skills'}
              onClick={() => setActiveTab('skills')}
              icon={<Wrench className="w-4 h-4" />}
              label="Skills"
            />
            <TabButton
              active={activeTab === 'tasks'}
              onClick={() => setActiveTab('tasks')}
              icon={<CheckSquare className="w-4 h-4" />}
              label="Tasks"
            />
            <TabButton
              active={activeTab === 'logs'}
              onClick={() => setActiveTab('logs')}
              icon={<MessageSquare className="w-4 h-4" />}
              label="Logs"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <InfoCard label="Model" value={agent.model} />
              <InfoCard label="Session Key" value={agent.session_key} />
              <InfoCard label="Thinking Level" value={agent.thinking_level} />
              <InfoCard label="Created" value={new Date(agent.created_at).toLocaleString()} />
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="space-y-4">
            {editingFile ? (
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{editingFile}.md</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveFile}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingFile(null)}
                      className="text-slate-400 hover:text-white px-4 py-2 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                <textarea
                  value={fileContent}
                  onChange={(e) => setFileContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-white font-mono text-sm focus:outline-none focus:border-blue-500/50"
                  rows={20}
                />
              </div>
            ) : (
              <>
                {['SOUL', 'MEMORY', 'IDENTITY', 'TOOLS', 'AGENTS'].map((fileType) => {
                  const file = files.find(f => f.file_type === fileType);
                  return (
                    <div
                      key={fileType}
                      className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold mb-1">{fileType}.md</h3>
                          <p className="text-sm text-slate-400">
                            {file ? `Last updated ${new Date(file.updated_at).toLocaleString()}` : 'Not created yet'}
                          </p>
                        </div>
                        <button
                          onClick={() => handleEditFile(fileType)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                        >
                          {file ? 'Edit' : 'Create'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-12 text-center">
            <Wrench className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400">Skills management coming soon</p>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-12 text-center">
            <CheckSquare className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400">Tasks view coming soon</p>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-12 text-center">
            <MessageSquare className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400">Activity logs coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
        active
          ? 'border-blue-500 text-white'
          : 'border-transparent text-slate-400 hover:text-white'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
