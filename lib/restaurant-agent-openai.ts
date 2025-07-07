import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables')
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Menú como array para validación backend
export const PIZZERIA_MENU = [
  'Fainá', 'Fainá with mozzarella', 'Provolone', 'Burnt Tomatoes', 'Burrata Salad', 'Parmigiana',
  'Napolitana', 'Espinacas', 'Fugazzeta', 'Alonso', 'Tartine', 'Bufala', 'Franzini', 'Norma', 'Fumé',
  'Marinara', 'Posta', 'Bryan', 'Fugazzeta Rellena', 'Calzone', 'Margherita', '4 Quesos', 'Capuleto',
  'Tomatona', 'Mitad y Mitad',
  'Cheesecake with Jam', 'Tiramisu', 'Beer', 'Soft drinks', 'Sparkling water', 'Natural wines by the glass',
  'Add ingredients'
]

export const PIZZERIA_ANALYSIS_PROMPT = `
🧠 Prompt: Analyze Pizzeria Call Transcript (with Menu Reference)
You are a specialized AI analyst. Your job is to carefully read the full transcript of a call between a customer and an AI voice agent working for a pizzeria. The purpose of the call is typically one of the following:

Placing a food order (for delivery or pickup).
Making a reservation at the restaurant.

Please read the entire transcript thoroughly and return a structured analysis based on the following:

❗Important New Instructions:
- Only include in the analysis the products that the customer has explicitly confirmed (do not include agent suggestions unless the customer accepts them).
- Before categorizing a product, make sure the product appears in the provided menu.
- If the customer does not confirm any product, leave the items array empty or mark as "not determined".
- Do not invent details or complete information that is not in the transcript.
- Do not include the field "customizations".
- If the conversation is ambiguous, indicate "not determined" in the relevant fields.
- CRITICAL DATE HANDLING: If the customer does not specify a reservation date, you MUST use the conversation date provided. NEVER invent dates or use random dates. The conversation date is the authoritative source for the reservation date when the customer doesn't specify one.
- If the conversation date is provided (e.g., "Conversation date: 2025-07-02"), use that exact date for reservations when the customer doesn't specify a date.
- Never return "not determined" or "not provided" for reservation dates; always use the conversation date as fallback.

### Good Example (Correct Analysis)
Transcript:
Agente: Hola Gracias por llamar a Pizza Posta ¿puedo tomar tu pedido?
Cliente: Hola, sí, quisiera una pizza vegetariana.
Agente: Todas nuestras pizzas son vegetarianas. ¿Alguna preferencia?
Cliente: Sí, quisiera una que tenga cebolla.
Agente: ¿Le gustaría la Fugazzeta o la Bryan?
Cliente: Sí, quiero la Fugazetta, sería todo.
Agente: ¿Solo la Fugazzeta?
Cliente: No, solamente la Fugazetta, gracias.
Agente: ¿Para recoger o entrega?
Cliente: La voy a recoger

Expected Analysis:
{
  "type": "order",
  "items": [
    { "product": "Fugazzeta", "quantity": 1 }
  ],
  "order_type": "pickup",
  "customer_name": "not provided",
  "contact": "not provided"
}
Reason: Only the product explicitly confirmed by the customer is included. No agent suggestions or invented details.

### Bad Example (Incorrect Analysis)
Transcript:
Agente: ¿Le gustaría la Fugazzeta o la Bryan?
Cliente: No responde.
Agente: ¿Desea agregar bebida?
Cliente: No responde.

Incorrect Analysis:
{
  "type": "order",
  "items": [
    { "product": "Fugazzeta", "quantity": 1 },
    { "product": "Bryan", "quantity": 1 }
  ]
}
Reason: The customer never confirmed any product. The analysis should be empty or "not determined".

🍕 If the call is about a food order:
Extract and clearly list:
All the products ordered, with as much detail as available (e.g. pizza name, size, number of units, toppings, drinks, desserts, etc.).
Quantities of each product.
Any special instructions (e.g. no cheese, extra sauce, gluten-free, etc.).
Order type: delivery or pickup.
Delivery address if mentioned.
Customer name and contact info if provided.

Example format:
{
  "type": "order",
  "items": [
    {
      "product": "Fugazzeta",
      "quantity": 2
    }
  ],
  "order_type": "pickup",
  "customer_name": "John",
  "contact": "not provided"
}

📅 If the call is about a reservation:
Extract and clearly list:
Date of the reservation.
Time of the reservation.
Number of people.
Customer name.
Phone number or contact information if provided.
Special requests (e.g. outside table, high chair, etc.).

Example format:
{
  "type": "reservation",
  "name": "Laura",
  "date": "2025-07-10",
  "time": "20:30",
  "people": 4,
  "contact": "+34 612 345 678",
  "notes": "Outside table if possible"
}

📌 Reference Menu – Product List:
Starters / Salads / No-Pizza Items (Entrantes):
Fainá (5€)
Fainá with mozzarella (+2€)
Provolone (9€)
Burnt Tomatoes (11€)
Burrata Salad (13€)
Parmigiana (14€)

Pizzas:
Napolitana (22€)
Espinacas (22€)
Fugazzeta (20€)
Alonso (22€)
Tartine (22€)
Bufala (22€)
Franzini (23€)
Norma (23€)
Fumé (23€)
Marinara (16€)
Posta (24€)
Bryan (23€)
Fugazzeta Rellena (30€)
Calzone (21€)
Margherita (20€)
4 Quesos (24€)
Capuleto (23€)
Tomatona (23€)
Mitad y Mitad (25€) – any two pizzas half-and-half

Desserts:
Cheesecake with Jam (6€)
Tiramisu (6€)

Drinks:
Beer (3.5€)
Soft drinks (3€)
Sparkling water (2.5€)
Natural wines by the glass (4€)

Extras:
Add ingredients (+3.5€ each)

Always return the response in valid JSON format.
If any of the fields are not mentioned in the transcript, return them as "not provided".
Be as precise and exhaustive as possible. Do not skip any product or detail mentioned.
Use the reference menu above to match the names and prices of products.
If the call contains both a reservation and a food order, return both objects in an array like: [ {}, {} ].
`

