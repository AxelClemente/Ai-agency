'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Brain, Utensils, Calendar, User, MapPin, CreditCard, Clock } from "lucide-react";
import { toast } from "sonner";

interface TranscriptionMessage {
  role: 'user' | 'ai';
  message: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  agentId: string;
  duration: number;
  transcript: string;
  messages: TranscriptionMessage[];
  startedAt: string;
}

interface RestaurantAnalysis {
  id: string;
  conversationId: string;
  products: Array<{
    name: string;
    quantity: number;
    price?: number;
    orderType?: string;
    order_type?: string;
  }>;
  orderType?: string;
  totalAmount?: number;
  reservation?: {
    date: string;
    time: string;
    people: number;
    tableType?: string;
    name?: string;
    contact?: string;
    notes?: string;
  };
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  customerIntent?: string;
  outcome?: string;
  sentiment?: string;
  specialRequests?: string[];
  paymentMethod?: string;
  estimatedTime?: string;
  createdAt: string;
}

interface RestaurantAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: Conversation;
}

// Tabla de menú local para precios
const MENU_PRICES: Record<string, number> = {
  // Entrantes, ensaladas, etc
  "Fainá o Farinata": 5,
  "Queso Mozzarella": 2, // extra
  "Provolone": 9,
  "Tomates Quemados": 11,
  "Ensalada de Burrata": 13,
  "Parmigiana": 14,

  // Pizzas principales
  "Napolitana": 22,
  "Espinacas": 22,
  "Fugazzeta": 20,
  "Alonso": 22,
  "Tartine": 22,
  "Bufala": 22,
  "Franzini": 23,
  "Norma": 23,
  "Fumé": 23,
  "Marinara": 16,
  "Posta": 24,
  "Bryan": 23,
  "Fugazzeta Rellena": 30,
  "Calzone": 21,
  "Margherita": 20,
  "4 Quesos": 24,
  "Capuleto": 23,
  "Tomatana": 23,
  "Mitad y Mitad": 25,

  // Postres
  "Tarta de queso casera con mermelada": 6,
  "Tarta de queso": 6,
  "Cheesecake with Jam": 6,
  "Tiramisú": 6,

  // Bebidas
  "Cerveza": 3.5,
  "Refrescos": 3,
  "Agua con gas": 2.5,
  "Vinos naturales por copa": 4,

  // Extras
  "Agrega ingredientes": 3.5,
};

