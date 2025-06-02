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
import { useToast } from '@/components/ui/use-toast'

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
  messages: any[];
}

export default function RecordingsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchConversations() {
      if (!session?.user?.id) return;

      try {
        const response = await fetch(`/api/conversations?userId=${session.user.id}`);
        const data = await response.json();

        if (data.success) {
          setConversations(data.conversations);
        } else {
          toast({
            title: 'Error',
            description: 'No se pudieron cargar las conversaciones',
            variant: 'destructive'
          });
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
        toast({
          title: 'Error',
          description: 'Error al cargar las conversaciones',
          variant: 'destructive'
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
                            <DropdownMenuItem>View Analysis</DropdownMenuItem>
                            <DropdownMenuItem>Download Recording</DropdownMenuItem>
                            <DropdownMenuItem>Share</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
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
      </div>
    </div>
  )
}
