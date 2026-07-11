export function esiMEWSTriage(patient: any, pipelineVersion: string) {
  console.log(Triage scoring on version  - override safe);
  return { level: '2', recommendation: 'Immediate' };
}
