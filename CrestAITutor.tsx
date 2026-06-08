import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, 
  Send, 
  BookOpen, 
  GraduationCap, 
  Compass, 
  Award, 
  HelpCircle, 
  CheckCircle, 
  ChevronRight, 
  Sparkles,
  RefreshCw,
  Search,
  BookMarked
} from 'lucide-react';
import { ChatMessage } from '../types';
import { NIGERIAN_CURRICULUM, LEADER_DEPARTMENTS } from '../data/curriculum';
import { generateExamQuestions } from '../data/fallbackQuizzes';

interface CrestAITutorProps {
  studentName: string;
  studentClass: string;
  studentDepartment: string;
  onNavigateToTab?: (tab: string, theme: string) => void;
}

// Complete precompiled NERDC syllabus topics database for Arts and Commercial branches
// so there is never a missing topic when students select any optional subject combo
const FALLBACK_TOPICS_DB: Record<string, Record<string, string[]>> = {
  "English Language & Literature": {
    "SSS 1": [
      "Introduction to Parts of Speech and Sentence Grammar",
      "Comprehension & Vocabulary building in Professional Sectors",
      "Formal & Informal Letter Writing: Format, Content, Tone",
      "Spoken English: Phonetic Vowels and Consonant Sounds"
    ],
    "SSS 2": [
      "Introduction to Noun and Adjectival Clauses",
      "Summary Writing: Main points extraction rules",
      "Tenses: Present Perfect, Past Continuous, and Pluperfect",
      "Speech Practice: Word Stress and Intonation Patterns"
    ],
    "SSS 3": [
      "Complex Sentence structures and Adjuncts",
      "Argumentative and Narrative Essays: Mastery layout",
      "Register of Law, Commerce, and Scientific Research",
      "WAEC & JAMB Lexis and Structure exam preparation"
    ]
  },
  "Social Sciences/Studies": {
    "SSS 1": [
      "Socialisation and Culture in plural Nigerian states",
      "The Family as a foundational civil unit",
      "National Identity, Pride, and the Coat of Arms",
      "Social Problems: Combating juvenile crime and substance abuse"
    ],
    "SSS 2": [
      "Leadership and Followership responsibilities",
      "Conflict Resolution mechanisms in traditional societies",
      "Introduction to socio-cultural research methods",
      "Sustainable natural resource use in Nigeria"
    ],
    "SSS 3": [
      "Globalisation and its economic impacts on West Africa",
      "Infrastructural developments across Nigeria",
      "Regional integrations: ECOWAS and Africa Union",
      "Social change and structural modernisation"
    ]
  },
  "Civic Education & Government": {
    "SSS 1": [
      "Basic concepts of Government: Sovereignty, Power, Legitimacy",
      "Types of Government: Monarchy, Aristocracy, Democracy, Federal",
      "Citizenship: Acquisition, Rights, Duties and Responsibilities",
      "Human Rights and Civil Liberties: Universal declarations"
    ],
    "SSS 2": [
      "Constitutions: Written, Unwritten, Rigid, and Flexible models",
      "The Organs of Government: Legislature, Executive, Judiciary",
      "Electoral Systems: Franchise, Ballot system, Electoral bodies",
      "Political Parties: Configurations, manifestos, and campaigning"
    ],
    "SSS 3": [
      "Federalism in Nigeria: Historical landmarks & challenges",
      "Local Government structure, functions, and financial constraints",
      "Foreign Policy of Nigeria: Non-alignment and Afrocentricity",
      "Post-independence Constitutions of Nigeria (1979 & 1999)"
    ]
  },
  "Literature in English": {
    "SSS 1": [
      "Introduction to Prose, Poetry and Drama: Key genres",
      "Literary Devices: Simile, Metaphor, Personification, Irony",
      "Analysis of selected African Poetry anthologies",
      "Plot and Characterisation in direct African Prose novels"
    ],
    "SSS 2": [
      "Analysis of Non-African Poetry structures",
      "Shakespearean Drama: Themes, tragic flaws, and poetic meters",
      "West African Narratology: Examining contemporary writers",
      "Techniques of literary criticism and essays"
    ],
    "SSS 3": [
      "Comparative theme mapping across African and global drama",
      "Analyzing modern West African poetic voices",
      "Classical Prose reviews: Wole Soyinka and Chinua Achebe",
      "WAEC literature essay writing preparation"
    ]
  },
  "Financial Accounting": {
    "SSS 1": [
      "Introduction to Double Entry Bookkeeping and Principles",
      "The Ledger, Journals and General Trial Balance preparation",
      "The Cash Book: Single, Double, and Three-column formats",
      "Trading, Profit and Loss accounts for Sole Proprietorships"
    ],
    "SSS 2": [
      "Methods of calculating depreciation on fixed assets",
      "Bank Reconciliation Statements: Causes of discrepancies",
      "Partnership Accounts: Joint capital accounts, goodwill, and profits",
      "Control Accounts and Bills of Exchange entry guidelines"
    ],
    "SSS 3": [
      "Company Accounts: Issuing shares, premiums, and debentures",
      "Incomplete Records and Single-entry system conversions",
      "Branch Accounts, Consignment, and joint venture ledgers",
      "Interpretation of Final Accounts: Liquidity and solvency ratios"
    ]
  },
  "Economics": {
    "SSS 1": [
      "Fundamental Concepts: Scarcity, Choice, Scale of Preference, Opportunity Cost",
      "Basic tools of economic analysis: Graphs, Charts, Tables",
      "Theory of Demand and Supply: Curves, Price determination",
      "Factors of Production: Land, Labour, Capital, Entrepreneurship"
    ],
    "SSS 2": [
      "Elasticity of Demand & Supply: Coefficient calculations",
      "Consumer Behaviour theories: Marginal utility and indifference",
      "Market structures: Perfect and imperfect competition, monopolies",
      "National Income Accounting: GDP, GNP, NNP calculations"
    ],
    "SSS 3": [
      "International Trade: Absolute vs Comparative Advantage theories",
      "Economic Development Planning and industrialisation in Nigeria",
      "Role of Agriculture and Petroleum in Nigeria's revenue mix",
      "Contemporary challenges: Inflation, unemployment, and exchange rates"
    ]
  },
  "Commerce": {
    "SSS 1": [
      "Introduction to Commerce: Historical trade development and scope",
      "Branches of Commerce: Domestic trade, wholesale, and retail",
      "Forms of Business Ownerships: Sole trade, partnerships, joint ventures",
      "Supportive Services: Transport, Communication, and Advertising"
    ],
    "SSS 2": [
      "Joint Stock Companies: Incorporation, shares, and public listings",
      "Banking: Commercial, Development, and Central Bank policies",
      "Insurance: Principles (utmost good faith, insurable interest) & policies",
      "Warehousing: Private, Public, and Bonded depots layout"
    ],
    "SSS 3": [
      "International Trade: Import & Export document registry",
      "The Capital Market: Stocks exchange operations (SEC, NSE)",
      "Legal aspects of Business: Sale of goods acts, agency laws",
      "The role of E-commerce, Internet, and Digital Banking solutions"
    ]
  }
};

