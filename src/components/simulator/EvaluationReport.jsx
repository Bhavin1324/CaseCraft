import { useState } from 'react';
import {
  Award,
  X,
  Printer,
  RotateCcw,
  PlusCircle,
  Trash2,
  ChevronRight,
  Sparkles,
  Target,
  BookOpen,
  ShieldCheck
} from 'lucide-react';

import ScoreMeterSection from './evaluation/ScoreMeterSection';
import ConsultantDebriefCard from './evaluation/ConsultantDebriefCard';
import PrescriptionConcordanceCard from './evaluation/PrescriptionConcordanceCard';
import SimillimumSpotlightCard from './evaluation/SimillimumSpotlightCard';
import DifferentialGrid from './evaluation/DifferentialGrid';
import RubricCardsGrid from './evaluation/RubricCardsGrid';
import StrengthsAndBlindspots from './evaluation/StrengthsAndBlindspots';

export default function EvaluationReport({
  report,
  scenario,
  isOpen = true,
  onClose,
  onResetCase,
  onNewCase,
  onDeleteCaseData
}) {
  const [mobileTab, setMobileTab] = useState('overview'); // 'overview' | 'simillimum' | 'rubrics' | 'critique'

  if (!isOpen || !report) return null;

  const {
    totalScore = 75,
    lsmcScore = 18,
    generalsScore = 18,
    communicationScore = 20,
    sbarScore = 19,
    hahnemannianCompliance = 'Strict adherence to open-ended probing without leading traps.',
    strengths = [],
    missedQuestions = [],
    suggestedRubrics = [],
    differentialRemedies = [],
    simillimum,
    prescriptionConcordance,
    seniorFeedback = 'Promising clinical case-taking. Sharpen your thermal and thirst queries early to ground your prescription.'
  } = report;

  // Extract or synthesize confirmed simillimum
  const primarySimillimum = simillimum || (differentialRemedies[0] ? {
    name: differentialRemedies[0].name || differentialRemedies[0].remedy || scenario?.indicatedRemedy || 'Confirmed Simillimum',
    potency: differentialRemedies[0].potency || scenario?.indicatedRemedy?.split(' ')[1] || '200C',
    justification: differentialRemedies[0].justification || differentialRemedies[0].reason || 'Primary indicated constitutional simillimum matching thermal and modality totality.',
    keynotesConfirming: [
      scenario?.persona?.hiddenTruths?.sensation ? `Sensation: ${scenario.persona.hiddenTruths.sensation}` : null,
      scenario?.persona?.hiddenTruths?.thermal ? `Thermal State: ${scenario.persona.hiddenTruths.thermal}` : null,
      scenario?.persona?.hiddenTruths?.modalities?.agg ? `Peak Modality: ${scenario.persona.hiddenTruths.modalities.agg}` : null
    ].filter(Boolean)
  } : {
    name: scenario?.indicatedRemedy || 'Confirmed Simillimum',
    potency: '200C',
    justification: 'Primary constitutional simillimum matching the presenting symptom picture.',
    keynotesConfirming: ['Thermal state matching', 'Characteristic modality pattern']
  });

  // Differentials for ruling-out comparison
  const otherDifferentials = simillimum
    ? differentialRemedies
    : differentialRemedies.slice(1);

  const MOBILE_TABS = [
    { id: 'overview', label: 'Overview', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'simillimum', label: 'Simillimum & Rx', icon: <Target className="w-3.5 h-3.5" /> },
    { id: 'rubrics', label: 'Rubrics', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'critique', label: 'Analysis', icon: <ShieldCheck className="w-3.5 h-3.5" /> }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md overflow-hidden sm:p-4">
      {/* Container: Full-bleed on mobile (100dvh), rounded elevated dialog on tablet/desktop */}
      <div className="bg-slate-900 w-full h-[100dvh] sm:h-auto sm:max-h-[92vh] sm:max-w-4xl sm:rounded-2xl border-0 sm:border border-slate-700/80 shadow-2xl flex flex-col overflow-hidden my-auto animate-in fade-in duration-200">
        {/* Header: Sticky top with safe-area support */}
        <div className="p-3.5 sm:p-5 border-b border-slate-800 bg-slate-900/95 shrink-0 flex items-center justify-between gap-3 pt-[max(env(safe-area-inset-top),14px)]">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/20 shrink-0">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h3 className="text-xs sm:text-base font-bold text-white tracking-tight line-clamp-1">
                  Senior Consultant Clinical Assessment
                </h3>
                <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  Aphorisms 83–104
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-1">
                Case Assessment: <strong className="text-slate-200">{scenario?.title}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition cursor-pointer min-h-[36px]"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Assessment Report"
              className="p-2 sm:p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Segmented Tab Strip (< md) */}
        <div className="md:hidden flex items-center gap-1 p-1.5 bg-slate-950/90 border-b border-slate-800 shrink-0 overflow-x-auto no-scrollbar">
          {MOBILE_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMobileTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-xl text-[11px] font-bold transition cursor-pointer min-h-[40px] whitespace-nowrap ${
                mobileTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Scrollable Report Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs text-slate-300">
          {/* SECTION 1: OVERVIEW & SCORES */}
          <div className={`${mobileTab !== 'overview' ? 'hidden md:block' : ''} space-y-5`}>
            <ScoreMeterSection
              totalScore={totalScore}
              lsmcScore={lsmcScore}
              generalsScore={generalsScore}
              communicationScore={communicationScore}
              sbarScore={sbarScore}
            />
            <ConsultantDebriefCard
              seniorFeedback={seniorFeedback}
              hahnemannianCompliance={hahnemannianCompliance}
            />
          </div>

          {/* SECTION 2: SIMILLIMUM, CONCORDANCE & DIFFERENTIALS */}
          <div className={`${mobileTab !== 'simillimum' ? 'hidden md:block' : ''} space-y-4`}>
            <PrescriptionConcordanceCard prescriptionConcordance={prescriptionConcordance} />
            <SimillimumSpotlightCard
              primarySimillimum={primarySimillimum}
              scenario={scenario}
            />
            <DifferentialGrid otherDifferentials={otherDifferentials} />
          </div>

          {/* SECTION 3: REPERTORY RUBRICS */}
          <div className={`${mobileTab !== 'rubrics' ? 'hidden md:block' : ''} space-y-3`}>
            <RubricCardsGrid suggestedRubrics={suggestedRubrics} />
          </div>

          {/* SECTION 4: CLINICAL ANALYSIS & BLINDSPOTS */}
          <div className={`${mobileTab !== 'critique' ? 'hidden md:block' : ''} space-y-3`}>
            <StrengthsAndBlindspots
              strengths={strengths}
              missedQuestions={missedQuestions}
            />
          </div>
        </div>

        {/* Footer Actions: Sticky at bottom, safe-area padded for mobile thumb zone */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900/95 shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pb-[max(env(safe-area-inset-bottom),14px)]">
          {/* Primary Action Button (Prominent & Full-Width on mobile) */}
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto order-1 sm:order-2 px-5 py-3 sm:py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 active:from-emerald-700 active:to-teal-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/40 transition cursor-pointer min-h-[48px] sm:min-h-[44px] flex items-center justify-center gap-1.5 active:scale-[0.99]"
          >
            <span>Close &amp; Return</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Secondary Actions (Clean 3-column grid on mobile, inline row on desktop) */}
          <div className="grid grid-cols-3 sm:flex items-center gap-2 order-2 sm:order-1 flex-1 sm:flex-initial">
            {onResetCase && (
              <button
                type="button"
                onClick={onResetCase}
                className="px-2.5 sm:px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition cursor-pointer flex items-center justify-center gap-1.5 min-h-[42px] sm:min-h-[44px]"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="hidden sm:inline">Retry Case</span>
                <span className="sm:hidden text-[11px]">Retry</span>
              </button>
            )}

            {onNewCase && (
              <button
                type="button"
                onClick={onNewCase}
                className="px-2.5 sm:px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition cursor-pointer flex items-center justify-center gap-1.5 min-h-[42px] sm:min-h-[44px]"
              >
                <PlusCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="hidden sm:inline">Next Case</span>
                <span className="sm:hidden text-[11px]">Next</span>
              </button>
            )}

            {onDeleteCaseData && (
              <button
                type="button"
                onClick={onDeleteCaseData}
                title="Delete stored consultation data from browser storage"
                className="px-2.5 sm:px-3.5 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-white text-xs font-semibold border border-rose-800/60 transition cursor-pointer flex items-center justify-center gap-1.5 min-h-[42px] sm:min-h-[44px]"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span className="hidden sm:inline">Delete Case Data</span>
                <span className="sm:hidden text-[11px]">Delete</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
