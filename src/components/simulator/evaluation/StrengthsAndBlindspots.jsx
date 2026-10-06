import { CheckCircle, AlertTriangle, Check, ChevronRight } from 'lucide-react';

export default function StrengthsAndBlindspots({ strengths = [], missedQuestions = [] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      {/* Clinical Strengths */}
      <div className="bg-slate-855 border border-slate-700/80 rounded-2xl p-4 shadow-lg space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
          <CheckCircle className="w-4 h-4" />
          Clinical Strengths Demonstrated (Aphorism 84)
        </h4>
        <ul className="space-y-1.5">
          {Array.isArray(strengths) && strengths.length > 0 ? (
            strengths.map((str, i) => {
              const text = typeof str === 'string' ? str : str?.point || str?.text || String(str);
              return (
                <li key={i} className="flex items-start gap-2 text-slate-300 text-[11px]">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </li>
              );
            })
          ) : (
            <li className="text-slate-400 italic text-[11px]">Maintained professional clinical presence.</li>
          )}
        </ul>
      </div>

      {/* Crucial Missed Questions */}
      <div className="bg-slate-855 border border-slate-700/80 rounded-2xl p-4 shadow-lg space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4" />
          Crucial Inquiries Missed (Aphorism 84 Blindspots)
        </h4>
        <ul className="space-y-1.5">
          {Array.isArray(missedQuestions) && missedQuestions.length > 0 ? (
            missedQuestions.map((q, i) => {
              const text = typeof q === 'string' ? q : q?.question || q?.text || String(q);
              return (
                <li key={i} className="flex items-start gap-2 text-slate-300 text-[11px]">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </li>
              );
            })
          ) : (
            <li className="text-slate-400 italic text-[11px]">No critical modalities were overlooked!</li>
          )}
        </ul>
      </div>
    </div>
  );
}
