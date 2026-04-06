/**
 * StyleSelector
 * Horizontal scrolling chip list for choosing interior design style.
 */

const STYLES = [
  { id: 'Modern',        icon: '🏙️', desc: 'Clean lines & neutral tones' },
  { id: 'Minimalist',    icon: '⬜', desc: 'Less is more' },
  { id: 'Scandinavian',  icon: '🌿', desc: 'Warm, cozy, Nordic' },
  { id: 'Luxury',        icon: '✨', desc: 'Opulent & bespoke' },
  { id: 'Traditional',   icon: '🏛️', desc: 'Classic & timeless' },
  { id: 'Industrial',    icon: '🔩', desc: 'Raw, urban textures' },
]

export default function StyleSelector({ selected, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-3">
        Design Style
      </label>
      <div className="flex gap-3 flex-wrap">
        {STYLES.map((s) => (
          <button
            key={s.id}
            id={`style-${s.id.toLowerCase()}`}
            onClick={() => onChange(s.id)}
            className={`style-chip px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2
              border transition-all select-none cursor-pointer
              ${selected === s.id
                ? 'selected text-white border-transparent'
                : 'text-slate-400 border-white/10 hover:border-indigo-400/60 hover:text-slate-200'
              }`}
            style={selected !== s.id ? { background: 'rgba(255,255,255,0.04)' } : {}}
          >
            <span className="text-base leading-none">{s.icon}</span>
            {s.id}
          </button>
        ))}
      </div>
    </div>
  )
}

export { STYLES }
