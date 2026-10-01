export interface CosmicItem {
  id: string;
  title: string;
  subtitle?: string;
  details?: string;
  attributes?: Record<string, string | number>;
  tags: string[];
  hasDeepSublist?: boolean;
  sublistPrompt?: string;
  rank?: number;
  completed?: boolean;
}

export interface CosmicListNode {
  id: string;
  parentId?: string;
  category: 'books' | 'cities' | 'goods' | 'words' | 'science' | 'culture' | 'custom';
  title: string;
  description: string;
  icon: string;
  coverTheme: 'amber' | 'emerald' | 'indigo' | 'rose' | 'violet' | 'cyan' | 'orange';
  items: CosmicItem[];
  subListIds?: string[];
  aiGenerated?: boolean;
  aiConfidence?: number;
  lastSelfHealed?: string;
  totalSubBranches?: number;
}

export interface KernelTelemetry {
  status: 'optimal' | 'self-healing' | 'expanding';
  uptimeSeconds: number;
  entitiesIndexed: number;
  activeRoutines: string[];
  anomaliesResolved: number;
  lastOptimization: string;
  memoryUsageMb: number;
  cacheHitRatio: number;
  autonomousLog: Array<{
    id: string;
    timestamp: string;
    action: string;
    type: 'heal' | 'expand' | 'optimize' | 'support';
  }>;
}

export interface ConciergeMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  actionTaken?: {
    type: 'created_list' | 'expanded_node' | 'filtered';
    listId?: string;
    title?: string;
  };
}
