'use client';

import React, { useState, useCallback } from 'react';
import { Heart, MessageCircle, BookmarkPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { microSpring } from './animations';

interface EngagementActionProps {
  initialLiked?: boolean;
  likeCount?: number;
  commentCount?: number;
  onLikeAction?: (newStatus: boolean) => Promise<void>;
  onSaveClick?: () => void; // Trigger for Popover/BottomSheet
}

export const EngagementAction: React.FC<EngagementActionProps> = ({
  initialLiked = false,
  likeCount = 0,
  commentCount = 0,
  onLikeAction,
  onSaveClick
}) => {
  // Optimistic UI State
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [optimisticCount, setOptimisticCount] = useState(likeCount);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLike = useCallback(async () => {
    if (isProcessing) return;
    
    // 1. Optimistic Update (Zero-Latency Feedback)
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setOptimisticCount(prev => newLikedState ? prev + 1 : prev - 1);
    
    // Trigger haptic feedback here in React Native
    
    if (onLikeAction) {
      setIsProcessing(true);
      try {
        // 2. Background Sync
        await onLikeAction(newLikedState);
      } catch (error) {
        // 3. Rollback on failure
        setIsLiked(!newLikedState);
        setOptimisticCount(prev => newLikedState ? prev - 1 : prev + 1);
        console.error("Optimistic engagement failed, rolled back.", error);
      } finally {
        setIsProcessing(false);
      }
    }
  }, [isLiked, isProcessing, onLikeAction]);

  return (
    <div className="flex items-center gap-6 border-t border-[var(--color-border-subtle)] pt-4 mt-4">
      
      {/* Like Button */}
      <button 
        onClick={handleLike}
        className="group flex items-center gap-2 cursor-pointer outline-none"
      >
        <motion.div
          whileTap={{ scale: 0.8 }}
          transition={microSpring}
          className="relative"
        >
          <Heart 
            className={`w-5 h-5 transition-colors duration-200 ${
              isLiked 
                ? 'fill-[var(--color-text-primary)] text-[var(--color-text-primary)]' 
                : 'text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-primary)]'
            }`} 
          />
        </motion.div>
        <span className={`text-sm font-mono font-bold ${isLiked ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-tertiary)]'}`}>
          {optimisticCount}
        </span>
      </button>

      {/* Comment Button */}
      <button className="group flex items-center gap-2 cursor-pointer outline-none">
        <motion.div whileTap={{ scale: 0.9 }} transition={microSpring}>
          <MessageCircle className="w-5 h-5 text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-primary)] transition-colors" />
        </motion.div>
        <span className="text-sm font-mono font-bold text-[var(--color-text-tertiary)]">
          {commentCount}
        </span>
      </button>

      {/* Save / Collect Button */}
      <div className="flex-1 flex justify-end">
        <button 
          onClick={onSaveClick}
          className="group flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-border-subtle)] hover:border-[var(--color-border-strong)] transition-colors"
        >
          <BookmarkPlus className="w-4 h-4 text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]" />
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]">
            Save
          </span>
        </button>
      </div>

    </div>
  );
};
