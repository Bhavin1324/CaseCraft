import {
  Target,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';

export default function PrescriptionConcordanceCard({ prescriptionConcordance }) {
  if (!prescriptionConcordance) return null;

  return (
    <div
      className={`p-4 rounded-2xl border shadow-lg space-y-2 ${
        prescriptionConcordance.status === 'exact_match'
          ? 'bg-emerald-950/40 border-emerald-500/50'
          : prescriptionConcordance.status === 'close_differential'
          ? 'bg-amber-950/40 border-amber-500/50'
          : prescriptionConcordance.status === 'mismatch'
          ? 'bg-rose-950/40 border-rose-500/50'
          : 'bg-slate-855 border-slate-700/80'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-2">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            Intern Prescription Concordance Audit
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-slate-400">Proforma Prescription:</span>
          <span className="text-xs font-mono font-bold text-white px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
            {prescriptionConcordance.doctorPrescription || 'None recorded'}
          </span>
          <span
            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
              prescriptionConcordance.status === 'exact_match'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : prescriptionConcordance.status === 'close_differential'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : prescriptionConcordance.status === 'mismatch'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {prescriptionConcordance.status === 'exact_match' ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Exact Simillimum Match</span>
              </>
            ) : prescriptionConcordance.status === 'close_differential' ? (
              <>
                <AlertCircle className="w-3 h-3 text-amber-400" />
                <span>Close Differential</span>
              </>
            ) : prescriptionConcordance.status === 'mismatch' ? (
              <>
                <AlertTriangle className="w-3 h-3 text-rose-400" />
                <span>Mismatched Totality</span>
              </>
            ) : (
              <>
                <HelpCircle className="w-3 h-3 text-slate-400" />
                <span>Not Recorded in Proforma</span>
              </>
            )}
          </span>
        </div>
      </div>
      {prescriptionConcordance.critique && (
        <p className="text-xs text-slate-300 leading-relaxed">
          {prescriptionConcordance.critique}
        </p>
      )}
    </div>
  );
}
