export class PipelineManager {
  private versions = new Map();

  applyOverride(stepId: string, newConfig: any) {
    const newVersion = this.computeVersion(stepId, newConfig);
    this.versions.set(stepId, newVersion);
    console.log([MAJOR OVERRIDE]  updated to version . Invalidating downstream.);
    this.invalidateDownstream(stepId);
  }

  private computeVersion(stepId: string, config: any) {
    return btoa(JSON.stringify({stepId, config})).slice(0, 32);
  }

  private invalidateDownstream(stepId: string) {
    console.log('Invalidating SHAP, VitalsRadar, MEWS, SOAP due to override');
  }
}
