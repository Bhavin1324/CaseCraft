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

const SCENARIOS = [
  {
    id: 'nux-vomica-acute',
    title: 'Acute Gastric Distress & Irritability',
    archetype: 'Nux Vomica archetype',
    difficulty: 'Introductory - Acute',
    patientName: 'Vikram Mehta (38 / M / Corporate Lawyer)',
    chiefComplaint: 'Severe acidic heartburn, cramping stomach pain, nausea with inability to vomit.',
    openingStatement: "Good day, Doctor. Thank you for fitting me in between my court briefs. I've had this agonizing sour burning in my stomach—it feels like a heavy stone pressing below my breastbone, and I'm constantly nauseous. Can you please give me something quick so I can return to work?",
    persona: {
      tone: 'impatient, hurried, stressed, irritable',
      background: 'Heavy work stress, late nights, 4-5 cups of espresso daily, spicy takeout, smoking.',
      hiddenTruths: {
        sensation: 'Epigastric sour burning and cramping like a stone',
        thermal: 'Extremely chilly (< cold wind, drafts; wraps up warmly)',
        thirst: 'Craves warm drinks; sips small-to-moderate warm water; cold drinks cause cramping',
        cravings: 'Craves spicy curries, coffee, alcohol; averse to rich fats',
        modalities: {
          agg: 'Aggravated in early morning (around 3:00 - 4:00 AM), after heavy eating, coffee, spicy food, tight clothing',
          amel: 'Ameliorated by warm drinks, hot applications on stomach, uninterrupted sleep'
        },
        bowels: 'Constant, ineffectual urging for stool; passes small amounts with incomplete feeling',
        mind: 'Quick-tempered, cannot bear contradiction or noise, hyper-sensitive to light and sound'
      }
    },
    hints: [
      'Did you check what time of morning the pain wakes him?',
      'Ask about his bowel habits—pay attention to the nature of urging.',
      'Check his sensitivity to cold drafts and tight waistbands.'
    ],
    expectedTotality: ['Nux Vomica', 'Lycopodium', 'Carbo Veg'],
    indicatedRemedy: 'Nux Vomica 200C'
  },
  {
    id: 'natrum-mur-migraine',
    title: 'Chronic Throbbing Hemicrania & Grief',
    archetype: 'Natrum Muriaticum archetype',
    difficulty: 'Intermediate - Chronic',
    patientName: 'Ananya Sen (29 / F / Software Designer)',
    chiefComplaint: 'Bursting, blinding right-sided headache recurring 3 times a week for 8 months.',
    openingStatement: "Hello Doctor... thank you for seeing me. I've been suffering with these unbearable, blinding headaches on the right side of my head. They keep recurring three times a week, and ordinary painkillers barely do anything anymore...",
    persona: {
      tone: 'quiet, reserved, polite, slightly guarded, tears up if asked about emotional hardships',
      background: 'Broke up from a 6-year relationship 10 months ago; lives alone; dislikes discussing sadness.',
      hiddenTruths: {
        sensation: 'Bursting, hammer-like pain in right temple',
        thermal: 'Warm-blooded / Hot patient (< heat of sun, warm room; craves open cool air)',
        thirst: 'Unquenchable thirst for large quantities of ice-cold water',
        cravings: 'Craves salt, chips, salty snacks; strong aversion to bread and slimy foods',
        modalities: {
          agg: 'Aggravated from 10:00 AM to 3:00 PM, direct sunlight, reading, mental strain, consolation (< weeping when consoled)',
          amel: 'Ameliorated in a dark quiet room, lying down, cold applications on temple, hard pressure'
        },
        bowels: 'Constipation with dry, crumbling stools',
        mind: 'Dwells on past disagreeable events; closed emotional demeanor; hates when people console her'
      }
    },
    hints: [
      'Observe her reaction if you try to offer consolation or sympathy.',
      'Ask about time of aggravation during the day and sunlight exposure.',
      'Inquire specifically about food cravings—especially salt/savory.'
    ],
    expectedTotality: ['Natrum Muriaticum', 'Sepia', 'Ignatia'],
    indicatedRemedy: 'Natrum Muriaticum 200C'
  },
  {
    id: 'chamomilla-pediatric',
    title: 'Infant Teething, Irritability & Colic',
    archetype: 'Chamomilla / Sulphur Pediatric',
    difficulty: 'Clinical Nuance - Pediatric',
    patientName: 'Baby Ayaan (14 months) with Mother Radhika',
    chiefComplaint: 'Violent screaming tantrums during teething, diarrhea with green watery stools smelling like bad eggs.',
    openingStatement: "Doctor, please help us! My 14-month-old baby Ayaan is teething and he has been screaming inconsolably day and night. His gums look fiery, he rejects his toys after demanding them, and his diapers have turned into foul, greenish watery stools. We are at our wit's end!",
    persona: {
      tone: 'frustrated, exhausted mother speaking for an inconsolable, snap-tempered child',
      background: 'Teething started 2 weeks ago; baby screams constantly, bites everything, rejects toys after demanding them.',
      hiddenTruths: {
        sensation: 'Acute violent gum and abdominal colic',
        thermal: 'Hot; one cheek red and hot, the other cheek pale and cold',
        thirst: 'Thirsty for cold water, drinks greedily and pushes cup away',
        cravings: 'Aversion to warm liquids; demands toys then throws them',
        modalities: {
          agg: 'Aggravated at night (9:00 PM to midnight), in open warm room, touch, anger',
          amel: 'Only ameliorated by being constantly carried rapidly or rocked'
        },
        stool: 'Chopped spinach / greenish mucous diarrhea with rotten egg odor',
        mind: 'Excessive irritability, hypersensitive to pain, weeping and striking when offered toys'
      }
    },
    hints: [
      'Ask what calms the baby down—is it rocking, feeding, or constant walking?',
      'Check facial appearance during the feverish episodes (heat/pallor).',
      'Inquire about the color and characteristic odor of the diaper stools.'
    ],
    expectedTotality: ['Chamomilla', 'Pulsatilla', 'Rheum'],
    indicatedRemedy: 'Chamomilla 30C'
  },
  {
    id: 'arsenicum-anxiety',
    title: 'Midnight Restlessness, Gastritis & Health Anxiety',
    archetype: 'Arsenicum Album archetype',
    difficulty: 'Advanced - Totality Synthesis',
    patientName: 'Kishore Joshi (54 / M / Accountant)',
    chiefComplaint: 'Burning epigastric pain with sudden midnight panic, palpitations, and fear of imminent death.',
    openingStatement: "Doctor, thank you so much for seeing me right away. I've been in absolute terror... for the past few weeks, I wake up past midnight around 1:00 AM with violent burning in my stomach and sudden panic attacks. I'm terrified that something fatal is happening to me.",
    persona: {
      tone: 'fastidious, nervous, impeccably organized folder, fearful, trembling voice',
      background: 'Episodes started after a mild food poisoning episode in monsoon 3 months ago.',
      hiddenTruths: {
        sensation: 'Burning pains like hot coals in stomach',
        thermal: 'Extremely chilly (< drafts, cold air; wrapped in woolen sweater even in autumn)',
        thirst: 'Thirst for frequent sips of warm water at short intervals; cold water sits like a stone',
        cravings: 'Craves warm soups, hot tea; aversion to cold drinks or cold meat',
        modalities: {
          agg: 'Aggravated past midnight (1:00 AM to 2:00 AM), cold food, lying flat',
          amel: 'Ameliorated by warmth in general, sitting upright, hot tea, reassurance of company'
        },
        bowels: 'Diarrhea with burning in anus after small offensive stool',
        mind: 'Extreme death anxiety, dread of incurable illness, obsessive neatness, cannot bear mess in room'
      }
    },
    hints: [
      'Notice how he drinks water (gulping vs small frequent sips).',
      'What time do the panic and burning pains peak at night?',
      'Explore his feelings about staying alone vs having family present.'
    ],
    expectedTotality: ['Arsenicum Album', 'Aconite', 'Phosphorus'],
    indicatedRemedy: 'Arsenicum Album 200C'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('simulator'); // 'simulator' | 'casesheet' | 'repertory' | 'interview'
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isRubricPaletteOpen, setIsRubricPaletteOpen] = useState(false);

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
    resetCurrentCase
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
            />
            <Composer
              onSend={sendMessage}
              isTyping={isTyping}
              disabled={isEvaluating}
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