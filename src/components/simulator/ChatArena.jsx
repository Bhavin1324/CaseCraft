import { useRef, useEffect } from 'react';
import { User, Stethoscope, Info, Sparkles, Brain } from 'lucide-react';

export default function ChatArena({
  messages = [],
  isTyping = false,
  scenario,
  model = 'gemini-flash-lite-latest',
  isConfigured = false
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const patientFirstName = scenario?.patientName?.split(' ')[0] || 'Patient';
  const personaTone = scenario?.persona?.tone || 'guarded';

  return (
    <div className="flex-1 p-3 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
      {messages.map((msg, idx) => {
        if (msg.sender === 'system') {
          return (
            <div key={idx} className="flex justify-center my-2">
              <div className="bg-slate-900/90 border border-slate-800 text-slate-300 text-xs px-4 py-2 rounded-xl max-w-lg text-center flex items-center gap-2.5 shadow-sm">
                <Info className="w-4 h-4 text-emerald-400 shrink-0" />
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
  );
}
