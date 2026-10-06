import { Volume2, CheckCircle, ArrowDownRight } from 'lucide-react';

export default function SbarFormSection({
  notes,
  onNotesChange,
  audioTranscript,
  onEvaluate
}) {
  const handleChange = (field, value) => {
    onNotesChange({
      ...notes,
      [field]: value
    });
  };

  const appendTranscript = (field) => {
    if (!audioTranscript) return;
    const current = notes[field] || '';
    const updated = current ? `${current} ${audioTranscript}` : audioTranscript;
    handleChange(field, updated);
  };

  return (
    <div className="space-y-4 text-xs">
      {/* Live Speech Dictation Bubble with Quick-Append actions */}
      {audioTranscript && (
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-emerald-500/40 text-xs shadow-md space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 animate-pulse" />
              Live Speech Dictation
            </span>
            <span className="text-[10px] text-slate-400">Append to section:</span>
          </div>
          <p className="text-slate-200 italic text-[11px] bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
            &ldquo;{audioTranscript}&rdquo;
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => appendTranscript('situation')}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[10px] font-semibold flex items-center gap-1 border border-slate-700 transition cursor-pointer"
            >
              <ArrowDownRight className="w-3 h-3" /> + Situation
            </button>
            <button
              type="button"
              onClick={() => appendTranscript('background')}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 text-[10px] font-semibold flex items-center gap-1 border border-slate-700 transition cursor-pointer"
            >
              <ArrowDownRight className="w-3 h-3" /> + Background
            </button>
            <button
              type="button"
              onClick={() => appendTranscript('assessment')}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-[10px] font-semibold flex items-center gap-1 border border-slate-700 transition cursor-pointer"
            >
              <ArrowDownRight className="w-3 h-3" /> + Assessment
            </button>
            <button
              type="button"
              onClick={() => appendTranscript('recommendation')}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 text-[10px] font-semibold flex items-center gap-1 border border-slate-700 transition cursor-pointer"
            >
              <ArrowDownRight className="w-3 h-3" /> + Recommendation
            </button>
          </div>
        </div>
      )}

      {/* S - Situation */}
      <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-emerald-900/30 hover:border-emerald-700/50 transition shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <label className="font-bold text-emerald-400 flex items-center gap-2 text-xs">
            <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-black shadow-xs">
              S
            </span>
            <span>Situation: Patient Profile &amp; Chief Complaint</span>
          </label>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
            15s
          </span>
        </div>
        <textarea
          rows={2}
          value={notes.situation}
          onChange={(e) => handleChange('situation', e.target.value)}
          placeholder="e.g. Vikram Mehta, 38-year-old corporate lawyer presenting with acute violent epigastric burning and vomiting for 4 days..."
          className="w-full bg-slate-850 border border-slate-700/80 rounded-xl p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition leading-relaxed"
        />
      </div>

      {/* B - Background */}
      <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-sky-900/30 hover:border-sky-700/50 transition shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <label className="font-bold text-sky-400 flex items-center gap-2 text-xs">
            <span className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-300 flex items-center justify-center text-xs font-black shadow-xs">
              B
            </span>
            <span>Background: Etiology, Timeline &amp; Stressors</span>
          </label>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20 font-mono">
            15s
          </span>
        </div>
        <textarea
          rows={2}
          value={notes.background}
          onChange={(e) => handleChange('background', e.target.value)}
          placeholder="e.g. Ailments from excessive coffee, irregular late dinners, litigation stress, and cold drafts..."
          className="w-full bg-slate-850 border border-slate-700/80 rounded-xl p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition leading-relaxed"
        />
      </div>

      {/* A - Assessment */}
      <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-amber-900/30 hover:border-amber-700/50 transition shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <label className="font-bold text-amber-400 flex items-center gap-2 text-xs">
            <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs font-black shadow-xs">
              A
            </span>
            <span>Assessment: Totality (LSMC + Thermals + Mind)</span>
          </label>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
            20s
          </span>
        </div>
        <textarea
          rows={3}
          value={notes.assessment}
          onChange={(e) => handleChange('assessment', e.target.value)}
          placeholder="e.g. Extremely chilly (< cold drafts), thirst for frequent warm sips, waking at 3:30 AM with cramps, ineffectual urging for stool, fiery irritability..."
          className="w-full bg-slate-850 border border-slate-700/80 rounded-xl p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition leading-relaxed"
        />
      </div>

      {/* R - Recommendation */}
      <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-purple-900/30 hover:border-purple-700/50 transition shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <label className="font-bold text-purple-400 flex items-center gap-2 text-xs">
            <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center text-xs font-black shadow-xs">
              R
            </span>
            <span>Recommendation: Proposed Remedy &amp; Differential</span>
          </label>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
            10s
          </span>
        </div>
        <textarea
          rows={2}
          value={notes.recommendation}
          onChange={(e) => handleChange('recommendation', e.target.value)}
          placeholder="e.g. Nux Vomica 200C single dose. Differentials: Lycopodium (ruled out by absence of 4-8 PM aggravation) and Arsenic Album..."
          className="w-full bg-slate-850 border border-slate-700/80 rounded-xl p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition leading-relaxed"
        />
      </div>

      {/* Submit for Grading */}
      <button
        type="button"
        onClick={onEvaluate}
        className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 active:from-emerald-700 active:to-teal-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition cursor-pointer min-h-[48px] active:scale-[0.99]"
      >
        <CheckCircle className="w-4 h-4 text-emerald-200" />
        <span>Grade My Handover Presentation</span>
      </button>
    </div>
  );
}
