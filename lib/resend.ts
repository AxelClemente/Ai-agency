export interface ResendEmailOptions {
    from: string
    to: string | string[]
    subject: string
    html?: string
    text?: string
  }
  
  export class Resend {
    private readonly apiKey: string;
    public emails: {
      send: (options: ResendEmailOptions) => Promise<{
        id: string
        from: string
        to: string[]
        created_at: string
      }>
    }
    
    constructor(apiKey: string) {
      this.apiKey = apiKey;
      this.emails = {
        send: async (options: ResendEmailOptions) => {
          // Esta es una implementación mock que será reemplazada por la instancia real de Resend
          return {
            id: '',
            from: options.from,
            to: Array.isArray(options.to) ? options.to : [options.to],
            created_at: new Date().toISOString()
          }
        }
      }
    }
  }