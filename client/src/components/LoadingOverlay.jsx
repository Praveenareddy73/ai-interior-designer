/**
 * LoadingOverlay
 * Shown while the Replicate model is processing.
 * Cycles through animated step indicators.
 */

const STEPS = [
  'Uploading your room photo…',
  'Calling AI redesign model…',
  'Generating photorealistic image…',
  'Almost there — final touches…',
]

export default function LoadingOverlay({ step }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 gap-6">
      {/* Spinner */}
      <div className="spinner" />

      <div className="text-center space-y-1">
        <p className="text-slate-200 font-semibold text-base">Redesigning your room…</p>
        <p className="text-slate-500 text-sm">This usually takes 20–60 seconds</p>
      </div>

      {/* Step list */}
      <ol className="space-y-2 text-left w-full max-w-xs">
        {STEPS.map((label, i) => {
          const done    = i < step
          const active  = i === step
          const pending = i > step
          return (
            <li key={i} className={`flex items-center gap-3 text-sm
              ${active  ? 'text-indigo-300 step-active font-medium' : ''}
              ${done    ? 'text-emerald-400'  : ''}
              ${pending ? 'text-slate-600'    : ''}`}
            >
              {/* Dot / check */}
              {done ? (
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
              ) : (
                <span className={`w-4 h-4 shrink-0 rounded-full border-2 flex items-center justify-center
                  ${active ? 'border-indigo-400 bg-indigo-400/20' : 'border-slate-600'}`}>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 block"/>}
                </span>
              )}
              {label}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
