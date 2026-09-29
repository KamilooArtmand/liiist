export type ListType = 'todo' | 'ranked' | 'shopping' | 'bucket' | 'notes';

export type Priority = 'p1' | 'p2' | 'p3' | 'p4';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface ListItem {
  id: string;
  title: string;
  completed: boolean;
  notes?: string;
  priority: Priority;
  dueDate?: string; // YYYY-MM-DD
  tags: string[];
  rank?: number; // for ranked lists (1, 2, 3...)
  score?: number; // 0 - 10
  category?: string; // for shopping lists e.g. "Produce", "Dairy", "Pantry"
  quantity?: string; // e.g. "2 packs", "1 kg"
  url?: string;
  subtasks?: Subtask[];
  createdAt: string;
  completedAt?: string;
}

export interface ListGroup {
  id: string;
  title: string;
  description?: string;
  type: ListType;
  color: 'amber' | 'emerald' | 'indigo' | 'rose' | 'violet' | 'cyan' | 'orange';
  icon: string;
  items: ListItem[];
  favorite?: boolean;
  isArchived?: boolean;
  sortOrder: 'manual' | 'priority' | 'dueDate' | 'alphabetical' | 'rank';
  createdAt: string;
  updatedAt: string;
}

export type ViewMode = 'list' | 'board' | 'focus';
export type FilterStatus = 'all' | 'active' | 'completed';
