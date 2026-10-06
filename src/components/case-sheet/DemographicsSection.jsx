import { ShieldCheck } from 'lucide-react';

export default function DemographicsSection({ scenario, caseNotes = {}, updateField }) {
  return (
    <div className="bg-slate-855 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-lg">
      <div className="flex items-center justify-between mb-3 border-b border-slate-700/70 pb-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          I. Patient Demographics &amp; Presenting State
        </h3>
        <span className="text-[11px] text-slate-400 font-mono">Form 101</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
        <div>
          <label className="text-slate-400 block mb-1 font-medium">Patient Name &amp; Demographics</label>
          <input
            type="text"
            defaultValue={scenario?.patientName || ''}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="text-slate-400 block mb-1 font-medium">Occupation &amp; Environment</label>
          <input
            type="text"
            placeholder="e.g. Sedentary corporate lawyer, high-stress desk job"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="text-slate-400 block mb-1 font-medium">Consultation Date &amp; Setting</label>
          <input
            type="text"
            defaultValue={new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="mt-3 text-xs">
        <label className="text-slate-400 block mb-1 font-medium">
          Chief Presenting Complaint (Patient&apos;s Own Words - Aphorism 84)
        </label>
        <textarea
          rows={2}
          value={caseNotes.chiefComplaint || scenario?.chiefComplaint || ''}
          onChange={(e) => updateField('chiefComplaint', e.target.value)}
          placeholder="Record chief complaints verbatim without premature medical labeling..."
          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
        />
      </div>
    </div>
  );
}
