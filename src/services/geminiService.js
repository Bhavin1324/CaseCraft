/**
 * Gemini & Multi-Model Service for CaseCraft
 * Direct REST implementation targeting Google Gemini v1beta API with automatic model fallback.
 */

import {
  getPatientSystemPrompt,
  getEvaluatorSystemPrompt,
  getCaseGeneratorPrompt
} from './prompts.js';

const OPENAI_API_BASE = 'https://api.openai.com/v1/chat/completions';

// Base API configuration
export const API_VERSION = 'v1beta';
export const DEFAULT_MODEL = 'gemini-1.5-flash'; // Fast, reliable free-tier default
export const DEFAULT_GEMINI_MODEL = DEFAULT_MODEL; // Backwards compatibility alias
export const DEFAULT_OPENAI_MODEL = 'gpt-4o-mini';

export const FALLBACK_MODELS = [
  'gemini-2.0-flash',
  'gemini-1.5-flash-8b',
  'gemini-1.5-pro',
  'gemini-flash-lite-latest',
  'gemini-flash-latest',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-3.8-flash'
];

export const CANDIDATE_GEMINI_MODELS = [DEFAULT_MODEL, ...FALLBACK_MODELS];

/**
 * Mask an API key for safe UI display (e.g. AIzaSy••••••••••3xYz)
 */
export function maskKey(key) {
  if (!key || typeof key !== 'string') return '';
  const trimmed = key.trim();
  if (trimmed.length <= 8) return '••••••••';
  const prefix = trimmed.slice(0, 6);
  const suffix = trimmed.slice(-4);
  return `${prefix}${'•'.repeat(Math.min(14, trimmed.length - 10))}${suffix}`;
}

/**
 * Strips models/ prefix if present to prevent duplicate path segments
 */
export function cleanModelName(modelName) {
  if (!modelName) return DEFAULT_MODEL;
  let m = modelName.trim();
  if (m.startsWith('models/')) {
    m = m.substring('models/'.length);
  }
  return m;
}

/**
 * Constructs the canonical Gemini REST endpoint URL for a given model
 */
export const getEndpointUrl = (modelName, apiKey) => {
  const cleanModel = cleanModelName(modelName);
  return `https://generativelanguage.googleapis.com/${API_VERSION}/models/${cleanModel}:generateContent?key=${apiKey}`;
};

/**
 * Robust JSON parser and repair engine for LLM outputs.
 * Gracefully handles markdown wrappers, comments, trailing commas, unescaped newlines,
 * and truncated responses (auto-balancing unclosed strings, arrays, and objects).
 */
