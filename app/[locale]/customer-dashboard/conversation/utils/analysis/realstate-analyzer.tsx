import { RealEstateAnalysis } from '../types/analysis-types';
import { Home, DollarSign, Eye } from 'lucide-react';

export function analyzeRealEstateInquiry(transcript: string): RealEstateAnalysis {
  const lowerTranscript = transcript.toLowerCase();
  
  const propertyType = lowerTranscript.includes('casa') ? 'Casa' :
                      lowerTranscript.includes('apartamento') ? 'Apartamento' :
                      lowerTranscript.includes('local') ? 'Local comercial' : 'No especificado';
  
  const transactionType = lowerTranscript.includes('venta') ? 'Venta' :
                         lowerTranscript.includes('alquiler') ? 'Alquiler' : 'Consulta general';
  
  const interested = lowerTranscript.includes('interesa') || 
                    lowerTranscript.includes('visita') ||
                    lowerTranscript.includes('ver');
  
  return {
    propertyType,
    transactionType,
    interested,
    completed: interested,
    summary: `Consulta sobre ${propertyType.toLowerCase()} en ${transactionType.toLowerCase()}`
  };
}

export function RealEstateAnalysisComponent({ insights }: { insights: RealEstateAnalysis }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-3">
        <Home className="h-5 w-5 text-blue-600 mt-0.5" />
        <div>
          <span className="text-sm font-medium text-gray-900">Tipo de propiedad:</span>
          <p className="text-sm text-gray-700 mt-1">{insights.propertyType}</p>
        </div>
      </div>
      <div className="flex items-start space-x-3">
        <DollarSign className="h-5 w-5 text-green-600 mt-0.5" />
        <div>
          <span className="text-sm font-medium text-gray-900">Tipo de transacción:</span>
          <p className="text-sm text-gray-700 mt-1">{insights.transactionType}</p>
        </div>
      </div>
      <div className="flex items-start space-x-3">
        <Eye className={`h-5 w-5 mt-0.5 ${insights.interested ? 'text-green-600' : 'text-gray-400'}`} />
        <div>
          <span className="text-sm font-medium text-gray-900">Nivel de interés:</span>
          <p className={`text-sm font-medium mt-1 ${insights.interested ? 'text-green-600' : 'text-orange-600'}`}>
            {insights.interested ? '✅ Interesado' : '⏳ Consulta General'}
          </p>
        </div>
      </div>
    </div>
  );
} 