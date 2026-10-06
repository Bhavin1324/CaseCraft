import { useRef, useEffect } from 'react';
import { User, Stethoscope, Info, Sparkles, Brain } from 'lucide-react';
import ConsultReadinessBar from './ConsultReadinessBar';

export default function ChatArena({
  messages = [],
  isTyping = false,
  scenario,
  model = 'gemini-flash-lite-latest',
  isConfigured = false,
  probedCategories,
  onOpenPrescribe,
  onInsertProbe,
  isSessionRestored,
  onResetCase
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const patientFirstName = scenario?.patientName?.split(' ')[0] || 'Patient';
  const personaTone = scenario?.persona?.tone || 'guarded';

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Consultation Totality Guidance & Prescription Action Bar */}
      <ConsultReadinessBar
        probedCategories={probedCategories}
        onOpenPrescribe={onOpenPrescribe}
        onInsertProbe={onInsertProbe}
        isSessionRestored={isSessionRestored}
        onResetCase={onResetCase}
      />

      <div className="flex-1 p-3 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
        {messages.map((msg, idx) => {
          if (msg.sender === 'system') {
            const isEntryMsg = typeof msg.text === 'string' && msg.text.startsWith('Patient entered clinic:');
            if (isEntryMsg) {
              const patientMatch = msg.text.match(/Patient entered clinic:\s*([^.]+)\./);
              const complaintMatch = msg.text.match(/Chief complaint:\s*"([^"]+)"/);
              const pName = patientMatch ? patientMatch[1].trim() : (scenario?.patientName || 'Patient');
              const cComplaint = complaintMatch ? complaintMatch[1].trim() : (scenario?.chiefComplaint || '');

              return (
                <div key={idx} className="flex justify-center my-2">
                  <div className="bg-slate-900/90 border border-slate-800/90 text-slate-300 text-xs px-3.5 py-2 rounded-2xl max-w-xl w-full flex flex-col sm:flex-row items-center sm:justify-between gap-1.5 shadow-sm backdrop-blur-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      <span className="font-bold text-white text-xs truncate">{pName}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono shrink-0">
                        Aphorisms 83–104
                      </span>
                    </div>
                    {cComplaint && (
                      <p className="text-[11px] text-slate-400 italic truncate max-w-xs sm:text-right">
                        &ldquo;{cComplaint}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
              );
            }

            return (
              <div key={idx} className="flex justify-center my-1.5">
                <div className="bg-slate-900/80 border border-slate-800 text-slate-400 text-[11px] px-3 py-1.5 rounded-xl max-w-lg text-center flex items-center gap-2 shadow-xs">
                  <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="leading-relaxed">{msg.text}</span>
                </div>
              </div>
            );
          }

          if (msg.sender === 'doctor') {
            return (
              <div key={idx} className="flex justify-end items-end gap-2">
                <div className="max-w-[85%] sm:max-w-[75%] space-y-1">
                  <div className="flex items-center justify-end gap-1.5 text-[11px] text-slate-400 font-medium px-1">
                    <span>Doctor (You)</span>
                    <Stethoscope className="w-3 h-3 text-emerald-400" />
                  </div>
                  <div className="bg-emerald-600 text-white rounded-2xl rounded-tr-xs px-4 py-2.5 shadow-md leading-relaxed selection:bg-emerald-800">
                    {msg.text}
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-emerald-700 border border-emerald-500/40 flex items-center justify-center text-white shrink-0 shadow-sm hidden sm:flex">
                  <Stethoscope className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          }

          // Patient message
          return (
            <div key={idx} className="flex justify-start items-end gap-2">
              <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 shadow-sm hidden sm:flex">
                <User className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="max-w-[85%] sm:max-w-[75%] space-y-1">
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium px-1">
                  <span className="text-emerald-300 font-semibold">{patientFirstName}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                    {personaTone.split(',')[0]}
                  </span>
                </div>
                <div className="bg-slate-850/90 border border-slate-700/80 text-slate-100 rounded-2xl rounded-tl-xs px-4 py-2.5 shadow-md leading-relaxed">
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 hidden sm:flex">
              <Brain className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            </div>
            <div className="bg-slate-800/80 border border-slate-700/70 rounded-2xl px-4 py-2.5 text-xs text-slate-300 flex items-center gap-2 shadow-sm">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-[11px] text-emerald-300/90 font-mono ml-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                Patient pondering reply ({isConfigured ? model : 'Heuristic Mode'})...
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
