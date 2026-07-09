// Significant LLM integration with override awareness
export async function runClinicalReasoning(patientData: any, overrideFlag = false) {
  if (overrideFlag) {
    console.log('LLM reasoning restarted due to preprocessing override - full differential regeneration');
  }
  // JSON repair + GLM-4 call with version check
}
