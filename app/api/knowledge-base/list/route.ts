import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  console.log('📋 Knowledge Base List - Starting...');
  
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      console.log('❌ No ElevenLabs API key found');
      return NextResponse.json({ error: 'API Key no configurada' }, { status: 500 });
    }

    console.log('📡 Fetching knowledge base documents from ElevenLabs...');
    const response = await fetch('https://api.elevenlabs.io/v1/convai/knowledge-base', {
      method: 'GET',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });

    console.log('📡 ElevenLabs response status:', response.status);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('❌ ElevenLabs error:', errorBody);
      return NextResponse.json({ 
        error: 'Error obteniendo documentos de ElevenLabs',
        details: errorBody 
      }, { status: response.status });
    }

    const responseData = await response.json();
    console.log('📡 Raw ElevenLabs response:', responseData);

    // Handle different possible response structures
    let documents = [];
    
    if (Array.isArray(responseData)) {
      // If response is directly an array
      documents = responseData;
    } else if (responseData.documents && Array.isArray(responseData.documents)) {
      // If response has documents property
      documents = responseData.documents;
    } else if (responseData.data && Array.isArray(responseData.data)) {
      // If response has data property
      documents = responseData.data;
    } else {
      // If no documents found or empty response
      console.log('⚠️ No documents found or unexpected response structure');
      documents = [];
    }

    console.log('✅ Documents processed successfully:', {
      count: documents.length,
      documents: documents.map((doc: any) => ({
        id: doc.id,
        name: doc.name,
        prompt_injectable: doc.prompt_injectable
      }))
    });
    
    return NextResponse.json({ 
      success: true, 
      documents: documents
    });

  } catch (error) {
    console.error('💥 Error in list knowledge base:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 