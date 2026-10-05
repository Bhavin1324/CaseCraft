/**
 * Multi-Dimensional Clinical Taxonomy & 500-Case Dataset Builder
 *
 * Matrix Structure:
 * - 50 Core Polychrests
 * - 5 Pathological Domains (Gastrointestinal, Respiratory, Dermatological, Neurological/Headache, Musculoskeletal/Rheumatic)
 * - 2 Case Timelines (Acute violent onset vs Chronic deep miasmatic)
 * - 5 Interaction Profiles (ideal_lsmc, section_88_leading_trap, withheld_modality, mentor_json_eval, sbar_handover)
 * Total: 50 remedies * 2 timelines * 5 profiles = 500 discrete test fixtures.
 */

export const CORE_50_POLYCHRESTS = [
  { abbr: 'Acon', name: 'Aconitum Napellus', commonName: 'Monkshood', tri: 'Sudden intense terror, dry hot skin, unquenchable cold thirst', thermal: 'Chilly', thirst: 'Cold drinks in large gulps' },
  { abbr: 'Apis', name: 'Apis Mellifica', commonName: 'Honeybee venom', tri: 'Stinging burning edema, thirstlessness, better cold applications', thermal: 'Hot', thirst: 'Thirstless even in fever' },
  { abbr: 'Arg-n', name: 'Argentum Nitricum', commonName: 'Silver nitrate', tri: 'Anticipatory panic, craves sugar which disagrees, splinter-like throat pain', thermal: 'Warm/Hot (< heat of room)', thirst: 'Desires ice cold drinks' },
  { abbr: 'Arn', name: 'Arnica Montana', commonName: 'Leopard\'s bane', tri: 'Bruised sore feeling, claims nothing is wrong, bed feels too hard', thermal: 'Chilly head hot body', thirst: 'Thirst during chill' },
  { abbr: 'Ars-alb', name: 'Arsenicum Album', commonName: 'White arsenic', tri: 'Burning pains relieved by heat, midnight anguish, small frequent sips of warm water', thermal: 'Extremely chilly', thirst: 'Frequent sips of warm water' },
  { abbr: 'Bapt', name: 'Baptisia Tinctoria', commonName: 'Wild indigo', tri: 'Stupor, feels scattered in pieces, offensive septic discharges', thermal: 'Chilly with fever', thirst: 'Constant moderate thirst' },
  { abbr: 'Bell', name: 'Belladonna', commonName: 'Deadly nightshade', tri: 'Sudden violent onset, throbbing carotids, red hot flushed face, worse light/motion', thermal: 'Hot head, chilly limbs', thirst: 'Thirstless or sips water' },
  { abbr: 'Bry', name: 'Bryonia Alba', commonName: 'Wild hops', tri: 'Aggravation from least motion, great thirst for large cold gulps, stitching pains relieved by pressure', thermal: 'Chilly (< movement)', thirst: 'Large gulps at long intervals' },
  { abbr: 'Calc-c', name: 'Calcarea Carbonica', commonName: 'Oyster shell lime', tri: 'Chilly damp feet, head sweats in sleep, craves boiled eggs and indigestibles', thermal: 'Very chilly', thirst: 'Craves cold refreshing drinks' },
  { abbr: 'Calc-p', name: 'Calcarea Phosphorica', commonName: 'Phosphate of lime', tri: 'Growing pains, dissatisfaction, desires smoked meats and bacon', thermal: 'Chilly (< draft)', thirst: 'Moderate thirst' },
  { abbr: 'Canth', name: 'Cantharis', commonName: 'Spanish fly', tri: 'Intolerable constant burning tenesmus, cutting burning urine drop by drop', thermal: 'Chilly', thirst: 'Unquenchable thirst with throat spasms' },
  { abbr: 'Carbo-v', name: 'Carbo Vegetabilis', commonName: 'Vegetable charcoal', tri: 'Corpse reviver, air hunger craving to be fanned, excessive upper abdomen flatulence', thermal: 'Cold surface, craves breeze', thirst: 'Desires cold drinks' },
  { abbr: 'Caust', name: 'Causticum', commonName: 'Hahnemann\'s tinctura acris', tri: 'Ailments from long grief, paralytic weakness, involuntary stool/urine on coughing', thermal: 'Chilly, better damp warm weather', thirst: 'Thirst with aversion to water' },
  { abbr: 'Cham', name: 'Chamomilla', commonName: 'German chamomile', tri: 'Unbearable pain with anger, one cheek hot red other pale, calmed only by being carried', thermal: 'Hot with burning flushes', thirst: 'Thirsty for cold water' },
  { abbr: 'Cinchona', name: 'China Officinalis', commonName: 'Peruvian bark', tri: 'Debility from fluid loss, periodic intermittent fever, tympanitic abdomen', thermal: 'Chilly (< breeze)', thirst: 'Thirst for sips between chills' },
  { abbr: 'Coloc', name: 'Colocynthis', commonName: 'Bitter cucumber', tri: 'Agonizing cutting cramps relieved by bending double and firm hard pressure', thermal: 'Chilly', thirst: 'Moderate thirst' },
  { abbr: 'Dros', name: 'Drosera Rotundifolia', commonName: 'Sundew', tri: 'Paroxysmal barking whooping cough worse lying down and midnight', thermal: 'Chilly', thirst: 'Thirstless during paroxysm' },
  { abbr: 'Dulc', name: 'Dulcamara', commonName: 'Bittersweet', tri: 'Ailments from damp cold weather or sudden chilling after sweating', thermal: 'Chilly (< damp)', thirst: 'Moderate thirst' },
  { abbr: 'Gels', name: 'Gelsemium', commonName: 'Yellow jasmine', tri: 'The 4 D\'s: Drowsy, Duller, Dizzy, Drooping eyelids with complete thirstlessness', thermal: 'Chilly with trembling', thirst: 'Thirstless entirely' },
  { abbr: 'Hep-s', name: 'Hepar Sulphuris', commonName: 'Hahnemann\'s calcium sulphide', tri: 'Hypersensitive to slightest cold draft and touch, splinter pains, foul cheesy suppurations', thermal: 'Hyper-chilly (< slightest draft)', thirst: 'Craves warm sour drinks' },
  { abbr: 'Ign', name: 'Ignatia Amara', commonName: 'St. Ignatius bean', tri: 'Paradoxical symptoms, sighing, silent suppressed grief, lump in throat relieved by solids', thermal: 'Chilly during fever', thirst: 'Thirst only during chill' },
  { abbr: 'Ipec', name: 'Ipecacuanha', commonName: 'Ipecac root', tri: 'Persistent unrelieved nausea with clean tongue, spasmodic suffocating cough', thermal: 'Chilly', thirst: 'Total thirstlessness with nausea' },
  { abbr: 'Kali-bi', name: 'Kali Bichromicum', commonName: 'Potassium bichromate', tri: 'Ropy stringy viscid mucus, wandering pains in small spots, punch-out ulcers', thermal: 'Chilly (< cold weather)', thirst: 'Desires warm beer or soup' },
  { abbr: 'Kali-c', name: 'Kali Carbonicum', commonName: 'Potassium carbonate', tri: 'Aggravation at 3-5 AM, stitching pains, bag-like upper eyelid swellings', thermal: 'Very chilly', thirst: 'Thirsty for cold water' },
  { abbr: 'Lach', name: 'Lachesis Muta', commonName: 'Bushmaster snake venom', tri: 'Left-to-right progression, worse after sleep, cannot tolerate tight collars or touch on throat', thermal: 'Hot patient (< heat)', thirst: 'Thirsty for cold water' },
  { abbr: 'Led', name: 'Ledum Palustre', commonName: 'Marsh tea', tri: 'Punctured wounds, ascendant joint rheumatism, affected parts cold to touch but relieved by ice', thermal: 'Cold body but relieved by cold', thirst: 'Thirstless' },
  { abbr: 'Lyc', name: 'Lycopodium Clavatum', commonName: 'Club moss', tri: 'Right-to-left symptoms, 4 PM to 8 PM aggravation, excessive lower abdomen flatulence, craves warm drinks', thermal: 'Chilly body, hot head', thirst: 'Craves warm drinks' },
  { abbr: 'Mag-p', name: 'Magnesia Phosphorica', commonName: 'Phosphate of magnesia', tri: 'Lightning-like neuralgic spasms relieved by hot compresses and firm pressure', thermal: 'Chilly (< cold)', thirst: 'Thirst for warm liquids' },
  { abbr: 'Merc-sol', name: 'Mercurius Solubilis', commonName: 'Quicksilver', tri: 'Human thermometer worse both heat and cold, profuse night sweats, metallic mouth taste', thermal: 'Ambithermal (< heat and < cold)', thirst: 'Great thirst with moist tongue' },
  { abbr: 'Nat-m', name: 'Natrum Muriaticum', commonName: 'Common rock salt', tri: 'Ailments from silent grief, mapped tongue, craving for salt, worse 10 AM to 3 PM and sunlight', thermal: 'Warm/Hot (< sun and warmth)', thirst: 'Unquenchable thirst for cold water' },
  { abbr: 'Nat-s', name: 'Natrum Sulphuricum', commonName: 'Sodium sulphate', tri: 'Aggravation in damp wet weather and sea air, early morning painless gushing diarrhea', thermal: 'Chilly in damp weather', thirst: 'Desires ice cold water' },
  { abbr: 'Nit-ac', name: 'Nitricum Acidum', commonName: 'Nitric acid', tri: 'Splinter-like stitching pains in orifices, foul horse-urine odor, unforgiving vindictive mindset', thermal: 'Chilly (< cold)', thirst: 'Moderate thirst' },
  { abbr: 'Nux-v', name: 'Nux Vomica', commonName: 'Poison nut', tri: 'Ineffectual urging for stool, fiery irritability, hypersensitive to noise/light, worse 3-4 AM', thermal: 'Extremely chilly (< drafts)', thirst: 'Craves warm drinks during chill' },
  { abbr: 'Phos', name: 'Phosphorus', commonName: 'Elemental phosphorus', tri: 'Burning sensations along spine, craves ice-cold drinks which vomit once warm, clairvoyant fear of dark', thermal: 'Chilly, but head & stomach want cold', thirst: 'Craves ice-cold water' },
  { abbr: 'Plat', name: 'Platina', commonName: 'Platinum metal', tri: 'Haughty mental disposition, physical numbness, vaginismus, objects appear small', thermal: 'Chilly (< open air)', thirst: 'Moderate thirst' },
  { abbr: 'Podo', name: 'Podophyllum Peltatum', commonName: 'Mayapple', tri: 'Painless profuse morning diarrhea gushing with flatus, prolapse of rectum', thermal: 'Chilly during stool', thirst: 'Thirst for large quantities' },
  { abbr: 'Puls', name: 'Pulsatilla Pratensis', commonName: 'Wind flower', tri: 'Changeable symptoms, thirstlessness with dry mouth, weeping disposition, craving for open cool air', thermal: 'Very hot (< warm room)', thirst: 'Total thirstlessness' },
  { abbr: 'Pyrog', name: 'Pyrogenium', commonName: 'Artificial sepsin', tri: 'Disparity between pulse and temperature (high pulse low temp), aching bruised bed feels hard', thermal: 'Chilly with rapid septic pulse', thirst: 'Thirst for small quantities' },
  { abbr: 'Rhus-t', name: 'Rhus Toxicodendron', commonName: 'Poison ivy', tri: 'Restlessness, triangular red tip tongue, worse initial motion and cold damp, better continued motion and heat', thermal: 'Chilly (< cold damp)', thirst: 'Thirst for cold sips' },
  { abbr: 'Ruta', name: 'Ruta Graveolens', commonName: 'Bitter rue', tri: 'Bruised lameness of periosteum, tendons and flexor joints, eyestrain headache from close work', thermal: 'Chilly (< cold damp)', thirst: 'Moderate thirst' },
  { abbr: 'Sep', name: 'Sepia Officinalis', commonName: 'Cuttlefish ink', tri: 'Bearing down sensation in pelvis, indifference to family, brownish saddle across nose, better vigorous exercise', thermal: 'Chilly (< cold air)', thirst: 'Thirstless or craves vinegar' },
  { abbr: 'Sil', name: 'Silicea Terra', commonName: 'Pure flint silica', tri: 'Defective assimilation, offensive sour foot sweats, chilly wrapping head warmly, splinter-like fistulas', thermal: 'Extremely chilly (< cold air)', thirst: 'Thirstless or desires cold' },
  { abbr: 'Spig', name: 'Spigelia Anthelmia', commonName: 'Pinkroot', tri: 'Violent left-sided neuralgic headache following sun trajectory, visible precordial palpitations', thermal: 'Chilly (< touch and motion)', thirst: 'Moderate thirst' },
  { abbr: 'Spong', name: 'Spongia Tosta', commonName: 'Roasted sponge', tri: 'Dry barking croupy cough like sawing wood, burning constriction of larynx, relieved by eating or warm drinks', thermal: 'Warm/Hot (< warm room)', thirst: 'Thirsty for warm liquids' },
  { abbr: 'Staph', name: 'Staphysagria', commonName: 'Stavesacre', tri: 'Ailments from suppressed anger, indignity and humiliation, clean-cut incision pains, honeymoon cystitis', thermal: 'Chilly', thirst: 'Moderate thirst' },
  { abbr: 'Stram', name: 'Stramonium', commonName: 'Thorn apple', tri: 'Terrifying hallucinations, horror of darkness and glistening water, violent spasmodic delirium', thermal: 'Hot head, chilly body', thirst: 'Thirst with throat spasm' },
  { abbr: 'Sulph', name: 'Sulphur', commonName: 'Sublimed sulfur', tri: 'Burning soles in bed, empty sinking at 11 AM, aversion to bathing, philosophical ragged king', thermal: 'Very hot (< heat of bed)', thirst: 'Drinks much, eats little' },
  { abbr: 'Thuja', name: 'Thuja Occidentalis', commonName: 'Arbor vitae', tri: 'Hydrogenoid constitution, cauliflower warts, fixed idea that body is brittle glass or strange person beside them', thermal: 'Chilly (< damp cold)', thirst: 'Thirstless during sweat' },
  { abbr: 'Verat-a', name: 'Veratrum Album', commonName: 'White hellebore', tri: 'Cold sweat on forehead, violent simultaneous purging and vomiting, collapse with cold breath', thermal: 'Ice-cold surface and breath', thirst: 'Unquenchable thirst for cold water' },
  { abbr: 'Zinc', name: 'Zincum Metallicum', commonName: 'Zinc metal', tri: 'Constant restless fidgeting of feet and legs, suppressed eruptions causing nerve exhaustion, brain-fag', thermal: 'Chilly (< cold)', thirst: 'Moderate thirst' }
];

