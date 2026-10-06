import {
  User,
  ShieldCheck,
  CheckCircle,
  Clock,
  Thermometer,
  Brain,
  Droplets,
  Sparkles,
  RotateCcw
} from 'lucide-react';

export default function PatientSidebar({
  currentScenario,
  scenariosList = [],
  selectedScenarioId,
  onSwitchScenario,
  probedCategories = {},
  onResetCase
}) {
  const probedCount = Object.values(probedCategories).filter(Boolean).length;

  return (
    <aside className="hidden lg:flex flex-col w-[280px] bg-slate-900 border-r border-slate-800/80 p-4 space-y-4 overflow-y-auto shrink-0">
      {/* Patient Profile Card */}
      <div className="bg-slate-855 border border-slate-700/80 rounded-2xl p-4 shadow-md space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-white line-clamp-1">
                {currentScenario?.patientName?.split('(')[0] || 'Patient'}
              </h2>
              <span className="text-[10px] text-slate-400">
                {currentScenario?.patientName?.match(/\((.*?)\)/)?.[1] || 'Adult Consultation'}
              </span>
            </div>
          </div>
          <span className="text-[9px] px-2 py-0.5 rounded font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {currentScenario?.difficulty?.split(' ')[0] || 'Case'}
          </span>
        </div>

        <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Chief Complaint:
          </p>
          <p className="text-slate-300 italic line-clamp-3">
            &ldquo;{currentScenario?.chiefComplaint}&rdquo;
          </p>
        </div>

        {/* Scenario Switcher Dropdown */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Select Curated Case:
          </label>
          <select
            value={selectedScenarioId}
            onChange={(e) => onSwitchScenario(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg p-2 focus:outline-none focus:border-emerald-500"
          >
            {scenariosList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Organon Aphorisms 83–104 Progress Tracker */}
      <div className="bg-slate-855 border border-slate-700/80 rounded-2xl p-4 shadow-md space-y-3">
        <div className="flex items-center justify-between border-b border-slate-700/70 pb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Aphorisms 83–104 Checklist
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-emerald-300 font-mono font-bold">
            {probedCount}/6
          </span>
        </div>

        <div className="space-y-1.5 text-xs">
          <div
            className={`p-2 rounded-lg border flex items-center justify-between transition ${
              probedCategories.lsmc
                ? 'bg-emerald-950/40 border-emerald-600/40 text-emerald-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-500'
            }`}
          >
            <span className="text-[11px] font-medium">1. Location &amp; Sensation</span>
            {probedCategories.lsmc ? (
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Clock className="w-3.5 h-3.5" />
            )}
          </div>

          <div
            className={`p-2 rounded-lg border flex items-center justify-between transition ${
              probedCategories.modalities
                ? 'bg-emerald-950/40 border-emerald-600/40 text-emerald-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-500'
            }`}
          >
            <span className="text-[11px] font-medium">2. Modalities (&lt; / &gt;)</span>
            {probedCategories.modalities ? (
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Clock className="w-3.5 h-3.5" />
            )}
          </div>

          <div
            className={`p-2 rounded-lg border flex items-center justify-between transition ${
              probedCategories.thermal
                ? 'bg-emerald-950/40 border-emerald-600/40 text-emerald-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-500'
            }`}
          >
            <span className="text-[11px] font-medium flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-amber-400" />
              3. Thermal State
            </span>
            {probedCategories.thermal ? (
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Clock className="w-3.5 h-3.5" />
            )}
          </div>

          <div
            className={`p-2 rounded-lg border flex items-center justify-between transition ${
              probedCategories.thirst
                ? 'bg-emerald-950/40 border-emerald-600/40 text-emerald-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-500'
            }`}
          >
            <span className="text-[11px] font-medium flex items-center gap-1">
              <Droplets className="w-3 h-3 text-blue-400" />
              4. Thirst &amp; Cravings
            </span>
            {probedCategories.thirst ? (
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Clock className="w-3.5 h-3.5" />
            )}
          </div>

          <div
            className={`p-2 rounded-lg border flex items-center justify-between transition ${
              probedCategories.mind
                ? 'bg-emerald-950/40 border-emerald-600/40 text-emerald-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-500'
            }`}
          >
            <span className="text-[11px] font-medium flex items-center gap-1">
              <Brain className="w-3 h-3 text-purple-400" />
              5. Mind &amp; Disposition
            </span>
            {probedCategories.mind ? (
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Clock className="w-3.5 h-3.5" />
            )}
          </div>

          <div
            className={`p-2 rounded-lg border flex items-center justify-between transition ${
              probedCategories.pastHistory
                ? 'bg-emerald-950/40 border-emerald-600/40 text-emerald-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-500'
            }`}
          >
            <span className="text-[11px] font-medium">6. Causation / Miasm</span>
            {probedCategories.pastHistory ? (
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Clock className="w-3.5 h-3.5" />
            )}
          </div>
        </div>
      </div>

      {/* Coaching Clues */}
      {currentScenario?.hints && (
        <div className="bg-slate-855 border border-slate-700/80 rounded-2xl p-3.5 shadow-md">
          <p className="text-[11px] font-bold text-emerald-300 flex items-center gap-1 mb-1.5">
            <Sparkles className="w-3 h-3" />
            Consultant Probing Clues:
          </p>
          <ul className="text-[10px] text-slate-300 list-disc list-inside space-y-1">
            {currentScenario.hints.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Reset Case Action */}
      <button
        type="button"
        onClick={onResetCase}
        className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer min-h-[40px]"
      >
        <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
        <span>Reset Current Case</span>
      </button>
    </aside>
  );
}
