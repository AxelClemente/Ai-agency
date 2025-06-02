import { SupportAnalysis } from '../types/analysis-types';
import { Headphones, AlertCircle, CheckCircle } from 'lucide-react';

export function analyzeSupportTicket(transcript: string): SupportAnalysis {
  const lowerTranscript = transcript.toLowerCase();
  
  const issueType = lowerTranscript.includes('problema') ? 'Problema técnico' :
                   lowerTranscript.includes('ayuda') ? 'Solicitud de ayuda' :
                   lowerTranscript.includes('información') ? 'Consulta informativa' : 'General';
  
  const resolved = lowerTranscript.includes('solucionado') || 
                  lowerTranscript.includes('gracias') ||
                  lowerTranscript.includes('perfecto');
  
  return {
    issueType,
    status: resolved ? 'Resuelto' : 'En proceso',
    priority: lowerTranscript.includes('urgente') ? 'Alta' : 'Normal',
    completed: resolved,
    summary: `Ticket de ${issueType.toLowerCase()} ${resolved ? 'resuelto' : 'pendiente'}`
  };
}

export function SupportAnalysisComponent({ insights }: { insights: SupportAnalysis }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-3">
        <Headphones className="h-5 w-5 text-blue-600 mt-0.5" />
        <div>
          <span className="text-sm font-medium text-gray-900">Tipo de consulta:</span>
          <p className="text-sm text-gray-700 mt-1">{insights.issueType}</p>
        </div>
      </div>
      <div className="flex items-start space-x-3">
        <AlertCircle className={`h-5 w-5 mt-0.5 ${insights.priority === 'Alta' ? 'text-red-600' : 'text-yellow-600'}`} />
        <div>
          <span className="text-sm font-medium text-gray-900">Prioridad:</span>
          <p className={`text-sm font-medium mt-1 ${insights.priority === 'Alta' ? 'text-red-600' : 'text-yellow-600'}`}>
            {insights.priority === 'Alta' ? '🔴 Alta' : '🟡 Normal'}
          </p>
        </div>
      </div>
      <div className="flex items-start space-x-3">
        <CheckCircle className={`h-5 w-5 mt-0.5 ${insights.status === 'Resuelto' ? 'text-green-600' : 'text-gray-400'}`} />
        <div>
          <span className="text-sm font-medium text-gray-900">Estado:</span>
          <p className={`text-sm font-medium mt-1 ${insights.status === 'Resuelto' ? 'text-green-600' : 'text-orange-600'}`}>
            {insights.status === 'Resuelto' ? '✅ Resuelto' : '⏳ En Proceso'}
          </p>
        </div>
      </div>
    </div>
  );
} 