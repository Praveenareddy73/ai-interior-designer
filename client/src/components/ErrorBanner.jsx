/**
 * ErrorBanner
 * Displays an error message with an icon and dismiss button.
 */
export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null
  return (
    <div id="error-banner"
         className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm mt-4
           border border-red-400/25 text-red-300"
         style={{ background: 'rgba(239,68,68,0.1)' }}>
      {/* Icon */}
      <svg className="w-5 h-5 mt-0.5 shrink-0 text-red-400" fill="none" stroke="currentColor"
           strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      </svg>

      <span className="flex-1">{message}</span>

      {/* Dismiss */}
      <button onClick={onDismiss} className="text-red-400 hover:text-red-200 transition-colors ml-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
  )
}
