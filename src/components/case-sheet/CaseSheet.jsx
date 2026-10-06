import { useState } from 'react';
import { FileText, Printer, Award, Loader2 } from 'lucide-react';

import DemographicsSection from './DemographicsSection';
import LsmcHierarchySection from './LsmcHierarchySection';
import PhysicalGeneralsSection from './PhysicalGeneralsSection';
import MentalGeneralsSection from './MentalGeneralsSection';

export default function CaseSheet({
  scenario,
  caseNotes = {},
  setCaseNotes,
  onRequestEvaluation,
  isEvaluating
}) {
  const [mobileStep, setMobileStep] = useState(1); // 1: Demographics, 2: LSMC, 3: Generals, 4: Mind & Totality

  // Helper to update caseNotes safely
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
      <div className="bg-slate-855 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
      <div className={mobileStep !== 1 ? 'hidden md:block' : ''}>
        <DemographicsSection
          scenario={scenario}
          caseNotes={caseNotes}
          updateField={updateField}
        />
      </div>

      {/* SECTION 2: Chief Complaint Hierarchy (LSMC Rule) */}
      <div className={mobileStep !== 2 ? 'hidden md:block' : ''}>
        <LsmcHierarchySection
          caseNotes={caseNotes}
          updateField={updateField}
        />
      </div>

      {/* SECTION 3: Physical Generals */}
      <div className={mobileStep !== 3 ? 'hidden md:block' : ''}>
        <PhysicalGeneralsSection
          caseNotes={caseNotes}
          updateField={updateField}
        />
      </div>

      {/* SECTION 4: Mental Generals & Totality Synthesis */}
      <div className={mobileStep !== 4 ? 'hidden md:block' : ''}>
        <MentalGeneralsSection
          caseNotes={caseNotes}
          updateField={updateField}
        />
      </div>

      {/* SECTION 5: Senior Consultant Evaluation Proctor */}
      {onRequestEvaluation && (
        <div className="bg-slate-855 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
            onClick={() => onRequestEvaluation?.()}
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
                <span>Finish &amp; Request Senior Evaluation</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
