export type ActiveTab = 
  | 'dashboard' 
  | 'vaex' 
  | 'hermes' 
  | 'openclaw' 
  | 'hub_monitor' 
  | 'settings' 
  | 'evolution';

export interface VaexNode {
  id: string;
  label: string;
  group: 'memory' | 'logic' | 'breakpoint' | 'core' | 'user';
  description: string;
  stability: number; // e.g. 98.4
  cognition: number; // e.g. 82.1
  x: number;
  y: number;
  r: number;
  connections: string[]; // Node IDs this connects to
}

export interface AssociatedEntity {
  name: string;
  type: 'psychology' | 'database' | 'hub';
  strength: number; // e.g. 0.95
}

export interface OpenClawSession {
  id: string;
  name: string;
  status: 'active' | 'suspended' | 'injecting';
  delay: number; // in ms
  load: number; // CPU/Ram load percentage
  subtext: string;
  type: 'robot' | 'toy' | 'pause' | 'deployed';
}

export interface CronTask {
  id: string;
  name: string;
  nextRun: string; // text description
  active: boolean;
  borderType: 'primary' | 'tertiary';
}

export interface MessageChannel {
  id: string;
  name: string;
  status: 'ok' | 'delay' | 'error';
  node: string;
  latencyText: string;
  type: 'feishu' | 'telegram';
}

export interface LLMProvider {
  id: string;
  name: string;
  provider: string; // Anthropic, OpenAI, etc.
  quota: number; // Percentage
  type: 'claude' | 'gpt' | 'doubao' | 'gemini';
  color: string; // tailwind color prefix or hex
}

export interface InferenceRecord {
  id: string;
  time: string;
  model: string;
  tokens: number;
  latency: string;
  preview: string;
  status: 'success' | 'error' | 'pending';
}

export interface PandaAgent {
  id: string;
  name: string;
  status: 'syncing' | 'querying' | 'idle';
  zone: string;
  xOffset: number; // isometric rendering adjustment
  yOffset: number;
}

export interface OfficeEvent {
  id: string;
  time: string;
  title: string;
  type: 'primary' | 'secondary' | 'tertiary' | 'error';
}
