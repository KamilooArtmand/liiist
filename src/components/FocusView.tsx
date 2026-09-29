import React, { useState, useEffect } from 'react';
import { ListGroup, ListItem } from '../types';
import { PRIORITY_CONFIG } from '../utils/helpers';
import {
  CheckCircle2,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Flame,
  Check
} from 'lucide-react';

interface FocusViewProps {
  list: ListGroup;
  onToggleComplete: (itemId: string) => void;
  onSelectItem: (item: ListItem) => void;
}

export const FocusView: React.FC<FocusViewProps> = ({
  list,
  onToggleComplete,
  onSelectItem
}) => {
  const pendingItems = list.items.filter(i => !i.completed);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 25-minute Pomodoro timer
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(sec => sec - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, secondsLeft]);

  const activeItem: ListItem | undefined = pendingItems[currentIndex] || pendingItems[0];

  const handleNext = () => {
    if (pendingItems.length <= 1) return;
    setCurrentIndex(prev => (prev + 1) % pendingItems.length);
  };

  const handleCompleteCurrent = () => {
    if (activeItem) {
      onToggleComplete(activeItem.id);
      if (currentIndex >= pendingItems.length - 1) {
        setCurrentIndex(0);
      }
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!activeItem) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center p-6 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">
          All Caught Up!
        </h2>
        <p className="text-sm text-stone-500 max-w-md">
          You've completed every task in <strong className="text-stone-700 dark:text-stone-300">{list.title}</strong>. Take a well-deserved breather or add your next goal.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center">
      {/* Focus Timer Card */}
      <div className="w-full bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-8 shadow-xl mb-6 flex flex-col items-center justify-center border border-stone-800">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-semibold mb-3">
          <Flame className="w-4 h-4 text-amber-400" /> Deep Focus Mode
        </div>

        <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white mb-6">
          {formatTimer(secondsLeft)}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTimerRunning(!timerRunning)}
            className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-full transition shadow-md"
          >
            {timerRunning ? (
              <>
                <Pause className="w-4 h-4" /> Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-stone-950" /> Start Focus
              </>
            )}
          </button>
          <button
            onClick={() => {
              setTimerRunning(false);
              setSecondsLeft(25 * 60);
            }}
            className="p-2.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
            title="Reset timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Primary Active Task Card */}
      <div className="w-full bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col gap-6">
        <div className="flex items-center justify-between text-xs text-stone-400 font-medium">
          <span>
            Task {currentIndex + 1} of {pendingItems.length}
          </span>
          <div className="flex items-center gap-2">
            {activeItem.priority && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                  PRIORITY_CONFIG[activeItem.priority].badge
                }`}
              >
                {PRIORITY_CONFIG[activeItem.priority].label}
              </span>
            )}
            <span className="bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-2 py-0.5 rounded-full text-[10px]">
              {list.icon} {list.title}
            </span>
          </div>
        </div>

        <div>
          <h2
            onClick={() => onSelectItem(activeItem)}
            className="text-2xl font-bold text-stone-900 dark:text-stone-100 leading-snug cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 transition"
          >
            {activeItem.title}
          </h2>
          {activeItem.notes && (
            <p className="mt-3 text-sm text-stone-600 dark:text-stone-300 leading-relaxed bg-stone-50 dark:bg-stone-800/60 p-4 rounded-xl border border-stone-100 dark:border-stone-800">
              {activeItem.notes}
            </p>
          )}
        </div>

        {/* Subtasks if any */}
        {activeItem.subtasks && activeItem.subtasks.length > 0 && (
          <div className="space-y-2 border-t border-stone-100 dark:border-stone-800 pt-4">
            <span className="text-xs uppercase font-bold tracking-wider text-stone-400">
              Subtasks
            </span>
            <div className="space-y-1.5">
              {activeItem.subtasks.map(sub => (
                <div
                  key={sub.id}
                  className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300"
                >
                  <span
                    className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] ${
                      sub.completed
                        ? 'bg-emerald-500 text-white'
                        : 'border border-stone-300 dark:border-stone-600'
                    }`}
                  >
                    {sub.completed && <Check className="w-2.5 h-2.5" />}
                  </span>
                  <span className={sub.completed ? 'line-through text-stone-400' : ''}>
                    {sub.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800 gap-3">
          <button
            type="button"
            onClick={handleNext}
            disabled={pendingItems.length <= 1}
            className="px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 disabled:opacity-30 transition flex items-center gap-1.5"
          >
            <SkipForward className="w-3.5 h-3.5" /> Skip for Now
          </button>

          <button
            type="button"
            onClick={handleCompleteCurrent}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4" /> Mark as Done
          </button>
        </div>
      </div>
    </div>
  );
};
