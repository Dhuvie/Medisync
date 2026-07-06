import type { KnowledgeNode, KnowledgeEdge } from "./types";

export const SYMPTOMS = [
  "Chest pain", "Shortness of breath", "Palpitations", "Syncope", "Fatigue",
  "Fever", "Cough", "Sputum", "Hemoptysis", "Wheezing",
  "Headache", "Confusion", "Seizure", "Weakness", "Numbness",
  "Abdominal pain", "Nausea", "Vomiting", "Diarrhea", "Constipation",
  "Hematemesis", "Melena", "Jaundice", "Dysphagia", "Heartburn",
  "Polyuria", "Polydipsia", "Dysuria", "Hematuria", "Edema",
  "Joint pain", "Back pain", "Muscle pain", "Rash", "Pruritus",
  "Weight loss", "Night sweats", "Lymphadenopathy", "Sore throat", "Epistaxis",
  "Jaw pain", "Arm pain", "Sweating", "Dizziness", "Vertigo",
  "Photophobia", "Neck stiffness", "Urinary frequency", "Foamy urine", "Easy bruising",
] as const;

export interface DiseaseRecord {
  name: string;
  icd10: string;
  bodySystem: string;
  prevalence: string;
  mortalityRate: string;
  keySymptoms: string[];
  redFlags: string[];
  recommendedTests: string[];
  firstLineTreatment: string;
  guidelines: string;
}

