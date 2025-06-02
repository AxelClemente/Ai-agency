export interface BaseAnalysis {
  summary: string;
  completed: boolean;
}

export interface RestaurantAnalysis extends BaseAnalysis {
  products: string[];
  modifications: string[];
}

export interface SupportAnalysis extends BaseAnalysis {
  issueType: string;
  status: 'Resuelto' | 'En proceso';
  priority: 'Alta' | 'Normal';
}

export interface MedicalAnalysis extends BaseAnalysis {
  appointmentBooked: boolean;
  specialty: string;
  urgency: 'Urgente' | 'Normal';
}

export interface RealEstateAnalysis extends BaseAnalysis {
  propertyType: string;
  transactionType: string;
  interested: boolean;
}

export interface BusinessInsight {
  type: string;
  icon: string;
  title: string;
  insights: BaseAnalysis;
} 