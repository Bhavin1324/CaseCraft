import { useState, useEffect, useRef } from 'react';
import {
  Award,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Mic,
  MicOff,
  Sparkles,
  FileText,
  Volume2
} from 'lucide-react';

export default function SbarTrainer({
  scenario,
  caseNotes = {}
}) {
  const [timer, setTimer] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioTranscript, setAudioTranscript] = useState('');

  const [notes, setNotes] = useState({
    situation: '',
    background: '',
    assessment: '',
    recommendation: ''
  });

  const [feedback, setFeedback] = useState(null);
  const recognitionRef = useRef(null);

  // SVG circular timer geometry
  const radius = 38;
  const circumference = 2 * Math.PI * radius; // ~238.76
  const strokeDashoffset = ((60 - timer) / 60) * circumference;

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

  // Color selection based on timer
  const timerColor =
    timer > 30 ? '#10b981' : timer > 10 ? '#f59e0b' : '#f43f5e';

  const timerTextClass =
    timer > 30 ? 'text-emerald-400' : timer > 10 ? 'text-amber-400' : 'text-rose-400 animate-pulse';

  return (
    <div className="space-y-6">
      {/* SBAR Header Card */}
      <div className="bg-slate-850/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
            <Award className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                60-Second Senior Consultant Handover (SBAR)
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                Clinic Drill
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Practice summarizing a 40-minute consultation into a 60-second high-yield case handover.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePrefill}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500/40 text-slate-200 hover:text-emerald-300 text-xs font-semibold flex items-center gap-2 transition cursor-pointer min-h-[44px]"
        >
          <FileText className="w-4 h-4 text-emerald-400" />
          <span>Prefill from Current Case</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Formulator & Voice Practice */}
        <div className="lg:col-span-8 bg-slate-850/90 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
          {/* Top Control Bar with Circular SVG Timer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-700/70">
            <div className="flex items-center gap-4">
              {/* Circular SVG Timer */}
              <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 96 96">
                  <circle
                    cx="48"
                    cy="48"
                    r={radius}
                    className="stroke-slate-800"
                    strokeWidth="7"
                    fill="transparent"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r={radius}
                    stroke={timerColor}
                    strokeWidth="7"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="circular-progress-circle"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-base font-mono font-bold tabular-nums ${timerTextClass}`}>
                    00:{timer < 10 ? `0${timer}` : timer}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400">secs</span>
                </div>
              </div>

              {/* Timer & Dictation Controls */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleStartPause}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer min-h-[44px]"
                  >
                    {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isActive ? 'Pause' : timer === 0 ? 'Restart' : 'Start 60s Drill'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                    title="Reset to 60 seconds"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  {isActive ? 'Simulating senior consultant listening...' : 'Click start when ready to present.'}
                </p>
              </div>
            </div>

            {/* Microphone Presentation Recorder */}
            <div className="flex flex-col items-end gap-1.5">
              <button
                type="button"
                onClick={toggleRecording}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer min-h-[44px] border ${
                  isRecording
                    ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                    : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isRecording ? 'Recording Speech...' : 'Voice Practice Dictation'}</span>
              </button>
              {isRecording && (
                <span className="text-[10px] text-rose-300 font-mono flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                  Live transcribing speech...
                </span>
              )}
            </div>
          </div>

          {/* Voice Transcript Box if active */}
          {audioTranscript && (
            <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/40 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1 mb-1">
                <Volume2 className="w-3 h-3" />
                Live Speech Dictation:
              </span>
              <p className="text-slate-200 italic">{audioTranscript}</p>
            </div>
          )}

          {/* SBAR Interactive Form */}
          <div className="space-y-4 text-xs">
            {/* S - Situation */}
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px] font-bold">
                    S
                  </span>
                  Situation: Patient Demographics & Presenting State
                </label>
                <span className="text-[10px] text-slate-400 font-mono">15s allotment</span>
              </div>
              <textarea
                rows={2}
                value={notes.situation}
                onChange={(e) => setNotes({ ...notes, situation: e.target.value })}
                placeholder="e.g. Vikram Mehta, 38-year-old corporate lawyer presenting with acute violent epigastric burning and vomiting for 4 days..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* B - Background */}
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px] font-bold">
                    B
                  </span>
                  Background: Etiology, Stressors & Medical Timeline
                </label>
                <span className="text-[10px] text-slate-400 font-mono">15s allotment</span>
              </div>
              <textarea
                rows={2}
                value={notes.background}
                onChange={(e) => setNotes({ ...notes, background: e.target.value })}
                placeholder="e.g. Ailments from excessive coffee, irregular late dinners, litigation stress, and cold drafts..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* A - Assessment */}
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px] font-bold">
                    A
                  </span>
                  Assessment: Totality (LSMC + Physical Generals + Mind)
                </label>
                <span className="text-[10px] text-slate-400 font-mono">20s allotment</span>
              </div>
              <textarea
                rows={3}
                value={notes.assessment}
                onChange={(e) => setNotes({ ...notes, assessment: e.target.value })}
                placeholder="e.g. Extremely chilly (< cold drafts), thirst for frequent warm sips, waking at 3:30 AM with cramps, ineffectual urging for stool, fiery irritability..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* R - Recommendation */}
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px] font-bold">
                    R
                  </span>
                  Recommendation: Proposed Remedy, Potency & Differential
                </label>
                <span className="text-[10px] text-slate-400 font-mono">10s allotment</span>
              </div>
              <textarea
                rows={2}
                value={notes.recommendation}
                onChange={(e) => setNotes({ ...notes, recommendation: e.target.value })}
                placeholder="e.g. Nux Vomica 200C single dose. Differentials: Lycopodium (ruled out by absence of 4-8 PM aggravation) and Arsenic Album..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Submit for Grading */}
            <button
              type="button"
              onClick={handleEvaluate}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition cursor-pointer min-h-[44px]"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Grade My Handover Presentation</span>
            </button>
          </div>

          {/* Feedback Result Card */}
          {feedback && (
            <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-emerald-500/40 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-300 text-sm">Handover Score</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs">
                  {feedback.score} / 100
                </span>
              </div>
              <p className="text-slate-200 italic">&ldquo;{feedback.verdict}&rdquo;</p>
              <ul className="space-y-1 list-disc list-inside text-slate-300 text-[11px] pt-1">
                {feedback.checklist.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column: Senior Consultant Clinic Pearls */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-850/90 border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              Senior Doctor Clinic Traps to Avoid
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <p className="font-semibold text-slate-200 mb-1">1. Leading with Diagnosis Instead of Totality</p>
                <p className="text-slate-400 text-[11px]">
                  Never say &ldquo;This is a case of migraine so I want to give Belladonna.&rdquo; Start with the peculiar modalities and thermal characteristics.
                </p>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <p className="font-semibold text-slate-200 mb-1">2. Omitting Thermal Individualization</p>
                <p className="text-slate-400 text-[11px]">
                  If you fail to clarify whether the patient is chilly or hot, senior clinicians will discount your suggested prescription instantly.
                </p>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <p className="font-semibold text-slate-200 mb-1">3. Lack of a Justified Differential</p>
                <p className="text-slate-400 text-[11px]">
                  Always mention which second remedy was considered and the precise symptom that ruled it out.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 shadow-xl text-xs text-slate-300">
            <h4 className="font-bold text-emerald-300 flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-4 h-4" />
              Consultant Advice:
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-300">
              In top classical homeopathic clinics, junior associates who can deliver an organized SBAR handover in 60 seconds are trusted with independent OPD duties immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
