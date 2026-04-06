export default {
  async fetch(request, env) {
    // 1. Handle CORS for requests from the Vite frontend
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        }
      });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ detail: 'Only POST allowed' }), { status: 405 });
    }

    try {
      // 2. Parse payload 
      const reqBody = await request.formData();
      const style = reqBody.get('style') || 'Modern';
      const file = reqBody.get('file');

      if (!file || typeof file === 'string') {
         return new Response(JSON.stringify({ detail: 'You must upload an image file to redesign.' }), { 
           status: 400,
           headers: { "Access-Control-Allow-Origin": "*" }
         });
      }

      // Convert uploaded file into a numeric Array as required by Cloudflare img2img AI
      const imageBuffer = await file.arrayBuffer();
      // Use Array.from instead of spread operator to avoid call stack limits on large images
      const imageArray = Array.from(new Uint8Array(imageBuffer));

      // 3. Build instruction
      const prompt = `Redesign this room into a ${style} interior design style. Keep the exact same layout but improve lighting, materials, furniture, and decor. Professional interior photography, photorealistic, cinematic lighting, 8k resolution, highly detailed, sharp focus.`;

      console.log(`[+] Executing img2img model for style: ${style}`);

      // 4. Run Edge Inference using Image-to-Image model
      // We use Stable Diffusion v1.5 img2img to modify the original photo rather than starting from scratch
      const response = await env.AI.run(
        '@cf/runwayml/stable-diffusion-v1-5-img2img',
        { 
          prompt: prompt,
          negative_prompt: "blurry, out of focus, low resolution, grainy, distorted, noisy, bad proportions, ugly, deformed, mutated furniture, empty, animated, cartoon",
          image: imageArray,
          strength: 0.55, // Increased so the AI has enough freedom to sharpen textures and draw crystal clear details
          guidance: 8.5, // Increased guidance makes the AI follow the "highly detailed, sharp focus" prompt better
          num_steps: 20
        }
      );

      // 5. Convert binary output stream to base64
      const buffer = await new Response(response).arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64String = btoa(binary);

      const base64Image = `data:image/jpeg;base64,${base64String}`;

      // 6. Return exact format expected by the frontend
      return new Response(JSON.stringify({
        image_base64: base64Image,
        style: style
      }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });

    } catch (e) {
      console.error("AI Run Error detail:", e);
      if (e.cause) console.error("Error cause:", e.cause);
      console.error(e.stack);
      return new Response(JSON.stringify({ 
        detail: 'Cloudflare Edge AI execution failed.', 
        error: e.message, 
        stack: e.stack, 
        cause: e.cause 
      }), { 
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  }
}
