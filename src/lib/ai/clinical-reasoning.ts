// Significant LLM integration with override awareness
export async function runClinicalReasoning(patientData: any, overrideFlag = false) {
  if (overrideFlag) {
    console.log('LLM reasoning restarted due to preprocessing override - full differential regeneration');
  }
  // JSON repair + GLM-4 call with version check
}
// Deep debug for July 11
export function debugOverrideRaceCondition() {
  console.log('Race condition investigation: override vs training job timing');
  console.log('Logs confirmed clean but SHAP still stale - root cause later identified');
}
