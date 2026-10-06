export default function RadialGauge({
  value,
  max = 25,
  label,
  size = 56,
  strokeWidth = 4.5
}) {
  const numValue = Number(value) || 0;
  const numMax = Number(max) || 25;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(100, Math.max(0, (numValue / numMax) * 100));
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  const color =
    pct >= 80 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#f43f5e';

  return (
    <div className="flex flex-col items-center text-center p-2 rounded-xl bg-slate-900/60 border border-slate-800">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-slate-800"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-[11px] tabular-nums text-white">
          {numValue}/{numMax}
        </div>
      </div>
      <span className="text-[10px] font-medium text-slate-300 mt-1 line-clamp-1">{label}</span>
    </div>
  );
}
