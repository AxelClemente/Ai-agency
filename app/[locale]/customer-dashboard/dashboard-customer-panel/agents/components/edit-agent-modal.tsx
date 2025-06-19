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
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSave = async () => {
    console.log('💾 Saving agent config:', {
      agentId,
      firstMessageLength: config.first_message.length,
      systemPromptLength: config.system_prompt.length
    });

    if (!config.first_message.trim() || !config.system_prompt.trim()) {
      toast("Campos requeridos", {
        description: "Por favor complete todos los campos"
      });
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/agents/${agentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstMessage: config.first_message,
          systemPrompt: config.system_prompt
        })
      });

      const data = await response.json();
      console.log('📡 Save response:', data);

      if (data.success) {
        toast("Agente actualizado", {
          description: "La configuración del agente se ha actualizado correctamente"
        });
        onClose();
      } else {
        console.error('❌ Failed to save:', data.error);
        toast("Error al guardar", {
          description: data.error || "No se pudo actualizar la configuración del agente"
        });
      }
    } catch (error) {
      console.error('💥 Error saving agent config:', error);
      toast("Error al guardar", {
        description: "Ocurrió un error al guardar la configuración"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    console.log('🚪 Closing modal');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Agente</DialogTitle>
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
          <Button 
            variant="outline" 
            onClick={handleClose} 
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || !config.first_message.trim() || !config.system_prompt.trim()}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Guardando...
              </>
            ) : (
              'Guardar Cambios'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 