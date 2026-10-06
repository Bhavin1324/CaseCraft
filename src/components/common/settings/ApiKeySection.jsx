import { useState } from 'react';
import {
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Loader2,
  Trash2,
  Lock
} from 'lucide-react';
import { maskKey } from '../../../services/geminiService';

export default function ApiKeySection({
  provider,
  configuredKey,
  newKey,
  onNewKeyChange,
  onRemoveActiveKey,
  onTestConnection,
  testing,
  testResult
}) {
  const [showKey, setShowKey] = useState(false);

  const hasConfiguredKey = Boolean(configuredKey && configuredKey.trim().length > 0);
  const currentTypedKey = newKey.trim();
  const effectiveKeyToTest = currentTypedKey || (configuredKey ? configuredKey.trim() : '');

  return (
    <div className="space-y-4">
      {/* Configured Key Status Banner */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
          Active Key Status
        </label>
        {hasConfiguredKey ? (
          <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0 w-full sm:w-auto">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-emerald-300">
                    {provider === 'gemini' ? 'Gemini' : 'OpenAI'} Active
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono flex items-center gap-0.5">
                    <Lock className="w-2.5 h-2.5" /> Saved
                  </span>
                </div>
                <p className="font-mono text-xs text-slate-300 tracking-wider truncate mt-0.5">
                  {maskKey(configuredKey)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onRemoveActiveKey}
              title="Remove this key and switch to offline mode"
              className="w-full sm:w-auto px-3 py-1.5 rounded-lg border border-rose-500/40 text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer shrink-0 min-h-[38px]"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Key</span>
            </button>
          </div>
        ) : (
          <div className="p-3 bg-slate-800/40 border border-slate-700/60 rounded-xl flex items-start sm:items-center gap-2.5 text-slate-400">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
            <div className="text-[11px] leading-relaxed">
              <span className="font-medium text-slate-300">No active key configured.</span>{' '}
              <span className="text-slate-400">
                Simulator will run in offline mode. Paste a key below for live AI responses.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* API Key Input Field */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
          <label className="font-semibold text-slate-300 text-xs">
            {hasConfiguredKey
              ? 'Replace Configured Key (Optional)'
              : provider === 'gemini'
              ? 'Google Gemini API Key'
              : 'OpenAI API Key'}
          </label>
          {provider === 'gemini' && (
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 hover:text-teal-300 flex items-center gap-1 text-[11px] underline"
            >
              Get free key from Google AI Studio
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        <div className="relative">
          <input
            type={showKey ? 'text' : 'password'}
            value={newKey}
            onChange={(e) => onNewKeyChange(e.target.value)}
            placeholder={
              hasConfiguredKey
                ? 'Paste new key here to replace active key...'
                : provider === 'gemini'
                ? 'Paste Gemini key (AIzaSy...)'
                : 'Paste OpenAI key (sk-...)'
            }
            autoComplete="off"
            spellCheck="false"
            className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-3.5 pr-12 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 font-mono focus:ring-1 focus:ring-teal-500 focus:outline-none min-h-[44px]"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            title={showKey ? 'Hide key input' : 'Show key input'}
            className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-2.5 cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 leading-normal">
          {hasConfiguredKey
            ? 'Leave blank to retain current active key.'
            : 'Key is securely saved in your browser localStorage.'}
        </p>
      </div>

      {/* Test Connection Button & Result */}
      <div className="pt-1">
        <button
          type="button"
          onClick={onTestConnection}
          disabled={testing || !effectiveKeyToTest}
          className="w-full py-3 px-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 border border-slate-700 rounded-xl font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
        >
          {testing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
              Testing API Connectivity...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-teal-400" />
              {currentTypedKey
                ? 'Test New API Key'
                : hasConfiguredKey
                ? 'Test Active Key Connection'
                : 'Test API Connection'}
            </>
          )}
        </button>

        {testResult && (
          <div
            className={`mt-2 p-3 rounded-xl border text-xs flex items-start gap-2 animate-in fade-in ${
              testResult.success
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
            }`}
          >
            {testResult.success ? (
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            )}
            <span className="leading-relaxed">{testResult.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
