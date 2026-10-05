/**
 * Deterministic Clinical Assertion Engine
 *
 * Implements strict clinical and Hahnemannian validation rules:
 * 1. Remedy Secrecy Rule (Zero remedy names, Latin binomials, potencies, or repertory jargon)
 * 2. Organon Aphorism 88 Compliance (Refusal to blindly confirm leading questions; must show hesitation/doubt)
 * 3. Layperson Realism (Visceral physical descriptors, zero medical diagnostic jargon)
 * 4. Mentor Evaluator JSON Schema Validation
 * 5. Withheld Modality and SBAR Handover validations
 */

import { CORE_50_POLYCHRESTS } from './clinicalTaxonomy.js';

// Compile comprehensive list of remedy names and Latin roots
const REMEDY_NAMES_BLACKLIST = new Set();
CORE_50_POLYCHRESTS.forEach((r) => {
  r.name.toLowerCase().split(/\s+/).forEach((part) => {
    if (part.length > 3) REMEDY_NAMES_BLACKLIST.add(part);
  });
  r.commonName.toLowerCase().split(/\s+/).forEach((part) => {
    if (part.length > 4 && !['water', 'salt', 'charcoal', 'nightshade'].includes(part)) {
      REMEDY_NAMES_BLACKLIST.add(part);
    }
  });
});

const POTENCY_REGEX = /\b(\d+\s*(C|CH|X|D|M|LM))\b/i;
const REPERTORY_JARGON_REGEX = /\b(amelioration|aggravation|rubric|repertory|repertoriz\w*|simillimum|miasm\w*|psoric|sycotic|syphilitic)\b/i;
const MEDICAL_DIAGNOSTIC_REGEX = /\b(gastroenteritis|hemicrania|cephalalgia|bronchospasm|neuralgia|pathognomonic|etiology)\b/i;

const LAYPERSON_VISCERAL_WORDS = [
  'burning',
  'burn',
  'splitting',
  'split',
  'tight',
  'heavy',
  'throbbing',
  'throb',
  'sharp',
  'stabbing',
  'stab',
  'shooting',
  'shoot',
  'cramping',
  'cramp',
  'aching',
  'ache',
  'stinging',
  'sting',
  'raw',
  'hurts',
  'hurt',
  'pain',
  'sore',
  'miserable',
  'sick',
  'uncomfortable',
  'trouble',
  'uneasy',
  'stone',
  'vise',
  'hammer',
  'fire',
  'bursting',
  'burst',
  'knot',
  'choke',
  'exhausted',
  'agoniz',
  'awful',
  'terrif',
  'panic',
  'nausea',
  'dizzy',
  'weak',
  'shiver',
  'spasm',
  'itch',
  'stiff'
];

