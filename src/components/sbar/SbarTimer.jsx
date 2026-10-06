import { Play, Pause, RotateCcw, Mic, MicOff } from 'lucide-react';

export default function SbarTimer({
  timer,
  isActive,
  isRecording,
  onStartPause,
  onReset,
  onToggleRecording
}) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = ((60 - timer) / 60) * circumference;

  const timerColor =
    timer > 30 ? '#10b981' : timer > 10 ? '#f59e0b' : '#f43f5e';

  const timerTextClass =
    timer > 30
      ? 'text-emerald-400'
      : timer > 10
      ? 'text-amber-400'
      : 'text-rose-400 animate-pulse';

  const timerGlowClass =
    timer > 30
      ? 'shadow-emerald-500/20'
      : timer > 10
      ? 'shadow-amber-500/20'
      : 'shadow-rose-500/30';

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Timer Telemetry Ring & Counter */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-center sm:justify-start">
          <div className={`relative w-20 h-20 shrink-0 flex items-center justify-center rounded-full shadow-lg ${timerGlowClass}`}>
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 96 96">
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-slate-800/80"
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
                className="circular-progress-circle transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-lg font-mono font-black tabular-nums tracking-tight ${timerTextClass}`}>
                00:{timer < 10 ? `0${timer}` : timer}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold -mt-0.5">
                secs
              </span>
            </div>
          </div>

          <div className="space-y-1 text-center sm:text-left min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isActive
                    ? 'bg-emerald-400 animate-ping'
                    : timer === 0
                    ? 'bg-rose-400'
                    : 'bg-slate-500'
                }`}
              />
              <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                {isActive ? 'Handover in Progress' : timer === 0 ? 'Time Elapsed (60s)' : '60-Second Countdown'}
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              {isActive
                ? 'Simulating senior doctor listening attentively...'
                : 'Deliver your complete totality before the ring expires.'}
            </p>
          </div>
        </div>

        {/* Primary Controls & Voice Dictation Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onStartPause}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 active:from-emerald-700 active:to-teal-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/40 transition cursor-pointer min-h-[44px] active:scale-[0.99]"
            >
              {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isActive ? 'Pause Drill' : timer === 0 ? 'Restart Drill' : 'Start 60s Drill'}</span>
            </button>

            <button
              type="button"
              onClick={onReset}
              title="Reset timer to 60 seconds"
              aria-label="Reset timer"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0 active:scale-[0.98]"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={onToggleRecording}
            className={`w-full sm:w-auto px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer min-h-[44px] border ${
              isRecording
                ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-950/40 animate-pulse'
                : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-700'
            }`}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-400" />}
            <span>{isRecording ? 'Recording Speech...' : 'Voice Practice'}</span>
            {isRecording && (
              <span className="w-2 h-2 rounded-full bg-white animate-ping ml-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
