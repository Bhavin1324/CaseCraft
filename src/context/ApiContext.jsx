import { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_GEMINI_MODEL, DEFAULT_OPENAI_MODEL, maskKey } from '../services/geminiService';

const ApiContext = createContext(null);

const STORAGE_KEYS = {
  GEMINI_KEY: 'casecraft_gemini_api_key',
  OPENAI_KEY: 'casecraft_openai_api_key',
  PROVIDER: 'casecraft_api_provider',
  MODEL: 'casecraft_ai_model',
  CLEARED_FLAG: 'casecraft_api_key_cleared'
};

const LEGACY_STORAGE_KEYS = {
  GEMINI_KEY: 'similia_gemini_api_key',
  OPENAI_KEY: 'similia_openai_api_key',
  PROVIDER: 'similia_api_provider',
  MODEL: 'similia_ai_model',
  CLEARED_FLAG: 'similia_api_key_cleared'
};

// Helper: read new key first, fallback to legacy key and auto-migrate
const getStoredValue = (newKey, legacyKey) => {
  try {
    const current = localStorage.getItem(newKey);
    if (current !== null) return current;
    const legacy = localStorage.getItem(legacyKey);
    if (legacy !== null) {
      localStorage.setItem(newKey, legacy);
      return legacy;
    }
  } catch {
    // Graceful fallback if localStorage is unavailable
  }
  return null;
};

export function ApiProvider({ children }) {
  // Check if user explicitly cleared their keys
  const isExplicitlyCleared = () => {
    try {
      return (
        localStorage.getItem(STORAGE_KEYS.CLEARED_FLAG) === 'true' ||
        localStorage.getItem(LEGACY_STORAGE_KEYS.CLEARED_FLAG) === 'true'
      );
    } catch {
      return false;
    }
  };

  // Load initial values from localStorage or Vite environment variables
  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    const fromStorage = getStoredValue(STORAGE_KEYS.GEMINI_KEY, LEGACY_STORAGE_KEYS.GEMINI_KEY);
    if (fromStorage) return fromStorage;
    if (isExplicitlyCleared()) return '';
    return import.meta.env.VITE_GEMINI_API_KEY || '';
  });

  const [openaiApiKey, setOpenaiApiKey] = useState(() => {
    const fromStorage = getStoredValue(STORAGE_KEYS.OPENAI_KEY, LEGACY_STORAGE_KEYS.OPENAI_KEY);
    if (fromStorage) return fromStorage;
    if (isExplicitlyCleared()) return '';
    return import.meta.env.VITE_OPENAI_API_KEY || '';
  });

  const [provider, setProvider] = useState(() => {
    return (
      getStoredValue(STORAGE_KEYS.PROVIDER, LEGACY_STORAGE_KEYS.PROVIDER) || 'gemini'
    );
  });

  const [model, setModel] = useState(() => {
    const saved = getStoredValue(STORAGE_KEYS.MODEL, LEGACY_STORAGE_KEYS.MODEL);
    if (!saved || saved === 'gemini-2.5-flash') return DEFAULT_GEMINI_MODEL;
    return saved;
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [globalNotice, setGlobalNotice] = useState(null);

  // Synchronize user-saved keys with localStorage (only if user provided them)
  useEffect(() => {
    try {
      if (geminiApiKey) {
        localStorage.setItem(STORAGE_KEYS.GEMINI_KEY, geminiApiKey);
        localStorage.removeItem(STORAGE_KEYS.CLEARED_FLAG);
        localStorage.removeItem(LEGACY_STORAGE_KEYS.CLEARED_FLAG);
      } else {
        localStorage.removeItem(STORAGE_KEYS.GEMINI_KEY);
        localStorage.removeItem(LEGACY_STORAGE_KEYS.GEMINI_KEY);
      }
    } catch {
      // ignore storage write errors
    }
  }, [geminiApiKey]);

  useEffect(() => {
    try {
      if (openaiApiKey) {
        localStorage.setItem(STORAGE_KEYS.OPENAI_KEY, openaiApiKey);
        localStorage.removeItem(STORAGE_KEYS.CLEARED_FLAG);
        localStorage.removeItem(LEGACY_STORAGE_KEYS.CLEARED_FLAG);
      } else {
        localStorage.removeItem(STORAGE_KEYS.OPENAI_KEY);
        localStorage.removeItem(LEGACY_STORAGE_KEYS.OPENAI_KEY);
      }
    } catch {
      // ignore storage write errors
    }
  }, [openaiApiKey]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROVIDER, provider);
    } catch {
      // ignore storage write errors
    }
  }, [provider]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MODEL, model);
    } catch {
      // ignore storage write errors
    }
  }, [model]);

  const activeApiKey = provider === 'gemini' ? geminiApiKey : openaiApiKey;
  const isConfigured = Boolean(activeApiKey && activeApiKey.trim().length > 0);

  const saveSettings = ({
    geminiKey,
    openaiKey,
    selectedProvider,
    selectedModel
  }) => {
    try {
      localStorage.removeItem(STORAGE_KEYS.CLEARED_FLAG);
      localStorage.removeItem(LEGACY_STORAGE_KEYS.CLEARED_FLAG);
    } catch {
      // ignore storage write errors
    }
    if (geminiKey !== undefined) setGeminiApiKey(geminiKey.trim());
    if (openaiKey !== undefined) setOpenaiApiKey(openaiKey.trim());
    if (selectedProvider) setProvider(selectedProvider);
    if (selectedModel) setModel(selectedModel);
  };

  const clearSettings = () => {
    try {
      localStorage.setItem(STORAGE_KEYS.CLEARED_FLAG, 'true');
      localStorage.removeItem(STORAGE_KEYS.GEMINI_KEY);
      localStorage.removeItem(STORAGE_KEYS.OPENAI_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEYS.GEMINI_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEYS.OPENAI_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEYS.CLEARED_FLAG);
    } catch {
      // ignore storage write errors
    }
    setGeminiApiKey('');
    setOpenaiApiKey('');
    setProvider('gemini');
    setModel(DEFAULT_GEMINI_MODEL);
  };

  const notify = (message, type = 'info') => {
    setGlobalNotice({ message, type, id: Date.now() });
  };

  const dismissNotice = () => {
    setGlobalNotice(null);
  };

  return (
    <ApiContext.Provider
      value={{
        geminiApiKey,
        openaiApiKey,
        activeApiKey,
        provider,
        model,
        isConfigured,
        isSettingsOpen,
        setIsSettingsOpen,
        saveSettings,
        clearSettings,
        globalNotice,
        notify,
        dismissNotice,
        maskKey,
        defaultGeminiModel: DEFAULT_GEMINI_MODEL,
        defaultOpenaiModel: DEFAULT_OPENAI_MODEL
      }}
    >
      {children}
    </ApiContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApi() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
}
