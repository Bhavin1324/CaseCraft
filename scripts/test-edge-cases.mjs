#!/usr/bin/env node
/**
 * Edge-Case Verification Suite for CaseCraft
 * Tests structural integrity, anti-spoiler compliance, offline heuristics,
 * prompt generators, and boundary edge cases.
 */

import { SCENARIOS } from '../src/data/curatedScenarios.js';
import { generateLocalHeuristicResponse } from '../src/services/geminiService.js';
import { getPatientSystemPrompt, getCaseGeneratorPrompt, getEvaluatorSystemPrompt } from '../src/services/prompts.js';

let passedTests = 0;
let totalTests = 0;
const failures = [];

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    failures.push({ testName, details });
    console.error(`  ❌ [FAIL] ${testName} - ${details}`);
  }
}

console.log('\n========================================================================');
console.log('🧪 CASECRAFT EDGE-CASE VERIFICATION SUITE');
console.log('========================================================================\n');

// ========================================================================
// SUITE 1: CURATED SCENARIOS DATASET INTEGRITY & TAXONOMY
// ========================================================================
console.log('--- SUITE 1: Curated Scenarios Dataset Integrity ---');

// 1.1: Total scenarios count
assert(Array.isArray(SCENARIOS) && SCENARIOS.length === 14, 'Total scenarios count is exactly 14', `Received: ${SCENARIOS.length}`);

// 1.2: Acute vs Chronic balance
const acuteList = SCENARIOS.filter((s) => s.timelineType === 'acute' || s.difficulty?.toLowerCase().includes('acute'));
const chronicList = SCENARIOS.filter((s) => s.timelineType === 'chronic' || s.difficulty?.toLowerCase().includes('chronic'));
assert(acuteList.length === 7, 'Exactly 7 Acute Clinical Cases', `Received: ${acuteList.length}`);
assert(chronicList.length === 7, 'Exactly 7 Chronic Miasmatic Cases', `Received: ${chronicList.length}`);

// 1.3: Unique IDs and slug formatting
const idSet = new Set();
let allIdsUnique = true;
let allIdsValidSlugs = true;
for (const s of SCENARIOS) {
  if (idSet.has(s.id)) allIdsUnique = false;
  idSet.add(s.id);
  if (!/^[a-z0-9-]+$/.test(s.id)) allIdsValidSlugs = false;
}
assert(allIdsUnique, 'All 14 scenario IDs are unique');
assert(allIdsValidSlugs, 'All scenario IDs are clean kebab-case slugs');

// 1.4: Backward compatibility with original 4 baseline IDs
const requiredBaselineIds = [
  'nux-vomica-acute',
  'natrum-mur-migraine',
  'chamomilla-pediatric',
  'arsenicum-anxiety'
];
for (const reqId of requiredBaselineIds) {
  const match = SCENARIOS.find((s) => s.id === reqId);
  assert(Boolean(match), `Baseline scenario preserved: ${reqId}`);
}

// 1.5: Schema completeness for all 14 scenarios
const requiredFields = [
  'id', 'timelineType', 'title', 'archetype', 'difficulty',
  'patientName', 'chiefComplaint', 'openingStatement',
  'persona', 'hints', 'expectedTotality', 'indicatedRemedy'
];
let schemaValid = true;
for (const s of SCENARIOS) {
  for (const field of requiredFields) {
    if (!s[field]) {
      schemaValid = false;
      console.error(`Missing field "${field}" in scenario ID: ${s.id}`);
    }
  }
}
assert(schemaValid, 'All 14 scenarios contain all required schema fields');

// 1.6: Completeness of hiddenTruths
let hiddenTruthsValid = true;
for (const s of SCENARIOS) {
  const ht = s.persona?.hiddenTruths;
  if (!ht || !ht.sensation || !ht.thermal || !ht.thirst || !ht.cravings || !ht.modalities?.agg || !ht.modalities?.amel || !ht.mind) {
    hiddenTruthsValid = false;
    console.error(`Incomplete hiddenTruths in scenario ID: ${s.id}`);
  }
}
assert(hiddenTruthsValid, 'All 14 scenarios have complete hidden clinical truths (sensation, thermal, thirst, cravings, agg, amel, mind)');

