export default function ModelSelector({
  provider,
  selectedModel,
  onSelectModel
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-300 mb-1">
        Select Model
      </label>
      <select
        value={selectedModel}
        onChange={(e) => onSelectModel(e.target.value)}
        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none cursor-pointer"
      >
        {provider === 'gemini' ? (
          <>
            <option value="gemini-1.5-flash">Gemini 1.5 Flash (Recommended Free Tier Default)</option>
            <option value="gemini-2.0-flash">Gemini 2.0 Flash (Next-Gen High Performance)</option>
            <option value="gemini-1.5-flash-8b">Gemini 1.5 Flash 8B (Ultra-Lightweight)</option>
            <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Clinical Reasoning)</option>
            <option value="gemini-flash-lite-latest">Gemini Flash Lite Latest</option>
            <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
          </>
        ) : (
          <>
            <option value="gpt-4o-mini">GPT-4o-mini (Cost-effective & fast)</option>
            <option value="gpt-4o">GPT-4o (Most capable)</option>
          </>
        )}
      </select>
    </div>
  );
}
