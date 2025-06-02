import { RestaurantAnalysis } from '../types/analysis-types';
import { ShoppingCart, Package, CheckCircle } from 'lucide-react';

export function analyzeRestaurantOrder(transcript: string): RestaurantAnalysis {
  const lowerTranscript = transcript.toLowerCase();
  
  // Detectar productos mencionados
  const products = [];
  if (lowerTranscript.includes('pizza')) {
    if (lowerTranscript.includes('bryan')) products.push('Pizza Bryan');
    else products.push('Pizza');
  }
  if (lowerTranscript.includes('postre')) products.push('Postre');
  if (lowerTranscript.includes('tarta')) products.push('Tarta de queso');
  
  // Detectar modificaciones
  const modifications = [];
  if (lowerTranscript.includes('sin cebolla')) modifications.push('Sin cebolla');
  if (lowerTranscript.includes('sin queso')) modifications.push('Sin queso');
  if (lowerTranscript.includes('extra')) modifications.push('Ingredientes extra');
  
  // Detectar si se completó el pedido
  const completed = lowerTranscript.includes('perfecto') || 
                   lowerTranscript.includes('gracias') || 
                   lowerTranscript.includes('eso es todo');
  
  return {
    products: products.length > 0 ? products : ['No especificado'],
    modifications: modifications.length > 0 ? modifications : ['Ninguna'],
    completed,
    summary: `Cliente ${completed ? 'completó' : 'no completó'} su pedido`
  };
}

export function RestaurantAnalysisComponent({ insights }: { insights: RestaurantAnalysis }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-3">
        <ShoppingCart className="h-5 w-5 text-orange-600 mt-0.5" />
        <div>
          <span className="text-sm font-medium text-gray-900">Productos solicitados:</span>
          <p className="text-sm text-gray-700 mt-1">{insights.products.join(', ')}</p>
        </div>
      </div>
      <div className="flex items-start space-x-3">
        <Package className="h-5 w-5 text-blue-600 mt-0.5" />
        <div>
          <span className="text-sm font-medium text-gray-900">Modificaciones:</span>
          <p className="text-sm text-gray-700 mt-1">{insights.modifications.join(', ')}</p>
        </div>
      </div>
      <div className="flex items-start space-x-3">
        <CheckCircle className={`h-5 w-5 mt-0.5 ${insights.completed ? 'text-green-600' : 'text-gray-400'}`} />
        <div>
          <span className="text-sm font-medium text-gray-900">Estado del pedido:</span>
          <p className={`text-sm font-medium mt-1 ${insights.completed ? 'text-green-600' : 'text-orange-600'}`}>
            {insights.completed ? '✅ Pedido Completado' : '⏳ Pedido Incompleto'}
          </p>
        </div>
      </div>
    </div>
  );
} 