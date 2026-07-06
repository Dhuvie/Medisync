import { analyzePatient, DEFAULT_PATIENT } from "../src/lib/medical/engine";

try {
  console.log("Testing engine...");
  const result = analyzePatient(DEFAULT_PATIENT);
  console.log("✓ analyzePatient succeeded");
  console.log(`  - Differentials: ${result.differentials.length}`);
  console.log(`  - Top: ${result.differentials[0]?.disease} (${result.differentials[0]?.probability}%)`);
  console.log(`  - Triage: ${result.triage.level} (${result.triage.score})`);
  console.log(`  - Vital analysis: ${result.vitalAnalysis.length} entries`);
  console.log(`  - Tests: ${result.recommendedTests.length}`);
  console.log(`  - Risk scores: ${result.riskScores.length}`);
  console.log(`  - Models: ${result.modelComparison.length}`);
} catch (e) {
  console.error("✗ analyzePatient failed:", e);
}
