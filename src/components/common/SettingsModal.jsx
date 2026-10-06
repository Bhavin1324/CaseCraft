import { useState } from 'react';
import { Key, X, Shield, Trash2, Check } from 'lucide-react';
import { useApi } from '../../context/ApiContext';
import {
  testApiKey,
  DEFAULT_GEMINI_MODEL,
  DEFAULT_OPENAI_MODEL
} from '../../services/geminiService';
import ProviderSelector from './settings/ProviderSelector';
import ModelSelector from './settings/ModelSelector';
import ApiKeySection from './settings/ApiKeySection';

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

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Active stored key for the currently selected provider
  const configuredKey = localProvider === 'gemini' ? (geminiApiKey || '') : (openaiApiKey || '');

  // Current typed input
  const currentTypedKey = localProvider === 'gemini' ? newGeminiKey : newOpenaiKey;
  // Key to test: typed input takes precedence, otherwise test currently configured key
  const effectiveKeyToTest = currentTypedKey.trim() || configuredKey.trim();

  const handleProviderSelect = (newProv) => {
    setLocalProvider(newProv);
    setLocalModel(newProv === 'gemini' ? DEFAULT_GEMINI_MODEL : DEFAULT_OPENAI_MODEL);
    setTestResult(null);
  };

  const handleNewKeyChange = (val) => {
    if (localProvider === 'gemini') {
      setNewGeminiKey(val);
    } else {
      setNewOpenaiKey(val);
    }
  };

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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border-t sm:border border-slate-700/80 rounded-t-3xl sm:rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[92dvh] sm:max-h-[88vh] animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 duration-200">
        {/* Mobile Drag Indicator Pill */}
        <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />

        {/* Header */}
        <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300 shrink-0">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                AI Engine &amp; API Settings
                <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Client-Side
                </span>
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400">Configure Google Gemini or OpenAI</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Settings"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable with overscroll containment) */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto overscroll-contain text-xs text-slate-300 flex-1">
          <ProviderSelector
            selectedProvider={localProvider}
            onSelectProvider={handleProviderSelect}
          />

          <ModelSelector
            provider={localProvider}
            selectedModel={localModel}
            onSelectModel={setLocalModel}
          />

          <ApiKeySection
            provider={localProvider}
            configuredKey={configuredKey}
            newKey={localProvider === 'gemini' ? newGeminiKey : newOpenaiKey}
            onNewKeyChange={handleNewKeyChange}
            onRemoveActiveKey={handleRemoveActiveKey}
            onTestConnection={handleTestConnection}
            testing={testing}
            testResult={testResult}
          />

          {/* Privacy & Security Note */}
          <div className="p-3 bg-slate-850/80 border border-slate-700/60 rounded-xl flex items-start gap-2.5 text-[11px] text-slate-400">
            <Shield className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>100% Client-Side Privacy:</strong> Your keys are stored exclusively in your browser&apos;s localStorage and are never sent to any intermediary server.
            </p>
          </div>
        </div>

        {/* Footer Actions (Optimized for Thumb-Zone & Safe-Area) */}
        <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-900/95 shrink-0 flex flex-col gap-2 pb-[max(env(safe-area-inset-bottom),0.875rem)]">
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-3 px-4 text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 rounded-xl shadow-lg shadow-teal-500/20 transition flex items-center justify-center gap-2 cursor-pointer min-h-[48px] active:scale-[0.99]"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Save &amp; Connect AI Engine</span>
          </button>

          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 py-2 px-2.5 rounded-lg hover:bg-rose-950/30 transition cursor-pointer min-h-[40px]"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Keys</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-300 hover:text-white px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition cursor-pointer min-h-[40px]"
            >
              Cancel
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
