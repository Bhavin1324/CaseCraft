import { MessageSquare, FileText, BookOpen, Award } from 'lucide-react';

export default function AppMobileNav({ activeTab, setActiveTab }) {
  return (
    <nav
      className="md:hidden border-t border-slate-800 bg-slate-900/90 backdrop-blur-md px-2 py-1.5 flex items-center justify-around shrink-0 z-40"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)' }}
    >
      <button
        onClick={() => setActiveTab('simulator')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition cursor-pointer min-h-[44px] ${
          activeTab === 'simulator'
            ? 'text-emerald-400 font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <MessageSquare className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">Consult</span>
      </button>

      <button
        onClick={() => setActiveTab('casesheet')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition cursor-pointer min-h-[44px] ${
          activeTab === 'casesheet'
            ? 'text-emerald-400 font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <FileText className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">Case Sheet</span>
      </button>

      <button
        onClick={() => setActiveTab('repertory')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition cursor-pointer min-h-[44px] ${
          activeTab === 'repertory'
            ? 'text-emerald-400 font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <BookOpen className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">Rubrics</span>
      </button>

      <button
        onClick={() => setActiveTab('interview')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition cursor-pointer min-h-[44px] ${
          activeTab === 'interview'
            ? 'text-emerald-400 font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Award className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">60s SBAR</span>
      </button>
    </nav>
  );
}
