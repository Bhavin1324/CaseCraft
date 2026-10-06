import { useState } from 'react';
import {
  Sparkles,
  X,
  Stethoscope,
  Loader2,
  AlertCircle,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { useApi } from '../../context/ApiContext';
import { generateDynamicCase } from '../../services/geminiService';

const CATEGORIES = [
  { id: 'Gastrointestinal', name: 'Gastrointestinal & Dyspepsia', icon: '🍃' },
  { id: 'Respiratory', name: 'Respiratory & Asthma', icon: '🫁' },
  { id: 'Dermatological', name: 'Dermatological & Skin', icon: '✨' },
  { id: 'Migraine', name: 'Migraine & Headaches', icon: '⚡' },
  { id: 'Pediatric', name: 'Pediatric & Colic', icon: '🍼' },
  { id: 'Psychiatric', name: 'Psychiatric & Panic', icon: '🧠' }
];

const DIFFICULTIES = [
  {
    id: 'Introductory - Easy',
    name: 'Easy',
    fullTitle: 'Easy (Forthcoming)',
    desc: 'Patient speaks openly, clear modalities once prompted.'
  },
  {
    id: 'Intermediate - Medium',
    name: 'Medium',
    fullTitle: 'Medium (Vague & Hesitant)',
    desc: 'Patient requires careful Organon Aphorism 84 follow-ups to unpack sensations.'
  },
  {
    id: 'Advanced - Hard',
    name: 'Hard',
    fullTitle: 'Hard (Guarded)',
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

  const activeDifficultyObj = DIFFICULTIES.find((d) => d.id === difficulty) || DIFFICULTIES[1];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-xs p-0 sm:p-4 overflow-hidden animate-in fade-in duration-200">
      <div className="bg-slate-900 border-t sm:border border-slate-700/90 rounded-t-3xl sm:rounded-2xl w-full max-w-xl shadow-2xl flex flex-col max-h-[92dvh] sm:max-h-[88vh] overflow-hidden animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 duration-200">
        {/* Mobile Drag Indicator Pill */}
        <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />

        {/* Header */}
        <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-slate-800 bg-slate-900/95 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 truncate">
                Generate Patient Case
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                Simulate infinite unique classical homeopathic consultations
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Case Generator"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body (Scrollable with overscroll containment) */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto overscroll-contain text-xs text-slate-300 flex-1">
          {!isConfigured && (
            <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl text-amber-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-xs">AI Key Needed for Live Generation</p>
                <p className="text-[11px] text-amber-300/80 mt-0.5 leading-relaxed">
                  Enter your free Google Gemini API key to unlock dynamic clinical generation across all domains.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setIsSettingsOpen(true);
                  }}
                  className="mt-2 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 cursor-pointer min-h-[36px] flex items-center gap-1"
                >
                  Configure API Key Now
                </button>
              </div>
            </div>
          )}

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-2">
              Pathological Domain
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 cursor-pointer min-h-[50px] ${
                    category === c.id
                      ? 'bg-teal-950/60 border-teal-500 text-teal-200 font-bold ring-1 ring-teal-500/50 shadow-md shadow-teal-950/40'
                      : 'bg-slate-800/60 border-slate-700/70 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span className="text-lg shrink-0">{c.icon}</span>
                  <span className="truncate text-xs">{c.name.split('&')[0].trim()}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Level: Segmented 3-tab pill selector (drastically saves vertical space on mobile) */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5">
              Clinical Difficulty &amp; Demeanor
            </label>
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-800/80 border border-slate-700/80 rounded-xl">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDifficulty(d.id)}
                  className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition cursor-pointer min-h-[38px] flex items-center justify-center ${
                    difficulty === d.id
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  {d.name}
                </button>
              ))}
            </div>
            <div className="mt-2 p-2.5 bg-slate-850/80 border border-slate-750 rounded-xl text-[11px] text-slate-300">
              <strong className="text-teal-300 block mb-0.5">{activeDifficultyObj.fullTitle}:</strong>
              {activeDifficultyObj.desc}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-950/40 border border-rose-500/50 rounded-xl text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* Quick Select from Curated Archetypes */}
          {curatedScenarios && curatedScenarios.length > 0 && (
            <div className="pt-2 border-t border-slate-800">
              <span className="text-xs font-semibold text-slate-300 block mb-2">
                Or Quick-Select Curated Classical Cases:
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
                    className="p-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/70 text-left transition flex items-center justify-between cursor-pointer min-h-[48px]"
                  >
                    <div className="truncate pr-2">
                      <p className="font-semibold text-slate-200 text-xs truncate">{s.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{s.difficulty || 'Classical Case'}</p>
                    </div>
                    <Stethoscope className="w-4 h-4 text-teal-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer (Thumb-Zone & Safe-Area Insets) */}
        <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-900/95 shrink-0 flex flex-col gap-2 pb-[max(env(safe-area-inset-bottom),0.875rem)]">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !isConfigured}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition cursor-pointer min-h-[48px] active:scale-[0.99]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Synthesizing Dynamic Case...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Clinical Case</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span className="flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-teal-400" />
              Generates hidden totality &amp; modalities
            </span>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-300 hover:text-white px-3 py-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
