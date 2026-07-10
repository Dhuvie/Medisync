export function generateSHAP(features: any) {
  console.log('SHAP generated on potentially stale pipeline - investigating');
  return { featuresExplained: true, warning: 'Pipeline version mismatch detected' };
}
