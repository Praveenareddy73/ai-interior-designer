// This is the complete backend alternative created in Node.js per your request,
// although your app currently natively uses the FastAPI (Python) backend located in `main.py`.

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fetch from 'node-fetch';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

// Set up multer for multipart form-data (optional image uploads)
const upload = multer();

const MODEL_URL = 'https://api-inference.huggingface.co/models/stabilityai/sdxl-turbo';

// Same endpoint standard from requirements
app.post('/generate-image', upload.single('file'), async (req, res) => {
  try {
    const style = req.body.style || 'Modern';
    
    // Requested prompt format
    const finalPrompt = `Redesign this room into a ${style} interior design style. Keep the same layout but improve lighting, materials, furniture, and decor. Make it photorealistic and well-lit.`;

    const payload = {
      inputs: finalPrompt,
      parameters: {
        guidance_scale: 3.0,
        num_inference_steps: 28,
      },
    };

    let response;
    let retries = 3;

    // Retry loop for the "Model warming up" 503 error
    while (retries > 0) {
      response = await fetch(MODEL_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 503) {
        retries--;
        if (retries === 0) {
          return res.status(503).json({ detail: 'Model is warming up—please try again.' });
        }
        // Wait 5 seconds before retrying
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } else {
        break; // Break loop if not 503
      }
    }

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ detail: text || 'Model is warming up—please try again.' });
    }

    // HuggingFace returns the image as raw binary
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Default to jpeg if no content-type is provided
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const base64Image = `data:${contentType};base64,${buffer.toString('base64')}`;

    // Return using the exact same structure the frontend expects
    res.json({
      image_base64: base64Image,
      style: style,
    });
  } catch (error) {
    console.error('Generative API error:', error);
    res.status(500).json({ detail: 'Model is warming up—please try again.' });
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
