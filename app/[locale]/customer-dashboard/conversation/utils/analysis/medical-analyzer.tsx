import { MedicalAnalysis } from '../types/analysis-types';
import { Calendar, Stethoscope, AlertTriangle } from 'lucide-react';

export function analyzeMedicalAppointment(transcript: string): MedicalAnalysis {
  const lowerTranscript = transcript.toLowerCase();
  
  const appointmentBooked = lowerTranscript.includes('cita') && 
                           (lowerTranscript.includes('confirmar') || lowerTranscript.includes('agendar'));
  
  const specialty = lowerTranscript.includes('general') ? 'Medicina General' :
                   lowerTranscript.includes('cardio') ? 'Cardiología' :
                   lowerTranscript.includes('dermato') ? 'Dermatología' : 'General';
  
  return {
    appointmentBooked,
    specialty,
    urgency: lowerTranscript.includes('urgente') ? 'Urgente' : 'Normal',
    completed: appointmentBooked,
    summary: `${appointmentBooked ? 'Cita agendada' : 'Consulta informativa'} - ${specialty}`
  };
}

export function MedicalAnalysisComponent({ insights }: { insights: MedicalAnalysis }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-3">
        <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
        <div>
          <span className="text-sm font-medium text-gray-900">Estado de la cita:</span>
          <p className={`text-sm font-medium mt-1 ${insights.appointmentBooked ? 'text-green-600' : 'text-orange-600'}`}>
            {insights.appointmentBooked ? '✅ Cita Agendada' : '⏳ Consulta Informativa'}
          </p>
        </div>
      </div>
      <div className="flex items-start space-x-3">
        <Stethoscope className="h-5 w-5 text-purple-600 mt-0.5" />
        <div>
          <span className="text-sm font-medium text-gray-900">Especialidad:</span>
          <p className="text-sm text-gray-700 mt-1">{insights.specialty}</p>
        </div>
      </div>
      <div className="flex items-start space-x-3">
        <AlertTriangle className={`h-5 w-5 mt-0.5 ${insights.urgency === 'Urgente' ? 'text-red-600' : 'text-green-600'}`} />
        <div>
          <span className="text-sm font-medium text-gray-900">Urgencia:</span>
          <p className={`text-sm font-medium mt-1 ${insights.urgency === 'Urgente' ? 'text-red-600' : 'text-green-600'}`}>
            {insights.urgency === 'Urgente' ? '🚨 Urgente' : '✅ Normal'}
          </p>
        </div>
      </div>
    </div>
  );
} 