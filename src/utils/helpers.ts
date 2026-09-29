import { ListGroup, ListItem, Priority } from '../types';

export const COLOR_MAP = {
  amber: {
    bg: 'bg-amber-500',
    light: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/50',
    border: 'border-amber-400',
    text: 'text-amber-600 dark:text-amber-400',
    ring: 'focus:ring-amber-400',
    badge: 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200'
  },
  emerald: {
    bg: 'bg-emerald-500',
    light: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50',
    border: 'border-emerald-400',
    text: 'text-emerald-600 dark:text-emerald-400',
    ring: 'focus:ring-emerald-400',
    badge: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200'
  },
  indigo: {
    bg: 'bg-indigo-500',
    light: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/50',
    border: 'border-indigo-400',
    text: 'text-indigo-600 dark:text-indigo-400',
    ring: 'focus:ring-indigo-400',
    badge: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200'
  },
  rose: {
    bg: 'bg-rose-500',
    light: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/50',
    border: 'border-rose-400',
    text: 'text-rose-600 dark:text-rose-400',
    ring: 'focus:ring-rose-400',
    badge: 'bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-200'
  },
  violet: {
    bg: 'bg-violet-500',
    light: 'bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800/50',
    border: 'border-violet-400',
    text: 'text-violet-600 dark:text-violet-400',
    ring: 'focus:ring-violet-400',
    badge: 'bg-violet-100 dark:bg-violet-900/50 text-violet-800 dark:text-violet-200'
  },
  cyan: {
    bg: 'bg-cyan-500',
    light: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/50',
    border: 'border-cyan-400',
    text: 'text-cyan-600 dark:text-cyan-400',
    ring: 'focus:ring-cyan-400',
    badge: 'bg-cyan-100 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-200'
  },
  orange: {
    bg: 'bg-orange-500',
    light: 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800/50',
    border: 'border-orange-400',
    text: 'text-orange-600 dark:text-orange-400',
    ring: 'focus:ring-orange-400',
    badge: 'bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200'
  }
};

export const PRIORITY_CONFIG: Record<Priority, { label: string; badge: string; color: string; dot: string }> = {
  p1: { label: 'Urgent', badge: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 border-red-200 dark:border-red-900', color: 'text-red-500', dot: 'bg-red-500' },
  p2: { label: 'High', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-amber-200 dark:border-amber-900', color: 'text-amber-500', dot: 'bg-amber-500' },
  p3: { label: 'Medium', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 border-blue-200 dark:border-blue-900', color: 'text-blue-500', dot: 'bg-blue-500' },
  p4: { label: 'Low', badge: 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400 border-stone-200 dark:border-stone-700', color: 'text-stone-400', dot: 'bg-stone-400' }
};

export function formatDueDate(dateStr?: string): { text: string; isOverdue: boolean; isToday: boolean } | null {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parts = dateStr.split('-');
  if (parts.length !== 3) return { text: dateStr, isOverdue: false, isToday: false };
  const target = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  target.setHours(0, 0, 0, 0);

  const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { text: `${Math.abs(diffDays)}d overdue`, isOverdue: true, isToday: false };
  } else if (diffDays === 0) {
    return { text: 'Today', isOverdue: false, isToday: true };
  } else if (diffDays === 1) {
    return { text: 'Tomorrow', isOverdue: false, isToday: false };
  } else {
    return {
      text: target.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      isOverdue: false,
      isToday: false
    };
  }
}

export function exportListAsMarkdown(list: ListGroup): string {
  let md = `# ${list.icon} ${list.title}\n`;
  if (list.description) md += `*${list.description}*\n\n`;

  if (list.type === 'ranked') {
    const sorted = [...list.items].sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999));
    sorted.forEach((item, index) => {
      md += `${index + 1}. **${item.title}**${item.score ? ` (Score: ${item.score}/10)` : ''}\n`;
      if (item.notes) md += `   > ${item.notes}\n`;
      if (item.tags?.length) md += `   Tags: ${item.tags.join(', ')}\n`;
      md += '\n';
    });
  } else if (list.type === 'shopping') {
    const categories: Record<string, ListItem[]> = {};
    list.items.forEach(item => {
      const cat = item.category || 'General';
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(item);
    });

    Object.entries(categories).forEach(([category, items]) => {
      md += `### ${category}\n`;
      items.forEach(item => {
        md += `- [${item.completed ? 'x' : ' '}] ${item.title}${item.quantity ? ` (${item.quantity})` : ''}\n`;
        if (item.notes) md += `  - *Notes:* ${item.notes}\n`;
      });
      md += '\n';
    });
  } else {
    list.items.forEach(item => {
      md += `- [${item.completed ? 'x' : ' '}] ${item.title}${item.dueDate ? ` (Due: ${item.dueDate})` : ''}\n`;
      if (item.notes) md += `  ${item.notes}\n`;
      if (item.subtasks?.length) {
        item.subtasks.forEach(sub => {
          md += `  - [${sub.completed ? 'x' : ' '}] ${sub.title}\n`;
        });
      }
    });
  }

  return md;
}

export function exportListAsPlainText(list: ListGroup): string {
  let text = `${list.icon} ${list.title.toUpperCase()}\n`;
  if (list.description) text += `${list.description}\n`;
  text += '--------------------------------------------------\n\n';

  list.items.forEach((item, idx) => {
    const status = item.completed ? '[✓]' : '[ ]';
    if (list.type === 'ranked') {
      text += `${item.rank ?? idx + 1}. ${item.title} ${item.score ? `★ ${item.score}` : ''}\n`;
    } else {
      text += `${status} ${item.title}${item.quantity ? ` - ${item.quantity}` : ''}\n`;
    }
    if (item.notes) text += `    Note: ${item.notes}\n`;
    if (item.subtasks?.length) {
      item.subtasks.forEach(s => {
        text += `    ${s.completed ? '  [✓]' : '  [ ]'} ${s.title}\n`;
      });
    }
  });

  return text;
}
