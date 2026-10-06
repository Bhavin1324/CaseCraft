import { useState, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';
import AppHeader from './AppHeader';
import AppMobileNav from './AppMobileNav';
import PatientSidebar from './PatientSidebar';
import ScratchpadSidebar from './ScratchpadSidebar';
import MobileDrawer from './MobileDrawer';

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

      {/* Top Application Header */}
      <AppHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentScenario={currentScenario}
        sessionSeconds={sessionSeconds}
        formatTimer={formatTimer}
        onOpenRubricPalette={onOpenRubricPalette}
        onOpenGenerator={onOpenGenerator}
        onOpenSettings={onOpenSettings}
        onRequestEvaluation={onRequestEvaluation}
        isEvaluating={isEvaluating}
        isConfigured={isConfigured}
        provider={provider}
        model={model}
        isRightSidebarOpen={isRightSidebarOpen}
        setIsRightSidebarOpen={setIsRightSidebarOpen}
        onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
      />

      {/* Main Workstation Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'simulator' ? (
          <div className="flex-1 flex overflow-hidden">
            {/* PANE 1: LEFT SIDEBAR (Patient Profile & Progress) */}
            <PatientSidebar
              currentScenario={currentScenario}
              scenariosList={scenariosList}
              selectedScenarioId={selectedScenarioId}
              onSwitchScenario={onSwitchScenario}
              probedCategories={probedCategories}
              onResetCase={onResetCase}
            />

            {/* PANE 2: MAIN CONVERSATION STREAM */}
            <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950 relative">
              {children}
            </main>

            {/* PANE 3: RIGHT COLLAPSIBLE SIDEBAR (Case Scratchpad & Proctor) */}
            {isRightSidebarOpen && (
              <aside className="hidden xl:flex flex-col w-[360px] bg-slate-900 border-l border-slate-800/80 p-4 space-y-4 overflow-y-auto shrink-0">
                <ScratchpadSidebar
                  caseNotes={caseNotes}
                  setCaseNotes={setCaseNotes}
                  onRequestEvaluation={onRequestEvaluation}
                  isEvaluating={isEvaluating}
                />
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

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <AppMobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Mobile/Tablet Slide-Over Drawer for Case Notes & Proctor (< xl) */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
      >
        <ScratchpadSidebar
          caseNotes={caseNotes}
          setCaseNotes={setCaseNotes}
          onRequestEvaluation={onRequestEvaluation}
          isEvaluating={isEvaluating}
          onAfterEvaluate={() => setIsMobileDrawerOpen(false)}
        />
      </MobileDrawer>
    </div>
  );
}