export const DISEASES: DiseaseRecord[] = [
  {
    name: "Acute Coronary Syndrome",
    icd10: "I21",
    bodySystem: "Cardiovascular",
    prevalence: "~7.2M cases/yr globally",
    mortalityRate: "~10% in-hospital",
    keySymptoms: ["Chest pain", "Sweating", "Jaw pain", "Arm pain", "Shortness of breath", "Nausea"],
    redFlags: ["ST elevation on ECG", "Hemodynamic instability", "Troponin elevation", "Cardiogenic shock"],
    recommendedTests: ["12-lead ECG", "Troponin I/T", "CBC", "CMP", "Chest X-ray", "Echocardiography"],
    firstLineTreatment: "Dual antiplatelet (aspirin + ticagrelor), anticoagulation, reperfusion (PCI <90 min)",
    guidelines: "ACC/AHA 2022 Chest Pain Guidelines; ESC 2023 ACS Guidelines",
  },
  {
    name: "Community-Acquired Pneumonia",
    icd10: "J18.9",
    bodySystem: "Respiratory",
    prevalence: "~450M cases/yr globally",
    mortalityRate: "~4% outpatient, ~12% inpatient",
    keySymptoms: ["Fever", "Cough", "Sputum", "Shortness of breath", "Pleuritic chest pain", "Fatigue"],
    redFlags: ["SpO2 <92%", "CURB-65 ≥3", "Septic shock", "Respiratory failure"],
    recommendedTests: ["Chest X-ray", "CBC", "Blood cultures", "Sputum culture", "Respiratory viral panel", "ABG"],
    firstLineTreatment: "Outpatient: amoxicillin or doxycycline. Inpatient: ceftriaxone + azithromycin",
    guidelines: "ATS/IDSA 2019 CAP Guidelines",
  },
  {
    name: "Sepsis",
    icd10: "A41.9",
    bodySystem: "Multi-system",
    prevalence: "~49M cases/yr globally",
    mortalityRate: "~25-30%",
    keySymptoms: ["Fever", "Confusion", "Shortness of breath", "Tachycardia", "Hypotension", "Edema"],
    redFlags: ["qSOFA ≥2", "Lactate ≥2 mmol/L", "MAP <65", "Organ dysfunction"],
    recommendedTests: ["Lactate", "Blood cultures x2", "CBC with diff", "CMP", "CRP", "Procalcitonin", "ABG"],
    firstLineTreatment: "Within 1hr: broad-spectrum antibiotics, 30mL/kg crystalloid, vasopressors if MAP<65",
    guidelines: "Surviving Sepsis Campaign 2021 Guidelines",
  },
  {
    name: "Ischemic Stroke",
    icd10: "I63",
    bodySystem: "Neurological",
    prevalence: "~12.2M cases/yr globally",
    mortalityRate: "~17% 30-day",
    keySymptoms: ["Weakness", "Numbness", "Confusion", "Slurred speech", "Severe headache", "Vision loss"],
    redFlags: ["NIHSS ≥6", "Large vessel occlusion", "Time since onset <4.5hr", "Hemorrhage excluded"],
    recommendedTests: ["Non-contrast CT head", "CT angiography", "Glucose", "CBC", "Coagulation panel", "NIHSS"],
    firstLineTreatment: "IV tPA if <4.5hr & eligible; mechanical thrombectomy if LVO & <24hr",
    guidelines: "AHA/ASA 2019 Acute Ischemic Stroke Guidelines",
  },
  {
    name: "Type 2 Diabetes Mellitus",
    icd10: "E11",
    bodySystem: "Endocrine",
    prevalence: "~537M adults globally",
    mortalityRate: "~Double risk all-cause",
    keySymptoms: ["Polyuria", "Polydipsia", "Weight loss", "Fatigue", "Blurred vision", "Slow healing"],
    redFlags: ["HbA1c >9%", "DKA", "HHS", "Severe hypoglycemia"],
    recommendedTests: ["HbA1c", "Fasting glucose", "Lipid panel", "Renal panel", "Urinalysis", "Foot exam"],
    firstLineTreatment: "Metformin + lifestyle; SGLT2i/GLP-1ra if ASCVD/HF/CKD",
    guidelines: "ADA Standards of Care 2024",
  },
  {
    name: "Acute Pyelonephritis",
    icd10: "N10",
    bodySystem: "Genitourinary",
    prevalence: "~250K cases/yr US",
    mortalityRate: "<2% with treatment",
    keySymptoms: ["Fever", "Flank pain", "Dysuria", "Urinary frequency", "Nausea", "Vomiting"],
    redFlags: ["Septic shock", "Pregnancy", "Immunocompromise", "Obstruction"],
    recommendedTests: ["Urinalysis", "Urine culture", "CBC", "CMP", "Blood cultures if septic", "Renal imaging"],
    firstLineTreatment: "Outpatient: ceftriaxone or fluoroquinolone. Inpatient: IV ceftriaxone",
    guidelines: "IDSA 2010 UTI Guidelines; AUA 2022",
  },
  {
    name: "Acute Gastroenteritis",
    icd10: "A09",
    bodySystem: "Gastrointestinal",
    prevalence: "~2B episodes/yr globally",
    mortalityRate: "~1.5M deaths/yr (children)",
    keySymptoms: ["Diarrhea", "Vomiting", "Abdominal pain", "Fever", "Nausea", "Fatigue"],
    redFlags: ["Severe dehydration", "Bloody stools", "High fever", "Immunocompromise"],
    recommendedTests: ["Stool culture", "CBC", "BMP", "Lactate", "Stool PCR panel"],
    firstLineTreatment: "ORS; IV fluids if severe; antibiotics only if bacterial/severe",
    guidelines: "ACG 2016 Acute Diarrheal Infections",
  },
  {
    name: "Acute Pulmonary Embolism",
    icd10: "I26",
    bodySystem: "Cardiovascular",
    prevalence: "~10M cases/yr globally",
    mortalityRate: "~30% untreated",
    keySymptoms: ["Shortness of breath", "Chest pain", "Cough", "Hemoptysis", "Syncope", "Leg swelling"],
    redFlags: ["Hemodynamic instability", "RV strain", "Hypoxemia", "Wells >6"],
    recommendedTests: ["D-dimer", "CT pulmonary angiography", "ECG", "Troponin", "BNP", "Venous Doppler"],
    firstLineTreatment: "Anticoagulation (DOAC); thrombolysis if massive PE",
    guidelines: "ESC 2019 PE Guidelines; CHEST 2021",
  },
  {
    name: "Hypertensive Emergency",
    icd10: "I16.1",
    bodySystem: "Cardiovascular",
    prevalence: "~1-2% HTN patients",
    mortalityRate: "~5-10% with treatment",
    keySymptoms: ["Severe headache", "Confusion", "Chest pain", "Shortness of breath", "Vision changes", "Seizure"],
    redFlags: ["BP >180/120 with end-organ damage", "Encephalopathy", "AKI", "Pulmonary edema"],
    recommendedTests: ["CBC", "CMP", "Troponin", "BNP", "CT head", "Echocardiography", "Urinalysis"],
    firstLineTreatment: "IV nicardipine or labetalol; reduce MAP by 10-20% in first hour",
    guidelines: "AHA 2017 Hypertension Guidelines",
  },
  {
    name: "Chronic Kidney Disease",
    icd10: "N18",
    bodySystem: "Renal",
    prevalence: "~850M globally",
    mortalityRate: "Variable by stage",
    keySymptoms: ["Fatigue", "Edema", "Foamy urine", "Nausea", "Itching", "Shortness of breath"],
    redFlags: ["eGFR <30", "Hyperkalemia >6", "Volume overload", "Uremia"],
    recommendedTests: ["BMP", "eGFR", "UACR", "Renal ultrasound", "CBC", "Phosphorus", "PTH"],
    firstLineTreatment: "ACEi/ARB; SGLT2i; BP control; manage complications",
    guidelines: "KDIGO 2024 CKD Guidelines",
  },
];

export interface DrugRecord {
  name: string;
  class: string;
  halfLife: string;
  indications: string[];
  contraindications: string[];
  interactions: { with: string; severity: "contraindicated" | "major" | "moderate" | "minor"; mechanism: string; effect: string; management: string }[];
  pregnancyCategory: string;
}

