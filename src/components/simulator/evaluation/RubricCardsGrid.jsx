import { useState } from 'react';
import { BookOpen, MessageSquareQuote, Check, Copy } from 'lucide-react';

export default function RubricCardsGrid({ suggestedRubrics = [] }) {
  const [copiedRubric, setCopiedRubric] = useState(null);

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    setCopiedRubric(text);
    setTimeout(() => setCopiedRubric(null), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-slate-700/70 pb-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          Kent Repertory Rubric Formulations
        </h4>
        <span className="text-[10px] text-slate-400">Patient Language → Repertorial Language</span>
      </div>

      {Array.isArray(suggestedRubrics) && suggestedRubrics.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {suggestedRubrics.map((r, i) => {
            if (typeof r === 'object' && r !== null) {
              const rubricText = r.kentRubric || r.rubric || r.title || 'Kent Repertory Rubric';
              const quote = r.patientQuote || r.quote || '';
              const significance = r.remedySignificance || r.significance || '';
              const isCopied = copiedRubric === rubricText;

              return (
                <div
                  key={i}
                  className="p-3.5 bg-slate-855 rounded-2xl border border-indigo-900/40 shadow-md space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    {quote && (
                      <div className="flex items-start gap-1.5 text-slate-300 italic text-[11px]">
                        <MessageSquareQuote className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        <span>&ldquo;{quote}&rdquo;</span>
                      </div>
                    )}

                    <div className="p-2 rounded-xl bg-slate-900 border border-indigo-950/60 flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] font-bold text-indigo-300 break-all">
                        {rubricText}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(rubricText)}
                        title="Copy Kent Rubric"
                        aria-label="Copy rubric text"
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer shrink-0 min-h-[40px] min-w-[40px] flex items-center justify-center"
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {significance && (
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        {significance}
                      </p>
                    )}
                  </div>
                </div>
              );
            }
            return (
              <div key={i} className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-indigo-300 font-mono text-[11px]">
                {String(r)}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-slate-400 italic text-[11px] p-4 text-center">
          No specific rubric formulations suggested for this transcript.
        </p>
      )}
    </div>
  );
}
