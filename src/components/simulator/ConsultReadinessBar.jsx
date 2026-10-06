import { useMemo } from 'react';
import {
  Sparkles,
  CheckCircle,
  Clock,
  Pill,
  Thermometer,
  Brain,
  Layers,
  Activity,
  RotateCcw
} from 'lucide-react';

const PILLAR_PROMPTS = {
  lsmc: 'Could you describe the exact sensation and where the discomfort spreads?',
  modalities: 'What conditions, times of day, or positions make your symptoms distinctly worse or better?',
  generals: 'How do you react to cold or warm weather, and what is your thirst pattern like?',
  mind: 'How has this illness been affecting your mood, patience, or temper?'
};

export default function ConsultReadinessBar({
  probedCategories = {},
  onOpenPrescribe,
  onInsertProbe,
  isSessionRestored = false,
  onResetCase
}) {
  // Calculate 4-pillar Hahnemannian totality completion
  const { score, pillars, guidance } = useMemo(() => {
    const p1 = Boolean(probedCategories.lsmc);
    const p2 = Boolean(probedCategories.modalities);
    const p3 = Boolean(probedCategories.thermal || probedCategories.thirst);
    const p4 = Boolean(probedCategories.mind);

    let count = 0;
    if (p1) count += 1;
    if (p2) count += 1;
    if (p3) count += 1;
    if (p4) count += 1;

    const totalPct = count * 25;

    let tip;
    if (!p1) {
      tip = 'Tip: Ask where the symptom is located and what it feels like (LSMC).';
    } else if (!p2) {
      tip = 'Tip: Ask what aggravates (<) or relieves (>) the symptoms.';
    } else if (!p3) {
      tip = 'Tip: Inquire into Thermals (Chilly vs Hot) and Thirst pattern.';
    } else if (!p4) {
      tip = 'Tip: Explore Mental Generals (temperament under stress, reaction to consolation).';
    } else {
      tip = 'Clinical totality complete! You have sufficient individualizing keynotes to prescribe.';
    }

    return {
      score: totalPct,
      guidance: tip,
      pillars: [
        {
          id: 'lsmc',
          label: 'LSMC Sensation',
          done: p1,
          icon: <Layers className="w-3 h-3" />,
          prompt: PILLAR_PROMPTS.lsmc
        },
        {
          id: 'modalities',
          label: 'Modalities (< / >)',
          done: p2,
          icon: <Activity className="w-3 h-3" />,
          prompt: PILLAR_PROMPTS.modalities
        },
        {
          id: 'generals',
          label: 'Thermals & Thirst',
          done: p3,
          icon: <Thermometer className="w-3 h-3" />,
          prompt: PILLAR_PROMPTS.generals
        },
        {
          id: 'mind',
          label: 'Mental Generals',
          done: p4,
          icon: <Brain className="w-3 h-3" />,
          prompt: PILLAR_PROMPTS.mind
        }
      ]
    };
  }, [probedCategories]);

  const isReady = score >= 75;

  return (
    <div className="bg-slate-900/95 border-b border-slate-800 px-3 py-2 sm:px-4 sm:py-2.5 backdrop-blur-md shrink-0 space-y-2">
      {/* Top Row: Totality Readiness Meter & Action Button */}
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className={`w-2 h-2 rounded-full ${
                isReady
                  ? 'bg-emerald-400 animate-ping'
                  : score >= 50
                  ? 'bg-teal-400'
                  : 'bg-amber-400'
              }`}
            />
            <span className="text-[11px] sm:text-xs font-bold text-white tracking-tight">
              Totality Readiness:
            </span>
            <span
              className={`font-mono text-xs font-black ${
                isReady
                  ? 'text-emerald-400'
                  : score >= 50
                  ? 'text-teal-400'
                  : 'text-amber-400'
              }`}
            >
              {score}%
            </span>
          </div>

          {/* Progress Bar Track */}
          <div className="hidden sm:block flex-1 max-w-xs h-2 rounded-full bg-slate-800 overflow-hidden border border-slate-700/60">
            <div
              className={`h-full transition-all duration-700 rounded-full ${
                isReady
                  ? 'bg-gradient-to-r from-teal-400 to-emerald-400'
                  : score >= 50
                  ? 'bg-teal-500'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${score}%` }}
            />
          </div>

          {/* Status Label */}
          <span
            className={`hidden md:inline-block text-[10px] px-2 py-0.5 rounded-full border font-semibold truncate ${
              isReady
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : score >= 50
                ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}
          >
            {isReady
              ? 'Totality Ready to Prescribe'
              : score >= 50
              ? 'Totality Developing'
              : 'Gathering Keynotes'}
          </span>
        </div>

        {/* Right Action: Suggest Medicine & Conclude Button */}
        <div className="flex items-center gap-1.5 shrink-0">
          {isSessionRestored && (
            <div className="hidden xl:flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Auto-Saved Session</span>
              {onResetCase && (
                <button
                  type="button"
                  onClick={onResetCase}
                  title="Start case over from beginning"
                  className="ml-1 text-slate-400 hover:text-white cursor-pointer"
                >
                  <RotateCcw className="w-2.5 h-2.5 text-amber-400" />
                </button>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={onOpenPrescribe}
            title={
              isReady
                ? 'Totality complete! Formulate prescription and request senior evaluation.'
                : 'Prescribe medicine and conclude consultation'
            }
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer min-h-[36px] shadow-md ${
              isReady
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-950/50 ring-2 ring-emerald-400/40 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-emerald-300 hover:text-white border border-emerald-500/40'
            }`}
          >
            <Pill className="w-3.5 h-3.5 text-emerald-300" />
            <span>{isReady ? 'Suggest Medicine & Evaluate' : 'Suggest Medicine'}</span>
          </button>
        </div>
      </div>

      {/* Bottom Row: 4-Pillar Interactive Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-[11px]">
        {pillars.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              if (!p.done && onInsertProbe) {
                onInsertProbe(p.prompt);
              }
            }}
            title={
              p.done
                ? `${p.label} probed and recorded`
                : `Click to ask suggested question for ${p.label}`
            }
            className={`shrink-0 px-2 py-0.5 rounded-lg border flex items-center gap-1.5 transition cursor-pointer min-h-[28px] ${
              p.done
                ? 'bg-emerald-950/40 border-emerald-600/40 text-emerald-300 font-medium'
                : 'bg-slate-850/80 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600'
            }`}
          >
            {p.done ? (
              <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
            ) : (
              <Clock className="w-3 h-3 text-slate-500 shrink-0" />
            )}
            <span>{p.label}</span>
          </button>
        ))}

        <span className="hidden lg:flex items-center gap-1 text-[10px] text-slate-400 ml-auto italic line-clamp-1">
          <Sparkles className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
          <span>{guidance}</span>
        </span>
      </div>
    </div>
  );
}
