import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Award,
  Sparkles,
  Clock,
  Send,
  CheckCircle2,
  XCircle,
  ArrowRight,
  GraduationCap,
  RotateCcw,
  Brain,
  LayoutDashboard,
  Building2,
  Menu,
  X,
  ChevronRight,
  HelpCircle,
  Calendar,
  AlertCircle,
  TrendingUp,
  FileText,
  Lock,
  Search,
  Eye,
  User,
  Users,
  FolderOpen,
  Heart,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';

import { LEADER_DEPARTMENTS, NIGERIAN_CURRICULUM } from './data/curriculum';
import { generateExamQuestions, VALID_SUBJECTS } from './data/fallbackQuizzes';
import { ChatMessage, QuizQuestion, GalleryItem, CourseMaterial, SchoolEvent } from './types';

// Import our modular sub-consoles
import HomeHub from './components/HomeHub';
import AdmissionsPortal from './components/AdmissionsPortal';
import ResultsChecker from './components/ResultsChecker';
import AdminPortal from './components/AdminPortal';
import OverlaySync from './components/OverlaySync';
import CrestAITutor from './components/CrestAITutor';

export default function App() {
  // Navigation & Layout states
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'curriculum' | 'departments' | 'ai-tutor' | 'exam-center' | 'admissions' | 'results' | 'admin' | 'contact-address' | 'registry'>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [deviceTime, setDeviceTime] = useState<string>(new Date().toISOString());

  // Registry direct contact states
  const [registrySubject, setRegistrySubject] = useState('');
  const [registryBody, setRegistryBody] = useState('');
  const [isSendingRegistry, setIsSendingRegistry] = useState(false);
  const [registrySuccessMessage, setRegistrySuccessMessage] = useState<string | null>(null);

  // Transition parameters
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncTheme, setSyncTheme] = useState('dashboard');

  // Dynamic Background Theme Mapping based on selected tab
  const getThemeBgClass = () => {
    switch (currentTab) {
      case 'dashboard': return 'bg-gradient-to-br from-[#132B66]/5 via-[#FAF6F6] to-[#722F37]/5';
      case 'curriculum': return 'bg-gradient-to-br from-[#092B20]/5 via-slate-50 to-teal-50/5';
      case 'departments': return 'bg-gradient-to-br from-school-navy/5 via-slate-50 to-slate-100';
      case 'ai-tutor': return 'bg-gradient-to-br from-[#1B1437]/5 via-slate-50 to-[#090612]/5';
      case 'exam-center': return 'bg-gradient-to-br from-[#331D0F]/5 via-slate-50 to-rose-50/5';
      case 'admissions': return 'bg-gradient-to-br from-school-navy/5 via-slate-50 to-[#FAF6F6]';
      case 'results': return 'bg-gradient-to-br from-school-navy/5 via-slate-50 to-school-wine/5';
      case 'contact-address': return 'bg-gradient-to-br from-[#722F37]/5 via-slate-50 to-school-navy/5';
      case 'registry': return 'bg-gradient-to-br from-[#722F37]/5 via-slate-50 to-school-navy/5';
      case 'admin': return 'bg-gradient-to-br from-school-wine/5 via-slate-50 to-school-navy/5';
      default: return 'bg-slate-50';
    }
  };

  const handleTabTransition = (targetTab: any, themeColor: string) => {
    setSyncTheme(themeColor);
    setIsSyncing(true);
    setIsMobileSidebarOpen(false);
    
    setTimeout(() => {
      setCurrentTab(targetTab);
    }, 280);

    setTimeout(() => {
      setIsSyncing(false);
    }, 550);
  };

  // Student Profile Data State (Registry Lookup and Login System)
  const [studentName, setStudentName] = useState<string>('Guest Scholar');
  const [studentClass, setStudentClass] = useState<string>('SSS 3');
  const [studentDepartment, setStudentDepartment] = useState<string>('Sciences (STEM)');
  const [studentId, setStudentId] = useState<string>('');
  const [isStudentLoggedIn, setIsStudentLoggedIn] = useState<boolean>(false);

  const handleStudentLogin = (name: string, cls: string, dept: string, id: string) => {
    setStudentName(name);
    setStudentClass(cls);
    setStudentDepartment(dept);
    setStudentId(id);
    setIsStudentLoggedIn(true);
  };

  const handleStudentLogout = () => {
    setStudentName('Guest Scholar');
    setStudentClass('SSS 3');
    setStudentDepartment('Sciences (STEM)');
    setStudentId('');
    setIsStudentLoggedIn(false);
  };

  // Gallery, Course Materials, and Institutional metadata states (syncs directly from DB server)
  const [galleryList, setGalleryList] = useState<GalleryItem[]>([]);
  const [courseMaterialsList, setCourseMaterialsList] = useState<CourseMaterial[]>([]);
  const [currentSession, setCurrentSession] = useState<string>("2025/2026");
  const [currentTerm, setCurrentTerm] = useState<string>("3rd Term");
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  
  const refreshGallery = async () => {
    try {
      const res = await fetch('/api/full-db');
      if (res.ok) {
        const data = await res.json();
        setGalleryList(data.gallery || []);
        setCourseMaterialsList(data.courseMaterials || []);
        setCurrentSession(data.currentSession || "2025/2026");
        setCurrentTerm(data.currentTerm || "3rd Term");
        setEvents(data.events || []);
      }
    } catch(e) {
      console.error("Failed to fetch database details", e);
    }
  };

  useEffect(() => {
    refreshGallery();
  }, []);

  const handleSendRegistryMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registrySubject || !registryBody) return;
    setIsSendingRegistry(true);
    setTimeout(() => {
      setIsSendingRegistry(false);
      setRegistrySuccessMessage("Your official inquiry statement has been successfully dispatched to the Wolcrest Administration Secretariat of Egan Igando. An administrative officer will review and reply swiftly.");
      setRegistrySubject('');
      setRegistryBody('');
    }, 850);
  };

  // Dynamic Ticking clock
  useEffect(() => {
    const timer = setInterval(() => {
      setDeviceTime(new Date().toISOString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Safe global keyboard sequence listener to access hidden admin panel via secret sequence '666222'
  useEffect(() => {
    let strokeSequence = '';
    const handleGlobalKeyStroke = (e: KeyboardEvent) => {
      if (/[0-9]/.test(e.key)) {
        strokeSequence += e.key;
        if (strokeSequence.length > 6) {
          strokeSequence = strokeSequence.slice(-6);
        }
        if (strokeSequence === '666222') {
          handleTabTransition('admin', 'admin');
          strokeSequence = '';
        }
      } else if (e.key === 'Escape' || e.key === 'Backspace') {
        strokeSequence = '';
      }
    };
    window.addEventListener('keydown', handleGlobalKeyStroke);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyStroke);
    };
  }, []);

  // --- Curriculum Explorer states ---
  const [selectedCurriculumLevel, setSelectedCurriculumLevel] = useState<'primary' | 'junior_secondary' | 'senior_secondary'>('senior_secondary');
  const [selectedCurriculumClass, setSelectedCurriculumClass] = useState<string>('SSS 3');
  const [selectedCurriculumDepartment, setSelectedCurriculumDepartment] = useState<string>('all');
  const [curriculumSearchQuery, setCurriculumSearchQuery] = useState('');
  const [expandedCurriculumSubject, setExpandedCurriculumSubject] = useState<string | null>("Mathematics");

  const levelClasses = {
    primary: ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"],
    junior_secondary: ["JSS 1", "JSS 2", "JSS 3"],
    senior_secondary: ["SSS 1", "SSS 2", "SSS 3"]
  };

  const handleLevelChange = (level: 'primary' | 'junior_secondary' | 'senior_secondary') => {
    setSelectedCurriculumLevel(level);
    setSelectedCurriculumDepartment('all');
    const classes = levelClasses[level];
    setSelectedCurriculumClass(classes[classes.length - 1]);
    setExpandedCurriculumSubject(null);
  };

  const currentCurriculum = NIGERIAN_CURRICULUM.find(
    cur => cur.className.toLowerCase() === selectedCurriculumClass.toLowerCase()
  );

  // --- Crest AI Tutor Chat State ---
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'default-1',
      sender: 'ai',
      text: `Hello, esteemed scholar! I am **Crest AI**, your premier West African tutor. 🇳🇬\n\nI am certified in the approved **NERDC Nigerian standard curriculum**, ranging from Grade 1 through SSS 3. Whether you seek to study Further Mathematics derivatives, complex Physics variables, or analyze agricultural yields, I am here to assist!\n\nSelect a subject scope or ask me a question to commence our learning session.`,
      timestamp: new Date()
    }
  ]);
  const [userChatInput, setUserChatInput] = useState('');
  const [tutorSubject, setTutorSubject] = useState('General Studies');
  const [isTutorThinking, setIsTutorThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const sendChatMessage = async (overrideText?: string) => {
    const msgText = overrideText || userChatInput;
    if (!msgText.trim()) return;

    if (!overrideText) {
      setUserChatInput('');
    }

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: msgText,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsTutorThinking(true);

    try {
      const messagesPayload = [...chatMessages, userMsg].map(msg => ({
        sender: msg.sender === 'user' ? 'user' : 'ai',
        text: msg.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messagesPayload,
          userClass: studentClass,
          subject: tutorSubject,
          department: studentDepartment,
          studentName: studentName
        })
      });

      if (res.ok) {
        const data = await res.json();
        setChatMessages(prev => [...prev, {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.text,
          timestamp: new Date()
        }]);
      } else {
        throw new Error("Chat lag response");
      }
    } catch (e) {
      setChatMessages(prev => [...prev, {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `I am currently optimizing resource allocations. Under the standard Nigerian syllabus, let us continue our study on **${tutorSubject}**. Please review your study materials!`,
        timestamp: new Date()
      }]);
    } finally {
      setIsTutorThinking(false);
    }
  };

  const triggerCurriculumTopicTutoring = (subjectName: string, topicName: string) => {
    setTutorSubject(subjectName);
    handleTabTransition('ai-tutor', 'ai-tutor');
    
    // Auto initiate message
    setTimeout(() => {
      sendChatMessage(`Teach me the curriculum topic: "${topicName}" from "${subjectName}" syllabus. Explain the core formulas, definitions, and give me a brief practice quiz problem to solve!`);
    }, 600);
  };


  // --- National Exam Simulator State (30 Minutes countdown) ---
  const [selectedExamType, setSelectedExamType] = useState<'WAEC' | 'JAMB' | 'Common Entrance' | 'Junior WAEC'>('WAEC');
  const [selectedQuizSubject, setSelectedQuizSubject] = useState<string>('Mathematics');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  
  const [quizTimerSeconds, setQuizTimerSeconds] = useState(1800); // 30 minutes countdown
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [isTutorMode, setIsTutorMode] = useState(false); // displays answer explanations immediately if checked
  const [isGeneratingLoading, setIsGeneratingLoading] = useState(false);
  const [quizAutoCollected, setQuizAutoCollected] = useState(false);

  // Decrease Quiz timer
  useEffect(() => {
    let interval: any = null;
    if (isQuizActive && !isQuizFinished) {
      interval = setInterval(() => {
        setQuizTimerSeconds(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleAutoSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isQuizActive, isQuizFinished]);

  const handleAutoSubmitQuiz = () => {
    setIsQuizFinished(true);
    setQuizAutoCollected(true);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartQuiz = async () => {
    setIsGeneratingLoading(true);
    setQuizTimerSeconds(1800); // Reset countdown 30 mins (1800 seconds)
    setQuizAutoCollected(false);
    setSelectedAnswers({});
    setCurrentQuizIndex(0);
    setQuizQuestions([]);

    try {
      // Fetch dynamic questions from backend Gemini AI quiz routes (e.g. 10 premium questions)
      const res = await fetch('/api/generateQuiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examType: selectedExamType,
          subject: selectedQuizSubject,
          count: 10, // keep quick to avoid timeouts
          studentName: studentName
        })
      });

      let qs: QuizQuestion[] = [];
      const fallbackQs = generateExamQuestions(selectedExamType, selectedQuizSubject);

      if (res.ok) {
        const data = await res.json();
        if (data.questions && data.questions.length > 0) {
          qs = data.questions;
        }
      }

      // Merge and pad to exactly 60 questions
      if (qs.length < 60) {
        const remainingNeeded = 60 - qs.length;
        const padQs = fallbackQs.slice(0, remainingNeeded);
        qs = [...qs, ...padQs];
      } else if (qs.length > 60) {
        qs = qs.slice(0, 60);
      }

      // Re-assign IDs to be sequential index-based for standard progress tracking
      const finalQs = qs.map((q, qIdx) => ({
        ...q,
        id: `${selectedExamType.toLowerCase()}-${selectedQuizSubject.toLowerCase()}-${qIdx + 1}`,
        question: `[Q${qIdx + 1}/60] ${q.question.replace(/^\[Q\d+\]\s*/, '')}`
      }));

      setQuizQuestions(finalQs);
      setIsQuizActive(true);
      setIsQuizFinished(false);

    } catch (e) {
      // Full Local Fallback compile (exact 60 questions)
      const fallbackQs = generateExamQuestions(selectedExamType, selectedQuizSubject);
      const finalQs = fallbackQs.slice(0, 60).map((q, qIdx) => ({
        ...q,
        question: `[Q${qIdx + 1}/60] ${q.question.replace(/^\[Q\d+\]\s*/, '')}`
      }));
      setQuizQuestions(finalQs);
      setIsQuizActive(true);
      setIsQuizFinished(false);
    } finally {
      setIsGeneratingLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500 bg-slate-50 relative font-sans text-slate-800">
      
      {/* Sleek Dual-Tone Brand Border */}
      <div className="h-1.5 bg-gradient-to-r from-school-navy via-[#1E3A7A] to-school-wine w-full z-40 relative"></div>

      {/* Full screen layout transitions overlay */}
      <OverlaySync isSyncing={isSyncing} themeColor={syncTheme} />

      {/* PRESTIGIOUS OVERHEAD CHRONICLES INSTRUX HEADER */}
      <header className="bg-school-navy-dark text-slate-100 z-30 shadow-lg border-b border-white/10 select-none">
        
        {/* Row 1: Brand & Profile Info */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-white/5">
          
          {/* Institution Title Identity */}
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-school-wine text-white flex items-center justify-center font-bold shadow-md">
              <GraduationCap className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-sm sm:text-base font-black tracking-widest text-[#FAF0E6] font-display uppercase">
                  WOLCREST COLLEGE
                </h1>
                <span className="text-[9px] bg-school-wine/25 text-rose-300 font-bold px-2 py-0.5 rounded border border-school-wine/30 uppercase tracking-widest leading-none">
                  Core Portal
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-slate-400 italic block font-sans font-medium">
                "Where the future is assured"
              </span>
            </div>
          </div>

          {/* Active Scholar Dropdown Settings Card replaced with secure login status indicator */}
          {isStudentLoggedIn ? (
            <div className="flex items-center space-x-3 bg-emerald-950/40 p-2.5 rounded-2xl border border-emerald-500/25 w-full md:w-auto max-w-sm shrink-0">
              <div className="h-9 w-9 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-xs border border-white/10 uppercase select-none shadow shrink-0">
                {studentName ? studentName.charAt(0) : 'S'}
              </div>
              <div className="flex-1 min-w-0 select-none">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[9.5px] font-black text-emerald-400 uppercase tracking-widest block font-mono">✓ VERIFIED STUDENT</span>
                  <button 
                    onClick={() => {
                      setIsStudentLoggedIn(false);
                      setStudentName('Guest Scholar');
                      setStudentId('');
                    }}
                    className="text-[9px] text-slate-400 hover:text-slate-200 hover:underline font-bold"
                    type="button"
                  >
                    Log Out
                  </button>
                </div>
                <h4 className="text-xs font-bold text-slate-100 truncate">{studentName}</h4>
                <p className="text-[10px] text-rose-400 truncate">
                  ID: <span className="font-mono font-bold text-white bg-[#722F37]/50 px-1 py-0.2 rounded text-[9.5px] tracking-wide">{studentId}</span> • {studentClass}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3 bg-[#0C141B] p-2.5 rounded-2xl border border-white/5 w-full md:w-auto max-w-sm shrink-0">
              <div className="h-9 w-9 rounded-full bg-[#1F2F3B] text-slate-400 font-extrabold flex items-center justify-center text-xs border border-white/5 uppercase select-none shadow shrink-0 font-mono">
                WC
              </div>
              <div className="flex-1 min-w-0 select-none">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[9.5px] font-black text-slate-500 uppercase tracking-widest block font-mono">Registry Status</span>
                  <button 
                    onClick={() => handleTabTransition('registry', 'registry')}
                    className="text-[9px] text-rose-300 hover:underline font-bold"
                    type="button"
                  >
                    Log In
                  </button>
                </div>
                <h4 className="text-xs font-bold text-slate-400 truncate">Guest Mode</h4>
                <p className="text-[10px] text-slate-500 truncate">
                  Verify name &amp; ID in Registry
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Row 2: Neatly Arranged Responsive Navigation Links List */}
        <div className="bg-school-navy-dark/95 shadow-inner border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
            <nav className="flex flex-wrap items-center justify-start md:justify-center gap-2 py-2 select-none">
              
              <button 
                onClick={() => handleTabTransition('dashboard', 'dashboard')}
                className={`text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2 font-bold transition border border-transparent shrink-0 cursor-pointer ${
                  currentTab === 'dashboard' 
                    ? 'bg-school-navy text-white border-white/15 shadow-md scale-95' 
                    : 'text-slate-400 hover:text-[#FAF0E6] hover:bg-white/5'
                }`}
              >
                <LayoutDashboard className="h-4 w-4 text-rose-400" />
                <span>Home</span>
              </button>

              <button 
                onClick={() => handleTabTransition('curriculum', 'curriculum')}
                className={`text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2 font-bold transition border border-transparent shrink-0 cursor-pointer ${
                  currentTab === 'curriculum' 
                    ? 'bg-[#0E2F20] text-white border-emerald-500/10 shadow-md scale-95' 
                    : 'text-slate-400 hover:text-[#FAF0E6] hover:bg-[#152029]'
                }`}
              >
                <BookOpen className="h-4 w-4 text-emerald-400" />
                <span>Subjects Offered</span>
              </button>

              <button 
                onClick={() => handleTabTransition('registry', 'registry')}
                className={`text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2 font-bold transition border border-transparent shrink-0 cursor-pointer ${
                  currentTab === 'registry' 
                    ? 'bg-[#722F37] text-white border-[#722F37]/30 shadow-md scale-95' 
                    : 'text-slate-400 hover:text-[#FAF0E6] hover:bg-[#152029]'
                }`}
              >
                <FolderOpen className="h-4 w-4 text-rose-455 text-rose-400" />
                <span>Academic Registry</span>
              </button>

              <button 
                onClick={() => handleTabTransition('departments', 'departments')}
                className={`text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2 font-bold transition border border-transparent shrink-0 cursor-pointer ${
                  currentTab === 'departments' 
                    ? 'bg-school-navy/40 text-white border-school-navy/30 shadow-md scale-95' 
                    : 'text-slate-400 hover:text-[#FAF0E6] hover:bg-[#152029]'
                }`}
              >
                <Building2 className="h-4 w-4 text-indigo-400" />
                <span>Faculty Departments</span>
              </button>

              <button 
                onClick={() => handleTabTransition('ai-tutor', 'ai-tutor')}
                className={`text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2 font-bold transition border border-transparent shrink-0 cursor-pointer ${
                  currentTab === 'ai-tutor' 
                    ? 'bg-[#291B4C] text-white border-violet-500/20 shadow-md scale-95 animate-pulse' 
                    : 'text-slate-400 hover:text-[#FAF0E6] hover:bg-[#152029]'
                }`}
              >
                <Brain className="h-4 w-4 text-violet-450 text-violet-400" />
                <span>Crest AI Virtual Tutor</span>
              </button>

              <button 
                onClick={() => handleTabTransition('contact-address', 'contact-address')}
                className={`text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2 font-bold transition border border-transparent shrink-0 cursor-pointer ${
                  currentTab === 'contact-address' 
                    ? 'bg-indigo-950 text-white border-indigo-500/30 shadow-md scale-95' 
                    : 'text-slate-400 hover:text-[#FAF0E6] hover:bg-[#152029]'
                }`}
              >
                <MapPin className="h-4 w-4 text-indigo-400" />
                <span>Contact &amp; Address</span>
              </button>

              <button 
                onClick={() => handleTabTransition('exam-center', 'exam-center')}
                className={`text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2 font-bold transition border border-transparent shrink-0 cursor-pointer ${
                  currentTab === 'exam-center' 
                    ? 'bg-rose-950 text-white border-rose-500/30' 
                    : 'text-slate-400 hover:text-[#FAF0E6] hover:bg-[#152029]'
                }`}
              >
                <Award className="h-4 w-4 text-rose-400" />
                <span>Quiz Portal / Resource Central</span>
              </button>

              <button 
                onClick={() => handleTabTransition('admissions', 'admissions')}
                className={`text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2 font-bold transition border border-transparent shrink-0 cursor-pointer ${
                  currentTab === 'admissions' 
                    ? 'bg-sky-955 bg-sky-900/30 text-white border-sky-505 shadow-md scale-95' 
                    : 'text-slate-400 hover:text-[#FAF0E6] hover:bg-[#152029]'
                }`}
              >
                <CheckCircle2 className="h-4 w-4 text-sky-400" />
                <span>Apply for Admission</span>
              </button>

              <button 
                onClick={() => handleTabTransition('results', 'results')}
                className={`text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2 font-bold transition border border-transparent shrink-0 cursor-pointer ${
                  currentTab === 'results' 
                    ? 'bg-purple-955 bg-purple-900/40 text-white border-purple-505 shadow-md scale-95' 
                    : 'text-slate-400 hover:text-[#FAF0E6] hover:bg-[#152029]'
                }`}
              >
                <FileText className="h-4 w-4 text-purple-400" />
                <span>Check Exam Results</span>
              </button>

              {/* Secret Admin panel can only be accessed with sequential keystrokes 666222 and is never mentioned or disclosed on the website */}

            </nav>
          </div>
        </div>

      </header>

      {/* MAIN SCREEN CANVAS */}
      <main className={`flex-1 flex flex-col transition-all duration-300 relative ${getThemeBgClass()}`}>
        
        {/* INNER CONTENT PORTAL WRAPPER */}
        <div className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          
          {/* 1: LANDING HOMEPAGE HUB */}
          {currentTab === 'dashboard' && (
            <HomeHub 
              galleryItems={galleryList} 
              events={events}
              onNavigateToTab={(tab, col) => handleTabTransition(tab, col)} 
            />
          )}

          {/* 2: NIGERIAN CURRICULUM SYLLABUS DISCOVERY */}
          {currentTab === 'curriculum' && (
            <div id="curriculum-explorer-view" className="space-y-6 animate-fadeIn">
              
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="space-y-1">
                  <h2 className="text-xl font-extrabold text-[#111C24] font-display">Nigeria NERDC National Subjects Offered</h2>
                  <p className="text-xs text-slate-500 leading-normal">Inspect our comprehensive subjects offered across basic and secondary levels. Click any topic to get step-by-step masterclass tutoring on Crest AI Virtual Tutor.</p>
                </div>

                {/* Level toggle selections */}
                <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1 select-none">
                  <button 
                    onClick={()=>handleLevelChange('primary')}
                    className={`text-[10px] uppercase font-black px-3 py-1.5 rounded-lg transition cursor-pointer ${selectedCurriculumLevel === 'primary' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    Grade 1-5
                  </button>
                  <button 
                    onClick={()=>handleLevelChange('junior_secondary')}
                    className={`text-[10px] uppercase font-black px-3 py-1.5 rounded-lg transition cursor-pointer ${selectedCurriculumLevel === 'junior_secondary' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    Junior Sec (BECE)
                  </button>
                  <button 
                    onClick={()=>handleLevelChange('senior_secondary')}
                    className={`text-[10px] uppercase font-black px-3 py-1.5 rounded-lg transition cursor-pointer ${selectedCurriculumLevel === 'senior_secondary' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    Senior Sec (WAEC)
                  </button>
                </div>
              </div>

              {/* Class and Accordion list of subjects */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                
                {/* Specific class sidebar tabs (col-span-3) */}
                <div className="md:col-span-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1 select-none">
                  <span className="text-[10px] font-black text-slate-400 block px-2 py-1 uppercase tracking-wider">CLASSES OFFERED</span>
                  {levelClasses[selectedCurriculumLevel].map((item) => (
                    <button 
                      key={item}
                      onClick={() => {setSelectedCurriculumClass(item); setExpandedCurriculumSubject(null);}}
                      className={`w-full text-left text-xs px-3 py-2.5 rounded-lg font-bold transition cursor-pointer ${selectedCurriculumClass === item ? 'bg-emerald-50 text-emerald-800 border-l-4 border-emerald-500 shadow-sm' : 'text-slate-650 hover:bg-slate-50'}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                {/* Subject topic accordions (col-span-9) */}
                <div className="md:col-span-9 space-y-4">
                  {selectedCurriculumLevel === 'senior_secondary' && (
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3 select-none text-left">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-black text-rose-800 bg-rose-50 px-2.5 py-1 rounded border border-rose-150 uppercase tracking-wider">Faculty Stream Selector</span>
                        <h4 className="text-xs font-extrabold text-slate-800">Select Senior Secondary Department to pick a stream:</h4>
                      </div>
                      <div className="flex flex-wrap gap-1.5 md:gap-2">
                        {[
                          { key: 'all', label: 'All Subjects (Unified Registry)' },
                          { key: 'Sciences (STEM)', label: 'Sciences (STEM)' },
                          { key: 'Arts & Humanities', label: 'Arts & Humanities' },
                          { key: 'Commercial & Vocational Studies', label: 'Commercial & Vocational' }
                        ].map((deptOpt) => (
                          <button
                            key={deptOpt.key}
                            type="button"
                            onClick={() => {
                              setSelectedCurriculumDepartment(deptOpt.key);
                              setExpandedCurriculumSubject(null);
                            }}
                            className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                              selectedCurriculumDepartment === deptOpt.key
                                ? 'bg-indigo-950 text-white border-indigo-900 shadow-sm'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-250'
                            }`}
                          >
                            {deptOpt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-emerald-50 border border-emerald-150 rounded-2xl text-xs text-emerald-800 flex items-center space-x-1.5 text-left">
                    <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
                    <span>Selected: <strong>{selectedCurriculumClass} Syllabus</strong>{selectedCurriculumLevel === 'senior_secondary' && selectedCurriculumDepartment !== 'all' ? ` filtered by ${selectedCurriculumDepartment} stream` : ''}. Click any course name below to inspect subjects topics in detail.</span>
                  </div>

                  {!currentCurriculum ? (
                    <p className="text-xs text-slate-450 italic p-6">No data registered for this class. Contact curriculum board.</p>
                  ) : (
                    currentCurriculum.subjects
                      .filter((sub) => {
                        // If not senior secondary, or filtered is All, keep everything
                        if (selectedCurriculumLevel !== 'senior_secondary' || selectedCurriculumDepartment === 'all') {
                          return true;
                        }
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
                        // Check department inclusions
                        if (selectedCurriculumDepartment === 'Sciences (STEM)') {
                          return ["physics", "chemistry"].includes(sub.name.toLowerCase());
                        }
                        if (selectedCurriculumDepartment === 'Arts & Humanities') {
                          return ["literature in english"].includes(sub.name.toLowerCase());
                        }
                        if (selectedCurriculumDepartment === 'Commercial & Vocational Studies') {
                          return ["financial accounting", "commerce"].includes(sub.name.toLowerCase());
                        }
                        return true;
                      })
                      .map((sub) => {
                        const isExpanded = expandedCurriculumSubject === sub.name;
                        return (
                          <div key={sub.name} className="bg-white rounded-2xl border border-slate-200 border-slate-200 shadow-sm overflow-hidden transition-all duration-200">
                            <button 
                              onClick={()=>setExpandedCurriculumSubject(isExpanded ? null : sub.name)}
                              className="w-full text-left p-5 flex justify-between items-center hover:bg-slate-50 transition cursor-pointer"
                            >
                              <div>
                                <strong className="text-slate-900 text-sm font-extrabold leading-tight block">{sub.name}</strong>
                                <span className="text-[11px] text-slate-500">{sub.description}</span>
                              </div>
                              <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-90 text-indigo-505' : ''}`} />
                            </button>

                            {isExpanded && (
                              <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-3 animate-slideUp">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block text-left">CURRICULUM TOPICS PATHWAY</span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {sub.topics.map((tpc) => (
                                    <div key={tpc} className="bg-white p-3.5 rounded-xl border border-slate-150 flex justify-between items-center gap-4 hover:shadow-sm transition">
                                      <span className="text-xs text-slate-800 leading-normal font-medium text-left">{tpc}</span>
                                      <button 
                                        onClick={() => triggerCurriculumTopicTutoring(sub.name, tpc)}
                                        className="text-[10px] font-extrabold bg-[#111C24] hover:bg-emerald-600 hover:text-white text-[#FAF0E6] px-2.5 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer transition flex-shrink-0"
                                      >
                                        <span>Tutor Topic</span>
                                        <ArrowRight className="h-3 w-3" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                  )}
                </div>

              </div>

            </div>
          )}

          {/* 3: FACULTY DEPARTMENTS list */}
          {currentTab === 'departments' && (
            <div id="faculty-departments-portal" className="space-y-6 animate-fadeIn">
              <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <h2 className="text-xl font-extrabold text-slate-900 font-display">Faculty Department Divisions</h2>
                <p className="text-xs text-slate-500 leading-normal">Academic structures are split into key disciplines led by master teachers.</p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {LEADER_DEPARTMENTS.map((dept) => (
                  <div key={dept.name} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-4">
                    <div className="space-y-1">
                      <strong className="text-slate-950 text-base font-extrabold block font-display leading-tight">{dept.name}</strong>
                      <p className="text-xs text-slate-550 text-slate-500 leading-relaxed">{dept.description}</p>
                    </div>

                    <div className="border-t border-slate-100 pt-3 space-y-2">
                      <span className="text-[10px] font-black text-slate-400 block uppercase">COURSES UNDER STREAM</span>
                      {dept.subjects.map((s) => (
                        <div key={s.name} className="flex justify-between items-center p-2 bg-slate-50 rounded-lg border border-slate-150">
                          <div>
                            <span className="text-xs text-slate-850 font-bold block leading-tight">{s.name}</span>
                            <span className="text-[10px] text-slate-450 text-slate-500 leading-normal">{s.description}</span>
                          </div>
                          <button 
                            onClick={()=>{setTutorSubject(s.name); handleTabTransition('ai-tutor', 'ai-tutor');}}
                            className="p-1 px-2.5 bg-indigo-50 border border-indigo-150 rounded text-[9px] font-bold text-indigo-700 hover:bg-indigo-600 hover:text-white cursor-pointer transition flex-shrink-0"
                          >
                            Tutor Course
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4: CREST AI DIALOG TUTOR CENTRE */}
          {currentTab === 'ai-tutor' && (
            <div id="crest-ai-tutoring-tab" className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
              <CrestAITutor 
                studentName={studentName} 
                studentClass={studentClass} 
                studentDepartment={studentDepartment} 
              />
            </div>
          )}

          {/* 5: TIMED 30-MINUTE EXAMINATION SIMULATOR */}
          {currentTab === 'exam-center' && (
            <div id="exam-simulator-core" className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
              
              {!isQuizActive ? (
                /* Dynamic side-by-side Layout and resource lists */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Adaptive Quiz Portal Config (col-span-8) */}
                  <div className="lg:col-span-8 space-y-6">
                    <div id="quiz-config-view" className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-202 border-slate-200 shadow-md space-y-6 animate-fadeIn">
                      
                      <div className="space-y-2 border-b border-slate-100 pb-4">
                        <span className="text-[10px] bg-rose-600 text-white font-black px-2.5 py-1 rounded-full uppercase tracking-widest leading-none">
                          Quiz Portal / Resource Central
                        </span>
                        <h2 className="text-2xl font-extrabold text-[#111C24] font-display">Quiz Portal &amp; Resource Central</h2>
                        <p className="text-xs text-slate-505 text-slate-500 leading-relaxed">
                          Welcome to the premium Wolcrest College Quiz Portal and unified resource base. Configure your standard practice parameters, access dynamic reference study libraries, or sit for our realistic West African 60-question 30-minute timed mock exams.
                        </p>
                      </div>

                      {/* Config settings selectors */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">CHOOSE EXAMINATION STANDARD *</label>
                          <select 
                            value={selectedExamType}
                            onChange={(e)=>setSelectedExamType(e.target.value as any)}
                            className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-bold focus:outline-none focus:border-rose-400"
                          >
                            <option value="WAEC">WAEC (Senior West African Certificate)</option>
                            <option value="JAMB">JAMB (UTME National Entrance Series)</option>
                            <option value="Junior WAEC">Junior WAEC / BECE Syllabus</option>
                            <option value="Common Entrance">National Common Entrance (Grade 5 Target)</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">CHOOSE SUBJECT STREAM *</label>
                          <select 
                            value={selectedQuizSubject}
                            onChange={(e)=>setSelectedQuizSubject(e.target.value)}
                            className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-bold focus:outline-none focus:border-rose-400"
                          >
                            {VALID_SUBJECTS.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Toggle checklist items */}
                      <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1">
                          <strong className="text-xs text-rose-955 block font-extrabold text-[#722F37]">Immediate Explanation Response (Tutor Mode)?</strong>
                          <p className="text-[11px] text-slate-650 leading-normal max-w-sm">If checked, Crest AI will reveal descriptions and correct answers instantly upon selecting an option option.</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={isTutorMode} 
                          onChange={(e)=>setIsTutorMode(e.target.checked)}
                          className="w-5 h-5 rounded border-slate-300 focus:ring-rose-400 text-rose-500 cursor-pointer"
                        />
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-mono">TIMER DURATION: 30:00 (MINUTES COUNTDOWN)</span>
                        <button 
                          onClick={handleStartQuiz}
                          disabled={isGeneratingLoading}
                          className="bg-[#111C24] hover:bg-emerald-600 hover:text-white text-[#FAF0E6] font-extrabold text-xs px-6 py-3.5 rounded-xl transition cursor-pointer flex items-center space-x-2 shadow"
                        >
                          {isGeneratingLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Generating Dynamic AI Questions...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 text-rose-400 animate-spin" />
                              <span>Begin Examination Mock Now</span>
                            </>
                          )}
                        </button>
                      </div>

                    </div>
                  </div>

                  {/* Right Column: Resource Central Cabinet (col-span-4) */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 animate-fadeIn">
                      
                      <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100 select-none">
                        <div className="p-2 bg-rose-500/10 text-rose-600 rounded-xl">
                          <BookOpen className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <span className="text-[9px] text-[#A81E32] font-black uppercase tracking-wider block">Resource Central</span>
                          <h4 className="font-extrabold text-slate-900 text-xs uppercase font-display tracking-wider">Academic Downloads</h4>
                        </div>
                      </div>

                      <p className="text-[11.5px] text-slate-500 leading-relaxed">
                        Assess premium Continuous Assessment study booklets, syllabi directives, and formulas prep sheets synced in real-time from our Node.js database:
                      </p>

                      <div className="space-y-4 pt-1">
                        {courseMaterialsList.length === 0 ? (
                          <div className="p-6 bg-slate-50 border border-slate-150 rounded-2xl text-center text-xs text-slate-400 italic">
                            No study materials compiled yet. Visit Admin Portal to add materials.
                          </div>
                        ) : (
                          courseMaterialsList.map((material) => (
                            <div key={material.id} className="p-4 bg-slate-50/70 hover:bg-rose-100/[0.04] transition border border-slate-200 rounded-2xl space-y-2">
                              <div className="flex justify-between items-start gap-1">
                                <span className="bg-slate-200 text-slate-700 font-mono text-[8.5px] font-bold px-1.5 py-0.5 rounded uppercase">
                                  {material.class}
                                </span>
                                <span className="text-[9px] text-school-wine font-extrabold font-mono uppercase">
                                  {material.subject}
                                </span>
                              </div>
                              <div>
                                <h5 className="text-xs font-extrabold text-[#111C24] leading-tight">
                                  {material.title}
                                </h5>
                                <p className="text-[10.5px] text-slate-500 mt-1 lines-clamp-2 leading-normal">
                                  {material.description}
                                </p>
                              </div>
                              <a 
                                href={material.url} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="inline-flex w-full justify-center items-center gap-1.5 text-[10px] font-extrabold tracking-wider bg-slate-200 hover:bg-[#111C24] hover:text-white text-slate-800 p-2.5 rounded-xl transition uppercase"
                              >
                                📥 File Download
                              </a>
                            </div>
                          ))
                        )}
                      </div>

                    </div>
                  </div>

                </div>
              ) : (
                /* Active Quiz Simulation viewport */
                <div id="quiz-active-view" className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-fadeIn">
                  
                  {/* Active Simulator Header */}
                  <div className="p-5 bg-slate-900 text-white flex justify-between items-center z-10 relative overflow-hidden">
                    <div className="space-y-1">
                      <span className="text-[9px] bg-rose-600 text-white font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">{selectedExamType} MOCK</span>
                      <h3 className="text-sm font-extrabold font-display leading-tight">{selectedQuizSubject} Simulation</h3>
                    </div>

                    {/* 30mins Countdown Timer Badge */}
                    <div className="flex items-center space-x-2 bg-rose-950 border border-rose-800 text-rose-300 rounded-xl px-4 py-2 font-mono text-sm uppercase select-none shadow">
                      <Clock className="w-4 h-4 animate-pulse text-rose-500" />
                      <span>COUNTDOWN: </span>
                      <strong className="font-extrabold tracking-widest text-[#FAF0E6]">{formatTimer(quizTimerSeconds)}</strong>
                    </div>
                  </div>

                  {/* Question view */}
                  {quizQuestions.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-500">Compiling standard curriculum structures... Please hold.</div>
                  ) : (
                    <div className="p-6 sm:p-10 space-y-8 min-h-[400px]">
                      
                      {/* Progress bar */}
                      <div className="space-y-1.5 select-none">
                        <div className="flex justify-between text-[10px] text-slate-400 uppercase font-black tracking-wider">
                          <span>Progress Rate</span>
                          <span>QUESTION {currentQuizIndex + 1} OF {quizQuestions.length}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div 
                            className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300" 
                            style={{ width: `${((currentQuizIndex + 1) / quizQuestions.length) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Display score report card once finished */}
                      {isQuizFinished ? (
                        <div id="exam-scorecard-results" className="text-center space-y-6 py-6 animate-slideUp">
                          
                          {/* Auto collection alert notification */}
                          {quizAutoCollected && (
                            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-start space-x-2 mx-auto max-w-xl text-left">
                              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <strong className="block text-xs uppercase text-rose-950">TIME EXPIRED!</strong>
                                <p className="text-xs leading-normal">Your examination paper was automatically collected by the Wolcrest College Exam Proctoring Board. Below are your score results.</p>
                              </div>
                            </div>
                          )}

                          <div className="p-4 bg-rose-50 inline-block mx-auto rounded-full border border-rose-200">
                            <Award className="w-12 h-12 text-indigo-950" />
                          </div>

                          <div className="space-y-1.5">
                            <h4 className="text-2xl font-extrabold font-display uppercase tracking-wider text-slate-900">Scorecard Asassembled</h4>
                            <p className="text-xs text-slate-500">Student Scholar: <strong className="text-slate-800">{studentName}</strong> • Class: <strong>{studentClass}</strong></p>
                          </div>

                          {/* Calculated values block */}
                          <div className="grid grid-cols-3 max-w-md mx-auto gap-3 text-center border-y border-slate-150 py-4 font-mono">
                            <div>
                              <span className="text-[9px] text-[#A9B1D6] text-slate-450 block uppercase font-sans">TOTAL SCORED</span>
                              <strong className="text-2xl font-black text-indigo-700">
                                {Object.keys(selectedAnswers).filter(k => selectedAnswers[Number(k)] === quizQuestions[Number(k)].correctIndex).length} / {quizQuestions.length}
                              </strong>
                            </div>
                            <div>
                              <span className="text-[9px] text-[#A9B1D6] text-slate-450 block uppercase font-sans">ACCURACY RATIO</span>
                              <strong className="text-2xl font-black text-indigo-600">
                                {Math.round((Object.keys(selectedAnswers).filter(k => selectedAnswers[Number(k)] === quizQuestions[Number(k)].correctIndex).length / quizQuestions.length) * 100)}%
                              </strong>
                            </div>
                            <div>
                              <span className="text-[9px] text-[#A9B1D6] text-slate-450 block uppercase font-sans">TIME CONSUMED</span>
                              <strong className="text-2xl font-black text-slate-800">
                                {formatTimer(1800 - quizTimerSeconds)}
                              </strong>
                            </div>
                          </div>

                          {/* Subject evaluation remark */}
                          <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl max-w-lg mx-auto text-xs text-slate-600 text-left">
                            <strong>Academic Counsel Counselor:</strong>
                            <p className="leading-relaxed mt-1">
                              {Object.keys(selectedAnswers).filter(k => selectedAnswers[Number(k)] === quizQuestions[Number(k)].correctIndex).length / quizQuestions.length >= 0.70 
                                ? "Outstanding performance! Candidates exhibit clean mathematical and mechanical precision according to the highest National specifications."
                                : "Diligent study recommended. Sitting for extra virtual lessons using Crest AI on missed topics is advised to exceed the WAEC standard boundaries."}
                            </p>
                          </div>

                          <button 
                            onClick={()=>{setIsQuizActive(false); setQuizQuestions([]);}} 
                            className="bg-[#111C24] hover:bg-rose-600 hover:text-white font-black text-xs px-6 py-3.5 rounded-xl transition cursor-pointer"
                          >
                            Return to Exam Registry
                          </button>
                        </div>
                      ) : (
                        /* Continuous Question card answering */
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <span className="text-[10px] text-slate-450 text-slate-400 block uppercase font-semibold">QUESTION STUDY</span>
                            <h4 className="text-slate-900 text-base font-extrabold leading-relaxed">
                              {quizQuestions[currentQuizIndex].question}
                            </h4>
                          </div>

                          {/* Options Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {quizQuestions[currentQuizIndex].options.map((opt, oIdx) => {
                              const isSelected = selectedAnswers[currentQuizIndex] === oIdx;
                              const isCorrect = quizQuestions[currentQuizIndex].correctIndex === oIdx;
                              const hasAnswered = selectedAnswers[currentQuizIndex] !== undefined;

                              // Highlight colors
                              let cardStyle = "border-slate-200 hover:bg-slate-50";
                              if (isSelected) {
                                cardStyle = "border-indigo-650 bg-indigo-50 border-indigo-500 text-indigo-900 font-extrabold";
                              }
                              if (isTutorMode && hasAnswered) {
                                if (isCorrect) {
                                  cardStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-extrabold";
                                } else if (isSelected) {
                                  cardStyle = "border-rose-500 bg-rose-50 text-rose-900 font-extrabold";
                                }
                              }

                              const labels = ["A", "B", "C", "D"];
                              return (
                                <button 
                                  key={oIdx}
                                  disabled={hasAnswered && !isTutorMode} // let them change if not tutor mode
                                  onClick={() => setSelectedAnswers({ ...selectedAnswers, [currentQuizIndex]: oIdx })}
                                  className={`text-left p-4 rounded-2xl border text-xs leading-normal font-sans cursor-pointer transition flex items-start space-x-3 ${cardStyle}`}
                                >
                                  <span className="p-1 px-2.5 rounded-lg bg-slate-100 font-black text-[10px] text-slate-800 border border-slate-200">{labels[oIdx]}</span>
                                  <span className="mt-0.5">{opt}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Displays answers feedback instantly in Tutor Mode */}
                          {isTutorMode && selectedAnswers[currentQuizIndex] !== undefined && (
                            <div className="p-4 bg-indigo-50 border border-indigo-150 rounded-2xl text-xs text-indigo-900 space-y-1.5 animate-slideUp">
                              <strong className="block text-[10px] uppercase tracking-wider text-indigo-900 font-display">Crest AI Citational Explanation:</strong>
                              <p className="leading-relaxed">{quizQuestions[currentQuizIndex].explanation}</p>
                            </div>
                          )}

                          {/* Question Action Buttons */}
                          <div className="pt-6 border-t border-slate-100 flex justify-between items-center select-none file:">
                            <button
                              disabled={currentQuizIndex === 0}
                              onClick={()=>setCurrentQuizIndex(currentQuizIndex - 1)}
                              className="text-xs font-bold text-slate-550 text-slate-500 hover:text-slate-900 cursor-pointer disabled:opacity-40"
                            >
                              Previous Question
                            </button>

                            {currentQuizIndex < quizQuestions.length - 1 ? (
                              <button 
                                onClick={()=>setCurrentQuizIndex(currentQuizIndex + 1)}
                                className="bg-[#111C24] text-[#FAF0E6] hover:bg-indigo-650 hover:bg-slate-900 text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer shadow transition"
                              >
                                Next question
                              </button>
                            ) : (
                              <button 
                                onClick={()=>setIsQuizFinished(true)}
                                className="bg-emerald-600 text-white font-extrabold text-xs px-6 py-3 rounded-xl hover:bg-slate-900 cursor-pointer shadow transition animate-bounce"
                              >
                                Complete &amp; Hand in Paper
                              </button>
                            )}
                          </div>

                        </div>
                      )}

                    </div>
                  )}

                </div>
              )}

            </div>
          )}

          {/* 6: STUDENT ADMISSIONS FORM */}
          {currentTab === 'admissions' && (
            <AdmissionsPortal />
          )}

          {/* 7: STUDENT EXAM CHECK RESULTS OFFICE */}
          {currentTab === 'results' && (
            <ResultsChecker />
          )}

          {/* NEW TAB: CONSOLIDATED CONTACT & INSTITUTIONAL PHYSICAL ADDRESS OF WOLCREST SCHOOLS */}
          {currentTab === 'contact-address' && (
            <div id="contact-and-address-view" className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
              
              {/* Top Banner section */}
              <div className="bg-gradient-to-r from-school-navy via-slate-900 to-school-wine text-white p-6 sm:p-10 rounded-3xl shadow-lg relative overflow-hidden select-none">
                <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none"></div>
                <div className="relative z-10 space-y-2">
                  <span className="text-[10px] bg-white/10 text-rose-300 font-mono font-black tracking-widest px-3 py-1 rounded-full uppercase border border-white/15">
                    Institution Communication Bureau
                  </span>
                  <h2 className="text-2xl sm:text-3.5xl font-black font-display tracking-tight leading-none uppercase">
                    Contact &amp; Campus Address
                  </h2>
                  <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                    Have questions regarding continuous grades, certificate emissions, syllabus alignment, or prospective admissions? Reach the Registrar Admin desks instantly below.
                  </p>
                </div>
              </div>

              {/* Multi-grid detailing Address Cards / Forms */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Physical Location details and communication desk coordinates (col-span-5) */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Real Physical Mailing Coordinates */}
                  <div className="bg-gradient-to-br from-white via-slate-50/50 to-rose-50/10 p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                    <div className="flex items-center space-x-3 select-none">
                      <div className="p-2.5 bg-school-wine/10 text-school-wine rounded-xl">
                        <MapPin className="h-5 w-5 animate-bounce" />
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase font-black tracking-wider leading-none">Physical Presence</span>
                        <h4 className="font-extrabold text-[#111C24] text-xs uppercase font-display tracking-wider">Campus Headwaters Address</h4>
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1.5 select-text">
                      <strong className="text-[9px] text-school-navy font-bold block tracking-widest uppercase">Official Location:</strong>
                      <p className="text-xs font-bold text-slate-800 leading-normal">
                        4/6 Karonwi Street, <br />
                        Egan, Igando, <br />
                        Lagos, Nigeria.
                      </p>
                    </div>

                    <div className="border-t border-slate-150 pt-4 space-y-3">
                      <strong className="text-[9px] text-slate-400 block tracking-widest uppercase select-none">Direct Desk Telephony:</strong>
                      <div className="space-y-2 select-text font-mono">
                        <div className="flex items-center space-x-2 text-xs text-slate-650">
                          <Phone className="h-3.5 w-3.5 text-slate-450 text-slate-400" />
                          <span>Phone Calls: <strong className="font-bold text-slate-800">08023235270</strong></span>
                        </div>
                        <div className="flex items-start space-x-2 text-xs text-slate-650">
                          <span className="text-xs shrink-0 select-none">💬</span>
                          <span>WhatsApp Desk: <strong className="font-bold text-[#075E54]">+2348023235270</strong><br/><span className="text-[10px] text-slate-400">or</span> <strong className="font-bold text-[#075E54]">+2349053278710</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-150 pt-4 space-y-2 select-none">
                      <strong className="text-[9px] text-slate-400 block tracking-widest uppercase">Support Registry Hours:</strong>
                      <div className="flex items-center space-x-2 text-xs text-slate-650">
                        <Clock className="h-4 w-4 text-school-wine animate-pulse" />
                        <div>
                          <p className="font-bold text-slate-800 leading-none">Monday — Friday: <span className="font-mono">07:00 — 15:30 (7:00 AM — 3:30 PM)</span></p>
                          <p className="text-[10px] text-rose-600 mt-1 font-bold">Saturday &amp; Sunday: <span className="font-mono uppercase font-black bg-rose-50 px-1.5 py-0.5 rounded border border-rose-150">Closed</span></p>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Institutional Pledge Trust badge */}
                  <div className="p-5 bg-[#111C24] text-white rounded-2xl border border-white/5 space-y-2 select-none">
                    <strong className="text-rose-400 font-display font-extrabold uppercase text-xs block tracking-wider">Institutional Seal of Assurance</strong>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      "Where the future is assured" is not just our motto, but our binding covenant. Every student scholar receives premium character guidance and accelerated technology acceleration.
                    </p>
                  </div>

                </div>

                {/* Relocated and Highly Formatted Registry Dispatch Form (col-span-7) */}
                <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden flex flex-col justify-between">
                  <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center select-none">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-5 w-5 text-school-wine" />
                      <h3 className="font-extrabold text-slate-800 text-xs tracking-wide uppercase font-display">Dispatch Statement to Administration Registrar</h3>
                    </div>
                    <span className="text-[10px] font-bold bg-school-wine/10 text-school-wine px-2.5 py-1 rounded-full uppercase">Registry Desk</span>
                  </div>

                  <div className="p-6 sm:p-8 space-y-4">
                    <p className="text-xs text-slate-500 leading-normal">
                      Need updates on terminal score amendments, continuous assessment spreadsheets, or certificate collections? Submit your inquiries directly to our administrative registrars.
                    </p>

                    {registrySuccessMessage ? (
                      <div className="p-4.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 space-y-1.5 animate-slideUp select-none">
                        <p className="font-bold text-emerald-950 uppercase text-[10px] tracking-wider">Dispatch Succeeded!</p>
                        <p className="leading-relaxed">{registrySuccessMessage}</p>
                        <button 
                          onClick={() => setRegistrySuccessMessage(null)}
                          className="text-[10.5px] text-school-navy font-bold underline block pt-1.5 cursor-pointer hover:text-emerald-900"
                        >
                          Send another administrative message
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleSendRegistryMessage} className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">MESSAGE SUBJECT / DEPARTMENT *</label>
                          <input 
                            type="text" 
                            required
                            value={registrySubject}
                            onChange={(e) => setRegistrySubject(e.target.value)}
                            placeholder="e.g., SSS 3 Continuous Assessment Discrepancy, Fees Spreadsheets..."
                            className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-school-wine focus:bg-white focus:shadow-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">MESSAGE CORE QUERY / STATEMENT *</label>
                          <textarea 
                            rows={4}
                            required
                            value={registryBody}
                            onChange={(e) => setRegistryBody(e.target.value)}
                            placeholder="Detail your requirements, naming the Scholar Profile, class, and particular continuous grades to check..."
                            className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-school-wine focus:bg-white focus:shadow-sm"
                          />
                        </div>
                        <button 
                          type="submit"
                          disabled={isSendingRegistry}
                          className="w-full bg-[#111C24] hover:bg-school-wine hover:text-white text-white text-xs uppercase font-black py-3.5 rounded-xl transition cursor-pointer flex items-center justify-center space-x-2 active:scale-95 shadow"
                        >
                          {isSendingRegistry ? (
                            <span>Routing inquiry statement properties...</span>
                          ) : (
                            <>
                              <span>Dispatch Statement to Secretariat</span>
                              <ArrowRight className="h-4 w-4" />
                            </>
                          )}
                        </button>
                      </form>
                    )}

                    <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-450 text-slate-400 font-mono">
                      <span>OFFICIAL DESK EMAIL:</span>
                      <a href="mailto:wolcrestschools@gmail.com" className="text-school-navy font-extrabold hover:underline select-all">
                        wolcrestschools@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* NEW TAB: ACADEMIC REGISTRY CONSOLE */}
          {currentTab === 'registry' && (
            <AdminPortal 
              onDbUpdated={refreshGallery} 
              studentName={studentName}
              studentClass={studentClass}
              studentDepartment={studentDepartment}
              studentId={studentId}
              isStudentLoggedIn={isStudentLoggedIn}
              onStudentLogin={handleStudentLogin}
              onStudentLogout={handleStudentLogout}
            />
          )}

          {/* 8: DOUBLE-LOCKED ADMIN CONTROL CORE */}
          {currentTab === 'admin' && (
            <AdminPortal 
              onDbUpdated={refreshGallery} 
              studentName={studentName}
              studentClass={studentClass}
              studentDepartment={studentDepartment}
              studentId={studentId}
              isStudentLoggedIn={isStudentLoggedIn}
              onStudentLogin={handleStudentLogin}
              onStudentLogout={handleStudentLogout}
            />
          )}

        </div>
      </main>

    </div>
  );
}