export const DRUGS: DrugRecord[] = [
  {
    name: "Warfarin",
    class: "Anticoagulant (Vitamin K antagonist)",
    halfLife: "20-60 hours",
    indications: ["Atrial fibrillation", "DVT", "PE", "Mechanical heart valve"],
    contraindications: ["Active bleeding", "Pregnancy", "Severe HTN", "Recent surgery"],
    interactions: [
      { with: "Aspirin", severity: "major", mechanism: "Additive anticoagulation + GI mucosal damage", effect: "Major bleeding risk", management: "Avoid combination; if needed, monitor INR closely with PPI cover" },
      { with: "Amiodarone", severity: "major", mechanism: "CYP2C9 inhibition", effect: "Warfarin toxicity, INR spike", management: "Reduce warfarin dose 30-50%; check INR in 3 days" },
      { with: "Ibuprofen", severity: "major", mechanism: "Antiplatelet + GI toxicity", effect: "GI hemorrhage", management: "Use acetaminophen instead; if NSAID needed, add PPI" },
      { with: "Clarithromycin", severity: "contraindicated", mechanism: "CYP3A4 + CYP2C9 inhibition", effect: "Severe INR elevation, hemorrhage", management: "Switch to azithromycin or doxycycline" },
      { with: "St. John's Wort", severity: "contraindicated", mechanism: "CYP induction", effect: "Therapeutic failure, thrombosis", management: "Avoid entirely" },
    ],
    pregnancyCategory: "X",
  },
  {
    name: "Metformin",
    class: "Biguanide (Antidiabetic)",
    halfLife: "6.2 hours",
    indications: ["Type 2 diabetes", "PCOS", "Gestational diabetes (off-label)"],
    contraindications: ["eGFR <30", "Acute kidney injury", "Metabolic acidosis", "Severe hepatic impairment"],
    interactions: [
      { with: "Contrast dye (iodinated)", severity: "major", mechanism: "AKI risk → lactic acidosis", effect: "Metformin accumulation, lactic acidosis", management: "Hold metformin 48hr post-contrast; resume if renal function stable" },
      { with: "Alcohol", severity: "major", mechanism: "Enhanced lactate production", effect: "Lactic acidosis risk", management: "Limit alcohol; warn patient" },
      { with: "Cephalexin", severity: "moderate", mechanism: "Reduced renal clearance", effect: "Hypoglycemia", management: "Monitor glucose" },
      { with: "Topiramate", severity: "moderate", mechanism: "Both → metabolic acidosis", effect: "Additive acidosis risk", management: "Check bicarbonate" },
    ],
    pregnancyCategory: "B",
  },
  {
    name: "Lisinopril",
    class: "ACE Inhibitor",
    halfLife: "12 hours",
    indications: ["Hypertension", "Heart failure", "Post-MI", "Diabetic nephropathy"],
    contraindications: ["Pregnancy", "Bilateral renal artery stenosis", "Angioedema history", "Hyperkalemia"],
    interactions: [
      { with: "Potassium supplements", severity: "major", mechanism: "Reduced K+ excretion", effect: "Life-threatening hyperkalemia", management: "Avoid; if needed, monitor K+ weekly" },
      { with: "Spironolactone", severity: "major", mechanism: "Additive K+ retention", effect: "Hyperkalemia, arrhythmia", management: "Monitor K+ closely; consider alternative" },
      { with: "NSAIDs (Ibuprofen)", severity: "moderate", mechanism: "Reduced prostaglandin → ↓GFR", effect: "AKI, reduced ACEi efficacy", management: "Limit NSAID course; monitor renal function" },
      { with: "Aliskiren", severity: "contraindicated", mechanism: "Dual RAAS blockade", effect: "Hypotension, AKI, hyperkalemia", management: "Avoid combination" },
    ],
    pregnancyCategory: "D",
  },
  {
    name: "Atorvastatin",
    class: "Statin (HMG-CoA reductase inhibitor)",
    halfLife: "14 hours",
    indications: ["Hyperlipidemia", "ASCVD prevention", "Post-ACS"],
    contraindications: ["Active liver disease", "Pregnancy", "Lactation"],
    interactions: [
      { with: "Clarithromycin", severity: "major", mechanism: "CYP3A4 inhibition", effect: "Myopathy, rhabdomyolysis", management: "Hold statin during therapy" },
      { with: "Grapefruit juice", severity: "moderate", mechanism: "CYP3A4 inhibition", effect: "Increased statin levels", management: "Avoid >1L/day" },
      { with: "Warfarin", severity: "moderate", mechanism: "Hepatic interaction", effect: "INR changes", management: "Monitor INR" },
      { with: "Cyclosporine", severity: "contraindicated", mechanism: "Marked AUC increase", effect: "Rhabdomyolysis", management: "Avoid combination" },
    ],
    pregnancyCategory: "X",
  },
  {
    name: "Amoxicillin",
    class: "Beta-lactam antibiotic",
    halfLife: "1 hour",
    indications: ["Otitis media", "Sinusitis", "Pharyngitis", "CAP", "UTI", "H. pylori"],
    contraindications: ["Penicillin allergy (severe)", "Mononucleosis"],
    interactions: [
      { with: "Methotrexate", severity: "moderate", mechanism: "Reduced renal clearance", effect: "MTX toxicity", management: "Monitor for toxicity" },
      { with: "Warfarin", severity: "moderate", mechanism: "Altered gut flora → ↓vitamin K", effect: "INR elevation", management: "Monitor INR" },
      { with: "Allopurinol", severity: "minor", mechanism: "Unknown", effect: "Rash", management: "Observe" },
      { with: "Oral contraceptives", severity: "minor", mechanism: "Reduced enterohepatic recycling", effect: "Reduced OCP efficacy", management: "Backup contraception" },
    ],
    pregnancyCategory: "B",
  },
  {
    name: "Furosemide",
    class: "Loop diuretic",
    halfLife: "2 hours",
    indications: ["Edema", "Heart failure", "Hypertension", "Hyperkalemia"],
    contraindications: ["Anuria", "Severe hypovolemia", "Sulfa allergy (caution)"],
    interactions: [
      { with: "Lisinopril", severity: "moderate", mechanism: "Synergistic hypotension", effect: "First-dose hypotension", management: "Start low, titrate" },
      { with: "Digoxin", severity: "major", mechanism: "Hypokalemia → digoxin toxicity", effect: "Arrhythmia", management: "Maintain K+ 4-4.5" },
      { with: "Aminoglycosides", severity: "major", mechanism: "Ototoxicity + nephrotoxicity", effect: "Hearing loss, AKI", management: "Monitor closely; reduce doses" },
      { with: "Lithium", severity: "major", mechanism: "Reduced lithium clearance", effect: "Lithium toxicity", management: "Monitor levels" },
    ],
    pregnancyCategory: "C",
  },
];

