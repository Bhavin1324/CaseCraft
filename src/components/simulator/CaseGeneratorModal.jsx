import { useState } from 'react';
import {
  Sparkles,
  X,
  Stethoscope,
  Loader2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { useApi } from '../../context/ApiContext';
import { generateDynamicCase } from '../../services/geminiService';

const CATEGORIES = [
  { id: 'Gastrointestinal', name: 'Gastrointestinal & Dyspepsia', icon: '🍃' },
  { id: 'Respiratory', name: 'Respiratory, Cough & Asthma', icon: '🫁' },
  { id: 'Dermatological', name: 'Dermatological & Eczema/Skin', icon: '✨' },
  { id: 'Migraine', name: 'Migraine & Chronic Headaches', icon: '⚡' },
  { id: 'Pediatric', name: 'Pediatric, Teething & Colic', icon: '🍼' },
  { id: 'Psychiatric', name: 'Psychiatric, Grief & Health Panic', icon: '🧠' }
];

const DIFFICULTIES = [
  {
    id: 'Introductory - Easy',
    name: 'Easy (Forthcoming)',
    desc: 'Patient speaks openly, clear modalities once prompted.'
  },
  {
    id: 'Intermediate - Medium',
    name: 'Medium (Vague & Hesitant)',
    desc: 'Patient requires careful Organon Aphorism 84 follow-ups to unpack sensations.'
  },
  {
    id: 'Advanced - Hard',
    name: 'Hard (Emotionally Guarded)',
    desc: 'Patient is irritable or closed, tests doctor on avoiding leading questions.'
  }
];

export default function CaseGeneratorModal({
  isOpen,
  onClose,
  onCaseGenerated,
  curatedScenarios = [],
  onSelectCurated
}) {
  const { activeApiKey, provider, model, isConfigured, setIsSettingsOpen } = useApi();

  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[1].id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!isConfigured) {
      setError('Please configure your Gemini or OpenAI API Key in Settings first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newScenario = await generateDynamicCase({
        apiKey: activeApiKey,
        provider,
        model,
        category,
        difficulty
      });

      if (!newScenario || !newScenario.title) {
        throw new Error('Case generation returned incomplete data. Please try again.');
      }

      onCaseGenerated(newScenario);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to generate dynamic case.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/90 rounded-2xl w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/95 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Generate Dynamic Patient Case
              </h3>
              <p className="text-xs text-slate-400">
                Create infinite novel clinical cases with the Gemini Dual-Agent Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs text-slate-300">
          {!isConfigured && (
            <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl text-amber-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <p className="font-semibold">AI Key Needed for Infinite Generator</p>
                <p className="text-[11px] text-amber-300/80 mt-0.5">
                  You are currently in offline mode with pre-curated cases. Enter your free Google Gemini API key to unlock dynamic clinical generation.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setIsSettingsOpen(true);
                  }}
                  className="mt-2 px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-bold text-[10px] hover:bg-amber-400"
                >
                  Configure API Key Now
                </button>
              </div>
            </div>
          )}

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-2">
              Clinical Pathological Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 ${
                    category === c.id
                      ? 'bg-teal-950/50 border-teal-500 text-teal-200 font-bold'
                      : 'bg-slate-800/60 border-slate-700/70 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-base">{c.icon}</span>
                  <span className="truncate">{c.name.split('&')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Level */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-2">
              Clinical Difficulty & Patient Demeanor
            </label>
            <div className="space-y-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDifficulty(d.id)}
                  className={`w-full p-2.5 rounded-xl border text-left transition flex items-start justify-between ${
                    difficulty === d.id
                      ? 'bg-teal-950/50 border-teal-500 text-white font-medium'
                      : 'bg-slate-800/60 border-slate-700/70 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <span className="font-bold text-teal-300 block">{d.name}</span>
                    <span className="text-[11px] text-slate-400">{d.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-950/40 border border-rose-500/50 rounded-xl text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Select from Curated Archetypes */}
          {curatedScenarios && curatedScenarios.length > 0 && (
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                Or Quick-Select Classic Curated Archetypes:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {curatedScenarios.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      onSelectCurated(s.id);
                      onClose();
                    }}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left transition flex items-center justify-between"
                  >
                    <div className="truncate pr-2">
                      <p className="font-semibold text-slate-200 truncate">{s.title}</p>
                      <p className="text-[10px] text-slate-400">{s.difficulty}</p>
                    </div>
                    <Stethoscope className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/95 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <HelpCircle className="w-3.5 h-3.5 text-teal-400" />
            <span>AI generates hidden totality, modalities & miasm</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-300 hover:text-white px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading || !isConfigured}
              className="text-xs font-bold text-slate-950 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 px-4 py-2 rounded-xl shadow-lg shadow-teal-500/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Generating Case...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate AI Patient
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
