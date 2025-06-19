export async function GET() {
  return new Response(JSON.stringify({
    message: 'Socket.io server endpoint',
    status: 'ready'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
