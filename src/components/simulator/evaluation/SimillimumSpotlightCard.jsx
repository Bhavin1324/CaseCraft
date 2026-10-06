import { Award, Pill, BookOpen, Check } from 'lucide-react';

export default function SimillimumSpotlightCard({ primarySimillimum, scenario }) {
  if (!primarySimillimum) return null;

  return (
    <div className="bg-gradient-to-br from-emerald-950/60 via-slate-855 to-slate-900 border-2 border-emerald-500/50 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
              <Award className="w-3 h-3" />
              Confirmed Simillimum (Gold Standard)
            </span>
            <span className="text-[10px] font-mono text-emerald-400/80">Primary Medicine</span>
          </div>
          <div className="flex items-baseline gap-2.5 pt-1">
            <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Pill className="w-5 h-5 text-emerald-400" />
              {primarySimillimum.name}
            </h3>
            {primarySimillimum.potency && (
              <span className="text-xs font-mono font-bold text-teal-300 bg-teal-950/80 px-2.5 py-0.5 rounded-lg border border-teal-500/40">
                {primarySimillimum.potency}
              </span>
            )}
          </div>
        </div>

        <div className="sm:text-right text-[11px] text-slate-400">
          <span className="text-slate-300 font-semibold block">Case Benchmark Target:</span>
          <span>{scenario?.title}</span>
        </div>
      </div>

      {/* Justification Box */}
      <div className="p-3 bg-slate-900/90 rounded-xl border border-emerald-900/50 space-y-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          Materia Medica Prescription Justification:
        </span>
        <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed font-serif">
          {primarySimillimum.justification}
        </p>
      </div>

      {/* Keynotes Confirming Simillimum */}
      {Array.isArray(primarySimillimum.keynotesConfirming) && primarySimillimum.keynotesConfirming.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Confirming Individualizing Keynotes (Aphorism 153):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2">
            {primarySimillimum.keynotesConfirming.map((kn, idx) => (
              <div
                key={idx}
                className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{kn}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
