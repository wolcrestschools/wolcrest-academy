import { ClassCurriculum, Department } from '../types';

export const LEADER_DEPARTMENTS: Department[] = [
  {
    name: "Sciences (STEM)",
    description: "Nurturing logical thinking, research excellence, and technological innovation.",
    subjects: [
      { name: "Mathematics", description: "Core calculations, algebra, trigonometry, and calculus. [General/Compulsory]" },
      { name: "English Language", description: "Constructive essays, list summaries, comprehension, and phonetics. [General/Compulsory]" },
      { name: "Biology", description: "Cell theory, ecosystem interactions, respiratory organs, and coordination. [General/Compulsory]" },
      { name: "Further Mathematics", description: "Calculus algorithms, vectors, coordinate geometry, and indices. [General/Compulsory]" },
      { name: "Civic Education", description: "Human rights, public administrative values, and responsibilities. [General/Compulsory]" },
      { name: "Economics", description: "Economic systems, demand and supply curves, inflation, and public finance. [General/Compulsory]" },
      { name: "Physics", description: "Mechanics, waves, thermal energy, electricity, magnetism, and nuclear structures." },
      { name: "Chemistry", description: "Organic structures, stoichiometric equations, raw rates, and laboratory assays." }
    ]
  },
  {
    name: "Arts & Humanities",
    description: "Developing cultural literacy, critical communication, civic responsibility, and aesthetic appreciation.",
    subjects: [
      { name: "Mathematics", description: "Core calculations, algebra, trigonometry, and calculus. [General/Compulsory]" },
      { name: "English Language", description: "Constructive essays, list summaries, comprehension, and phonetics. [General/Compulsory]" },
      { name: "Biology", description: "Cell theory, ecosystem interactions, respiratory organs, and coordination. [General/Compulsory]" },
      { name: "Further Mathematics", description: "Calculus algorithms, vectors, coordinate geometry, and indices. [General/Compulsory]" },
      { name: "Civic Education", description: "Human rights, public administrative values, and responsibilities. [General/Compulsory]" },
      { name: "Economics", description: "Economic systems, demand and supply curves, inflation, and public finance. [General/Compulsory]" },
      { name: "Yoruba", description: "Ìtúpalẹ̀ èdè Yorùbá, lítírésọ̀, àṣà àti ìṣe tí ó kún fún ọgbọ́n àti kókó ẹ̀kọ́." },
      { name: "Literature in English", description: "African and non-African drama, poetry, and narrative prose analysis." }
    ]
  },
  {
    name: "Commercial & Vocational Studies",
    description: "Empowering future finance leaders and entrepreneurs with strategic management skills.",
    subjects: [
      { name: "Mathematics", description: "Core calculations, algebra, trigonometry, and calculus. [General/Compulsory]" },
      { name: "English Language", description: "Constructive essays, list summaries, comprehension, and phonetics. [General/Compulsory]" },
      { name: "Biology", description: "Cell theory, ecosystem interactions, respiratory organs, and coordination. [General/Compulsory]" },
      { name: "Further Mathematics", description: "Calculus algorithms, vectors, coordinate geometry, and indices. [General/Compulsory]" },
      { name: "Civic Education", description: "Human rights, public administrative values, and responsibilities. [General/Compulsory]" },
      { name: "Economics", description: "Economic systems, demand and supply curves, inflation, and public finance. [General/Compulsory]" },
      { name: "Financial Accounting", description: "Ledgers, trial balance sheets, financial journals, and trading records." },
      { name: "Commerce", description: "Trade pathways, banking, corporate insurance, capital ports, and warehouses." }
    ]
  }
];

