import { useState } from 'react';
import {
  Key,
  X,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Shield,
  Loader2,
  Trash2,
  Lock
} from 'lucide-react';
import { useApi } from '../../context/ApiContext';
import {
  testApiKey,
  DEFAULT_GEMINI_MODEL,
  DEFAULT_OPENAI_MODEL,
  maskKey
} from '../../services/geminiService';

function SettingsModalContent({ onClose }) {
  const {
    geminiApiKey,
    openaiApiKey,
    provider,
    model,
    saveSettings,
    clearSettings,
    notify
  } = useApi();

  const [localProvider, setLocalProvider] = useState(provider);
  const [localModel, setLocalModel] = useState(model);

  // New keys entered by user in this session (NEVER pre-filled with raw secret keys)
  const [newGeminiKey, setNewGeminiKey] = useState('');
  const [newOpenaiKey, setNewOpenaiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null); // { success: boolean, message: string }

  // Active stored key for the currently selected provider
  const configuredKey = localProvider === 'gemini' ? (geminiApiKey || '') : (openaiApiKey || '');
  const hasConfiguredKey = Boolean(configuredKey && configuredKey.trim().length > 0);

  // Current typed input
  const currentTypedKey = localProvider === 'gemini' ? newGeminiKey : newOpenaiKey;
  // Key to test: typed input takes precedence, otherwise test currently configured key
  const effectiveKeyToTest = currentTypedKey.trim() || configuredKey.trim();

  const handleTestConnection = async () => {
    if (!effectiveKeyToTest) {
      setTestResult({
        success: false,
        message: 'Please paste or enter an API key to test connectivity.'
      });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const res = await testApiKey({
        apiKey: effectiveKeyToTest,
        provider: localProvider,
        model: localModel
      });

      if (res.activeModel && res.activeModel !== localModel) {
        setLocalModel(res.activeModel);
      }

      setTestResult({
        success: true,
        message: currentTypedKey.trim()
          ? `Verified! New ${localProvider === 'gemini' ? 'Gemini' : 'OpenAI'} API key is valid and connected.`
          : res.message || 'Configured API key verified successfully.'
      });
    } catch (err) {
      setTestResult({
        success: false,
        message: err.message || 'Connection test failed. Please verify your key.'
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    const trimmedGemini = newGeminiKey.trim();
    const trimmedOpenai = newOpenaiKey.trim();

    saveSettings({
      geminiKey: trimmedGemini !== '' ? trimmedGemini : undefined,
      openaiKey: trimmedOpenai !== '' ? trimmedOpenai : undefined,
      selectedProvider: localProvider,
      selectedModel: localModel
    });

    const hasAnyActiveKey =
      (trimmedGemini || geminiApiKey) || (trimmedOpenai || openaiApiKey);

    notify(
      hasAnyActiveKey
        ? 'AI credentials and engine settings saved!'
        : 'Running in offline simulation mode.',
      'success'
    );
    onClose();
  };

  const handleRemoveActiveKey = () => {
    const providerName = localProvider === 'gemini' ? 'Google Gemini' : 'OpenAI';
    if (confirm(`Remove active ${providerName} key and switch to offline mode?`)) {
      if (localProvider === 'gemini') {
        saveSettings({ geminiKey: '', selectedProvider: 'gemini' });
        setNewGeminiKey('');
      } else {
        saveSettings({ openaiKey: '', selectedProvider: 'openai' });
        setNewOpenaiKey('');
      }
      setTestResult(null);
      notify(`${providerName} key removed. Simulator is in offline mode.`, 'info');
    }
  };

  const handleClearAll = () => {
    if (confirm('Clear all saved API credentials and return to offline simulation mode?')) {
      clearSettings();
      setNewGeminiKey('');
      setNewOpenaiKey('');
      setTestResult(null);
      notify('All API keys cleared. Simulator is in offline mode.', 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                AI Engine & API Settings
                <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Client-Side Only
                </span>
              </h3>
              <p className="text-xs text-slate-400">Configure Google Gemini or OpenAI for live case roleplay</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs text-slate-300">
          {/* Provider Tabs */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select AI Provider
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setLocalProvider('gemini');
                  setLocalModel(DEFAULT_GEMINI_MODEL);
                  setTestResult(null);
                }}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition cursor-pointer ${
                  localProvider === 'gemini'
                    ? 'bg-teal-950/40 border-teal-500 text-white ring-1 ring-teal-500/50'
                    : 'bg-slate-800/60 border-slate-700/70 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-teal-300">Google Gemini (Recommended)</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Free tier with Google AI Studio</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLocalProvider('openai');
                  setLocalModel(DEFAULT_OPENAI_MODEL);
                  setTestResult(null);
                }}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition cursor-pointer ${
                  localProvider === 'openai'
                    ? 'bg-emerald-950/40 border-emerald-500 text-white ring-1 ring-emerald-500/50'
                    : 'bg-slate-800/60 border-slate-700/70 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">
                  AI
                </div>
                <div>
                  <p className="font-bold text-slate-200">OpenAI Fallback</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">GPT-4o-mini / GPT-4o</p>
                </div>
              </button>
            </div>
          </div>

          {/* Model Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Select Model
            </label>
            <select
              value={localModel}
              onChange={(e) => setLocalModel(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none cursor-pointer"
            >
              {localProvider === 'gemini' ? (
                <>
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (Recommended Free Tier Default)</option>
                  <option value="gemini-2.0-flash">Gemini 2.0 Flash (Next-Gen High Performance)</option>
                  <option value="gemini-1.5-flash-8b">Gemini 1.5 Flash 8B (Ultra-Lightweight)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Clinical Reasoning)</option>
                  <option value="gemini-flash-lite-latest">Gemini Flash Lite Latest</option>
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                </>
              ) : (
                <>
                  <option value="gpt-4o-mini">GPT-4o-mini (Cost-effective & fast)</option>
                  <option value="gpt-4o">GPT-4o (Most capable)</option>
                </>
              )}
            </select>
          </div>

          {/* Configured Key Status Banner */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Active Key Status
            </label>
            {hasConfiguredKey ? (
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-emerald-300">
                        {localProvider === 'gemini' ? 'Gemini' : 'OpenAI'} Key Configured
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono flex items-center gap-0.5">
                        <Lock className="w-2.5 h-2.5" /> Protected
                      </span>
                    </div>
                    <p className="font-mono text-[11px] text-slate-300 tracking-wider truncate mt-0.5">
                      {maskKey(configuredKey)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveActiveKey}
                  title="Remove this key and switch to offline mode"
                  className="px-2.5 py-1.5 rounded-lg border border-rose-500/40 text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 text-[11px] font-medium flex items-center gap-1 transition cursor-pointer shrink-0"
                >
                  <Trash2 className="w-3 h-3" />
                  Remove
                </button>
              </div>
            ) : (
              <div className="p-3 bg-slate-800/40 border border-slate-700/60 rounded-xl flex items-center gap-2.5 text-slate-400">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="text-[11px]">
                  <span className="font-medium text-slate-300">No active key configured.</span>{' '}
                  <span className="text-slate-400">
                    Simulator will run in offline heuristic mode. Paste a key below to enable live AI responses.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* API Key Input Field (Always Blank by Default - Never displays raw key) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-300">
                {hasConfiguredKey
                  ? 'Replace Configured Key (Optional)'
                  : localProvider === 'gemini'
                  ? 'Google Gemini API Key'
                  : 'OpenAI API Key'}
              </label>
              {localProvider === 'gemini' && (
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
                value={localProvider === 'gemini' ? newGeminiKey : newOpenaiKey}
                onChange={(e) =>
                  localProvider === 'gemini'
                    ? setNewGeminiKey(e.target.value)
                    : setNewOpenaiKey(e.target.value)
                }
                placeholder={
                  hasConfiguredKey
                    ? 'Paste new key here to replace active key...'
                    : localProvider === 'gemini'
                    ? 'Paste your Gemini key here (AIzaSy...)'
                    : 'Paste your OpenAI key here (sk-...)'
                }
                autoComplete="off"
                spellCheck="false"
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-slate-100 placeholder-slate-500 font-mono focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                title={showKey ? 'Hide key input' : 'Show key input'}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
              >
                {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {hasConfiguredKey
                ? 'Leave this field blank to keep your current active key.'
                : 'Key will be saved locally on your device in browser storage.'}
            </p>
          </div>

          {/* Test Connection Button & Result */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing || !effectiveKeyToTest}
              className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 border border-slate-700 rounded-xl font-medium transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {testing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-400" />
                  Testing API Connectivity...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  {currentTypedKey.trim()
                    ? 'Test New API Key'
                    : hasConfiguredKey
                    ? 'Test Active Key Connection'
                    : 'Test API Connection'}
                </>
              )}
            </button>

            {testResult && (
              <div
                className={`mt-2 p-2.5 rounded-xl border text-xs flex items-start gap-2 animate-in fade-in ${
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

          {/* Privacy & Security Note */}
          <div className="p-3 bg-slate-800/40 border border-slate-700/60 rounded-xl flex items-start gap-2.5 text-[11px] text-slate-400">
            <Shield className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <p>
              <strong>100% Client-Side Privacy:</strong> Your key is stored exclusively in your browser&apos;s local storage and is never displayed in plaintext in the input field. Requests are sent directly to Google or OpenAI from your device without any backend intermediary.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 py-1.5 px-2 rounded-lg hover:bg-rose-950/30 transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All Keys
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-300 hover:text-white px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="text-xs font-bold text-slate-950 bg-teal-500 hover:bg-teal-400 px-4 py-2 rounded-xl shadow-lg shadow-teal-500/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              Save & Connect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsModal() {
  const { isSettingsOpen, setIsSettingsOpen } = useApi();

  if (!isSettingsOpen) return null;

  return <SettingsModalContent onClose={() => setIsSettingsOpen(false)} />;
}
