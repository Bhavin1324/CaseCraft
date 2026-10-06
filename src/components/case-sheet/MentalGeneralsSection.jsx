import { Brain } from 'lucide-react';
import { MIND_PRESETS } from '../../constants/caseSheetPresets';

export default function MentalGeneralsSection({ caseNotes = {}, updateField }) {
  return (
    <div className="bg-slate-855 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-lg">
      <div className="flex items-center justify-between mb-3 border-b border-slate-700/70 pb-2.5">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Brain className="w-4 h-4" />
            IV. Mental Generals &amp; Totality Synthesis (Aphorisms 210–230)
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Disposition, reaction to illness, and final homeopathic totality.
          </p>
        </div>
      </div>

      <div className="space-y-4 text-xs">
        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
          <label className="text-slate-300 font-semibold block mb-1">
            Emotional Disposition &amp; Reaction to Consolation
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {MIND_PRESETS.map((preset, i) => (
              <button
                key={i}
                type="button"
                onClick={() => updateField('mentalState', preset)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition cursor-pointer min-h-[34px] ${
                  caseNotes.mentalState === preset
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
          <textarea
            rows={2}
            value={caseNotes.mentalState || ''}
            onChange={(e) => updateField('mentalState', e.target.value)}
            placeholder="e.g. Fiery temper, quick-witted, irritable, cannot tolerate contradiction or noise..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
          <label className="text-slate-300 font-semibold block mb-1">
            Provisional Totality &amp; Leading Differential Remedies
          </label>
          <textarea
            rows={2}
            value={caseNotes.provisionalTotality || ''}
            onChange={(e) => updateField('provisionalTotality', e.target.value)}
            placeholder="e.g. Nux Vomica 200C (Epigastric cramp < 3 AM, chilly, ineffectual urging, irritable). Differentials: Lycopodium, Carbo Veg..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>
    </div>
  );
}
