export type TriageLevel = "red" | "orange" | "yellow" | "green" | "blue";

export type Severity = "mild" | "moderate" | "severe" | "life-threatening";

export type Gender = "male" | "female" | "other";

export interface Vitals {
  heartRate: number;
  systolicBP: number;
  diastolicBP: number;
  temperature: number;
  respiratoryRate: number;
  spo2: number;
  bloodGlucose: number;
  weightKg: number;
  heightCm: number;
  painScore: number;
}

export interface LabValues {
  hemoglobin: number;
  whiteBloodCells: number;
  platelets: number;
  sodium: number;
  potassium: number;
  creatinine: number;
  bun: number;
  glucose: number;
  alt: number;
  ast: number;
  troponin: number;
  crp: number;
  esr: number;
  inr: number;
  hemoglobinA1c: number;
}

export interface PatientInput {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  pregnant: boolean;
  symptoms: string[];
  symptomDuration: string;
  severity: Severity;
  medicalHistory: string[];
  currentMedications: string[];
  allergies: string[];
  vitals: Vitals;
  labs: LabValues;
  lifestyle: {
    smoking: boolean;
    alcohol: string;
    exercise: string;
    diet: string;
  };
  travelHistory: string;
  riskFactors: string[];
  imagingSummary: string;
  notes: string;
}

export interface DifferentialDiagnosis {
  id: string;
  disease: string;
  icd10: string;
  probability: number;
  confidence: number;
  severity: Severity;
  likelihood: "very likely" | "likely" | "possible" | "unlikely" | "ruled out";
  bodySystem: string;
  evidence: {
    factor: string;
    weight: number;
    source: string;
  }[];
  reasoning: string;
  redFlags: string[];
  prerequisitesMet: boolean;
}

export interface TriageResult {
  level: TriageLevel;
  score: number;
  disposition: "ER" | "Urgent Care" | "Clinic" | "Telemedicine" | "Self Care";
  timeFrame: "Immediately" | "1 Hour" | "24 Hours" | "3 Days" | "1 Week";
  rationale: string;
  criticalFindings: string[];
}

export interface VitalAnalysis {
  metric: string;
  value: number;
  unit: string;
  normalRange: string;
  status: "normal" | "low" | "high" | "critical-low" | "critical-high";
  severity: Severity;
  interpretation: string;
}

export interface MedicationInteraction {
  drugA: string;
  drugB: string;
  severity: "contraindicated" | "major" | "moderate" | "minor";
  mechanism: string;
  clinicalEffect: string;
  management: string;
  evidenceLevel: "A" | "B" | "C";
}

export interface AllergyAlert {
  allergen: string;
  offendingDrug: string;
  reaction: string;
  severity: Severity;
  crossReactivity: string[];
}

export interface TestRecommendation {
  test: string;
  category: "Lab" | "Imaging" | "Cardiac" | "Microbiology" | "Pathology" | "Function";
  priority: "stat" | "urgent" | "routine" | "screening";
  rationale: string;
  expectedFinding: string;
  icd10Justification: string;
  costTier: "$" | "$$" | "$$$";
}

export interface RiskScore {
  condition: string;
  score: number;
  riskLevel: "low" | "moderate" | "high" | "very high";
  model: string;
  timeframe: string;
  contributors: { factor: string; contribution: number }[];
  recommendation: string;
}

export interface AdmissionPrediction {
  disposition: "Discharge" | "Observation" | "Admission" | "ICU";
  probability: number;
  estimatedLOS: number;
  contributors: string[];
}

export interface FeatureContribution {
  feature: string;
  value: string;
  shapValue: number;
  direction: "pushes up" | "pushes down";
}

export interface ModelPrediction {
  modelName: string;
  modelType: "XGBoost" | "CatBoost" | "LightGBM" | "Random Forest" | "TabNet" | "Transformer" | "Neural Net";
  prediction: string;
  probability: number;
  auc: number;
  f1: number;
  agreement: "agree" | "disagree" | "uncertain";
}

export interface SOAPNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  icd10Codes: { code: string; description: string }[];
  cptCodes: { code: string; description: string; rvu: number }[];
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: "symptom" | "lab" | "visit" | "medication" | "vital" | "imaging" | "recovery" | "intervention";
  title: string;
  description: string;
  clinician?: string;
  outcome?: string;
}

export interface KnowledgeNode {
  id: string;
  label: string;
  type: "disease" | "symptom" | "drug" | "test" | "bodySystem" | "complication" | "treatment";
  description?: string;
}

export interface KnowledgeEdge {
  source: string;
  target: string;
  relationship: string;
  weight: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: { source: string; snippet: string }[];
  reasoning?: string;
  timestamp: string;
}

export interface ClinicalAnalysis {
  patient: PatientInput;
  differentials: DifferentialDiagnosis[];
  triage: TriageResult;
  vitalAnalysis: VitalAnalysis[];
  medicationInteractions: MedicationInteraction[];
  allergyAlerts: AllergyAlert[];
  recommendedTests: TestRecommendation[];
  riskScores: RiskScore[];
  admission: AdmissionPrediction;
  readmissionRisk: number;
  mortalityRisk: number;
  featureContributions: FeatureContribution[];
  modelComparison: ModelPrediction[];
  soapNote: SOAPNote;
  timeline: TimelineEvent[];
  uncertainty: number;
  aiReasoning: string;
  generatedAt: string;
}