const BLIND_AGREEMENT_PATTERNS = [
  /^\s*yes\b/i,
  /\byes\s*(,|!|\.)?(\s*exactly|\s*it does|\s*definitely|\s*indeed|\s*doctor|\s*that's right)\b/i,
  /\babsolutely\s*,?\s*(yes|it does|that is right)\b/i,
  /\bdefinitely\s*,?\s*(yes|it does|always)\b/i
];

const HESITATION_DOUBT_PATTERNS = [
  'not sure',
  'don\'t know',
  'hard to say',
  'haven\'t noticed',
  'haven\'t really',
  'maybe',
  'honestly',
  'wouldn\'t say',
  'wait',
  'can\'t really',
  'doubt',
  'never really thought',
  'well',
  'not necessarily',
  'doesn\'t feel like',
  'more like',
  'hard to tell',
  'i don\'t think so'
];

/**
 * Asserts the patient response does not leak remedy names, potencies, or repertory jargon.
 */
export function assertRemedySecrecy(responseText) {
  if (!responseText || typeof responseText !== 'string') {
    throw new Error('Response is empty or not a string.');
  }

  const lower = responseText.toLowerCase();

  // Check blacklist words
  for (const remedyWord of REMEDY_NAMES_BLACKLIST) {
    // Word boundary check
    const regex = new RegExp(`\\b${remedyWord}\\b`, 'i');
    if (regex.test(lower)) {
      throw new Error(
        `[REMEDY_LEAK] Response leaked forbidden remedy word "${remedyWord}" in: "${responseText}"`
      );
    }
  }

  // Check potencies
  if (POTENCY_REGEX.test(responseText)) {
    throw new Error(
      `[POTENCY_LEAK] Response leaked potency notation in: "${responseText}"`
    );
  }

  // Check repertory jargon
  const jargonMatch = responseText.match(REPERTORY_JARGON_REGEX);
  if (jargonMatch) {
    throw new Error(
      `[JARGON_LEAK] Response contained technical repertory jargon "${jargonMatch[0]}" in: "${responseText}"`
    );
  }

  return true;
}

/**
 * Asserts the patient exhibits Organon Aphorism 88 hesitation/doubt when asked a leading question.
 */
export function assertSection88LeadingTrap(responseText, leadingQuestion = '') {
  if (!responseText) {
    throw new Error('Response is empty.');
  }

  const lower = responseText.toLowerCase();

  // 1. Must NOT blindly agree
  for (const pattern of BLIND_AGREEMENT_PATTERNS) {
    if (pattern.test(responseText)) {
      throw new Error(
        `[SECTION_88_VIOLATION] Patient blindly agreed to leading question ("${leadingQuestion}"): "${responseText}"`
      );
    }
  }

  // 2. Must express hesitation, doubt, or qualification
  const hasHesitation = HESITATION_DOUBT_PATTERNS.some((h) => lower.includes(h));
  if (!hasHesitation) {
    throw new Error(
      `[SECTION_88_NO_DOUBT] Patient failed to show required hesitation/doubt when asked leading question ("${leadingQuestion}"): "${responseText}"`
    );
  }

  return true;
}

/**
 * Asserts the patient uses layperson visceral sensations and avoids medical diagnostic terms.
 */
export function assertLaypersonRealism(responseText) {
  if (!responseText) {
    throw new Error('Response is empty.');
  }

  const lower = responseText.toLowerCase();

  // Check for medical diagnostic terms
  const medMatch = responseText.match(MEDICAL_DIAGNOSTIC_REGEX);
  if (medMatch) {
    throw new Error(
      `[MEDICAL_DIAGNOSTIC_LEAK] Patient used forbidden medical diagnostic term "${medMatch[0]}": "${responseText}"`
    );
  }

  // Must contain visceral physical descriptors
  const hasVisceralWord = LAYPERSON_VISCERAL_WORDS.some((word) => lower.includes(word));
  if (!hasVisceralWord) {
    throw new Error(
      `[LACKS_LAYPERSON_VISCERAL] Patient response lacks visceral physical descriptors: "${responseText}"`
    );
  }

  return true;
}

/**
 * Asserts initial response does not dump withheld modalities or thermals.
 */
export function assertWithheldModality(responseText) {
  if (!responseText) {
    throw new Error('Response is empty.');
  }

  const lower = responseText.toLowerCase();

  // Shouldn't volunteer thermal reaction or cold draft analysis in opening statement
  if (lower.includes('my thermal reaction') || lower.includes('i am a chilly patient') || lower.includes('i am a hot patient')) {
    throw new Error(
      `[UNPROMPTED_THERMAL_LEAK] Patient volunteered formal thermal classification unprompted: "${responseText}"`
    );
  }

  return true;
}

/**
 * Asserts Senior Mentor Evaluator output adheres strictly to the required JSON schema.
 */
export function assertMentorEvaluatorJson(evalObj) {
  if (!evalObj || typeof evalObj !== 'object') {
    throw new Error('[EVALUATOR_SCHEMA] Evaluation output must be a valid JSON object.');
  }

  const {
    totalScore,
    lsmcScore,
    generalsScore,
    communicationScore,
    differentialRemedies,
    missedModalities,
    missedQuestions,
    hahnemannianCritique,
    seniorFeedback
  } = evalObj;

  // Validate Score ranges
  if (typeof totalScore !== 'number' || totalScore < 0 || totalScore > 100) {
    throw new Error(`[EVALUATOR_SCHEMA] totalScore must be a number between 0 and 100, got: ${totalScore}`);
  }
  if (typeof lsmcScore !== 'number' || lsmcScore < 0 || lsmcScore > 25) {
    throw new Error(`[EVALUATOR_SCHEMA] lsmcScore must be a number between 0 and 25, got: ${lsmcScore}`);
  }
  if (typeof generalsScore !== 'number' || generalsScore < 0 || generalsScore > 25) {
    throw new Error(`[EVALUATOR_SCHEMA] generalsScore must be a number between 0 and 25, got: ${generalsScore}`);
  }
  if (typeof communicationScore !== 'number' || communicationScore < 0 || communicationScore > 25) {
    throw new Error(`[EVALUATOR_SCHEMA] communicationScore must be a number between 0 and 25, got: ${communicationScore}`);
  }

  // Validate Differential Remedies array
  if (!Array.isArray(differentialRemedies) || differentialRemedies.length === 0) {
    throw new Error('[EVALUATOR_SCHEMA] differentialRemedies must be a non-empty array.');
  }
  for (const diff of differentialRemedies) {
    const hasName = typeof diff.name === 'string' || typeof diff.remedy === 'string';
    const hasReason = typeof diff.reason === 'string' || typeof diff.justification === 'string';
    if (!hasName || !hasReason) {
      throw new Error(`[EVALUATOR_SCHEMA] Each differential must have a name and reason, got: ${JSON.stringify(diff)}`);
    }
  }

  // Validate Missed modalities / questions
  const missedList = missedModalities || missedQuestions;
  if (!Array.isArray(missedList)) {
    throw new Error('[EVALUATOR_SCHEMA] missedModalities or missedQuestions must be an array.');
  }

  // Validate Critique string
  const critique = hahnemannianCritique || seniorFeedback;
  if (!critique || typeof critique !== 'string' || critique.trim().length < 10) {
    throw new Error('[EVALUATOR_SCHEMA] hahnemannianCritique or seniorFeedback must be a non-empty string.');
  }

  return true;
}

/**
 * Asserts 60-second SBAR assistant handover summary extraction
 */
export function assertSbarHandover(sbarData) {
  if (!sbarData) throw new Error('[SBAR_ASSERTION] SBAR handover data is missing.');

  if (typeof sbarData === 'string') {
    if (sbarData.trim().length < 20) {
      throw new Error('[SBAR_ASSERTION] SBAR summary too short.');
    }
    return true;
  }

  const { situation, background, assessment, recommendation } = sbarData;
  if (!situation || !assessment || !background || !recommendation) {
    throw new Error('[SBAR_ASSERTION] SBAR handover must contain situation, background, assessment, and recommendation.');
  }
  return true;
}
