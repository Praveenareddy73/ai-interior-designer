# AI Interior Designer 🏠✨

Transform any room photo into a stunning interior redesign using AI, powered by the **Replicate fofr/room-reimagine** model.

## Stack

| Layer    | Tech                                |
|----------|-------------------------------------|
| Frontend | React 18 + Vite + TailwindCSS v3    |
| Backend  | FastAPI + Uvicorn (Python 3.11+)    |
| AI Model | [fofr/room-reimagine](https://replicate.com/fofr/room-reimagine) via Replicate |

---

## Project Structure

```
ai-interior-redesign/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── ImageUploader.jsx
│   │   │   ├── StyleSelector.jsx
│   │   │   ├── LoadingOverlay.jsx
│   │   │   ├── ResultCard.jsx
│   │   │   └── ErrorBanner.jsx
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── server/
│   ├── main.py              # FastAPI backend
│   └── requirements.txt
├── .env                     # API key goes here
└── README.md
```

---

## Quick Start

### 1. Get a Replicate API Token

1. Sign up at [replicate.com](https://replicate.com)
2. Go to **Account → API tokens**
3. Copy your token

### 2. Set the API token

Edit `.env` in the project root:

```env
REPLICATE_API_TOKEN=r8_xxxxxxxxxxxxxxxxxxxx
```

### 3. Start the Backend

```bash
cd server

# Create and activate virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload --port 8000
```

The API is now available at `http://127.0.0.1:8000`

### 4. Start the Frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Usage

1. **Upload** a JPG or PNG photo of your room (up to 10 MB)
2. **Choose a style** — Modern, Minimalist, Scandinavian, Luxury, Traditional, or Industrial
3. Click **Generate Redesign**
4. Wait 20–60 seconds for the AI to work its magic
5. **Download** the redesigned image

---

## API Endpoint

```
POST http://127.0.0.1:8000/redesign
Content-Type: multipart/form-data

Fields:
  file   (binary)  — room image
  style  (string)  — e.g. "Modern"

Response:
{
  "image_url":    "https://...",
  "image_base64": "data:image/webp;base64,...",
  "style":        "Modern"
}
```

---

## Supported Design Styles

| Style         | Description                        |
|---------------|------------------------------------|
| Modern        | Clean lines, neutral palette       |
| Minimalist    | Less is more, monochromatic        |
| Scandinavian  | Warm, cozy, Nordic hygge           |
| Luxury        | Opulent, gold accents, velvet      |
| Traditional   | Classic, mahogany, ornate details  |
| Industrial    | Exposed brick, steel, Edison bulbs |

---

## Error Handling

| Error | Cause | Fix |
|-------|-------|-----|
| `REPLICATE_API_TOKEN is not set` | Missing env var | Add token to `.env` |
| `Cannot reach the backend server` | Server not started | Run `uvicorn main:app` |
| `Uploaded file must be a valid image` | Wrong file type | Use JPG/PNG/WebP |
| `Image must be smaller than 10 MB` | File too large | Compress image |
| `Replicate API error: ...` | Model issue | Check Replicate dashboard |
