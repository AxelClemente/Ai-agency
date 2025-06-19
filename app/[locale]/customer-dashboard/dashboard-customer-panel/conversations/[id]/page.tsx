import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "../../components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Brain, Clock, MessageSquare, User } from "lucide-react"

export default async function ConversationAnalysisPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  // TODO: Fetch conversation data using params.id
  // const conversation = await prisma.conversation.findUnique({
  //   where: { id: params.id },
  //   include: { analysis: true }
  // })

  const { id } = await params;

  return (
    <div className="flex flex-col">
      <DashboardHeader />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        {/* Header with conversation info */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Análisis de Conversación</h2>
            <p className="text-muted-foreground">ID: {id}</p>
          </div>
          <Button variant="outline" className="ml-auto">
            <Brain className="mr-2 h-4 w-4" />
            Analizar con IA
          </Button>
        </div>

        {/* Quick stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Duración</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5m 42s</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mensajes</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agente</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Hostelería</div>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Tabs */}
        <Tabs defaultValue="summary" className="space-y-4">
          <TabsList>
            <TabsTrigger value="summary">Resumen</TabsTrigger>
            <TabsTrigger value="transcript">Transcripción</TabsTrigger>
            <TabsTrigger value="analysis">Análisis IA</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Resumen Programático</CardTitle>
                <CardDescription>Análisis automático de la conversación</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Aquí irá el análisis programático que ya tenemos */}
                <div className="space-y-2">
                  <h4 className="font-medium">Productos Mencionados</h4>
                  <ul className="list-disc pl-4">
                    <li>Pizza Margherita</li>
                    <li>Bebida Cola</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Estado del Pedido</h4>
                  <p>Completado exitosamente</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transcript" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Transcripción Completa</CardTitle>
                <CardDescription>Conversación entre agente y usuario</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap font-mono text-sm">
                  {/* Aquí irá la transcripción */}
                  Usuario: Hola, quisiera hacer un pedido
                  Agente: ¡Hola! Por supuesto, ¿qué te gustaría ordenar?
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Análisis de IA</CardTitle>
                <CardDescription>Insights generados por IA</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Sentimiento General</h4>
                    <p>Positivo - El cliente mostró satisfacción con el servicio</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Puntos Clave</h4>
                    <ul className="list-disc pl-4">
                      <li>Cliente regular - mencionó pedidos anteriores</li>
                      <li>Preferencia por opciones vegetarianas</li>
                      <li>Interés en promociones futuras</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}