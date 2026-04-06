import { useRef, useState } from 'react'

/**
 * ImageUploader
 * Drag-and-drop + click-to-browse file uploader.
 * Shows a preview thumbnail once an image is selected.
 */
export default function ImageUploader({ onImageSelect, previewUrl }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  // Handle file from input or drop
  const handleFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Please upload a JPG or PNG image.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Image must be smaller than 10 MB.')
      return
    }
    onImageSelect(file)
  }

  const onInputChange = (e) => handleFile(e.target.files[0])

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        Room Photo
      </label>

      {/* Drop Zone */}
      <div
        id="drop-zone"
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`drop-zone rounded-2xl cursor-pointer overflow-hidden relative
          ${dragging ? 'over' : ''}
          ${previewUrl ? 'h-56' : 'h-48 flex flex-col items-center justify-center gap-3'}`}
        style={{ background: 'rgba(255,255,255,0.03)' }}
      >
        {/* Hidden input */}
        <input
          ref={inputRef}
          id="image-input"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={onInputChange}
        />

        {previewUrl ? (
          /* Preview image fills the box */
          <>
            <img
              src={previewUrl}
              alt="Room preview"
              className="w-full h-full object-cover"
            />
            {/* Overlay to re-upload */}
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100
              transition-opacity flex items-center justify-center gap-2 text-sm font-medium">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16v2a2 2 0 002 2h14a2 2 0 002-2v-2M12 12V4m0 0L8 8m4-4l4 4"/>
              </svg>
              Change Image
            </div>
          </>
        ) : (
          /* Empty state */
          <>
            <div className="w-14 h-14 rounded-full flex items-center justify-center"
                 style={{ background: 'rgba(99,102,241,0.15)' }}>
              <svg className="w-7 h-7 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16v2a2 2 0 002 2h14a2 2 0 002-2v-2M12 12V4m0 0L8 8m4-4l4 4"/>
              </svg>
            </div>
            <div className="text-center">
              <p className="text-slate-300 font-medium text-sm">Click or drag &amp; drop</p>
              <p className="text-slate-500 text-xs mt-1">JPG, PNG, WebP • max 10 MB</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
