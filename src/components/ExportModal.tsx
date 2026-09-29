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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">{list.icon}</span>
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Export "{list.title}"
              </h2>
              <p className="text-xs text-stone-500">Copy or save to your local machine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-stone-100 dark:border-stone-800 pb-3">
          <button
            type="button"
            onClick={() => setFormat('markdown')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              format === 'markdown'
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200'
                : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Markdown (.md)
          </button>
          <button
            type="button"
            onClick={() => setFormat('text')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              format === 'text'
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200'
                : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Plain Text (.txt)
          </button>
          <button
            type="button"
            onClick={() => setFormat('json')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              format === 'json'
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200'
                : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Code className="w-3.5 h-3.5" /> JSON Data
          </button>
        </div>

        {/* Content Preview */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs text-stone-800 dark:text-stone-200 bg-stone-50 dark:bg-stone-950/50">
          <pre className="whitespace-pre-wrap select-all font-mono leading-relaxed">
            {exportContent}
          </pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between bg-white dark:bg-stone-900">
          <span className="text-xs text-stone-400">
            {list.items.length} item{list.items.length !== 1 ? 's' : ''} ready to export
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-2 text-xs font-semibold flex items-center gap-1.5 border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl text-stone-700 dark:text-stone-300 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy to Clipboard
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-2 text-xs font-semibold flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs transition"
            >
              <Download className="w-3.5 h-3.5" /> Download File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
