import { Sparkles } from 'lucide-react';

export default function LsmcHierarchySection({ caseNotes = {}, updateField }) {
  return (
    <div className="bg-slate-855 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-lg">
      <div className="flex items-center justify-between mb-3 border-b border-slate-700/70 pb-2.5">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            II. Chief Complaint Hierarchy (Boenninghausen &amp; Kent LSMC)
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Every complete symptom requires: Location, Sensation, Modalities (&lt; / &gt;), and Concomitants.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="text-slate-300 font-semibold block mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            1. Exact Location &amp; Spread
          </label>
          <textarea
            rows={3}
            value={caseNotes.location || ''}
            onChange={(e) => updateField('location', e.target.value)}
            placeholder="Epigastrium radiating to chest; right temporal region; right knee joint..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="text-slate-300 font-semibold block mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            2. Sensation &amp; Character
          </label>
          <textarea
            rows={3}
            value={caseNotes.sensation || ''}
            onChange={(e) => updateField('sensation', e.target.value)}
            placeholder="Burning like chili powder; stitching pain; heavy crushing weight; pulsating hammer..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="text-slate-300 font-semibold block mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            3. Aggravations (&lt;)
          </label>
          <textarea
            rows={3}
            value={caseNotes.modalityAgg || ''}
            onChange={(e) => updateField('modalityAgg', e.target.value)}
            placeholder="< 3 AM to 4 AM, cold drafts, after heavy meal, tight clothes, consolation, motion..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="text-slate-300 font-semibold block mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            4. Ameliorations (&gt;)
          </label>
          <textarea
            rows={3}
            value={caseNotes.modalityAmel || ''}
            onChange={(e) => updateField('modalityAmel', e.target.value)}
            placeholder="> Warm drinks, hot applications on stomach, lying in dark quiet room, hard pressure..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="mt-3 text-xs">
        <label className="text-slate-300 font-semibold block mb-1">5. Concomitant Symptoms</label>
        <input
          type="text"
          value={caseNotes.concomitants || ''}
          onChange={(e) => updateField('concomitants', e.target.value)}
          placeholder="e.g. Constant nausea without relief from vomiting; chilliness during stool..."
          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
        />
      </div>
    </div>
  );
}
