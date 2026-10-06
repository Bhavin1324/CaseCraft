import { FileText, X } from 'lucide-react';

export default function MobileDrawer({ isOpen, onClose, title = 'Case Notes & Proctor', children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 xl:hidden flex animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <div className="relative ml-auto w-full max-w-md bg-slate-900 border-l border-slate-800 flex flex-col h-full shadow-2xl z-10 overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header with Safe Area Top Inset */}
        <div className="flex items-center justify-between px-4 pt-[max(env(safe-area-inset-top),0.75rem)] pb-3 border-b border-slate-800 bg-slate-850 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-white uppercase tracking-wider truncate">
              {title}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content (Scrollable with Safe Area Bottom Inset) */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4 pb-[max(env(safe-area-inset-bottom),1.25rem)]">
          {children}
        </div>
      </div>
    </div>
  );
}
