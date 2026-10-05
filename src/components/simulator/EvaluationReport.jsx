import { useState } from 'react';
import {
  Award,
  X,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Sparkles,
  Printer,
  ShieldCheck,
  RotateCcw,
  PlusCircle,
  Check,
  Target,
  AlertCircle,
  HelpCircle,
  Pill,
  CheckCircle2,
  Copy,
  ChevronRight,
  MessageSquareQuote
} from 'lucide-react';

function RadialGauge({ value, max = 25, label, size = 56, strokeWidth = 4.5 }) {
  const numValue = Number(value) || 0;
  const numMax = Number(max) || 25;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(100, Math.max(0, (numValue / numMax) * 100));
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  const color =
    pct >= 80 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#f43f5e';

  return (
    <div className="flex flex-col items-center text-center p-2 rounded-xl bg-slate-900/60 border border-slate-800">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-slate-800"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-[11px] tabular-nums text-white">
          {numValue}/{numMax}
        </div>
      </div>
      <span className="text-[10px] font-medium text-slate-300 mt-1 line-clamp-1">{label}</span>
    </div>
  );
}

export default function EvaluationReport({
  report,
  scenario,
  isOpen = true,
  onClose,
  onResetCase,
  onNewCase
}) {
  const [mobileTab, setMobileTab] = useState('overview'); // 'overview' | 'simillimum' | 'rubrics' | 'critique'
  const [copiedRubric, setCopiedRubric] = useState(null);

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

  const numTotalScore = Math.min(100, Math.max(0, Math.round(Number(totalScore) || 75)));

  // Main score dial calculation
  const mainRadius = 44;
  const mainCircumference = 2 * Math.PI * mainRadius;
  const mainOffset = mainCircumference - (numTotalScore / 100) * mainCircumference;
  const mainColor =
    numTotalScore >= 80 ? '#10b981' : numTotalScore >= 65 ? '#f59e0b' : '#f43f5e';

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    setCopiedRubric(text);
    setTimeout(() => setCopiedRubric(null), 2000);
  };

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

        {/* Mobile Segmented Tab Strip (< md: visible, thumb-friendly navigation) */}
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
            {/* Top Score Summary Banner */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 items-center bg-slate-850/90 p-4 sm:p-5 rounded-2xl border border-slate-700/80 shadow-md">
              {/* Overall Radial Score Meter */}
              <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-700/80 pb-3 md:pb-0 md:pr-4">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Totality &amp; Readiness Score
                </span>
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
                  <svg className="w-24 h-24 sm:w-28 sm:h-28 -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r={mainRadius}
                      className="stroke-slate-800"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r={mainRadius}
                      stroke={mainColor}
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={mainCircumference}
                      strokeDashoffset={mainOffset}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {numTotalScore}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                      / 100
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-center">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border inline-block ${
                    numTotalScore >= 80
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : numTotalScore >= 65
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  }`}>
                    {numTotalScore >= 80
                      ? 'Ready for Senior Handover'
                      : numTotalScore >= 65
                      ? 'Solid Case with Minor Gaps'
                      : 'Needs Classical Refinement'}
                  </span>
                </div>
              </div>

              {/* 4 Pillar Breakdown Gauges */}
              <div className="md:col-span-8">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Four Pillar Hahnemannian Breakdown:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <RadialGauge value={lsmcScore} max={25} label="1. LSMC Totality" />
                  <RadialGauge value={generalsScore} max={25} label="2. Generals & Thirst" />
                  <RadialGauge value={communicationScore} max={25} label="3. Non-Leading Bias" />
                  <RadialGauge value={sbarScore} max={25} label="4. Handover Precision" />
                </div>
              </div>
            </div>

            {/* Senior Consultant Clinic Debrief Card */}
            <div className="bg-gradient-to-br from-emerald-950/40 via-slate-850/90 to-slate-900 border border-emerald-600/40 rounded-2xl p-4 sm:p-5 shadow-lg">
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
          </div>

          {/* SECTION 2: SIMILLIMUM, CONCORDANCE & DIFFERENTIALS */}
          <div className={`${mobileTab !== 'simillimum' ? 'hidden md:block' : ''} space-y-4`}>
            {/* Prescription Concordance Audit */}
            {prescriptionConcordance && (
              <div className={`p-4 rounded-2xl border shadow-lg space-y-2 ${
                prescriptionConcordance.status === 'exact_match'
                  ? 'bg-emerald-950/40 border-emerald-500/50'
                  : prescriptionConcordance.status === 'close_differential'
                  ? 'bg-amber-950/40 border-amber-500/50'
                  : prescriptionConcordance.status === 'mismatch'
                  ? 'bg-rose-950/40 border-rose-500/50'
                  : 'bg-slate-850/90 border-slate-700/80'
              }`}>
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
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                      prescriptionConcordance.status === 'exact_match'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : prescriptionConcordance.status === 'close_differential'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : prescriptionConcordance.status === 'mismatch'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
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
            )}

            {/* Confirmed Simillimum Spotlight Card (Gold Standard) */}
            {primarySimillimum && (
              <div className="bg-gradient-to-br from-emerald-950/60 via-slate-850/95 to-slate-900 border-2 border-emerald-500/50 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        Confirmed Simillimum (Gold Standard)
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400/80">Primary Medicine</span>
                    </div>
                    <div className="flex items-baseline gap-2.5 pt-1">
                      <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                        <Pill className="w-5 h-5 text-emerald-400" />
                        {primarySimillimum.name}
                      </h3>
                      {primarySimillimum.potency && (
                        <span className="text-xs font-mono font-bold text-teal-300 bg-teal-950/80 px-2.5 py-0.5 rounded-lg border border-teal-500/40">
                          {primarySimillimum.potency}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="sm:text-right text-[11px] text-slate-400">
                    <span className="text-slate-300 font-semibold block">Case Benchmark Target:</span>
                    <span>{scenario?.title}</span>
                  </div>
                </div>

                {/* Justification Box */}
                <div className="p-3 bg-slate-900/90 rounded-xl border border-emerald-900/50 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    Materia Medica Prescription Justification:
                  </span>
                  <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed font-serif">
                    {primarySimillimum.justification}
                  </p>
                </div>

                {/* Keynotes Confirming Simillimum */}
                {Array.isArray(primarySimillimum.keynotesConfirming) && primarySimillimum.keynotesConfirming.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Confirming Individualizing Keynotes (Aphorism 153):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2">
                      {primarySimillimum.keynotesConfirming.map((kn, idx) => (
                        <div
                          key={idx}
                          className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{kn}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Differential Remedies & Ruling-Out Criteria Grid */}
            {Array.isArray(otherDifferentials) && otherDifferentials.length > 0 && (
              <div className="bg-slate-850/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
                <div className="flex items-center justify-between border-b border-slate-700/70 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    Differential Remedies &amp; Ruling-Out Criteria
                  </h4>
                  <span className="text-[10px] text-slate-400">Totality Differentiation</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                  {otherDifferentials.map((diff, i) => {
                    const remedyName =
                      typeof diff === 'string'
                        ? diff
                        : diff?.name || diff?.remedy || `Differential #${i + 1}`;
                    const reasonConsidered =
                      typeof diff === 'object' && diff !== null
                        ? diff.reason || diff.justification || ''
                        : '';
                    const reasonRuledOut =
                      typeof diff === 'object' && diff !== null
                        ? diff.reasonRuledOut || ''
                        : '';
                    const potency =
                      typeof diff === 'object' && diff !== null
                        ? diff.potency || '30C'
                        : '';

                    return (
                      <div
                        key={i}
                        className="p-3 sm:p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-white text-xs">{remedyName}</span>
                            <div className="flex items-center gap-1 shrink-0">
                              {potency && (
                                <span className="text-[9px] font-mono text-teal-300 bg-teal-950/60 px-1.5 py-0.2 rounded border border-teal-500/30">
                                  {potency}
                                </span>
                              )}
                              <span className="text-[10px] text-slate-400 font-mono">Diff #{i + 1}</span>
                            </div>
                          </div>

                          {reasonConsidered && (
                            <div className="text-[11px] text-slate-300 leading-normal">
                              <span className="text-slate-400 text-[10px] font-semibold block uppercase tracking-wider">
                                Why Considered:
                              </span>
                              {reasonConsidered}
                            </div>
                          )}

                          {reasonRuledOut && (
                            <div className="text-[11px] text-amber-300/90 bg-amber-950/30 border border-amber-900/40 rounded-lg p-2 leading-normal">
                              <span className="text-amber-400 text-[10px] font-semibold block uppercase tracking-wider">
                                Why Ruled Out:
                              </span>
                              {reasonRuledOut}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: REPERTORY RUBRICS (Mobile Card Layout) */}
          <div className={`${mobileTab !== 'rubrics' ? 'hidden md:block' : ''} space-y-3`}>
            <div className="flex items-center justify-between border-b border-slate-700/70 pb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                Kent Repertory Rubric Formulations
              </h4>
              <span className="text-[10px] text-slate-400">Patient Language → Repertorial Language</span>
            </div>

            {Array.isArray(suggestedRubrics) && suggestedRubrics.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {suggestedRubrics.map((r, i) => {
                  if (typeof r === 'object' && r !== null) {
                    const rubricText = r.kentRubric || r.rubric || r.title || 'Kent Repertory Rubric';
                    const quote = r.patientQuote || r.quote || '';
                    const significance = r.remedySignificance || r.significance || '';
                    const isCopied = copiedRubric === rubricText;

                    return (
                      <div
                        key={i}
                        className="p-3.5 bg-slate-850/90 rounded-2xl border border-indigo-900/40 shadow-md space-y-2 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          {quote && (
                            <div className="flex items-start gap-1.5 text-slate-300 italic text-[11px]">
                              <MessageSquareQuote className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                              <span>&ldquo;{quote}&rdquo;</span>
                            </div>
                          )}

                          <div className="p-2 rounded-xl bg-slate-900 border border-indigo-950/60 flex items-center justify-between gap-2">
                            <span className="font-mono text-[11px] font-bold text-indigo-300 break-all">
                              {rubricText}
                            </span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(rubricText)}
                              title="Copy Kent Rubric"
                              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer shrink-0"
                            >
                              {isCopied ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>

                          {significance && (
                            <p className="text-[10px] text-slate-400 leading-relaxed">
                              {significance}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div key={i} className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-indigo-300 font-mono text-[11px]">
                      {String(r)}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-400 italic text-[11px] p-4 text-center">
                No specific rubric formulations suggested for this transcript.
              </p>
            )}
          </div>

          {/* SECTION 4: CLINICAL ANALYSIS & BLINDSPOTS */}
          <div className={`${mobileTab !== 'critique' ? 'hidden md:block' : ''} space-y-3`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Clinical Strengths */}
              <div className="bg-slate-850/90 border border-slate-700/80 rounded-2xl p-4 shadow-lg space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  Clinical Strengths Demonstrated (Aphorism 84)
                </h4>
                <ul className="space-y-1.5">
                  {Array.isArray(strengths) && strengths.length > 0 ? (
                    strengths.map((str, i) => {
                      const text = typeof str === 'string' ? str : str?.point || str?.text || String(str);
                      return (
                        <li key={i} className="flex items-start gap-2 text-slate-300 text-[11px]">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{text}</span>
                        </li>
                      );
                    })
                  ) : (
                    <li className="text-slate-400 italic text-[11px]">Maintained professional clinical presence.</li>
                  )}
                </ul>
              </div>

              {/* Crucial Missed Questions */}
              <div className="bg-slate-850/90 border border-slate-700/80 rounded-2xl p-4 shadow-lg space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Crucial Inquiries Missed (Aphorism 84 Blindspots)
                </h4>
                <ul className="space-y-1.5">
                  {Array.isArray(missedQuestions) && missedQuestions.length > 0 ? (
                    missedQuestions.map((q, i) => {
                      const text = typeof q === 'string' ? q : q?.question || q?.text || String(q);
                      return (
                        <li key={i} className="flex items-start gap-2 text-slate-300 text-[11px]">
                          <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{text}</span>
                        </li>
                      );
                    })
                  ) : (
                    <li className="text-slate-400 italic text-[11px]">No critical modalities were overlooked!</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions: Sticky at bottom, safe-area padded for mobile thumb zone */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900/95 shrink-0 flex items-center justify-between gap-2.5 pb-[max(env(safe-area-inset-bottom),12px)]">
          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
            {onResetCase && (
              <button
                type="button"
                onClick={onResetCase}
                className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Retry Case</span>
                <span className="sm:hidden">Retry</span>
              </button>
            )}

            {onNewCase && (
              <button
                type="button"
                onClick={onNewCase}
                className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Next Case</span>
                <span className="sm:hidden">Next</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 active:from-emerald-700 active:to-teal-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/40 transition cursor-pointer min-h-[44px] flex items-center justify-center gap-1.5"
          >
            <span>Close &amp; Return</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