export function RestaurantAnalysisModal({ isOpen, onClose, conversation }: RestaurantAnalysisModalProps) {
  const [analysis, setAnalysis] = useState<RestaurantAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (isOpen && conversation) {
      fetchAnalysis();
    }
  }, [isOpen, conversation]);

  const fetchAnalysis = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/conversations/${conversation.id}/restaurant-analysis`);
      const data = await response.json();

      if (response.ok && data.analysis) {
        setAnalysis(data.analysis);
      } else {
        setAnalysis(null);
      }
    } catch (error) {
      console.error('Error fetching analysis:', error);
      setAnalysis(null);
    } finally {
      setIsLoading(false);
    }
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch(`/api/conversations/${conversation.id}/restaurant-analysis`, {
        method: 'POST'
      });
      const data = await response.json();

      if (response.ok) {
        setAnalysis(data.analysis);
        toast("Análisis completado exitosamente", {
          description: "Los datos han sido extraídos de la conversación"
        });
      } else {
        toast("Error al analizar la conversación", {
          description: data.error || "No se pudo completar el análisis"
        });
      }
    } catch (error) {
      console.error('Error running analysis:', error);
      toast("Error al analizar la conversación", {
        description: "Ocurrió un error inesperado"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive': return 'default';
      case 'negative': return 'destructive';
      default: return 'secondary';
    }
  };

  const getOutcomeColor = (outcome?: string) => {
    switch (outcome?.toLowerCase()) {
      case 'completed_order': return 'default';
      case 'completed_reservation': return 'secondary';
      case 'abandoned': return 'destructive';
      default: return 'outline';
    }
  };

  // Helper para saber si el análisis es "vacío" o no útil
  const isAnalysisEmpty = (analysis: any) => {
    if (!analysis) return true;
    if (Array.isArray(analysis)) {
      return analysis.every(isAnalysisEmpty);
    }
    if (analysis.type === 'order' && (!analysis.items || analysis.items.length === 0)) return true;
    if (analysis.type === 'reservation' && (!analysis.date || analysis.date === 'not provided')) return true;
    return false;
  };

  // Determinar productos y tipo de pedido de forma robusta y segura
  const products = Array.isArray(analysis?.products) ? analysis.products : [];
  const orderType = analysis?.orderType ?? (products[0]?.orderType ?? products[0]?.order_type) ?? 'No determinado';

  // Enriquecer productos con precio
  const productsWithPrice = products.map((p) => {
    const price = p.price ?? MENU_PRICES[p.name || (p as any).product || ""] ?? null;
    return { ...p, price };
  });

  // Calcular total
  const totalAmount = productsWithPrice.reduce((sum, p) => sum + ((p.price ?? 0) * (p.quantity ?? 1)), 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Análisis AI - Restaurante
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-hidden">
          {/* Columna izquierda - Transcripción */}
          <div className="space-y-4 overflow-y-auto max-h-[70vh]">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Transcripción de la Conversación</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Duración: {formatDuration(conversation.duration)} | 
                  Fecha: {formatDate(conversation.startedAt)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {conversation.messages?.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <div className="text-sm font-medium mb-1">
                        {message.role === 'user' ? 'Cliente' : 'Agente'}
                      </div>
                      <div className="text-sm">{message.message}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Columna derecha - Análisis AI */}
          <div className="space-y-4 overflow-y-auto max-h-[70vh]">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Cargando análisis...</span>
              </div>
            ) : (!analysis || isAnalysisEmpty(analysis)) ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Análisis AI
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <div className="space-y-4">
                    <Brain className="h-12 w-12 mx-auto text-muted-foreground" />
                    <div>
                      <h3 className="text-lg font-medium mb-2">No hay análisis útil disponible</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Ejecuta el análisis AI para extraer información de pedidos, reservas y datos del cliente de esta conversación.
                      </p>
                    </div>
                    <Button 
                      onClick={runAnalysis} 
                      disabled={isAnalyzing}
                      className="w-full"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analizando...
                        </>
                      ) : (
                        <>
                          <Brain className="mr-2 h-4 w-4" />
                          Ejecutar Análisis AI
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Resumen del análisis */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-green-600" />
                      Resumen del Análisis
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={runAnalysis} disabled={isAnalyzing}>
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Re-analizando...
                        </>
                      ) : (
                        <>
                          <Brain className="mr-2 h-4 w-4" />
                          Re-analizar
                        </>
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant={getOutcomeColor(analysis.outcome)}>
                        {analysis.outcome?.replace('_', ' ').toUpperCase() || 'NO DETERMINADO'}
                      </Badge>
                      <Badge variant={getSentimentColor(analysis.sentiment)}>
                        {analysis.sentiment?.toUpperCase() || 'NEUTRAL'}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Análisis realizado: {formatDate(analysis.createdAt)}
                    </div>
                  </CardContent>
                </Card>

                {/* Productos pedidos */}
                {productsWithPrice.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Utensils className="h-5 w-5" />
                        Productos Pedidos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {productsWithPrice.map((product, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="font-medium">
                              {product.name || (product as any).product || "Producto no identificado"}
                            </span>
                            <div className="flex items-center gap-2">
                              {product.price !== null && (
                                <span className="text-xs text-muted-foreground mr-2">€{product.price}</span>
                              )}
                              <Badge variant="outline">x{product.quantity}</Badge>
                            </div>
                          </div>
                        ))}
                        {productsWithPrice.length > 0 && (
                          <div className="flex justify-between items-center pt-2 border-t mt-2">
                            <span className="font-bold">Total:</span>
                            <span className="font-bold text-lg">€{totalAmount}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Información de reserva */}
                {analysis.reservation && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Reserva
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Fecha:</span>
                          <span className="font-medium">{analysis.reservation.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Hora:</span>
                          <span className="font-medium">{analysis.reservation.time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Personas:</span>
                          <span className="font-medium">{analysis.reservation.people}</span>
                        </div>
                        {analysis.reservation.tableType && (
                          <div className="flex justify-between">
                            <span>Tipo de mesa:</span>
                            <span className="font-medium">{analysis.reservation.tableType}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Información del cliente */}
                {(analysis.customerName || analysis.customerPhone || analysis.customerAddress) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Información del Cliente
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {analysis.customerName && (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{analysis.customerName}</span>
                          </div>
                        )}
                        {analysis.customerPhone && (
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">📞</span>
                            <span>{analysis.customerPhone}</span>
                          </div>
                        )}
                        {analysis.customerAddress && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{analysis.customerAddress}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Detalles adicionales */}
                <Card>
                  <CardHeader>
                    <CardTitle>Detalles Adicionales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analysis ? (
                      <div className="space-y-2 text-sm">
                        {orderType && (
                          <div>
                            <span className="font-semibold">Tipo de pedido:</span>{' '}
                            {orderType}
                          </div>
                        )}
                        {analysis.customerName && (
                          <div>
                            <span className="font-semibold">Nombre:</span>{' '}
                            {analysis.customerName}
                          </div>
                        )}
                        {analysis.createdAt && (
                          <div>
                            <span className="font-semibold">Hora del análisis:</span>{' '}
                            {formatDate(analysis.createdAt)}
                          </div>
                        )}
                        {/* Mostrar detalles de la reserva si existen */}
                        {analysis.reservation && (
                          <div className="space-y-1">
                            <div>
                              <span className="font-semibold">Reserva para:</span>{' '}
                              {analysis.reservation.people} personas
                            </div>
                            <div>
                              <span className="font-semibold">Fecha:</span>{' '}
                              {analysis.reservation.date}
                            </div>
                            <div>
                              <span className="font-semibold">Hora:</span>{' '}
                              {analysis.reservation.time}
                            </div>
                            <div>
                              <span className="font-semibold">Nombre reserva:</span>{' '}
                              {analysis.reservation.name}
                            </div>
                            {analysis.reservation.contact && analysis.reservation.contact !== 'not provided' && (
                              <div>
                                <span className="font-semibold">Contacto:</span>{' '}
                                {analysis.reservation.contact}
                              </div>
                            )}
                            {analysis.reservation.notes && analysis.reservation.notes !== 'not provided' && (
                              <div>
                                <span className="font-semibold">Notas:</span>{' '}
                                {analysis.reservation.notes}
                              </div>
                            )}
                          </div>
                        )}
                        {/* Si no hay datos útiles */}
                        {(!orderType && !analysis.customerName && !analysis.createdAt && !analysis.reservation) && (
                          <div className="text-muted-foreground">No hay detalles adicionales disponibles.</div>
                        )}
                      </div>
                    ) : (
                      <div className="text-muted-foreground">No hay detalles adicionales disponibles.</div>
                    )}
                  </CardContent>
                </Card>

                {/* Solicitudes especiales */}
                {analysis.specialRequests && analysis.specialRequests.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Solicitudes Especiales</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1">
                        {analysis.specialRequests.map((request, index) => (
                          <div key={index} className="text-sm p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                            {request}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 