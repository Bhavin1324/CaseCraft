import { FileText, Award, Loader2 } from 'lucide-react';

export default function ScratchpadSidebar({
  caseNotes = {},
  setCaseNotes,
  onRequestEvaluation,
  isEvaluating,
  onAfterEvaluate
}) {
  const handleEvaluate = () => {
    if (onAfterEvaluate) onAfterEvaluate();
    if (onRequestEvaluation) onRequestEvaluation();
  };

  return (
    <div className="flex-1 flex flex-col space-y-4">
      {/* Doctor's Scratchpad */}
      <div className="bg-slate-855 border border-slate-700/80 rounded-2xl p-4 shadow-md space-y-3 flex-1 flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-700/70 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            Live Case Notes Scratchpad
          </span>
          <span className="text-[10px] text-slate-400">Included in AI Evaluation</span>
        </div>

        <div className="space-y-3 text-xs flex-1 flex flex-col">
          <div>
            <label className="text-[10px] text-slate-400 font-medium block mb-0.5">
              Chief Sensation &amp; Modalities (&lt; / &gt;)
            </label>
            <textarea
              rows={3}
              value={caseNotes.modalityAgg || ''}
              onChange={(e) =>
                setCaseNotes((prev) => ({ ...prev, modalityAgg: e.target.value }))
              }
              placeholder="e.g. Epigastric burning < 3 AM, cold drafts; > warm drinks, rest..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-medium block mb-0.5">
              Physical Generals (Thermals &amp; Thirst)
            </label>
            <textarea
              rows={3}
              value={caseNotes.thermalState || ''}
              onChange={(e) =>
                setCaseNotes((prev) => ({ ...prev, thermalState: e.target.value }))
              }
              placeholder="e.g. Chilly patient, craves warm drinks in small sips..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-medium block mb-0.5">
              Mental Disposition &amp; Working Totality
            </label>
            <textarea
              rows={3}
              value={caseNotes.mentalState || ''}
              onChange={(e) =>
                setCaseNotes((prev) => ({ ...prev, mentalState: e.target.value }))
              }
              placeholder="e.g. Irritable, hurried, cannot bear noise..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Senior Consultant Evaluation Proctor Button */}
      <div className="bg-slate-855 border border-slate-700/80 rounded-2xl p-4 shadow-md space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-400" />
            Senior Mentor Proctor
          </span>
          <span className="text-[10px] font-mono text-emerald-400">Agent B</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-normal">
          When you have collected a Hahnemannian totality, submit the transcript to receive a graded clinical scorecard.
        </p>

        <button
          type="button"
          onClick={handleEvaluate}
          disabled={isEvaluating}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition cursor-pointer min-h-[44px]"
        >
          {isEvaluating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Consultant Evaluating...</span>
            </>
          ) : (
            <>
              <Award className="w-4 h-4" />
              <span>Finish &amp; Request Senior Evaluation</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