export const ALLERGY_CROSS_REACTIVITY: Record<string, { drugs: string[]; severity: "mild" | "moderate" | "severe"; reaction: string; alternatives: string[] }> = {
  "Penicillin": {
    drugs: ["Amoxicillin", "Ampicillin", "Augmentin", "Cephalexin", "Ceftriaxone", "Imipenem"],
    severity: "severe",
    reaction: "Anaphylaxis, urticaria, angioedema",
    alternatives: ["Azithromycin", "Doxycycline", "Vancomycin", "Ciprofloxacin"],
  },
  "Sulfa": {
    drugs: ["Sulfamethoxazole", "Furosemide", "Hydrochlorothiazide", "Glipizide", "Celecoxib"],
    severity: "moderate",
    reaction: "Rash, Stevens-Johnson syndrome, photosensitivity",
    alternatives: ["Clindamycin", "Nitrofurantoin", "Ciprofloxacin"],
  },
  "Aspirin": {
    drugs: ["Aspirin", "Ibuprofen", "Naproxen", "Ketorolac", "Indomethacin"],
    severity: "moderate",
    reaction: "Bronchospasm, urticaria, angioedema (Samter triad)",
    alternatives: ["Acetaminophen", "Celecoxib", "Opioids"],
  },
  "Peanuts": {
    drugs: ["Soybean oil emulsion (Propofol)", "Lipid emulsion"],
    severity: "severe",
    reaction: "Anaphylaxis",
    alternatives: ["Alternative induction agents: etomidate, ketamine"],
  },
  "Latex": {
    drugs: [],
    severity: "moderate",
    reaction: "Type I IgE reaction: urticaria, anaphylaxis",
    alternatives: ["Nitrile equipment, non-latex gloves"],
  },
};

export const LAB_RANGES = {
  hemoglobin: { min: 13.5, max: 17.5, unit: "g/dL", criticalLow: 7, criticalHigh: 20 },
  whiteBloodCells: { min: 4, max: 11, unit: "K/µL", criticalLow: 1.5, criticalHigh: 30 },
  platelets: { min: 150, max: 400, unit: "K/µL", criticalLow: 50, criticalHigh: 1000 },
  sodium: { min: 135, max: 145, unit: "mEq/L", criticalLow: 120, criticalHigh: 160 },
  potassium: { min: 3.5, max: 5.0, unit: "mEq/L", criticalLow: 2.5, criticalHigh: 6.5 },
  creatinine: { min: 0.6, max: 1.3, unit: "mg/dL", criticalLow: 0, criticalHigh: 5 },
  bun: { min: 7, max: 20, unit: "mg/dL", criticalLow: 0, criticalHigh: 100 },
  glucose: { min: 70, max: 99, unit: "mg/dL (fasting)", criticalLow: 40, criticalHigh: 500 },
  alt: { min: 7, max: 56, unit: "U/L", criticalLow: 0, criticalHigh: 1000 },
  ast: { min: 10, max: 40, unit: "U/L", criticalLow: 0, criticalHigh: 1000 },
  troponin: { min: 0, max: 0.04, unit: "ng/mL", criticalLow: 0, criticalHigh: 1 },
  crp: { min: 0, max: 3, unit: "mg/L", criticalLow: 0, criticalHigh: 100 },
  esr: { min: 0, max: 20, unit: "mm/hr", criticalLow: 0, criticalHigh: 100 },
  inr: { min: 0.8, max: 1.2, unit: "", criticalLow: 0, criticalHigh: 5 },
  hemoglobinA1c: { min: 4, max: 5.6, unit: "%", criticalLow: 0, criticalHigh: 14 },
} as const;

