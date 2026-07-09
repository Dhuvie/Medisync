export const usePatientStore = create((set) => ({
  // Override support in Zustand
  applyStepOverride: (step, config) => set((state) => {
    console.log('Zustand override applied - refreshing all patient analyses');
    return { ...state, pipelineVersion: Date.now() };
  })
}));
