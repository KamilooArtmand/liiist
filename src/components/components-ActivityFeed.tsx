'use client';

import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'like' | 'comment';
  userHandle: string;
  targetTitle: string;
  targetType: string; // e.g. 'movie', 'software'
  content?: string;
  timestamp: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center border border-[var(--color-border-subtle)] border-dashed rounded-2xl">
        <span className="text-[var(--color-text-tertiary)] font-mono text-xs uppercase tracking-widest">
          No public activity found.
        </span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col relative">
      {/* Absolute Timeline Backbone (The '|' identity) */}
      <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-[var(--color-border-subtle)]" />

      {activities.map((activity, index) => (
        <div key={activity.id} className="relative pl-12 py-6 flex flex-col gap-2 group">
          
          {/* Node Indicator (The 'o' identity) */}
          <div className="absolute left-[11px] top-[28px] w-[18px] h-[18px] rounded-full bg-[var(--color-bg-primary)] border-2 border-[var(--color-border-strong)] flex items-center justify-center z-10 group-hover:border-[var(--color-text-primary)] transition-colors">
            {activity.type === 'like' ? (
              <Heart className="w-2.5 h-2.5 text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-primary)]" />
            ) : (
              <MessageCircle className="w-2.5 h-2.5 text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-primary)]" />
            )}
          </div>

          {/* Activity Metadata */}
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--color-text-tertiary)]">
            <span>{activity.type === 'like' ? 'Liked' : 'Commented on'}</span>
            <span className="px-2 py-0.5 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] text-[var(--color-text-secondary)]">
              {activity.targetType}
            </span>
            <span className="ml-auto">{activity.timestamp}</span>
          </div>

          {/* Target Title */}
          <h4 className="text-xl font-black text-[var(--color-text-primary)] tracking-tighter uppercase cursor-pointer hover:underline">
            {activity.targetTitle}
          </h4>

          {/* Comment Content (If Applicable) */}
          {activity.type === 'comment' && activity.content && (
            <p className="mt-2 text-sm font-serif text-[var(--color-text-secondary)] leading-[var(--leading-editorial-relaxed)] pl-4 border-l-2 border-[var(--color-border-subtle)]">
              "{activity.content}"
            </p>
          )}
        </div>
      ))}
    </div>
  );
};
