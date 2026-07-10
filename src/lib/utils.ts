import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function triggerPipelineReexecution(stepId: string) {
  console.log(`[Override] Triggered re-execution for step: ${stepId}`);
  // TODO: invalidate downstream
}
console.log("Override propagation active");// Override wiring - significant integration
export function triggerPipelineReexecution(stepId: string) {
  console.log([CRITICAL OVERRIDE] Step  modified. Invalidating entire downstream pipeline.);
  localStorage.setItem('lastOverrideTime', Date.now().toString());
}
// BUG: overrides not invalidating downstream - 24 models ran stale
console.log('[BUG 2026-07-10] Vitals preprocessing override did not propagate');
export function clearCacheOnOverride() {
  localStorage.clear();
  console.log('Full cache purge executed due to override - day 6 debug');
}
