/**
 * api.js
 * Handles the POST /redesign call to the FastAPI backend.
 * Sends image + style as multipart/form-data.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8787'

/**
 * @param {File}     imageFile  - The uploaded room image file
 * @param {string}   style      - Selected design style (e.g. "Modern")
 * @param {Function} onStep     - Callback(stepIndex) to update loading steps UI
 * @returns {Promise<{image_url, image_base64, style}>}
 */
export async function redesignRoom(imageFile, style, onStep) {
  onStep(0)  // Step 0: uploading

  const formData = new FormData()
  // Currently, the Lightning image model only handles text prompt in the worker, 
  // but we still send the multipart data since the UI relies on it!
  formData.append('file', imageFile)
  formData.append('style', style)

  onStep(1)  // Step 1: calling model

  let response
  try {
    response = await fetch(`${API_BASE}/redesign`, {
      method: 'POST',
      body: formData,
    })
  } catch (networkErr) {
    throw new Error(
      'Cannot reach the backend server. Make sure it is running on port 8000.'
    )
  }

  onStep(2)  // Step 2: generating

  if (!response.ok) {
    let detail = `Server error: ${response.status}`
    try {
      const json = await response.json()
      detail = json.detail || detail
    } catch (_) { /* ignore parse errors */ }
    throw new Error(detail)
  }

  onStep(3)  // Step 3: finalising

  const data = await response.json()
  return data
}
