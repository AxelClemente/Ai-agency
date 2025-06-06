'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "../components/dashboard-header"
import { Download, Search, SlidersHorizontal, UserPlus, MoreHorizontal, Settings, BookOpen, Play } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { EditAgentModal } from './components/edit-agent-modal'
import { KnowledgeBaseModal } from './components/knowledge-base-modal'
import { CreateAgentModal } from './components/create-agent-modal'

interface AgentWithStats {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  status: 'active' | 'inactive';
  calls: number;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<AgentWithStats | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isKnowledgeBaseModalOpen, setIsKnowledgeBaseModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [agentConfig, setAgentConfig] = useState<any>(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);
  const [knowledgeBaseDocuments, setKnowledgeBaseDocuments] = useState<any[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  console.log('🏠 AgentsPage - Current state:', {
    agentsCount: agents.length,
    isLoading,
    selectedAgent: selectedAgent?.id,
    isEditModalOpen,
    isKnowledgeBaseModalOpen,
    isCreateModalOpen,
    hasConfig: !!agentConfig
  });

  const fetchAgentStats = async () => {
    if (!session?.user?.id) return;

    console.log('📡 Fetching agent stats for user:', session.user.id);

    try {
      const response = await fetch(`/api/agent/stats?userId=${session.user.id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📡 Agent stats response:', data);

      if (data.success) {
        setAgents(data.agents);
        console.log('✅ Agents loaded:', data.agents.length);
      } else {
        console.error('❌ Failed to load agents:', data.error);
        toast({
          title: 'Error',
          description: data.error || 'No se pudieron cargar los agentes',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('💥 Error fetching agent stats:', error);
      toast({
        title: 'Error',
        description: 'Error al cargar las estadísticas de agentes',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgentStats();
  }, [session?.user?.id, toast]);

  const handleEditAgent = async (agent: AgentWithStats) => {
    console.log('✏️ Edit agent clicked:', agent);
    setSelectedAgent(agent);
    setIsLoadingConfig(true);
    
    try {
      console.log('📡 Fetching agent config for:', agent.id);
      const response = await fetch(`/api/agents/${agent.id}`);
      const data = await response.json();

      console.log('📡 Agent config response:', data);

      if (data.success && data.agent) {
        setAgentConfig(data.agent);
        setIsEditModalOpen(true);
        console.log('✅ Config loaded, opening modal');
      } else {
        console.error('❌ Failed to load agent config:', data.error);
        toast({
          title: 'Error',
          description: data.error || 'No se pudo cargar la configuración del agente',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('💥 Error fetching agent config:', error);
      toast({
        title: 'Error',
        description: 'Error al cargar la configuración del agente',
        variant: 'destructive'
      });
    } finally {
      setIsLoadingConfig(false);
    }
  };

  const handleManageKnowledgeBase = async (agent: AgentWithStats) => {
    console.log('📚 Manage Knowledge Base clicked:', agent);
    setSelectedAgent(agent);
    setIsLoadingDocuments(true);
    
    try {
      console.log('📡 Fetching knowledge base documents...');
      const response = await fetch('/api/knowledge-base/list');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📡 Knowledge base documents response:', data);

      if (data.success) {
        const documentsArray = Array.isArray(data.documents) ? data.documents : [];
        setKnowledgeBaseDocuments(documentsArray);
        setIsKnowledgeBaseModalOpen(true);
        console.log('✅ Documents loaded, opening modal');
      } else {
        console.error('❌ Failed to load documents:', data.error);
        toast({
          title: 'Error',
          description: data.error || 'No se pudieron cargar los documentos',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('💥 Error fetching documents:', error);
      toast({
        title: 'Error',
        description: 'Error al cargar los documentos',
        variant: 'destructive'
      });
    } finally {
      setIsLoadingDocuments(false);
    }
  };

  const handleCloseEditModal = () => {
    console.log('🚪 Closing edit modal');
    setIsEditModalOpen(false);
    setSelectedAgent(null);
    setAgentConfig(null);
  };

  const handleCloseKnowledgeBaseModal = () => {
    console.log('🚪 Closing knowledge base modal from parent');
    setIsKnowledgeBaseModalOpen(false);
    setSelectedAgent(null);
    setKnowledgeBaseDocuments([]);
    console.log('✅ Knowledge base modal closed from parent');
  };

  const handleCreateSuccess = () => {
    console.log('✅ Agent created successfully, refreshing list');
    // Refresh the agents list
    fetchAgentStats();
  };

  const handleTestAgent = (agent: AgentWithStats) => {
    console.log('🧪 Test agent clicked:', agent);
    router.push(`/customer-dashboard/conversation?agentId=${agent.id}`);
  };

  const totalAgents = agents.length;
  const totalCalls = agents.reduce((sum, agent) => sum + agent.calls, 0);
  const activeAgents = agents.filter(agent => agent.status === 'active').length;
  const topPerformer = agents.reduce((top, agent) => 
    agent.calls > (top?.calls || 0) ? agent : top, agents[0]
  );

  return (
    <div className="flex flex-col">
      <DashboardHeader />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Agents</h2>
          <div className="flex items-center space-x-2">
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Agent
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search agents..."
                className="w-[200px] lg:w-[300px] pl-8"
              />
            </div>
            <Button variant="outline" size="sm" className="h-9">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAgents}</div>
              <p className="text-xs text-muted-foreground">
                {activeAgents} active agents
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCalls}</div>
              <p className="text-xs text-muted-foreground">
                Across all agents
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{topPerformer?.name || 'N/A'}</div>
              <p className="text-xs text-muted-foreground">
                {topPerformer?.calls || 0} calls
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeAgents}</div>
              <p className="text-xs text-muted-foreground">
                Ready to serve
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Agent List</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p>Cargando agentes...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell className="font-medium">Name</TableCell>
                    <TableCell className="font-medium">Description</TableCell>
                    <TableCell className="font-medium">Category</TableCell>
                    <TableCell className="font-medium">Calls</TableCell>
                    <TableCell className="font-medium">Status</TableCell>
                    <TableCell className="text-right font-medium">Actions</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No hay agentes disponibles
                      </TableCell>
                    </TableRow>
                  ) : (
                    agents.map((agent) => (
                      <TableRow key={agent.id}>
                        <TableCell className="font-medium">{agent.name}</TableCell>
                        <TableCell>{agent.description}</TableCell>
                        <TableCell>{agent.category}</TableCell>
                        <TableCell>{agent.calls}</TableCell>
                        <TableCell>
                          <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                            {agent.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleEditAgent(agent)}
                                className="cursor-pointer"
                                disabled={isLoadingConfig}
                              >
                                <Settings className="mr-2 h-4 w-4" />
                                {isLoadingConfig ? 'Cargando...' : 'Edit'}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleManageKnowledgeBase(agent)}
                                className="cursor-pointer"
                                disabled={isLoadingDocuments}
                              >
                                <BookOpen className="mr-2 h-4 w-4" />
                                {isLoadingDocuments ? 'Cargando...' : 'Manage Knowledge Base'}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleTestAgent(agent)}
                                className="cursor-pointer"
                              >
                                <Play className="mr-2 h-4 w-4" />
                                Test
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Modal de Edición de Agente */}
        {selectedAgent && agentConfig && (
          <EditAgentModal
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
            agentId={selectedAgent.id}
            agentName={selectedAgent.name}
            agentConfig={agentConfig}
          />
        )}

        {/* Modal de Knowledge Base */}
        {selectedAgent && (
          <KnowledgeBaseModal
            isOpen={isKnowledgeBaseModalOpen}
            onClose={handleCloseKnowledgeBaseModal}
            agentId={selectedAgent.id}
            agentName={selectedAgent.name}
            documents={knowledgeBaseDocuments}
            onDocumentsUpdate={setKnowledgeBaseDocuments}
          />
        )}

        {/* Modal de Crear Agente */}
        <CreateAgentModal
          isOpen={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          onSuccess={handleCreateSuccess}
        />
      </div>
    </div>
  )
}
