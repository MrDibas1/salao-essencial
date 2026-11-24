export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  avatarUrl?: string;
  createdAt?: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  birthDate?: string;
  email?: string;
  instagram?: string;
  notes?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'archived';
  isDemo?: boolean;
}

export type ProcedureType =
  | 'Coloração'
  | 'Retoque de raiz'
  | 'Luzes'
  | 'Mechas'
  | 'Descoloração'
  | 'Tonalização'
  | 'Hidratação'
  | 'Reconstrução'
  | 'Corte'
  | 'Escova'
  | 'Progressiva'
  | 'Outro';

export type ApplicationRegion =
  | 'Raiz'
  | 'Comprimento'
  | 'Pontas'
  | 'Cabelo completo'
  | 'Raiz e comprimento'
  | 'Outra região';

export interface ColorProductItem {
  id: string;
  brand: string;            // ex: Wella, L'Oréal, Igora, AlfaParf, ou livre
  line?: string;            // ex: Koleston Perfect, Majirel, Royal
  shadeNumber: string;      // ex: 7.1, 8.0, 5.35
  shadeName?: string;       // ex: Louro Médio Cinza
  quantity: string;         // ex: 30g, 45g, 1/2 tubo
  unit: string;             // g, ml, tubo, medida
  region: ApplicationRegion | string; // Raiz, Comprimento, Pontas, Cabelo completo, Outra região
}

export interface OxidantInfo {
  used: boolean;
  brand?: string;           // Marca do oxidante
  volume?: string;          // ex: 10 vol, 20 vol, 30 vol, 40 vol
  quantityOrRatio?: string; // ex: 1:1, 1:1.5, 60ml
}

export interface ColorFormula {
  products: ColorProductItem[]; // Suporte a múltiplas tintas (+ ADICIONAR OUTRA TINTA)
  oxidant: OxidantInfo;
  pauseTime?: string;           // ex: 35 min, 45 min
  applicationRegionSummary?: string;
  technicalNotes?: string;      // Observações técnicas da mistura
}

export interface TechnicalAssessment {
  initialCondition?: string;    // Condição inicial do cabelo
  relevantHistory?: string;     // Histórico técnico relevante
  finalResult?: string;         // Resultado final
  professionalNotes?: string;   // Observações do profissional
  nextRecommendations?: string; // Recomendações para o próximo atendimento
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;           // Para exibição e busca rápida
  date: string;                 // YYYY-MM-DD
  professional: string;         // Profissional responsável
  procedureType: ProcedureType | string;
  customProcedureName?: string; // Se procedureType === 'Outro'
  description?: string;         // Descrição do serviço
  generalNotes?: string;        // Observações gerais
  hasColorInfo: boolean;        // Se inclui dados técnicos de coloração
  colorFormula?: ColorFormula;
  assessment?: TechnicalAssessment;
  beforePhotoUrl?: string;         // Foto de Antes (cabelo inicial)
  afterPhotoUrl?: string;          // Foto de Depois (resultado final)
  photoUrls?: string[];            // Fotos adicionais ou compatibilidade
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
}

export type ProductCategory =
  | 'Tintas'
  | 'Oxidantes'
  | 'Descolorantes'
  | 'Tonalizantes'
  | 'Tratamentos'
  | 'Hidratação'
  | 'Reconstrução'
  | 'Outros';

export interface Product {
  id: string;
  name: string;               // Nome da Tinta / Marca (ex: Truss, Fest color, Igora 10, Igora, Gloss, Color touch, Outros)
  brand?: string;             // Opcional
  line?: string;              // Opcional
  category?: ProductCategory; // Opcional
  shadeNumber?: string;       // Opcional
  unit?: string;              // Opcional
  notes?: string;             // Observações da marca/tinta
  imageUrl?: string;          // Foto da marca/produto
  createdAt: string;
  isDemo?: boolean;
}

export interface SalonSettings {
  name: string;
  tagline: string;
  phone: string;
  address?: string;
  instagram?: string;
  logoUrl?: string;
  useTypographicLogo: boolean;
}
