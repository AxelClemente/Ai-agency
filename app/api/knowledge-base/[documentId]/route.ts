import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  req: NextRequest, 
  { params }: { params: Promise<{ documentId: string }> }
) {
  const { documentId } = await params;
  console.log('🗑️ Knowledge Base Delete - Document ID:', documentId);
  
  try {
    if (!documentId) {
      console.log('❌ No document ID provided');
      return NextResponse.json({ error: 'Document ID requerido' }, { status: 400 });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      console.log('❌ No ElevenLabs API key found');
      return NextResponse.json({ error: 'API Key no configurada' }, { status: 500 });
    }

    console.log('📡 Deleting document from ElevenLabs...');
    const response = await fetch(`https://api.elevenlabs.io/v1/convai/knowledge-base/${documentId}`, {
      method: 'DELETE',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });

    console.log('📡 ElevenLabs delete response status:', response.status);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('❌ ElevenLabs error:', errorBody);
      return NextResponse.json({ 
        error: 'Error eliminando documento de ElevenLabs',
        details: errorBody 
      }, { status: response.status });
    }

    console.log('✅ Document deleted successfully');
    
    return NextResponse.json({ 
      success: true,
      message: 'Documento eliminado correctamente'
    });

  } catch (error) {
    console.error('💥 Error in delete knowledge base document:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 