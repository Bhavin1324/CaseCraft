import { useState, useCallback, useRef, useEffect } from 'react';
import { useApi } from '../context/ApiContext';
import {
  chatWithPatient,
  evaluateCaseTaking,
  generateLocalHeuristicResponse
} from '../services/geminiService';
import { storageService } from '../services/storageService';

// Standalone heuristic analyzer using functional state updates
function analyzeDoctorQuery(queryText, setProbedCategories) {
  const lower = (queryText || '').toLowerCase();
  setProbedCategories((prev) => {
    const updated = { ...prev };
    if (
      lower.includes('where') ||
      lower.includes('feel') ||
      lower.includes('pain') ||
      lower.includes('sensation') ||
      lower.includes('type of') ||
      lower.includes('describe')
    ) {
      updated.lsmc = true;
    }
    if (
      lower.includes('hot') ||
      lower.includes('cold') ||
      lower.includes('weather') ||
      lower.includes('fan') ||
      lower.includes('breeze') ||
      lower.includes('draft') ||
      lower.includes('winter') ||
      lower.includes('summer') ||
      lower.includes('cover')
    ) {
      updated.thermal = true;
    }
    if (
      lower.includes('water') ||
      lower.includes('thirst') ||
      lower.includes('sip') ||
      lower.includes('drink') ||
      lower.includes('gulp') ||
      lower.includes('dry') ||
      lower.includes('craving') ||
      lower.includes('crave')
    ) {
      updated.thirst = true;
    }
    if (
      lower.includes('worse') ||
      lower.includes('better') ||
      lower.includes('aggravat') ||
      lower.includes('relief') ||
      lower.includes('time') ||
      lower.includes('morning') ||
      lower.includes('night') ||
      lower.includes('pressure') ||
      lower.includes('lying') ||
      lower.includes('motion')
    ) {
      updated.modalities = true;
    }
    if (
      lower.includes('stress') ||
      lower.includes('anger') ||
      lower.includes('sad') ||
      lower.includes('worry') ||
      lower.includes('cry') ||
      lower.includes('comfort') ||
      lower.includes('temper') ||
      lower.includes('irritat') ||
      lower.includes('alone') ||
      lower.includes('mood') ||
      lower.includes('grief')
    ) {
      updated.mind = true;
    }
    if (
      lower.includes('past') ||
      lower.includes('family') ||
      lower.includes('before') ||
      lower.includes('history') ||
      lower.includes('tuberculosis') ||
      lower.includes('allergy')
    ) {
      updated.pastHistory = true;
    }
    return updated;
  });
}

function getInitialMessages(scenario) {
  const patientName = scenario?.patientName || 'Patient';
  const chiefComplaint = scenario?.chiefComplaint || 'Presenting complaint';
  const openingText =
    scenario?.openingStatement ||
    scenario?.persona?.openingGreeting ||
    `Hello Doctor... thank you for seeing me. I've been suffering with ${chiefComplaint.toLowerCase().replace(/\.$/, '')}. It has really been troubling me, and I was hoping homeopathy could help.`;

  return [
    {
      sender: 'system',
      text: `Patient entered clinic: ${patientName}. Chief complaint: "${chiefComplaint}". Interview in progress (Organon Aphorisms 83–104).`
    },
    {
      sender: 'patient',
      text: openingText
    }
  ];
}

