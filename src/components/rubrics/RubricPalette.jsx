import { useState } from 'react';
import {
  BookOpen,
  Search,
  Check,
  Snowflake,
  Flame,
  Sparkles,
  Command,
  X,
  Plus
} from 'lucide-react';

const DEFAULT_RUBRICS = [
  {
    colloquial: 'Worse from cold wind or drafts',
    rubric: 'Generalities; Cold; air, draft; agg.',
    remedies: [
      { name: 'Nux-v', grade: 3 },
      { name: 'Acon', grade: 3 },
      { name: 'Hep', grade: 3 },
      { name: 'Sil', grade: 3 },
      { name: 'Ars', grade: 2 }
    ]
  },
  {
    colloquial: 'Worse from warmth or stuffy room',
    rubric: 'Generalities; Warmth; agg.; warm room',
    remedies: [
      { name: 'Puls', grade: 3 },
      { name: 'Sulph', grade: 3 },
      { name: 'Iod', grade: 3 },
      { name: 'Apis', grade: 3 },
      { name: 'Nat-m', grade: 2 }
    ]
  },
  {
    colloquial: 'Midnight anxiety & stomach burning',
    rubric: 'Stomach; Pain; burning; midnight, after',
    remedies: [
      { name: 'Ars', grade: 3 },
      { name: 'Phos', grade: 2 },
      { name: 'Iris', grade: 2 }
    ]
  },
  {
    colloquial: 'Wants frequent sips of warm water',
    rubric: 'Stomach; Thirst; small quantities, for; often',
    remedies: [
      { name: 'Ars', grade: 3 },
      { name: 'Chin', grade: 2 },
      { name: 'Ant-t', grade: 1 }
    ]
  },
  {
    colloquial: 'Desire for salty food and open air',
    rubric: 'Stomach; Desires; salt things',
    remedies: [
      { name: 'Nat-m', grade: 3 },
      { name: 'Phos', grade: 3 },
      { name: 'Med', grade: 3 },
      { name: 'Verat', grade: 2 }
    ]
  },
  {
    colloquial: 'Cannot bear consolation, weeps alone',
    rubric: 'Mind; Consolation; agg.',
    remedies: [
      { name: 'Nat-m', grade: 3 },
      { name: 'Ign', grade: 3 },
      { name: 'Sep', grade: 3 },
      { name: 'Sil', grade: 2 }
    ]
  },
  {
    colloquial: 'Violent temper with ineffectual urging for stool',
    rubric: 'Rectum; Urging; ineffectual',
    remedies: [
      { name: 'Nux-v', grade: 3 },
      { name: 'Ign', grade: 2 },
      { name: 'Sulph', grade: 2 }
    ]
  },
  {
    colloquial: 'Right-sided complaint, worse 4 PM to 8 PM',
    rubric: 'Generalities; Afternoon; 4 p.m. to 8 p.m.',
    remedies: [
      { name: 'Lyc', grade: 3 },
      { name: 'Chel', grade: 2 },
      { name: 'Coloc', grade: 2 }
    ]
  }
];

const DEFAULT_POLYCHRESTS = [
  {
    name: 'Nux Vomica',
    thermals: 'Chilly (Very sensitive to cold open air & uncovering)',
    thirst: 'Thirst during chill; craves fats, coffee, spicy stimulants',
    triad: [
      'Fiery, irritable, impatient executive demeanor',
      'Ineffectual urging for stool and gastric spasm',
      'Extreme chilliness < cold drafts & dry cold wind'
    ],
    modalities: '< Morning (waking), coffee, cold drafts, high stress; > Warmth, evening, uninterrupted rest',
    keynotes: 'Sedentary overwork, gastric irritability, hyperesthetic senses (light, noise, odors)',
    indicatedConditions: 'Dyspepsia, acute gastritis, morning insomnia at 3-4 AM, hangover, migraine from overwork'
  },
  {
    name: 'Arsenicum Album',
    thermals: 'Chilly (Craves intense heat, wrapping up warmly)',
    thirst: 'Thirst for frequent sips of warm drinks; unquenchable burn',
    triad: [
      'Midnight agony (1 AM - 2 AM) with extreme restlessness & pacing',
      'Violent burning pains relieved paradoxically by hot applications',
      'Profound prostration disproportionate to illness'
    ],
    modalities: '< Midnight to 2 AM, cold drinks, cold food; > Heat in all forms, warm drinks, elevated head',
    keynotes: 'Fastidious anxiety, terror of fatal outcome, burning stomach, phantom panic attacks',
    indicatedConditions: 'Pyloric gastritis, food poisoning, asthmatic nocturnal dyspnea, eczema with burning'
  },
  {
    name: 'Lycopodium Clavatum',
    thermals: 'Warm-blooded head, chilly extremities; craves warm food/drinks',
    thirst: 'Thirst for warm sips; cannot tolerate cold water',
    triad: [
      'Clockwork aggravation from 4:00 PM to 8:00 PM',
      'Right-sided symptoms traveling right to left',
      'Extreme abdominal flatulence with early satiety after a few bites'
    ],
    modalities: '< 4 PM - 8 PM, cold food, pressure of waistband; > Warm food/drinks, cool open room, passing flatus',
    keynotes: 'Intellectual arrogance with physical weakness, anticipatory anxiety, urinary red sand',
    indicatedConditions: 'GERD, hepatic congestion, chronic bloating, kidney stone colic (right), alopecia'
  },
  {
    name: 'Natrum Muriaticum',
    thermals: 'Hot patient (Deeply aggravated by sun, heat of stove)',
    thirst: 'Great unquenchable thirst for large quantities of cold water',
    triad: [
      'Ailments from silent grief, betrayed trust, emotional wounding',
      'Aggravation from consolation and exposure to seashore sun',
      'Craving for excessive salt; map tongue; cracked lower lip center'
    ],
    modalities: '< 10 AM to 11 AM, seaside, intense sun, consolation; > Open air, fasting, cold bathing, lying on right side',
    keynotes: 'Reserved, weeping in solitude, throbbing hammer headache over eyes, dry mucous membranes',
    indicatedConditions: 'Migraine with aura, chronic eczema at hairline, grief depression, allergic rhinitis'
  }
];