export const PATHOLOGICAL_DOMAINS = [
  'Gastrointestinal',
  'Respiratory',
  'Dermatological',
  'Neurological/Headache',
  'Musculoskeletal/Rheumatic'
];

export const CASE_TIMELINES = [
  'Acute violent onset',
  'Chronic deep miasmatic'
];

export const INTERACTION_PROFILES = [
  'ideal_lsmc',
  'section_88_leading_trap',
  'withheld_modality',
  'mentor_json_eval',
  'sbar_handover'
];

/**
 * Maps each of the 50 remedies to domain-specific symptom patterns in natural lay language
 */
function getDomainComplaint(remedy, domain, timeline) {
  const isAcute = timeline.startsWith('Acute');

  switch (domain) {
    case 'Gastrointestinal':
      return {
        chief: isAcute
          ? `Acute agonizing stomach cramps and severe nausea with ${remedy.tri.split(',')[0].toLowerCase()}.`
          : `Longstanding digestive burning, sour regurgitation and irregular bowel distress with ${remedy.tri.split(',')[0].toLowerCase()}.`,
        location: 'Epigastrium and umbilical area extending through to back',
        sensation: 'Gnawing burning like fire and heavy cramping pressure',
        leadingQuestion: 'Is the stomach pain throbbing and worse after you drink cold water?',
        openQuestion: 'Could you describe the exact nature of the discomfort in your stomach?'
      };
    case 'Respiratory':
      return {
        chief: isAcute
          ? `Sudden suffocative coughing fits and tight chest constriction with ${remedy.tri.split(',')[0].toLowerCase()}.`
          : `Chronic recurring wheezing, morning catarrh and chest tightness with ${remedy.tri.split(',')[0].toLowerCase()}.`,
        location: 'Larynx, trachea and upper sternal margin',
        sensation: 'Raw burning scraper sensation and tight suffocating vise-grip',
        leadingQuestion: 'Does the cough get much worse when cold wind hits your throat?',
        openQuestion: 'Tell me how your chest feels and what brings on the coughing spells.'
      };
    case 'Dermatological':
      return {
        chief: isAcute
          ? `Sudden widespread itchy eruptive rash and fiery skin burning with ${remedy.tri.split(',')[0].toLowerCase()}.`
          : `Intractable dry scaly skin eruptions and unremitting nighttime itching with ${remedy.tri.split(',')[0].toLowerCase()}.`,
        location: 'Flexor folds of elbows, behind knees and hair margins',
        sensation: 'Prickling fiery heat and unbearable crawling itch',
        leadingQuestion: 'Is the itching definitely worse when you get warm in bed at night?',
        openQuestion: 'Describe what the skin irritation feels like and what you notice about it.'
      };
    case 'Neurological/Headache':
      return {
        chief: isAcute
          ? `Violent blinding hemicrania with sensitive sensory overload and ${remedy.tri.split(',')[0].toLowerCase()}.`
          : `Recurring weekend migraines and deep temple throbbing with ${remedy.tri.split(',')[0].toLowerCase()}.`,
        location: 'Right temple radiating across vertex to occiput',
        sensation: 'Heavy hammer beating from inside and skull feels like bursting apart',
        leadingQuestion: 'Does the headache feel like a pulsating hammer right behind your eyes?',
        openQuestion: 'Please tell me what the headache sensation is like from the moment it begins.'
      };
    case 'Musculoskeletal/Rheumatic':
      return {
        chief: isAcute
          ? `Acute inflamed swelling of joints with tearing pain and ${remedy.tri.split(',')[0].toLowerCase()}.`
          : `Chronic stiff aching in lumbar spine and knees worse on weather shifts with ${remedy.tri.split(',')[0].toLowerCase()}.`,
        location: 'Lower back, sacroiliac joints, and right knee',
        sensation: 'Bruised soreness as if beaten, stiff lameness and tearing twinges',
        leadingQuestion: 'Are your joints much stiffer when you first try to stand up from sitting?',
        openQuestion: 'How would you describe the stiffness or aching in your joints?'
      };
    default:
      return {
        chief: `General physical distress and weakness with ${remedy.tri.split(',')[0].toLowerCase()}.`,
        location: 'Whole body',
        sensation: 'Aching and fatigue',
        leadingQuestion: 'Do you feel worse in the morning?',
        openQuestion: 'Tell me what you are feeling.'
      };
  }
}

