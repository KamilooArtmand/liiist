import React, { useState } from 'react';
import { ListGroup } from '../types';
import { exportListAsMarkdown, exportListAsPlainText } from '../utils/helpers';
import { X, Copy, Check, Download, FileText, Code } from 'lucide-react';

interface ExportModalProps {
  list: ListGroup | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ list, isOpen, onClose }) => {
  const [format, setFormat] = useState<'markdown' | 'text' | 'json'>('markdown');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !list) return null;

  let exportContent = '';
  let fileName = `${list.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  if (format === 'markdown') {
    exportContent = exportListAsMarkdown(list);
    fileName += '.md';
  } else if (format === 'text') {
    exportContent = exportListAsPlainText(list);
    fileName += '.txt';
  } else {
    exportContent = JSON.stringify(list, null, 2);
    fileName += '.json';
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(exportContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([exportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white/95 dark:bg-stone-950/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200/80 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">{list.icon}</span>
            <div>
              <h2 className="text-base font-extrabold text-stone-950 dark:text-white">
                Export "{list.title}"
              </h2>
              <p className="text-xs text-stone-400">Copy or save file to your local machine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Format Selector */}
        <div className="flex items-center gap-2 px-6 pt-3.5 border-b border-stone-200/80 dark:border-stone-800 pb-3">
          <button
            type="button"
            onClick={() => setFormat('markdown')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              format === 'markdown'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Markdown (.md)
          </button>
          <button
            type="button"
            onClick={() => setFormat('text')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              format === 'text'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Plain Text (.txt)
          </button>
          <button
            type="button"
            onClick={() => setFormat('json')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              format === 'json'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Code className="w-3.5 h-3.5" /> JSON Data
          </button>
        </div>

        {/* Content Preview */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs text-stone-800 dark:text-stone-200 bg-stone-50 dark:bg-stone-900/60">
          <pre className="whitespace-pre-wrap select-all font-mono leading-relaxed">
            {exportContent}
          </pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-200/80 dark:border-stone-800 flex items-center justify-between bg-stone-50/60 dark:bg-stone-900/60">
          <span className="text-xs text-stone-400 font-mono">
            {list.items.length} items
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-2 text-xs font-bold flex items-center gap-1.5 border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full text-stone-700 dark:text-stone-300 transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-2 text-xs font-bold flex items-center gap-1.5 bg-black text-white dark:bg-white dark:text-black hover:opacity-90 rounded-full shadow-xs transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