export default function RubricPalette({ onSelectRubric, isModal = false, isOpen = true, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedIdx, setCopiedIdx] = useState(null);

  const filteredRubrics = DEFAULT_RUBRICS.filter(
    (item) =>
      item.colloquial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.rubric.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.remedies.some((r) => r.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredPolychrests = DEFAULT_POLYCHRESTS.filter(
    (poly) =>
      poly.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poly.keynotes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poly.modalities.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (text, idx) => {
    navigator.clipboard?.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
    if (onSelectRubric) {
      onSelectRubric(text);
    }
  };

  const content = (
    <div className="space-y-5">
      {/* Search Input Box */}
      <div className="bg-slate-850/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
              Repertory &amp; Materia Medica Explorer
            </h2>
          </div>
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
            Kent Repertory Standards
          </span>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search phrase, rubric, or remedy (e.g. 'cold draft', 'sun', 'Nux')..."
            className="w-full h-11 bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-10 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 min-h-[44px]"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-2 min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Rubric Translation Cards (Optimized for Mobile Touch) */}
      <div className="bg-slate-850/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-700/70 pb-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            Patient-to-Repertory Rubrics ({filteredRubrics.length})
          </h3>
          <span className="text-[10px] text-slate-400">
            Grade 3: <strong className="text-emerald-400 font-bold">BOLD</strong>
          </span>
        </div>

        <div className="space-y-2.5">
          {filteredRubrics.map((item, idx) => (
            <div
              key={idx}
              className="p-3 sm:p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-medium text-slate-200 italic leading-snug">
                  &ldquo;{item.colloquial}&rdquo;
                </p>
                <button
                  type="button"
                  onClick={() => handleCopy(item.rubric, idx)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition cursor-pointer min-h-[36px] shrink-0 flex items-center gap-1.5 active:scale-[0.98]"
                >
                  {copiedIdx === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 text-[11px]">Added!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 text-teal-400" />
                      <span className="text-[11px]">Use Rubric</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <span className="text-emerald-300 font-mono text-[11px] font-bold block leading-relaxed break-words">
                  {item.rubric}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 items-center pt-0.5">
                <span className="text-[10px] text-slate-400 mr-1">Remedies:</span>
                {item.remedies.map((rem, rIdx) => (
                  <span
                    key={rIdx}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                      rem.grade === 3
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                        : rem.grade === 2
                        ? 'text-amber-300 italic bg-amber-500/10'
                        : 'text-slate-300 bg-slate-800'
                    }`}
                  >
                    {rem.name}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {filteredRubrics.length === 0 && (
            <p className="text-slate-400 italic text-xs text-center py-6">
              No matching rubrics found for &ldquo;{searchTerm}&rdquo;.
            </p>
          )}
        </div>
      </div>

      {/* Polychrest Triad Reference Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            Core Polychrest Keynotes ({filteredPolychrests.length})
          </h3>
          <span className="text-[10px] text-slate-400">3-Legged Stool</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {filteredPolychrests.map((poly, idx) => (
            <div
              key={idx}
              className="bg-slate-850/80 border border-slate-700/80 rounded-2xl p-4 shadow-lg flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm sm:text-base font-bold text-emerald-300">{poly.name}</h4>
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

                <div className="mb-2.5 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Keynote Triad:
                  </p>
                  <ul className="space-y-1">
                    {poly.triad.map((t, i) => (
                      <li key={i} className="text-xs text-emerald-200 flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1 text-xs text-slate-300 leading-relaxed">
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

              <div className="pt-2 border-t border-slate-750 text-[11px] text-slate-400">
                <strong className="text-slate-300">Indications:</strong> {poly.indicatedConditions}
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
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-xs p-0 sm:p-5 overflow-hidden animate-in fade-in duration-200">
        <div className="bg-slate-900 border-t sm:border border-slate-700/90 rounded-t-3xl sm:rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col h-[94dvh] sm:h-auto sm:max-h-[88vh] overflow-hidden animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 duration-200">
          {/* Mobile Drag Indicator Pill */}
          <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />

          {/* Modal Header */}
          <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-slate-800 bg-slate-900/95 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0">
                <Command className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-white text-sm sm:text-base truncate">
                  Kentian Repertory Palette
                </h3>
                <p className="text-[11px] text-slate-400 truncate">
                  Search rubrics and append directly to active case
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close repertory palette"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4 sm:p-5 overflow-y-auto overscroll-contain flex-1 pb-[max(env(safe-area-inset-bottom),1rem)]">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return content;
}