// 1.7: Anti-spoiler verification: Titles must not leak remedy names
const FORBIDDEN_TITLE_TERMS = [
  'nux vomica', 'natrum mur', 'chamomilla', 'arsenicum',
  'belladonna', 'aconite', 'aconitum', 'sulphur',
  'sepia', 'bryonia', 'hepar sulph', 'cantharis', 'rhus tox', 'calc carb'
];
let titlesFreeOfSpoilers = true;
for (const s of SCENARIOS) {
  const titleLower = s.title.toLowerCase();
  for (const term of FORBIDDEN_TITLE_TERMS) {
    if (titleLower.includes(term)) {
      titlesFreeOfSpoilers = false;
      console.error(`Title leaks remedy name "${term}": "${s.title}" in ID: ${s.id}`);
    }
  }
}
assert(titlesFreeOfSpoilers, 'All 14 scenario titles are free of remedy name giveaways');

// 1.8: No section symbols in entire dataset
let hasSectionSymbol = false;
for (const s of SCENARIOS) {
  const jsonStr = JSON.stringify(s);
  if (jsonStr.includes('\u00A7')) {
    hasSectionSymbol = true;
  }
}
assert(!hasSectionSymbol, 'Zero occurrences of section symbol (\\u00A7) in curated scenarios');


// ========================================================================
// SUITE 2: LOCAL HEURISTIC RESPONSE ENGINE EDGE CASES
// ========================================================================
console.log('\n--- SUITE 2: Local Heuristic Response Engine Robustness ---');

// 2.1: Null / Undefined / Empty Inputs
assert(typeof generateLocalHeuristicResponse(null, null) === 'string', 'Handles null scenario and null query without throwing');
assert(typeof generateLocalHeuristicResponse(undefined, undefined) === 'string', 'Handles undefined scenario and query without throwing');
assert(typeof generateLocalHeuristicResponse({}, '') === 'string', 'Handles empty scenario object and empty query string');

// 2.2: Partial / Malformed Scenarios
const malformedScenario1 = { id: 'test-case' }; // no persona, no hiddenTruths
const resMalformed1 = generateLocalHeuristicResponse(malformedScenario1, 'Are you chilly?');
assert(typeof resMalformed1 === 'string' && resMalformed1.length > 0, 'Handles scenario missing persona and hiddenTruths gracefully');

const malformedScenario2 = { id: 'test-case', persona: {} };
const resMalformed2 = generateLocalHeuristicResponse(malformedScenario2, 'How is your thirst?');
assert(typeof resMalformed2 === 'string' && resMalformed2.length > 0, 'Handles scenario with empty persona gracefully');

// 2.3: Unrecognized / Gibberish Queries
const testScenario = SCENARIOS[0];
const gibberishReplies = [
  generateLocalHeuristicResponse(testScenario, 'xyz123!@#'),
  generateLocalHeuristicResponse(testScenario, 'what is python code?'),
  generateLocalHeuristicResponse(testScenario, 'tell me a joke')
];
let allGibberishSafe = true;
for (const rep of gibberishReplies) {
  if (!rep || rep.includes('undefined') || rep.includes('null')) allGibberishSafe = false;
}
assert(allGibberishSafe, 'Gibberish / non-medical queries return safe fallback patient responses');

// 2.4: Extreme casing and punctuation
const loudQueryReply = generateLocalHeuristicResponse(testScenario, 'WHAT ABOUT YOUR THERMAL WEATHER REACTION???');
assert(loudQueryReply.toLowerCase().includes('draft') || loudQueryReply.toLowerCase().includes('chilly') || loudQueryReply.toLowerCase().includes('weather'), 'Loud uppercase query correctly triggers thermal heuristic');

const spacedQueryReply = generateLocalHeuristicResponse(testScenario, '    wATer    ThIrSt    ');
assert(spacedQueryReply.toLowerCase().includes('water') || spacedQueryReply.toLowerCase().includes('drink') || spacedQueryReply.toLowerCase().includes('tea'), 'Spaced mixed-case query correctly triggers thirst heuristic');

// 2.5: Matrix test across ALL 14 scenarios
const QUERY_CATEGORIES = [
  { name: 'Thermal', query: 'Do you feel chilly or hot?' },
  { name: 'Thirst', query: 'How is your thirst for water?' },
  { name: 'Cravings', query: 'What food do you crave or dislike?' },
  { name: 'Aggravation', query: 'When are your symptoms worse?' },
  { name: 'Amelioration', query: 'What makes you feel better?' },
  { name: 'Sensation', query: 'Can you describe the exact pain sensation?' },
  { name: 'Bowels', query: 'How are your bowel motions and digestion?' },
  { name: 'Mind', query: 'How does this affect your mood and stress?' }
];

