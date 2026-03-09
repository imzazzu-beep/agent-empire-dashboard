'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowLeft, Bot, Loader2 } from 'lucide-react';

interface Department {
  id: string;
  name: string;
}

const AGENT_TEMPLATES = {
  custom: {
    name: 'Custom Agent',
    role: '',
    soul: '',
  },
  developer: {
    name: 'Development Lead',
    role: 'Development Lead',
    soul: `# Development Lead

You are a Development Lead in our AI agent empire.

## Personality

Be technical, efficient, and detail-oriented. Focus on code quality, architecture, and delivery.

## Rules

- Write clean, maintainable code
- Follow best practices
- Document your work
- Test thoroughly before deploying
- Communicate progress regularly

## Responsibilities

- Build and deploy products
- Review code and architecture
- Manage development tasks
- Mentor junior developers
`,
  },
  marketing: {
    name: 'Marketing Lead',
    role: 'Marketing Lead',
    soul: `# Marketing Lead

You are a Marketing Lead in our AI agent empire.

## Personality

Be creative, data-driven, and customer-focused. Think growth and brand.

## Rules

- Focus on ROI and metrics
- Create compelling content
- Test and optimize campaigns
- Stay on brand
- Report results regularly

## Responsibilities

- Create marketing campaigns
- Write content (blog, social, ads)
- SEO and growth strategies
- Analyze performance metrics
`,
  },
  operations: {
    name: 'Operations Lead',
    role: 'Operations Lead',
    soul: `# Operations Lead

You are an Operations Lead in our AI agent empire.

## Personality

Be organized, process-driven, and efficient. Focus on systems and scalability.

## Rules

- Optimize workflows
- Automate repetitive tasks
- Monitor and improve processes
- Keep things running smoothly
- Document procedures

## Responsibilities

- Manage day-to-day operations
- Coordinate between teams
- Improve efficiency
- Handle administrative tasks
`,
  },
};

const MODELS = [
  { value: 'anthropic/claude-sonnet-4-5', label: 'Claude Sonnet 4.5 (Recommended)' },
  { value: 'anthropic/claude-opus-4', label: 'Claude Opus 4 (Most Capable)' },
  { value: 'openai/gpt-4o', label: 'GPT-4o' },
  { value: 'openai/gpt-4-turbo', label: 'GPT-4 Turbo' },
];

export default function CreateAgentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  
  const [template, setTemplate] = useState<keyof typeof AGENT_TEMPLATES>('custom');
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department_id: '',
    model: 'anthropic/claude-sonnet-4-5',
    thinking_level: 'off',
    soul: '',
  });

  useEffect(() => {
    loadDepartments();
  }, []);

  useEffect(() => {
    // Update form when template changes
    const templateData = AGENT_TEMPLATES[template];
    setFormData(prev => ({
      ...prev,
      role: templateData.role,
      soul: templateData.soul,
    }));
  }, [template]);

  async function loadDepartments() {
    const { data } = await supabase
      .from('departments')
      .select('id, name')
      .order('name');
    
    setDepartments(data || []);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create agent in database
      const { data: agent, error: dbError } = await supabase
        .from('agents')
        .insert({
          name: formData.name,
          role: formData.role,
          department_id: formData.department_id || null,
          model: formData.model,
          thinking_level: formData.thinking_level,
          status: 'active',
          session_key: `agent-${Date.now()}`, // Temporary, will be updated after spawn
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // 2. Create SOUL.md file in database
      if (formData.soul) {
        await supabase.from('agent_files').insert({
          agent_id: agent.id,
          file_type: 'SOUL',
          content: formData.soul,
          version: 1,
        });
      }

      // 3. Spawn agent in OpenClaw (TODO: implement when API is ready)
      // For now, we just create in database
      // const spawnResult = await spawnAgent({
      //   label: formData.name,
      //   task: `Initialize as ${formData.role}. ${formData.soul}`,
      //   model: formData.model,
      //   thinking: formData.thinking_level,
      // });

      // 4. Log activity
      await supabase.from('logs').insert({
        agent_id: agent.id,
        log_type: 'info',
        message: `Agent ${formData.name} created`,
      });

      // 5. Redirect to agent detail page
      router.push(`/agents/${agent.id}`);
    } catch (error) {
      console.error('Error creating agent:', error);
      alert('Failed to create agent. Check console for details.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top Bar */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/agents" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold">Create New Agent</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-6 py-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Template Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Agent Template
            </label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(AGENT_TEMPLATES).map(([key, tmpl]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTemplate(key as keyof typeof AGENT_TEMPLATES)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    template === key
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold mb-1">{tmpl.name}</div>
                  <div className="text-xs text-slate-400">
                    {key === 'custom' ? 'Build from scratch' : `Pre-configured ${tmpl.role}`}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Agent Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., DevLead-01, Maria, TaskBot"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Role
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g., Development Lead, Marketing Manager"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Department
            </label>
            <select
              value={formData.department_id}
              onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
            >
              <option value="">No Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              AI Model
            </label>
            <select
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
            >
              {MODELS.map((model) => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </select>
          </div>

          {/* Thinking Level */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Thinking Level
            </label>
            <select
              value={formData.thinking_level}
              onChange={(e) => setFormData({ ...formData, thinking_level: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
            >
              <option value="off">Off</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* SOUL.md */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Personality (SOUL.md)
            </label>
            <textarea
              value={formData.soul}
              onChange={(e) => setFormData({ ...formData, soul: e.target.value })}
              placeholder="Define the agent's personality, rules, and responsibilities..."
              rows={12}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 font-mono text-sm"
            />
            <p className="text-xs text-slate-500 mt-2">
              This will be saved as SOUL.md and defines the agent's personality and behavior
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={loading || !formData.name}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Agent...
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4" />
                  Create Agent
                </>
              )}
            </button>
            <Link
              href="/agents"
              className="px-6 py-3 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
