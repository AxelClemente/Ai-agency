'use client';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Download, FileAudio, Filter, MoreHorizontal, Play, Search, SlidersHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "../components/dashboard-header"
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { TranscriptionModal } from './modal/transcription-modal'
import { toast } from "sonner"

interface TranscriptionMessage {
  role: 'user' | 'ai';
  message: string;
  timestamp: string;
}

interface ModalConversation {
  id: string;
  agentId: string;
  duration: number;
  transcript: string;
  messages: TranscriptionMessage[];
  startedAt: string;
}

interface Conversation {
  id: string;
  agentId: string;
  duration: number;
  status: string;
  startedAt: string;
  endedAt: string;
  createdAt: string;
  cost: number;
  transcript: string;
  messages: TranscriptionMessage[];
}

export default function RecordingsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isTranscriptionModalOpen, setIsTranscriptionModalOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    async function fetchConversations() {
      if (!session?.user?.id) return;

      try {
        const response = await fetch(`/api/conversations?userId=${session.user.id}`);
        const data = await response.json();

        if (data.success) {
          setConversations(data.conversations);
        } else {
          toast("No se pudieron cargar las conversaciones", {
            description: "Hubo un error al intentar cargar las conversaciones"
          });
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
        toast("Error al cargar las conversaciones", {
          description: "Hubo un error al intentar cargar las conversaciones"
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchConversations();
  }, [session?.user?.id, toast]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getAgentName = (agentId: string) => {
    const agentMap: Record<string, string> = {
      [process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID_SUPPORT || '']: 'Soporte',
      [process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID_CLINICA || '']: 'Clínica Médica',
      [process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || '']: 'Hostelería',
      [process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID_REALSTATE || '']: 'Inmobiliario'
    };
    return agentMap[agentId] || 'Agente Desconocido';
  };

  const handleViewTranscription = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setIsTranscriptionModalOpen(true);
  };

  const handleCloseTranscription = () => {
    setIsTranscriptionModalOpen(false);
    setSelectedConversation(null);
  };

  const handleDeleteConversation = async (conversationId: string) => {
    console.log('🔥 handleDeleteConversation called with:', conversationId);
    
    if (!session?.user?.id) {
      console.log('❌ No session or user ID');
      return;
    }

    console.log('✅ Session found, showing toast confirmation');
    
    toast('¿Estás seguro de que quieres eliminar esta conversación?', {
      duration: Infinity,
      description: 'Esta acción no se puede deshacer.',
      action: {
        label: 'Eliminar',
        onClick: async () => {
          try {
            const response = await fetch(
              `/api/conversations?conversationId=${conversationId}&userId=${session.user.id}`,
              { method: 'DELETE' }
            );

            const data = await response.json();
            console.log('📡 API response:', data);

            if (data.success) {
              setConversations(prev => 
                prev.filter(conv => conv.id !== conversationId)
              );
              toast("Conversación eliminada correctamente", {
                description: "La conversación ha sido eliminada exitosamente"
              });
            } else {
              toast("Error al eliminar la conversación", {
                description: "No se pudo eliminar la conversación"
              });
            }
          } catch (error) {
            console.error('💥 Error deleting conversation:', error);
            toast("Error al eliminar la conversación", {
              description: "Ocurrió un error inesperado"
            });
          }
        }
      },
      cancel: {
        label: 'Cancelar',
        onClick: () => {
          console.log('❌ Delete cancelled');
        }
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <DashboardHeader />
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-center h-64">
            <p>Cargando conversaciones...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <DashboardHeader />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Recordings</h2>
          <div className="flex items-center space-x-2">
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search recordings..." className="w-[200px] lg:w-[300px] pl-8" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>All Recordings</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Soporte</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Clínica Médica</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Hostelería</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Inmobiliario</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  View
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>Date (Newest first)</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Date (Oldest first)</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Duration (Longest first)</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Duration (Shortest first)</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recording</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {conversations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No hay conversaciones disponibles
                  </TableCell>
                </TableRow>
              ) : (
                conversations.map((conversation) => (
                  <TableRow key={conversation.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <FileAudio className="h-4 w-4 text-primary" />
                        <span>Conversación #{conversation.id.slice(-8)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(conversation.startedAt)}</TableCell>
                    <TableCell>{formatDuration(conversation.duration)}</TableCell>
                    <TableCell>{getAgentName(conversation.agentId)}</TableCell>
                    <TableCell>
                      <Badge variant="default">
                        Completed
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button variant="ghost" size="icon">
                          <Play className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewTranscription(conversation)}>
                              Transcription
                            </DropdownMenuItem>
                            <DropdownMenuItem>Download Recording</DropdownMenuItem>
                            <DropdownMenuItem>Share</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onSelect={() => {
                                console.log('🖱️ Delete button clicked for conversation:', conversation.id);
                                handleDeleteConversation(conversation.id);
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {/* Modal de Transcripción */}
        {selectedConversation && (
          <TranscriptionModal
            isOpen={isTranscriptionModalOpen}
            onClose={handleCloseTranscription}
            conversation={selectedConversation as ModalConversation}
          />
        )}
      </div>
    </div>
  )
}
