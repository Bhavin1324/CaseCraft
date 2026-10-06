import { CheckCircle2, AlertCircle, Award, Sparkles } from 'lucide-react';

export default function SbarScorecard({ feedback }) {
  if (!feedback) return null;

  const isPassing = feedback.score >= 80;
  const isModerate = feedback.score >= 50 && feedback.score < 80;

  const scoreBadgeColors = isPassing
    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
    : isModerate
    ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
    : 'bg-rose-500/15 text-rose-300 border-rose-500/30';

  const verdictCardColors = isPassing
    ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
    : isModerate
    ? 'bg-amber-950/30 border-amber-500/30 text-amber-200'
    : 'bg-rose-950/30 border-rose-500/30 text-rose-200';

  return (
    <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl space-y-4">
      {/* Header with Score */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-100 text-sm tracking-tight">Handover Scorecard</h4>
            <p className="text-[11px] text-slate-400">Target: 80+ / 100 for Independent Handover</p>
          </div>
        </div>

        <div className={`px-3.5 py-1.5 rounded-full border font-mono font-bold text-xs flex items-center gap-1.5 shadow-sm ${scoreBadgeColors}`}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>{feedback.score} / 100</span>
        </div>
      </div>

      {/* Verdict Banner */}
      <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${verdictCardColors}`}>
        {isPassing ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        )}
        <div className="text-xs leading-relaxed font-medium italic">
          &ldquo;{feedback.verdict}&rdquo;
        </div>
      </div>

      {/* Checklist breakdown */}
      <div className="space-y-2 pt-1">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Component Evaluation
        </div>
        <div className="space-y-2">
          {feedback.checklist.map((item, idx) => {
            const isIncomplete =
              item.includes('Incomplete') ||
              item.includes('Missing') ||
              item.includes('Needs') ||
              item.includes('Provide');

            return (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300"
              >
                {isIncomplete ? (
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                )}
                <span className="leading-snug text-[11px] sm:text-xs">
                  {item}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
