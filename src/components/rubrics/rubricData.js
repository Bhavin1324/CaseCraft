export const DEFAULT_RUBRICS = [
  {
    colloquial: 'worse in cold wind or draft of air',
    rubric: 'Generalities; Cold; air, draft of; agg.',
    remedies: [
      { name: 'NUX-V', grade: 3 },
      { name: 'Hepar', grade: 2 },
      { name: 'Calc-c', grade: 2 },
      { name: 'Silica', grade: 1 }
    ]
  },
  {
    colloquial: 'headache worse in direct sun / sunlight',
    rubric: 'Head; Pain, headache; sun, exposure to, from agg.',
    remedies: [
      { name: 'NAT-M', grade: 3 },
      { name: 'Glon', grade: 3 },
      { name: 'Bell', grade: 2 },
      { name: 'Gels', grade: 1 }
    ]
  },
  {
    colloquial: 'cries when someone tries to comfort or console her',
    rubric: 'Mind; Weeping; consolation agg.',
    remedies: [
      { name: 'NAT-M', grade: 3 },
      { name: 'Ign', grade: 2 },
      { name: 'Sep', grade: 2 },
      { name: 'Sil', grade: 1 }
    ]
  },
  {
    colloquial: 'relief when being carried and rocked rapidly',
    rubric: 'Generalities; Carried; desire to be; being carried amel.',
    remedies: [
      { name: 'CHAM', grade: 3 },
      { name: 'Cina', grade: 2 },
      { name: 'Ars', grade: 1 }
    ]
  },
  {
    colloquial: 'pain relieved by firm hard pressure / lying on sore side',
    rubric: 'Generalities; Pressure; external; amel.',
    remedies: [
      { name: 'BRY', grade: 3 },
      { name: 'Coloc', grade: 3 },
      { name: 'Mag-p', grade: 2 },
      { name: 'Bell', grade: 1 }
    ]
  },
  {
    colloquial: 'wakes up at 3 AM or 4 AM and cannot sleep',
    rubric: 'Sleep; Waking; 3 a.m., at',
    remedies: [
      { name: 'NUX-V', grade: 3 },
      { name: 'Kali-c', grade: 3 },
      { name: 'Ars', grade: 2 }
    ]
  },
  {
    colloquial: 'craves large amounts of salt or salty snacks',
    rubric: 'Stomach; Desires; salt things',
    remedies: [
      { name: 'NAT-M', grade: 3 },
      { name: 'Phos', grade: 3 },
      { name: 'Caust', grade: 2 },
      { name: 'Sulph', grade: 2 }
    ]
  },
  {
    colloquial: 'thirst for frequent small sips of water',
    rubric: 'Stomach; Thirst; small quantities, for; often',
    remedies: [
      { name: 'ARS', grade: 3 },
      { name: 'Bell', grade: 2 },
      { name: 'Hyos', grade: 1 },
      { name: 'Phos', grade: 1 }
    ]
  },
  {
    colloquial: 'burning in stomach relieved by hot drinks',
    rubric: 'Stomach; Pain; burning; warm drinks amel.',
    remedies: [
      { name: 'ARS', grade: 3 },
      { name: 'Chel', grade: 2 },
      { name: 'Nux-v', grade: 2 }
    ]
  },
  {
    colloquial: 'extreme restlessness past midnight with fear of death',
    rubric: 'Mind; Restlessness, nervousness; midnight, after; 1 to 2 a.m.',
    remedies: [
      { name: 'ARS', grade: 3 },
      { name: 'Acon', grade: 3 },
      { name: 'Rhus-t', grade: 2 }
    ]
  },
  {
    colloquial: 'stomach feels empty, faint and sinking at 11 AM',
    rubric: 'Stomach; Emptiness, weak feeling; 11 a.m., at',
    remedies: [
      { name: 'SULPH', grade: 3 },
      { name: 'Zinc', grade: 2 },
      { name: 'Hydr', grade: 2 },
      { name: 'Nat-c', grade: 1 }
    ]
  },
  {
    colloquial: 'ineffectual urging for bowel movement with incomplete stool',
    rubric: 'Rectum; Urging, desire; ineffectual',
    remedies: [
      { name: 'NUX-V', grade: 3 },
      { name: 'Lyc', grade: 2 },
      { name: 'Ign', grade: 2 },
      { name: 'Sulph', grade: 2 }
    ]
  }
];