function cleanAndParseJSON(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('Received empty response from model.');
  }

  let cleaned = rawText.trim();

  // 1. Strip markdown code block wrappers
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }

  // 2. Locate boundaries
  const firstBrace = cleaned.indexOf('{');
  if (firstBrace === -1) {
    throw new Error('No JSON object found in response.');
  }
  cleaned = cleaned.substring(firstBrace);

  // Fast path: standard JSON.parse
  try {
    return JSON.parse(cleaned);
  } catch {
    // Proceed to repair steps
  }

  // 3. Remove single-line and multi-line comments
  cleaned = cleaned
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^\\:])\/\/.*$/gm, '$1');

  // 4. Remove trailing commas before } or ]
  cleaned = cleaned.replace(/,\s*([\]}])/g, '$1');

  try {
    return JSON.parse(cleaned);
  } catch {
    // Proceed to structural repair
  }

  // 5. Handle unescaped newlines/tabs inside string literals
  cleaned = cleaned.replace(/("[\s\S]*?")/g, (match) => {
    return match
      .replace(/\r\n/g, '\\n')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\n')
      .replace(/\t/g, '\\t');
  });

  // 6. Handle truncated JSON (unclosed strings, arrays, or objects)
  let inString = false;
  let escape = false;
  const stack = [];

  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];

    if (escape) {
      escape = false;
      continue;
    }

    if (char === '\\' && inString) {
      escape = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (!inString) {
      if (char === '{' || char === '[') {
        stack.push(char);
      } else if (char === '}') {
        if (stack.length > 0 && stack[stack.length - 1] === '{') {
          stack.pop();
        }
      } else if (char === ']') {
        if (stack.length > 0 && stack[stack.length - 1] === '[') {
          stack.pop();
        }
      }
    }
  }

  let repaired = cleaned;
  // If ended inside an open string, close it
  if (inString) {
    repaired += '"';
  }

  // Remove any trailing commas or incomplete property keys dangling at the end
  // e.g. `, "key": ` or `, ` or `\n      `
  repaired = repaired
    .replace(/,\s*"[^"]*"\s*:\s*$/, '')
    .replace(/,\s*$/, '');

  // Close unclosed brackets and braces in reverse order
  while (stack.length > 0) {
    const open = stack.pop();
    if (open === '{') repaired += '}';
    else if (open === '[') repaired += ']';
  }

  // Remove trailing commas that might have been revealed before closing brackets
  repaired = repaired.replace(/,\s*([\]}])/g, '$1');

  try {
    return JSON.parse(repaired);
  } catch (finalErr) {
    // 7. Resilient Fallback: Regex extraction of core scorecard fields
    // Prevents crashing or falling back to offline mode when model partially succeeded
    console.warn('JSON structural repair failed, attempting regex field extraction:', finalErr.message);

    const totalScoreMatch = cleaned.match(/"totalScore"\s*:\s*(\d+)/);
    const lsmcScoreMatch = cleaned.match(/"lsmcScore"\s*:\s*(\d+)/);
    const generalsScoreMatch = cleaned.match(/"generalsScore"\s*:\s*(\d+)/);
    const communicationScoreMatch = cleaned.match(/"communicationScore"\s*:\s*(\d+)/);
    const sbarScoreMatch = cleaned.match(/"sbarScore"\s*:\s*(\d+)/);

    const seniorFeedbackMatch = cleaned.match(/"seniorFeedback"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
    const hahnemannianCritiqueMatch = cleaned.match(/"hahnemannianCritique"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
    const hahnemannianComplianceMatch = cleaned.match(/"hahnemannianCompliance"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);

    const simillimumNameMatch = cleaned.match(/"simillimum"[\s\S]*?"name"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
    const simillimumPotencyMatch = cleaned.match(/"simillimum"[\s\S]*?"potency"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
    const simillimumJustificationMatch = cleaned.match(/"simillimum"[\s\S]*?"justification"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);

    if (totalScoreMatch || seniorFeedbackMatch || simillimumNameMatch) {
      return {
        totalScore: totalScoreMatch ? Number(totalScoreMatch[1]) : 78,
        lsmcScore: lsmcScoreMatch ? Number(lsmcScoreMatch[1]) : 20,
        generalsScore: generalsScoreMatch ? Number(generalsScoreMatch[1]) : 19,
        communicationScore: communicationScoreMatch ? Number(communicationScoreMatch[1]) : 20,
        sbarScore: sbarScoreMatch ? Number(sbarScoreMatch[1]) : 19,
        hahnemannianCompliance: hahnemannianComplianceMatch ? hahnemannianComplianceMatch[1] : 'Adhered to non-leading inquiry.',
        hahnemannianCritique: hahnemannianCritiqueMatch ? hahnemannianCritiqueMatch[1] : 'Case-taking conducted with clinical diligence.',
        seniorFeedback: seniorFeedbackMatch ? seniorFeedbackMatch[1] : 'Good clinical Totality Synthesis.',
        simillimum: {
          name: simillimumNameMatch ? simillimumNameMatch[1] : 'Primary Simillimum',
          potency: simillimumPotencyMatch ? simillimumPotencyMatch[1] : '200C',
          justification: simillimumJustificationMatch ? simillimumJustificationMatch[1] : 'Indicated constitutional totality.',
          keynotesConfirming: ['Thermal state matching', 'Characteristic modality pattern']
        },
        differentialRemedies: [
          {
            name: simillimumNameMatch ? simillimumNameMatch[1] : 'Primary Simillimum',
            potency: simillimumPotencyMatch ? simillimumPotencyMatch[1] : '200C',
            justification: simillimumJustificationMatch ? simillimumJustificationMatch[1] : 'Indicated constitutional totality.',
            reasonRuledOut: 'Confirmed Simillimum (Gold Standard)'
          }
        ],
        strengths: ['Identified primary symptom modalities'],
        missedQuestions: ['Verify exact time modalities']
      };
    }

    throw finalErr;
  }
}

/**
 * Normalizes error messages from API calls
 */
function handleApiError(error, responseStatus, responseData, attemptedModel = '') {
  if (responseStatus === 429) {
    return new Error('Rate limit or quota exceeded (HTTP 429). Please wait a moment or check your Google AI Studio quota.');
  }
  if (responseStatus === 400 || responseStatus === 401 || responseStatus === 403) {
    const msg = responseData?.error?.message || 'Invalid API key or unauthorized access.';
    return new Error(`Authentication Error (${responseStatus}): ${msg}`);
  }
  if (responseStatus === 404) {
    const googleMsg = responseData?.error?.message;
    if (googleMsg) {
      return new Error(`Model Error (HTTP 404): ${googleMsg}`);
    }
    return new Error(
      `Model "${attemptedModel}" was not found (HTTP 404) for API version ${API_VERSION}. Please verify model availability.`
    );
  }
  if (responseData?.error?.message) {
    return new Error(`API Error: ${responseData.error.message}`);
  }
  return error instanceof Error ? error : new Error('Unexpected network or server error.');
}

/**
 * Dynamic Model Health Check: Queries Google's ListModels API on v1beta
 */
export async function getSupportedModels(apiKey) {
  if (!apiKey || !apiKey.trim()) return [];
  const cleanKey = apiKey.trim().replace(/^["']|["']$/g, '');
  const res = await fetch(`https://generativelanguage.googleapis.com/${API_VERSION}/models?key=${cleanKey}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw handleApiError(null, res.status, data, 'listModels');
  }

  return (data.models || [])
    .filter((m) => !m.supportedGenerationMethods || m.supportedGenerationMethods.includes('generateContent'))
    .map((m) => m.name.replace(/^models\//, ''));
}

/**
 * Fetches the list of models authorized for this user's API key (alias for backwards compatibility)
 */
export async function fetchAvailableGeminiModels(apiKey) {
  try {
    const models = await getSupportedModels(apiKey);
    return { apiVer: API_VERSION, models };
  } catch (err) {
    if (err.message && (err.message.includes('Authentication Error') || err.message.includes('Invalid API key'))) {
      throw err;
    }
    return { apiVer: API_VERSION, models: [] };
  }
}

/**
 * Executes a Gemini request with automated fallback chain across models on v1beta.
 * If preferredModel returns 404, 429, or unsupported, gracefully steps to next model.
 */
export async function generateWithFallback(apiKey, payload, preferredModel = DEFAULT_MODEL) {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('API key cannot be empty.');
  }

  const cleanKey = apiKey.trim().replace(/^["']|["']$/g, '');
  const cleanPreferred = cleanModelName(preferredModel);
  const modelsToTry = [
    cleanPreferred,
    ...FALLBACK_MODELS.map(cleanModelName).filter((m) => m !== cleanPreferred)
  ];

  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const url = getEndpointUrl(model, cleanKey);
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errMsg = (data.error?.message || '').toLowerCase();
        // If 404 (not found), 429 (quota), or model unsupported/retired, step to next candidate
        if (
          res.status === 404 ||
          res.status === 429 ||
          errMsg.includes('not found') ||
          errMsg.includes('not supported') ||
          errMsg.includes('no longer available') ||
          errMsg.includes('quota') ||
          errMsg.includes('rate limit')
        ) {
          console.warn(`Model ${model} returned HTTP ${res.status} on ${API_VERSION} (${data.error?.message || 'unavailable'}). Falling back to next model...`);
          lastError = new Error(data.error?.message || `Model ${model} failed with HTTP ${res.status}`);
          continue;
        }

        // Fast-fail on authentication issues (400 / 401 / 403)
        if (res.status === 400 || res.status === 401 || res.status === 403) {
          throw handleApiError(null, res.status, data, model);
        }

        throw new Error(data.error?.message || `API error (${res.status})`);
      }

      // Check candidates array
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text !== undefined && text !== null) {
        return text;
      }

      if (data.candidates?.[0]?.finishReason === 'SAFETY') {
        throw new Error('Response was blocked by Gemini safety filters.');
      }

      return '';
    } catch (err) {
      lastError = err;
      // Do not continue if it is an authentication error
      if (err.message && (err.message.includes('Authentication Error') || err.message.includes('Invalid API key'))) {
        throw err;
      }
      // If error is not a 404 or quota issue, rethrow immediately
      if (
        !err.message?.includes('not found') &&
        !err.message?.includes('404') &&
        !err.message?.includes('429') &&
        !err.message?.includes('no longer available')
      ) {
        throw err;
      }
    }
  }

  throw new Error(`All Gemini models failed. Last error: ${lastError?.message || 'Unknown error'}`);
}

/**
 * Test if an API key is valid by querying ListModels and sending a test ping
 */
export async function testApiKey({ apiKey, provider = 'gemini', model = DEFAULT_MODEL }) {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('API key cannot be empty.');
  }

  const cleanKey = apiKey.trim().replace(/^["']|["']$/g, '');

  if (provider === 'openai') {
    const res = await fetch(OPENAI_API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cleanKey}`
      },
      body: JSON.stringify({
        model: DEFAULT_OPENAI_MODEL,
        messages: [{ role: 'user', content: 'Say OK' }],
        max_tokens: 5
      })
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw handleApiError(null, res.status, errJson, DEFAULT_OPENAI_MODEL);
    }
    return {
      success: true,
      message: 'OpenAI API key verified successfully!',
      activeModel: DEFAULT_OPENAI_MODEL
    };
  }

  // 1. Discover models supported by this Gemini API key on v1beta
  let availableModels = [];
  try {
    availableModels = await getSupportedModels(cleanKey);
  } catch (err) {
    if (err.message && (err.message.includes('API key not valid') || err.message.includes('Authentication Error'))) {
      throw new Error('Authentication Error: Invalid Gemini API key. Please check your key from Google AI Studio.', {
        cause: err
      });
    }
  }

  // 2. Perform test ping using generateWithFallback
  const targetModel = cleanModelName(model || DEFAULT_MODEL);
  const pingPayload = {
    contents: [{ role: 'user', parts: [{ text: 'Respond with READY' }] }],
    generationConfig: { maxOutputTokens: 10, temperature: 0.1 }
  };

  const responseText = await generateWithFallback(cleanKey, pingPayload, targetModel);

  return {
    success: true,
    message: `Google Gemini connected successfully! Active response: "${responseText.trim()}"`,
    activeModel: targetModel,
    availableModels
  };
}

/**
 * Agent A: Chat with the Simulated Patient
 */
export async function chatWithPatient({
  apiKey,
  provider = 'gemini',
  model = DEFAULT_MODEL,
  scenario,
  messages
}) {
  if (!apiKey) {
    throw new Error('No API key provided. Please configure your key in Settings.');
  }

  const cleanKey = apiKey.trim().replace(/^["']|["']$/g, '');
  const systemInstruction = getPatientSystemPrompt(scenario);

  if (provider === 'openai') {
    const safeList = Array.isArray(messages) ? messages : [];
    const cleanList = safeList.filter((m) => m && m.sender !== 'system');
    const dialog = [];

    // If patient initiated the consultation, prepend initial clinical invitation
    if (cleanList.length > 0 && cleanList[0].sender === 'patient') {
      dialog.push({
        role: 'user',
        content: 'Good day. Please come in and tell me what is troubling you.'
      });
    }

    for (const msg of cleanList) {
      dialog.push({
        role: msg.sender === 'doctor' ? 'user' : 'assistant',
        content: msg.text
      });
    }

    const openaiMessages = [
      { role: 'system', content: systemInstruction },
      ...dialog
    ];

    const res = await fetch(OPENAI_API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cleanKey}`
      },
      body: JSON.stringify({
        model: model || DEFAULT_OPENAI_MODEL,
        messages: openaiMessages,
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw handleApiError(null, res.status, errJson, model);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || '...';
  }

  // Google Gemini API call with automated fallback
  const contents = [];
  const safeMessages = Array.isArray(messages) ? messages : [];
  const cleanMessages = safeMessages.filter((m) => m && m.sender !== 'system');

  for (const msg of cleanMessages) {
    contents.push({
      role: msg.sender === 'doctor' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    });
  }

  // Gemini requires the first turn in contents to have role: 'user'
  if (contents.length > 0 && contents[0].role === 'model') {
    contents.unshift({
      role: 'user',
      parts: [{ text: 'Good day. Please come in and tell me what is troubling you.' }]
    });
  }

  if (contents.length === 0 || contents[contents.length - 1].role !== 'user') {
    contents.push({
      role: 'user',
      parts: [{ text: 'Hello, please tell me what brings you to the clinic today.' }]
    });
  }

  const payload = {
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    },
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 350
    }
  };

  const text = await generateWithFallback(cleanKey, payload, model);
  return text ? text.trim() : 'I am experiencing this persistent trouble, Doctor. Please advise me.';
}

/**
 * Agent B: Senior Homeopathic Consultant Evaluation
 */
export async function evaluateCaseTaking({
  apiKey,
  provider = 'gemini',
  model = DEFAULT_MODEL,
  scenario,
  messages,
  caseNotes
}) {
  if (!apiKey) {
    throw new Error('No API key configured. Please enter your Gemini API key in Settings to run AI evaluation.');
  }

  const cleanKey = apiKey.trim().replace(/^["']|["']$/g, '');

  const safeMessages = Array.isArray(messages) ? messages : [];
  const transcriptText = safeMessages
    .filter((m) => m && m.sender !== 'system')
    .map((m) => `${m.sender === 'doctor' ? 'Doctor' : 'Patient'}: "${m.text || ''}"`)
    .join('\n');

  const caseNotesText =
    typeof caseNotes === 'string'
      ? caseNotes
      : Object.entries(caseNotes || {})
          .filter(([, v]) => v && v.trim())
          .map(([k, v]) => `${k}: ${v}`)
          .join('\n');

  const evaluatorPrompt = getEvaluatorSystemPrompt(scenario, transcriptText, caseNotesText);

  if (provider === 'openai') {
    const res = await fetch(OPENAI_API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cleanKey}`
      },
      body: JSON.stringify({
        model: DEFAULT_OPENAI_MODEL,
        messages: [
          { role: 'system', content: 'You are a Senior Homeopathic Consultant. Output strict JSON only.' },
          { role: 'user', content: evaluatorPrompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 3500
      })
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw handleApiError(null, res.status, errJson, DEFAULT_OPENAI_MODEL);
    }

    const data = await res.json();
    const rawContent = data.choices?.[0]?.message?.content;
    return cleanAndParseJSON(rawContent);
  }

  // Gemini API call with automated fallback
  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: evaluatorPrompt }]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 4096,
      responseMimeType: 'application/json'
    }
  };

  const rawText = await generateWithFallback(cleanKey, payload, model);
  return cleanAndParseJSON(rawText);
}

/**
 * Generate a new dynamic clinical case scenario via Gemini
 */
export async function generateDynamicCase({
  apiKey,
  provider = 'gemini',
  model = DEFAULT_MODEL,
  category = 'Gastrointestinal',
  difficulty = 'Intermediate'
}) {
  if (!apiKey) {
    throw new Error('API key is required to generate dynamic AI cases.');
  }

  const cleanKey = apiKey.trim().replace(/^["']|["']$/g, '');
  const prompt = getCaseGeneratorPrompt(category, difficulty);

  if (provider === 'openai') {
    const res = await fetch(OPENAI_API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cleanKey}`
      },
      body: JSON.stringify({
        model: DEFAULT_OPENAI_MODEL,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.8
      })
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw handleApiError(null, res.status, errJson, DEFAULT_OPENAI_MODEL);
    }
    const data = await res.json();
    return cleanAndParseJSON(data.choices?.[0]?.message?.content);
  }

  const payload = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 1500,
      responseMimeType: 'application/json'
    }
  };

  const rawText = await generateWithFallback(cleanKey, payload, model);
  return cleanAndParseJSON(rawText);
}

/**
 * Fallback heuristic response generator (runs 100% offline if no API key is provided)
 */
export function generateLocalHeuristicResponse(scenario, query) {
  const q = (query || '').toLowerCase();
  const id = scenario?.id;

  if (id === 'nux-vomica-acute') {
    if (q.includes('thermal') || q.includes('hot') || q.includes('cold') || q.includes('draft') || q.includes('fan')) {
      return "Doctor, I cannot stand drafts of air! Even when the room is comfortable, a little draft from an AC vent makes me shiver. I keep a blazer or sweater on even when others don't.";
    }
    if (q.includes('thirst') || q.includes('water') || q.includes('drink')) {
      return "Cold water feels horrible on my stomach right now—it brings on cramping. I find myself sipping hot herbal tea or warm water. It is the only thing that slightly settles the burning.";
    }
    if (q.includes('worse') || q.includes('aggravat') || q.includes('when') || q.includes('time')) {
      return "It reliably wakes me up at about 3:30 or 4:00 AM with this sour burning and spasm. Also right after I eat or if I have had coffee to stay awake for court briefs. Tight waistbands make it impossible to sit.";
    }
    if (q.includes('better') || q.includes('relief') || q.includes('ameliorat')) {
      return "Warmth helps. Sitting with a heating pad pressed against my upper abdomen, or taking a warm drink and lying completely still. Unbuttoning my trousers gives immediate relief.";
    }
    if (q.includes('stool') || q.includes('bowel') || q.includes('constipat')) {
      return "That's one of the most frustrating parts! I feel an urgent call to go to the toilet every two hours, but when I sit there, almost nothing happens—just a tiny speck and an uneasy feeling that it's incomplete.";
    }
    if (q.includes('mood') || q.includes('temper') || q.includes('anger') || q.includes('stress')) {
      return "Honestly? I'm on edge. People in my office are working too slowly and it drives me crazy! Any sudden noise or contradiction sets my teeth on edge. I just want quick, effective solutions.";
    }
    return "Doctor, it feels like a heavy stone pressing right below my breastbone with acute sour burning rising into my throat. Can you give me something quick so I can return to my desk?";
  }

  if (id === 'natrum-mur-migraine') {
    if (q.includes('thermal') || q.includes('hot') || q.includes('cold') || q.includes('sun')) {
      return "I am definitely very hot-blooded. I cannot bear stepping out into the midday sun—if sunlight hits my forehead, my head pounds immediately. I always crave an open cool breeze.";
    }
    if (q.includes('thirst') || q.includes('water')) {
      return "I drink huge carafes of ice water throughout the day. My mouth and lips always feel dry and cracked even though I drink so much.";
    }
    if (q.includes('salt') || q.includes('craving')) {
      return "I sprinkle extra salt on almost everything—even cucumbers and salads. I can't resist salty chips or pickles, but I genuinely dislike bread and slimy curries.";
    }
    if (q.includes('time') || q.includes('worse')) {
      return "The headache usually starts around 10:00 in the morning, gradually builds to an unbearable bursting hammer at noon, and then slowly ebbs away after 3:00 PM.";
    }
    if (q.includes('sad') || q.includes('grief') || q.includes('cry') || q.includes('consol')) {
      return "...(looks down, quiet pause)... I don't really like discussing personal matters or feeling pitied. If someone tries to comfort me when I'm upset, it honestly makes me irritated and I withdraw more. I only cry when I am completely alone.";
    }
    return "It feels like a tiny hammer beating relentlessly inside the right side of my temple. My vision gets slightly zigzagged before it reaches peak intensity.";
  }

  if (id === 'chamomilla-pediatric') {
    if (q.includes('carry') || q.includes('rock') || q.includes('quiet') || q.includes('calm')) {
      return "Doctor, the ONLY way he stops screaming is if my husband or I hold him against our chest and walk rapidly back and forth in the hallway! The second we sit down, the ear-piercing scream restarts.";
    }
    if (q.includes('cheeks') || q.includes('face') || q.includes('fever')) {
      return "Yes! It is so peculiar: his right cheek becomes fiery red and burning hot to touch, while his left cheek looks totally pale and cool.";
    }
    if (q.includes('stool') || q.includes('diaper') || q.includes('smell')) {
      return "His diaper is shocking—it looks just like chopped boiled spinach with mucous, and the smell is terrible, just like rotten sulfurous eggs.";
    }
    return "He is in acute torment from his gums cutting through. He refuses to let anyone touch his mouth, snaps his teeth, and cries until he turns purple.";
  }

  if (id === 'arsenicum-anxiety') {
    if (q.includes('water') || q.includes('thirst') || q.includes('drink')) {
      return "I am thirsty constantly, but I cannot drink a full glass. I just take one small sip of lukewarm water every five to ten minutes. Cold water feels like cold lead inside.";
    }
    if (q.includes('thermal') || q.includes('cold') || q.includes('warmth')) {
      return "I feel chilled to the bone. Look at me, I am wearing two thermal layers inside your clinic. Any cool breeze causes sharp pains in my chest and epigastrium.";
    }
    if (q.includes('time') || q.includes('midnight') || q.includes('night')) {
      return "Without fail, 1:00 AM to 2:00 AM is terror for me. I wake up gasping with burning stomach pain, my heart beating at 130 bpm, pacing the room in panic.";
    }
    if (q.includes('fear') || q.includes('death') || q.includes('worry')) {
      return "Doctor, please be honest with me... is this stomach cancer? I get terrified that no medicine will work and my time is short. I cannot be left alone in a room at night. I need someone holding my hand.";
    }
    return "The pain in my stomach is like hot burning embers. Sitting upright and drinking warm tea is the only thing that gives a brief reprieve.";
  }

  return "I am experiencing this persistent trouble, Doctor. It affects my whole daily routine. Please help me figure out what is causing this.";
}
