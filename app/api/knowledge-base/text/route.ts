import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, name } = await req.json();
    console.log('📡 Adding Text to Knowledge Base:', { name, textLength: text?.length });
    
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) return NextResponse.json({ success: false, error: 'Missing API key' }, { status: 500 });
    
    const requestBody = { text, name };
    console.log('📡 ElevenLabs request body:', { ...requestBody, text: text?.substring(0, 100) + '...' });
    
    const res = await fetch('https://api.elevenlabs.io/v1/convai/knowledge-base/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify(requestBody),
    });
    
    const data = await res.json();
    console.log('📡 ElevenLabs response status:', res.status);
    console.log('📡 ElevenLabs response data:', data);
    
    if (!res.ok) {
      console.log('❌ ElevenLabs error:', { status: res.status, data });
      return NextResponse.json({ 
        success: false, 
        error: data.error || data.message || 'Failed to create document from text',
        details: data 
      }, { status: res.status });
    }
    
    return NextResponse.json({ success: true, document: data }, { status: 200 });
  } catch (error) {
    console.log('❌ Exception in Text endpoint:', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
} 