/**
 * ResultCard
 * Displays the AI-generated redesigned room image.
 * Provides a Download button – either from base64 or falling back to URL.
 */
export default function ResultCard({ imageBase64, imageUrl, style }) {
  // Prefer base64 so download works cross-origin
  const src = imageBase64 || imageUrl

  const handleDownload = () => {
    const link = document.createElement('a')
    link.download = `ai-interior-${style.toLowerCase()}-redesign.png`
    link.href = imageBase64 || imageUrl
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.click()
  }

  return (
    <div className="space-y-4">
      {/* Badge */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-slate-300 text-sm font-medium">Style applied:</span>
        <span className="px-3 py-0.5 rounded-full text-xs font-bold"
              style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)', color: '#fff' }}>
          {style}
        </span>
      </div>

      {/* Image */}
      <div className="relative rounded-2xl overflow-hidden group"
           style={{ boxShadow: '0 0 40px rgba(99,102,241,0.2)' }}>
        <img
          id="result-image"
          src={src}
          alt={`${style} room redesign`}
          className="result-img w-full h-auto block"
        />

        {/* Download overlay button (appears on hover) */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100
          transition-opacity duration-300">
          <button
            id="download-image-btn"
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold
              text-slate-900 bg-white/90 hover:bg-white shadow-xl
              transition-all hover:scale-105"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0 0l-4-4m4 4l4-4"/>
            </svg>
            Download
          </button>
        </div>
      </div>

      {/* Standalone download button below image */}
      <button
        id="download-btn-below"
        onClick={handleDownload}
        className="w-full mt-2 py-3 rounded-xl font-semibold text-sm flex items-center
          justify-center gap-2 border border-indigo-400/40 text-indigo-300
          hover:border-indigo-400 hover:text-white hover:bg-indigo-500/10
          transition-all duration-200"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0 0l-4-4m4 4l4-4"/>
        </svg>
        Download Redesigned Image
      </button>
    </div>
  )
}
