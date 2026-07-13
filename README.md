# MediSync

## AI Powered Intelligent Clinical Triage and Decision Support Platform

MediSync is a production grade clinical decision support system (CDSS) built for emergency departments, urgent care centers, and outpatient clinics. It combines real time large language model reasoning with deterministic clinical safety rules to help physicians make faster, more accurate diagnostic and triage decisions.

The platform is designed to feel like something between OpenEvidence, Glass Health, and an AI powered emergency department triage tool. It does not replace doctors. Every prediction includes confidence scores, supporting evidence, and references to current clinical guidelines.

---

## Table of Contents

1. [What MediSync Does](#what-medisync-does)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [Architecture Overview](#architecture-overview)
5. [Real AI Integration](#real-ai-integration)
6. [Clinical Safety Rules](#clinical-safety-rules)
7. [Medical Knowledge Base](#medical-knowledge-base)
8. [User Interface](#user-interface)
9. [Patient Workflow](#patient-workflow)
10. [Getting Started](#getting-started)
11. [Project Structure](#project-structure)
12. [API Reference](#api-reference)
13. [Design System](#design-system)
14. [Mobile Responsiveness](#mobile-responsiveness)
15. [Security and Compliance Notes](#security-and-compliance-notes)
16. [Limitations](#limitations)
17. [License](#license)

---

## What MediSync Does

Instead of asking "what disease do I have," MediSync answers the questions that actually matter in clinical practice:

- How urgently does this patient need treatment
- What are the probable conditions and what evidence supports them
- What tests should be ordered next
- What interventions are appropriate
- How confident is the AI in its assessment

The platform performs a full clinical analysis pipeline on every patient:

1. Patient understanding (demographics, symptoms, history, medications, allergies, vitals, labs, lifestyle)
2. Medical reasoning (LLM generates differential diagnoses with evidence)
3. Risk scoring (validated clinical decision rules)
4. Triage assignment (ESI v4 + MEWS inspired scoring)
5. Test recommendations (evidence based workup)
6. Treatment suggestions (guideline referenced)
7. SOAP note generation (LLM written clinical documentation)
8. ICD 10 coding (automatic)
9. CPT billing code suggestions
10. FHIR R4 interoperability export

---

## Key Features

### Real LLM Clinical Reasoning

MediSync uses the GLM 4 large language model via a standard OpenAI-compatible API to generate:

- 4 to 5 ranked differential diagnoses with ICD 10 codes, probability scores, and confidence levels
- Per diagnosis clinical reasoning explaining what evidence supports and argues against each condition
- A full 2 to 3 paragraph clinical reasoning narrative referencing specific guidelines
- Real time chat responses with patient specific data and guideline citations
- Complete SOAP notes (Subjective, Objective, Assessment, Plan) with patient specific values

The LLM calls are streamed using Server Sent Events with heartbeat bytes to prevent gateway timeouts. A robust JSON repair function handles common LLM output errors including missing colons, missing commas, and markdown code block wrappers.

### Deterministic Clinical Safety Rules

The LLM does not handle clinical safety. These rules run instantly and deterministically:

- Vital sign analysis against standard reference ranges (heart rate, blood pressure, SpO2, temperature, respiratory rate, blood glucose, BMI)
- Laboratory value analysis with abnormality flagging (hemoglobin, WBC, platelets, sodium, potassium, creatinine, BUN, glucose, ALT, AST, troponin, CRP, ESR, INR, HbA1c)
- Drug drug interaction checking against a curated database of 6 medications with mechanism, clinical effect, and management
- Allergy cross reactivity checking (penicillin, sulfa, aspirin, peanut, latex)
- Duplicate therapy detection
- Triage scoring using ESI v4 principles and Modified Early Warning Score (MEWS)
- Risk scores inspired by CURB 65, CHA2DS2 VASc, qSOFA, Wells criteria, and NIHSS
- Hospital admission prediction (discharge, observation, admission, ICU)
- 30 day readmission risk estimation
- 30 day mortality risk estimation

### Multi Patient Management

- Add unlimited patients via the onboarding flow or the sidebar
- Each patient has independent clinical data and analysis
- Patients persist in localStorage across page reloads
- Switch between patients instantly by tapping their initials block in the sidebar
- Delete patients with a two step confirmation

### Vitals Radar Visualization

A hexagonal SVG radar chart on the Overview screen that visualizes all 6 vital signs as a single shape:

- Normal vitals produce a balanced hexagon
- Abnormal vitals push the vertex inward (orange)
- Critical vitals create a deep notch (red with pulsing animation)
- A faint green dashed hexagon shows the normal reference shape
- You can see at a glance whether a patient is sick based on the shape distortion alone

### AI Chat Assistant

A conversational interface where physicians can ask:

- What supports the leading diagnosis
- Why was a specific test recommended
- What are the red flags for this patient
- Could this be a different condition
- What does the latest guideline say

The chat references the patient actual clinical data and cites specific guidelines (ACC/AHA, SSC, AHA/ASA, ATS/IDSA, ADA, ESC, KDIGO) with evidence level and publication year.

### SOAP Note Generation

One tap generates a complete clinical note:

- Subjective: chief complaint, HPI, PMH, medications, allergies, social history
- Objective: vital signs with specific values, lab abnormalities, exam findings
- Assessment: diagnostic impression with leading differential and ICD 10 code
- Plan: 5 to 7 numbered items covering workup, therapeutics, monitoring, disposition, follow up, patient education

Includes automatic ICD 10 coding and CPT billing code suggestions with RVU values.

### What If Simulator

Adjust vital signs with sliders and see how the AI risk score responds in real time. The simulator uses clinical heuristics (tachycardia, hypoxemia, hypotension) to compute a simplified risk delta.

### Knowledge Graph

An interactive SVG graph of 48 clinical entities (diseases, symptoms, drugs, tests, body systems, complications, treatments) connected by 60+ relationships. Click any node to explore its connections.

---

## Technology Stack

### Frontend

- **Next.js 16** with App Router and Turbopack
- **TypeScript 5** with strict typing throughout
- **Tailwind CSS 4** for styling
- **shadcn/ui** component library (New York style) with Radix UI primitives
- **Framer Motion** for animations and transitions
- **Recharts** for data visualization
- **Zustand** for client state management
- **Bangers** display font for headlines
- **JetBrains Mono** for body text and data labels

### Backend

- **Next.js API Routes** (App Router server components)
- **Server Sent Events** for streaming LLM responses with heartbeats
- **Standard Fetch API** for GLM 4 large language model access

### Data

- **localStorage** for patient persistence (no external database required)
- **In memory Zustand store** for reactive state management
- **Curated medical knowledge base** in TypeScript (ICD 10 codes, drug interactions, clinical guidelines)

### Design

- **TypeUI Tetris design system** with periwinkle surface, navy primary, purple secondary
- **Glassmorphism** with backdrop blur on cards, sidebar, header, and dock
- **Floating macOS style dock** for zone navigation (no navbar)
- **Hard offset shadows** (3px 3px 0) for the Tetris block aesthetic
- **Light mode only** (no dark mode)

---

## Architecture Overview

```
Patient Data Entered
       |
       v
engine.ts (instant, deterministic)
  -> Vital sign analysis
  -> Drug interaction checking
  -> Allergy cross reactivity
  -> Triage scoring (ESI + MEWS)
  -> Risk scores (CURB 65, CHA2DS2 VASc, qSOFA)
  -> Admission prediction
       |
       v
/api/clinical-reasoning (streaming, 5 to 30 seconds)
  -> GLM 4 generates differentials + narrative
  -> JSON repair handles LLM output errors
  -> Merged with deterministic analysis
       |
       v
UI displays combined result
  -> "REAL LLM" badge if GLM 4 succeeded
  -> "RULE BASED" fallback if GLM 4 failed
```

The architecture is intentionally hybrid. Clinical safety rules (vital signs, drug interactions, triage) are deterministic because you cannot rely on an LLM to consistently catch a drug interaction or compute a triage score. The LLM handles the reasoning layer (differentials, narrative, chat, documentation) because that requires medical knowledge and natural language generation.

---

## Real AI Integration

MediSync uses a direct API client which calls the GLM 4 large language model. This is a real hosted LLM API, not a local model, not a mock, not a simulation.

### Three API Endpoints

**POST /api/clinical-reasoning**

Accepts patient data and returns a complete clinical analysis. The response is streamed using Server Sent Events with heartbeat bytes every 3 seconds to prevent gateway timeouts. The LLM generates 4 to 5 differential diagnoses with ICD 10 codes, probabilities, confidence, reasoning, evidence factors, red flags, and recommended tests. It also generates a 2 to 3 paragraph narrative. The deterministic engine runs first (instant) and the LLM output is merged on top.

**POST /api/chat**

Accepts a question, patient data, current analysis, and conversation history. Returns a real LLM response with reasoning trace and evidence citations from the guideline corpus. The system prompt includes the full patient context and 8 guideline documents for RAG.

**POST /api/soap**

Accepts patient data and analysis. Returns a complete SOAP note as JSON (subjective, objective, assessment, plan) generated by the LLM with patient specific values.

### JSON Repair

LLMs occasionally produce malformed JSON. The `repairLLMJSON()` function handles:

- Missing colons before arrays: `"redFlags["` becomes `"redFlags":[`
- Missing colons before objects: `"keyName{"` becomes `"keyName":{`
- Missing commas between objects: `}{` becomes `},{`
- Missing commas between arrays: `][` becomes `],[`
- Single quotes converted to double quotes
- Trailing commas removed
- Markdown code block wrappers (triple backtick json) stripped
- Unclosed code blocks handled

If parsing fails after repair, the system retries the LLM call up to 2 times before falling back to deterministic analysis.

### Probability Normalization

LLMs sometimes return 0 to 1 fractions instead of 0 to 100 percentages. The `normalizePercent()` function detects values of 1 or less and multiplies by 100, then clamps to the 5 to 98 range.

---

## Clinical Safety Rules

The deterministic engine (`src/lib/medical/engine.ts`) implements the following clinical rules:

### Vital Sign Analysis

Each vital sign is checked against standard adult reference ranges with normal, low, high, critical low, and critical high classifications:

| Vital Sign | Normal Range | Critical Low | Critical High |
|---|---|---|---|
| Heart Rate | 60 to 100 bpm | 40 bpm | 130 bpm |
| Systolic BP | 90 to 120 mmHg | 80 mmHg | 180 mmHg |
| Diastolic BP | 60 to 80 mmHg | 50 mmHg | 110 mmHg |
| Temperature | 36.1 to 37.2 C | 35.0 C | 39.5 C |
| Respiratory Rate | 12 to 20 per min | 8 per min | 30 per min |
| SpO2 | 95 to 100 percent | 88 percent | 100 percent |
| Blood Glucose | 70 to 140 mg/dL | 50 mg/dL | 400 mg/dL |

BMI is calculated from weight and height and classified as underweight, normal, overweight, or obese.

### Drug Interaction Checking

The system checks the patient medication list against a curated database of 6 drugs (Warfarin, Metformin, Lisinopril, Atorvastatin, Amoxicillin, Furosemide) with full interaction data:

- Mechanism of interaction
- Clinical effect
- Management recommendation
- Severity (contraindicated, major, moderate, minor)
- Evidence level (A, B, C)

Duplicate therapy detection flags when two drugs from the same class are prescribed.

### Allergy Cross Reactivity

Checks patient allergies against 5 allergen classes (Penicillin, Sulfa, Aspirin, Peanut, Latex) with cross reactive drug lists and alternative medications.

### Triage Scoring

Uses a hybrid of ESI v4 principles and Modified Early Warning Score (MEWS):

- SpO2 below 88 percent triggers red triage immediately
- Systolic BP below 80 triggers red triage
- Heart rate above 130 or below 40 adds significant points
- Temperature above 40 C adds points
- Pain score 9 or 10 adds points
- Top differential probability above 50 percent in cardiovascular, neurological, or multi system adds points
- Critical lab values (troponin, potassium) add points
- Symptom severity modifies the score

Triage levels: Red (resuscitation, immediate), Orange (emergent, 1 hour), Yellow (urgent, 24 hours), Green (less urgent, 3 days), Blue (non urgent, 1 week).

### Risk Scores

Six risk scores are computed:

1. **Cardiovascular Disease (10 year ASCVD)** using Pooled Cohort Equations inspired scoring
2. **Ischemic Stroke** using CHA2DS2 VASc inspired criteria
3. **Sepsis (in hospital)** using qSOFA inspired criteria
4. **Type 2 Diabetes** using ADA risk test and HbA1c stratification
5. **Acute Kidney Injury** using KDIGO creatinine criteria
6. **30 Day Mortality** using APACHE II inspired scoring

Each risk score includes contributing factors, risk level (low, moderate, high, very high), and a clinical recommendation.

### Admission Prediction

Predicts disposition (Discharge, Observation, Admission, ICU) based on triage level, vital sign abnormalities, lab values, and critical findings. Also estimates length of stay and 30 day readmission probability.

---

## Medical Knowledge Base

The knowledge base (`src/lib/medical/knowledge.ts`) contains:

### Disease Database

10 ICD 10 coded diseases with:
- Body system classification
- Prevalence and mortality rates
- Key symptoms
- Red flags
- Recommended tests
- First line treatment
- Guideline references

Diseases included: Acute Coronary Syndrome, Community Acquired Pneumonia, Sepsis, Ischemic Stroke, Type 2 Diabetes, Acute Pyelonephritis, Acute Gastroenteritis, Acute Pulmonary Embolism, Hypertensive Emergency, Chronic Kidney Disease.

### Drug Database

6 drugs with full interaction matrices:
- Warfarin (anticoagulant)
- Metformin (biguanide)
- Lisinopril (ACE inhibitor)
- Atorvastatin (statin)
- Amoxicillin (beta lactam antibiotic)
- Furosemide (loop diuretic)

Each drug includes class, half life, indications, contraindications, interactions with mechanism and management, and pregnancy category.

### Clinical Decision Rules

Compiled criteria for:
- CURB 65 (pneumonia severity)
- CHA2DS2 VASc (stroke risk in atrial fibrillation)
- qSOFA (sepsis screening)
- Wells Criteria (pulmonary embolism)
- NIHSS (stroke scale)

### RAG Knowledge Corpus

8 real clinical guideline excerpts used by the LLM chat for evidence based citations:

1. ACC/AHA 2022 Chest Pain Guidelines
2. Surviving Sepsis Campaign 2021
3. AHA/ASA 2019 Acute Ischemic Stroke Guidelines
4. ATS/IDSA 2019 Community Acquired Pneumonia Guidelines
5. ADA Standards of Care 2024
6. ESC 2019 Pulmonary Embolism Guidelines
7. KDIGO 2024 Chronic Kidney Disease Guidelines
8. AHA 2017 Hypertension Guidelines

### Knowledge Graph

48 nodes (diseases, symptoms, drugs, tests, body systems, complications, treatments) connected by 60+ weighted edges representing clinical relationships (presents with, diagnosed by, treated by, complicates to, affects).

### ICD 10 and CPT Codes

ICD 10 codes for 25+ common diagnoses with descriptions. CPT codes for 14 common procedures with RVU values for billing.

---

## User Interface

### Design System

MediSync uses the TypeUI Tetris design system:

- **Surface**: Periwinkle (#DFE7FF) with a subtle gradient mesh background
- **Primary**: Deep navy (#1C202B) for borders, headings, and structure
- **Secondary**: Vivid purple (#7107E7) for accents, active states, and LLM badges
- **Success**: Green (#16A34A) for normal vitals and low risk
- **Warning**: Orange (#D97706) for abnormal vitals and moderate risk
- **Danger**: Red (#DC2626) for critical alerts and high risk
- **Display font**: Bangers (bold, game inspired)
- **Body font**: JetBrains Mono (monospace, technical)
- **Cards**: Frosted glass (rgba(255,255,255,0.75) with backdrop blur)
- **Shadows**: Hard offset (4px 4px 0) for the Tetris block aesthetic plus soft drop shadows for depth
- **Corners**: 4px radius (almost square, game like)

### Navigation

MediSync has **no navbar**. Zone navigation is done through a floating macOS style dock at the bottom center of the screen:

- 4 zone icons (Overview, Patient, Reasoning, Tools) with labels
- Hover effect: icons lift up 6px and scale 1.1x with spring animation
- Active zone: highlighted purple with white dot indicator
- Glassmorphic: dark glass with backdrop blur, purple border, rounded corners
- On mobile: labels hide, dock shrinks to icons only

### Layout

**Desktop (768px and up):**
- Left sidebar (240px, fixed, dark glass) with patient directory
- Main content area (margin left 240px) with glassmorphic header and content
- Floating dock at bottom center

**Mobile (below 768px):**
- No visible sidebar (hidden off screen)
- Hamburger menu in header opens sidebar as slide in drawer with overlay
- Full width content
- Compact floating dock (icons only)

### Onboarding Flow

When the app loads with no patients, a full screen intake form appears:

- Bangers headline "WELCOME TO MEDISYNC"
- Complete clinical intake: demographics, symptoms (with quick add chips), duration, severity, vitals (6 fields), key labs (6 fields), medications, allergies, medical history, smoking toggle
- Submit button disabled until name and at least one symptom are entered
- On submit: patient is added, app transitions to main interface, AI analysis auto runs

### Zones

**01 Overview**
- Hero patient card with triage verdict
- Leading diagnosis with probability and confidence
- Vitals radar (hexagonal SVG that distorts with abnormalities)
- Quick action buttons (numbered 01 to 04)
- Risk score summary (4 stat blocks)

**02 Patient**
- Demographics form
- Symptom entry with quick add chips
- Vital signs editor (6 fields with pain score slider)
- Key labs editor (6 fields with abnormality indicators)
- Medications, allergies, and medical history managers
- Lifestyle factors (smoking, alcohol, exercise, diet)

**03 Reasoning**
- Triage banner with level and disposition
- Ranked differentials list (click to select)
- Selected diagnosis detail with probability, confidence, reasoning, evidence bars, and red flags
- Full LLM generated narrative
- Recommended workup grid (up to 9 tests with priority badges)

**04 Tools**
- Tabbed interface with 4 tools:
  - AI Assistant (chat with LLM, patient specific, guideline citations)
  - SOAP Note (LLM generated, copy and download, ICD 10 and CPT codes)
  - What If (vital sign sliders with real time risk delta)
  - Knowledge Graph (interactive SVG, click to explore)

---

## Patient Workflow

1. **Onboarding**: User enters patient data (name, age, symptoms, vitals, labs, medications, allergies, history)
2. **Analysis**: The deterministic engine runs instantly, then the LLM generates differentials and narrative (5 to 30 seconds)
3. **Overview**: User sees the clinical snapshot with triage verdict, leading diagnosis, vitals radar, and risk scores
4. **Reasoning**: User reviews the ranked differentials, evidence, red flags, and full narrative
5. **Tools**: User can chat with the AI about the case, generate a SOAP note, simulate what if scenarios, or explore the knowledge graph
6. **Documentation**: User generates a SOAP note with ICD 10 and CPT codes, copies or downloads it
7. **Multi Patient**: User can add more patients, switch between them via the sidebar, and each patient retains independent analysis

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- Bun (for package management and running)
- An API key is required to power the clinical reasoning features.

### API Key Configuration

Configure your environment variables in `.env` (or `.env.local`) in the root of the project to set your API key and base URL:

```env
ZAI_API_KEY=YOUR_Z_AI_API_KEY
ZAI_BASE_URL=https://api.z.ai/api/paas/v4
```

### Installation

```bash
# Install dependencies
bun install

# Start the development server
bun run dev
```

The app will be available at http://localhost:3000

### Building for Production

```bash
bun run build
bun run start
```

### Linting

```bash
bun run lint
```

### Database

The project uses Prisma with SQLite. The database schema is in `prisma/schema.prisma`. To push schema changes:

```bash
bun run db:push
```

---

## Project Structure

```
medisync/
|
|-- src/
|   |-- app/
|   |   |-- api/
|   |   |   |-- clinical-reasoning/route.ts   # Streaming LLM differentials + narrative
|   |   |   |-- chat/route.ts                 # Streaming LLM chat with RAG
|   |   |   |-- soap/route.ts                 # Streaming LLM SOAP note generation
|   |   |   |-- route.ts                      # Health check
|   |   |-- globals.css                       # TypeUI Tetris design system + dock + glassmorphism
|   |   |-- layout.tsx                        # Root layout with Bangers + JetBrains Mono fonts
|   |   |-- page.tsx                          # Main page (onboarding gate + zone router)
|   |
|   |-- components/
|   |   |-- medisync/
|   |   |   |-- app-shell.tsx                 # Sidebar + header + floating dock layout
|   |   |   |-- onboarding.tsx                # Full screen patient intake form
|   |   |   |-- patient-sidebar.tsx           # (Legacy, now in app-shell)
|   |   |   |-- store.ts                      # Zustand store (multi patient, localStorage, API calls)
|   |   |   |-- shared.ts                     # Triage colors, severity colors, helpers
|   |   |   |-- vitals-radar.tsx              # Hexagonal SVG radar component
|   |   |   |-- theme-provider.tsx            # (Legacy, light mode only)
|   |   |   |-- views/
|   |   |       |-- overview.tsx              # Clinical snapshot with vitals radar
|   |   |       |-- patient.tsx               # Clinical intake form
|   |   |       |-- reasoning.tsx             # Differentials + evidence + narrative
|   |   |       |-- tools.tsx                 # Chat + SOAP + What If + Knowledge tabs
|   |   |       |-- (14 legacy view files, not imported)
|   |   |-- ui/                               # shadcn/ui components
|   |
|   |-- lib/
|   |   |-- ai/
|   |   |   |-- clinical-llm.ts              # Direct API integration, JSON repair, streaming
|   |   |-- medical/
|   |   |   |-- types.ts                     # TypeScript types for all clinical data
|   |   |   |-- engine.ts                    # Deterministic clinical rules
|   |   |   |-- knowledge.ts                 # ICD 10, drugs, guidelines, knowledge graph
|   |   |-- utils.ts                         # cn() class merge utility
|   |   |-- db.ts                            # Prisma client
|   |
|   |-- hooks/
|       |-- use-mobile.ts
|       |-- use-toast.ts
|
|-- prisma/
|   |-- schema.prisma                        # Database schema
|
|-- public/
|   |-- logo.svg
|   |-- robots.txt
|
|-- package.json
|-- tailwind.config.ts
|-- tsconfig.json
|-- next.config.ts
|-- eslint.config.mjs
|-- Caddyfile                                # Gateway config
```

---

## API Reference

### POST /api/clinical-reasoning

**Request:**
```json
{
  "patient": {
    "id": "PT-001",
    "name": "Robert Chen",
    "age": 67,
    "gender": "male",
    "symptoms": ["Chest pain", "Sweating"],
    "vitals": { "heartRate": 104, "systolicBP": 142, ... },
    "labs": { "troponin": 0.84, ... },
    ...
  }
}
```

**Response:** Server Sent Events stream
- Heartbeat lines: `: heartbeat`
- Final data: `data: { "analysis": ClinicalAnalysis, "llmPowered": true, ... }`

### POST /api/chat

**Request:**
```json
{
  "question": "What supports the leading diagnosis?",
  "patient": PatientInput,
  "analysis": ClinicalAnalysis,
  "history": [{ "role": "user", "content": "..." }, ...]
}
```

**Response:** Server Sent Events stream with final data containing content, reasoning, and citations.

### POST /api/soap

**Request:**
```json
{
  "patient": PatientInput,
  "analysis": ClinicalAnalysis
}
```

**Response:** Server Sent Events stream with final data containing the SOAP note JSON.

---

## Design System

### Color Tokens

| Token | Hex | Usage |
|---|---|---|
| Background | #DFE7FF | Page surface (periwinkle) |
| Foreground | #1C398E | Body text (deep blue) |
| Primary | #1C202B | Borders, headings, structure (navy) |
| Secondary | #7107E7 | Accents, active states (purple) |
| Success | #16A34A | Normal vitals, low risk |
| Warning | #D97706 | Abnormal vitals, moderate risk |
| Danger | #DC2626 | Critical alerts, high risk |
| Card | rgba(255,255,255,0.75) | Frosted glass cards |
| Muted | #5A6BB8 | Secondary text, labels |

### Typography

- **Display**: Bangers (headlines, stat numbers, section numbers)
- **Body**: JetBrains Mono (all body text, data values, labels)
- **Label**: JetBrains Mono uppercase 0.6875rem with 0.1em letter spacing

### Triage Colors

| Level | Color | Meaning |
|---|---|---|
| Red | #DC2626 | Resuscitation (immediate) |
| Orange | #D97706 | Emergent (1 hour) |
| Yellow | #D97706 | Urgent (24 hours) |
| Green | #16A34A | Less urgent (3 days) |
| Blue | #7107E7 | Non urgent (1 week) |

---

## Mobile Responsiveness

The app is fully responsive from 375px (iPhone) to 1280px+ (desktop):

**Below 768px (Mobile):**
- Sidebar hidden, hamburger menu opens slide in drawer with overlay
- Floating dock shrinks to icons only (no labels)
- Header compacts (hides labels, shows status dot only)
- Onboarding form uses 2 column grid, smaller text, full width submit
- Overview stacks vertically (patient info above vitals radar)
- Quick actions go 2x2 instead of 1x4
- Vitals radar scales to fit container (max 280px)

**768px and up (Desktop):**
- Sidebar always visible (240px fixed)
- Full floating dock with labels
- Full header with patient name and ID
- Overview uses 2 column layout (patient info beside vitals radar)
- Quick actions in 1x4 grid

---

## Security and Compliance Notes

MediSync is a clinical decision support tool. It is NOT a medical device and must NOT be used for actual patient care without:

1. **FDA clearance** as Software as a Medical Device (SaMD)
2. **Clinical validation** against gold standard diagnoses
3. **HIPAA compliance** for patient data handling (currently uses localStorage only)
4. **Audit logging** for all AI generated recommendations
5. **RBAC** (role based access control) for doctors, nurses, admins
6. **Integration** with hospital EHR systems via HL7/FHIR

The LLM (GLM 4) is called server side only. Patient data is never exposed to the client beyond what is displayed. The LLM API calls are handled exclusively in API routes, never in client components.

### What Would Need to Change for Production

- Replace localStorage with a HIPAA compliant database (PostgreSQL with encryption)
- Add NextAuth.js authentication with JWT and OAuth
- Replace the 6 drug database with Lexicomp or Micromedex (50,000+ interactions)
- Replace the 10 disease database with ICD 10/SNOMED CT (10,000+ conditions)
- Replace heuristic risk scores with validated implementations
- Replace the multi model comparison with real trained ML model endpoints
- Add audit logs for every AI prediction and clinician action
- Add rate limiting and API key management
- Run clinical validation studies

---

## Limitations

### What is Real

- GLM 4 LLM generates all differentials, narrative, chat responses, and SOAP notes
- Clinical safety rules (vitals, drug interactions, triage, risk scores) use real medical heuristics
- Medical knowledge base contains real ICD 10 codes, real drugs, real guideline excerpts
- Streaming API with heartbeats prevents gateway timeouts
- JSON repair handles common LLM output errors
- Multi patient support with localStorage persistence
- Mobile responsive from 375px to 1280px+

### What is Heuristic (Not Real ML Models)

- **Multi model comparison**: Shows 7 ML model architectures (XGBoost, CatBoost, LightGBM, etc.) with heuristic AUC/F1 scores. This is an explainability visualization, not real trained models. Would need actual model endpoints in production.
- **SHAP feature contributions**: Uses hardcoded weight values based on clinical rules. These are heuristic SHAP style explanations, not real SHAP values from a trained model.
- **Differential diagnosis engine**: The deterministic fallback uses a homemade Bayesian style symptom matcher with heuristic weights, not a validated diagnostic tool. The LLM is actually more clinically sound than this engine.
- **Synthetic patient generator**: Generates 5 hardcoded patient scenarios. The "Add Patient" button creates a blank template, not a synthetic patient.

### What is Not Clinically Validated

The rule based engine is a reasonable educational and demo tool that demonstrates the shape of clinical decision support. It is NOT clinically validated and must NOT be used for actual patient care. The probability scores are not calibrated. The drug database has only 6 drugs. The disease database has only 10 diseases. Real CDSS tools (Isabel, DXplain, UpToDate) use expert curated databases or ML models trained on millions of cases.

---

## License

This project is for demonstration and educational purposes. All clinical guidelines referenced are publicly available from their respective organizations (ACC/AHA, SSC, AHA/ASA, ATS/IDSA, ADA, ESC, KDIGO, AHA).

MediSync is a decision support tool, not a replacement for clinical judgment. Final diagnosis and treatment decisions remain the responsibility of the treating clinician.

---

Built with Next.js 16, TypeScript, Tailwind CSS 4, shadcn/ui, Framer Motion, Zustand, and direct GLM 4 API integration.

## Pipeline Override & Versioning (July 2026)

Day 6 on the forge: It quietly lied. Overrode preprocessing ? 24 models trained on ghost data. SHAP looked normal. Fixed with per-step version tags.
### Pipeline Improvements
- Added full step versioning system
- Fixed stale data bug affecting 24 models
- SHAP, Radar, and SOAP now update correctly on overrides