let matrixAllAnswered = true;
let matrixNoUndefined = true;

for (const sc of SCENARIOS) {
  for (const cat of QUERY_CATEGORIES) {
    const reply = generateLocalHeuristicResponse(sc, cat.query);
    if (!reply || reply.trim().length === 0) {
      matrixAllAnswered = false;
      console.error(`Empty reply for scenario ${sc.id} on category ${cat.name}`);
    }
    if (reply.includes('undefined') || reply.includes('null')) {
      matrixNoUndefined = false;
      console.error(`"undefined" found in reply for scenario ${sc.id} on category ${cat.name}: "${reply}"`);
    }
  }
}
assert(matrixAllAnswered, 'All 14 scenarios return non-empty responses across all 8 inquiry categories (112 test permutations)');
assert(matrixNoUndefined, 'No "undefined" or "null" substrings in any of the 112 inquiry responses');

// 2.6: Remedy secrecy verification in heuristic responses
let leakedRemedy = false;
for (const sc of SCENARIOS) {
  for (const cat of QUERY_CATEGORIES) {
    const reply = generateLocalHeuristicResponse(sc, cat.query);
    const lower = reply.toLowerCase();
    for (const forbidden of ['nux vomica', 'natrum mur', 'belladonna', 'aconite', 'cantharis', 'rhus tox', 'sulphur', 'sepia', 'bryonia', 'chamomilla']) {
      if (lower.includes(forbidden)) {
        leakedRemedy = true;
        console.error(`Leaked remedy "${forbidden}" in reply for ${sc.id}`);
      }
    }
  }
}
assert(!leakedRemedy, 'Zero remedy names leaked in local heuristic responses across all 112 inquiries');


// ========================================================================
// SUITE 3: PROMPT GENERATION ROBUSTNESS & EDGE CASES
// ========================================================================
console.log('\n--- SUITE 3: Prompt Generation Robustness ---');

// 3.1: Null / Undefined Scenario in getPatientSystemPrompt
const promptFromNull = getPatientSystemPrompt(null);
assert(typeof promptFromNull === 'string' && promptFromNull.includes('Patient'), 'getPatientSystemPrompt handles null safely');

const promptFromEmpty = getPatientSystemPrompt({});
assert(typeof promptFromEmpty === 'string' && promptFromEmpty.includes('PATIENT PROFILE:'), 'getPatientSystemPrompt handles empty object safely');

// 3.2: Root hiddenTruths vs Nested persona.hiddenTruths
const rootTruthsScenario = {
  patientName: 'Test Patient',
  chiefComplaint: 'Test Complaint',
  hiddenTruths: {
    thermal: 'Extreme heat sensitivity',
    sensation: 'Throbbing pressure'
  }
};
const promptRoot = getPatientSystemPrompt(rootTruthsScenario);
assert(promptRoot.includes('Extreme heat sensitivity'), 'Resolves hiddenTruths placed directly at root level');

const nestedTruthsScenario = {
  patientName: 'Test Patient',
  chiefComplaint: 'Test Complaint',
  persona: {
    hiddenTruths: {
      thermal: 'Extreme draft chilliness',
      sensation: 'Stitching agony'
    }
  }
};
const promptNested = getPatientSystemPrompt(nestedTruthsScenario);
assert(promptNested.includes('Extreme draft chilliness'), 'Resolves hiddenTruths placed inside persona');

// 3.3: Verify all 10 critical rules in system prompt
for (let ruleNum = 1; ruleNum <= 10; ruleNum++) {
  assert(promptNested.includes(`${ruleNum}.`), `Rule ${ruleNum} present in patient system prompt`);
}
assert(promptNested.includes('NO DRUG CARICATURES'), 'Anti-caricature rule is present in patient system prompt');

// 3.4: Dynamic case generator prompt boundary tests
const genPromptNormal = getCaseGeneratorPrompt('Dermatological', 'Advanced - Hard');
assert(genPromptNormal.includes('CRITICAL ANTI-SPOILER REQUIREMENTS:'), 'Case generator prompt includes anti-spoiler instructions');
assert(genPromptNormal.includes('timelineType'), 'Case generator prompt includes timelineType in schema');

