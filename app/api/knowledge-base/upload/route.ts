import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  console.log('📤 Knowledge Base Upload - Starting...');
  
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      console.log('❌ No ElevenLabs API key found');
      return NextResponse.json({ error: 'API Key no configurada' }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;

    if (!file) {
      console.log('❌ No file provided');
      return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 });
    }

    console.log('📤 Uploading file to ElevenLabs:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      customName: name
    });

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      console.log('❌ File too large:', file.size);
      return NextResponse.json({ 
        error: 'Archivo demasiado grande. Máximo 10MB permitido' 
      }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'text/plain',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      console.log('❌ Invalid file type:', file.type);
      return NextResponse.json({ 
        error: 'Tipo de archivo no soportado. Use PDF, TXT o DOCX' 
      }, { status: 400 });
    }

    // Create FormData for ElevenLabs API
    const elevenLabsFormData = new FormData();
    elevenLabsFormData.append('file', file);
    if (name) {
      elevenLabsFormData.append('name', name);
    }

    console.log('📡 Sending to ElevenLabs API...');
    const response = await fetch('https://api.elevenlabs.io/v1/convai/knowledge-base/file', {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
      },
      body: elevenLabsFormData,
    });

    console.log('📡 ElevenLabs response status:', response.status);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('❌ ElevenLabs error:', errorBody);
      return NextResponse.json({ 
        error: 'Error subiendo archivo a ElevenLabs',
        details: errorBody 
      }, { status: response.status });
    }

    const result = await response.json();
    console.log('✅ File uploaded successfully:', {
      id: result.id,
      name: result.name,
      prompt_injectable: result.prompt_injectable
    });
    
    return NextResponse.json({ 
      success: true, 
      document: result,
      message: 'Archivo subido correctamente'
    });

  } catch (error) {
    console.error('💥 Error in upload knowledge base:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 