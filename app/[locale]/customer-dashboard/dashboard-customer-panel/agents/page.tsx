'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "../components/dashboard-header"
import { Download, Search, SlidersHorizontal, UserPlus, MoreHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useToast } from '@/components/ui/use-toast'

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
  const { data: session } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchAgentStats() {
      if (!session?.user?.id) return;

      try {
        const response = await fetch(`/api/agent/stats?userId=${session.user.id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();

        if (data.success) {
          setAgents(data.agents);
        } else {
          toast({
            title: 'Error',
            description: data.error || 'No se pudieron cargar los agentes',
            variant: 'destructive'
          });
        }
      } catch (error) {
        console.error('Error fetching agent stats:', error);
        toast({
          title: 'Error',
          description: 'Error al cargar las estadísticas de agentes',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchAgentStats();
  }, [session?.user?.id, toast]);

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
            <Button>
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
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