const genPromptEmpty = getCaseGeneratorPrompt('', '');
assert(typeof genPromptEmpty === 'string' && genPromptEmpty.includes('Respond with ONLY valid JSON'), 'Case generator prompt handles empty args safely');

// 3.5: Section symbol check across prompts
assert(!promptNested.includes('\u00A7'), 'Zero section symbols (\\u00A7) in getPatientSystemPrompt output');
assert(!genPromptNormal.includes('\u00A7'), 'Zero section symbols (\\u00A7) in getCaseGeneratorPrompt output');


// ========================================================================
// SUITE 4: UI DATA FILTERING & DERIVATION LOGIC
// ========================================================================
console.log('\n--- SUITE 4: UI Data Filtering & Derivation Logic ---');

// 4.1: Simulated PatientSidebar optgroup filtering
function filterSidebarCases(list) {
  const acute = (list || []).filter((s) => s.timelineType === 'acute' || s.difficulty?.toLowerCase().includes('acute'));
  const chronic = (list || []).filter((s) => !acute.includes(s));
  return { acute, chronic };
}

const sidebarEmpty = filterSidebarCases([]);
assert(sidebarEmpty.acute.length === 0 && sidebarEmpty.chronic.length === 0, 'Sidebar filtering handles empty list cleanly');

const sidebarNull = filterSidebarCases(null);
assert(sidebarNull.acute.length === 0 && sidebarNull.chronic.length === 0, 'Sidebar filtering handles null list cleanly');

const sidebarReal = filterSidebarCases(SCENARIOS);
assert(sidebarReal.acute.length === 7 && sidebarReal.chronic.length === 7, 'Sidebar filtering partitions all 14 scenarios into 7 acute and 7 chronic');

// 4.2: Simulated CaseGeneratorModal segmented filtering
function filterModalCurated(list, filter) {
  return (list || []).filter((s) => {
    const isAcute = s.timelineType === 'acute' || s.difficulty?.toLowerCase().includes('acute');
    if (filter === 'acute') return isAcute;
    if (filter === 'chronic') return !isAcute;
    return true;
  });
}

assert(filterModalCurated(SCENARIOS, 'all').length === 14, 'Modal filter "all" returns 14 scenarios');
assert(filterModalCurated(SCENARIOS, 'acute').length === 7, 'Modal filter "acute" returns 7 scenarios');
assert(filterModalCurated(SCENARIOS, 'chronic').length === 7, 'Modal filter "chronic" returns 7 scenarios');
assert(filterModalCurated(null, 'all').length === 0, 'Modal filter handles null scenario list cleanly');


// ========================================================================
// SUITE 5: EVALUATOR SCHEMA & TRANSCRIPT RESILIENCE
// ========================================================================
console.log('\n--- SUITE 5: Evaluator Schema & Transcript Resilience ---');

const mockTranscript = 'Doctor: "Tell me what troubles you."\nPatient: "Severe acidity after eating."';
const evalPromptNormal = getEvaluatorSystemPrompt(SCENARIOS[0], mockTranscript, 'Notes: chilly, warm sips');
assert(typeof evalPromptNormal === 'string' && evalPromptNormal.includes('BENCHMARK PATIENT CASE:'), 'Evaluator prompt generates cleanly from curated scenario');

// Evaluator with minimal/empty scenario
const evalPromptMinimal = getEvaluatorSystemPrompt({ title: 'Minimal Case', patientName: 'Jane Doe', chiefComplaint: 'Pain' }, '', '');
assert(typeof evalPromptMinimal === 'string' && evalPromptMinimal.includes('Jane Doe'), 'Evaluator prompt handles minimal scenario and empty notes');


// ========================================================================
// FINAL SUMMARY
// ========================================================================
console.log('\n========================================================================');
console.log('🏁 EDGE-CASE SUITE RESULTS');
console.log('========================================================================');
console.log(`• Total Tests Executed: ${totalTests}`);
console.log(`• Passed:               ${passedTests} / ${totalTests} (${((passedTests / totalTests) * 100).toFixed(1)}%)`);
console.log(`• Failures:             ${failures.length}`);
console.log('========================================================================\n');

if (failures.length > 0) {
  console.error('💥 Failures detected:');
  for (const f of failures) {
    console.error(`- ${f.testName}: ${f.details}`);
  }
  process.exit(1);
} else {
  console.log('🎉 ALL EDGE CASES PASSED WITH 100% SUCCESS!\n');
  process.exit(0);
}
