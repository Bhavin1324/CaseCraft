import { BookOpen } from 'lucide-react';

export default function DifferentialGrid({ otherDifferentials = [] }) {
  if (!Array.isArray(otherDifferentials) || otherDifferentials.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-855 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
      <div className="flex items-center justify-between border-b border-slate-700/70 pb-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4" />
          Differential Remedies &amp; Ruling-Out Criteria
        </h4>
        <span className="text-[10px] text-slate-400">Totality Differentiation</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
        {otherDifferentials.map((diff, i) => {
          const remedyName =
            typeof diff === 'string'
              ? diff
              : diff?.name || diff?.remedy || `Differential #${i + 1}`;
          const reasonConsidered =
            typeof diff === 'object' && diff !== null
              ? diff.reason || diff.justification || ''
              : '';
          const reasonRuledOut =
            typeof diff === 'object' && diff !== null
              ? diff.reasonRuledOut || ''
              : '';
          const potency =
            typeof diff === 'object' && diff !== null
              ? diff.potency || '30C'
              : '';

          return (
            <div
              key={i}
              className="p-3 sm:p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-white text-xs">{remedyName}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    {potency && (
                      <span className="text-[9px] font-mono text-teal-300 bg-teal-950/60 px-1.5 py-0.2 rounded border border-teal-500/30">
                        {potency}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 font-mono">Diff #{i + 1}</span>
                  </div>
                </div>

                {reasonConsidered && (
                  <div className="text-[11px] text-slate-300 leading-normal">
                    <span className="text-slate-400 text-[10px] font-semibold block uppercase tracking-wider">
                      Why Considered:
                    </span>
                    {reasonConsidered}
                  </div>
                )}

                {reasonRuledOut && (
                  <div className="text-[11px] text-amber-300/90 bg-amber-950/30 border border-amber-900/40 rounded-lg p-2 leading-normal">
                    <span className="text-amber-400 text-[10px] font-semibold block uppercase tracking-wider">
                      Why Ruled Out:
                    </span>
                    {reasonRuledOut}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
