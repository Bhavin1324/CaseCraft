import { useState, useEffect } from 'react';
import {
  Stethoscope,
  BookOpen,
  MessageSquare,
  Award,
  CheckCircle,
  Clock,
  Sparkles,
  RotateCcw,
  Thermometer,
  Brain,
  Droplets,
  ShieldCheck,
  FileText,
  User,
  Settings,
  PlusCircle,
  AlertCircle,
  X,
  PanelRightClose,
  PanelRightOpen,
  Command,
  Loader2
} from 'lucide-react';

export default function AppLayout({
  activeTab,
  setActiveTab,
  currentScenario,
  scenariosList = [],
  selectedScenarioId,
  onSwitchScenario,
  onOpenGenerator,
  onResetCase,
  onRequestEvaluation,
  isEvaluating,
  probedCategories = {},
  caseNotes = {},
  setCaseNotes,
  isConfigured,
  provider,
  model,
  onOpenSettings,
  globalNotice,
  dismissNotice,
  onOpenRubricPalette,
  children
}) {
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Session elapsed timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`;
  };

  const probedCount = Object.values(probedCategories).filter(Boolean).length;
  const patientFirstName = currentScenario?.patientName?.split(' ')[0] || 'Patient';

  return (
    <div className="h-[100dvh] flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Global Alert Notification Banner */}
      {globalNotice && (
        <div
          className={`px-4 py-1.5 text-xs flex items-center justify-between border-b shrink-0 z-50 ${
            globalNotice.type === 'warning'
              ? 'bg-amber-950/90 border-amber-600/50 text-amber-200'
              : globalNotice.type === 'error'
              ? 'bg-rose-950/90 border-rose-600/50 text-rose-200'
              : 'bg-emerald-950/90 border-emerald-600/50 text-emerald-200'
          }`}
        >
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="flex-1 text-[11px] sm:text-xs font-medium">{globalNotice.message}</span>
            <button
              onClick={dismissNotice}
              className="text-xs p-1 hover:opacity-75 transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Top Application Header (Fixed 52px) */}
      <header className="h-[52px] border-b border-slate-800 bg-slate-900/90 backdrop-blur-md shrink-0 px-3 sm:px-5 flex items-center justify-between gap-3 z-40">
        {/* Left: Brand / Mobile Patient Info */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20 font-bold shrink-0">
            <Stethoscope className="w-4 h-4 stroke-[2.4]" />
          </div>

          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-tight text-white">
                CaseCraft
              </h1>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                Aphorisms 83–104
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-none">
              Classical Homeopathic Case-Taking & Handover Simulator
            </p>
          </div>

          {/* Mobile Patient Header Pill */}
          <div className="sm:hidden flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-800 border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-bold text-white max-w-[130px] truncate">
              {patientFirstName}
            </span>
          </div>
        </div>

        {/* Center: Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-850 p-1 rounded-xl border border-slate-700/80">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer min-h-[36px] ${
              activeTab === 'simulator'
                ? 'bg-emerald-600 text-white font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Consult Arena</span>
          </button>

          <button
            onClick={() => setActiveTab('casesheet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer min-h-[36px] ${
              activeTab === 'casesheet'
                ? 'bg-emerald-600 text-white font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Case Sheet (Aphorisms 83-104)</span>
          </button>

          <button
            onClick={() => setActiveTab('repertory')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer min-h-[36px] ${
              activeTab === 'repertory'
                ? 'bg-emerald-600 text-white font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Rubrics & Materia</span>
          </button>

          <button
            onClick={() => setActiveTab('interview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer min-h-[36px] ${
              activeTab === 'interview'
                ? 'bg-emerald-600 text-white font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>60s SBAR Drill</span>
          </button>
        </nav>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2">
          {/* Clinical Session Timer */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 text-[11px] text-slate-300 font-mono tabular-nums">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>{formatTimer(sessionSeconds)}</span>
          </div>

          {/* Quick Command Palette Button */}
          {onOpenRubricPalette && (
            <button
              onClick={onOpenRubricPalette}
              title="Open Kentian Rubric Palette (Cmd+K)"
              className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono transition cursor-pointer min-h-[36px]"
            >
              <Command className="w-3 h-3 text-emerald-400" />
              <span>K</span>
            </button>
          )}

          {/* New Case Generator Button */}
          <button
            onClick={onOpenGenerator}
            title="Generate New Dynamic Clinical Case"
            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer min-h-[36px]"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Case</span>
          </button>

          {/* API Engine Settings */}
          <button
            onClick={onOpenSettings}
            title={
              isConfigured
                ? `${provider === 'gemini' ? 'Gemini' : 'OpenAI'} (${model}) - Click to configure`
                : 'Offline Mode - Click to configure Gemini / OpenAI key'
            }
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition cursor-pointer min-h-[36px] ${
              isConfigured
                ? 'bg-slate-800 border-emerald-500/50 text-emerald-300 hover:bg-slate-700'
                : 'bg-amber-950/40 border-amber-500/50 text-amber-300 hover:bg-amber-900/40'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className="hidden sm:inline text-[11px]">
              {isConfigured ? (provider === 'gemini' ? 'Gemini Live' : 'OpenAI Live') : 'Offline Mode'}
            </span>
            <Settings className="w-3.5 h-3.5" />
          </button>

          {/* Direct Proctor Evaluation Button */}
          <button
            type="button"
            onClick={onRequestEvaluation}
            disabled={isEvaluating}
            title="Finish Case & Request Senior Consultant Evaluation"
            className="px-2.5 py-1 sm:px-3 sm:py-1 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition cursor-pointer min-h-[36px]"
          >
            {isEvaluating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Award className="w-3.5 h-3.5 text-amber-300" />
            )}
            <span className="hidden sm:inline">Evaluate</span>
          </button>

          {/* Mobile Notes & Proctor Drawer Toggle (< xl) */}
          {activeTab === 'simulator' && (
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              title="Open Live Case Notes & Senior Proctor"
              className="xl:hidden flex items-center justify-center p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer min-h-[36px] min-w-[36px]"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
            </button>
          )}

          {/* Right Sidebar Collapse Toggle (Desktop only) */}
          {activeTab === 'simulator' && (
            <button
              onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
              title={isRightSidebarOpen ? 'Collapse Case Notes' : 'Expand Case Notes'}
              className="hidden xl:flex items-center justify-center p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer min-h-[36px] min-w-[36px]"
            >
              {isRightSidebarOpen ? (
                <PanelRightClose className="w-4 h-4 text-emerald-400" />
              ) : (
                <PanelRightOpen className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </header>

      {/* Main Workstation Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* DESKTOP 3-PANE LAYOUT (when activeTab === 'simulator') */}
        {activeTab === 'simulator' ? (
          <div className="flex-1 flex overflow-hidden">
            {/* PANE 1: LEFT SIDEBAR (280px fixed width - Patient Profile & Progress) */}
            <aside className="hidden lg:flex flex-col w-[280px] bg-slate-900 border-r border-slate-800/80 p-4 space-y-4 overflow-y-auto shrink-0">
              {/* Patient Profile Card */}
              <div className="bg-slate-850/90 border border-slate-700/80 rounded-2xl p-4 shadow-md space-y-3">
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
              <div className="bg-slate-850/90 border border-slate-700/80 rounded-2xl p-4 shadow-md space-y-3">
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
                    <span className="text-[11px] font-medium">1. Location & Sensation</span>
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
                      4. Thirst & Cravings
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
                      5. Mind & Disposition
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
                <div className="bg-slate-850/90 border border-slate-700/80 rounded-2xl p-3.5 shadow-md">
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

            {/* PANE 2: MAIN CONVERSATION STREAM */}
            <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950 relative">
              {children}
            </main>

            {/* PANE 3: RIGHT COLLAPSIBLE SIDEBAR (360px - Case Scratchpad & Proctor) */}
            {isRightSidebarOpen && (
              <aside className="hidden xl:flex flex-col w-[360px] bg-slate-900 border-l border-slate-800/80 p-4 space-y-4 overflow-y-auto shrink-0">
                {/* Doctor's Scratchpad */}
                <div className="bg-slate-850/90 border border-slate-700/80 rounded-2xl p-4 shadow-md space-y-3 flex-1 flex flex-col">
                  <div className="flex items-center justify-between border-b border-slate-700/70 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      Live Case Notes Scratchpad
                    </span>
                    <span className="text-[10px] text-slate-400">Included in AI Evaluation</span>
                  </div>

                  <div className="space-y-2 text-xs flex-1 flex flex-col">
                    <div>
                      <label className="text-[10px] text-slate-400 font-medium block mb-0.5">
                        Chief Sensation & Modalities (&lt; / &gt;)
                      </label>
                      <textarea
                        rows={3}
                        value={caseNotes.modalityAgg || ''}
                        onChange={(e) =>
                          setCaseNotes((prev) => ({ ...prev, modalityAgg: e.target.value }))
                        }
                        placeholder="e.g. Epigastric burning < 3 AM, cold drafts; > warm drinks, rest..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 font-medium block mb-0.5">
                        Physical Generals (Thermals & Thirst)
                      </label>
                      <textarea
                        rows={3}
                        value={caseNotes.thermalState || ''}
                        onChange={(e) =>
                          setCaseNotes((prev) => ({ ...prev, thermalState: e.target.value }))
                        }
                        placeholder="e.g. Chilly patient, craves warm drinks in small sips..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 font-medium block mb-0.5">
                        Mental Disposition & Working Totality
                      </label>
                      <textarea
                        rows={3}
                        value={caseNotes.mentalState || ''}
                        onChange={(e) =>
                          setCaseNotes((prev) => ({ ...prev, mentalState: e.target.value }))
                        }
                        placeholder="e.g. Irritable, hurried, cannot bear noise..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Senior Consultant Evaluation Proctor Button */}
                <div className="bg-slate-850/90 border border-slate-700/80 rounded-2xl p-4 shadow-md space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-400" />
                      Senior Mentor Proctor
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">Agent B</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    When you have collected a Hahnemannian totality, submit the transcript to receive a graded clinical scorecard.
                  </p>

                  <button
                    type="button"
                    onClick={onRequestEvaluation}
                    disabled={isEvaluating}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition cursor-pointer min-h-[44px]"
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
              </aside>
            )}
          </div>
        ) : (
          /* FULL WIDTH CONTAINER FOR OTHER TABS (CaseSheet, Repertory, SBAR) */
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950">
            <div className="max-w-6xl mx-auto w-full pb-16 md:pb-6">{children}</div>
          </main>
        )}
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR (Visible < md, 48px height with safe area padding) */}
      <nav
        className="md:hidden border-t border-slate-800 bg-slate-900/90 backdrop-blur-md px-2 py-1.5 flex items-center justify-around shrink-0 z-40"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)' }}
      >
        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition cursor-pointer min-h-[44px] ${
            activeTab === 'simulator'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Consult</span>
        </button>

        <button
          onClick={() => setActiveTab('casesheet')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition cursor-pointer min-h-[44px] ${
            activeTab === 'casesheet'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Case Sheet</span>
        </button>

        <button
          onClick={() => setActiveTab('repertory')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition cursor-pointer min-h-[44px] ${
            activeTab === 'repertory'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Rubrics</span>
        </button>

        <button
          onClick={() => setActiveTab('interview')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition cursor-pointer min-h-[44px] ${
            activeTab === 'interview'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">60s SBAR</span>
        </button>
      </nav>

      {/* Mobile/Tablet Slide-Over Drawer for Case Notes & Proctor (< xl) */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 xl:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-over panel */}
          <div className="relative ml-auto w-full max-w-md bg-slate-900 border-l border-slate-800 flex flex-col h-full shadow-2xl z-10 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-850">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Case Notes & Proctor
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Doctor's Scratchpad */}
              <div className="bg-slate-850/90 border border-slate-700/80 rounded-2xl p-4 shadow-md space-y-3">
                <div className="flex items-center justify-between border-b border-slate-700/70 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    Live Case Notes Scratchpad
                  </span>
                  <span className="text-[10px] text-slate-400">Included in AI Evaluation</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 font-medium block mb-0.5">
                      Chief Sensation & Modalities (&lt; / &gt;)
                    </label>
                    <textarea
                      rows={3}
                      value={caseNotes.modalityAgg || ''}
                      onChange={(e) =>
                        setCaseNotes((prev) => ({ ...prev, modalityAgg: e.target.value }))
                      }
                      placeholder="e.g. Epigastric burning < 3 AM, cold drafts; > warm drinks, rest..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-medium block mb-0.5">
                      Physical Generals (Thermals & Thirst)
                    </label>
                    <textarea
                      rows={3}
                      value={caseNotes.thermalState || ''}
                      onChange={(e) =>
                        setCaseNotes((prev) => ({ ...prev, thermalState: e.target.value }))
                      }
                      placeholder="e.g. Chilly patient, craves warm drinks in small sips..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-medium block mb-0.5">
                      Mental Disposition & Working Totality
                    </label>
                    <textarea
                      rows={3}
                      value={caseNotes.mentalState || ''}
                      onChange={(e) =>
                        setCaseNotes((prev) => ({ ...prev, mentalState: e.target.value }))
                      }
                      placeholder="e.g. Irritable, hurried, cannot bear noise..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Senior Consultant Evaluation Proctor Button */}
              <div className="bg-slate-850/90 border border-slate-700/80 rounded-2xl p-4 shadow-md space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-400" />
                    Senior Mentor Proctor
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">Agent B</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  When you have collected a Hahnemannian totality, submit the transcript to receive a graded clinical scorecard.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    onRequestEvaluation();
                  }}
                  disabled={isEvaluating}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition cursor-pointer min-h-[44px]"
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
