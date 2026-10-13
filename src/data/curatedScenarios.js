/**
 * Curated Clinical Scenarios for CaseCraft
 * Authentic homeopathic patient cases covering acute violent conditions,
 * deep chronic miasmatic diseases, pediatric individualization, and totality synthesis.
 */
export const SCENARIOS = [
  // ==========================================
  // ACUTE CLINICAL CASES (7 Cases)
  // ==========================================
  {
    id: 'nux-vomica-acute',
    timelineType: 'acute',
    title: 'Recurrent Epigastric Dyspepsia & Reflux',
    archetype: 'Reactive Gastrointestinal',
    difficulty: 'Acute Clinical Case',
    patientName: 'Vikram Mehta (38 / M / Corporate Lawyer)',
    chiefComplaint: 'Severe acid burning in stomach, tightness after meals, and persistent nausea for the past 10 days.',
    openingStatement: "Good afternoon, Doctor. I've had this terrible burning in my stomach and constant acid reflux for the past week and a half. My digestion is completely thrown off, antacids aren't doing much, and it's making it impossible to concentrate on my legal briefs. Could we look into something to help settle this?",
    persona: {
      tone: 'tense, hurried, slightly irritable, speaks briskly',
      background: 'Under intense deadline stress, late nights, frequent espressos, irregular spicy takeout, heavy work hours.',
      hiddenTruths: {
        sensation: 'Epigastric sour burning and cramping like a hard stone pressing below breastbone',
        thermal: 'Extremely chilly (< drafts, < AC air; wears blazer indoors)',
        thirst: 'Sips hot tea or warm water; cold drinks bring on immediate stomach cramping',
        cravings: 'Desires spicy curries, coffee, and rich food; aversion to plain bland food',
        modalities: {
          agg: 'Worse in early morning (around 3:00 to 4:00 AM), after eating, coffee, tight clothing',
          amel: 'Better warm drinks, heat applied to stomach, uninterrupted rest, loosening clothing'
        },
        bowels: 'Frequent ineffectual urging for stool; passes small amounts with feeling of incomplete evacuation',
        mind: 'Easily annoyed by noise or interruption, impatient with delays, fastidious about work'
      }
    },
    hints: [
      'Investigate the diurnal timing of when the epigastric discomfort peaks.',
      'Inquire into bowel evacuation patterns and whether urging yields satisfactory relief.',
      'Examine thermal reactions to room drafts, air conditioning, and clothing tightness.'
    ],
    expectedTotality: ['Nux Vomica', 'Lycopodium', 'Carbo Veg'],
    indicatedRemedy: 'Nux Vomica 200C'
  },
  {
    id: 'aconite-acute-respiratory',
    timelineType: 'acute',
    title: 'Sudden Dry Croupy Cough & High Fever Post-Cold Exposure',
    archetype: 'Hyper-Acute Respiratory',
    difficulty: 'Acute Clinical Case',
    patientName: 'Kabir Sethi (27 / M / Field Logistics Supervisor)',
    chiefComplaint: 'Sudden high fever, violent dry chest cough, and intense restlessness starting abruptly last night.',
    openingStatement: "Doctor, this hit me completely out of nowhere last night. I was out riding my motorbike in the dry freezing cold wind yesterday evening, and by midnight I woke up shivering violently with a burning fever, chest tightness, and this dry barking cough. I feel terribly uneasy and can't stay still.",
    persona: {
      tone: 'anxious, restless, speaking rapidly with a dry hoarse voice',
      background: 'Prolonged exposure to dry, biting cold wind while riding motorbike without a windbreaker.',
      hiddenTruths: {
        sensation: 'Dry suffocative constriction in larynx and chest; burning heat throughout body with cold limbs',
        thermal: 'Intolerant of cold air yet feels hot and dry; skin burning dry without any sweat',
        thirst: 'Unquenchable thirst for large quantities of ice-cold water',
        cravings: 'Desires cold water only; aversion to warm drinks or food',
        modalities: {
          agg: 'Worse around midnight, lying on affected side, cold dry wind, sudden noise',
          amel: 'Better in warm room, resting still in bed'
        },
        bowels: 'Dry hot skin with total absence of perspiration',
        mind: 'Intense restlessness, anxious agitation, fear that something dreadful or life-threatening is happening'
      }
    },
    hints: [
      'Determine the precise weather conditions and exposure that preceded the acute onset.',
      'Check perspiration status (is the fever dry or is sweating profuse?).',
      'Observe mental state: is the patient calm or experiencing acute panic and restlessness?'
    ],
    expectedTotality: ['Aconitum Napellus', 'Belladonna', 'Bryonia'],
    indicatedRemedy: 'Aconitum Napellus 200C'
  },
  {
    id: 'rhus-tox-acute-lumbago',
    timelineType: 'acute',
    title: 'Acute Lumbosacral Sprain Following Heavy Lifting',
    archetype: 'Acute Musculoskeletal',
    difficulty: 'Acute Clinical Case',
    patientName: 'Gurpreet Singh (44 / M / Warehouse Supervisor)',
    chiefComplaint: 'Severe lower back stiffness and aching lameness triggered 3 days ago after lifting heavy crates.',
    openingStatement: "Good day, Doctor. I really need help with my lower back. Three days ago I was helping lift heavy storage pallets in the warehouse during rainy weather, and since then my lower spine has locked up. Sitting down makes me completely stiff, and getting out of a chair is agonizing.",
    persona: {
      tone: 'fatigued, restless, constantly shifting posture in chair',
      background: 'Heavy muscular strain lifting furniture followed by getting drenched in cold monsoon rain.',
      hiddenTruths: {
        sensation: 'Bruised tearing aching in lumbosacral area as if flesh were torn from bones',
        thermal: 'Extremely chilly (< cold damp weather, < getting wet, < cold drafts)',
        thirst: 'Thirst for cold milk or water with dry mouth',
        cravings: 'Desires cold milk; aversion to rich heavy meats',
        modalities: {
          agg: 'Worse at beginning of motion, after rest, in damp cold weather, at night in bed',
          amel: 'Better from continued walking or motion, dry warm applications, firm rubbing'
        },
        bowels: 'Stiffness in joints and tendons upon rising from sitting',
        mind: 'Physical restlessness; must keep moving and changing position despite the ache'
      }
    },
    hints: [
      'Probe how motion impacts the back pain: difference between initial motion versus continued motion.',
      'Inquire whether damp rainy weather or dry warmth affects the pain intensity.',
      'Observe the patient’s physical demeanor in the clinic chair: are they still or constantly shifting?'
    ],
    expectedTotality: ['Rhus Toxicodendron', 'Bryonia', 'Arnica'],
    indicatedRemedy: 'Rhus Toxicodendron 200C'
  },
  {
    id: 'cantharis-acute-cystitis',
    timelineType: 'acute',
    title: 'Acute Scalding Dysuria & Pelvic Tenesmus',
    archetype: 'Acute Urological',
    difficulty: 'Acute Clinical Case',
    patientName: 'Meera Joshi (31 / F / High School Teacher)',
    chiefComplaint: 'Intense burning and cutting pain during and after urination with constant urge to pass drops of urine.',
    openingStatement: "Doctor, please excuse me if I need to use the washroom. Since yesterday afternoon, I have this unbearable scalding burning down in my bladder. It feels like hot needles or boiling water every time I pass even a few drops of urine, and the urging simply never stops.",
    persona: {
      tone: 'distressed, tearful, highly anxious, holding lower abdomen',
      background: 'Acute onset after a long weekend road trip with delayed urination, followed by mild chill.',
      hiddenTruths: {
        sensation: 'Violent burning, cutting and raw scalding pain along urethra and neck of bladder',
        thermal: 'Chilly patient with shivering during and after urination',
        thirst: 'Thirsty but drinking water worsens the bladder spasms',
        cravings: 'Aversion to all drinks due to fear of voiding',
        modalities: {
          agg: 'Worse urinating, immediately after passing urine, touch on hypogastrium',
          amel: 'Slight relief from warm hip bath or hot fomentation'
        },
        bowels: 'Constant ineffectual tenesmus of bladder; urine passes drop by drop with cutting agony',
        mind: 'Intense restless anxiety, irritability from unbearable pain, fearful of next voiding'
      }
    },
    hints: [
      'Inquire into the sensation during vs immediately after urination.',
      'Check the volume of urine passed per attempt (copious flow vs drops with tenesmus).',
      'Look for thermal sensitivities or spasms related to drinking fluids.'
    ],
    expectedTotality: ['Cantharis', 'Apis Mellifica', 'Sarsaparilla'],
    indicatedRemedy: 'Cantharis 200C'
  },
  {
    id: 'chamomilla-pediatric',
    timelineType: 'acute',
    title: 'Infantile Teething Distress & Diarrhea',
    archetype: 'Pediatric Acute Colic',
    difficulty: 'Acute Clinical Case',
    patientName: 'Baby Ayaan (14 months) with Mother Radhika',
    chiefComplaint: 'Inconsolable screaming tantrums, feverish cheeks, and loose watery stools during cutting of molar teeth.',
    openingStatement: "Doctor, thank you for seeing us promptly. Our 14-month-old Ayaan is cutting his back molars and has been screaming inconsolably day and night. His diapers are completely loose and foul, he snaps and throws his toys, and nothing we do seems to calm him unless we keep walking him around.",
    persona: {
      tone: 'exhausted, frantic mother speaking on behalf of a screaming, irritable infant',
      background: 'Teething started 2 weeks ago; baby screams constantly, bites everything, rejects toys after demanding them.',
      hiddenTruths: {
        sensation: 'Acute violent gum tenderness and abdominal colic',
        thermal: 'One cheek hot and red, the other pale and cool; warm perspiration on head',
        thirst: 'Thirsty for cold water, drinks greedily and then pushes cup away angrily',
        cravings: 'Demands food or toys, then strikes them away in anger',
        modalities: {
          agg: 'Worse at night (9:00 PM to midnight), in warm room, touch, anger',
          amel: 'Only ameliorated while being constantly carried rapidly or rocked'
        },
        stool: 'Chopped spinach-like greenish diarrhea with rotten egg odor',
        mind: 'Extreme irritability, hypersensitivity to pain, cannot be pacified'
      }
    },
    hints: [
      'Observe the child’s reaction to toys or pacifiers when offered.',
      'Inquire what single measure brings temporary relief to the screaming.',
      'Ask about facial flushed appearance and diaper stool characteristics.'
    ],
    expectedTotality: ['Chamomilla', 'Pulsatilla', 'Belladonna'],
    indicatedRemedy: 'Chamomilla 30C'
  },
  {
    id: 'hepar-sulph-acute-tonsillitis',
    timelineType: 'acute',
    title: 'Acute Suppurative Tonsillitis with Splinter Pains',
    archetype: 'Acute Suppurative Ear/Nose/Throat',
    difficulty: 'Acute Clinical Case',
    patientName: 'Rohan Verma (22 / M / University Student)',
    chiefComplaint: 'Severe throat pain radiating to ears on swallowing, as if a sharp fishbone or splinter were stuck in the throat.',
    openingStatement: "Hello, Doctor... it hurts terribly even to speak. I caught a chill two nights ago and now my left tonsil is swollen and throbbing. Every time I try to swallow saliva, it feels like a sharp splinter or bone is jabbing straight into my left ear. I have to keep my neck completely bundled up.",
    persona: {
      tone: 'hoarse, guarded, speaks in low whisper, wrapped in thick scarf',
      background: 'Caught in cold dry wind after intense basketball practice sweating.',
      hiddenTruths: {
        sensation: 'Stitching, splinter-like or fishbone pain in tonsils shooting up to ears upon swallowing',
        thermal: 'Extreme hypersensitivity to cold; slightest draft or uncovering causes shivering and pain',
        thirst: 'Desires warm drinks; cold liquids cause sharp stabbing agony',
        cravings: 'Craves vinegar, pickles, or pungent foods; aversion to fat',
        modalities: {
          agg: 'Worse from cold air, slightest draft, uncovering, swallowing cold fluids',
          amel: 'Better from warm wraps, covering head and throat, hot drinks, moist heat'
        },
        bowels: 'Tendency to suppurate; tonsils have yellowish cheesy crypts',
        mind: 'Hyper-irritable from pain, touchy, cannot tolerate contradiction or examination'
      }
    },
    hints: [
      'Ask how the patient reacts to uncovering the throat or experiencing a room breeze.',
      'Clarify whether pain shoots to the ears and what sensation characterizes the swallowing.',
      'Notice the temperature preference for liquids (hot vs ice cold).'
    ],
    expectedTotality: ['Hepar Sulphuris', 'Mercurius Sol', 'Nitric Acid'],
    indicatedRemedy: 'Hepar Sulphuris 200C'
  },
  {
    id: 'belladonna-acute-throbbing',
    timelineType: 'acute',
    title: 'Sudden Flushed Throbbing Cephalalgia with Photophobia',
    archetype: 'Acute Congestive Vascular',
    difficulty: 'Acute Clinical Case',
    patientName: 'Pooja Nair (34 / F / Graphic Artist)',
    chiefComplaint: 'Violent throbbing headache in forehead and temples with flushed face, dilated pupils, and intolerance to light.',
    openingStatement: "Doctor, please keep the room lights low... I've had this blinding, pulsating headache that came on suddenly around 3 PM today. My forehead feels burning hot, my temples are hammering, and even the vibration of footsteps or a flicker of screen light makes me feel like my head will burst.",
    persona: {
      tone: 'sensitive, wincing, speaking softly with eyes partially shut',
      background: 'Working outdoors under direct sun yesterday, followed by sudden onset this afternoon.',
      hiddenTruths: {
        sensation: 'Violent throbbing, pulsating, congestive pain as if brain would push through forehead',
        thermal: 'Burning hot head with cold feet and hands; intolerant of sun heat',
        thirst: 'Thirstless or drinks only small sips of water with dry mouth',
        cravings: 'Desires lemonades or tart drinks; aversion to warm food',
        modalities: {
          agg: 'Worse from light, noise, jar, vibration, touch, lying flat, 3:00 PM',
          amel: 'Better from sitting semi-erect in dark silent room, tight bandaging of forehead'
        },
        bowels: 'Dry hot skin with visible pulsation of carotid arteries',
        mind: 'Excitable, delirious if fever rises, hyper-sensitive to sensory impressions'
      }
    },
    hints: [
      'Observe physical signs: facial congestion, heat of forehead versus extremities.',
      'Check reaction to sensory stimuli: light, noise, jarring of bed or chair.',
      'Inquire about the speed of onset (slow gradual versus sudden explosion).'
    ],
    expectedTotality: ['Belladonna', 'Gelsemium', 'Glonoinum'],
    indicatedRemedy: 'Belladonna 200C'
  },

  // ==========================================
  // CHRONIC MIASMATIC CASES (7 Cases)
  // ==========================================
  {
    id: 'natrum-mur-migraine',
    timelineType: 'chronic',
    title: 'Intractable Unilateral Cephalalgia for 8 Months',
    archetype: 'Chronic Neuro-Vascular',
    difficulty: 'Chronic Miasmatic Case',
    patientName: 'Ananya Sen (29 / F / Software Designer)',
    chiefComplaint: 'Bursting, hammering right-sided headache recurring 3 times a week for 8 months.',
    openingStatement: "Hello Doctor... thank you for seeing me. I've been dealing with these severe recurring headaches on the right side of my head for about eight months now. They seem to come almost every other day, ordinary over-the-counter tablets don't help much anymore, and it's making daily work very difficult.",
    persona: {
      tone: 'quiet, reserved, polite, slightly guarded, avoids discussing emotional hardship',
      background: 'Ended a 6-year relationship 10 months ago; lives alone; dislikes discussing sadness.',
      hiddenTruths: {
        sensation: 'Bursting, hammer-like pain in right temple and above eyes',
        thermal: 'Warm-blooded patient (< heat of sun, warm room; craves open cool air)',
        thirst: 'Unquenchable thirst for large quantities of ice-cold water',
        cravings: 'Craves salt, chips, salty snacks; strong aversion to bread and slimy foods',
        modalities: {
          agg: 'Worse 10:00 AM to 3:00 PM, direct sunlight, mental strain, consolation (< weeping when consoled)',
          amel: 'Better in dark quiet room, lying down, cold applications on temple, firm pressure'
        },
        bowels: 'Constipation with dry, crumbling stools',
        mind: 'Dwells on past disagreeable events; closed emotional demeanor; dislikes pity or sympathy'
      }
    },
    hints: [
      'Explore the emotional backdrop that preceded the onset of headaches 8 months ago.',
      'Ask about food cravings—especially preference for salt, savory, or sour.',
      'Investigate the exact daytime diurnal peak and sensitivity to midday sunlight.'
    ],
    expectedTotality: ['Natrum Muriaticum', 'Sepia', 'Ignatia'],
    indicatedRemedy: 'Natrum Muriaticum 200C'
  },
  {
    id: 'lycopodium-chronic-ibs',
    timelineType: 'chronic',
    title: 'Chronic Flatulent Dyspepsia & Lower Abdominal Distension',
    archetype: 'Deep Constitutional Metabolic',
    difficulty: 'Chronic Miasmatic Case',
    patientName: 'Harish Patel (52 / M / Senior Operations Manager)',
    chiefComplaint: 'Chronic bloating, excessive lower gas, and fullness after just a few bites of food, lasting over a year.',
    openingStatement: "Good morning, Doctor. For more than a year now, my digestive system has been a constant struggle. Even if I eat a very light lunch, my stomach blows up with gas like a balloon by late afternoon. I feel heavy, uncomfortable, and it's embarrassing when I have to run evening meetings.",
    persona: {
      tone: 'polite, intellectually articulate, slightly anxious about health',
      background: 'Demanding corporate executive role, sedentary desk work, performance anxiety before presentations.',
      hiddenTruths: {
        sensation: 'Fermentation and rumbling in lower abdomen; sensation of fullness after eating a few mouthfuls',
        thermal: 'Chilly body but desires open air for head and breathing',
        thirst: 'Craves warm drinks; cold drinks feel disagreeable',
        cravings: 'Strong desire for sweets, warm tea, pastries; aversion to cold food, oysters, beans',
        modalities: {
          agg: 'Worse late afternoon from 4:00 PM to 8:00 PM, unloosening belt gives relief',
          amel: 'Better from warm drinks, passing flatus, cool air on head'
        },
        bowels: 'Constipation with hard stool initially, followed by softer stool',
        mind: 'Anticipatory anxiety before meetings, yet performs with distinction; irritable with family when tired'
      }
    },
    hints: [
      'Ask what time of afternoon or evening the abdominal bloating and discomfort reach their peak.',
      'Inquire about beverage temperature preference (warm tea vs chilled water).',
      'Check psychological symptoms: reaction to responsibilities and public presentations.'
    ],
    expectedTotality: ['Lycopodium Clavatum', 'Carbo Vegetabilis', 'Nux Vomica'],
    indicatedRemedy: 'Lycopodium Clavatum 200C'
  },
  {
    id: 'sulphur-chronic-eczema',
    timelineType: 'chronic',
    title: 'Long-Standing Pruritic Flexural Eczema & Heat Sensitivity',
    archetype: 'Chronic Psoric Dermatitis',
    difficulty: 'Chronic Miasmatic Case',
    patientName: 'Sunita Roy (36 / F / High School Art Teacher)',
    chiefComplaint: 'Chronic dry, scaly skin eruptions on elbows and behind knees with violent itching for over two years.',
    openingStatement: "Hello, Doctor. I've been struggling with this skin trouble for over two years now. The creases of my elbows and behind my knees develop these dry, red patches that itch terribly. Dermatologists gave me steroid ointments, which clears it for a week, but as soon as I stop, it flares right back up worse.",
    persona: {
      tone: 'casual, philosophical, slightly animated, scratches wrists intermittently',
      background: 'Recurrent skin rashes since childhood; history of suppressed childhood eczema with topical creams.',
      hiddenTruths: {
        sensation: 'Intense itching followed by burning soreness after scratching until it bleeds',
        thermal: 'Very hot patient (< warm room, < heat of bed; sticks feet out of covers at night)',
        thirst: 'Drinks large quantities of cold water; eats little compared to drinking',
        cravings: 'Craves sweets, spicy condiments; strong aversion to bathing or washing affected skin',
        modalities: {
          agg: 'Worse from warmth of bed at night, after washing or bathing, standing still',
          amel: 'Better in dry open cool air, gentle scratching before the burning starts'
        },
        bowels: 'Empty sinking sensation in stomach around 11:00 AM requiring a snack',
        mind: 'Curious, creative mind, untidy habits, dislikes being hurried, philosophical outlook'
      }
    },
    hints: [
      'Inquire how the skin reacts to hot water, bathing, or the warmth of blankets at night.',
      'Check the patient’s thermal habits during sleep: what do they do with their feet under the duvet?',
      'Ask about midday hunger patterns and general appetite.'
    ],
    expectedTotality: ['Sulphur', 'Graphites', 'Psorinum'],
    indicatedRemedy: 'Sulphur 200C'
  },
  {
    id: 'arsenicum-anxiety',
    timelineType: 'chronic',
    title: 'Nocturnal Wheezing with Anxious Restlessness',
    archetype: 'Deep Constitutional Respiratory',
    difficulty: 'Chronic Miasmatic Case',
    patientName: 'Kishore Joshi (54 / M / Accountant)',
    chiefComplaint: 'Recurrent midnight chest tightness and wheezing with sudden panic and cold sweat for 6 months.',
    openingStatement: "Good afternoon, Doctor. Thank you for fitting me into your schedule. For the past six months, I have been troubled by this distressing chest tightness and wheezing that wakes me up in the middle of the night. It leaves me feeling quite anxious and shaken, and I would appreciate your thorough assessment.",
    persona: {
      tone: 'neatly dressed, fastidious, organized folder, speaking with measured concern',
      background: 'Began after a severe respiratory flu last winter; lives with elderly spouse; detail-oriented accountant.',
      hiddenTruths: {
        sensation: 'Suffocative burning tightness in chest; burning sensations in epigastrium',
        thermal: 'Extremely chilly (< cold air, drafts; wears thermal innerwear indoors)',
        thirst: 'Thirst for frequent small sips of warm water; cold water feels heavy in stomach',
        cravings: 'Desires warm soups and hot tea; aversion to cold drinks or cold foods',
        modalities: {
          agg: 'Worse past midnight (1:00 AM to 2:00 AM), lying flat on back, cold weather',
          amel: 'Better sitting upright, warm drinks, warmth of room, presence of family'
        },
        bowels: 'Dry skin; frequent small offensive bowel motions when anxious',
        mind: 'Health anxiety, dread of serious illness, meticulous neatness, cannot bear mess'
      }
    },
    hints: [
      'Notice the exact manner in which the patient drinks fluids (large gulps vs small frequent sips).',
      'Explore what specific time of night the chest symptoms wake the patient from sleep.',
      'Observe emotional need for order, tidiness, and company during distress.'
    ],
    expectedTotality: ['Arsenicum Album', 'Pulsatilla', 'Kali Carbonicum'],
    indicatedRemedy: 'Arsenicum Album 200C'
  },
  {
    id: 'bryonia-chronic-arthritis',
    timelineType: 'chronic',
    title: 'Subacute Polyarticular Stiffness & Sharp Knee Pain',
    archetype: 'Rheumatic Fibrous Tissue',
    difficulty: 'Chronic Miasmatic Case',
    patientName: 'Devendra Nair (61 / M / Retired Bank Officer)',
    chiefComplaint: 'Stitching joint pain and severe stiffness in right knee and fingers, persisting for 9 months.',
    openingStatement: "Hello, Doctor. Over the past nine months, my joints—especially my right knee and knuckles—have become increasingly painful. Every single movement stings and aches. Even walking across the room to pick up the morning newspaper hurts, so I find myself just sitting very still in my armchair.",
    persona: {
      tone: 'deliberate, slow, irritable when disturbed or questioned rapidly',
      background: 'Gradual progression over past winter; retired from desk job; anxious about domestic finances.',
      hiddenTruths: {
        sensation: 'Stitching, tearing pains in joints and tendons as if sharp needles were driven into knee',
        thermal: 'Chilly body but intolerant of close warm room; desires cool breeze on forehead',
        thirst: 'Great thirst for large quantities of cold water at long intervals',
        cravings: 'Craves meat, cold drinks, coffee; aversion to milk and fatty foods',
        modalities: {
          agg: 'Worse from least motion, exertion, morning on beginning to move, heat of room',
          amel: 'Better from lying completely still on the painful side, firm hard pressure'
        },
        bowels: 'Obstinate constipation with dry, hard, burnt-looking stools as if burnt by fire',
        mind: 'Talks of business affairs when sick; irritable, wants to be left entirely alone'
      }
    },
    hints: [
      'Probe how motion affects the joint pain compared to absolute physical rest.',
      'Ask about fluid intake: frequency and volume of water consumed.',
      'Inquire about stool consistency and moisture.'
    ],
    expectedTotality: ['Bryonia Alba', 'Rhus Toxicodendron', 'Ledum Palustre'],
    indicatedRemedy: 'Bryonia Alba 200C'
  },
  {
    id: 'sepia-chronic-burnout',
    timelineType: 'chronic',
    title: 'Chronic Pelvic Heaviness, Exhaustion & Melancholy',
    archetype: 'Endocrine & Venous Stasis',
    difficulty: 'Chronic Miasmatic Case',
    patientName: 'Priyanka Deshmukh (41 / F / Homemaker & Part-Time Tutor)',
    chiefComplaint: 'Persistent pelvic bearing-down sensation, severe physical exhaustion, and low mood for over a year.',
    openingStatement: "Good morning, Doctor... thank you for seeing me. For more than a year now, I have felt this heavy dragging sensation down in my lower pelvis, as if everything is pressing down. On top of that, I wake up feeling completely drained of energy, and I feel emotionally disconnected from my daily routine.",
    persona: {
      tone: 'subdued, weary, speaks with flat affect, sits with legs crossed at ankles',
      background: 'Mother of two teenagers; heavy family responsibilities; hormonal transitions over 18 months.',
      hiddenTruths: {
        sensation: 'Bearing-down sensation in pelvis as if internal organs would protrude through vulva',
        thermal: 'Very chilly patient (< cold air, open wind; sensitive to cold drafts)',
        thirst: 'Thirstless in general; drinks very little throughout day',
        cravings: 'Craves sour things, vinegar, pickles; strong aversion to meat and fat',
        modalities: {
          agg: 'Worse from standing, cold damp weather, morning and evening',
          amel: 'Better from vigorous fast exercise, crossing legs tightly, hard pressure'
        },
        bowels: 'Sense of weight or ball in rectum not relieved by stool',
        mind: 'Indifference to loved ones and household duties; irritable with family; wants to be alone'
      }
    },
    hints: [
      'Ask whether crossing the legs provides physical support or relief from the pelvic sensation.',
      'Inquire into emotional temperament and feelings toward close family duties.',
      'Check distinctive food preferences (sour/acidic cravings vs fat aversion).'
    ],
    expectedTotality: ['Sepia Officinalis', 'Natrum Muriaticum', 'Pulsatilla'],
    indicatedRemedy: 'Sepia Officinalis 200C'
  },
  {
    id: 'calc-carb-pediatric',
    timelineType: 'chronic',
    title: 'Recurrent Nasopharyngeal Catarrh & Sleep Sweats',
    archetype: 'Nutritional & Glandular Pediatric',
    difficulty: 'Chronic Miasmatic Case',
    patientName: 'Little Aarav (6 / M) with Mother Sneha',
    chiefComplaint: 'Frequent recurrent colds, enlarged tonsils, and heavy sweating around the head during sleep.',
    openingStatement: "Hello, Doctor. We brought Aarav in because he catches a fresh cold almost every three weeks. Any slight change in the weather leaves him with swollen glands and a congested nose. Also, every night when he falls asleep, the back of his head and neck get so soaked in sweat that we have to change his pillowcase.",
    persona: {
      tone: 'warm, caring mother speaking for a chubby, bashful, slow-moving 6-year-old boy',
      background: 'Frequent missed school days due to adenoid and tonsillar swelling; sluggish milestones.',
      hiddenTruths: {
        sensation: 'Chronically enlarged cervical glands; cold damp feet even in warm weather',
        thermal: 'Extremely chilly patient (< cold damp weather, < cold drafts, wraps head warmly)',
        thirst: 'Drinks cold refreshing water; craves cold drinks',
        cravings: 'Craves boiled eggs, sweets, chalk/soil or pencils; aversion to milk and fatty meat',
        modalities: {
          agg: 'Worse cold air, damp weather, ascending stairs, physical exertion',
          amel: 'Better in dry warm climate, lying on back'
        },
        bowels: 'Feels better when constipated; pale soft stool',
        mind: 'Placid, slow, apprehensive of strangers, fears dark and monsters, obstinate when pushed'
      }
    },
    hints: [
      'Inquire into nocturnal perspiration patterns (especially around the head and pillow).',
      'Check peculiar childhood food cravings (eggs, sweets, or non-food items).',
      'Investigate temperature of the child’s feet during sleep.'
    ],
    expectedTotality: ['Calcarea Carbonica', 'Baryta Carbonica', 'Silicea'],
    indicatedRemedy: 'Calcarea Carbonica 200C'
  }
];
