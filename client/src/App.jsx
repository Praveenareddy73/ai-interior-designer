import { useState, useCallback } from 'react'
import Header from './components/Header.jsx'
import ImageUploader from './components/ImageUploader.jsx'
import StyleSelector from './components/StyleSelector.jsx'
import LoadingOverlay from './components/LoadingOverlay.jsx'
import ResultCard from './components/ResultCard.jsx'
import ErrorBanner from './components/ErrorBanner.jsx'
import { redesignRoom } from './api.js'

export default function App() {
  // ── State ──────────────────────────────────────────────────────
  const [imageFile, setImageFile]     = useState(null)
  const [previewUrl, setPreviewUrl]   = useState(null)
  const [style, setStyle]             = useState('Modern')
  const [loading, setLoading]         = useState(false)
  const [loadStep, setLoadStep]       = useState(0)
  const [result, setResult]           = useState(null)  // { image_url, image_base64, style }
  const [error, setError]             = useState(null)

  // ── Handlers ───────────────────────────────────────────────────

  const handleImageSelect = useCallback((file) => {
    setImageFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setResult(null)   // clear old result
    setError(null)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!imageFile) return

    setLoading(true)
    setResult(null)
    setError(null)
    setLoadStep(0)

    try {
      const data = await redesignRoom(imageFile, style, setLoadStep)
      setResult(data)
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const canSubmit = !!imageFile && !loading

  // ── Render ─────────────────────────────────────────────────────
  return (
    <>
      {/* Animated mesh background */}
      <div className="mesh-bg" aria-hidden="true" />

      <div className="relative min-h-screen py-6 px-4">
        {/* Header */}
        <Header />

        {/* ── Main layout ── */}
        <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 pb-16">

          {/* ── LEFT: Input panel ── */}
          <section className="glass rounded-3xl p-7 flex flex-col gap-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

              {/* Upload */}
              <ImageUploader
                onImageSelect={handleImageSelect}
                previewUrl={previewUrl}
              />

              {/* Style selector */}
              <StyleSelector selected={style} onChange={setStyle} />

              {/* Error banner */}
              <ErrorBanner
                message={error}
                onDismiss={() => setError(null)}
              />

              {/* Submit */}
              <button
                id="generate-btn"
                type="submit"
                disabled={!canSubmit}
                className="grad-btn text-white font-bold py-4 rounded-2xl text-base
                  flex items-center justify-center gap-2 mt-auto"
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Redesigning…
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.091z"/>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"/>
                    </svg>
                    Generate Redesign
                  </>
                )}
              </button>
            </form>
          </section>

          {/* ── RIGHT: Output panel ── */}
          <section id="results-panel" className="glass rounded-3xl p-7 flex flex-col">
            <h2 className="text-lg font-semibold text-slate-200 mb-5">
              AI Generated Design
            </h2>

            {/* Empty state */}
            {!loading && !result && (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-12">
                <div className="w-20 h-20 rounded-full flex items-center justify-center"
                     style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)' }}>
                  <svg className="w-9 h-9 text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 20.25h18M3.75 3h16.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75V3.75A.75.75 0 013.75 3z"/>
                  </svg>
                </div>
                <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
                  Upload a room photo and pick a style — your AI-redesigned interior will appear here.
                </p>
              </div>
            )}

            {/* Loading */}
            {loading && <LoadingOverlay step={loadStep} />}

            {/* Result */}
            {!loading && result && (
              <ResultCard
                imageBase64={result.image_base64}
                imageUrl={result.image_url}
                style={result.style}
              />
            )}
          </section>
        </main>

        {/* Footer */}
        <footer className="text-center text-slate-600 text-xs pb-4">
          Powered by{' '}
          <a href="https://huggingface.co/" target="_blank" rel="noopener noreferrer"
             className="hover:text-slate-400 transition-colors underline underline-offset-2">
            Hugging Face
          </a>
          {' '}·{' '}
          <span className="font-medium text-slate-500">FLUX.1-dev</span>
        </footer>
      </div>
    </>
  )
}
