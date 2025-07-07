import { NextRequest, NextResponse } from 'next/server';
import { TOOL_FUNCTIONS, ELEVENLABS_TOOLS } from '@/lib/elevenlabs-tools';

export async function POST(req: NextRequest) {
  console.log('🔧 [ELEVENLABS PROXY] Tool call received from agent...');
  
  try {
    const body = await req.json();
    console.log('📥 [ELEVENLABS PROXY] Request body:', body);

    // Verificar que sea una llamada de herramienta válida
    const { tool_name, arguments: args } = body;

    if (!tool_name) {
      console.log('❌ [ELEVENLABS PROXY] Missing tool_name in request');
      return NextResponse.json({ 
        error: 'Missing tool_name parameter' 
      }, { status: 400 });
    }

    // Verificar que la herramienta existe
    if (!TOOL_FUNCTIONS[tool_name]) {
      console.log('❌ [ELEVENLABS PROXY] Unknown tool:', tool_name);
      return NextResponse.json({ 
        error: `Unknown tool: ${tool_name}` 
      }, { status: 400 });
    }

    console.log('🔧 [ELEVENLABS PROXY] Executing tool:', tool_name, 'with args:', args);

    // Ejecutar la herramienta
    const toolFunction = TOOL_FUNCTIONS[tool_name] as (...args: unknown[]) => Promise<unknown>;
    let result;

    try {
      if (tool_name === 'get_reservations') {
        // Para get_reservations, pasamos el parámetro date si existe
        result = await toolFunction(args?.date);
      } else {
        // Para otras herramientas, pasamos todos los argumentos
        result = await toolFunction(args);
      }
    } catch (error) {
      console.error('❌ [ELEVENLABS PROXY] Tool execution error:', error);
      return NextResponse.json({ 
        error: `Tool execution failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }, { status: 500 });
    }

    console.log('✅ [ELEVENLABS PROXY] Tool execution successful:', {
      tool: tool_name,
      success: (result as { success?: boolean })?.success
    });

    return NextResponse.json({
      success: true,
      tool_name,
      result
    });

  } catch (error) {
    console.error('❌ [ELEVENLABS PROXY] Error processing tool call:', error);
    return NextResponse.json({ 
      error: 'Failed to process tool call' 
    }, { status: 500 });
  }
}

// Endpoint para obtener la lista de herramientas disponibles
export async function GET() {
  console.log('📋 [ELEVENLABS PROXY] Tools list requested...');
  
  try {
    return NextResponse.json({
      success: true,
      tools: ELEVENLABS_TOOLS
    });
  } catch (error) {
    console.error('❌ [ELEVENLABS PROXY] Error getting tools list:', error);
    return NextResponse.json({ 
      error: 'Failed to get tools list' 
    }, { status: 500 });
  }
} 