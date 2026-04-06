"""
AI Interior Designer – FastAPI Backend (HuggingFace Inference API)
Uses: black-forest-labs/FLUX.1-dev
"""

import os
import base64
import asyncio
import httpx
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

app = FastAPI(title="AI Interior Redesign API", version="1.0.2")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_URL = "https://api-inference.huggingface.co/models/stabilityai/sdxl-turbo"

def build_prompt(style: str) -> str:
    """Requested prompt template format"""
    return (
        f"Redesign this room into a {style} interior design style. "
        "Keep the same layout but improve lighting, materials, furniture, and decor. "
        "Make it photorealistic and well-lit."
    )

@app.get("/")
async def health():
    return {"status": "ok", "message": "AI Interior HF API is running"}

# Mapped to both endpoints to not break the current React UI which calls /redesign
@app.post("/redesign")
@app.post("/generate-image")
async def generate_image(
    file: UploadFile = File(None, description="Optional JPG or PNG photo"),
    style: str = Form("Modern", description="Desired interior design style"),
):
    hf_token = os.getenv("HF_TOKEN")
    if not hf_token or hf_token.startswith("your_"):
        raise HTTPException(
            status_code=500,
            detail="HF_TOKEN is not set. Add it to the .env file in the project root."
        )

    headers = {
        "Authorization": f"Bearer {hf_token}",
        "Content-Type": "application/json"
    }

    prompt = build_prompt(style)
    payload = {
        "inputs": prompt,
        "parameters": {
            "guidance_scale": 3.0,
            "num_inference_steps": 28
        }
    }
    
    # Send request with retry logic for 503 "Model is warming up"
    max_retries = 3
    for attempt in range(max_retries):
        try:
            async with httpx.AsyncClient(timeout=120) as client:
                response = await client.post(MODEL_URL, headers=headers, json=payload)
                
                if response.status_code == 503:
                    print(f"[generate] 503 Model warming up. Attempt {attempt+1}/{max_retries}...")
                    if attempt < max_retries - 1:
                        await asyncio.sleep(5)  # Pause before retry
                        continue
                    else:
                        raise HTTPException(
                            status_code=503, 
                            detail="Model is warming up—please try again."
                        )
                        
                response.raise_for_status()

                # HF Inference API typically returns raw image bytes
                content_type = response.headers.get("content-type", "")
                if content_type.startswith("image"):
                    img_bytes = response.content
                    b64_image = base64.b64encode(img_bytes).decode("utf-8")
                    return {
                        "image_url": None,
                        "image_base64": f"data:{content_type};base64,{b64_image}",
                        "style": style
                    }
                else:             
                    raise Exception(f"Unexpected response content type: {content_type}")
                    
        except Exception as exc:
            if isinstance(exc, HTTPException):
                raise exc
            print(f"[generate] Error on attempt {attempt+1}: {str(exc)}")
            if attempt == max_retries - 1:
                # Fallback friendly error like requested
                raise HTTPException(status_code=502, detail="Model is warming up—please try again.")
            
            await asyncio.sleep(3)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
