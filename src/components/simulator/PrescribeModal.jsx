import { useState } from 'react';
import { Pill, X, Award, ArrowRight } from 'lucide-react';

const COMMON_POTENCIES = ['30C', '200C', '1M', '6C', 'LM 0/1'];

const INSTRUCTION_PRESETS = [
  'Take 3 doses dry on tongue, 4 hours apart',
  '1 dose stat at bedtime, report after 48 hours',
  'Dissolve in half-cup water, sip 3 times daily',
  'Wait and watch; avoid camphor, coffee & strong mints'
];

export default function PrescribeModal({
  isOpen,
  onClose,
  scenario,
  onPrescribe,
  caseNotes = {}
}) {
  const defaultRemedyName =
    caseNotes?.provisionalTotality?.split(' ')[0] ||
    scenario?.expectedTotality?.[0] ||
    'Nux Vomica';

  const defaultPotency =
    caseNotes?.provisionalTotality?.split(' ')[1] ||
    scenario?.indicatedRemedy?.split(' ')[1] ||
    '200C';

  const [remedy, setRemedy] = useState(defaultRemedyName);
  const [potency, setPotency] = useState(defaultPotency);
  const [instructions, setInstructions] = useState(
    'Take 3 doses dry on tongue, 4 hours apart; report after 48 hours.'
  );
  const [justification, setJustification] = useState(
    caseNotes?.provisionalTotality || ''
  );

  if (!isOpen) return null;

  const candidateRemedies = Array.from(
    new Set([
      ...(scenario?.expectedTotality || []),
      'Nux Vomica',
      'Natrum Mur',
      'Lycopodium',
      'Arsenicum Alb',
      'Chamomilla',
      'Pulsatilla',
      'Sulphur'
    ])
  ).slice(0, 7);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!remedy.trim()) return;
    onPrescribe({
      remedy: remedy.trim(),
      potency: potency.trim(),
      instructions: instructions.trim(),
      justification: justification.trim()
    });
    onClose();
  };

  const patientFirst = scenario?.patientName?.split(' ')[0] || 'Patient';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-5 overflow-hidden animate-in fade-in duration-200">
      <div className="bg-slate-900 border-t sm:border border-slate-700/90 rounded-t-3xl sm:rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[92dvh] sm:max-h-[88vh] overflow-hidden animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 duration-200">
        {/* Mobile Drag Indicator Pill */}
        <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />

        {/* Header */}
        <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-slate-800 bg-slate-900/95 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/20 shrink-0">
              <Pill className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                  Formulate Prescription
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono shrink-0">
                  Aphorism 153
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 truncate">
                Conclude consultation for <strong className="text-slate-200">{scenario?.patientName}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close prescription modal"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body (Scrollable with overscroll containment) */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 sm:p-6 space-y-4 text-xs text-slate-200 overflow-y-auto overscroll-contain flex-1">
            {/* 1. Remedy Name */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  1. Indicated Simillimum / Remedy
                </label>
                <span className="text-[10px] text-slate-400">Tap to select</span>
              </div>

              {/* Horizontal swipeable chip carousel */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 -mx-1 px-1">
                {candidateRemedies.map((cand) => (
                  <button
                    key={cand}
                    type="button"
                    onClick={() => setRemedy(cand)}
                    className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer min-h-[38px] ${
                      remedy.toLowerCase() === cand.toLowerCase()
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/40'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600 hover:text-white'
                    }`}
                  >
                    {cand}
                  </button>
                ))}
              </div>

              <input
                type="text"
                required
                value={remedy}
                onChange={(e) => setRemedy(e.target.value)}
                placeholder="e.g. Nux Vomica, Natrum Muriaticum, Arsenicum..."
                className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3.5 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 min-h-[44px]"
              />
            </div>

            {/* 2. Potency Grid */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                2. Posological Potency
              </label>
              <div className="grid grid-cols-5 gap-1.5 sm:flex sm:gap-2">
                {COMMON_POTENCIES.map((pot) => (
                  <button
                    key={pot}
                    type="button"
                    onClick={() => setPotency(pot)}
                    className={`py-2 px-1 text-center rounded-xl font-mono text-xs font-bold border transition cursor-pointer min-h-[40px] flex items-center justify-center ${
                      potency === pot
                        ? 'bg-teal-600 text-white border-teal-500 shadow-sm'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {pot}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Instructions to Patient */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  3. Instructions to {patientFirst}
                </label>
                <span className="text-[10px] text-slate-400">Consultation closing</span>
              </div>

              {/* Swipeable preset chips */}
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-1 px-1">
                {INSTRUCTION_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInstructions(p)}
                    className="shrink-0 px-2.5 py-1 rounded-lg text-[11px] bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 transition cursor-pointer min-h-[32px] flex items-center"
                  >
                    + {p.split(';')[0].slice(0, 26)}...
                  </button>
                ))}
              </div>

              <textarea
                rows={2}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Take 3 doses dry on tongue, 4 hours apart; avoid strong stimulants..."
                className="w-full bg-slate-850 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* 4. Totality Justification */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                4. Keynotes / Totality Justification (For Senior Mentor)
              </label>
              <textarea
                rows={2}
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="Briefly state keynotes: e.g. Chilly patient, stomach cramp < 3 AM, irritable disposition..."
                className="w-full bg-slate-850 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Action Footer (Thumb-Zone & Safe-Area Insets) */}
          <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-900/95 shrink-0 flex flex-col gap-2 pb-[max(env(safe-area-inset-bottom),0.875rem)]">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 active:from-emerald-700 active:to-teal-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition cursor-pointer min-h-[48px] active:scale-[0.99]"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>Deliver Rx &amp; Evaluate</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs transition cursor-pointer min-h-[40px] flex items-center justify-center"
            >
              Continue Case-Taking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
