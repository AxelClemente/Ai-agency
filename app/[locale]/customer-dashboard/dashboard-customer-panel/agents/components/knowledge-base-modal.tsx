'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, FileText, Trash2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface KnowledgeBaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentId: string;
  agentName: string;
  documents: KnowledgeBaseDocument[];
  onDocumentsUpdate: (documents: KnowledgeBaseDocument[]) => void;
}

export interface KnowledgeBaseDocument {
  id: string;
  name: string;
  prompt_injectable: boolean;
  created_at?: string;
  file_size?: number;
  file_type?: string;
  dependent_agents?: { id: string }[];
}

export function KnowledgeBaseModal({ isOpen, onClose, agentId, agentName, documents, onDocumentsUpdate }: KnowledgeBaseModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState('');
  const [showUrlForm, setShowUrlForm] = useState(false);
  const [showTextForm, setShowTextForm] = useState(false);
  const [urlData, setUrlData] = useState({ url: '', name: '' });
  const [textData, setTextData] = useState({ text: '', name: '' });
  const [isAdding, setIsAdding] = useState(false);

  console.log('📚 KnowledgeBaseModal - Render:', { isOpen, agentId, agentName, documentsCount: documents.length });

  // Filtrar documentos por agente
  const filteredDocuments = documents.filter(doc =>
    Array.isArray(doc.dependent_agents) &&
    doc.dependent_agents.some(agent => agent.id === agentId)
  );

  const handleFileUpload = async (file: File) => {
    console.log('📤 Uploading file:', file.name);
    setIsUploading(true);
    setFileName(file.name);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', file.name);

      const response = await fetch('/api/knowledge-base/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('📤 Upload response:', data);

      if (data.success) {
        toast("Documento subido", {
          description: `${file.name} se ha subido correctamente al Knowledge Base`
        });
        await loadDocuments();
      } else {
        console.error('❌ Failed to upload:', data.error);
        toast("Error al subir documento", {
          description: data.error || "No se pudo subir el documento"
        });
      }
    } catch (error) {
      console.error('💥 Error uploading file:', error);
      toast("Error al subir documento", {
        description: "Ocurrió un error al subir el documento"
      });
    } finally {
      setIsUploading(false);
      setFileName('');
    }
  };

  const loadDocuments = async () => {
    console.log('📋 Refreshing documents...');

    try {
      const response = await fetch('/api/knowledge-base/list');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📋 Documents response:', data);

      if (data.success) {
        const documentsArray = Array.isArray(data.documents) ? data.documents : [];
        onDocumentsUpdate(documentsArray);
        console.log('✅ Documents refreshed:', documentsArray.length);
      } else {
        console.error('❌ Failed to load documents:', data.error);
        toast("Error al cargar documentos", {
          description: data.error || "No se pudieron cargar los documentos"
        });
      }
    } catch (error) {
      console.error('💥 Error loading documents:', error);
      toast("Error al cargar documentos", {
        description: "Ocurrió un error al cargar los documentos"
      });
    }
  };

  const handleDeleteDocument = async (documentId: string, documentName: string) => {
    console.log('🗑️ Deleting document:', documentId);

    try {
      const response = await fetch(`/api/knowledge-base/${documentId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      console.log('🗑️ Delete response:', data);

      if (data.success) {
        toast("Documento eliminado", {
          description: `${documentName} se ha eliminado correctamente`
        });
        await loadDocuments();
      } else {
        console.error('❌ Failed to delete:', data.error);
        toast("Error al eliminar documento", {
          description: data.error || "No se pudo eliminar el documento"
        });
      }
    } catch (error) {
      console.error('💥 Error deleting document:', error);
      toast("Error al eliminar documento", {
        description: "Ocurrió un error al eliminar el documento"
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = () => {
    return <FileText className="h-4 w-4" />;
  };

  const handleClose = () => {
    console.log('📚 KnowledgeBaseModal - Closing...');
    // Reset states
    onDocumentsUpdate([]);
    setIsUploading(false);
    setDragOver(false);
    setFileName('');
    setShowUrlForm(false);
    setShowTextForm(false);
    setUrlData({ url: '', name: '' });
    setTextData({ text: '', name: '' });
    setIsAdding(false);
    // Call parent close
    onClose();
  };

  const handleAddUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const response = await fetch('/api/knowledge-base/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlData.url, name: urlData.name }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Error adding URL');
      toast('Documento creado desde URL');
      setShowUrlForm(false);
      setUrlData({ url: '', name: '' });
      await loadDocuments();
    } catch (error) {
      toast('Error al crear documento desde URL', { description: error instanceof Error ? error.message : String(error) });
    } finally {
      setIsAdding(false);
    }
  };

  const handleAddText = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const response = await fetch('/api/knowledge-base/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textData.text, name: textData.name }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Error adding text');
      toast('Documento creado desde texto');
      setShowTextForm(false);
      setTextData({ text: '', name: '' });
      await loadDocuments();
    } catch (error) {
      toast('Error al crear documento desde texto', { description: error instanceof Error ? error.message : String(error) });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-hidden max-w-full max-h-full h-full min-h-screen p-0 sm:p-6">
        <div className="h-full flex flex-col overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="mb-4">Manage Knowledge Base</DialogTitle>
            <DialogDescription>
              Gestiona los documentos del Knowledge Base para <strong>{agentName}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="mb-8" />

          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Upload Documents</TabsTrigger>
              <TabsTrigger value="manage" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Manage Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Upload New Document
                  </CardTitle>
                  <CardDescription>
                    Sube documentos (PDF, TXT, DOCX) para que el agente tenga acceso a esta información
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      dragOver
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    {isUploading ? (
                      <div className="space-y-2">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                        <p className="text-sm text-muted-foreground">
                          Subiendo {fileName}...
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="h-8 w-8 mx-auto text-gray-400" />
                        <p className="text-sm font-medium">
                          Arrastra y suelta un archivo aquí, o haz click para seleccionar
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Formatos soportados: PDF, TXT, DOCX (máx. 10MB)
                        </p>
                      </div>
                    )}
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.txt,.docx,.doc"
                    onChange={handleFileSelect}
                    disabled={isUploading}
                  />
                </CardContent>
              </Card>
              <div className="flex gap-2 mb-2">
                <Button variant="outline" size="sm" onClick={() => setShowUrlForm(v => !v)}>
                  Add URL
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowTextForm(v => !v)}>
                  Create Text
                </Button>
              </div>
              {showUrlForm && (
                <form onSubmit={handleAddUrl} className="bg-gray-50 p-4 rounded-lg mb-2 flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="Document Name (optional)"
                    className="border rounded px-2 py-1"
                    value={urlData.name}
                    onChange={e => setUrlData(d => ({ ...d, name: e.target.value }))}
                    disabled={isAdding}
                  />
                  <input
                    type="url"
                    placeholder="Paste URL here"
                    className="border rounded px-2 py-1"
                    value={urlData.url}
                    onChange={e => setUrlData(d => ({ ...d, url: e.target.value }))}
                    required
                    disabled={isAdding}
                  />
                  <div className="flex gap-2">
                    <Button type="submit" size="sm" disabled={isAdding}>Add</Button>
                    <Button type="button" size="sm" variant="ghost" onClick={() => setShowUrlForm(false)} disabled={isAdding}>Cancel</Button>
                  </div>
                </form>
              )}
              {showTextForm && (
                <form onSubmit={handleAddText} className="bg-gray-50 p-4 rounded-lg mb-2 flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="Document Name (optional)"
                    className="border rounded px-2 py-1"
                    value={textData.name}
                    onChange={e => setTextData(d => ({ ...d, name: e.target.value }))}
                    disabled={isAdding}
                  />
                  <textarea
                    placeholder="Paste or write text here"
                    className="border rounded px-2 py-1 min-h-[80px]"
                    value={textData.text}
                    onChange={e => setTextData(d => ({ ...d, text: e.target.value }))}
                    required
                    disabled={isAdding}
                  />
                  <div className="flex gap-2">
                    <Button type="submit" size="sm" disabled={isAdding}>Add</Button>
                    <Button type="button" size="sm" variant="ghost" onClick={() => setShowTextForm(false)} disabled={isAdding}>Cancel</Button>
                  </div>
                </form>
              )}
            </TabsContent>

            <TabsContent value="manage" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documents in Knowledge Base
                  </CardTitle>
                  <CardDescription>
                    Gestiona los documentos disponibles en tu Knowledge Base
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredDocuments.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-sm text-muted-foreground">
                        No hay documentos en el Knowledge Base
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {filteredDocuments.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            {getFileIcon()}
                            <div>
                              <p className="font-medium text-sm">{doc.name}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>ID: {doc.id.slice(-8)}</span>
                                {doc.file_size && (
                                  <span>• {formatFileSize(doc.file_size)}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={doc.prompt_injectable ? "default" : "secondary"}>
                              {doc.prompt_injectable ? "Active" : "Inactive"}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteDocument(doc.id, doc.name)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
} 