function repairLLMJSON(json: string): string {
  let repaired = json;
  repaired = repaired.replace(/"(\w+)\[/g, '"$1":[');
  repaired = repaired.replace(/"(\w+)\{/g, '"$1":{');
  repaired = repaired.replace(/"(\w+)"(\s*)([\[\{])/g, '"$1"$2:$3');
  repaired = repaired.replace(/'/g, '"');
  repaired = repaired.replace(/,(\s*[}\]])/g, "$1");
  return repaired;
}

function parseJSONResponse(raw: string): any | null {
  let cleaned = raw.trim();
  const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]+?)```/i);
  if (codeBlockMatch) {
    cleaned = codeBlockMatch[1].trim();
  } else {
    const openBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]+)/i);
    if (openBlockMatch) {
      cleaned = openBlockMatch[1].trim();
    }
  }
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }
  try { return JSON.parse(cleaned); } catch (e) {
    console.log("Direct parse failed:", (e as Error).message);
  }
  const repaired = repairLLMJSON(cleaned);
  try { return JSON.parse(repaired); } catch (e) {
    console.log("Repair parse failed:", (e as Error).message);
    console.log("Repaired (first 200):", repaired.slice(0, 200));
  }
  const noTrailingCommas = repaired.replace(/,(\s*[}\]])/g, "$1");
  try { return JSON.parse(noTrailingCommas); } catch (e) {
    console.log("No-trailing-comma parse failed:", (e as Error).message);
  }
  return null;
}

// Exact raw response from dev log (Sarah Johnson case)
const raw = '```json\n{"differentials":[{"disease":"Acute Coronary Syndrome","icd10":"I21.9","probability":65,"confidence":75,"reasoning":"Chest pain in elderly male with normal troponin but other cardiac risk factors absent","keyEvidence":["Chest pain","72 years old","Normal troponin","No clear ECG changes mentioned"],"redFlags":["Elevated troponin","ST-segment changes on ECG","Significant cardiac risk factors"],"recommendedTests":["Serial troponins","12-lead ECG","Stress testing"]},{"disease":"Pneumonia","icd10":"J18.9","probability":45,"confidence":65,"reasoning":"Fever and chest pain could suggest pulmonary infection despite normal vitals","keyEvidence":["Chest pain","Fever","Normal WBC count","No respiratory symptoms mentioned"],"redFlags":["Cough","Sputum production","Pulmonary consolidation on imaging"],"recommendedTests":["Chest X-ray","Blood cultures","Sputum culture"]}]}\n```';

console.log("=== Test with EXACT raw response ===");
console.log("Raw length:", raw.length);
const result = parseJSONResponse(raw);
console.log("Result:", result ? "SUCCESS" : "FAILED");
if (result) {
  console.log("Differentials:", result.differentials?.length);
}
