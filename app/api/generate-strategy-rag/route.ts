import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { input } = await request.json();

    const apiKey = process.env.DIFY_API_KEY || process.env.NEXT_PUBLIC_DIFY_API_KEY || '';
    
    if (!apiKey) {
      return NextResponse.json({ error: '请在 Settings -> Secrets 中配置 DIFY_API_KEY' }, { status: 500 });
    }

    // Using blocking mode for easier handling, though user curl had streaming.
    // If streaming is strictly required, this would need to return a stream.
    const response = await fetch('https://api.dify.ai/v1/workflows/run', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: { 
          user_input: input
        },
        response_mode: 'streaming', 
        user: 'abc-123'
      })
    });

    if (!response.ok) {
      const responseText = await response.text();
      console.error('Dify API Error:', response.status, responseText);
      return NextResponse.json({ error: `Dify API Error ${response.status}: ${responseText}` }, { status: response.status });
    }

    // Return the readable stream directly to the client
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Internal server error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