// Define common rich syllabi database lists to prevent massive duplicate declarations
const COMMON_TOPICS_REGISTRY = {
  english: [
    "Parts of Speech comprehensive analysis",
    "Comprehension & summary answer writing strategies",
    "Formal vs informal letter formats & essay composition",
    "Phonetics: vowel & consonant sound drills"
  ],
  math: [
    "Indices, logarithms, and standard index notation rules",
    "Quadratic equations: factorization & formula strategies",
    "Plane geometry & classic circle theorems",
    "Statistics: grouped data variance & standard deviations"
  ],
  yoruba: [
    "Ìpín-èdè Yorùbá: Fúnẹ́mù àti mọ́fímù",
    "Àṣà àti Ìṣe: Ìsọmọlórúkọ kókó ẹ̀kọ́",
    "Lítírésọ̀ Yorùbá: Àgbéyẹ̀wò ewì àti eré oníṣẹ́",
    "Ìtúpalẹ̀ Ìwé Àkàgbádùn tí a dábàá fún ìdánwò"
  ],
  civic: [
    "Values, national identity and civic responsibility foundations",
    "Human rights & civil protections under constitutional frameworks",
    "Agency operations: INEC and democratic electoral guidelines",
    "National integration and citizenship rights"
  ],
  socialStudies: [
    "The family structure & agency socialization values",
    "Culture and multi-ethnic integration in Nigeria",
    "Road safety guidelines and expressway codes",
    "International coalitions: UN, AU, and ECOWAS structures"
  ]
};