export const VITAL_RANGES = {
  heartRate: { min: 60, max: 100, unit: "bpm", criticalLow: 40, criticalHigh: 130 },
  systolicBP: { min: 90, max: 120, unit: "mmHg", criticalLow: 80, criticalHigh: 180 },
  diastolicBP: { min: 60, max: 80, unit: "mmHg", criticalLow: 50, criticalHigh: 110 },
  temperature: { min: 36.1, max: 37.2, unit: "°C", criticalLow: 35, criticalHigh: 39.5 },
  respiratoryRate: { min: 12, max: 20, unit: "breaths/min", criticalLow: 8, criticalHigh: 30 },
  spo2: { min: 95, max: 100, unit: "%", criticalLow: 88, criticalHigh: 100 },
  bloodGlucose: { min: 70, max: 140, unit: "mg/dL", criticalLow: 50, criticalHigh: 400 },
} as const;

export const CLINICAL_RULES = {
  CURB65: {
    name: "CURB-65 (Pneumonia Severity)",
    criteria: ["Confusion", "Urea >7 mmol/L", "RR ≥30", "SBP <90 or DBP ≤60", "Age ≥65"],
    scores: { 0: "0.6% mortality — outpatient", 1: "2.7% — consider outpatient", 2: "6.8% — inpatient", 3: "14% — ICU consider", 4: "27.8% — ICU", 5: "27.8% — ICU" },
  },
  CHA2DS2VASc: {
    name: "CHA2DS2-VASc (Stroke risk in AF)",
    criteria: ["CHF", "HTN", "Age ≥75 (2pt)", "Diabetes", "Stroke/TIA (2pt)", "Vascular disease", "Age 65-74", "Female sex"],
    scores: { 0: "Low — no anticoagulation", 1: "Low-moderate — consider", 2: "Moderate-high — anticoagulate", "3+": "High — anticoagulate" },
  },
  qSOFA: {
    name: "qSOFA (Sepsis screening)",
    criteria: ["RR ≥22", "Altered mentation (GCS <15)", "SBP ≤100"],
    scores: { 0: "Low risk", 1: "Monitor", 2: "High risk — sepsis likely", 3: "Very high — septic shock risk" },
  },
  WELLS_PE: {
    name: "Wells Criteria (PE)",
    criteria: ["Clinical signs DVT", "PE most likely", "HR >100", "Immobilization/surgery 4wk", "Prior DVT/PE", "Hemoptysis", "Malignancy"],
    scores: { "≤4": "PE unlikely — D-dimer", ">4": "PE likely — CTPA" },
  },
  NIHSS: {
    name: "NIH Stroke Scale",
    criteria: ["11-item neurological exam"],
    scores: { "0": "No stroke", "1-4": "Minor", "5-15": "Moderate", "16-20": "Moderate-severe", "21-42": "Severe" },
  },
} as const;

