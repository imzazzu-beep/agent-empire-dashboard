/**
 * OpenClaw Gateway Integration
 * Connects dashboard to the running OpenClaw instance
 */

const GATEWAY_URL = process.env.NEXT_PUBLIC_OPENCLAW_GATEWAY_URL || 'http://localhost:18789';

export interface OpenClawSession {
  sessionKey: string;
  agentId?: string;
  label?: string;
  kind?: string;
  model?: string;
  lastActive?: string;
}

/**
 * Get all active sessions from OpenClaw
 */
export async function getOpenClawSessions(): Promise<OpenClawSession[]> {
  try {
    // Note: This would use OpenClaw's sessions_list via API
    // For now, we'll use a direct approach
    const response = await fetch(`${GATEWAY_URL}/api/sessions/list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      console.error('Failed to fetch OpenClaw sessions');
      return [];
    }
    
    const data = await response.json();
    return data.sessions || [];
  } catch (error) {
    console.error('Error fetching OpenClaw sessions:', error);
    return [];
  }
}

/**
 * Spawn a new agent in OpenClaw
 */
export async function spawnAgent(config: {
  label: string;
  task: string;
  model?: string;
  thinking?: string;
}): Promise<{ sessionKey: string; success: boolean }> {
  try {
    const response = await fetch(`${GATEWAY_URL}/api/sessions/spawn`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        runtime: 'subagent',
        mode: 'session',
        label: config.label,
        task: config.task,
        model: config.model || 'anthropic/claude-sonnet-4-5',
        thinking: config.thinking || 'off',
        thread: false,
      }),
    });
    
    const data = await response.json();
    return {
      sessionKey: data.sessionKey,
      success: response.ok,
    };
  } catch (error) {
    console.error('Error spawning agent:', error);
    return { sessionKey: '', success: false };
  }
}

/**
 * Send a message to an agent
 */
export async function sendToAgent(sessionKey: string, message: string): Promise<boolean> {
  try {
    const response = await fetch(`${GATEWAY_URL}/api/sessions/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionKey,
        message,
      }),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error sending to agent:', error);
    return false;
  }
}
