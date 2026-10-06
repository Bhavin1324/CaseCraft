import { Sparkles } from 'lucide-react';

export default function ProviderSelector({ selectedProvider, onSelectProvider }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
        Select AI Provider
      </label>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onSelectProvider('gemini')}
          className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition cursor-pointer min-h-[56px] ${
            selectedProvider === 'gemini'
              ? 'bg-teal-950/50 border-teal-500 text-white ring-1 ring-teal-500/50 shadow-md shadow-teal-950/40'
              : 'bg-slate-800/60 border-slate-700/70 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="font-bold text-teal-300 text-xs truncate">Google Gemini</p>
            <p className="text-[10px] text-slate-400 mt-0.5 truncate">Free tier default</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelectProvider('openai')}
          className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition cursor-pointer min-h-[56px] ${
            selectedProvider === 'openai'
              ? 'bg-emerald-950/50 border-emerald-500 text-white ring-1 ring-emerald-500/50 shadow-md shadow-emerald-950/40'
              : 'bg-slate-800/60 border-slate-700/70 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">
            AI
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-200 text-xs truncate">OpenAI</p>
            <p className="text-[10px] text-slate-400 mt-0.5 truncate">GPT-4o / mini</p>
          </div>
        </button>
      </div>
    </div>
  );
}