export const KNOWLEDGE_NODES: KnowledgeNode[] = [
  { id: "acs", label: "Acute Coronary Syndrome", type: "disease", description: "I21 — Ischemic heart disease spectrum" },
  { id: "pna", label: "Pneumonia", type: "disease", description: "J18 — Lung infection" },
  { id: "sepsis", label: "Sepsis", type: "disease", description: "A41 — Dysregulated host response" },
  { id: "stroke", label: "Ischemic Stroke", type: "disease", description: "I63 — Cerebral infarction" },
  { id: "t2dm", label: "Type 2 Diabetes", type: "disease", description: "E11 — Insulin resistance" },
  { id: "ckd", label: "CKD", type: "disease", description: "N18 — Chronic kidney disease" },
  { id: "pe", label: "Pulmonary Embolism", type: "disease", description: "I26" },
  { id: "htn", label: "Hypertensive Emergency", type: "disease", description: "I16" },
  { id: "pyelo", label: "Pyelonephritis", type: "disease", description: "N10" },

  { id: "chest_pain", label: "Chest Pain", type: "symptom" },
  { id: "sob", label: "Shortness of Breath", type: "symptom" },
  { id: "fever", label: "Fever", type: "symptom" },
  { id: "cough", label: "Cough", type: "symptom" },
  { id: "weakness", label: "Weakness", type: "symptom" },
  { id: "fatigue", label: "Fatigue", type: "symptom" },
  { id: "confusion", label: "Confusion", type: "symptom" },
  { id: "polyuria", label: "Polyuria", type: "symptom" },
  { id: "dysuria", label: "Dysuria", type: "symptom" },
  { id: "hypotension", label: "Hypotension", type: "symptom" },
  { id: "tachycardia", label: "Tachycardia", type: "symptom" },
  { id: "edema", label: "Edema", type: "symptom" },

  { id: "cardio", label: "Cardiovascular", type: "bodySystem" },
  { id: "resp", label: "Respiratory", type: "bodySystem" },
  { id: "neuro", label: "Neurological", type: "bodySystem" },
  { id: "endo", label: "Endocrine", type: "bodySystem" },
  { id: "renal", label: "Renal", type: "bodySystem" },

  { id: "ecg", label: "ECG", type: "test" },
  { id: "troponin", label: "Troponin", type: "test" },
  { id: "cxr", label: "Chest X-ray", type: "test" },
  { id: "ct_head", label: "CT Head", type: "test" },
  { id: "hba1c", label: "HbA1c", type: "test" },
  { id: "lactate", label: "Lactate", type: "test" },
  { id: "ua", label: "Urinalysis", type: "test" },
  { id: "ctpa", label: "CTPA", type: "test" },

  { id: "aspirin", label: "Aspirin", type: "drug" },
  { id: "metformin", label: "Metformin", type: "drug" },
  { id: "ceftriaxone", label: "Ceftriaxone", type: "drug" },
  { id: "tpa", label: "tPA (Alteplase)", type: "drug" },
  { id: "doac", label: "DOAC", type: "drug" },
  { id: "insulin", label: "Insulin", type: "drug" },

  { id: "mi_complication", label: "Cardiogenic Shock", type: "complication" },
  { id: "ards", label: "ARDS", type: "complication" },
  { id: "aki", label: "Acute Kidney Injury", type: "complication" },
  { id: "dkn", label: "Diabetic Ketoacidosis", type: "complication" },
  { id: "septic_shock", label: "Septic Shock", type: "complication" },

  { id: "pci", label: "PCI (Stent)", type: "treatment" },
  { id: "thrombolysis", label: "Thrombolysis", type: "treatment" },
  { id: "revascularization", label: "Revascularization", type: "treatment" },
];

export const KNOWLEDGE_EDGES: KnowledgeEdge[] = [

  { source: "acs", target: "cardio", relationship: "affects", weight: 1 },
  { source: "pna", target: "resp", relationship: "affects", weight: 1 },
  { source: "sepsis", target: "cardio", relationship: "affects", weight: 0.9 },
  { source: "stroke", target: "neuro", relationship: "affects", weight: 1 },
  { source: "t2dm", target: "endo", relationship: "affects", weight: 1 },
  { source: "ckd", target: "renal", relationship: "affects", weight: 1 },
  { source: "pe", target: "cardio", relationship: "affects", weight: 0.9 },
  { source: "htn", target: "cardio", relationship: "affects", weight: 1 },
  { source: "pyelo", target: "renal", relationship: "affects", weight: 1 },

  { source: "acs", target: "chest_pain", relationship: "presents with", weight: 1 },
  { source: "acs", target: "sob", relationship: "presents with", weight: 0.8 },
  { source: "pna", target: "fever", relationship: "presents with", weight: 1 },
  { source: "pna", target: "cough", relationship: "presents with", weight: 1 },
  { source: "pna", target: "sob", relationship: "presents with", weight: 0.9 },
  { source: "sepsis", target: "fever", relationship: "presents with", weight: 0.9 },
  { source: "sepsis", target: "confusion", relationship: "presents with", weight: 0.9 },
  { source: "sepsis", target: "tachycardia", relationship: "presents with", weight: 1 },
  { source: "sepsis", target: "hypotension", relationship: "presents with", weight: 1 },
  { source: "stroke", target: "weakness", relationship: "presents with", weight: 1 },
  { source: "stroke", target: "confusion", relationship: "presents with", weight: 0.8 },
  { source: "t2dm", target: "polyuria", relationship: "presents with", weight: 0.9 },
  { source: "t2dm", target: "fatigue", relationship: "presents with", weight: 0.7 },
  { source: "ckd", target: "edema", relationship: "presents with", weight: 0.9 },
  { source: "ckd", target: "fatigue", relationship: "presents with", weight: 0.7 },
  { source: "pe", target: "sob", relationship: "presents with", weight: 1 },
  { source: "pe", target: "chest_pain", relationship: "presents with", weight: 0.8 },
  { source: "htn", target: "chest_pain", relationship: "presents with", weight: 0.6 },
  { source: "pyelo", target: "fever", relationship: "presents with", weight: 0.9 },
  { source: "pyelo", target: "dysuria", relationship: "presents with", weight: 0.9 },

  { source: "acs", target: "ecg", relationship: "diagnosed by", weight: 1 },
  { source: "acs", target: "troponin", relationship: "diagnosed by", weight: 1 },
  { source: "pna", target: "cxr", relationship: "diagnosed by", weight: 1 },
  { source: "sepsis", target: "lactate", relationship: "diagnosed by", weight: 1 },
  { source: "stroke", target: "ct_head", relationship: "diagnosed by", weight: 1 },
  { source: "t2dm", target: "hba1c", relationship: "diagnosed by", weight: 1 },
  { source: "pyelo", target: "ua", relationship: "diagnosed by", weight: 1 },
  { source: "pe", target: "ctpa", relationship: "diagnosed by", weight: 1 },

  { source: "acs", target: "aspirin", relationship: "treated by", weight: 1 },
  { source: "acs", target: "pci", relationship: "treated by", weight: 1 },
  { source: "pna", target: "ceftriaxone", relationship: "treated by", weight: 0.9 },
  { source: "stroke", target: "tpa", relationship: "treated by", weight: 0.9 },
  { source: "stroke", target: "thrombolysis", relationship: "treated by", weight: 0.9 },
  { source: "t2dm", target: "metformin", relationship: "treated by", weight: 1 },
  { source: "t2dm", target: "insulin", relationship: "treated by", weight: 0.7 },
  { source: "pe", target: "doac", relationship: "treated by", weight: 1 },

  { source: "acs", target: "mi_complication", relationship: "complicates to", weight: 0.7 },
  { source: "pna", target: "ards", relationship: "complicates to", weight: 0.5 },
  { source: "sepsis", target: "septic_shock", relationship: "complicates to", weight: 0.8 },
  { source: "sepsis", target: "aki", relationship: "complicates to", weight: 0.7 },
  { source: "t2dm", target: "ckd", relationship: "complicates to", weight: 0.6 },
  { source: "t2dm", target: "dkn", relationship: "complicates to", weight: 0.4 },
  { source: "htn", target: "stroke", relationship: "complicates to", weight: 0.4 },
  { source: "htn", target: "ckd", relationship: "complicates to", weight: 0.5 },
];

