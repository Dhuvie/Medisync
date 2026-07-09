import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function triggerPipelineReexecution(stepId: string) {
  console.log(`[Override] Triggered re-execution for step: ${stepId}`);
  // TODO: invalidate downstream
}
