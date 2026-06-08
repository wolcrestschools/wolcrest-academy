import React, { useState } from 'react';
import { 
  GraduationCap, 
  Compass, 
  Award, 
  Calendar, 
  Image as ImageIcon, 
  Users, 
  CheckCircle,
  HelpCircle,
  Clock,
  Mail,
  ArrowRight,
  Shield,
  Sparkles,
  BookOpen,
  MessageSquare,
  MapPin,
  ChevronRight,
  Info,
  FolderOpen
} from 'lucide-react';
import { GalleryItem, SchoolEvent } from '../types';

// Let's use our generated high quality banner image asset representation path directly as a string
const schoolBanner = "/src/assets/images/wolcrest_school_banner_1780078210239.png";

interface HomeHubProps {
  galleryItems: GalleryItem[];
  events: SchoolEvent[];
  onNavigateToTab: (tab: any, themeColor: string) => void;
}

export default function HomeHub({ galleryItems, events, onNavigateToTab }: HomeHubProps) {
  // Dynamic Tab Switcher state for those headings at the top of the homepage
  const [activeInfoTab, setActiveInfoTab] = useState<'portal' | 'contact' | 'support'>('portal');



  return (
    <div id="school-homepage-hub" className="space-y-8 animate-fadeIn text-slate-800">
      
      {/* 1. INTERACTIVE HORIZONTAL HEADER TABS SWITCHER (ON TOP) */}
      <section className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-md">
        <span className="text-[9px] font-black text-school-wine tracking-widest block uppercase text-center mb-3">
          PORTAL RESOURCE CENTRAL • CHOOSE SECTION TO VIEW INFO
        </span>
        
        {/* Horizontal Pressable Heading Bar */}
        <div className="flex flex-col sm:flex-row gap-2 border-b border-slate-100 pb-3">
          <button 
            type="button"
            onClick={() => setActiveInfoTab('portal')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer ${
              activeInfoTab === 'portal' 
                ? 'bg-school-navy text-white shadow-md' 
                : 'bg-slate-50 hover:bg-slate-100 text-slate-650'
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            <span>Wolcrest Student Portal</span>
          </button>

          <button 
            type="button"
            onClick={() => onNavigateToTab('contact-address', 'contact-address')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer bg-slate-50 hover:bg-slate-100 text-slate-650`}
          >
            <Mail className="h-4 w-4 text-school-wine" />
            <span>Contact &amp; Address</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveInfoTab('support')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer ${
              activeInfoTab === 'support' 
                ? 'bg-school-wine text-white shadow-md' 
                : 'bg-slate-50 hover:bg-slate-100 text-slate-650'
            }`}
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>Crest AI Support Desk</span>
          </button>
        </div>

        {/* Dynamic content rendering depending on chosen top heading tab */}
        <div className="pt-4 px-2 select-none animate-fadeIn">

          {activeInfoTab === 'portal' && (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <h4 className="font-display font-extrabold text-sm text-slate-900 uppercase">
                  Secure Digital Access Gateway
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
                  Inspect NERDC standard syllabus checklists, check official school terminal score sheets, and simulate WAEC/JAMB examinations with your unique scholar configurations. Save high grades to build continuous assessment history logs.
                </p>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <span className="text-emerald-600 text-xs font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  Registry Socket Live
                </span>
                <button 
                  onClick={() => onNavigateToTab('results', 'results')}
                  className="bg-school-navy text-white font-extrabold text-[11px] uppercase tracking-wider px-4 py-2.5 rounded-lg hover:bg-school-wine transition cursor-pointer flex items-center space-x-1"
                >
                  <span>Go to Scores Ledger</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}



          {activeInfoTab === 'support' && (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <h4 className="font-display font-extrabold text-sm text-school-wine uppercase">
                  Crest AI West African Virtual Tutor
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
                  Need study support with SSS 3 Chemistry equations, Physics speed integrals, or Further Mathematics calculus indices? Our NERDC-compliant digital instructor is armed with continuous practice problems.
                </p>
              </div>
              <button 
                onClick={() => onNavigateToTab('ai-tutor', 'ai-tutor')}
                className="bg-school-wine text-white font-extrabold text-[11px] uppercase tracking-wider px-4 py-2.5 rounded-lg hover:bg-school-navy transition cursor-pointer flex items-center space-x-1 flex-shrink-0"
              >
                <span>Launch virtual classroom</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 2. REALISTIC SCHOOL PORTFOLIO IMAGE CARD WITH MOTTO AND ADDRESS */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-5 relative bg-slate-900 min-h-[300px] flex items-center justify-center p-6 border-b lg:border-b-0 lg:border-r border-slate-150">
          {/* We display the generated school banner here */}
          <div className="absolute inset-0 bg-gradient-to-tr from-school-navy/80 via-slate-950/90 to-school-wine/80 z-10"></div>
          <img 
            src={schoolBanner} 
            alt="Wolcrest College Majestic Crest" 
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay scale-105"
          />
          
          <div className="relative z-20 text-center space-y-4 max-w-sm">
            <span className="text-[10px] bg-white/10 text-rose-400 font-mono font-black tracking-widest px-3 py-1 rounded-full uppercase border border-white/10">
              OFFICIAL CREST
            </span>
            <h3 className="font-display font-black text-2xl tracking-wide text-white uppercase">
              WOLCREST SCHOOLS
            </h3>
            <p className="text-xs italic text-slate-200">
              "Where the future is assured"
            </p>
          </div>
        </div>

        {/* Detailed Address Block alongside description */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6 bg-slate-50/50">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 bg-school-navy/10 text-school-navy px-3 py-1 rounded-lg">
              <MapPin className="h-4 w-4 text-school-wine" />
              <span className="text-[11px] font-mono uppercase font-black tracking-wider">
                Elite Campus Coordinates
              </span>
            </div>

            <h2 className="text-2xl font-black text-slate-900 font-display">
              Wolcrest College Headquarters
            </h2>
            <p className="text-xs text-slate-650 leading-relaxed">
              We stand strategically oriented within a serene educational sanctuary suited for deep cerebral focus, active athletic training, and creative scientific exploration. Visiting hours for prospective scholars, student families, and administrative boards remain open daily.
            </p>

            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm space-y-2 select-text">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                OFFICIAL MAILING & RESIDENTIAL PHYSICAL ADDRESS:
              </span>
              <p className="text-xs font-bold text-neutral-800 leading-normal flex items-start gap-1.5">
                <span className="text-school-wine select-none">📍</span>
                <span>4/6 Karonwi Street, Egan, Igando, Lagos, Nigeria.</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-mono">
                <div>📞 Phone Calls: <span className="font-bold text-slate-800">08023235270</span></div>
                <div>💬 WhatsApp: <span className="font-bold text-[#075E54]">+2348023235270</span> / <span className="font-bold text-[#075E54]">+2349053278710</span></div>
                <div className="sm:col-span-2">✉️ Registrar: <span className="font-bold text-school-navy underline select-all">wolcrestschools@gmail.com</span></div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-3 border-t border-slate-200/60 text-[11px] text-slate-400 uppercase font-mono tracking-wider select-none">
            <span>REGISTRY ID: WC-LAG30005</span>
            <span className="text-school-wine font-black">"WHERE THE FUTURE IS ASSURED"</span>
          </div>
        </div>
      </section>

      {/* 3. MAJESTIC INSTUTITIONAL BANNER WITH MOTTO & OFFICIAL BRAND COLORS */}
      <section className="bg-gradient-to-br from-[#132B66] via-[#1C3B82] to-[#722F37] text-white rounded-3xl p-8 sm:p-14 shadow-xl relative overflow-hidden">
        
        {/* Aesthetic Background Swirl overlay */}
        <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-15 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-1/3 h-1/2 opacity-20 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-school-wine to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/15">
            <span className="w-2 h-2 rounded-full bg-school-wine animate-pulse"></span>
            <span className="text-[10px] font-mono text-slate-100 font-bold uppercase tracking-widest">
              Where the future is assured
            </span>
          </div>

          <div className="space-y-4">
            <span className="text-[11px] uppercase tracking-widest font-mono text-rose-400 font-bold">WELCOME TO WOLCREST COLLEGE</span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight font-display text-white leading-none">
              Where the Future <br className="hidden sm:inline" />
              is <span className="text-rose-400 underline decoration-[#722F37] decoration-2 underline-offset-4">Assured</span>
            </h1>
          </div>

          <p className="text-sm sm:text-base text-slate-150 leading-relaxed max-w-2xl text-slate-200 font-sans">
            A premium educational sanctuary designed to raise stellar future leaders. Merging traditional academic discipline with adaptive AI virtual tutoring models, we secure unprecedented records in senior certificate examinations.
          </p>

          <div className="pt-4 flex flex-wrap gap-3.5">
            <button
              onClick={() => onNavigateToTab('ai-tutor', 'ai-tutor')}
              className="bg-school-wine hover:bg-school-wine-hover text-white font-black px-6 py-3.5 rounded-xl text-xs transition duration-150 flex items-center space-x-2 shadow-md cursor-pointer"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Launch Virtual Classroom</span>
            </button>
            <button
              onClick={() => onNavigateToTab('admissions', 'admissions')}
              className="bg-white/10 hover:bg-white/25 text-white font-black px-6 py-3.5 rounded-xl text-xs transition duration-150 border border-white/25 cursor-pointer"
            >
              <span>Submit Admission Application</span>
            </button>
            <button
              onClick={() => onNavigateToTab('registry', 'registry')}
              className="bg-[#722F37] hover:bg-slate-900 text-white font-black px-6 py-3.5 rounded-xl text-xs transition duration-150 flex items-center space-x-2 shadow-md cursor-pointer"
            >
              <FolderOpen className="h-4 w-4 text-rose-350 text-rose-300" />
              <span>Scholar Academic Registry</span>
            </button>
          </div>
        </div>

        {/* Floating branding waterlines */}
        <div className="absolute right-8 bottom-6 text-[10px] text-white/40 font-mono tracking-widest select-none uppercase hidden sm:block">
          WOLCREST ACADEMIC REGISTRY
        </div>
      </section>

      {/* 4. ABOUT US SECTION */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-7 space-y-5">
          <div className="space-y-2">
            <span className="text-[10px] font-black tracking-widest text-[#722F37] uppercase block">
              OUR HERITAGE & PEDAGOGY
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              About Wolcrest College
            </h2>
          </div>
          
          <p className="text-xs sm:text-sm text-slate-650 leading-relaxed">
            Established on the core ideals of leadership, continuous learning, and character integrity, Wolcrest College has remained at the vanguard of academic brilliance in Nigeria. We operate with a deep conviction that every scholar represents a pristine potential ready to be actualized.
          </p>
          
          <p className="text-xs sm:text-sm text-slate-650 leading-relaxed">
            We operate fully customized science laboratories, modern computation setups, and student-focused research desks. Our unique educational architecture respects both institutional frameworks and interactive digital resources, ensuring a rich learning curve that builds competent self-esteem and independent analytical depth.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="border-l-2 border-school-wine pl-3">
              <span className="text-xl font-extrabold text-school-navy block">100%</span>
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider">WAEC / JAMB Distinctions</span>
            </div>
            <div className="border-l-2 border-school-navy pl-3">
              <span className="text-xl font-extrabold text-school-wine block">Zero</span>
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Repetition Year Loss</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-5 relative">
          {/* Aesthetic Brand Block Card */}
          <div className="bg-gradient-to-br from-[#132B66] to-[#0A193D] text-white rounded-2xl p-6 sm:p-8 shadow-md border-t-4 border-school-wine space-y-4">
            <p className="text-xs italic text-slate-200">
              "We noticed that traditional metrics alone often restrict a child's agile progression. At Wolcrest, we provide the platform to safely bypass excessive grade stages without sacrificing rigorous, syllabus-compliant understanding."
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <div className="h-9 w-9 bg-school-wine rounded-full flex items-center justify-center text-xs font-bold text-white uppercase font-display border border-white/20">
                WC
              </div>
              <div>
                <h5 className="text-xs font-bold text-white">Board of Directors</h5>
                <p className="text-[9px] text-slate-400 uppercase tracking-widest font-mono">Academic Excellence Board</p>
              </div>
            </div>
          </div>
          {/* Subtle offset visual backing sheet */}
          <div className="absolute inset-0 bg-[#722F37] rounded-2xl -z-10 transform scale-95 translate-y-3 opacity-30 blur-sm"></div>
        </div>
      </section>

      {/* 5. MISSION & VISION GRID SECTION - HIGH FIDELITY REDESIGN */}
      <section className="space-y-6">
        <div className="flex flex-col items-center justify-center text-center space-y-1 max-w-xl mx-auto">
          <span className="text-[9px] bg-school-navy/10 text-school-navy font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest">
            Institutional Foundations
          </span>
          <h2 className="text-2.5xl font-black text-slate-900 font-display">
            Mission, Vision & Core Pillars
          </h2>
          <p className="text-xs text-slate-500">
            Unpacking the guiding principles steering the academic excellence of Wolcrest Scholars.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Mission Card: Warm Burgundy/Wine Borders with Detailed Pillars */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6 relative overflow-hidden group hover:shadow-md transition-shadow duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-school-wine/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500 pointer-events-none"></div>
            
            <div className="space-y-5 relative z-10">
              <div className="flex items-center space-x-3.5">
                <div className="p-3 bg-school-wine/10 text-school-wine rounded-2xl w-12 h-12 flex items-center justify-center shadow-sm">
                  <Compass className="h-6 w-6 animate-pulse" />
                </div>
                <div>
                  <span className="text-[9px] font-black tracking-wider text-school-wine uppercase block">Action & Leadership</span>
                  <h3 className="font-extrabold text-slate-900 text-xl font-display">Our Dedicated Mission</h3>
                </div>
              </div>

              {/* Bold primary statement */}
              <div className="p-4 bg-[#FAF6F6]/60 rounded-2xl border-l-4 border-school-wine">
                <blockquote className="text-xs font-bold text-slate-700 italic">
                  "To raise a generation of intellectually sound, morally upright, and highly resilient leaders through customizable digital channels, custom evaluations, and standard-compliant mentoring."
                </blockquote>
              </div>

              {/* Pillars list */}
              <div className="space-y-3 pt-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Core Execution Spheres:</span>
                
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5 h-4.5 w-4.5 rounded-md bg-school-wine/10 text-school-wine flex items-center justify-center shrink-0">
                    <CheckCircle className="h-3 w-3" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold text-slate-950">Adaptive Scholar Acceleration</h5>
                    <p className="text-[10px] text-slate-500 leading-normal">Permitting qualified scholars an automated fast-track stream past traditional grade stage hurdles.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="mt-0.5 h-4.5 w-4.5 rounded-md bg-school-wine/10 text-school-wine flex items-center justify-center shrink-0">
                    <CheckCircle className="h-3 w-3" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold text-slate-950">Syllabus Compliance</h5>
                    <p className="text-[10px] text-slate-500 leading-normal">Comprehensive adherence to official West African benchmarks paired with 24/7 AI tutor access.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="mt-0.5 h-4.5 w-4.5 rounded-md bg-school-wine/10 text-school-wine flex items-center justify-center shrink-0">
                    <CheckCircle className="h-3 w-3" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold text-slate-950">Character Rigour & Honor</h5>
                    <p className="text-[10px] text-slate-500 leading-normal">Cultivating moral discipline alongside intellectual brilliance to ensure true future-ready focus.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-[9px] text-slate-400 font-mono font-bold tracking-wider select-none">
              <span>WOLCREST BOARD MEMORANDUM</span>
              <span className="text-school-wine font-black uppercase">TRUST & SPEED</span>
            </div>
          </div>

          {/* Vision Card: Deep Scholastic Navy Borders with Detailed Pillars */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6 relative overflow-hidden group hover:shadow-md transition-shadow duration-300">
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-school-navy/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500 pointer-events-none"></div>
            
            <div className="space-y-5 relative z-10">
              <div className="flex items-center space-x-3.5">
                <div className="p-3 bg-school-navy/10 text-school-navy rounded-2xl w-12 h-12 flex items-center justify-center shadow-sm">
                  <Award className="h-6 w-6 animate-pulse" />
                </div>
                <div>
                  <span className="text-[9px] font-black tracking-wider text-school-navy uppercase block">Aspiration & Future</span>
                  <h3 className="font-extrabold text-slate-900 text-xl font-display">Our Academic Vision</h3>
                </div>
              </div>

              {/* Bold primary statement */}
              <div className="p-4 bg-school-navy/5 rounded-2xl border-l-4 border-school-navy">
                <blockquote className="text-xs font-bold text-slate-700 italic">
                  "To stand as the absolute beacon of standard, technology-driven academic excellence in West Africa, raising sovereign thinkers and leaders."
                </blockquote>
              </div>

              {/* Pillars list */}
              <div className="space-y-3 pt-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Core Vision Paths:</span>
                
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5 h-4.5 w-4.5 rounded-md bg-school-navy/10 text-school-navy flex items-center justify-center shrink-0">
                    <CheckCircle className="h-3 w-3 text-school-navy" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold text-slate-950">Absolute Score Dominance</h5>
                    <p className="text-[10px] text-slate-500 leading-normal">Consistently securing 100% distinctions in National Exams, BECE, and continuous assessments.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="mt-0.5 h-4.5 w-4.5 rounded-md bg-school-navy/10 text-school-navy flex items-center justify-center shrink-0">
                    <CheckCircle className="h-3 w-3 text-school-navy" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold text-slate-950">Technological Integration</h5>
                    <p className="text-[10px] text-slate-500 leading-normal">Deep digital integration of continuous analytics spreadsheets, examination portals, and interactive tools.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="mt-0.5 h-4.5 w-4.5 rounded-md bg-school-navy/10 text-school-navy flex items-center justify-center shrink-0">
                    <CheckCircle className="h-3 w-3 text-school-navy" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold text-slate-950">Continental Standard-Bearers</h5>
                    <p className="text-[10px] text-slate-500 leading-normal">Empowering outstanding African minds to take ownership of global computer science & research frontiers.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-[9px] text-slate-400 font-mono font-bold tracking-wider select-none">
              <span>WEST AFRICAN EDUCATION TRUST</span>
              <span className="text-school-navy font-black uppercase">GOLD STANDARDS</span>
            </div>
          </div>

        </div>
      </section>

      {/* 6. WHY CHOOSE US (EXTENSIVE DETAILED ADVANCED BENTO CARD GRID) */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg space-y-8 relative overflow-hidden select-none">
        
        {/* Navy and Wine accent rings */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-school-navy/40 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-school-wine/50 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center max-w-2xl mx-auto space-y-2 relative z-10">
          <span className="text-[10px] bg-school-wine text-white font-black px-3 py-1 rounded-full uppercase tracking-widest leading-none">
            Competitive Edge
          </span>
          <h2 className="text-2xl sm:text-3.5xl font-extrabold font-display leading-tight">
            Why Choose Wolcrest College?
          </h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-normal">
            We offer distinctive advantages that stand at the intersection of modern instructional methodologies and traditional scholastic performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
          
          {/* Card 1: Fast Track Stream */}
          <div className="md:col-span-4 bg-gradient-to-br from-slate-800/60 to-slate-900/60 hover:from-slate-800 hover:to-slate-800/80 hover:border-school-wine/20 transition-all border border-white/5 p-6 rounded-2xl space-y-3 cursor-pointer group active:scale-[0.98]">
            <span className="text-[10px] text-rose-400 font-mono font-bold block uppercase">Agile Academic Track</span>
            <h4 className="font-bold text-sm text-[#FAF0E6] uppercase tracking-wide group-hover:text-rose-400 transition-colors">Grade 5 Direct Entry</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Outstanding candidates in Grade 5 are permitted direct exam entrance checks to JSS1 secondary school. There is no strict Grade 6 restriction! We help you save time without losing rigour.
            </p>
          </div>

          {/* Card 2: AI Tutoring Integration */}
          <div className="md:col-span-4 bg-gradient-to-br from-slate-800/60 to-slate-900/60 hover:from-slate-800 hover:to-slate-800/80 hover:border-violet-500/20 transition-all border border-white/5 p-6 rounded-2xl space-y-3 cursor-pointer group active:scale-[0.98]">
            <span className="text-[10px] text-rose-400 font-mono font-bold block uppercase">Personalized Companion</span>
            <h4 className="font-bold text-sm text-[#FAF0E6] uppercase tracking-wide group-hover:text-rose-300 transition-colors">Crest AI Virtual Coach</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Our bespoke, standard-curriculum-trained digital brain is available 24/7. It assists student scholars to dissect difficult calculations, recall formula definitions, and take diagnostic mock tests.
            </p>
          </div>

          {/* Card 3: Tested WAEC Facility */}
          <div className="md:col-span-4 bg-gradient-to-br from-slate-800/60 to-slate-900/60 hover:from-slate-800 hover:to-slate-800/80 hover:border-emerald-500/20 transition-all border border-white/5 p-6 rounded-2xl space-y-3 cursor-pointer group active:scale-[0.98]">
            <span className="text-[10px] text-emerald-400 font-mono font-bold block uppercase">Exemplary Setup</span>
            <h4 className="font-bold text-sm text-[#FAF0E6] uppercase tracking-wide group-hover:text-emerald-300 transition-colors">Advanced Science Labs</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Approved, tested biological and physical laboratory materials designed specifically to meet high West African standards. Students engage in practical hands-on experiments weekly, not just hypotheticals.
            </p>
          </div>

          {/* Card 4: Continuous Analytics Ledger (NEW 4th point!) */}
          <div className="md:col-span-6 bg-gradient-to-br from-slate-800/60 to-slate-900/60 hover:from-slate-800 hover:to-slate-800/80 hover:border-sky-500/20 transition-all border border-white/5 p-6 rounded-2xl space-y-3 cursor-pointer group active:scale-[0.98]">
            <span className="text-[10px] text-sky-450 text-sky-400 font-mono font-bold block uppercase">Continuous Assessment Ledger</span>
            <h4 className="font-bold text-sm text-[#FAF0E6] uppercase tracking-wide group-hover:text-sky-300 transition-colors">Analytical Performance Spreads</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              We compile granular academic score records for every continuous assessment test and exam. Performance metrics are processed securely to provide customized corrective insights to parents and teachers instantly.
            </p>
          </div>

          {/* Card 5: STEM Competence Assurance (NEW 5th point!) */}
          <div className="md:col-span-6 bg-gradient-to-br from-slate-800/60 to-slate-900/60 hover:from-slate-800 hover:to-slate-800/80 hover:border-purple-500/20 transition-all border border-white/5 p-6 rounded-2xl space-y-3 cursor-pointer group active:scale-[0.98]">
            <span className="text-[10px] text-purple-400 font-mono font-bold block uppercase">Elite STEM Certifications</span>
            <h4 className="font-bold text-sm text-[#FAF0E6] uppercase tracking-wide group-hover:text-purple-300 transition-colors">Zero Repetition Year Loss</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Through accelerated tutoring tracks and comprehensive mock preparation, we ensure students hit the optimal WAEC/JAMB entry thresholds early. No repeat losses, only uninterrupted academic progression.
            </p>
          </div>

          {/* Main detailed banner panel bottom */}
          <div className="md:col-span-12 bg-gradient-to-r from-school-navy to-[#0F224F] border border-white/10 p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1">
              <strong className="text-base text-white block font-display">Ready to join the Wolcrest Academic Community?</strong>
              <p className="text-xs text-slate-300 max-w-xl">Applications for admissions are processed daily. Secure your scholar credentials and shape the career pathway today.</p>
            </div>
            <button 
              onClick={() => onNavigateToTab('admissions', 'admissions')}
              className="bg-school-wine hover:bg-school-wine-hover text-white text-xs font-black uppercase px-6 py-3 rounded-xl shadow cursor-pointer transition flex-shrink-0 active:scale-95"
            >
              Start Admission Process
            </button>
          </div>

        </div>
      </section>

      {/* 6.5 OFFICIAL INSTITUTIONAL EVENTS BULLETIN */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 bg-school-wine/10 text-school-wine px-3 py-1 rounded-xl">
              <Calendar className="h-4 w-4" />
              <span className="text-[10px] font-mono uppercase font-black tracking-wider">Institutional Calendar</span>
            </div>
            <h2 className="text-xl sm:text-2.5xl font-extrabold font-display text-slate-900 leading-none uppercase">
              Official School Events Bulletin
            </h2>
            <p className="text-xs text-slate-500">
              Stay acquainted with important workshops, parent-teacher reviews, continuous curriculum update seminars, and summits.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('registry', 'registry')}
            className="text-[10px] font-black uppercase bg-[#111C24] hover:bg-school-wine text-white px-4 py-2.5 rounded-lg border border-white/10 shadow transition cursor-pointer select-none whitespace-nowrap self-start sm:self-center"
          >
            🗓️ Manage Events / Registry
          </button>
        </div>

        {events && events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((ev) => (
              <div 
                key={ev.id} 
                className="p-5 rounded-2xl bg-slate-50/50 border border-slate-200/60 hover:bg-white hover:border-school-wine/20 hover:shadow-sm transition duration-150 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] bg-amber-50 uppercase text-amber-800 font-mono font-bold px-2 py-0.5 rounded border border-amber-100">
                      📅 {ev.date}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">ID: {ev.id}</span>
                  </div>
                  <h4 className="font-extrabold text-[#111C24] text-xs uppercase tracking-wide leading-tight">
                    {ev.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-sans mt-1">
                    {ev.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 select-none">
            <Calendar className="h-8 w-8 text-slate-350 mx-auto mb-2 animate-pulse" />
            <p className="text-xs font-bold text-slate-600 block">No upcoming scheduled events found on the bulletin.</p>
            <p className="text-[10px] text-slate-400 mt-1">Registrars may add custom event alerts via the Academic Registry board.</p>
          </div>
        )}
      </section>

      {/* 7. TWIN DETAILED ROW: CAMPO FACILITIES PORTFOLIO & SCHOOL HIGHLIGHTS */}
      <section className="bg-gradient-to-br from-white via-slate-50/50 to-[#FBFAF7] rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 bg-school-navy/10 text-school-navy px-3 py-1 rounded-xl">
              <ImageIcon className="h-4 w-4 text-school-wine" />
              <span className="text-[10px] font-mono uppercase font-extrabold tracking-wider">Campus Showcase</span>
            </div>
            <h2 className="text-xl sm:text-2.5xl font-extrabold font-display text-slate-900 leading-none">
              Elite Campus &amp; High-Performance Facilities
            </h2>
            <p className="text-xs text-slate-500">
              Take a visual tour around our academic complexes, STEM engineering research laboratories, and honor classrooms.
            </p>
          </div>
          <button 
            onClick={() => onNavigateToTab('admissions', 'admissions')}
            className="text-[11px] font-black uppercase bg-[#111C24] hover:bg-school-wine text-white px-5 py-3 rounded-xl transition cursor-pointer active:scale-95 flex items-center space-x-1"
          >
            <span>Prospective Student Application</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {galleryItems.map((item) => (
            <div key={item.id} className="group relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white transition hover:shadow-lg hover:border-school-wine/25 active:scale-[0.98] cursor-pointer">
              <div className="aspect-video w-full overflow-hidden bg-slate-100 relative">
                <img 
                  src={item.imageUrl} 
                  alt={item.caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2.5 left-2.5 bg-slate-950/80 text-[8px] tracking-widest text-[#FAF0E6] px-2 py-0.5 rounded-md font-mono font-black uppercase">
                  {item.category}
                </span>
              </div>
              <div className="p-4 bg-gradient-to-br from-white to-slate-50">
                <p className="text-[11px] text-slate-650 font-medium leading-relaxed group-hover:text-slate-900 transition-colors">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-400 font-mono gap-2">
          <span>PORTAL VERIFY: WOLCREST-FACILITY-BOARD</span>
          <span className="italic">"Where the future is assured" • Wolcrest College Registry</span>
        </div>
      </section>

    </div>
  );
}
