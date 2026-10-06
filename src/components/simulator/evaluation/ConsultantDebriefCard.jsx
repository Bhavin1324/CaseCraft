import { Sparkles, ShieldCheck } from 'lucide-react';

export default function ConsultantDebriefCard({ seniorFeedback, hahnemannianCompliance }) {
  return (
    <div className="bg-gradient-to-br from-emerald-950/40 via-slate-855 to-slate-900 border border-emerald-600/40 rounded-2xl p-4 sm:p-5 shadow-lg">
      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5 mb-2">
        <Sparkles className="w-4 h-4 text-emerald-400" />
        Senior Clinic Director Debrief:
      </h4>
      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
        &ldquo;{seniorFeedback}&rdquo;
      </p>
      {hahnemannianCompliance && (
        <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-start sm:items-center gap-2 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
          <span>
            <strong>Hahnemannian Compliance:</strong> {hahnemannianCompliance}
          </span>
        </div>
      )}
    </div>
  );
}