export const NIGERIAN_CURRICULUM: ClassCurriculum[] = [
  // GRADE 1-5 (Formerly Primary 1-5)
  {
    className: "Grade 1",
    level: "primary",
    subjects: [
      {
        name: "English Language",
        description: "Early alphabetics and phonetics integration.",
        topics: ["Phonetic sounds and simple pronunciation", "Identification of letters (Capital and small letters)", "Simple nouns & personal pronoun introduction", "Spelling short words (3-4 letters)"]
      },
      {
        name: "Mathematics",
        description: "Foundational numerical structures.",
        topics: ["Identification of numbers 1-100", "Simple addition & subtraction (single digits)", "Shapes & spatial figures (square, circle, triangle)", "Length & weight comparisons"]
      },
      {
        name: "Basic Science & Technology",
        description: "Exploring immediate physical environment.",
        topics: ["Our internal and external sense organs", "Living and non-living things in our surroundings", "Personal hygiene: teeth, skin, and nails", "Simple technology tools we use at home"]
      },
      {
        name: "Social Studies",
        description: "Understanding immediate social circles.",
        topics: ["The family unit structure (nuclear vs extended)", "Duties of family members according to guidelines", "Respecting elders and peer collaboration", "Safety tips on our way to school"]
      },
      {
        name: "Nigerian History",
        description: "Foundational events and pioneers.",
        topics: ["Our heroes past: Herbert Macaulay, Nnamdi Azikiwe", "Simple historical stories of Nigeria's founding"]
      },
      {
        name: "Civic Education",
        description: "Meaning of values and citizenship.",
        topics: ["Meaning of civic education and core values", "Our national symbols: flag, anthem, and pledge"]
      },
      {
        name: "Home Economics",
        description: "Self-hygiene and domestic tools.",
        topics: ["Personal hygiene and washing our hands", "Identifying kitchen utensils and safe handling"]
      },
      {
        name: "Fine Arts",
        description: "Introduction to colors and drawing.",
        topics: ["Drawing and coloring simple shapes", "Introduction to primary colors"]
      },
      {
        name: "CCA",
        description: "Cultural and Creative Arts foundations.",
        topics: ["Singing simple traditional folk songs", "Making paper shapes and simple crafts"]
      }
    ]
  },
  {
    className: "Grade 2",
    level: "primary",
    subjects: [
      {
        name: "English Language",
        description: "Syntactic structure amplification.",
        topics: ["Plurals of nouns using 's' and 'es'", "Verb actions (presents and continuous tenses)", "Reading simple stories and comprehension checks", "Constructing simple structural sentences"]
      },
      {
        name: "Mathematics",
        description: "Extended numbering and counting concepts.",
        topics: ["Counting and writing numbers up to 500", "Place value of units, tens, and hundreds", "Simple fractions introduction (half, quarter)", "Addition and subtraction of double-digit values with carrying"]
      },
      {
        name: "Basic Science & Technology",
        description: "Intermediate physical dynamics.",
        topics: ["The air around us and its characteristics", "Sources and clean purification of water", "Soil varieties: clay, sand, and loam", "Components of a standard computer (monitor, keyboard)"]
      },
      {
        name: "Social Studies",
        description: "Expanding civic awareness and community ties.",
        topics: ["The school structure and administrative hierarchy", "Developing civic values: honesty, patience, and courage", "Drug abuse precautions: dangerous pills", "Nigerian national symbols: flag, crest, and anthem"]
      },
      {
        name: "Nigerian History",
        description: "Sovereignty stories and leaders.",
        topics: ["Nigeria's independence story in simple words", "Traditional rulers and their ancient kingdoms"]
      },
      {
        name: "Civic Education",
        description: "Rules and local community care.",
        topics: ["Rules at home, school, and on the street", "Meaning of community and helping others"]
      },
      {
        name: "Home Economics",
        description: "Body maintenance and food safety.",
        topics: ["Care of our body: hair, teeth, skin, and nails", "Basic foodstuffs and identifying healthy foodgroups"]
      },
      {
        name: "Fine Arts",
        description: "Paper modeling and secondary colors.",
        topics: ["Creating paper collages and color mixing", "Introduction to secondary colors"]
      },
      {
        name: "CCA",
        description: "Aesthetic integration and folklore.",
        topics: ["Simple traditional dances and keeping rhythm", "Introduction to local storytelling and folklore"]
      }
    ]
  },
  {
    className: "Grade 3",
    level: "primary",
    subjects: [
      {
        name: "English Language",
        description: "Introduction of descriptors and structural grammar.",
        topics: ["Adjectives and comparison matching ('tallest', etc)", "Simple prepositions (in, on, under, between)", "Creative composition: writing a letter to a best friend", "Expanding vocabulary words via spelling lists"]
      },
      {
        name: "Mathematics",
        description: "Foundational arithmetic operation expansions.",
        topics: ["Multiplication tables from 2 to 12", "Long division concepts under 100", "Adding and subtracting money operations", "Measurement of perimeter and basic surface areas"]
      },
      {
        name: "Basic Science & Technology",
        description: "Biological and physical phenomena.",
        topics: ["Plants system: roots, stems, leaves, and photosynthesis", "Feeding habits of various farm animals", "Energy types (light, heat, sound) and primary sources", "Using basic internet search modules for learning"]
      },
      {
        name: "Social Studies",
        description: "Regional awareness.",
        topics: ["Understanding local government structures in Nigeria", "Cultural diversity: traditional food, dances, and dress models", "General rules and safety precautions on major Nigerian expressways", "Traditional leadership hierarchy (Emirs, Obas, Obis)"]
      },
      {
        name: "Nigerian History",
        description: "Famous empires and national sites.",
        topics: ["Famous historical empires: Benin, Kano, Oyo", "National historical monuments and historic sites"]
      },
      {
        name: "Civic Education",
        description: "National pride and character values.",
        topics: ["Meaning of national identity and proud citizenship", "Developing good morals and respectful values"]
      },
      {
        name: "Home Economics",
        description: "Garment care and nutrition guidelines.",
        topics: ["Washing our personal clothes and simple sewing", "Balanced diet: major nutrients and meal planning"]
      },
      {
        name: "Fine Arts",
        description: "Still life sketching and texture.",
        topics: ["Drawing and painting of real-life objects", "Introduction to texture, pattern, and design"]
      },
      {
        name: "CCA",
        description: "Drama production and local crafts.",
        topics: ["Basic drama terms and acting simple school plays", "Local craft making: weaving, bead stringing, and origami"]
      }
    ]
  },
  {
    className: "Grade 4",
    level: "primary",
    subjects: [
      {
        name: "English Language",
        description: "Grammatical syntax and formal composition.",
        topics: ["Direct and indirect speech structures", "Irregular verbs and past tenses", "Formal letter writing: structure of official letters", "Reading and evaluating classic Nigerian folklore"]
      },
      {
        name: "Mathematics",
        description: "Advanced numerical structures and percentages.",
        topics: ["Roman numerals up to C (100)", "Decimals and conversion to simple fractions", "Introduction to percentage concepts", "Calculating areas of rectangles and squares"]
      },
      {
        name: "Basic Science & Technology",
        description: "Mechanics and environmental science.",
        topics: ["Water pollution of streams: triggers and effects", "Standard components of the solar system (9 planets)", "Simple machines: levers, pulleys, and wedges", "Computer software programs: Microsoft Word introduction"]
      },
      {
        name: "Social Studies",
        description: "National geographical overview.",
        topics: ["Natural resources in Nigeria: crude oil, coal, tin", "Modern and traditional communication mechanisms", "Core causes and prevention of community violence", "Conservation of electricity and resources"]
      },
      {
        name: "Nigerian History",
        description: "Amalgamation and nationhood achievements.",
        topics: ["Amalgamation in 1914: the union of Northern & Southern provinces", "Major historical achievements of post-independence leaders"]
      },
      {
        name: "Civic Education",
        description: "Duties, responsibilities, and safety.",
        topics: ["The roles of citizenship, duties, and responsibilities", "First-aid procedures and emergency safety measures"]
      },
      {
        name: "Home Economics",
        description: "Housekeeping and culinary safety.",
        topics: ["Caring for the home: sweeping, dusting, and waste disposal", "Basic food preparation, boiling, and simple baking methods"]
      },
      {
        name: "Fine Arts",
        description: "Shading, patterns, and lettering.",
        topics: ["Introduction to light and shade in drawing", "Designing decorative patterns and lettering crafts"]
      },
      {
        name: "CCA",
        description: "Instrumentals and clay sculpture.",
        topics: ["Traditional music instruments of different Nigerian cultures", "Creating simple clay models and paper maché masks"]
      }
    ]
  },
  {
    className: "Grade 5",
    level: "primary",
    subjects: [
      {
        name: "English Language",
        description: "Comprehensive parsing and analytical essays.",
        topics: ["Understanding active and passive voice constructions", "Homophones, synonyms, antonyms, and dictionary studies", "Narrative and argumentative composition strategies", "Idiomatic expressions and common Nigerian proverbs"]
      },
      {
        name: "Mathematics",
        description: "Ultimate grade syllabus preparation for Common Entrance.",
        topics: ["Average, ratio, and proportional scaling", "Highest Common Factor (HCF) and Lowest Common Multiple (LCM)", "Simple interest calculations and compound rates", "Algebraic expressions: balancing equations"]
      },
      {
        name: "Basic Science & Technology",
        description: "Pre-secondary science foundation.",
        topics: ["Standard human circulatory and digestive systems", "Habitats of aquatic vs terrestrial animals", "Electricity: parallel and series circuits, batteries", "Safe handling of computing files and folder structure"]
      },
      {
        name: "Social Studies",
        description: "National unity, citizenship, and integration.",
        topics: ["The Nigerian Constitution and fundamental human rights", "The three levels of government: Federal, State, and Local", "Promoting unity in diversity: historical heroes", "Major environmental hazards: erosion, oil spills, desertification"]
      },
      {
        name: "Nigerian History",
        description: "Independence Day and governance republics.",
        topics: ["Detailed story of 1st October 1960 Independence Day", "Democratic governance structure: first to fourth republics"]
      },
      {
        name: "Civic Education",
        description: "The Constitution and government organs.",
        topics: ["Fundamental human rights as outlined in the Constitution", "Understanding government organs: executive, legislative, judiciary"]
      },
      {
        name: "Home Economics",
        description: "Kitchen sanitation and apparel fix.",
        topics: ["Kitchen sanitation, hygiene, and dynamic food storage", "Clothing maintenance: darning, sewing buttons, and ironing safely"]
      },
      {
        name: "Fine Arts",
        description: "Vanishing point perspectives and landscapes.",
        topics: ["Perspective drawing: 1-point and 2-point horizons", "Creating landscape painting and aesthetic compositions"]
      },
      {
        name: "CCA",
        description: "Theatrical production guidelines and art fairs.",
        topics: ["Theatrical production steps: rehearsing and modern staging", "Traditional crafts marketing and simple exhibition setups"]
      }
    ]
  },
  // JUNIOR SECONDARY (JSS 1-3)
  {
    className: "JSS 1",
    level: "junior_secondary",
    subjects: [
      {
        name: "English Language",
        description: "Standard descriptive linguistics and parsing.",
        topics: COMMON_TOPICS_REGISTRY.english
      },
      {
        name: "Mathematics",
        description: "Transitioning to algebra.",
        topics: ["Prime numbers, factors, and index notation", "Binary numbers addition, subtraction, and conversion", "Venn diagrams: union and intersection of sets", "Simple algebraic equations"]
      },
      {
        name: "Basic Science",
        description: "Introductory general science.",
        topics: ["Structure of matter and states of aggregation", "Characteristics and classification of living things", "Force: gravity, friction, thrust, and magnetic pull", "Ecosystem organization: biotic and abiotic interaction"]
      },
      {
        name: "Social Studies",
        description: "Social and cultural values baseline.",
        topics: COMMON_TOPICS_REGISTRY.socialStudies
      },
      {
        name: "Yoruba",
        description: "Ìbẹ̀rẹ̀ ẹ̀kọ́ èdè, àṣà àti lítírésọ̀ tí ó níye lórí.",
        topics: COMMON_TOPICS_REGISTRY.yoruba
      },
      {
        name: "Civic Education",
        description: "Basic human values and citizenship rights.",
        topics: COMMON_TOPICS_REGISTRY.civic
      }
    ]
  },
  {
    className: "JSS 2",
    level: "junior_secondary",
    subjects: [
      {
        name: "English Language",
        description: "Comprehension depth, passive constructions and essays.",
        topics: COMMON_TOPICS_REGISTRY.english
      },
      {
        name: "Mathematics",
        description: "Approximation and basic plane geometry.",
        topics: ["Approximations, percentage errors and significant figures", "Expansion of algebraic expressions and substitution", "Linear equations in one or two variables", "Properties of triangles and parallel lines"]
      },
      {
        name: "Basic Science",
        description: "Intermediate biological and physical studies.",
        topics: ["Human skeletal system, joints, and muscular actions", "Chemical symbols, formulas, and simple equations", "Thermal energy: conduction, convection, and radiation", "Environmental pollution: sanitation guidelines"]
      },
      {
        name: "Social Studies",
        description: "Social environment and safety rules.",
        topics: COMMON_TOPICS_REGISTRY.socialStudies
      },
      {
        name: "Yoruba",
        description: "Ìgbélárugẹ ẹ̀kọ́ Yorùbá fún JSS 2.",
        topics: COMMON_TOPICS_REGISTRY.yoruba
      },
      {
        name: "Civic Education",
        description: "National symbols, Constitution values and integrity.",
        topics: COMMON_TOPICS_REGISTRY.civic
      }
    ]
  },
  {
    className: "JSS 3",
    level: "junior_secondary",
    subjects: [
      {
        name: "English Language",
        description: "Preparation for BECE language standards.",
        topics: COMMON_TOPICS_REGISTRY.english
      },
      {
        name: "Mathematics",
        description: "Preparation for BECE algebraic, geometric topics.",
        topics: ["Factoring algebraic expressions completely", "Solving quadratic equations by factorization", "Trigonometric ratios of acute angles (sin, cos, tan)", "Areas of composite shapes and cylinder volumes"]
      },
      {
        name: "Basic Science",
        description: "Advanced general science preparation.",
        topics: ["Atomic structure: protons, neutrons, electrons", "Acids, bases, and simple neutralizations", "Genetic heredity basics and family traits", "Simple series and parallel electrical circuit connections"]
      },
      {
        name: "Social Studies",
        description: "Pre-senior secondary review.",
        topics: COMMON_TOPICS_REGISTRY.socialStudies
      },
      {
        name: "Yoruba",
        description: "Ìpinto àwọn kókó ẹ̀kọ́ Yorùbá fún ìdánwò BECE.",
        topics: COMMON_TOPICS_REGISTRY.yoruba
      },
      {
        name: "Civic Education",
        description: "National security, state organs, and constitution duties.",
        topics: COMMON_TOPICS_REGISTRY.civic
      }
    ]
  },
  // SENIOR SECONDARY (SSS 1-3)
  {
    className: "SSS 1",
    level: "senior_secondary",
    subjects: [
      {
        name: "English Language",
        description: "Universal senior comprehension and letter models.",
        topics: COMMON_TOPICS_REGISTRY.english
      },
      {
        name: "Mathematics",
        description: "Introductory senior level geometry and logs.",
        topics: COMMON_TOPICS_REGISTRY.math
      },
      {
        name: "Yoruba",
        description: "Lítírésọ̀ Yorùbá àti àwọn kókó ìwé kíkà.",
        topics: COMMON_TOPICS_REGISTRY.yoruba
      },
      {
        name: "Civic Education",
        description: "Constitutional structure, civic values, and state roles.",
        topics: COMMON_TOPICS_REGISTRY.civic
      },
      {
        name: "CCA",
        description: "Cultural and Creative Arts: exploring traditional music, drama, and artistic crafts.",
        topics: ["Fine arts techniques and shading", "Traditional Nigerian pottery and crafts", "Introduction to play writing and choreography", "Exhibitions and gallery curation"]
      },
      {
        name: "Nigerian History",
        description: "Sovereign historical milestones and traditional government.",
        topics: ["Pre-colonial kingdoms: Oyo, Benin, Sokoto, Kanem-Borno", "Early trade routes and trans-saharan trade networks", "Contact with Europeans: early trade and cultural exchange", "Traditional governance structures and custom laws"]
      },
      // Science Specific
      {
        name: "Physics",
        description: "Newtonian mechanics and physical variables analysis.",
        topics: ["Vectors vs scalar analysis", "Linear motion equations, velocity-time graph structures", "Work, energy, power conversions", "Thermodynamics: expansion, specific heat capacities"]
      },
      {
        name: "Chemistry",
        description: "Periodic table layouts and molecular composition states.",
        topics: ["Dalton's atomic theory and atomic orbitals", "The Periodic Table: periodic trends across periods and groups", "Chemical bonding: covalent, electrovalent, metallic, hydrogen bonds", "Stoichiometry: the mole concept, molecular and empirical formula"]
      },
      // Arts Specific
      {
        name: "Literature in English",
        description: "Comprehensive WAEC listed African drama and prose.",
        topics: ["African Drama analysis: structural setups", "Non-African poetry figures and metaphors", "Evaluating prose themes & central characters"]
      },
      // Commercial Specific
      {
        name: "Financial Accounting",
        description: "Double-entry bookkeeping, balances and ledger registers.",
        topics: ["Principles of double-entry ledger book accounts", "Trial balances composition and cashbook structures", "Ledgers adjustments: accruals & prepayments"]
      },
      {
        name: "Commerce",
        description: "Retail and wholesale trade routes in West Africa.",
        topics: ["Foundations of international and local trade", "Types of business organizations and logistics", "Marketing, sales, and retail functions"]
      }
    ]
  },
  {
    className: "SSS 2",
    level: "senior_secondary",
    subjects: [
      {
        name: "English Language",
        description: "WAEC-driven descriptive models and summary parsing.",
        topics: COMMON_TOPICS_REGISTRY.english
      },
      {
        name: "Mathematics",
        description: "Arithmetic/Geometric progression and trig properties.",
        topics: COMMON_TOPICS_REGISTRY.math
      },
      {
        name: "Yoruba",
        description: "Ìsọmọlórúkọ Yorùbá, lítírésọ̀ àti àkàgbádùn tuntun.",
        topics: COMMON_TOPICS_REGISTRY.yoruba
      },
      {
        name: "Civic Education",
        description: "Human rights organizations issues and constitutional amendments.",
        topics: COMMON_TOPICS_REGISTRY.civic
      },
      {
        name: "CCA",
        description: "Cultural and Creative Arts advanced paradigms.",
        topics: ["Advanced watercolor painting and canvas composition", "Sculpture molding and clay models", "Contemporary African dance and theater", "Copyright laws and arts marketing"]
      },
      {
        name: "Nigerian History",
        description: "Nationalist struggles, amalgamation, and integration.",
        topics: ["Amalgamation of Nigeria in 1914 and Lord Lugard's policies", "The rise of nationalist movements and frontrunners", "The Clifford and Richards Constitutions of early statehood", "Impact of colonial rule on traditional economies"]
      },
      // Science Specific
      {
        name: "Physics",
        description: "Waves, light refraction, index, and electric fields.",
        topics: ["Waves: propagation, speed, echo, and reflection", "Reflection and refraction of light, lenses, mirrors, thin prism formulas", "Electrostatics: Coulomb's law, electric field intensity", "Current electricity: Ohm's law, resistors in series and parallel"]
      },
      {
        name: "Chemistry",
        description: "Boyle/Charles laws, volumetric ratios, and organic entries.",
        topics: ["Gas Laws: Boyle's, Charles', Ideal Gas, Graham's law", "Acid, Base, Salt, and volumetric titrations", "Chemical kinetics: rate of reaction, equilibrium states", "Introduction to organic chemistry: Alkanes, Alkenes, Alkynes"]
      },
      // Arts Specific
      {
        name: "Literature in English",
        description: "Intermediate prose reviews and classic poetical metrics.",
        topics: ["Analysis of recommended African novels", "Classical non-African drama: Shakespearean prose", "Advanced poetic structures and rhyme parsing"]
      },
      // Commercial Specific
      {
        name: "Financial Accounting",
        description: "Partnerships balances and institutional journals.",
        topics: ["Partnership trading and profit allocation accounts", "Adjusting balance sheets for depreciation assets", "Capital accounts and banking reconciliations"]
      },
      {
        name: "Commerce",
        description: "Banking operations, warehousing, and logistics.",
        topics: ["Modern commercial banking, deposit rules, credit", "Warehousing strategies and supply chains", "Direct advertising networks and branding"]
      }
    ]
  },
  {
    className: "SSS 3",
    level: "senior_secondary",
    subjects: [
      {
        name: "English Language",
        description: "Final post-graduation masterclass and oral testing.",
        topics: COMMON_TOPICS_REGISTRY.english
      },
      {
        name: "Mathematics",
        description: "Advanced calculus, sphere theorem, longitude/latitude distance calculations.",
        topics: COMMON_TOPICS_REGISTRY.math
      },
      {
        name: "Yoruba",
        description: "Ìròyìn kíkà, àròkọ ìgbéyàwó àti lítírésọ̀ fún WAEC.",
        topics: COMMON_TOPICS_REGISTRY.yoruba
      },
      {
        name: "Civic Education",
        description: "Global citizenship, peaceful resolution of civil disputes.",
        topics: COMMON_TOPICS_REGISTRY.civic
      },
      {
        name: "CCA",
        description: "Cultural and Creative Arts senior portfolio.",
        topics: ["Art historical timelines: Nok, Benin, and Igbo-Ukwu arts", "Creating set designs for major drama productions", "Exhibition planning and portfolio development", "Digital illustration and graphic design structures"]
      },
      {
        name: "Nigerian History",
        description: "Post-colonial governance and world affairs.",
        topics: ["The 1960 Independence and First Republic structures", "The Civil War: causes, key events, and reconciliation policies", "The transition to democratic rule and the Fourth Republic", "Nigeria in global affairs: UN, ECOWAS, AU leadership roles"]
      },
      // Science Specific
      {
        name: "Physics",
        description: "Radioactivity components, Faraday rules, and electromagnetism.",
        topics: ["Electromagnetic induction: Faraday's and Lenz's laws, transformers", "AC Circuits: reactance, impedance, resonant frequency formulas", "Modern Physics: radioactivity, isotopes, nuclear fusion and fission", "Photoelectric effect: Einstein's equation, quantum mechanics intro"]
      },
      {
        name: "Chemistry",
        description: "Faraday electro-solution, organic esters, and qualitative analysis.",
        topics: ["Electrochemical cells: Faraday's laws of electrolysis", "Organic Chemistry II: Alkanols, alkanoic acids, esters, soaps/detergents", "Qualitative analysis: identifying cation and anion precipitates", "Industrial Chemistry: Haber process, contact process, petroleum refining"]
      },
      // Arts Specific
      {
        name: "Literature in English",
        description: "WAEC literature syllabus final preps.",
        topics: ["African Proverbial novels and literal motifs", "Analysis of epic African poetical compositions", "Analyzing and critiquing unseen dramatic plays"]
      },
      // Commercial Specific
      {
        name: "Financial Accounting",
        description: "Joint ventures ledger books and final audits.",
        topics: ["Dynamic Cash flows reporting statements", "Incomplete accounting records and single-entry structures", "Introductory elements of corporate audit protocols"]
      },
      {
        name: "Commerce",
        description: "E-Commerce foundations, chambers of commerce, and business registrations.",
        topics: ["Chambers of commerce operations & trade fairs", "E-commerce structures and cyber securities", "Standard business dissolution procedures"]
      }
    ]
  }
];
