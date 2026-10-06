import {
  Stethoscope,
  BookOpen,
  MessageSquare,
  Award,
  Clock,
  Settings,
  PlusCircle,
  FileText,
  PanelRightClose,
  PanelRightOpen,
  Command,
  Loader2
} from 'lucide-react';

export default function AppHeader({
  activeTab,
  setActiveTab,
  currentScenario,
  sessionSeconds,
  formatTimer,
  onOpenRubricPalette,
  onOpenGenerator,
  onOpenSettings,
  onRequestEvaluation,
  isEvaluating,
  isConfigured,
  provider,
  model,
  isRightSidebarOpen,
  setIsRightSidebarOpen,
  onOpenMobileDrawer
}) {
  const patientFirstName = currentScenario?.patientName?.split(' ')[0] || 'Patient';

  return (
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
            Classical Homeopathic Case-Taking &amp; Handover Simulator
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
          <span>Rubrics &amp; Materia</span>
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
          onClick={() => onRequestEvaluation?.()}
          disabled={isEvaluating}
          title="Finish Case & Request Senior Consultant Evaluation"
          className="px-2.5 py-1 sm:px-3 sm:py-1 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition cursor-pointer min-h-[36px]"
        >
          {isEvaluating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Award className="w-5 md:w-3.5 h-3.5 text-amber-300" />
          )}
          <span className="hidden sm:inline">Evaluate</span>
        </button>

        {/* Mobile Notes & Proctor Drawer Toggle (< xl) */}
        {activeTab === 'simulator' && (
          <button
            type="button"
            onClick={onOpenMobileDrawer}
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
  );
}
