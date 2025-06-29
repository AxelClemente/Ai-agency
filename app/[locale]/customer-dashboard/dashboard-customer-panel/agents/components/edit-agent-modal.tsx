'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AgentConfigRaw {
  conversation_config?: {
    agent?: {
      first_message?: string;
      prompt?: {
        prompt?: string;
      };
    };
  };
}

interface EditAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentId: string;
  agentName: string;
  agentConfig: AgentConfigRaw; // Datos ya cargados externamente
}

interface AgentConfig {
  first_message: string;
  system_prompt: string;
}

export function EditAgentModal({ isOpen, onClose, agentId, agentName, agentConfig }: EditAgentModalProps) {
  // Extraer configuración de los datos ya cargados
  const conversationConfig = agentConfig?.conversation_config;
  const initialConfig = {
    first_message: conversationConfig?.agent?.first_message || '',
    system_prompt: conversationConfig?.agent?.prompt?.prompt || ''
  };

  const [config, setConfig] = useState<AgentConfig>(initialConfig);

  console.log('🔧 EditAgentModal - Received config:', {
    agentId,
    agentName,
    hasConfig: !!agentConfig,
    firstMessageLength: initialConfig.first_message.length,
    systemPromptLength: initialConfig.system_prompt.length
  });

  const handleClose = () => {
    console.log('🚪 Closing modal');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden max-w-full max-h-full h-full min-h-screen p-0 sm:p-6">
        <div className="h-full flex flex-col overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="mb-4">Editar Agente</DialogTitle>
            <DialogDescription>
              Modifica el mensaje inicial y el prompt del sistema para <strong>{agentName}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="first-message">
                Mensaje Inicial
                <span className="text-xs text-muted-foreground ml-2">
                  ({config.first_message.length}/1000)
                </span>
              </Label>
              <Textarea
                id="first-message"
                placeholder="Escribe el mensaje inicial que enviará el agente..."
                value={config.first_message}
                onChange={(e) => setConfig(prev => ({ ...prev, first_message: e.target.value }))}
                className="min-h-[100px]"
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground">
                El primer mensaje que el agente enviará cuando inicie una conversación.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="system-prompt">
                System Prompt
                <span className="text-xs text-muted-foreground ml-2">
                  ({config.system_prompt.length}/5000)
                </span>
              </Label>
              <Textarea
                id="system-prompt"
                placeholder="Define el comportamiento, personalidad y reglas del agente..."
                value={config.system_prompt}
                onChange={(e) => setConfig(prev => ({ ...prev, system_prompt: e.target.value }))}
                className="min-h-[200px]"
                maxLength={5000}
              />
              <p className="text-xs text-muted-foreground">
                Instrucciones que definen cómo debe comportarse el agente durante las conversaciones.
              </p>
            </div>
          </div>

          <DialogFooter>
            <div className="w-full space-y-2">
              <Button className="w-full" type="submit">
                Guardar Cambios
              </Button>
              <Button className="w-full" variant="outline" onClick={handleClose} type="button">
                Cancelar
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
} 