import { useState, useEffect } from 'react';
import {
  Search,
  BookOpen,
  Sparkles,
  Snowflake,
  Flame,
  Copy,
  Check,
  Command,
  X
} from 'lucide-react';
import { DEFAULT_RUBRICS, DEFAULT_POLYCHRESTS } from './rubricData';

export default function RubricPalette({
  isModal = false,
  isOpen = false,
  onClose,
  onSelectRubric
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedIdx, setCopiedIdx] = useState(null);

  // Keyboard shortcut Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (onClose) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const filteredRubrics = DEFAULT_RUBRICS.filter(
    (r) =>
      r.colloquial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.rubric.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.remedies.some((rem) => rem.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredPolychrests = DEFAULT_POLYCHRESTS.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.triad.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.keynotes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
    if (onSelectRubric) {
      onSelectRubric(text);
    }
  };

  const content = (
    <div className="space-y-6">
      {/* Search Bar Header */}
      <div className="bg-slate-850/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Kentian Rubric & Materia Medica Explorer
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Translate everyday patient expressions into authoritative Kent Repertory rubrics.
            </p>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[11px] text-slate-300 font-mono">
            <Command className="w-3 h-3 text-emerald-400" />
            <span>K</span>
            <span className="text-slate-500">Quick Palette</span>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search colloquial phrase, rubric, or remedy (e.g. 'cold draft', 'sun', 'salt', 'Nux')..."
            className="w-full h-11 bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-10 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs p-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Rubric Translation Table */}
      <div className="bg-slate-850/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3 border-b border-slate-700/70 pb-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            Colloquial-to-Repertory Rubric Matches ({filteredRubrics.length})
          </h3>
          <span className="text-[10px] text-slate-400">
            Grades: <strong className="text-emerald-400">3 = BOLD UPPERCASE</strong>, <em>2 = Italics</em>, 1 = Regular
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-700">
              <tr>
                <th className="p-3">Patient Says (Colloquial)</th>
                <th className="p-3">Kentian Rubric Format</th>
                <th className="p-3">Leading Remedies & Grades</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredRubrics.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-medium text-slate-200 italic max-w-xs">
                    &ldquo;{item.colloquial}&rdquo;
                  </td>
                  <td className="p-3 text-emerald-300 font-mono text-[11px]">
                    {item.rubric}
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1.5 items-center">
                      {item.remedies.map((rem, rIdx) => (
                        <span
                          key={rIdx}
                          className={`px-1.5 py-0.5 rounded text-[11px] font-mono ${
                            rem.grade === 3
                              ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                              : rem.grade === 2
                              ? 'text-amber-300 italic'
                              : 'text-slate-300'
                          }`}
                        >
                          {rem.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleCopy(item.rubric, idx)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-medium transition cursor-pointer min-h-[32px] inline-flex items-center gap-1"
                    >
                      {copiedIdx === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-400" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Polychrest Triad Cheatsheet */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            Core Polychrest Triad Quick Reference ({filteredPolychrests.length})
          </h3>
          <span className="text-[11px] text-slate-400">The 3-legged stool of each leading remedy</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPolychrests.map((poly, idx) => (
            <div
              key={idx}
              className="bg-slate-850/80 border border-slate-700/80 rounded-2xl p-4 shadow-lg hover:border-emerald-500/40 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-base font-bold text-emerald-300">{poly.name}</h4>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      poly.thermals.includes('Chilly')
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {poly.thermals.includes('Chilly') ? (
                      <Snowflake className="w-3 h-3" />
                    ) : (
                      <Flame className="w-3 h-3" />
                    )}
                    {poly.thermals.split(' ')[0]}
                  </span>
                </div>

                {/* The Triad */}
                <div className="mb-3 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Three-Legged Stool (Keynote Triad):
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {poly.triad.map((t, i) => (
                      <span
                        key={i}
                        className="text-xs bg-slate-800 text-emerald-200 px-2 py-0.5 rounded border border-slate-700 font-medium"
                      >
                        • {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Modalities & Keynotes */}
                <div className="space-y-1 text-xs text-slate-300">
                  <p>
                    <strong className="text-slate-400">Modalities:</strong> {poly.modalities}
                  </p>
                  <p>
                    <strong className="text-slate-400">Thirst:</strong> {poly.thirst}
                  </p>
                  <p>
                    <strong className="text-slate-400">Mind:</strong> {poly.keynotes}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-700/60 text-[11px] text-slate-400">
                <strong>Common Indications:</strong> {poly.indicatedConditions}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (isModal) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
        <div className="bg-slate-900 border border-slate-700/90 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden my-auto">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Command className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-base">Quick Repertory Command Palette</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-5 overflow-y-auto">{content}</div>
        </div>
      </div>
    );
  }

  return content;
}