export interface KnowledgeSnippet {
  id: string;
  source: string;
  title: string;
  content: string;
  evidenceLevel: "A" | "B" | "C" | "D";
  year: number;
  url: string;
}

export const KNOWLEDGE_CORPUS: KnowledgeSnippet[] = [
  {
    id: "k1",
    source: "ACC/AHA 2022 Chest Pain Guidelines",
    title: "Evaluation of Acute Chest Pain",
    content: "Patients with suspected ACS should receive a 12-lead ECG within 10 minutes of arrival. High-sensitivity troponin should be measured at 0 and 1-2 hours. ST-elevation ≥1mm in 2 contiguous leads = STEMI requiring emergent reperfusion (PCI <90 min door-to-balloon).",
    evidenceLevel: "A",
    year: 2022,
    url: "https://www.acc.org/guidelines/chestpain",
  },
  {
    id: "k2",
    source: "Surviving Sepsis Campaign 2021",
    title: "Hour-1 Sepsis Bundle",
    content: "Within 1 hour of recognition: (1) measure lactate, (2) obtain blood cultures before antibiotics, (3) administer broad-spectrum antibiotics, (4) begin 30 mL/kg crystalloid for hypotension or lactate ≥4, (5) apply vasopressors if MAP <65 after fluids.",
    evidenceLevel: "A",
    year: 2021,
    url: "https://www.sccm.org/ssc",
  },
  {
    id: "k3",
    source: "AHA/ASA 2019 Stroke Guidelines",
    title: "Acute Ischemic Stroke Management",
    content: "IV alteplase (tPA) indicated within 4.5 hours of symptom onset for eligible patients. Mechanical thrombectomy for large vessel occlusion (LVO) up to 24 hours from onset. NIHSS used for severity. BP goal <185/110 before tPA, <180/105 after.",
    evidenceLevel: "A",
    year: 2019,
    url: "https://www.stroke.org/guidelines",
  },
  {
    id: "k4",
    source: "ATS/IDSA 2019 CAP Guidelines",
    title: "Community-Acquired Pneumonia Management",
    content: "Use CURB-65 or PSI for severity. Outpatient treatment for CURB-65 0-1. Inpatient for CURB-65 ≥2. ICU for CURB-65 ≥3. Outpatient antibiotics: amoxicillin 1g TID or doxycycline 100mg BID. Inpatient: ceftriaxone + azithromycin.",
    evidenceLevel: "A",
    year: 2019,
    url: "https://www.thoracic.org/statements",
  },
  {
    id: "k5",
    source: "ADA Standards of Care 2024",
    title: "Type 2 Diabetes Management",
    content: "HbA1c goal <7% for most adults. Add SGLT2i or GLP-1ra if ASCVD, HF, or CKD regardless of A1c. Statin for all T2DM age 40-75. BP goal <130/80. ACEi/ARB for diabetic kidney disease.",
    evidenceLevel: "A",
    year: 2024,
    url: "https://diabetesjournals.org/care",
  },
  {
    id: "k6",
    source: "ESC 2019 PE Guidelines",
    title: "Acute Pulmonary Embolism",
    content: "Risk stratify by shock index, RV function, biomarkers. Hemodynamically unstable = high-risk → consider thrombolysis. Stable: anticoagulation with DOAC (apixaban, rivaroxaban) preferred. Provoked vs unprovoked determines duration.",
    evidenceLevel: "A",
    year: 2019,
    url: "https://www.escardio.org/Guidelines",
  },
  {
    id: "k7",
    source: "KDIGO 2024 CKD Guidelines",
    title: "Chronic Kidney Disease Evaluation",
    content: "CKD defined as eGFR <60 or markers of kidney damage >3 months. SGLT2i recommended for CKD with albuminuria. ACEi/ARB first-line for proteinuria. BP target <120 systolic (per SPRINT). Manage hyperkalemia, anemia, mineral bone disease.",
    evidenceLevel: "A",
    year: 2024,
    url: "https://kdigo.org/guidelines",
  },
  {
    id: "k8",
    source: "AHA 2017 Hypertension Guidelines",
    title: "Hypertensive Emergency",
    content: "Hypertensive emergency = BP >180/120 with new/worsening end-organ damage. Reduce MAP by no more than 25% in first hour, then 160/100 over 2-6 hours, then normal. IV agents: nicardipine, labetalol, esmolol, nitroprusside.",
    evidenceLevel: "B",
    year: 2017,
    url: "https://www.acc.org/guidelines/htn",
  },
];

