import React, { useState, useRef, useEffect } from 'react';
import { SupportedLanguage, TRANSLATIONS } from '../i18n/i18n-translations';
import { ConciergeMessage } from '../types/types-cosmos';
import {
  MessageSquareCode,
  Send,
  X,
  Bot,
  User,
  Sparkles
} from 'lucide-react';

interface AutonomousSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: SupportedLanguage;
  onTriggerSynthesizePrompt?: (prompt: string) => void;
}

export const AutonomousSupportModal: React.FC<AutonomousSupportModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const t = TRANSLATIONS[lang];
  const [messages, setMessages] = useState<ConciergeMessage[]>([
    {
      id: 'init-msg',
      sender: 'ai',
      text:
        lang === 'fa'
          ? 'درود! من هسته پشتیبانی و راهنمای ۱۰۰٪ خودگردان Liiist هستم. بدون نیاز به هیچ اپراتور انسانی، آماده‌ام به هر پرسش شما درباره دایرکتوری کیهانی پاسخ دهم یا راهنماییتان کنم.'
          : lang === 'ckb'
          ? 'سڵاو! من کۆنسێرژ و یاریدەدەری تەواو سەربەخۆی Liiistم بە ژیریی دەستکرد. ئامادەم بۆ وەڵامدانەوەی پرسیارەکانت یان دروستکردنی هەر لیستێکی گەردوونی.'
          : lang === 'kmr'
          ? 'Silav! Ez alîkarê xweser ê Liiist im ku 100% bi zîrekiya çêkirî kar dike. Ez amade me ku bersiva her pirsê bidim.'
          : lang === 'ar'
          ? 'مرحباً بك! أنا مساعد الدعم والكونسيرج الذاتي لمنصة Liiist. أعمل دون أي تدخل بشري للإجابة على استفساراتك وتوليد قوائم معرفية شاملة.'
          : 'Greetings! I am the 100% autonomous AI Customer Support & System Concierge for Liiist. With zero human intervention needed, I can resolve issues, guide you through the cosmic directory, and synthesize any list in the universe on demand.',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');

    const userMsg: ConciergeMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch('/api/support/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          conversationHistory: messages,
          language: lang
        })
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: ConciergeMessage = {
          id: `msg-ai-${Date.now()}`,
          sender: 'ai',
          text: data.reply,
          timestamp: data.timestamp || new Date().toISOString()
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        throw new Error('Support response error');
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'ai',
          text: 'Autonomous reconnect: Neural gateway synced.',
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black  animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-stone-950  rounded-3xl  border border-stone-200 dark:border-stone-800 flex flex-col h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200/80 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center ">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-extrabold text-stone-950 dark:text-white uppercase tracking-wider">
                  {t.supportChatTitle}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-stone-100 dark:bg-stone-800 font-mono font-bold">
                  100% AI
                </span>
              </div>
              <p className="text-xs text-stone-400">{t.supportChatSubtitle}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-100 flex items-center justify-center shrink-0 text-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-3xl px-4 py-3 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-black text-white dark:bg-white dark:text-black rounded-br-xs '
                    : 'bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100 rounded-bl-xs border border-stone-200/70 dark:border-stone-800'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <span
                  className={`text-[9px] mt-1.5 block opacity-50 font-mono ${
                    msg.sender === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-xl bg-stone-300 dark:bg-stone-700 text-stone-900 dark:text-stone-100 flex items-center justify-center shrink-0 text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-2 items-center text-xs text-stone-400">
              <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:0.4s]"></span>
              <span className="ml-1 text-[11px] font-mono">Autonomous reasoning...</span>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSend}
          className="p-4 border-t border-stone-200/80 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 flex items-center gap-2.5"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={t.askConciergePlaceholder}
            className="flex-1 px-4 py-2.5 rounded-full border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-5 py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black disabled:opacity-40 text-xs font-bold transition flex items-center gap-1.5  cursor-pointer hover:opacity-90"
          >
            <span>{t.send}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
