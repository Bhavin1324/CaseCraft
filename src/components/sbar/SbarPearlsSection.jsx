import { AlertTriangle, Lightbulb } from 'lucide-react';

const TRAPS = [
  {
    num: 1,
    title: 'Leading with Diagnosis Instead of Totality',
    desc: 'Never say \u201CThis is a case of migraine so I want to give Belladonna.\u201D Start with the peculiar modalities, sensations, and thermal characteristics.'
  },
  {
    num: 2,
    title: 'Omitting Thermal Individualization',
    desc: 'If you fail to clarify whether the patient is chilly or hot, senior clinicians will discount your suggested prescription instantly.'
  },
  {
    num: 3,
    title: 'Lack of a Justified Differential',
    desc: 'Always mention which second remedy was considered and the precise symptom that ruled it out.'
  }
];

export default function SbarPearlsSection() {
  return (
    <div className="space-y-4">
      {/* Clinic Traps Card */}
      <div className="bg-slate-850/95 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Senior Doctor Clinic Traps
            </h3>
            <p className="text-[11px] text-slate-400">Common mistakes that undermine handovers</p>
          </div>
        </div>

        <div className="space-y-2.5 text-xs">
          {TRAPS.map((trap) => (
            <div
              key={trap.num}
              className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 hover:border-slate-700 transition"
            >
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">
                  {trap.num}
                </span>
                <div className="space-y-1">
                  <p className="font-semibold text-slate-200 text-xs">
                    {trap.title}
                  </p>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {trap.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Consultant Advice Card */}
      <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 shadow-xl text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Lightbulb className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-emerald-300 text-xs uppercase tracking-wider">
            Consultant Advice
          </h4>
        </div>
        <p className="text-[11px] sm:text-xs leading-relaxed text-slate-300 pl-1">
          In top classical homeopathic clinics, junior associates who can deliver an organized SBAR handover in 60 seconds are trusted with independent OPD duties immediately.
        </p>
      </div>
    </div>
  );
}
