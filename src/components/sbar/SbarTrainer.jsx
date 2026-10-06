import { useState, useEffect, useRef } from 'react';
import { Award, FileText, Clock, Sparkles } from 'lucide-react';
import SbarTimer from './SbarTimer';
import SbarFormSection from './SbarFormSection';
import SbarScorecard from './SbarScorecard';
import SbarPearlsSection from './SbarPearlsSection';

export default function SbarTrainer({
  scenario,
  caseNotes = {}
}) {
  const [timer, setTimer] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioTranscript, setAudioTranscript] = useState('');
  const [mobileTab, setMobileTab] = useState('drill');

  const [notes, setNotes] = useState({
    situation: '',
    background: '',
    assessment: '',
    recommendation: ''
  });

  const [feedback, setFeedback] = useState(null);
  const recognitionRef = useRef(null);

  // Timer countdown
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            setIsActive(false);
            setIsRecording(false);
            if (recognitionRef.current) {
              try {
                recognitionRef.current.stop();
              } catch {
                // ignore
              }
            }
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  // Voice dictation initialization
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let currentText = '';
        for (let i = 0; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript + ' ';
        }
        setAudioTranscript(currentText.trim());
      };

      recognition.onerror = (e) => {
        console.warn('Speech error in SBAR:', e);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Dictation works in Chrome, Edge, and Safari.');
      return;
    }

    if (isRecording) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsRecording(false);
    } else {
      try {
        setAudioTranscript('');
        recognitionRef.current.start();
        setIsRecording(true);
        if (!isActive && timer === 60) {
          setIsActive(true);
        }
      } catch (err) {
        console.warn('Failed to start dictation:', err);
      }
    }
  };

  const handleStartPause = () => {
    if (timer === 0) {
      setTimer(60);
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimer(60);
    setIsRecording(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
  };

  // Prefill helper: extracts current case into SBAR format
  const handlePrefill = () => {
    const pName = scenario?.patientName || '38-year-old patient';
    const chief = caseNotes.chiefComplaint || scenario?.chiefComplaint || 'Severe recurring distress';
    const loc = caseNotes.location ? `Location: ${caseNotes.location}. ` : '';
    const sens = caseNotes.sensation ? `Sensation: ${caseNotes.sensation}. ` : '';
    const agg = caseNotes.modalityAgg ? `< ${caseNotes.modalityAgg}. ` : '';
    const amel = caseNotes.modalityAmel ? `> ${caseNotes.modalityAmel}. ` : '';
    const therm = caseNotes.thermalState ? `Thermal: ${caseNotes.thermalState}. ` : '';
    const thirst = caseNotes.thirstHabits ? `Thirst: ${caseNotes.thirstHabits}. ` : '';
    const mind = caseNotes.mentalState ? `Mind: ${caseNotes.mentalState}. ` : '';

    setNotes({
      situation: `${pName} presenting with ${chief}.`,
      background: scenario?.persona?.background || 'Triggered by prolonged occupational strain and lifestyle irregularity.',
      assessment: `Totality highlights: ${loc}${sens}${agg}${amel}${therm}${thirst}${mind}`.trim(),
      recommendation: scenario?.indicatedRemedy
        ? `${scenario.indicatedRemedy} single dose stat. Differentials: ${scenario.expectedTotality?.slice(1).join(', ') || 'Nux-v / Lyc'}.`
        : 'Indicated simillimum based on modality & thermal individualization.'
    });
  };

  const handleEvaluate = () => {
    let score = 0;
    const checklist = [];

    if (notes.situation.trim().length >= 15) {
      score += 25;
      checklist.push('Situation: Clean articulation of patient profile, duration, and chief complaint.');
    } else {
      checklist.push('Situation: Incomplete. Clearly state age, gender, duration, and chief complaint.');
    }

    if (notes.background.trim().length >= 15) {
      score += 25;
      checklist.push('Background: Accurately captured etiology, stressors, and timeline.');
    } else {
      checklist.push('Background: Missing causative timeline (ailments from grief, overwork, dietary excess).');
    }

    if (notes.assessment.trim().length >= 25) {
      score += 30;
      checklist.push('Assessment: Excellent totality combining LSMC with Thermals and Mind.');
    } else {
      checklist.push('Assessment: Incomplete totality! Must highlight Thermals, Thirst, and Modalities.');
    }

    if (notes.recommendation.trim().length >= 10) {
      score += 20;
      checklist.push('Recommendation: Stated primary indicated remedy, potency, and differential.');
    } else {
      checklist.push('Recommendation: Provide specific primary remedy, potency (e.g. 200C), and justification.');
    }

    setFeedback({
      score,
      checklist,
      verdict:
        score >= 80
          ? 'Ready for Senior Consultant Handover! Crisp, organized, and strictly homeopathic.'
          : 'Needs crisper framing. Senior consultants need pure totality within 60 seconds.'
    });
  };

  return (
    <div className="space-y-5">
      {/* SBAR Header Card */}
      <div className="bg-slate-850/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20 shrink-0">
            <Award className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                60-Second Senior Consultant Handover (SBAR)
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                Clinic Drill
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Practice summarizing a 40-minute consultation into a 60-second high-yield case handover.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePrefill}
          className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-emerald-500/40 text-slate-200 hover:text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer min-h-[44px]"
        >
          <FileText className="w-4 h-4 text-emerald-400" />
          <span>Prefill from Current Case</span>
        </button>
      </div>

      {/* Mobile Segmented Switcher (< lg) */}
      <div className="flex lg:hidden p-1 bg-slate-900/90 border border-slate-700/80 rounded-xl">
        <button
          type="button"
          onClick={() => setMobileTab('drill')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-2 min-h-[44px] cursor-pointer ${
            mobileTab === 'drill'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Handover Drill</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('pearls')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-2 min-h-[44px] cursor-pointer ${
            mobileTab === 'pearls'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Consultant Pearls</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Formulator & Voice Practice */}
        <div
          className={`${
            mobileTab === 'drill' ? 'block' : 'hidden'
          } lg:block lg:col-span-8 bg-slate-850/90 border border-slate-700/80 rounded-2xl p-4 sm:p-6 shadow-xl space-y-5`}
        >
          <SbarTimer
            timer={timer}
            isActive={isActive}
            isRecording={isRecording}
            onStartPause={handleStartPause}
            onReset={handleReset}
            onToggleRecording={toggleRecording}
          />

          <SbarFormSection
            notes={notes}
            onNotesChange={setNotes}
            audioTranscript={audioTranscript}
            onEvaluate={handleEvaluate}
          />

          <SbarScorecard feedback={feedback} />
        </div>

        {/* Right Column: Senior Consultant Clinic Pearls */}
        <div
          className={`${
            mobileTab === 'pearls' ? 'block' : 'hidden'
          } lg:block lg:col-span-4`}
        >
          <SbarPearlsSection />
        </div>
      </div>
    </div>
  );
}