export const DEFAULT_POLYCHRESTS = [
  {
    name: 'Nux Vomica',
    triad: ['Irritability & Hypersensitivity', 'Chilliness & Draft Sensitivity', 'Ineffectual Urging'],
    thermals: 'Chilly (< cold, drafts, uncovering)',
    thirst: 'Thirst during chill; craves warm drinks, beer, spicy coffee',
    modalities: '< Morning (3-4 AM), cold air, overeating, stimulants, noise. > Warmth, evening, quiet nap.',
    keynotes: 'Zealous, ambitious, easily offended, fastidious, hyperesthetic to light and noise.',
    indicatedConditions: 'Spasmodic dyspepsia, hangover, constipation, hemorrhoids, insomnia at 3 AM.'
  },
  {
    name: 'Natrum Muriaticum',
    triad: ['Ailments from Silent Grief', 'Craving for Salt', 'Aggravation 10 AM - 3 PM & Sun'],
    thermals: 'Hot (< direct sun, warm stuffy rooms, fire heat)',
    thirst: 'Great thirst for cold water; dry mucous membranes, cracked lower lip.',
    modalities: '< 10-11 AM, sea shore, sun, consolation, mental strain. > Open cool breeze, cold water baths, lying on back.',
    keynotes: 'Introverted, holds past grudges, cries when alone, weeping aggravated by consolation.',
    indicatedConditions: 'Anemia, chronic throbbing migraine, mapped tongue, eczema in hairline, silent depression.'
  },
  {
    name: 'Pulsatilla Pratensis',
    triad: ['Changeability of Symptoms', 'Thirstlessness with Dry Mouth', 'Craving for Open Cool Breeze'],
    thermals: 'Warm / Hot (< warm room, thick clothes, stuffy air)',
    thirst: 'Remarkable thirstlessness, even with dry mouth and high fever.',
    modalities: '< Evening, twilight, warm room, fatty rich foods. > Open cool breeze, gentle motion, consolation.',
    keynotes: 'Mild, gentle, yielding disposition, weeps easily while explaining ailments, craves sympathy.',
    indicatedConditions: 'Delayed menses, shifting joint pains, styes, thick bland yellowish-green discharges.'
  },
  {
    name: 'Arsenicum Album',
    triad: ['Burning Pains > Heat', 'Midnight Restlessness (1-2 AM)', 'Sips Warm Water Frequently'],
    thermals: 'Very Chilly (< cold, damp, ice-cold foods)',
    thirst: 'Intense thirst for small sips of warm water at frequent intervals.',
    modalities: '< 1-2 AM, cold air, cold drinks, lying flat. > Warm drinks, hot compresses, company.',
    keynotes: 'Prostration out of proportion to illness, agonizing fear of death, obsessive neatness.',
    indicatedConditions: 'Ptomaine poisoning, midnight asthma, dry scaly burning eczema, acute gastritis.'
  },
  {
    name: 'Lycopodium Clavatum',
    triad: ['Right to Left Progression', '4 PM - 8 PM Aggravation', 'Craves Warm Food & Sweets'],
    thermals: 'Chilly, but desires fresh open air for head.',
    thirst: 'Thirst for warm water; cold drinks cause flatulence.',
    modalities: '< 4 to 8 PM, right side, cold foods, tight belts. > Warm food/drinks, slow motion, unbuttoning clothes.',
    keynotes: 'Intellectually keen but physically lacking; anticipatory anxiety; excessive bloating.',
    indicatedConditions: 'Gallstone colic, liver dysfunction, urinary gravel with red brick dust sand, dyspepsia.'
  },
  {
    name: 'Sulphur',
    triad: ['Burning in Soles & Vertex', '11 AM Empty Sinking in Stomach', 'Aversion to Bathing & Heat of Bed'],
    thermals: 'Hot (< heat of bed, warm clothes, woolens)',
    thirst: 'Drinks much, eats little; craves sweets, alcohol, spices.',
    modalities: '< 11 AM, bathing, warmth of bed, standing still. > Dry warm weather, lying on right side.',
    keynotes: 'Philosophical, untidy, dislikes bathing, red orifices, scratching feels pleasurable then burns.',
    indicatedConditions: 'Chronic pruritic eruptions, eczema, psoric miasm, relapsing acute infections.'
  },
  {
    name: 'Bryonia Alba',
    triad: ['Extreme Dryness of Mucous Membranes', 'Aggravation from Least Motion', 'Great Thirst for Large Cold Gulps'],
    thermals: 'Warm-blooded / Chilly in drafts, but aggravated by warm rooms.',
    thirst: 'Drinks large gulps of ice water at long intervals.',
    modalities: '< Any motion (even moving eyes), morning rising, warm room. > Absolute rest, lying on painful side, firm pressure.',
    keynotes: 'Business anxieties, talks of business during fever; irritable, wants to go home.',
    indicatedConditions: 'Pleurisy, acute synovitis, dry hard burnt-looking stool, bursting right-sided headache.'
  },
  {
    name: 'Chamomilla',
    triad: ['Unbearable Sensitivity to Pain', 'One Cheek Red & Hot, Other Pale', 'Calmed Only by Constant Rocking'],
    thermals: 'Warm/Hot with feverish flushes; feet uncovered.',
    thirst: 'Thirsty for cold drinks during fever, then refuses.',
    modalities: '< 9 PM to midnight, anger, draft, heat, dentition. > Being constantly carried and rocked.',
    keynotes: 'Snappish, rude, irritable child; throws toys away; cries bitterly with fury.',
    indicatedConditions: 'Teething troubles, infantile colic, menstrual spasms with rage, earache.'
  }
];