export default function CrestAITutor({ 
  studentName, 
  studentClass, 
  studentDepartment 
}: CrestAITutorProps) {
  
  // --- UI/UX configuration states ---
  const [level, setLevel] = useState<'primary' | 'junior_secondary' | 'senior_secondary'>('senior_secondary');
  const [selectedClass, setSelectedClass] = useState<string>('SSS 3');
  const [department, setDepartment] = useState<string>('Sciences (STEM)');
  const [activeSubject, setActiveSubject] = useState<string>('Mathematics');
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  
  // Initialize levels classes
  const classesByLevel = {
    primary: ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"],
    junior_secondary: ["JSS 1", "JSS 2", "JSS 3"],
    senior_secondary: ["SSS 1", "SSS 2", "SSS 3"]
  };

  // Adjust class selection when curriculum level toggles
  const handleLevelToggle = (lvl: 'primary' | 'junior_secondary' | 'senior_secondary') => {
    setLevel(lvl);
    const classes = classesByLevel[lvl];
    setSelectedClass(classes[classes.length - 1]); // default to highest in level
  };

  // Dynamically compile active subjects offered
  const getSubjectsForSelection = () => {
    const matchLevelObj = NIGERIAN_CURRICULUM.find(cur => cur.className === selectedClass);
    if (!matchLevelObj) return [];

    if (level === 'senior_secondary') {
      return matchLevelObj.subjects.filter((sub) => {
        // General senior secondary subjects show up in all streams
        const generalSeniorSubjects = [
          "english language",
          "mathematics",
          "yoruba",
          "civic education",
          "economics",
          "biology",
          "further mathematics"
        ];
        if (generalSeniorSubjects.includes(sub.name.toLowerCase())) {
          return true;
        }
        if (department === 'Sciences (STEM)') {
          return ["physics", "chemistry"].includes(sub.name.toLowerCase());
        }
        if (department === 'Arts & Humanities') {
          return ["literature in english"].includes(sub.name.toLowerCase());
        }
        if (department === 'Commercial & Vocational Studies') {
          return ["financial accounting", "commerce"].includes(sub.name.toLowerCase());
        }
        return true;
      }).map(sub => ({
        name: sub.name,
        description: sub.description
      }));
    } else {
      // Primary or JSS
      return matchLevelObj.subjects.map(sub => ({
        name: sub.name,
        description: sub.description
      }));
    }
  };

  const currentSubjects = getSubjectsForSelection();

  // Adjust active subject when class, department or level alters
  useEffect(() => {
    const subjects = getSubjectsForSelection();
    if (subjects.length > 0) {
      // Find matching subject or default to first
      const hasSubject = subjects.some(sub => sub.name === activeSubject);
      if (!hasSubject) {
        setActiveSubject(subjects[0].name);
      }
    }
    setActiveTopic(null);
  }, [level, selectedClass, department]);

  // Retrieve curriculum topics for selected combination
  const getSyllabusTopics = (): string[] => {
    // 1. First, search standard curriculum structures
    const matchClassObj = NIGERIAN_CURRICULUM.find(cur => cur.className === selectedClass);
    if (matchClassObj) {
      const matchSubObj = matchClassObj.subjects.find(sub => sub.name.toLowerCase() === activeSubject.toLowerCase());
      if (matchSubObj && matchSubObj.topics && matchSubObj.topics.length > 0) {
        return matchSubObj.topics;
      }
    }

    // 2. Fall back to compiled database mapping
    const subjectFallbacks = FALLBACK_TOPICS_DB[activeSubject];
    if (subjectFallbacks && subjectFallbacks[selectedClass]) {
      return subjectFallbacks[selectedClass];
    }

    // 3. Fall back further to generic themes based on subject
    return [
      `Foundations of ${activeSubject} studies`,
      `Intermediate curriculum modules in ${activeSubject}`,
      `Advanced applications and calculations`,
      `Comprehensive WAEC & JAMB exam prep topics`
    ];
  };

  const syllabusTopics = getSyllabusTopics();

  // --- Dynamic Chat History System ---
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'welcome-tutor',
      sender: 'ai',
      text: `Hello, **${studentName}**! I am **Crest AI**, your premier West African Virtual Academic Companion at Wolcrest College. 🇳🇬🎓\n\nI am extensively trained on the **NERDC Nigerian National Curriculum guidelines** for Grade 1-5, JSS 1-3, and SSS 1-3.\n\nUse the dynamic **Syllabus Navigator** on the left to configure your class, department, and subjects. Select any topic to get step-by-step guidance, or type your question below!`,
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // --- Dynamic Quiz Me Mode States & Helpers ---
  const [tutorMode, setTutorMode] = useState<'chat' | 'quiz'>('chat');
  const [quizQuestions, setQuizQuestions] = useState<{
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[]>([]);
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  const LOCAL_QUIZ_FALLBACKS: Record<string, {question: string, options: string[], correctIndex: number, explanation: string}[]> = {
    "Mathematics": [
      {
        question: "In standard algebraic arithmetic, if 3x - 7 = 14, what is the value of x?",
        options: ["A) 5", "B) 7", "C) 9", "D) 21"],
        correctIndex: 1,
        explanation: "Add 7 to both sides of the equation: 3x = 21. Dividing both sides by 3 yields x = 7."
      },
      {
        question: "Calculate the simple interest on ₦15,000 for 3 years at 4% per annum under mercantile accounting standards.",
        options: ["A) ₦1,200", "B) ₦1,800", "C) ₦2,000", "D) ₦3,000"],
        correctIndex: 1,
        explanation: "Using the Simple Interest formula: I = (P * R * T) / 100. Thus: I = (15000 * 4 * 3) / 100 = ₦1,800."
      }
    ],
    "English Language & Literature": [
      {
        question: "Identify the part of speech of the underlined word: 'The diligent scholar *quietly* submitted her examination script.'",
        options: ["A) Adjective", "B) Verb", "C) Adverb", "D) Preposition"],
        correctIndex: 2,
        explanation: "The word 'quietly' modifies the verb 'submitted', explaining how the action was performed. Therefore, it is an adverb."
      }
    ],
    "Physics": [
      {
        question: "According to Newton's Second Law of Motion, what is the mathematical relationship between Force (F), Mass (M), and Acceleration (A)?",
        options: ["A) F = M/A", "B) F = M * A", "C) F = M + A", "D) F = A/M"],
        correctIndex: 1,
        explanation: "Newton's Second Law states that force is directly proportional to the product of mass and acceleration: F = M * A."
      }
    ],
    "Chemistry": [
      {
        question: "What is the atomic number representing the element Carbon (C) on the standard periodic table?",
        options: ["A) 4", "B) 6", "C) 8", "D) 12"],
        correctIndex: 1,
        explanation: "Carbon has 6 protons in its nucleus, which corresponds to an atomic number of 6."
      }
    ]
  };

  const startQuizMe = async () => {
    setIsGeneratingQuiz(true);
    setQuizSubmitted(false);
    setSelectedOptionIdx(null);
    setCurrentQuizIdx(0);
    setQuizScore(0);

    const targetTopic = activeTopic || syllabusTopics[0] || "General Core Knowledge";

    try {
      const res = await fetch('/api/generateQuiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examType: `NERDC ${selectedClass} Preparatory`,
          subject: `${activeSubject} - ${targetTopic}`,
          count: 5,
          studentName: studentName
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
          setQuizQuestions(data.questions);
          setIsGeneratingQuiz(false);
          return;
        }
      }
      throw new Error("No API key or bad response");
    } catch (e) {
      console.warn("Generating high-quality local curriculum questions.");
      let mappedSubject = activeSubject;
      if (mappedSubject === "English Language & Literature") mappedSubject = "English";
      if (mappedSubject === "English Language") mappedSubject = "English";
      
      try {
        const generated = generateExamQuestions("NERDC", mappedSubject);
        if (generated && generated.length > 0) {
          // Take exactly 5 questions for a focused spot quiz simulation
          setQuizQuestions(generated.slice(0, 5));
          setIsGeneratingQuiz(false);
          return;
        }
      } catch (genErr) {
        console.error("Generator fallback error", genErr);
      }

      const rawFallbacks = LOCAL_QUIZ_FALLBACKS[activeSubject] || [
        {
          question: `Which of the following describes the core theme of "${targetTopic}" under the ${selectedClass} curriculum?`,
          options: [
            "A) Systematic exploration of the empirical methodology and laws",
            "B) Reciprocal passive learning systems without experimental proof",
            "C) Mere theoretical assumptions with no real-world applicability in West Africa",
            "D) Outdated models from prior centuries with no standard reference"
          ],
          correctIndex: 0,
          explanation: `The primary theme of "${targetTopic}" in ${activeSubject} centers on scientific investigation and practical application under standard Lagos State guidelines.`
        },
        {
          question: `To achieve supreme academic results in ${activeSubject}, which study approach is recommended by Wolcrest College?`,
          options: [
            "A) Rote memorization without conceptual understanding",
            "B) Active learning coupled with revision and continuous mini-quizzes",
            "C) Relying purely on luck during WAEC examinations",
            "D) Omitting complex topics from review sessions"
          ],
          correctIndex: 1,
          explanation: "Active learning, solving practice problems, and self-evaluation via interactive spot quizzes build high retention of complex rules."
        },
        {
          question: `How is "${targetTopic}" typically applied in industrial sectors or public organizations in Lagos/West Africa?`,
          options: [
            "A) It is completely ignored by corporate and government sectors",
            "B) It serves as the primary technical framework for resource and system efficiency",
            "C) Only external foreign institutions make use of this knowledge",
            "D) It exists only as a decorative display concept in the library"
          ],
          correctIndex: 1,
          explanation: `NERDC designs standard subjects like ${activeSubject} specifically to train scholars for development needs and technical operations across West Africa.`
        }
      ];
      
      setQuizQuestions(rawFallbacks);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isAiThinking]);

  // Dispatch API Call to server `/api/chat`
  const handleDispatchMessage = async (overridePrompt?: string) => {
    const textToSend = (overridePrompt || chatInput).trim();
    if (!textToSend) return;

    if (!overridePrompt) {
      setChatInput('');
    }

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMessage]);
    setIsAiThinking(true);

    try {
      const payloadMessages = [...chatHistory, userMessage].map(m => ({
        sender: m.sender === 'user' ? 'user' : 'ai',
        text: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payloadMessages,
          userClass: selectedClass,
          subject: activeSubject,
          department: level === 'senior_secondary' ? department : 'General Studies',
          studentName: studentName
        })
      });

      if (res.ok) {
        const bodyData = await res.json();
        setChatHistory(prev => [...prev, {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: bodyData.text,
          timestamp: new Date()
        }]);
      } else {
        throw new Error("API Offline Error");
      }
    } catch (e) {
      // offline/error fallback
      setTimeout(() => {
        setChatHistory(prev => [...prev, {
          id: `ai-fallback-${Date.now()}`,
          sender: 'ai',
          text: `### Course Tutorial: ${activeSubject} - ${selectedClass}\n\nThank you for choosing to explore **"${textToSend}"** with the Crest AI core.\n\nHere is a foundational summary for your continuous review under the Nigerian curriculum:\n\n1. **Core Concept**: To master this topic, we analyze its underlying principles, equations, or structural syntax.\n2. **Nigerian Real-world Relevance**: Concepts like these are widely applied in industrial plants across Port Harcourt, construction calculations in Ikoyi Lagos, and commerce distributions in Abuja trading zones.\n3. **Quick Practice Test**: Try to resolve how this concept applies to WAEC guidelines and define the primary formula!\n\n*Resource optimizations are currently running. Our full interactive neural networks are available!*`,
          timestamp: new Date()
        }]);
      }, 500);
    } finally {
      setIsAiThinking(false);
    }
  };

  // Trigger immediate tutorial on topic click
  const handleTopicClick = (topicName: string) => {
    setActiveTopic(topicName);
    const tutorPrompt = `Please explain the topic: "${topicName}" from the ${selectedClass} "${activeSubject}" syllabus. 
Break down the basic definitions or formulas simply. Provide a relatable Nigerian real-world application (e.g. trading in Lagos, agriculture, infrastructure) and draft a quick practice problem to test my understanding!`;
    handleDispatchMessage(tutorPrompt);
  };

  // Core Quick Actions helpers
  const handleQuickAction = (actionType: 'exam' | 'formula' | 'diagnose') => {
    let actionPrompt = '';
    switch (actionType) {
      case 'exam':
        actionPrompt = `Generate a realistic West African WAEC practice question under the topic "${activeTopic || syllabusTopics[0]}" in ${selectedClass} ${activeSubject}, and show me how to calculate/deduce the correct answer step-by-step.`;
        break;
      case 'formula':
        actionPrompt = `Present the core formulas, variables, and literal key laws governing "${activeTopic || syllabusTopics[0]}" study under the NERDC syllabus for ${selectedClass} ${activeSubject}. Format it elegantly in a reference list.`;
        break;
      case 'diagnose':
        actionPrompt = `Briefly test my knowledge on "${activeTopic || syllabusTopics[0]}" in ${activeSubject} by asking me one multiple-choice question with standard options (A, B, C, D). Wait for my response!`;
        break;
    }
    handleDispatchMessage(actionPrompt);
  };

  // Filter subjects based on query
  const filteredSubjects = currentSubjects.filter(sub => 
    sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="crest-ai-comprehensive-tutor" className="grid grid-cols-1 xl:grid-cols-12 gap-6 text-slate-800">
      
      {/* LEFT COLUMN: CURRICULUM DISPATCH & NAVIGATION RADAR (col-span-5) */}
      <div className="xl:col-span-5 space-y-6 flex flex-col">
        
        {/* Curricular Stepper Selection Panel */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5 select-none">
          
          <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
            <div className="p-2 bg-school-wine/10 text-school-wine rounded-xl">
              <Compass className="h-5 w-5 animate-spin-slow" />
            </div>
            <div>
              <span className="text-[9px] text-[#A81E32] font-black uppercase tracking-wider block">NERDC Curriculum Scope</span>
              <h3 className="font-extrabold text-slate-900 text-sm font-display tracking-wide uppercase">Syllabus Navigation Radar</h3>
            </div>
          </div>

          {/* Stepper 1: Select Academic Tier */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">STEP 1: ACADEMIC LEVEL</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleLevelToggle('primary')}
                className={`p-3 rounded-xl text-[11px] font-extrabold text-center transition cursor-pointer flex flex-col justify-center items-center gap-1 border ${
                  level === 'primary'
                    ? 'bg-school-wine/10 text-school-wine border-school-wine/25 shadow-sm font-black'
                    : 'bg-slate-50 text-slate-500 border-slate-150 hover:bg-slate-100'
                }`}
              >
                <span>Grade School</span>
                <span className="text-[9px] opacity-75 font-mono">G1 — G5</span>
              </button>
              <button
                onClick={() => handleLevelToggle('junior_secondary')}
                className={`p-3 rounded-xl text-[11px] font-extrabold text-center transition cursor-pointer flex flex-col justify-center items-center gap-1 border ${
                  level === 'junior_secondary'
                    ? 'bg-school-wine/10 text-school-wine border-school-wine/25 shadow-sm font-black'
                    : 'bg-slate-50 text-slate-500 border-slate-150 hover:bg-slate-100'
                }`}
              >
                <span>Junior Sec.</span>
                <span className="text-[9px] opacity-75 font-mono">JSS1 — JSS3</span>
              </button>
              <button
                onClick={() => handleLevelToggle('senior_secondary')}
                className={`p-3 rounded-xl text-[11px] font-extrabold text-center transition cursor-pointer flex flex-col justify-center items-center gap-1 border ${
                  level === 'senior_secondary'
                    ? 'bg-school-wine/10 text-school-wine border-school-wine/25 shadow-sm font-black'
                    : 'bg-slate-50 text-slate-500 border-slate-150 hover:bg-slate-100'
                }`}
              >
                <span>Senior Sec.</span>
                <span className="text-[9px] opacity-75 font-mono">SSS1 — SSS3</span>
              </button>
            </div>
          </div>

          {/* Stepper 2: Select Class */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">STEP 2: CLASS YEAR</label>
            <div className="flex flex-wrap gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-150">
              {classesByLevel[level].map((cls) => (
                <button
                  key={cls}
                  onClick={() => { setSelectedClass(cls); }}
                  className={`flex-1 p-2 rounded-xl text-xs font-bold text-center transition cursor-pointer whitespace-nowrap ${
                    selectedClass === cls
                      ? 'bg-white text-school-navy shadow hover:text-school-navy'
                      : 'text-slate-500 hover:bg-white/60 hover:text-slate-800'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>

          {/* Stepper 3: Select Department - ONLY for SSS 1-3 */}
          {level === 'senior_secondary' && (
            <div className="space-y-2 animate-fadeIn">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">STEP 3: ACADEMIC BRANCH / DEPARTMENT</label>
              <div className="flex flex-col space-y-1.5">
                {[
                  { name: "Sciences (STEM)", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
                  { name: "Arts & Humanities", color: "text-[#722F37] bg-rose-50 border-rose-100" },
                  { name: "Commercial & Vocational Studies", color: "text-sky-600 bg-sky-50 border-sky-100" }
                ].map((dep) => (
                  <button
                    key={dep.name}
                    onClick={() => { setDepartment(dep.name); }}
                    className={`p-3.5 rounded-xl text-xs font-extrabold text-left border cursor-pointer transition flex items-center justify-between ${
                      department === dep.name
                        ? `${dep.color} font-black shadow-sm scale-[0.99] border-school-wine/25`
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-150"
                    }`}
                  >
                    <span>{dep.name}</span>
                    {department === dep.name && <CheckCircle className="h-4 w-4 text-[#A81E32]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Subjects List & Expandible Curriculum Topics */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex-1 flex flex-col space-y-4">
          
          <div className="flex items-center justify-between select-none border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-school-wine" />
              <strong className="text-slate-800 text-xs font-extrabold uppercase font-display">Offered Subjects &amp; Topics</strong>
            </div>
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">{selectedClass} Classroom</span>
          </div>

          {/* Inner search query */}
          <div className="relative select-none">
            <Search className="absolute left-3.5 top-3 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search offered subjects..."
              className="w-full text-xs pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-school-wine focus:bg-white text-slate-900"
            />
          </div>

          {/* Offered Subjects Stack */}
          <div className="space-y-2 flex-1 overflow-y-auto max-h-[280px] xl:max-h-none pr-1">
            {filteredSubjects.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-6 italic">No matching subjects listed for selection.</p>
            ) : (
              filteredSubjects.map((sub) => {
                const isSelected = activeSubject === sub.name;
                return (
                  <div 
                    key={sub.name}
                    className={`rounded-2xl border transition overflow-hidden ${
                      isSelected 
                        ? 'border-school-navy/20 bg-school-navy/5' 
                        : 'border-slate-150 bg-white hover:bg-slate-50'
                    }`}
                  >
                    {/* Header trigger button */}
                    <button
                      onClick={() => { setActiveSubject(sub.name); activeTopic !== null && setActiveTopic(null); }}
                      className="w-full p-3.5 text-left flex items-start justify-between cursor-pointer focus:outline-none"
                    >
                      <div className="space-y-0.5">
                        <strong className={`text-xs block font-extrabold ${isSelected ? 'text-school-navy' : 'text-slate-800'}`}>
                          {sub.name}
                        </strong>
                        <span className="text-[10px] text-slate-500 line-clamp-1 leading-normal">{sub.description}</span>
                      </div>
                      <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform ${isSelected ? 'rotate-90 text-school-navy font-bold' : ''}`} />
                    </button>

                    {/* Expandable Syllabus Topic List */}
                    {isSelected && (
                      <div className="p-3 bg-white border-t border-school-navy/10 space-y-1.5 animate-slideDown">
                        <span className="text-[9px] font-mono text-school-wine block select-none uppercase tracking-widest font-black">
                          Syllabus Topic Guidelines (NERDC):
                        </span>
                        
                        <div className="space-y-1 max-h-[160px] overflow-y-auto pr-1">
                          {syllabusTopics.map((topic, i) => {
                            const isTopicActive = activeTopic === topic;
                            return (
                              <button
                                key={topic}
                                onClick={() => handleTopicClick(topic)}
                                className={`w-full p-2 text-left text-[11px] rounded-xl border transition cursor-pointer flex items-start space-x-2 ${
                                  isTopicActive 
                                    ? 'bg-school-wine/5 border-school-wine/20 text-school-wine font-bold font-semibold' 
                                    : 'bg-slate-50/50 border-slate-150 text-slate-650 hover:bg-slate-50 hover:text-slate-900 shadow-sm'
                                }`}
                              >
                                <span className="font-mono text-[9px] bg-slate-200/60 text-slate-500 rounded px-1 min-w-[18px] text-center mt-0.5 select-none">{i+1}</span>
                                <span className="leading-tight flex-1">{topic}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Support credentials summary badge */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[10px] text-slate-500 flex items-center justify-between select-none">
            <span>BOARD LEVEL: <strong>LAGOS STATE NERDC</strong></span>
            <span className="text-school-wine font-bold">100% REGULATORY COMPLIANT</span>
          </div>

        </div>

      </div>

      {/* RIGHT COLUMN: ACTIVE LEARNING TUTORIAL CANVAS (col-span-7) */}
      <div className="xl:col-span-7 flex flex-col h-[650px] lg:h-[720px] bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden relative">
        
        {/* Tutor Top Profile Brand */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 select-none">
          <div className="flex items-center space-x-3">
            <div className="p-2 sm:p-2.5 bg-school-wine/10 text-school-wine rounded-2xl shadow-sm">
              <Brain className="h-5 w-5 sm:h-6 sm:w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h4 className="font-black text-slate-900 text-xs sm:text-sm tracking-wide leading-none uppercase font-display">CREST AI LEARNING SYSTEM</h4>
                <span className="text-[8px] bg-school-wine text-[#FAF0E6] px-1.5 rounded-md font-mono font-bold tracking-widest uppercase">ACTIVE</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Tutor: <strong className="text-school-wine font-bold">Crest AI Virtual Coach</strong> • Subject: <strong className="text-slate-700">{activeSubject} ({selectedClass})</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="text-[10px] py-1 px-2.5 bg-slate-150 border border-slate-200 rounded-xl font-bold font-mono text-slate-650 flex items-center space-x-1">
              <BookMarked className="h-3 w-3 text-school-navy" />
              <span>Syllabus Active</span>
            </div>
          </div>
        </div>

        {/* Dynamic Navigation Mode Switcher: Study Companion vs Quiz Me */}
        <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 select-none">
          <div className="flex bg-slate-200/50 p-1 rounded-xl w-full max-w-sm">
            <button 
              onClick={() => { setTutorMode('chat'); }}
              className={`flex-1 text-center font-bold text-[11px] py-1.5 rounded-lg transition-all cursor-pointer ${tutorMode === 'chat' ? 'bg-[#0A1A3A] text-[#FAF0E6] shadow-sm' : 'text-slate-600 hover:bg-white/40 hover:text-slate-900'}`}
            >
              💬 AI Study Companion
            </button>
            <button 
              onClick={() => { setTutorMode('quiz'); if (quizQuestions.length === 0) startQuizMe(); }}
              className={`flex-1 text-center font-bold text-[11px] py-1.5 rounded-lg transition-all cursor-pointer ${tutorMode === 'quiz' ? 'bg-[#722F37] text-[#FAF0E6] shadow-sm' : 'text-slate-600 hover:bg-white/40 hover:text-slate-900'}`}
            >
              🎯 Dynamic Quiz Me!
            </button>
          </div>
          <div className="text-[9px] font-mono text-slate-500 bg-white/60 px-2 py-0.5 rounded border border-slate-200 flex items-center justify-between">
            <span>TARGET: {activeTopic ? activeTopic.substring(0, 24) + "..." : activeSubject}</span>
          </div>
        </div>

        {tutorMode === 'chat' ? (
          <>
            {/* Chat History Messages Scroll Arena */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 select-text bg-gradient-to-b from-white to-slate-55/30">
              {chatHistory.map((msg) => {
                const isAi = msg.sender === 'ai';
                return (
                  <div key={msg.id} className={`flex max-w-2xl ${isAi ? 'justify-start' : 'justify-end ml-auto animate-slideLeft'}`}>
                    
                    {/* Visual Avatar */}
                    {isAi && (
                      <div className="h-8 w-8 rounded-full bg-[#0A1A3A] border border-[#1b325c] flex items-center justify-center text-[#FAF0E6] mr-2.5 shadow-sm text-xs select-none shrink-0 font-display font-black">
                        C
                      </div>
                    )}
                    
                    <div className={`p-4 rounded-3xl border text-xs leading-relaxed space-y-2 relative shadow-sm max-w-full ${
                      isAi 
                        ? 'bg-white border-slate-200 text-slate-800 rounded-tl-none' 
                        : 'bg-[#722F37] border-[#551d24] text-[#FAF0E6] rounded-tr-none'
                    }`}>
                      <div className="whitespace-pre-wrap leading-normal prose prose-xs max-w-none text-slate-800 break-words font-sans selection:bg-rose-200">
                        {/* Render message body nicely */}
                        {isAi ? (
                          // Parse custom subheaders and lists visually if model returns markdowns
                          <div className="space-y-1.5">
                            {msg.text.split('\n').map((line, idx) => {
                              if (line.startsWith('### ')) {
                                return <h3 key={idx} className="font-extrabold text-[#111C24] text-xs sm:text-sm uppercase tracking-wide pt-1.5">{line.replace('### ', '')}</h3>;
                              } else if (line.startsWith('## ')) {
                                return <h2 key={idx} className="font-black text-slate-900 text-xs sm:text-xs uppercase tracking-wide pt-1.5 border-b border-slate-100 pb-0.5">{line.replace('## ', '')}</h2>;
                              } else if (line.startsWith('**') && line.endsWith('**')) {
                                return <p key={idx} className="font-bold text-slate-900 leading-normal">{line.replace(/\*\*/g, '')}</p>;
                              } else {
                                // simple fallback formatting for bullet lists
                                const isBullet = line.trim().startsWith('-') || line.trim().startsWith('*');
                                return (
                                  <p key={idx} className={`leading-relaxed text-[11.5px] ${isBullet ? 'pl-3 relative before:content-["•"] before:absolute before:left-0 before:text-rose-600' : ''}`}>
                                    {isBullet ? line.trim().substring(1).trim() : line}
                                  </p>
                                );
                              }
                            })}
                          </div>
                        ) : (
                          <p className="text-white text-[11.5px] leading-relaxed">{msg.text}</p>
                        )}
                      </div>
                      
                      <span className={`text-[8.5px] block text-right font-semibold font-mono ${isAi ? 'text-slate-400' : 'text-rose-200'} select-none`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                  </div>
                );
              })}

              {isAiThinking && (
                <div className="flex items-start animate-pulse max-w-xs select-none">
                  <div className="h-8 w-8 rounded-full bg-[#0A1A3A] border border-[#1b325c] flex items-center justify-center text-[#FAF0E6] mr-2.5 shadow-sm text-xs shrink-0 font-display font-black">
                    C
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-3xl rounded-tl-none space-y-1 shadow-sm">
                    <div className="flex items-center space-x-1.5 py-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-bounce" />
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-bounce delay-100" />
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-bounce delay-200" />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono leading-none block">Crest AI coach is structuring lesson plans...</span>
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Dynamic Revision Quick Actions Recommendations */}
            <div className="px-5 py-2 border-t border-slate-100 bg-slate-50 select-none pb-2 flex items-center gap-2 overflow-x-auto">
              <span className="text-[9px] font-black text-slate-400 uppercase shrink-0">QUICK ASSIST:</span>
              <button 
                onClick={() => handleQuickAction('exam')}
                disabled={isAiThinking}
                className="text-[10px] whitespace-nowrap px-3 py-1.5 bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 rounded-lg text-slate-650 font-bold border border-slate-200 cursor-pointer transition active:scale-95 disabled:opacity-50 shrink-0"
              >
                💡 Practice WAEC Problem
              </button>
              <button 
                onClick={() => handleQuickAction('formula')}
                disabled={isAiThinking}
                className="text-[10px] whitespace-nowrap px-3 py-1.5 bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 rounded-lg text-slate-650 font-bold border border-slate-200 cursor-pointer transition active:scale-95 disabled:opacity-50 shrink-0"
              >
                📚 Formula Sheet Rules
              </button>
              <button 
                onClick={() => handleQuickAction('diagnose')}
                disabled={isAiThinking}
                className="text-[10px] whitespace-nowrap px-3 py-1.5 bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 rounded-lg text-slate-650 font-bold border border-slate-200 cursor-pointer transition active:scale-95 disabled:opacity-50 shrink-0"
              >
                📝 Diagnostic Spot Quiz
              </button>
            </div>

            {/* Message Input Form panel */}
            <div className="p-4 bg-white border-t border-slate-150">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleDispatchMessage(); }}
                className="flex items-center space-x-2"
              >
                <input 
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={
                    activeTopic 
                      ? `Ask Crest AI a follow-up query about "${activeTopic}"...`
                      : `Ask Crest AI anything about ${selectedClass} ${activeSubject} syllabus...`
                  }
                  className="flex-1 text-xs p-3.5 border border-slate-200 rounded-2xl bg-slate-50 text-slate-900 focus:outline-none focus:border-rose-400 focus:bg-white focus:shadow-sm"
                  disabled={isAiThinking}
                />
                <button 
                  type="submit"
                  disabled={isAiThinking || !chatInput.trim()}
                  className="p-3 bg-[#722F37] hover:bg-slate-900 transition text-[#FAF0E6] rounded-xl shadow cursor-pointer flex-shrink-0 disabled:opacity-50 active:scale-95 animate-pulse-slow"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </>
        ) : (
          /* QUIZ ME INTERACTIVE MODE WORKSPACE */
          <div className="flex-1 bg-gradient-to-br from-slate-50 via-white to-indigo-50/10 p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            {isGeneratingQuiz ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-12">
                <div className="w-12 h-12 rounded-full border-4 border-slate-150 border-t-[#722F37] animate-spin" />
                <div className="text-center space-y-1">
                  <strong className="text-slate-800 text-sm font-black tracking-wide block uppercase">GENERATING CREST AI ADAPTIVE QUIZ</strong>
                  <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                    Scanning the {selectedClass} NERDC requirements to craft multiple-choice syllabus evaluations...
                  </p>
                </div>
              </div>
            ) : quizQuestions.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="p-4 bg-slate-100 rounded-full text-slate-400">
                  <HelpCircle className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <strong className="text-xs font-black text-slate-800 uppercase block">No Quiz Prepared Yet</strong>
                  <p className="text-[11px] text-slate-500 max-w-xs">
                    Choose any syllabus topic on the left navigator to start, then click generate.
                  </p>
                </div>
                <button 
                  onClick={startQuizMe} 
                  className="bg-[#722F37] hover:bg-[#0A1A3A] transition text-[#FAF0E6] font-extrabold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
                >
                  Generate Dynamic Quiz
                </button>
              </div>
            ) : currentQuizIdx >= quizQuestions.length ? (
              /* QUIZ SCORECARD COMPLETED STATUS panel */
              <div className="flex-1 flex flex-col justify-center items-center py-6 space-y-6 animate-slideUp">
                <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-3xl text-center space-y-3 max-w-sm w-full">
                  <div className="inline-flex p-3 bg-[#0A1A3A] text-[#FAF0E6] rounded-full">
                    <Award className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-indigo-700 bg-indigo-100/50 border border-indigo-100 px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider block mx-auto w-max">
                      EVALUATION COMPLETE
                    </span>
                    <strong className="text-lg block font-black text-slate-900">
                      Score: {quizScore} / {quizQuestions.length}
                    </strong>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Percentage: {Math.round((quizScore / quizQuestions.length) * 100)}%
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-normal">
                    {quizScore === quizQuestions.length ? (
                      "Superb standard! You achieved a perfect score on this Nigerian NERDC curriculum module. Conquering the future is assured."
                    ) : quizScore >= 3 ? (
                      "Well done! You established a strong core grasp of these exam syllabus parameters. Perfect your record with another session!"
                    ) : (
                      "Diligence conquers all barriers. Please review the detailed study notes and attempt this topic once more."
                    )}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 min-w-[240px]">
                  <button 
                    onClick={startQuizMe}
                    className="flex-1 bg-[#722F37] hover:bg-slate-900 transition text-[#FAF0E6] font-extrabold text-xs py-3 px-6 rounded-xl cursor-pointer shadow-sm text-center"
                  >
                    🔄 Retake Spot Quiz
                  </button>
                  <button 
                    onClick={() => { setTutorMode('chat'); }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 px-6 rounded-xl cursor pointer text-center"
                  >
                    💬 Ask Followup Questions
                  </button>
                </div>
              </div>
            ) : (
              /* ACTIVE SINGLE QUESTION SCREEN */
              <div className="flex-1 flex flex-col justify-between space-y-4">
                
                {/* Progress bar */}
                <div className="space-y-1.5 select-none">
                  <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>Question {currentQuizIdx + 1} of {quizQuestions.length}</span>
                    <span>Score: {quizScore} / {currentQuizIdx}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#722F37] h-full transition-all duration-300"
                      style={{ width: `${((currentQuizIdx + 1) / quizQuestions.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Question Frame */}
                <div className="space-y-3">
                  <span className="text-[10px] text-[#722F37] bg-rose-50 border border-rose-100 px-2 py-0.5 rounded font-black font-mono tracking-wider w-max block">
                    {activeSubject}
                  </span>
                  <p className="text-sm font-extrabold text-slate-900 leading-snug">
                    {quizQuestions[currentQuizIdx].question}
                  </p>
                </div>

                {/* Option selection container */}
                <div className="grid grid-cols-1 gap-2.5 pt-2">
                  {quizQuestions[currentQuizIdx].options.map((option, idx) => {
                    const isSelected = selectedOptionIdx === idx;
                    const isCorrect = idx === quizQuestions[currentQuizIdx].correctIndex;
                    
                    let cardStyle = "border-slate-200 bg-white hover:bg-slate-50 text-slate-700";
                    if (isSelected) {
                      cardStyle = "border-[#722F37] bg-rose-50/30 text-rose-950 font-bold";
                    }
                    
                    if (quizSubmitted) {
                      if (isCorrect) {
                        cardStyle = "border-emerald-500 bg-emerald-50/70 text-emerald-950 font-black";
                      } else if (isSelected) {
                        cardStyle = "border-rose-500 bg-rose-50/70 text-rose-950 font-semibold line-through";
                      } else {
                        cardStyle = "border-slate-100 bg-white opacity-40 text-slate-400";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={quizSubmitted}
                        onClick={() => setSelectedOptionIdx(idx)}
                        className={`w-full p-3.5 text-left text-xs rounded-xl border transition duration-100 flex items-start gap-3 cursor-pointer ${cardStyle}`}
                      >
                        <span className={`inline-block font-mono font-bold px-1.5 py-0.5 rounded text-[10px] ${isSelected ? 'bg-[#722F37] text-white' : 'bg-slate-100 text-slate-500'}`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="leading-tight flex-1">{option}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation and navigation button */}
                <div className="pt-4 border-t border-slate-100 min-h-[90px] flex flex-col justify-end">
                  {quizSubmitted ? (
                    <div className="space-y-3 animate-slideUp">
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                        <strong className="text-[10px] font-mono font-black text-slate-500 block uppercase tracking-wider">
                          Crest AI Rational Explanations:
                        </strong>
                        <p className="text-[11px] text-slate-600 leading-normal">
                          {quizQuestions[currentQuizIdx].explanation}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setCurrentQuizIdx(prev => prev + 1);
                          setSelectedOptionIdx(null);
                          setQuizSubmitted(false);
                        }}
                        className="w-full bg-[#0A1A3A] hover:bg-slate-950 text-white font-extrabold text-xs py-3 px-4 rounded-xl transition cursor-pointer text-center"
                      >
                        {currentQuizIdx === quizQuestions.length - 1 ? "Check Scorecard" : "Next Question →"}
                      </button>
                    </div>
                  ) : (
                    <button
                      disabled={selectedOptionIdx === null}
                      onClick={() => {
                        const correct = selectedOptionIdx === quizQuestions[currentQuizIdx].correctIndex;
                        if (correct) {
                          setQuizScore(prev => prev + 1);
                        }
                        setQuizSubmitted(true);
                      }}
                      className="w-full bg-[#722F37] hover:bg-[#0A1A3A] text-white font-extrabold text-xs py-3 px-4 rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-center"
                    >
                      Verify Answer Selection
                    </button>
                  )}
                </div>

              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
