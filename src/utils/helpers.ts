import { ListGroup, ListItem, Priority } from '../types';

// Monochromatic Theme Mapping — Exclusively White, Grays, and Black
export const COLOR_MAP: Record<string, {
  bg: string;
  light: string;
  border: string;
  text: string;
  ring: string;
  badge: string;
}> = {
  amber: {
    bg: 'bg-black dark:bg-white',
    light: 'bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100 border-stone-300 dark:border-stone-800',
    border: 'border-stone-400 dark:border-stone-600',
    text: 'text-stone-900 dark:text-stone-100',
    ring: 'focus:ring-stone-400',
    badge: 'bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
  },
  emerald: {
    bg: 'bg-stone-900 dark:bg-stone-100',
    light: 'bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100 border-stone-300 dark:border-stone-800',
    border: 'border-stone-400 dark:border-stone-600',
    text: 'text-stone-900 dark:text-stone-100',
    ring: 'focus:ring-stone-400',
    badge: 'bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
  },
  indigo: {
    bg: 'bg-stone-800 dark:bg-stone-200',
    light: 'bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100 border-stone-300 dark:border-stone-800',
    border: 'border-stone-400 dark:border-stone-600',
    text: 'text-stone-900 dark:text-stone-100',
    ring: 'focus:ring-stone-400',
    badge: 'bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
  },
  rose: {
    bg: 'bg-stone-800 dark:bg-stone-200',
    light: 'bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100 border-stone-300 dark:border-stone-800',
    border: 'border-stone-400 dark:border-stone-600',
    text: 'text-stone-900 dark:text-stone-100',
    ring: 'focus:ring-stone-400',
    badge: 'bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
  },
  violet: {
    bg: 'bg-stone-800 dark:bg-stone-200',
    light: 'bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100 border-stone-300 dark:border-stone-800',
    border: 'border-stone-400 dark:border-stone-600',
    text: 'text-stone-900 dark:text-stone-100',
    ring: 'focus:ring-stone-400',
    badge: 'bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
  },
  cyan: {
    bg: 'bg-stone-800 dark:bg-stone-200',
    light: 'bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100 border-stone-300 dark:border-stone-800',
    border: 'border-stone-400 dark:border-stone-600',
    text: 'text-stone-900 dark:text-stone-100',
    ring: 'focus:ring-stone-400',
    badge: 'bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
  },
  orange: {
    bg: 'bg-stone-800 dark:bg-stone-200',
    light: 'bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100 border-stone-300 dark:border-stone-800',
    border: 'border-stone-400 dark:border-stone-600',
    text: 'text-stone-900 dark:text-stone-100',
    ring: 'focus:ring-stone-400',
    badge: 'bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
  }
};

// Monochromatic Priority Config
export const PRIORITY_CONFIG: Record<Priority, { label: string; badge: string; color: string; dot: string }> = {
  p1: {
    label: 'P1 Urgent',
    badge: 'bg-black text-white dark:bg-white dark:text-black border-transparent font-bold',
    color: 'text-stone-950 dark:text-white',
    dot: 'bg-stone-950 dark:bg-white'
  },
  p2: {
    label: 'P2 High',
    badge: 'bg-stone-800 text-white dark:bg-stone-200 dark:text-black border-transparent',
    color: 'text-stone-800 dark:text-stone-200',
    dot: 'bg-stone-800 dark:bg-stone-200'
  },
  p3: {
    label: 'P3 Medium',
    badge: 'bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700',
    color: 'text-stone-600 dark:text-stone-400',
    dot: 'bg-stone-500 dark:bg-stone-500'
  },
  p4: {
    label: 'P4 Low',
    badge: 'bg-stone-100 text-stone-500 dark:bg-stone-900 dark:text-stone-400 border-stone-200 dark:border-stone-800',
    color: 'text-stone-400',
    dot: 'bg-stone-400'
  }
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
