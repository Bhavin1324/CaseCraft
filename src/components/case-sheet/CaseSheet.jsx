import { useState } from 'react';
import {
  FileText,
  Printer,
  Thermometer,
  Droplets,
  HeartPulse,
  Brain,
  ShieldCheck,
  Sparkles,
  Award,
  Loader2
} from 'lucide-react';

const THERMAL_PRESETS = [
  'Very Chilly (< Cold, wraps up)',
  'Chilly (< Drafts, fan breeze)',
  'Hot / Warm-blooded (< Sun, heat)',
  'Ambithermal (Neither distinct)'
];

const THIRST_PRESETS = [
  'Frequent small sips (warm)',
  'Large gulps cold water at long intervals',
  'Thirstlessness (even with dry mouth)',
  'Thirst during chill / fever only'
];

const CRAVING_PRESETS = [
  'Salt & savory',
  'Sweets & sugar',
  'Spicy / pungent & coffee',
  'Warm soups & hot tea',
  'Ice cold drinks & fruits',
  'Fat & rich butter'
];

const MIND_PRESETS = [
  'Irritable, impatient, intolerant of contradiction',
  'Mild, tearful, craves consolation & company',
  'Fastidious, anxious, midnight restlessness',
  'Reserved, silent grief, hates consolation'
];

