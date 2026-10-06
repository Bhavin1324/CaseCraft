import { useState } from 'react';
import { useApi } from './context/ApiContext';
import { usePatientSimulator } from './hooks/usePatientSimulator';
import AppLayout from './components/layout/AppLayout';
import ChatArena from './components/simulator/ChatArena';
import Composer from './components/simulator/Composer';
import CaseSheet from './components/case-sheet/CaseSheet';
import RubricPalette from './components/rubrics/RubricPalette';
import SbarTrainer from './components/sbar/SbarTrainer';
import EvaluationReport from './components/simulator/EvaluationReport';
import SettingsModal from './components/common/SettingsModal';
import CaseGeneratorModal from './components/simulator/CaseGeneratorModal';
import PrescribeModal from './components/simulator/PrescribeModal';
import { SCENARIOS } from './data/curatedScenarios';

export default function App() {
  const [activeTab, setActiveTab] = useState('simulator'); // 'simulator' | 'casesheet' | 'repertory' | 'interview'
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isRubricPaletteOpen, setIsRubricPaletteOpen] = useState(false);
  const [isPrescribeOpen, setIsPrescribeOpen] = useState(false);
  const [composerText, setComposerText] = useState('');

  // API Context & Settings
  const {
    isConfigured,
    provider,
    model,
    setIsSettingsOpen,
    globalNotice,
    dismissNotice
  } = useApi();

  // Patient Simulator Hook
  const {
    scenariosList,
    selectedScenarioId,
    currentScenario,
    messages,
    isTyping,
    isEvaluating,
    evaluationReport,
    setEvaluationReport,
    caseNotes,
    setCaseNotes,
    probedCategories,
    sendMessage,
    requestEvaluation,
    switchScenario,
    loadDynamicScenario,
    resetCurrentCase,
    isSessionRestored,
    prescribeAndEvaluate,
    clearStoredCase
  } = usePatientSimulator(SCENARIOS);

  return (
    <>
      <AppLayout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentScenario={currentScenario}
        scenariosList={scenariosList}
        selectedScenarioId={selectedScenarioId}
        onSwitchScenario={switchScenario}
        onOpenGenerator={() => setIsGeneratorOpen(true)}
        onResetCase={resetCurrentCase}
        onRequestEvaluation={requestEvaluation}
        isEvaluating={isEvaluating}
        probedCategories={probedCategories}
        caseNotes={caseNotes}
        setCaseNotes={setCaseNotes}
        isConfigured={isConfigured}
        provider={provider}
        model={model}
        onOpenSettings={() => setIsSettingsOpen(true)}
        globalNotice={globalNotice}
        dismissNotice={dismissNotice}
        onOpenRubricPalette={() => setIsRubricPaletteOpen(true)}
      >
        {/* TAB 1: CONSULTATION ARENA */}
        {activeTab === 'simulator' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <ChatArena
              messages={messages}
              isTyping={isTyping}
              scenario={currentScenario}
              model={model}
              isConfigured={isConfigured}
              probedCategories={probedCategories}
              onOpenPrescribe={() => setIsPrescribeOpen(true)}
              onInsertProbe={(query) => setComposerText(query)}
              isSessionRestored={isSessionRestored}
              onResetCase={resetCurrentCase}
            />
            <Composer
              onSend={sendMessage}
              isTyping={isTyping}
              disabled={isEvaluating}
              onOpenPrescribe={() => setIsPrescribeOpen(true)}
              text={composerText}
              setText={setComposerText}
            />
          </div>
        )}

        {/* TAB 2: STRUCTURED CASE SHEET PROFORMA */}
        {activeTab === 'casesheet' && (
          <CaseSheet
            scenario={currentScenario}
            caseNotes={caseNotes}
            setCaseNotes={setCaseNotes}
            onRequestEvaluation={requestEvaluation}
            isEvaluating={isEvaluating}
          />
        )}

        {/* TAB 3: KENTIAN RUBRICS & MATERIA MEDICA */}
        {activeTab === 'repertory' && (
          <RubricPalette
            onSelectRubric={(rubric) => {
              setCaseNotes((prev) => ({
                ...prev,
                modalityAgg: prev.modalityAgg ? `${prev.modalityAgg}; ${rubric}` : rubric
              }));
            }}
          />
        )}

        {/* TAB 4: 60-SECOND SBAR HANDOVER DRILL */}
        {activeTab === 'interview' && (
          <SbarTrainer
            scenario={currentScenario}
            caseNotes={caseNotes}
          />
        )}
      </AppLayout>

      {/* Global Modals */}
      <SettingsModal />

      <CaseGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onCaseGenerated={loadDynamicScenario}
        curatedScenarios={scenariosList}
        onSelectCurated={switchScenario}
      />

      <EvaluationReport
        report={evaluationReport}
        scenario={currentScenario}
        isOpen={Boolean(evaluationReport)}
        onClose={() => setEvaluationReport(null)}
        onResetCase={() => {
          setEvaluationReport(null);
          resetCurrentCase();
        }}
        onNewCase={() => {
          setEvaluationReport(null);
          setIsGeneratorOpen(true);
        }}
        onDeleteCaseData={() => {
          setEvaluationReport(null);
          clearStoredCase();
        }}
      />

      <PrescribeModal
        isOpen={isPrescribeOpen}
        onClose={() => setIsPrescribeOpen(false)}
        scenario={currentScenario}
        onPrescribe={prescribeAndEvaluate}
        caseNotes={caseNotes}
      />

      <RubricPalette
        isModal
        isOpen={isRubricPaletteOpen}
        onClose={() => setIsRubricPaletteOpen(false)}
        onSelectRubric={(rubric) => {
          setCaseNotes((prev) => ({
            ...prev,
            modalityAgg: prev.modalityAgg ? `${prev.modalityAgg}; ${rubric}` : rubric
          }));
          setIsRubricPaletteOpen(false);
        }}
      />
    </>
  );
}