import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.AIHUBMIX_API_KEY || process.env.NEXT_PUBLIC_AIHUBMIX_API_KEY || '';
    
    if (!apiKey) {
      return NextResponse.json({ error: '请在 Settings -> Secrets 中配置 AIHUBMIX_API_KEY' }, { status: 500 });
    }

    const response = await fetch('https://aihubmix.com/gemini/v1beta/models/gemini-3.1-flash-image-preview:streamGenerateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"],
          imageConfig: {
            aspectRatio: "1:1",
            imageSize: "1k"
          }
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AIHubMix API Error:', response.status, errorText);
      return NextResponse.json({ error: `AIHubMix API Error: ${response.status}` }, { status: response.status });
    }

    const rawText = await response.text();
    let base64Image = '';

    // 1. Try regex extraction first (most robust for malformed proxy streams)
    const dataMatch = rawText.match(/"data":\s*"([^"]+)"/);
    const mimeMatch = rawText.match(/"mimeType":\s*"([^"]+)"/);
    
    if (dataMatch && dataMatch[1]) {
      const mimeType = mimeMatch && mimeMatch[1] ? mimeMatch[1] : 'image/jpeg';
      base64Image = `data:${mimeType};base64,${dataMatch[1]}`;
    } else {
      // 2. Fallback to standard JSON parsing
      try {
        const data = JSON.parse(rawText);
        const chunks = Array.isArray(data) ? data : [data];
        for (const chunk of chunks) {
          if (chunk.candidates && chunk.candidates.length > 0) {
            const parts = chunk.candidates[0].content?.parts || [];
            for (const part of parts) {
              if (part.inlineData && part.inlineData.data) {
                base64Image = `data:${part.inlineData.mimeType || 'image/jpeg'};base64,${part.inlineData.data}`;
                break;
              }
            }
          }
          if (base64Image) break;
        }
      } catch (e) {
        console.error('Failed to parse JSON and regex failed:', e);
      }
    }

    if (base64Image) {
      return NextResponse.json({ image: base64Image });
    } else {
      console.error('No image found in response. Raw text snippet:', rawText.substring(0, 500));
      return NextResponse.json({ error: 'No image found in response' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Internal server error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