export const ICD10_CODES: Record<string, { description: string }> = {
  "I21.9": { description: "Acute myocardial infarction, unspecified" },
  "I21.4": { description: "Non-ST elevation (NSTEMI) myocardial infarction" },
  "I21.0": { description: "ST elevation (STEMI) myocardial infarction of anterior wall" },
  "I21.1": { description: "ST elevation (STEMI) myocardial infarction of inferior wall" },
  "I63.9": { description: "Cerebral infarction, unspecified" },
  "I63.50": { description: "Cerebral infarction due to unspecified occlusion or stenosis of precerebral arteries" },
  "J18.9": { description: "Pneumonia, unspecified organism" },
  "J18.1": { description: "Lobar pneumonia, unspecified organism" },
  "A41.9": { description: "Sepsis, unspecified organism" },
  "A41.02": { description: "Sepsis due to methicillin-resistant S. aureus" },
  "E11.9": { description: "Type 2 diabetes mellitus without complications" },
  "E11.65": { description: "Type 2 diabetes mellitus with hyperglycemia" },
  "E11.22": { description: "Type 2 diabetes mellitus with diabetic chronic kidney disease" },
  "N18.6": { description: "End stage renal disease" },
  "N18.3": { description: "Chronic kidney disease, stage 3" },
  "N10": { description: "Acute tubulo-interstitial nephritis" },
  "I26.99": { description: "Other acute pulmonary embolism without cor pulmonale" },
  "I16.1": { description: "Hypertensive emergency" },
  "I48.91": { description: "Unspecified atrial fibrillation" },
  "E87.2": { description: "Acidosis" },
  "E86": { description: "Volume depletion" },
  "R07.9": { description: "Chest pain, unspecified" },
  "R50.9": { description: "Fever, unspecified" },
  "R06.02": { description: "Shortness of breath" },
};

export const CPT_CODES: Record<string, { description: string; rvu: number }> = {
  "99284": { description: "ED visit, moderate complexity", rvu: 3.93 },
  "99285": { description: "ED visit, high complexity", rvu: 5.46 },
  "99223": { description: "Initial hospital care, high complexity", rvu: 3.86 },
  "99291": { description: "Critical care, first 30-74 min", rvu: 6.5 },
  "93010": { description: "ECG, routine interpretation", rvu: 0.17 },
  "80053": { description: "Comprehensive metabolic panel", rvu: 1.27 },
  "85025": { description: "CBC with differential", rvu: 0.83 },
  "83695": { description: "Troponin, quantitative", rvu: 0.73 },
  "71045": { description: "Chest X-ray, single view", rvu: 0.46 },
  "71250": { description: "CT thorax with contrast", rvu: 1.51 },
  "70450": { description: "CT head without contrast", rvu: 1.43 },
  "92981": { description: "PCI, single vessel + stent", rvu: 17.39 },
  "37195": { description: "Mechanical thrombectomy, cerebral", rvu: 28.71 },
  "70553": { description: "MRI brain with/without contrast", rvu: 2.18 },
};
