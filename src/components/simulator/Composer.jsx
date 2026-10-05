import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Sparkles, Loader2 } from 'lucide-react';

const QUICK_PROBES = [
  {
    id: 'onset',
    label: 'Onset & Etiology (Aphorism 84)',
    query: 'Could you tell me how and when this trouble first began in your own words?'
  },
  {
    id: 'sensation',
    label: 'Exact Sensation',
    query: 'Could you describe what this discomfort or pain feels like inside?'
  },
  {
    id: 'modalities',
    label: 'Modalities (< / >)',
    query: 'What conditions, times of day, or positions make you feel distinctly worse or better?'
  },
  {
    id: 'thermals',
    label: 'Thermal State',
    query: 'How do you generally react to cold weather, drafts, or warm rooms and sun?'
  },
  {
    id: 'thirst',
    label: 'Thirst & Temperature',
    query: 'Tell me about your thirst—how often do you drink, and do you crave cold or warm drinks?'
  },
  {
    id: 'cravings',
    label: 'Food Cravings',
    query: 'Are there particular foods, spices, or flavors you strongly crave or dislike?'
  },
  {
    id: 'mind',
    label: 'Mind & Mood (Aphorism 210)',
    query: 'How has this illness been affecting your patience, temper, or emotional state?'
  },
  {
    id: 'sleep',
    label: 'Sleep & Bowel Rhythm',
    query: 'How is your sleep rhythm, and do you wake up at any specific hour?'
  }
];

export default function Composer({ onSend, isTyping, disabled }) {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize Web Speech API if supported
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
        setSpeechError(null);
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone permission denied. Enable mic access to dictate.');
        } else if (event.error !== 'no-speech') {
          setSpeechError(`Speech error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore cleanup abort
        }
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setSpeechError('Speech recognition is supported in Chrome, Edge, and Safari.');
      setTimeout(() => setSpeechError(null), 4000);
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
    } else {
      setSpeechError(null);
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Speech recognition start failed:', err);
        setIsListening(false);
      }
    }
  };

  const handleQuickProbe = (query) => {
    setText(query);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!text.trim() || isTyping || disabled) return;
    onSend(text.trim());
    setText('');
    setSpeechError(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-slate-900/95 border-t border-slate-800/80 p-3 sm:p-4 backdrop-blur-md">
      {/* Quick-Probe Inquiry Carousel */}
      <div className="mb-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0 flex items-center gap-1 px-1">
          <Sparkles className="w-3 h-3 text-emerald-400" />
          Probes:
        </span>
        {QUICK_PROBES.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => handleQuickProbe(p.query)}
            disabled={isTyping || disabled}
            className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/40 text-[11px] font-medium transition cursor-pointer disabled:opacity-50 min-h-[32px] flex items-center"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Speech error notice */}
      {speechError && (
        <div className="mb-2 text-[11px] text-amber-300 bg-amber-950/60 border border-amber-600/40 px-2.5 py-1 rounded-lg flex items-center justify-between">
          <span>{speechError}</span>
          <button
            type="button"
            onClick={() => setSpeechError(null)}
            className="text-amber-400 hover:text-white px-1 ml-2 font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        {/* Dictation Button */}
        <button
          type="button"
          onClick={toggleListening}
          disabled={isTyping || disabled}
          aria-label={isListening ? 'Stop listening' : 'Start voice dictation'}
          title={isListening ? 'Listening... click to stop' : 'Dictate question via microphone'}
          className={`h-11 w-11 shrink-0 rounded-xl flex items-center justify-center transition border cursor-pointer ${
            isListening
              ? 'bg-rose-600 text-white border-rose-500 ring-2 ring-rose-400 animate-pulse'
              : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border-slate-700'
          } disabled:opacity-50`}
        >
          {isListening ? (
            <MicOff className="w-4 h-4 text-white" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
        </button>

        {/* Text Input */}
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping || disabled}
            placeholder={
              isListening
                ? 'Listening to your voice...'
                : 'Respond to your patient or probe modalities (Aphorism 84)...'
            }
            className="w-full h-11 bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 pr-10 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 disabled:opacity-50"
          />
          {text && (
            <button
              type="button"
              onClick={() => setText('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs p-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!text.trim() || isTyping || disabled}
          aria-label="Send message to patient"
          className="h-11 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-1.5 transition shadow-lg shadow-emerald-900/30 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0 min-w-[44px]"
        >
          {isTyping ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span className="hidden sm:inline text-xs font-bold">Ask</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
