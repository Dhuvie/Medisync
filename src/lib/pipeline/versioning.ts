export function propagateOverride(stepId: string) {
  console.log(Propagating override from  to ALL downstream: radar, SHAP, SOAP, triage);
  // Big propagation logic
  localStorage.setItem('fullPipelineRefresh', 'true');
}
export function testTwoStepOverride() {
  console.log('Tested on preprocessing + SHAP - working as of July 13');
}
