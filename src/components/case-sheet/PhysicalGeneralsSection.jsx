import { Thermometer, Droplets, HeartPulse } from 'lucide-react';
import {
  THERMAL_PRESETS,
  THIRST_PRESETS,
  CRAVING_PRESETS
} from '../../constants/caseSheetPresets';

export default function PhysicalGeneralsSection({ caseNotes = {}, updateField }) {
  return (
    <div className="bg-slate-855 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-lg">
      <div className="flex items-center justify-between mb-3 border-b border-slate-700/70 pb-2.5">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Thermometer className="w-4 h-4" />
            III. Physical Generals (The Individualizing Keystones)
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Thermals, Thirst, Cravings, and Excretions define the constitutional terrain.
          </p>
        </div>
      </div>

      <div className="space-y-4 text-xs">
        {/* Thermal State */}
        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-amber-400" />
              Thermal Reaction
            </label>
            <span className="text-[10px] text-slate-400">Click quick selector or enter details</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {THERMAL_PRESETS.map((preset, i) => (
              <button
                key={i}
                type="button"
                onClick={() => updateField('thermalState', preset)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition cursor-pointer min-h-[34px] ${
                  caseNotes.thermalState === preset
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={caseNotes.thermalState || ''}
            onChange={(e) => updateField('thermalState', e.target.value)}
            placeholder="e.g. Extremely chilly (< cold drafts, wraps up warmly even in summer)..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Thirst & Fluids */}
        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-blue-400" />
              Thirst &amp; Drinking Habits
            </label>
            <span className="text-[10px] text-slate-400">Frequency, quantity, and temperature</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {THIRST_PRESETS.map((preset, i) => (
              <button
                key={i}
                type="button"
                onClick={() => updateField('thirstHabits', preset)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition cursor-pointer min-h-[34px] ${
                  caseNotes.thirstHabits === preset
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/50'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={caseNotes.thirstHabits || ''}
            onChange={(e) => updateField('thirstHabits', e.target.value)}
            placeholder="e.g. Craves small frequent sips of warm water; cold water causes severe cramping..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Cravings & Aversions */}
        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
              Cravings &amp; Aversions
            </label>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {CRAVING_PRESETS.map((preset, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  const current = caseNotes.cravings || '';
                  const updated = current ? `${current}, ${preset}` : preset;
                  updateField('cravings', updated);
                }}
                className="px-2.5 py-1 rounded-lg text-[11px] font-medium border bg-slate-800 text-slate-300 border-slate-700 hover:border-rose-500/40 hover:text-rose-300 transition cursor-pointer min-h-[34px]"
              >
                + {preset}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={caseNotes.cravings || ''}
            onChange={(e) => updateField('cravings', e.target.value)}
            placeholder="Craves salt, spicy curry, warm milk; averse to fats, bread..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>
    </div>
  );
}
