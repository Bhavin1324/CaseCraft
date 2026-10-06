import RadialGauge from './RadialGauge';

export default function ScoreMeterSection({
  totalScore = 75,
  lsmcScore = 18,
  generalsScore = 18,
  communicationScore = 20,
  sbarScore = 19
}) {
  const numTotalScore = Math.min(100, Math.max(0, Math.round(Number(totalScore) || 75)));

  const mainRadius = 44;
  const mainCircumference = 2 * Math.PI * mainRadius;
  const mainOffset = mainCircumference - (numTotalScore / 100) * mainCircumference;
  const mainColor =
    numTotalScore >= 80 ? '#10b981' : numTotalScore >= 65 ? '#f59e0b' : '#f43f5e';

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 items-center bg-slate-855 p-4 sm:p-5 rounded-2xl border border-slate-700/80 shadow-md">
      {/* Overall Radial Score Meter */}
      <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-700/80 pb-3 md:pb-0 md:pr-4">
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
          Totality &amp; Readiness Score
        </span>
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
          <svg className="w-24 h-24 sm:w-28 sm:h-28 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={mainRadius}
              className="stroke-slate-800"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r={mainRadius}
              stroke={mainColor}
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={mainCircumference}
              strokeDashoffset={mainOffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {numTotalScore}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
              / 100
            </span>
          </div>
        </div>

        <div className="mt-2 text-center">
          <span
            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border inline-block ${
              numTotalScore >= 80
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : numTotalScore >= 65
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
            }`}
          >
            {numTotalScore >= 80
              ? 'Ready for Senior Handover'
              : numTotalScore >= 65
              ? 'Solid Case with Minor Gaps'
              : 'Needs Classical Refinement'}
          </span>
        </div>
      </div>

      {/* 4 Pillar Breakdown Gauges */}
      <div className="md:col-span-8">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Four Pillar Hahnemannian Breakdown:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <RadialGauge value={lsmcScore} max={25} label="1. LSMC Totality" />
          <RadialGauge value={generalsScore} max={25} label="2. Generals & Thirst" />
          <RadialGauge value={communicationScore} max={25} label="3. Non-Leading Bias" />
          <RadialGauge value={sbarScore} max={25} label="4. Handover Precision" />
        </div>
      </div>
    </div>
  );
}