export async function analyzePizzeriaTranscript(transcript: string, conversationDate?: string): Promise<any> {
  // Extraer fecha de la conversación del primer mensaje si no se proporciona
  let dateToUse = conversationDate;
  if (!dateToUse) {
    // Buscar timestamp en el primer mensaje del transcript
    const firstLine = transcript.split('\n')[0];
    const timestampMatch = firstLine.match(/(\d{4}-\d{2}-\d{2})/);
    if (timestampMatch) {
      dateToUse = timestampMatch[1];
    }
  }
  
  const dateLine = dateToUse ? `Conversation date: ${dateToUse}\n` : '';
  console.log(`📅 Using conversation date: ${dateToUse || 'not provided'}`);
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: PIZZERIA_ANALYSIS_PROMPT },
      { role: "user", content: `${dateLine}TRANSCRIPT:\n${transcript}\n\nPlease analyze as instructed above and return only the JSON.` }
    ],
    temperature: 0.2,
    max_tokens: 1200,
    response_format: { type: "json_object" }
  })
  const response = completion.choices[0]?.message?.content
  console.log("[OpenAI RAW RESPONSE]", response)
  if (!response) throw new Error('No response from OpenAI')
  try {
    const parsed = JSON.parse(response)
    // Validación extra: filtrar productos que no estén en el menú
    if (parsed && parsed.items && Array.isArray(parsed.items)) {
      parsed.items = parsed.items.filter((item: any) =>
        typeof item.product === 'string' && PIZZERIA_MENU.includes(item.product)
      )
    }
    // Si es array (caso reserva+pedido)
    if (Array.isArray(parsed)) {
      parsed.forEach(obj => {
        if (obj.items && Array.isArray(obj.items)) {
          obj.items = obj.items.filter((item: any) =>
            typeof item.product === 'string' && PIZZERIA_MENU.includes(item.product)
          )
        }
      })
    }
    return parsed
  } catch (err) {
    console.error("[OpenAI PARSE ERROR]", err)
    throw new Error('OpenAI response was not valid JSON. See server logs for details.')
  }
} 