export default function CaseSheet({
  scenario,
  caseNotes = {},
  setCaseNotes,
  onRequestEvaluation,
  isEvaluating
}) {
  const [mobileStep, setMobileStep] = useState(1); // 1: Demographics, 2: LSMC, 3: Generals, 4: Mind & Totality

  // Local helper to update caseNotes safely
  const updateField = (field, value) => {
    if (setCaseNotes) {
      setCaseNotes((prev) => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Proforma Header & Action Bar */}
      <div className="bg-slate-850/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Standard Homeopathic Clinical Proforma
            </h2>
            <span className="hidden sm:inline-block text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-600/40 text-emerald-300 font-mono">
              Organon Aphorisms 83–104
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Structured Hahnemannian recording proforma with hierarchical Kentian totality.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer min-h-[44px]"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Print / PDF Proforma</span>
          </button>
        </div>
      </div>

      {/* Mobile Step Switcher (visible on < 768px) */}
      <div className="md:hidden grid grid-cols-4 gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
        {[
          { step: 1, label: 'Demog' },
          { step: 2, label: 'LSMC' },
          { step: 3, label: 'Generals' },
          { step: 4, label: 'Mind' }
        ].map((s) => (
          <button
            key={s.step}
            type="button"
            onClick={() => setMobileStep(s.step)}
            className={`py-2 rounded-lg text-xs font-bold transition text-center cursor-pointer min-h-[44px] ${
              mobileStep === s.step
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* SECTION 1: Patient Demographics & Presenting State */}
      <div
        className={`bg-slate-850/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-lg ${
          mobileStep !== 1 ? 'hidden md:block' : ''
        }`}
      >
        <div className="flex items-center justify-between mb-3 border-b border-slate-700/70 pb-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            I. Patient Demographics & Presenting State
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">Form 101</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
          <div>
            <label className="text-slate-400 block mb-1 font-medium">Patient Name & Demographics</label>
            <input
              type="text"
              defaultValue={scenario?.patientName || ''}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1 font-medium">Occupation & Environment</label>
            <input
              type="text"
              placeholder="e.g. Sedentary corporate lawyer, high-stress desk job"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1 font-medium">Consultation Date & Setting</label>
            <input
              type="text"
              defaultValue={new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="mt-3 text-xs">
          <label className="text-slate-400 block mb-1 font-medium">Chief Presenting Complaint (Patient&apos;s Own Words - Aphorism 84)</label>
          <textarea
            rows={2}
            value={caseNotes.chiefComplaint || scenario?.chiefComplaint || ''}
            onChange={(e) => updateField('chiefComplaint', e.target.value)}
            placeholder="Record chief complaints verbatim without premature medical labeling..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* SECTION 2: Chief Complaint Hierarchy (LSMC Rule) */}
      <div
        className={`bg-slate-850/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-lg ${
          mobileStep !== 2 ? 'hidden md:block' : ''
        }`}
      >
        <div className="flex items-center justify-between mb-3 border-b border-slate-700/70 pb-2.5">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              II. Chief Complaint Hierarchy (Boenninghausen & Kent LSMC)
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Every complete symptom requires: Location, Sensation, Modalities (&lt; / &gt;), and Concomitants.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              1. Exact Location & Spread
            </label>
            <textarea
              rows={3}
              value={caseNotes.location || ''}
              onChange={(e) => updateField('location', e.target.value)}
              placeholder="Epigastrium radiating to chest; right temporal region; right knee joint..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              2. Sensation & Character
            </label>
            <textarea
              rows={3}
              value={caseNotes.sensation || ''}
              onChange={(e) => updateField('sensation', e.target.value)}
              placeholder="Burning like chili powder; stitching pain; heavy crushing weight; pulsating hammer..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              3. Aggravations (&lt;)
            </label>
            <textarea
              rows={3}
              value={caseNotes.modalityAgg || ''}
              onChange={(e) => updateField('modalityAgg', e.target.value)}
              placeholder="< 3 AM to 4 AM, cold drafts, after heavy meal, tight clothes, consolation, motion..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              4. Ameliorations (&gt;)
            </label>
            <textarea
              rows={3}
              value={caseNotes.modalityAmel || ''}
              onChange={(e) => updateField('modalityAmel', e.target.value)}
              placeholder="> Warm drinks, hot applications on stomach, lying in dark quiet room, hard pressure..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="mt-3 text-xs">
          <label className="text-slate-300 font-semibold block mb-1">5. Concomitant Symptoms</label>
          <input
            type="text"
            value={caseNotes.concomitants || ''}
            onChange={(e) => updateField('concomitants', e.target.value)}
            placeholder="e.g. Constant nausea without relief from vomiting; chilliness during stool..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* SECTION 3: Physical Generals (Thermals, Thirst, Cravings, Sleep, Bowels) */}
      <div
        className={`bg-slate-850/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-lg ${
          mobileStep !== 3 ? 'hidden md:block' : ''
        }`}
      >
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
                Thirst & Drinking Habits
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
                Cravings & Aversions
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

      {/* SECTION 4: Mental Generals & Disposition (Organon Aphorisms 210–230) */}
      <div
        className={`bg-slate-850/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-lg ${
          mobileStep !== 4 ? 'hidden md:block' : ''
        }`}
      >
        <div className="flex items-center justify-between mb-3 border-b border-slate-700/70 pb-2.5">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Brain className="w-4 h-4" />
              IV. Mental Generals & Totality Synthesis (Aphorisms 210–230)
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Disposition, reaction to illness, and final homeopathic totality.
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
            <label className="text-slate-300 font-semibold block mb-1">
              Emotional Disposition & Reaction to Consolation
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
              Provisional Totality & Leading Differential Remedies
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

      {/* SECTION 5: Senior Consultant Evaluation Proctor */}
      {onRequestEvaluation && (
        <div className="bg-slate-850/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white tracking-tight">
                Senior Mentor Proctor Evaluation
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                Agent B Scorecard
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Submit your clinical proforma and consultation notes for comprehensive Hahnemannian evaluation.
            </p>
          </div>

          <button
            type="button"
            onClick={onRequestEvaluation}
            disabled={isEvaluating}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition cursor-pointer shrink-0 min-h-[44px]"
          >
            {isEvaluating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Consultant Evaluating...</span>
              </>
            ) : (
              <>
                <Award className="w-4 h-4" />
                <span>Finish & Request Senior Evaluation</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
