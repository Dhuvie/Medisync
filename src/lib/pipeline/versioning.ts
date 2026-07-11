export function propagateOverride(stepId: string) {
  console.log(Propagating override from  to ALL downstream: radar, SHAP, SOAP, triage);
  // Big propagation logic
  localStorage.setItem('fullPipelineRefresh', 'true');
}