/**
 * Builds the complete 500-case taxonomy matrix.
 * 50 remedies * 2 timelines * 5 profiles = 500 cases.
 */
export function buildClinical500Suite() {
  const suite = [];
  let testIndex = 1;

  for (const profile of INTERACTION_PROFILES) {
    for (let rIdx = 0; rIdx < CORE_50_POLYCHRESTS.length; rIdx++) {
      const remedy = CORE_50_POLYCHRESTS[rIdx];
      // Distribute evenly across 5 domains: rIdx % 5
      const domain = PATHOLOGICAL_DOMAINS[rIdx % PATHOLOGICAL_DOMAINS.length];

      for (const timeline of CASE_TIMELINES) {
        const domainData = getDomainComplaint(remedy, domain, timeline);
        const caseId = `case-${testIndex.toString().padStart(3, '0')}-${remedy.abbr.toLowerCase()}-${profile}`;

        const scenario = {
          id: caseId,
          testIndex,
          remedyAbbr: remedy.abbr,
          remedyName: remedy.name,
          domain,
          timeline,
          interactionProfile: profile,
          title: `${remedy.abbr} in ${domain} (${timeline})`,
          patientName: `Patient ${testIndex} (${remedy.abbr} constitution)`,
          chiefComplaint: domainData.chief,
          archetype: `${remedy.name} archetype`,
          difficulty: timeline.startsWith('Acute') ? 'Acute presentation' : 'Chronic miasmatic',
          persona: {
            tone: remedy.thermal.includes('Chilly') ? 'chilly, irritable, sensitive' : 'warm, restless, open',
            background: `Presents with ${domain.toLowerCase()} complaints persisting across ${timeline.toLowerCase()}.`,
            hiddenTruths: {
              sensation: domainData.sensation,
              thermal: remedy.thermal,
              thirst: remedy.thirst,
              modalities: {
                agg: `Aggravated by ${remedy.tri.split(',')[1] || 'weather shifts'}`,
                amel: `Relieved by ${remedy.tri.split(',')[2] || 'quiet rest'}`
              },
              mind: remedy.tri.split(',')[0]
            }
          },
          domainData,
          indicatedRemedy: `${remedy.name} 200C`,
          expectedTotality: [remedy.name, 'Differential Alpha', 'Differential Beta']
        };

        suite.push(scenario);
        testIndex++;
      }
    }
  }

  return suite;
}
