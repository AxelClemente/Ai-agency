"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CreateAgentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateAgentModal({ isOpen, onOpenChange, onSuccess }: CreateAgentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    firstMessage: "",
    systemPrompt: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.firstMessage.trim() || !formData.systemPrompt.trim()) {
      toast.error("All fields are required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/agents/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          firstMessage: formData.firstMessage,
          systemPrompt: formData.systemPrompt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create agent");
      }

      toast.success("Agent created successfully!");
      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        name: "",
        firstMessage: "",
        systemPrompt: "",
      });
    } catch (error) {
      console.error("Error creating agent:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create agent");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
      // Reset form when closing
      setFormData({
        name: "",
        firstMessage: "",
        systemPrompt: "",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Agent</DialogTitle>
          <DialogDescription>
            Create a new conversational AI agent with custom prompts and settings.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Agent Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter agent name"
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstMessage">
              First Message
              <span className="text-sm text-muted-foreground ml-2">
                ({formData.firstMessage.length}/1000)
              </span>
            </Label>
            <Textarea
              id="firstMessage"
              value={formData.firstMessage}
              onChange={(e) => {
                if (e.target.value.length <= 1000) {
                  setFormData(prev => ({ ...prev, firstMessage: e.target.value }));
                }
              }}
              placeholder="Enter the first message your agent will send to users"
              rows={4}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="systemPrompt">
              System Prompt
              <span className="text-sm text-muted-foreground ml-2">
                ({formData.systemPrompt.length}/4000)
              </span>
            </Label>
            <Textarea
              id="systemPrompt"
              value={formData.systemPrompt}
              onChange={(e) => {
                if (e.target.value.length <= 4000) {
                  setFormData(prev => ({ ...prev, systemPrompt: e.target.value }));
                }
              }}
              placeholder="Enter the system prompt that defines your agent's behavior and personality"
              rows={8}
              disabled={isLoading}
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Agent"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 