export function usePatientSimulator(initialScenarios) {
  const { activeApiKey, provider, model, isConfigured, notify } = useApi();

  // Attempt to restore interrupted session from localStorage
  const savedSession = storageService.loadActiveSession();

  const [scenariosList, setScenariosList] = useState(() => {
    if (savedSession?.scenariosList && Array.isArray(savedSession.scenariosList)) {
      return savedSession.scenariosList;
    }
    return initialScenarios || [];
  });

  const [selectedScenarioId, setSelectedScenarioId] = useState(() => {
    if (savedSession?.scenarioId) {
      return savedSession.scenarioId;
    }
    return initialScenarios?.[0]?.id || 'nux-vomica-acute';
  });

  const currentScenario =
    scenariosList.find((s) => s.id === selectedScenarioId) || scenariosList[0];

  const [messages, setMessages] = useState(() => {
    if (
      savedSession?.messages &&
      Array.isArray(savedSession.messages) &&
      savedSession.messages.length > 0
    ) {
      return savedSession.messages;
    }
    return getInitialMessages(currentScenario);
  });

  const [isTyping, setIsTyping] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationReport, setEvaluationReport] = useState(() => savedSession?.evaluationReport || null);

  const [caseNotes, setCaseNotes] = useState(() => {
    if (savedSession?.caseNotes && typeof savedSession.caseNotes === 'object') {
      return savedSession.caseNotes;
    }
    return {
      location: '',
      sensation: '',
      modalityAgg: '',
      modalityAmel: '',
      concomitants: '',
      thermalState: '',
      thirstAppetite: '',
      cravingsAversions: '',
      mentalGenerals: '',
      rubricsIdentified: '',
      provisionalTotality: ''
    };
  });

  const [probedCategories, setProbedCategories] = useState(() => {
    if (savedSession?.probedCategories && typeof savedSession.probedCategories === 'object') {
      return savedSession.probedCategories;
    }
    return {
      lsmc: false,
      thermal: false,
      thirst: false,
      modalities: false,
      mind: false,
      pastHistory: false
    };
  });

  const [isSessionRestored, setIsSessionRestored] = useState(() =>
    Boolean(savedSession && savedSession.messages?.length > 2)
  );

  const lastErrorRef = useRef(null);

  // Auto-save session state to localStorage on state modifications
  useEffect(() => {
    const hasDoctorInteracted =
      messages.length > 2 ||
      Object.values(caseNotes).some((v) => typeof v === 'string' && v.trim().length > 0) ||
      evaluationReport !== null;

    if (hasDoctorInteracted) {
      storageService.saveActiveSession({
        scenarioId: selectedScenarioId,
        currentScenario,
        scenariosList,
        messages,
        caseNotes,
        probedCategories,
        evaluationReport
      });
    }
  }, [
    selectedScenarioId,
    currentScenario,
    scenariosList,
    messages,
    caseNotes,
    probedCategories,
    evaluationReport
  ]);

  /**
   * Send doctor message to Agent A (Simulated Patient)
   */
  const sendMessage = useCallback(
    async (userText) => {
      if (!userText || !userText.trim()) return;

      const trimmed = userText.trim();
      analyzeDoctorQuery(trimmed, setProbedCategories);

      const updatedHistory = [...messages, { sender: 'doctor', text: trimmed }];
      setMessages(updatedHistory);
      setIsTyping(true);
      lastErrorRef.current = null;

      try {
        if (isConfigured) {
          // Call Gemini / OpenAI Dual-Agent System
          const aiReply = await chatWithPatient({
            apiKey: activeApiKey,
            provider,
            model,
            scenario: currentScenario,
            messages: updatedHistory
          });

          setMessages((prev) => [...prev, { sender: 'patient', text: aiReply }]);
        } else {
          // Fallback to local heuristic engine with a realistic human delay
          await new Promise((r) => setTimeout(r, 650));
          const localReply = generateLocalHeuristicResponse(currentScenario, trimmed);
          setMessages((prev) => [...prev, { sender: 'patient', text: localReply }]);
        }
      } catch (err) {
        lastErrorRef.current = err;
        notify(
          `AI Patient fallback: ${err.message || 'Error communicating with model.'}`,
          'warning'
        );

        // Graceful fallback to local response so simulation never freezes
        const fallbackReply = generateLocalHeuristicResponse(currentScenario, trimmed);
        setMessages((prev) => [
          ...prev,
          {
            sender: 'patient',
            text: fallbackReply
          }
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [messages, isConfigured, activeApiKey, provider, model, currentScenario, notify]
  );

  /**
   * Request Case Evaluation from Agent B (Senior Mentor)
   * Supports optional overrides to avoid React state batch lag during 1-click prescribing
   */
  const requestEvaluation = useCallback(
    async (overrideMessages = null, overrideNotes = null) => {
      // Defensively ensure overrideMessages is actually an Array of messages
      // (guards against React SyntheticEvent when bound directly to onClick)
      const activeMsgs = Array.isArray(overrideMessages) ? overrideMessages : messages;

      // Defensively ensure overrideNotes is a valid caseNotes object and not a React SyntheticEvent
      const isEventObject =
        overrideNotes &&
        typeof overrideNotes === 'object' &&
        ('nativeEvent' in overrideNotes || 'target' in overrideNotes || 'bubbles' in overrideNotes);

      const activeNotes =
        overrideNotes && typeof overrideNotes === 'object' && !isEventObject
          ? overrideNotes
          : caseNotes;

      setIsEvaluating(true);
      try {
        if (isConfigured) {
          const report = await evaluateCaseTaking({
            apiKey: activeApiKey,
            provider,
            model,
            scenario: currentScenario,
            messages: activeMsgs,
            caseNotes: activeNotes
          });
          setEvaluationReport(report);
        } else {
          // High quality offline fallback evaluation calculation
          await new Promise((r) => setTimeout(r, 800));
          let lsmcScore = probedCategories.lsmc ? 21 : 12;
          let generalsScore =
            (probedCategories.thermal ? 8 : 2) +
            (probedCategories.thirst ? 7 : 2) +
            (probedCategories.modalities ? 6 : 2);
          let commScore = probedCategories.mind ? 21 : 15;
          let sbarScore = 18;
          let totalScore = Math.min(lsmcScore + generalsScore + commScore + sbarScore, 100);

          const doctorRx = activeNotes?.provisionalTotality?.trim() || '';
          const indicatedRx = currentScenario.indicatedRemedy || 'Indicated Polychrest 200C';
          const indicatedName = indicatedRx.split(' ')[0].toLowerCase();
          const expectedDiffs = currentScenario.expectedTotality || ['Nux Vomica', 'Lycopodium', 'Arsenicum'];

          let matchStatus = 'not_recorded';
          let matchCritique = 'No provisional totality recorded in your Case Sheet proforma. In classical practice, write down your working remedy before presenting.';
          if (doctorRx) {
            const lowerRx = doctorRx.toLowerCase();
            if (lowerRx.includes(indicatedName)) {
              matchStatus = 'exact_match';
              matchCritique = `Outstanding clinical totality synthesis! You correctly prescribed ${indicatedRx}, matching the thermal state and modalities perfectly.`;
            } else if (expectedDiffs.some((d) => lowerRx.includes(d.toLowerCase()))) {
              matchStatus = 'close_differential';
              matchCritique = `Commendable reasoning! Your prescription was in the differential totality, but ${indicatedRx} is the gold-standard simillimum due to key modalities.`;
            } else {
              matchStatus = 'mismatch';
              matchCritique = `Your prescribed remedy (${doctorRx}) diverged from the patient's individualizing totality. Review the thermals, thirst, and modality keynotes of ${indicatedRx}.`;
            }
          }

          const simillimumObj = {
            name: indicatedRx,
            potency: indicatedRx.split(' ')[1] || '200C',
            justification: `Primary constitutional simillimum for ${currentScenario.title}. Matches the patient's thermal reaction (${currentScenario.persona?.hiddenTruths?.thermal || 'characteristic thermal'}), thirst pattern, and characteristic modality aggravation.`,
            keynotesConfirming: [
              currentScenario.persona?.hiddenTruths?.sensation ? `Sensation: ${currentScenario.persona.hiddenTruths.sensation}` : 'Characteristic presenting sensation',
              currentScenario.persona?.hiddenTruths?.modalities?.agg ? `Modalities: ${currentScenario.persona.hiddenTruths.modalities.agg}` : 'Distinct modality pattern',
              currentScenario.persona?.hiddenTruths?.thermal ? `Thermal State: ${currentScenario.persona.hiddenTruths.thermal}` : 'Clear thermal individuality'
            ]
          };

          const prescriptionConcordanceObj = {
            doctorPrescription: doctorRx || 'Not recorded in proforma',
            status: matchStatus,
            critique: matchCritique
          };

          const offlineReport = {
            totalScore,
            lsmcScore,
            generalsScore,
            communicationScore: commScore,
            sbarScore,
            hahnemannianCompliance:
              totalScore >= 75
                ? 'Strong adherence to Organon Aphorism 84. Observed symptom progression without aggressive leading.'
                : 'Caution advised on leading questions (Aphorism 88). Ensure thermals and thirst are probed systematically.',
            strengths: [
              probedCategories.thermal
                ? 'Accurately investigated Thermal Modalities (Chilly vs. Hot patient).'
                : 'Established initial rapport and captured presenting chief complaint.',
              probedCategories.thirst
                ? 'Explored thirst dynamics (frequency of sips and desired temperature).'
                : 'Recorded location and sensation clearly.'
            ],
            missedQuestions: [
              !probedCategories.thermal && 'Forgot to determine patient reaction to drafts, fans, and sun (Organon Aphorism 88).',
              !probedCategories.thirst && 'Did not explore water drinking pattern (large gulps vs. frequent small sips).',
              !probedCategories.mind && 'Under-investigated mental generals (temperament under stress, reaction to consolation).'
            ].filter(Boolean),
            suggestedRubrics: [
              {
                patientQuote: currentScenario.chiefComplaint,
                kentRubric: 'Generalities; Food and drinks; warm drinks; amel.',
                remedySignificance: 'Guides toward indicated polychrest simillimum.'
              }
            ],
            simillimum: simillimumObj,
            prescriptionConcordance: prescriptionConcordanceObj,
            differentialRemedies: (currentScenario.expectedTotality || ['Nux Vomica', 'Lycopodium', 'Arsenicum']).map(
              (rem, i) => {
                const pot = i === 0 ? currentScenario.indicatedRemedy?.split(' ')[1] || '200C' : '30C';
                const just =
                  i === 0
                    ? `Top keynote matches thermal and modality totality of ${currentScenario.title}.`
                    : 'Differential consideration based on gastric and general symptoms.';
                return {
                  remedy: rem,
                  name: rem,
                  potency: pot,
                  justification: just,
                  reason: just,
                  reasonRuledOut: i === 0 ? 'Confirmed Simillimum (Gold Standard)' : 'Ruled out due to distinct thermal and modality divergence.'
                };
              }
            ),
            seniorFeedback:
              totalScore >= 75
                ? 'Promising clinical reflexes! You asked balanced questions and built an individualizing totality. In clinic, seniors look for crisp handover readiness—continue practicing.'
                : 'Good start. Remember: in private practice, senior consultants only give you 60 seconds. Always lock down the 4 pillars: LSMC, Thermal, Thirst/Craving, and Mental Generals.'
          };

          setEvaluationReport(offlineReport);
          notify(
            'Generated offline clinical scorecard. Enter your Gemini API key in Settings for live AI deep-analysis.',
            'info'
          );
        }
      } catch (err) {
        notify(`Evaluation error: ${err.message}. Showing local clinical assessment.`, 'warning');
        const fallbackRx = currentScenario?.indicatedRemedy || 'Nux Vomica 200C';
        setEvaluationReport({
          totalScore: 65,
          lsmcScore: 16,
          generalsScore: 16,
          communicationScore: 17,
          sbarScore: 16,
          hahnemannianCompliance: 'Offline proctor assessment.',
          strengths: ['Captured chief complaint', 'Maintained professional inquiry'],
          missedQuestions: ['Verify thermal state and exact times of aggravation'],
          suggestedRubrics: [
            {
              patientQuote: currentScenario?.chiefComplaint || 'Presenting complaint',
              kentRubric: 'Generalities; Food and drinks; warm drinks; amel.',
              remedySignificance: 'Points to constitutional polychrest.'
            }
          ],
          simillimum: {
            name: fallbackRx,
            potency: fallbackRx.split(' ')[1] || '200C',
            justification: `Primary constitutional totality for ${currentScenario?.title || 'this case'}.`,
            keynotesConfirming: ['Thermal individuality', 'Modalities of aggravation', 'Presenting sensation']
          },
          prescriptionConcordance: {
            doctorPrescription: activeNotes?.provisionalTotality || 'Not recorded',
            status: 'not_recorded',
            critique: 'Consultation assessment completed. Review the indicated simillimum keynotes below.'
          },
          differentialRemedies: [
            {
              remedy: fallbackRx,
              name: fallbackRx,
              potency: fallbackRx.split(' ')[1] || '200C',
              justification: 'Primary indicated totality.',
              reason: 'Primary indicated totality.',
              reasonRuledOut: 'Confirmed Simillimum (Gold Standard)'
            }
          ],
          seniorFeedback:
            'API temporarily unavailable. Remember the 4 pillars: LSMC, Thermals, Thirst, and Mind.'
        });
      } finally {
        setIsEvaluating(false);
      }
    },
    [
      isConfigured,
      activeApiKey,
      provider,
      model,
      currentScenario,
      messages,
      caseNotes,
      probedCategories,
      notify
    ]
  );

  /**
   * Prescribe medicine and conclude consultation in one smooth workflow
   */
  const prescribeAndEvaluate = useCallback(
    async ({ remedy, potency = '200C', instructions = '', justification = '' }) => {
      const fullRx = `${remedy.trim()} ${potency.trim()}`.trim();

      const doctorClosingText = `Prescription: ${fullRx}.${instructions ? ` Instructions: ${instructions}.` : ''} Let us evaluate how this medicine addresses your totality of symptoms.`;
      const patientAckText = `Thank you so much, Doctor. I will take ${fullRx} as directed and note down how I feel.`;

      const updatedMsgs = [
        ...messages,
        { sender: 'doctor', text: doctorClosingText },
        { sender: 'patient', text: patientAckText }
      ];
      setMessages(updatedMsgs);

      const updatedNotes = {
        ...caseNotes,
        provisionalTotality: fullRx,
        prescriptionJustification: justification || caseNotes.prescriptionJustification || ''
      };
      setCaseNotes(updatedNotes);

      // Trigger senior mentor evaluation with the updated messages and notes
      await requestEvaluation(updatedMsgs, updatedNotes);
    },
    [messages, caseNotes, requestEvaluation]
  );

  /**
   * Switch active scenario
   */
  const switchScenario = useCallback(
    (scenarioId) => {
      setSelectedScenarioId(scenarioId);
      const target = scenariosList.find((s) => s.id === scenarioId) || scenariosList[0];
      setMessages(getInitialMessages(target));
      setEvaluationReport(null);
      setIsSessionRestored(false);
      setProbedCategories({
        lsmc: false,
        thermal: false,
        thirst: false,
        modalities: false,
        mind: false,
        pastHistory: false
      });
      setCaseNotes({
        location: '',
        sensation: '',
        modalityAgg: '',
        modalityAmel: '',
        concomitants: '',
        thermalState: '',
        thirstAppetite: '',
        cravingsAversions: '',
        mentalGenerals: '',
        rubricsIdentified: '',
        provisionalTotality: ''
      });
      storageService.clearActiveSession();
    },
    [scenariosList]
  );

  /**
   * Add a dynamically generated AI case into scenarios list and activate it
   */
  const loadDynamicScenario = useCallback((newScenario) => {
    setScenariosList((prev) => [newScenario, ...prev]);
    setSelectedScenarioId(newScenario.id);
    setMessages(getInitialMessages(newScenario));
    setEvaluationReport(null);
    setIsSessionRestored(false);
    setProbedCategories({
      lsmc: false,
      thermal: false,
      thirst: false,
      modalities: false,
      mind: false,
      pastHistory: false
    });
    setCaseNotes({
      location: '',
      sensation: '',
      modalityAgg: '',
      modalityAmel: '',
      concomitants: '',
      thermalState: '',
      thirstAppetite: '',
      cravingsAversions: '',
      mentalGenerals: '',
      rubricsIdentified: '',
      provisionalTotality: ''
    });
    storageService.clearActiveSession();
  }, []);

  /**
   * Reset current case transcript
   */
  const resetCurrentCase = useCallback(() => {
    storageService.clearActiveSession();
    setIsSessionRestored(false);
    switchScenario(selectedScenarioId);
  }, [selectedScenarioId, switchScenario]);

  /**
   * Explicitly delete stored case data from browser storage
   */
  const clearStoredCase = useCallback(() => {
    storageService.clearActiveSession();
    setIsSessionRestored(false);
    setEvaluationReport(null);
    const target = scenariosList.find((s) => s.id === selectedScenarioId) || scenariosList[0];
    setMessages(getInitialMessages(target));
    setProbedCategories({
      lsmc: false,
      thermal: false,
      thirst: false,
      modalities: false,
      mind: false,
      pastHistory: false
    });
    setCaseNotes({
      location: '',
      sensation: '',
      modalityAgg: '',
      modalityAmel: '',
      concomitants: '',
      thermalState: '',
      thirstAppetite: '',
      cravingsAversions: '',
      mentalGenerals: '',
      rubricsIdentified: '',
      provisionalTotality: ''
    });
    notify('Consultation session cleared from storage.', 'info');
  }, [scenariosList, selectedScenarioId, notify]);

  return {
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
  };
}
