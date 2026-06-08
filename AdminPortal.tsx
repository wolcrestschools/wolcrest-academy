import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  Trash2, 
  Edit3, 
  PlusCircle, 
  UserPlus, 
  BookOpen, 
  Activity, 
  FileSpreadsheet, 
  CheckCircle2, 
  X, 
  AlertCircle, 
  UploadCloud, 
  Clock, 
  Search,
  Eye,
  LogOut,
  FolderOpen,
  Image as ImageIcon
} from 'lucide-react';
import { 
  CourseMaterial, 
  StudentProfile, 
  StudentResult, 
  AdmissionApplication, 
  GalleryItem, 
  AiActivityLog, 
  DatabaseSchema 
} from '../types';

interface AdminPortalProps {
  onDbUpdated: () => void;
  studentName: string;
  studentClass: string;
  studentDepartment: string;
  studentId: string;
  isStudentLoggedIn: boolean;
  onStudentLogin: (name: string, cls: string, dept: string, id: string) => void;
  onStudentLogout: () => void;
}

export default function AdminPortal({ 
  onDbUpdated,
  studentName,
  studentClass,
  studentDepartment,
  studentId,
  isStudentLoggedIn,
  onStudentLogin,
  onStudentLogout
}: AdminPortalProps) {
  const [passwordInput, setPasswordInput] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [studentLoginName, setStudentLoginName] = useState('');
  const [studentLoginId, setStudentLoginId] = useState('');
  const [studentLoginError, setStudentLoginError] = useState<string | null>(null);
  const [selectedStudentResult, setSelectedStudentResult] = useState<StudentResult | null>(null);
  const [db, setDb] = useState<DatabaseSchema | null>(null);
  const [activePanel, setActivePanel] = useState<'materials' | 'profiles' | 'logs' | 'results' | 'admissions' | 'gallery' | 'registry'>('registry');
  const [registryView, setRegistryView] = useState<'students' | 'grades' | 'admissions' | 'materials' | 'settings_events'>('students');

  // --- Modals controller states for Registry page ---
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isEditGradeModalOpen, setIsEditGradeModalOpen] = useState(false);
  const [gradingStudent, setGradingStudent] = useState<StudentProfile | null>(null);

  // States for term/session updates and event management
  const [newSessionInput, setNewSessionInput] = useState('');
  const [newTermInput, setNewTermInput] = useState('');
  const [newEventName, setNewEventName] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [settingsSuccess, setSettingsSuccess] = useState<string | null>(null);

  // States for student registration modal
  const [regName, setRegName] = useState('');
  const [regClass, setRegClass] = useState('SSS 3');
  const [regDept, setRegDept] = useState('Sciences (STEM)');
  const [regEmail, setRegEmail] = useState('');
  const [regError, setRegError] = useState<string | null>(null);

  // States for edit student & grade modal
  const [editName, setEditName] = useState('');
  const [editClass, setEditClass] = useState('SSS 3');
  const [editDept, setEditDept] = useState('Sciences (STEM)');
  const [editEmail, setEditEmail] = useState('');
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccessMsg, setEditSuccessMsg] = useState<string | null>(null);

  // Grading states for the selected student
  const [gradeExamType, setGradeExamType] = useState('WAEC Mastery Evaluation');
  const [gradeRemark, setGradeRemark] = useState('Outstanding academic performance.');
  const [gradeSubjectList, setGradeSubjectList] = useState<{subject: string, score: number, ca1?: number, ca2?: number, exam?: number}[]>([]);
  const [newGradeSubject, setNewGradeSubject] = useState('Mathematics');
  const [newGradeScore, setNewGradeScore] = useState(80);
  const [newGradeCA1, setNewGradeCA1] = useState(15);
  const [newGradeCA2, setNewGradeCA2] = useState(15);
  const [newGradeExam, setNewGradeExam] = useState(50);
  const [gradeError, setGradeError] = useState<string | null>(null);
  const [gradeSuccessCode, setGradeSuccessCode] = useState<string | null>(null);

  // States for student recovery desk
  const [recoverId, setRecoverId] = useState('');
  const [recoverError, setRecoverError] = useState<string | null>(null);
  const [recoverSuccess, setRecoverSuccess] = useState<string | null>(null);
  
  // Custom non-blocking modal confirmation for student removal
  const [studentToDelete, setStudentToDelete] = useState<StudentProfile | null>(null);

  // Handlers for the registry modals
  const handleRegSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    if (!regName.trim()) {
      setRegError("Please fill in Student Full Name");
      return;
    }
    try {
      const res = await fetch('/api/admin/student-profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: regName,
          class: regClass,
          department: regDept,
          email: regEmail
        })
      });

      if (res.ok) {
        setRegName('');
        setRegEmail('');
        setIsRegisterModalOpen(false);
        setRegistryView('students');
        refreshPanel();
      } else {
        const err = await res.json();
        setRegError(err.error || "Failed to register student.");
      }
    } catch (e) {
      setRegError("Server communication failure.");
    }
  };

  const handleEditInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);
    setEditSuccessMsg(null);
    if (!gradingStudent) return;
    if (!editName.trim()) {
      setEditError("Name field cannot be left empty.");
      return;
    }
    try {
      const res = await fetch(`/api/admin/student-profiles/${gradingStudent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editName,
          class: editClass,
          department: editDept,
          email: editEmail
        })
      });

      if (res.ok) {
        setEditSuccessMsg("Student demographic data updated securely!");
        refreshPanel();
        setGradingStudent({
          ...gradingStudent,
          name: editName,
          class: editClass,
          department: editDept,
          email: editEmail
        });
      } else {
        const err = await res.json();
        setEditError(err.error || "Failed to update scholar credentials.");
      }
    } catch (e) {
      setEditError("Communication failure.");
    }
  };

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGradeError(null);
    setGradeSuccessCode(null);
    if (!gradingStudent) return;
    if (gradeSubjectList.length === 0) {
      setGradeError("Please add at least one subject score entry before publishing.");
      return;
    }

    try {
      const res = await fetch('/api/admin/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          studentName: gradingStudent.name,
          examType: gradeExamType,
          subjects: gradeSubjectList,
          remark: gradeRemark
        })
      });

      if (res.ok) {
        const data = await res.json();
        setGradeSuccessCode(data.result.examCode);
        setGradeRemark('Outstanding academic performance.');
        setGradeSubjectList([]);
        refreshPanel();
      } else {
        const err = await res.json();
        setGradeError(err.error || "Failed to catalog grade certificate.");
      }
    } catch (e) {
      setGradeError("Server communication failure.");
    }
  };

  const openEditStudentDataModal = (student: StudentProfile) => {
    setGradingStudent(student);
    setEditName(student.name);
    setEditClass(student.class);
    setEditDept(student.department);
    setEditEmail(student.email);
    setEditError(null);
    setEditSuccessMsg(null);
    setGradeError(null);
    setGradeSuccessCode(null);
    setGradeSubjectList([]);
    setIsEditGradeModalOpen(true);
  };

  const recoverStudent = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setRecoverError(null);
    setRecoverSuccess(null);
    if (!recoverId.trim()) {
      setRecoverError("Please specify a student ID to restore.");
      return;
    }
    try {
      const res = await fetch('/api/admin/student-profiles/recover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: recoverId.trim() })
      });
      if (res.ok) {
        const data = await res.json();
        setRecoverSuccess(`Success! Scholar '${data.profile.name}' has been active-registered back to the school roster.`);
        setRecoverId('');
        refreshPanel();
      } else {
        const err = await res.json();
        setRecoverError(err.error || "No soft-deleted student found with this ID.");
      }
    } catch (e) {
      console.error(e);
      setRecoverError("Could not connect to database router.");
    }
  };

  // Load backend database
  const loadDb = async () => {
    try {
      const res = await fetch('/api/full-db');
      if (res.ok) {
        const data = await res.json();
        setDb(data);
      }
    } catch (e) {
      console.error("Failed to load database", e);
    }
  };

  useEffect(() => {
    loadDb();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });

      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        loadDb();
      } else {
        const err = await res.json();
        setErrorMsg(err.error || "Authorization declined.");
      }
    } catch (e) {
      setErrorMsg("Connection failure.");
    }
  };

  const handleStudentFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStudentLoginError(null);
    
    if (!studentLoginName.trim() || !studentLoginId.trim()) {
      setStudentLoginError("Please enter both dynamic name and ID.");
      return;
    }

    if (!db || !db.studentProfiles) {
      setStudentLoginError("Registration rosters are pre-loading. Please retry in a second.");
      return;
    }

    const match = db.studentProfiles.find(s => 
      s.name.trim().toLowerCase() === studentLoginName.trim().toLowerCase() &&
      s.id.trim().toLowerCase() === studentLoginId.trim().toLowerCase() &&
      s.status !== 'Left'
    );

    if (match) {
      onStudentLogin(match.name, match.class, match.department, match.id);
      setStudentLoginName('');
      setStudentLoginId('');
    } else {
      setStudentLoginError("Combination mismatch. Please check your spelling and make sure your Registered Name and ID are typed precisely.");
    }
  };

  const logout = () => {
    setToken(null);
    setDb(null);
    setPasswordInput('');
  };

  // Run initial state triggers on re-evaluation
  const refreshPanel = () => {
    if (token) {
      loadDb();
      onDbUpdated();
    }
  };

  // --- COURSE MATERIALS FORMS & HANDLERS ---
  const [cmEditId, setCmEditId] = useState<string | null>(null);
  const [cmClass, setCmClass] = useState('SSS 3');
  const [cmSubject, setCmSubject] = useState('Physics');
  const [cmTitle, setCmTitle] = useState('');
  const [cmDescription, setCmDescription] = useState('');
  const [cmUrl, setCmUrl] = useState('');

  const submitMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmTitle.trim()) return;

    try {
      const endpoint = cmEditId ? `/api/admin/course-materials/${cmEditId}` : '/api/admin/course-materials';
      const method = cmEditId ? 'PUT' : 'POST';
      
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          class: cmClass,
          subject: cmSubject,
          title: cmTitle,
          description: cmDescription,
          url: cmUrl || '#'
        })
      });

      if (res.ok) {
        setCmEditId(null);
        setCmTitle('');
        setCmDescription('');
        setCmUrl('');
        refreshPanel();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const editMaterial = (item: CourseMaterial) => {
    setCmEditId(item.id);
    setCmClass(item.class);
    setCmSubject(item.subject);
    setCmTitle(item.title);
    setCmDescription(item.description);
    setCmUrl(item.url);
  };

  const deleteMaterial = async (id: string) => {
    if (!window.confirm("Delete this learning material note?")) return;
    try {
      const res = await fetch(`/api/admin/course-materials/${id}`, {
        method: 'DELETE',
        headers: {      'Authorization': `Bearer ${token}` }
      });
      if (res.ok) refreshPanel();
    } catch (e) { console.error(e); }
  };

  // --- STUDENT PROFILES FORMS & HANDLERS ---
  const [stdEditId, setStdEditId] = useState<string | null>(null);
  const [stdName, setStdName] = useState('');
  const [stdClass, setStdClass] = useState('SSS 3');
  const [stdDept, setStdDept] = useState('Sciences (STEM)');
  const [stdEmail, setStdEmail] = useState('');

  const submitStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stdName.trim()) return;

    try {
      const endpoint = stdEditId ? `/api/admin/student-profiles/${stdEditId}` : '/api/admin/student-profiles';
      const method = stdEditId ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: stdName,
          class: stdClass,
          department: stdDept,
          email: stdEmail
        })
      });

      if (res.ok) {
        setStdEditId(null);
        setStdName('');
        setStdEmail('');
        refreshPanel();
      }
    } catch (e) { console.error(e); }
  };

  const editStudent = (item: StudentProfile) => {
    setStdEditId(item.id);
    setStdName(item.name);
    setStdClass(item.class);
    setStdDept(item.department);
    setStdEmail(item.email);
  };

  const deleteStudent = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/student-profiles/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setIsEditGradeModalOpen(false);
        setStudentToDelete(null);
        refreshPanel();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to remove student.");
      }
    } catch (e) { 
      console.error(e);
      alert("Error contacting database server.");
    }
  };

  // --- RESULT PUBLISHING SHEET ---
  const [resTargetStudent, setResTargetStudent] = useState('');
  const [resExamType, setResExamType] = useState('WAEC Mastery');
  const [resRemark, setResRemark] = useState('');
  const [resSubjectList, setResSubjectList] = useState<{subject:string, score:number}[]>([
    { subject: 'Mathematics', score: 85 },
    { subject: 'English Language', score: 78 },
    { subject: 'Physics', score: 80 }
  ]);
  const [resTempSubject, setResTempSubject] = useState('Chemistry');
  const [resTempScore, setResTempScore] = useState(75);
  const [publishedCode, setPublishedCode] = useState<string | null>(null);

  const addResSubject = () => {
    if (resSubjectList.some(s => s.subject.toLowerCase() === resTempSubject.toLowerCase())) return;
    setResSubjectList([...resSubjectList, { subject: resTempSubject, score: Number(resTempScore) }]);
  };

  const removeResSubject = (index: number) => {
    setResSubjectList(resSubjectList.filter((_, i) => i !== index));
  };

  const publishResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTargetStudent) {
      alert("Please specify a student name or select one.");
      return;
    }
    if (resSubjectList.length === 0) {
      alert("Please add at least one subject score.");
      return;
    }

    try {
      const res = await fetch('/api/admin/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          studentName: resTargetStudent,
          examType: resExamType,
          subjects: resSubjectList,
          remark: resRemark
        })
      });

      if (res.ok) {
        const data = await res.json();
        setPublishedCode(data.result.examCode);
        setResTargetStudent('');
        setResRemark('');
        setResSubjectList([
          { subject: 'Mathematics', score: 80 },
          { subject: 'English Language', score: 75 }
        ]);
        refreshPanel();
      }
    } catch (e) { console.error(e); }
  };

  const deleteResult = async (id: string) => {
    if (!window.confirm("Recall and delete published result report card?")) return;
    try {
      const res = await fetch(`/api/admin/results/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) refreshPanel();
    } catch (e) { console.error(e); }
  };

  // --- ADMISSIONS MANAGER ---
  const handleAdmissionStatus = async (id: string, nextStatus: 'Approved' | 'Declined') => {
    try {
      const res = await fetch('/api/admin/applications/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id, status: nextStatus })
      });
      if (res.ok) refreshPanel();
    } catch (e) {
      console.error(e);
    }
  };

  // --- GALLERY IMAGES UPLOADER ---
  const [galUrl, setGalUrl] = useState('');
  const [galCaption, setGalCaption] = useState('');
  const [galCategory, setGalCategory] = useState('Campus');

  const uploadGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galUrl.trim()) return;

    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          imageUrl: galUrl,
          caption: galCaption,
          category: galCategory
        })
      });

      if (res.ok) {
        setGalUrl('');
        setGalCaption('');
        refreshPanel();
      }
    } catch (e) { console.error(e); }
  };

  const deleteGallery = async (id: string) => {
    if (!window.confirm("Remove this photo from the campus gallery?")) return;
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) refreshPanel();
    } catch (e) { console.error(e); }
  };

  // --- LOG FILTERING STAGES ---
  const [logSearch, setLogSearch] = useState('');


  // --- STUDENT LOGGED IN PORTFOLIO WORKSPACE ---
  if (isStudentLoggedIn && !token) {
    const matchedResults = db?.results?.filter(r => 
      r.studentName.trim().toLowerCase() === studentName.trim().toLowerCase()
    ) || [];

    const matchedMaterials = db?.courseMaterials?.filter(m => 
      m.class.trim().toLowerCase() === studentClass.trim().toLowerCase()
    ) || [];

    return (
      <div id="verified-scholar-dossier" className="space-y-6 animate-fadeIn select-all">
        <section className="bg-gradient-to-r from-emerald-950 via-teal-900 to-stone-900 text-white p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-emerald-500/20 shadow-lg select-none">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400" />
            </div>
            <div className="text-left">
              <span className="text-[10px] font-mono tracking-widest block text-emerald-400 font-bold uppercase">SECURED OFFICIAL ACADEMIC PORTFOLIO</span>
              <h2 className="font-black font-display text-base tracking-wider uppercase text-slate-100">Welcome Back, {studentName}</h2>
              <p className="text-[11px] text-slate-300">
                Identity Status: <strong className="text-emerald-400 font-bold">✓ Fully Verified Scholar</strong>
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onStudentLogout}
            className="bg-white/10 hover:bg-rose-900 text-white px-3.5 py-2 rounded-xl text-xs uppercase font-extrabold flex items-center space-x-1.5 border border-white/10 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span>Terminate Student Session</span>
          </button>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-4 bg-[#0A0D11] p-6 rounded-3xl border border-white/5 space-y-6 flex flex-col justify-between">
            <div>
              <div className="border-b border-white/5 pb-4 text-left">
                <span className="text-[9.5px] font-mono tracking-wider block text-slate-400 uppercase font-bold">Roster Reference Register</span>
                <h3 className="font-extrabold font-display uppercase tracking-wide text-xs text-[#FAF0E6] mt-0.5">Secretariat Credentials Record</h3>
              </div>

              <div className="space-y-4 mt-6">
                <div className="bg-white/5 p-3.5 rounded-2xl border border-white/5 space-y-1 text-left">
                  <span className="text-[9px] font-black text-slate-400 block uppercase font-mono">REGISTRY REFERENCE ID</span>
                  <strong className="text-xs font-mono font-bold text-rose-400">{studentId || "std-1"}</strong>
                </div>
                <div className="bg-white/5 p-3.5 rounded-2xl border border-white/5 space-y-1 text-left">
                  <span className="text-[9px] font-black text-slate-400 block uppercase font-mono">ENROLLED STUDENT CLASS</span>
                  <strong className="text-xs font-bold text-slate-205 text-slate-200">{studentClass}</strong>
                </div>
                <div className="bg-white/5 p-3.5 rounded-2xl border border-white/5 space-y-1 text-left">
                  <span className="text-[9px] font-black text-slate-400 block uppercase font-mono">FACULTY DEPARTMENT PLACEMENT</span>
                  <strong className="text-xs font-bold text-slate-200">{studentDepartment}</strong>
                </div>
                <div className="bg-white/5 p-3.5 rounded-2xl border border-white/5 space-y-1 text-left">
                  <span className="text-[9px] font-black text-slate-400 block uppercase font-mono">SECRETARIAT COMMUNICATIONS BOX</span>
                  <strong className="text-xs font-mono font-bold text-indigo-400 select-all">
                    {studentName.toLowerCase().replace(/[^a-z]/g, '')}.{studentId.toLowerCase()}@wolcrestschools.edu
                  </strong>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 mt-6">
              <button 
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-[#FAF0E6] text-xs font-bold py-3.5 px-4 rounded-xl transition cursor-pointer flex items-center justify-center space-x-2 border border-white/5"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Export Scholar Dossier Sheet</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-8 bg-[#0A0D11] p-6 rounded-3xl border border-white/5 space-y-6 text-left flex flex-col justify-between">
            <div>
              <div className="border-b border-white/5 pb-4 flex justify-between items-center text-left">
                <div>
                  <span className="text-[9.5px] font-mono tracking-wider block text-slate-400 uppercase font-bold">Class Assignment Aids</span>
                  <h3 className="font-extrabold font-display uppercase tracking-wide text-xs text-[#FAF0E6] mt-0.5">Syllabus Study Materials</h3>
                </div>
                <span className="bg-[#722F37]/30 border border-[#722F37]/50 text-rose-300 font-mono text-[9px] font-extrabold py-1 px-2.5 rounded-full uppercase">
                  {studentClass} Study Pool
                </span>
              </div>

              {matchedMaterials.length === 0 ? (
                <div className="text-center py-12 space-y-3 bg-white/5 rounded-2xl border border-dashed border-white/10 mt-6 md:my-10">
                  <BookOpen className="w-10 h-10 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    No explicit syllabus notes posted by the registry for the {studentClass} class level today.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {matchedMaterials.map((m) => (
                    <div key={m.id} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition space-y-3 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-bold text-rose-455 text-rose-400 uppercase font-mono tracking-widest block">{m.subject}</span>
                        <h4 className="text-xs font-black text-slate-100 leading-snug">{m.title}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{m.description}</p>
                      </div>
                      <div className="pt-2">
                        <a 
                          href={m.url} 
                          target="_blank" 
                          referrerPolicy="no-referrer"
                          className="inline-flex items-center space-x-1.5 text-[11px] text-rose-300 hover:text-white font-extrabold"
                        >
                          <UploadCloud className="w-3.5 h-3.5 shrink-0" />
                          <span>Get Syllabi Study Notes</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/5 mt-6 text-[10px] text-slate-500 font-mono flex items-center justify-between">
              <span>BOARD DESK SYLLABUSES POOL</span>
              <span className="text-emerald-450 text-emerald-400">SECURE DISPATCH</span>
            </div>
          </div>
        </div>

        <div className="bg-[#0A0D11] p-6 rounded-3xl border border-white/5 space-y-6 text-left">
          <div className="border-b border-white/5 pb-4">
            <span className="text-[9.5px] font-mono tracking-wider block text-slate-400 uppercase font-bold">Continuous Evaluation Board</span>
            <h3 className="font-extrabold font-display uppercase tracking-wide text-xs text-[#FAF0E6] mt-0.5">Continuous Assessment Marks Database</h3>
          </div>

          {matchedResults.length === 0 ? (
            <div className="text-center py-12 space-y-3 bg-white/5 rounded-2xl border border-dashed border-white/10">
              <FileSpreadsheet className="w-10 h-10 text-slate-500 mx-auto" />
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                We did not find any continuous assessment marks ledger corresponding to the name <strong className="text-slate-100">"{studentName}"</strong>. Continuous assessment marks are inputted directly by the Lagos Registrar Secretariat after general exams are compiled.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="overflow-x-auto border border-white/5 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/5 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      <th className="p-4 font-bold">Exam Code</th>
                      <th className="p-4 font-bold">Category Type</th>
                      <th className="p-4 font-bold">Academic Scores Sheet</th>
                      <th className="p-4 font-bold text-center">Remark Brief</th>
                      <th className="p-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {matchedResults.map((r) => (
                      <tr key={r.id} className="hover:bg-white/5 transition">
                        <td className="p-4 font-mono font-bold text-[#FAF0E6]">{r.examCode}</td>
                        <td className="p-4">
                          <span className="bg-[#722F37]/30 text-rose-200 border border-[#722F37]/50 px-2.5 py-0.5 rounded-full font-bold select-none text-[10px]">
                            {r.examType}
                          </span>
                        </td>
                        <td className="p-4 space-y-1">
                          <div className="flex flex-wrap gap-1.5">
                            {r.subjects.map((sub, i) => (
                              <span key={i} className="bg-slate-900 border border-white/5 px-2 py-0.5 rounded font-mono text-slate-300 font-bold">
                                {sub.subject}: <strong className="text-rose-400">{sub.score}%</strong>
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 text-slate-400 leading-normal max-w-sm truncate text-[11px] font-medium">
                          {r.remark}
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            type="button"
                            onClick={() => setSelectedStudentResult(r)}
                            className="text-indigo-400 hover:text-indigo-300 hover:underline font-extrabold text-[11px] cursor-pointer"
                          >
                            Generate Ledger Certificate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {selectedStudentResult && (
                <div className="mt-4 p-6 bg-[#06080B] border border-emerald-500/10 text-white rounded-3xl space-y-6 relative animate-fadeIn select-none">
                  <button 
                    type="button"
                    onClick={() => setSelectedStudentResult(null)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="text-center space-y-3 pb-4 border-b border-white/5 mx-auto max-w-lg">
                    <span className="text-[9px] font-mono tracking-widest text-[#722F37] font-semibold block uppercase">OFFICIAL ACADEMIC TRANSCRIPT REPLICAS</span>
                    <h3 className="text-lg font-black font-display text-white tracking-tight uppercase font-bold">Wolcrest Academic Record Bureau</h3>
                    <p className="text-[10px] text-slate-400">
                      Egan Igando Secretariat, Lagos, Nigeria. Certified on demand reference certificate.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono border-b border-white/5 pb-4 text-left">
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">SCHOLAR NAME</span>
                      <strong className="text-slate-200">{selectedStudentResult.studentName}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">EXAMINATION CODE</span>
                      <strong className="text-rose-400">{selectedStudentResult.examCode}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">CATEGORY TYPE</span>
                      <strong className="text-slate-200">{selectedStudentResult.examType}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">REPORT GEN TIMING</span>
                      <strong className="text-slate-200 font-bold">{new Date().toLocaleDateString()}</strong>
                    </div>
                  </div>

                  <div className="space-y-3 text-left">
                    <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-widest block font-mono">SCORED MARKS SHEETS</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {selectedStudentResult.subjects.map((sub, idx) => (
                        <div key={idx} className="p-3 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center">
                          <span className="text-xs text-slate-300 font-bold truncate">{sub.subject}</span>
                          <span className={`text-sm font-mono font-black ${sub.score >= 75 ? 'text-emerald-400' : sub.score >= 50 ? 'text-indigo-455 text-indigo-400' : 'text-rose-455 text-rose-400'}`}>
                            {sub.score}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-2xl space-y-1 text-left">
                    <span className="text-[9.5px] uppercase font-mono text-slate-500 block font-bold">Secretariat Board Counsel Remarks:</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{selectedStudentResult.remark}</p>
                  </div>

                  <div className="pt-2 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                    <span>SEAL CHECK: VERIFIED DIRECTORY RECORD</span>
                    <button 
                      type="button"
                      onClick={() => window.print()}
                      className="bg-[#722F37] hover:bg-rose-900 border border-white/10 text-white font-bold py-1 px-3 rounded uppercase cursor-pointer"
                    >
                      Print Registered Document
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- LOCK GATE RENDER (Dual Gateway) ---
  if (!token && !isStudentLoggedIn) {
    return (
      <div id="academic-registry-desk" className="max-w-5xl mx-auto space-y-6 my-6 animate-fadeIn select-none">
        
        {/* Registry Seal Branding */}
        <div className="bg-gradient-to-br from-[#101921] to-[#0A0D10] text-center p-8 rounded-2xl border border-white/5 space-y-3">
          <span className="text-[10px] text-rose-400 font-mono tracking-widest block font-bold uppercase">WOLCREST COLLEGE ACADEMIC SECRETARIAT</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight uppercase leading-wide">Academic Register &amp; Records Bureau</h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
            Welcome to the secure administrative verification portal. Here, officially registered scholars can verify their enrollment status, and authorized registrar boards can enter scores.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* Card A: Registered Student Access Verification Desk */}
          <div className="bg-[#0C141B]/95 p-8 rounded-3xl border border-white/5 space-y-6 shadow-xl relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center border border-rose-500/10">
                <FolderOpen className="h-5 w-5 text-rose-400" />
              </div>
              <div className="space-y-1 text-left">
                <h3 className="text-base font-extrabold font-display text-[#FAF0E6] uppercase tracking-wide">Registered Student Registry Search</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enter your official full name and assigned student identification code to check your registered roster credentials, access class sylabuses, and view continuous assessment mark sheets.
                </p>
              </div>

              {studentLoginError && (
                <div className="p-3 bg-rose-950/40 border border-rose-800/30 rounded-xl text-[11px] text-rose-300 flex items-start space-x-2 text-left">
                  <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{studentLoginError}</span>
                </div>
              )}

              <form onSubmit={handleStudentFormLogin} className="space-y-3.5">
                <div className="space-y-1 text-left">
                  <label className="text-[9.5px] uppercase font-black tracking-widest text-[#FAF0E6]/60 block font-mono">Registered Full Name</label>
                  <input 
                    type="text"
                    value={studentLoginName}
                    onChange={(e) => setStudentLoginName(e.target.value)}
                    placeholder="e.g. Chidimma Alao"
                    className="w-full text-xs p-3.5 border border-white/5 rounded-xl bg-slate-900 text-white focus:outline-none focus:border-rose-400 placeholder:text-slate-600 font-bold"
                  />
                </div>
                <div className="space-y-1 text-left">
                  <label className="text-[9.5px] uppercase font-black tracking-widest text-[#FAF0E6]/60 block font-mono">Student ID Reference</label>
                  <input 
                    type="text"
                    value={studentLoginId}
                    onChange={(e) => setStudentLoginId(e.target.value)}
                    placeholder="e.g. std-1"
                    className="w-full text-xs p-3.5 border border-white/5 rounded-xl bg-slate-900 text-white focus:outline-none focus:border-rose-400 font-mono tracking-widest placeholder:text-slate-650 placeholder:font-sans font-bold"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-[#722F37] hover:bg-[#8F3E47] text-white font-black text-xs p-3.5 rounded-xl transition cursor-pointer flex items-center justify-center space-x-1 border border-white/5 shadow-md uppercase tracking-wider"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-rose-200" />
                  <span>Verify Register Registry Name</span>
                </button>
              </form>
            </div>
            
            <div className="pt-4 border-t border-white/5 mt-6 text-[10px] text-slate-500 font-mono flex items-center justify-between">
              <span>DESK: ENROLLMENT DATABASE v2.1</span>
              <span>STATE: ACTIVE ONLINE</span>
            </div>
          </div>

          {/* Card B: Security-Gated Admin Registry Passcode Area */}
          <div className="bg-[#0C141B]/95 p-8 rounded-3xl border border-white/5 space-y-6 shadow-xl relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-[#1A1115] text-amber-500/80 rounded-full flex items-center justify-center border border-amber-500/10">
                <Lock className="h-5 w-5 text-amber-500" />
              </div>
              <div className="space-y-1 text-left">
                <h3 className="text-base font-extrabold font-display text-[#FAF0E6] uppercase tracking-wide">Institutional Registrar Gate</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Secure administration board for certified academic officers and principal administrators to compile continuous assessment marks, edit student rosters, publish class syllabus study guides, and review digital log files.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-950/40 border border-red-800/30 rounded-xl text-[11px] text-red-300 flex items-start space-x-2 text-left">
                  <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-3.5">
                <div className="space-y-1 text-left">
                  <label className="text-[9.5px] uppercase font-black tracking-widest text-[#FAF0E6]/60 block font-mono">Institutional Passcode</label>
                  <input 
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full text-center text-xs p-3.5 border border-white/5 rounded-xl bg-slate-900 text-white focus:outline-none focus:border-amber-500 focus:border-amber-400 tracking-widest font-mono"
                  />
                </div>
                
                <div className="pt-4">
                  <button 
                    type="submit"
                    className="w-full bg-slate-800 hover:bg-[#1A2530] text-amber-500 font-black text-xs p-3.5 rounded-xl transition cursor-pointer flex items-center justify-center space-x-1 border border-amber-500/20 shadow-md uppercase tracking-wide"
                  >
                    <Unlock className="w-4 h-4 shrink-0 text-amber-500" />
                    <span>Authorize Admin Passcode</span>
                  </button>
                </div>
              </form>
            </div>

            <div className="pt-4 border-t border-white/5 mt-6 text-[10px] text-slate-500 font-mono flex items-center justify-between">
              <span>ADMIN: SECURE KEYBOARD GATEWAY</span>
              <span>LEVEL: AUTHORIZED DIRECT RETRIEVES</span>
            </div>
          </div>

        </div>

      </div>
    );
  }

  return (
    <div id="admin-secured-dashboard" className="space-y-6 animate-fadeIn">
      
      {/* Top action header info */}
      <section className="bg-gradient-to-r from-school-navy via-[#1E3A7A] to-school-wine text-white p-5 rounded-2xl flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg">
            <Unlock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="font-extrabold font-display text-sm tracking-widest uppercase">WOLCREST SECURE ADMINISTRATION BOARD</h2>
            <p className="text-[10px] text-slate-350">Authority Certificate Level 3 • Session Online</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="bg-white/10 hover:bg-rose-650 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold flex items-center space-x-1 border border-white/10 transition cursor-pointer"
        >
          <LogOut className="w-3 h-3" />
          <span>Exit Dashboard</span>
        </button>
      </section>

      {/* Internal Management Menu and grids */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Side menu tabs Selection (col-span-3) */}
        <div className="xl:col-span-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[9px] font-black tracking-widest text-slate-400 block px-3 py-2 uppercase">Core Consoles</span>
          
          <button 
            onClick={() => setActivePanel('registry')}
            className={`w-full text-left text-xs px-3.5 py-3 rounded-xl flex items-center space-x-2.5 font-bold transition cursor-pointer ${activePanel === 'registry' ? 'bg-rose-50 text-rose-700 border border-rose-100 shadow-sm' : 'text-slate-650 hover:bg-slate-50'}`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>Official Registry Page</span>
          </button>

          <button 
            onClick={() => setActivePanel('materials')}
            className={`w-full text-left text-xs px-3.5 py-3 rounded-xl flex items-center space-x-2.5 font-bold transition cursor-pointer ${activePanel === 'materials' ? 'bg-rose-50 text-rose-700 border border-rose-100 shadow-sm' : 'text-slate-650 hover:bg-slate-50'}`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Course Study Notes</span>
          </button>

          <button 
            onClick={() => setActivePanel('profiles')}
            className={`w-full text-left text-xs px-3.5 py-3 rounded-xl flex items-center space-x-2.5 font-bold transition cursor-pointer ${activePanel === 'profiles' ? 'bg-rose-50 text-rose-700 border border-rose-100 shadow-sm' : 'text-slate-650 hover:bg-slate-50'}`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Student Accounts</span>
          </button>

          <button 
            onClick={() => setActivePanel('results')}
            className={`w-full text-left text-xs px-3.5 py-3 rounded-xl flex items-center space-x-2.5 font-bold transition cursor-pointer ${activePanel === 'results' ? 'bg-rose-50 text-rose-700 border border-rose-100 shadow-sm' : 'text-slate-650 hover:bg-slate-50'}`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Pasted Scorecards</span>
          </button>

          <button 
            onClick={() => setActivePanel('admissions')}
            className={`w-full text-left text-xs px-3.5 py-3 rounded-xl flex items-center space-x-2.5 font-bold transition cursor-pointer ${activePanel === 'admissions' ? 'bg-rose-50 text-rose-700 border border-rose-100 shadow-sm' : 'text-slate-650 hover:bg-slate-50'}`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Candidate Admissions</span>
          </button>

          <button 
            onClick={() => setActivePanel('gallery')}
            className={`w-full text-left text-xs px-3.5 py-3 rounded-xl flex items-center space-x-2.5 font-bold transition cursor-pointer ${activePanel === 'gallery' ? 'bg-rose-50 text-rose-700 border border-rose-100 shadow-sm' : 'text-slate-650 hover:bg-slate-50'}`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Gallery Manager</span>
          </button>

          <button 
            onClick={() => setActivePanel('logs')}
            className={`w-full text-left text-xs px-3.5 py-3 rounded-xl flex items-center space-x-2.5 font-bold transition cursor-pointer ${activePanel === 'logs' ? 'bg-rose-50 text-rose-700 border border-rose-100 shadow-sm' : 'text-slate-650 hover:bg-slate-50'}`}
          >
            <Activity className="w-4 h-4" />
            <span>AI Activity Auditing</span>
          </button>

          <div className="pt-4 border-t border-slate-100 mt-4 px-3 text-[10px] text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Database Size:</span>
              <span className="font-bold text-slate-700">{db ? `${JSON.stringify(db).length} Bytes` : 'Unloaded'}</span>
            </div>
            <div className="flex justify-between">
              <span>Host Location:</span>
              <span className="font-bold text-slate-705 text-slate-700">Port 3000 Web</span>
            </div>
          </div>
        </div>

        {/* Right Side console actions (col-span-9) */}
        <div className="xl:col-span-9 space-y-6">
          
          {/* A: COURSE MATERIALS MANAGER */}
          {activePanel === 'materials' && db && (
            <div className="space-y-6 animate-slideUp">
              
              {/* Material Form */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide border-b border-slate-100 pb-2 mb-4">
                  {cmEditId ? "MODIFY REQUISITE STUDY NOTE" : "UPLOAD NEW INSTITUTION STUDY REFERENCE"}
                </h4>
                
                <form onSubmit={submitMaterial} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400- block mb-1">TARGET SYLLABUS CLASS</label>
                    <select value={cmClass} onChange={(e)=>setCmClass(e.target.value)} className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none">
                      <option value="SSS 3">SSS 3</option>
                      <option value="SSS 2">SSS 2</option>
                      <option value="SSS 1">SSS 1</option>
                      <option value="JSS 3">JSS 3</option>
                      <option value="JSS 2">JSS 2</option>
                      <option value="JSS 1">JSS 1</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">TARGET COURSE FIELD</label>
                    <select value={cmSubject} onChange={(e)=>setCmSubject(e.target.value)} className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none">
                      <option value="Mathematics">Mathematics</option>
                      <option value="Further Mathematics">Further Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                      <option value="English Language">English Language</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">REFERENCE ATTACHED TITLE</label>
                    <input type="text" value={cmTitle} onChange={(e)=>setCmTitle(e.target.value)} required placeholder="e.g. Calculus Series and Advanced Integration Problems" className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">REFERENCE TOPICS DESCRIPTION SUMMARY</label>
                    <input type="text" value={cmDescription} onChange={(e)=>setCmDescription(e.target.value)} placeholder="e.g. Comprehensive guide and definitions sheet covering quadratic integrals." className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">EXTERNAL DOWNLOAD / NOTES PDF CLOUD LINK URL</label>
                    <input type="text" value={cmUrl} onChange={(e)=>setCmUrl(e.target.value)} placeholder="e.g. https://example.com/books/math_notes.pdf" className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none" />
                  </div>

                  <div className="sm:col-span-2 pt-2 flex space-x-2">
                    <button type="submit" className="bg-rose-600 hover:bg-slate-900 text-white font-black text-xs px-5 py-2.5 rounded-lg flex items-center space-x-1.5 transition duration-150 cursor-pointer">
                      <PlusCircle className="w-4 h-4" />
                      <span>{cmEditId ? "Save Changes" : "Create Reference Ledger"}</span>
                    </button>
                    {cmEditId && (
                      <button type="button" onClick={()=>{setCmEditId(null); setCmTitle(''); setCmDescription(''); setCmUrl('');}} className="bg-slate-105 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs px-4 py-2.5 rounded-lg transition cursor-pointer">
                        Cancel Modification
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Table list */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-indigo-900/10 font-black text-slate-500 uppercase text-[9px] tracking-wider">
                      <th className="p-4">CLASS &amp; SUBJECT</th>
                      <th className="p-4/1 p-4">STUDY REFERENCE MATERIAL DETAILS</th>
                      <th className="p-4 text-center">ATTACHMENT LINK</th>
                      <th className="p-4 text-right">OPERATIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150">
                    {db.courseMaterials.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="p-4">
                          <span className="font-black text-slate-900 block">{item.subject}</span>
                          <span className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded font-bold uppercase">{item.class}</span>
                        </td>
                        <td className="p-4 space-y-1">
                          <strong className="block text-slate-800 text-sm font-extrabold leading-tight">{item.title}</strong>
                          <p className="text-slate-500 text-xs leading-normal max-w-sm">{item.description}</p>
                        </td>
                        <td className="p-4 text-center">
                          <a href={item.url} target="_blank" rel="noreferrer" className="text-[10px] text-blue-700 font-semibold underline truncate block max-w-[120px]">{item.url}</a>
                        </td>
                        <td className="p-4 text-right">
                          <div className="inline-flex space-x-1.5">
                            <button onClick={()=>editMaterial(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 border border-blue-100 rounded-lg transition cursor-pointer" title="Edit Reference"><Edit3 className="w-3.5 h-3.5" /></button>
                            <button onClick={()=>deleteMaterial(item.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 border border-rose-100 rounded-lg transition cursor-pointer" title="Delete Note"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* B: Student Profiles Account CRUD */}
          {activePanel === 'profiles' && db && (
            <div className="space-y-6 animate-slideUp">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide border-b border-slate-100 pb-2 mb-4">
                  {stdEditId ? "MODIFY STUDENT ENROLLMENT RECORD" : "ENROLL NEW ACADEMIC SCHOLAR"}
                </h4>

                <form onSubmit={submitStudent} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1 font-display">CANDIDATE STUDENT FULL NAME</label>
                    <input type="text" value={stdName} onChange={(e)=>setStdName(e.target.value)} required placeholder="e.g. Chinedu Okafor" className="w-full text-xs p-2.5 border border-slate-200 rounded-lg" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">CORRESPONDENCE STUDENT EMAIL</label>
                    <input type="email" value={stdEmail} onChange={(e)=>setStdEmail(e.target.value)} placeholder="e.g. chinedu@mail.com" className="w-full text-xs p-2.5 border border-slate-200 rounded-lg" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">ASSIGNED CLASS SYLLABUS</label>
                    <select value={stdClass} onChange={(e)=>setStdClass(e.target.value)} className="w-full text-xs p-2.5 border border-slate-200 rounded-lg">
                      <option value="SSS 3">SSS 3</option>
                      <option value="SSS 2">SSS 2</option>
                      <option value="SSS 1">SSS 1</option>
                      <option value="JSS 3">JSS 3</option>
                      <option value="JSS 2">JSS 2</option>
                      <option value="JSS 1">JSS 1</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1 font-display">SPECIALISED FACULTY DEPT</label>
                    <select value={stdDept} onChange={(e)=>setStdDept(e.target.value)} className="w-full text-xs p-2.5 border border-slate-200 rounded-lg">
                      <option value="Sciences (STEM)">Sciences (STEM)</option>
                      <option value="Commercial &amp; Business">Commercial &amp; Business</option>
                      <option value="Arts &amp; Humanities">Arts &amp; Humanities</option>
                      <option value="General Studies">General Studies</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 pt-2 flex space-x-2">
                    <button type="submit" className="bg-rose-600 hover:bg-slate-900 text-white font-black text-xs px-5 py-2.5 rounded-lg flex items-center space-x-1 transition duration-150 cursor-pointer">
                      <UserPlus className="w-4 h-4 animate-bounce" />
                      <span>{stdEditId ? "Save Scholar Changes" : "Enroll Registered Student"}</span>
                    </button>
                    {stdEditId && (
                      <button type="button" onClick={()=>{setStdEditId(null); setStdName(''); setStdEmail('');}} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-lg cursor-pointer">
                        Cancel Change
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Profiles Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-indigo-900/10 font-bold text-slate-500 uppercase text-[9px] tracking-wider">
                      <th className="p-4">SCHOLAR ENROLLED INFORMATION</th>
                      <th className="p-4">ASSIGNED CLASS</th>
                      <th className="p-4">FACULTY STREAM</th>
                      <th className="p-4 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150">
                    {db.studentProfiles.filter(std => std.status !== 'Left').map((std) => (
                      <tr key={std.id} className="hover:bg-slate-50/50">
                        <td className="p-4">
                          <strong className="block text-slate-900 font-black text-sm">{std.name}</strong>
                          <span className="text-[10px] text-slate-400 font-mono">{std.email}</span>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-850 text-[10px] border border-sky-200 font-bold">{std.class}</span>
                        </td>
                        <td className="p-4 text-slate-650 text-slate-750 font-bold">{std.department}</td>
                        <td className="p-4 text-right">
                          <div className="inline-flex space-x-1.5">
                            <button onClick={()=>editStudent(std)} className="p-1.5 text-blue-600 hover:bg-blue-50 border border-blue-100 rounded-lg transition cursor-pointer"><Edit3 className="w-3.5 h-3.5" /></button>
                            <button onClick={()=>setStudentToDelete(std)} className="p-1.5 text-rose-600 hover:bg-rose-50 border border-rose-100 rounded-lg transition cursor-pointer" title="Remove student who left"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Scholar Recovery Desk */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 font-sans">
                <div className="flex items-center space-x-2">
                  <span className="text-base">🔄</span>
                  <h5 className="font-extrabold text-[#111C24] text-[11px] uppercase tracking-wider">Scholar Re-entry &amp; Reactivation Desk</h5>
                </div>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Did a student previously leave the school and return? Enter their unique ID (e.g., <code className="font-mono text-school-wine">WOL-SCI-SSS3-XXXX-AI</code>) below to securely restore their profile, grades, and academic records back to active roster.
                </p>
                <form onSubmit={recoverStudent} className="flex gap-2 max-w-md items-center">
                  <input 
                    type="text" 
                    value={recoverId}
                    onChange={(e) => setRecoverId(e.target.value)}
                    placeholder="Enter Student ID (e.g. WOL-SCI-SSS3-4081-AI)"
                    className="flex-1 text-xs p-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none uppercase font-mono"
                  />
                  <button 
                    type="submit" 
                    className="bg-[#111C24] hover:bg-[#722F37] text-white text-[10px] uppercase font-black px-4 py-2 rounded-lg transition shrink-0 cursor-pointer"
                  >
                    Restore Scholar
                  </button>
                </form>
                {recoverError && (
                  <p className="text-[10px] text-rose-600 font-semibold">{recoverError}</p>
                )}
                {recoverSuccess && (
                  <p className="text-[10px] text-emerald-600 font-semibold">{recoverSuccess}</p>
                )}
              </div>
            </div>
          )}

          {/* C: PUBLISH STUDENT EXAM RESULT */}
          {activePanel === 'results' && db && (
            <div className="space-y-6 animate-slideUp">
              
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide border-b border-slate-100 pb-2 mb-2">
                  PASTE STUDENT TRANSCRIPT &amp; SCORE RECORDS
                </h4>

                {publishedCode && (
                  <div className="p-4 bg-emerald-50 border border-emerald-250 text-emerald-800 rounded-xl space-y-2">
                    <div className="flex items-center space-x-1.5 text-xs font-black">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>SCORECARD SUCCESSFULLY REGISTERED!</span>
                    </div>
                    <p className="text-[11px]">
                      Share this customized verification lookup code with the scholar so they can retrieve this official certificate transcript sheets on the Results Checking hub:
                    </p>
                    <div className="bg-emerald-900 text-emerald-300 font-mono text-center p-3 text-lg rounded-lg border border-emerald-700 tracking-widest uppercase font-black">
                      {publishedCode}
                    </div>
                    <button onClick={()=>setPublishedCode(null)} className="text-[10px] underline font-bold mt-1 text-emerald-800 block">Create Another Sheet</button>
                  </div>
                )}

                <form onSubmit={publishResult} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">SELECT ENROLLED STUDENT SCHOLAR *</label>
                      <select 
                        value={resTargetStudent}
                        onChange={(e)=>setResTargetStudent(e.target.value)}
                        className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none"
                      >
                        <option value="">-- Choose Student --</option>
                        {db.studentProfiles.filter(s => s.status !== 'Left').map(s => (
                          <option key={s.id} value={s.name}>{s.name} ({s.class})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1 font-display">EXAMINATION CATEGORY *</label>
                      <select value={resExamType} onChange={(e)=>setResExamType(e.target.value)} className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none">
                        <option value="WAEC Mastery Evaluation">WAEC Mastery Evaluation</option>
                        <option value="JAMB Complete Mock">JAMB Complete Mock</option>
                        <option value="BECE Junior WAEC Exam">BECE Junior WAEC Exam</option>
                        <option value="National Common Entrance Exam">National Common Entrance Exam</option>
                      </select>
                    </div>
                  </div>

                  {/* Add dynamic course scores */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-3 shadow-inner">
                    <span className="text-[10px] font-bold text-indigo-900 uppercase block tracking-wider font-display">Add Score Entries Lists</span>
                    
                    <div className="flex gap-2 items-center flex-wrap">
                      <select value={resTempSubject} onChange={(e)=>setResTempSubject(e.target.value)} className="text-xs p-2 border border-slate-250 bg-white rounded">
                        <option value="Mathematics">Mathematics</option>
                        <option value="English Language">English Language</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Biology">Biology</option>
                        <option value="Further Mathematics">Further Mathematics</option>
                      </select>
                      
                      <div className="flex items-center space-x-1.5">
                        <input type="number" min={0} max={100} value={resTempScore} onChange={(e)=>setResTempScore(Number(e.target.value))} className="w-16 text-xs p-2 border border-slate-250 bg-white rounded tracking-wide text-center" />
                        <span className="text-xs font-mono">/ 100</span>
                      </div>

                      <button type="button" onClick={addResSubject} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-2 rounded font-bold cursor-pointer transition">
                        Insert Score
                      </button>
                    </div>

                    {/* Appending scores table */}
                    <div className="space-y-1.5 max-h-[150px] overflow-y-auto pt-2 border-t border-slate-150">
                      {resSubjectList.map((entry, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs p-2 bg-white rounded border border-slate-150">
                          <span className="font-bold text-slate-800">{entry.subject}</span>
                          <div className="flex items-center space-x-3 font-mono">
                            <span className="font-bold text-indigo-700">{entry.score} / 100</span>
                            <button type="button" onClick={()=>removeResSubject(idx)} className="text-rose-500 hover:text-rose-800 text-[10px] underline font-sans cursor-pointer">Remove</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">OVERALL ACADEMIC REMARK STATEMENT</label>
                    <input type="text" value={resRemark} onChange={(e)=>setResRemark(e.target.value)} placeholder="e.g. Excellent WAEC standard calculations capability. Satisfactory." className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none" />
                  </div>

                  <button type="submit" className="bg-rose-600 hover:bg-slate-900 text-white font-black text-xs px-5 py-3 rounded-lg flex items-center space-x-1 cursor-pointer">
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Publish &amp; Seed Verification Code</span>
                  </button>
                </form>
              </div>

              {/* Published Result card table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-indigo-900/10 font-bold text-slate-500 uppercase text-[9px] tracking-wider">
                      <th className="p-4">PUBLISHED STUDENT RECT</th>
                      <th className="p-4">EXAM VERIFICATION CODE</th>
                      <th className="p-4">SCORES CONTENT LIST</th>
                      <th className="p-4 text-center">OPERATIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150">
                    {db.results.map((res) => (
                      <tr key={res.id} className="hover:bg-slate-50/50">
                        <td className="p-4">
                          <strong className="block text-slate-900 font-extrabold text-sm">{res.studentName}</strong>
                          <span className="text-[10px] text-indigo-800 italic uppercase">{res.examType}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-mono bg-rose-50 text-rose-850 px-2 py-1 rounded font-black border border-rose-250 tracking-wider text-xs">
                            {res.examCode}
                          </span>
                        </td>
                        <td className="p-4 text-slate-550 text-slate-500 leading-snug">
                          {res.subjects.map((s, idx) => (
                            <span key={idx} className="inline-block bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] mr-1 mb-1 border border-slate-200">
                              {s.subject}: {s.score}
                            </span>
                          ))}
                        </td>
                        <td className="p-4 text-center">
                          <button onClick={()=>deleteResult(res.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 border border-rose-100 rounded-lg transition cursor-pointer" title="Recall scorecard"><Trash2 className="w-3.5 h-3.5" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* D: ADMISSIONS FORM APPROVALS */}
          {activePanel === 'admissions' && db && (
            <div className="space-y-6 animate-slideUp">
              <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide border-b border-slate-100 pb-2 mb-4">
                INCOMING ONLINE ADMISSION REGISTRY
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {db.applications.map((appItem) => (
                  <div key={appItem.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <strong className="block text-slate-900 text-base font-extrabold leading-tight">{appItem.fullName}</strong>
                          <span className="text-[10px] text-slate-400 font-mono block">{appItem.email}</span>
                        </div>
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border tracking-wide uppercase ${appItem.status === 'Approved' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : appItem.status === 'Declined' ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-indigo-50 text-indigo-800 border-indigo-200 animate-pulse'}`}>
                          {appItem.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs border-y border-slate-100 py-2 my-2">
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">DESIRED CLASS</span>
                          <span className="font-bold text-slate-700">{appItem.desiredClass}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">PREVIOUS SCHOOL</span>
                          <span className="font-bold text-slate-700 truncate block max-w-[120px]">{appItem.lastSchool}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-650 text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-sans italic">
                        &ldquo;{appItem.reason}&rdquo;
                      </p>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      {appItem.status === 'Pending' ? (
                        <>
                          <button onClick={()=>handleAdmissionStatus(appItem.id, 'Approved')} className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] px-3.5 py-2 rounded-lg flex-1 transition cursor-pointer">
                            Approve Scholarship File
                          </button>
                          <button onClick={()=>handleAdmissionStatus(appItem.id, 'Declined')} className="bg-rose-650 bg-rose-700 hover:bg-slate-900 text-white font-bold text-[10px] px-3 py-2 rounded-lg transition cursor-pointer">
                            Decline Application
                          </button>
                        </>
                      ) : (
                        <div className="text-[11px] text-slate-400 italic">Review completed on {new Date(appItem.dateApplied).toLocaleDateString()}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* E: GALLERY IMAGES MANAGER */}
          {activePanel === 'gallery' && db && (
            <div className="space-y-6 animate-slideUp">
              {/* Photo uploader */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide border-b border-slate-100 pb-2 mb-4">
                  UPLOAD AND SEED CAMPUS FACILITY PHOTOS
                </h4>

                <form onSubmit={uploadGallery} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-block mb-1">IMAGE SOURCE URL LINK *</label>
                    <input type="text" value={galUrl} onChange={(e)=>setGalUrl(e.target.value)} required placeholder="e.g. https://images.unsplash.com/photo-example.jpg" className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">PHOTO CAPTION</label>
                    <input type="text" value={galCaption} onChange={(e)=>setGalCaption(e.target.value)} placeholder="e.g. Modern chemistry lab setup and audits." className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1 font-display">RESOURCE CATEGORY</label>
                    <select value={galCategory} onChange={(e)=>setGalCategory(e.target.value)} className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none">
                      <option value="Campus">Campus</option>
                      <option value="Labs">Labs</option>
                      <option value="Library">Library</option>
                      <option value="Academics">Academics</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 pt-2">
                    <button type="submit" className="bg-rose-600 hover:bg-slate-900 text-white font-black text-xs px-5 py-2.5 rounded-lg flex items-center space-x-1.5 transition duration-150 cursor-pointer">
                      <UploadCloud className="w-4 h-4" />
                      <span>Upload to Gallery File</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Photos List Grid */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <span className="text-[10px] font-bold text-slate-450 text-slate-500 uppercase block tracking-wider font-display">Manage Enrolled Campus Images</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {db.gallery.map((imgItem) => (
                    <div key={imgItem.id} className="group relative border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex flex-col justify-between">
                      <img src={imgItem.imageUrl} alt={imgItem.caption} className="w-full h-24 object-cover" referrerPolicy="no-referrer" />
                      <div className="p-2 space-y-1">
                        <strong className="text-[10px] text-slate-800 leading-tight block truncate">{imgItem.caption}</strong>
                        <span className="text-[8px] tracking-wide text-indigo-700 bg-indigo-50 border border-indigo-100 px-1 py-0.1 select-none font-bold uppercase rounded">{imgItem.category}</span>
                      </div>
                      <div className="p-2 border-t border-slate-100 flex justify-end">
                        <button onClick={()=>deleteGallery(imgItem.id)} className="text-rose-605 p-1 text-rose-600 hover:bg-rose-50 rounded-md border border-rose-100 cursor-pointer transition">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* F: AI TUTORIALS CONVERSATION AUDITING LOGS */}
          {activePanel === 'logs' && db && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 animate-slideUp">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center gap-4 flex-wrap">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">SYSTEM ACTIVITY LOGS &amp; AUDITING FEED</h4>
                  <p className="text-[11px] text-slate-400 leading-normal">Monitor server transactions, dynamic math explanations, and Crest AI questions generated by scholars.</p>
                </div>
                <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl text-xs w-48 shadow-inner">
                  <input type="text" value={logSearch} onChange={(e)=>setLogSearch(e.target.value)} placeholder="Search by Student or Course..." className="p-2 pl-3 pr-8 w-full text-xs text-slate-800 bg-transparent focus:outline-none" />
                  <Search className="w-4 h-4 text-slate-400 absolute right-2 pointer-events-none" />
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-150">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-indigo-900/10 font-bold text-slate-500 uppercase text-[9px] tracking-wider">
                      <th className="p-3">TIMESTAMP</th>
                      <th className="p-3 select-none">SCHOLAR</th>
                      <th className="p-3 select-none">SUBJECT EXAMINED</th>
                      <th className="p-3">QUERY SUMMARY</th>
                      <th className="p-3">AI RESPONSE OUTLINE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 font-mono text-[10px]">
                    {db.logs
                      .filter(log => log.studentName.toLowerCase().includes(logSearch.toLowerCase()) || log.subject.toLowerCase().includes(logSearch.toLowerCase()))
                      .map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-semibold text-slate-500 whitespace-nowrap">{new Date(log.timestamp).toLocaleTimeString()}</td>
                          <td className="p-3 font-bold text-slate-850 whitespace-nowrap text-slate-800">{log.studentName}</td>
                          <td className="p-3 font-black text-indigo-700 whitespace-nowrap">{log.subject}</td>
                          <td className="p-3 text-slate-650 text-slate-700 max-w-[150px] truncate">{log.queryText}</td>
                          <td className="p-3 text-slate-550 text-slate-600 max-w-[150px] truncate">{log.responsePreview}</td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* G: CONSOLIDATED REGISTRY WORKSPACE PAGE */}
          {activePanel === 'registry' && db && (
            <div className="space-y-6 animate-slideUp">
              {/* Stat Counters Row */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-sky-50/55 p-4 rounded-2xl border border-sky-100 shadow-sm text-center">
                  <span className="text-[10px] text-sky-600 font-bold uppercase block tracking-wider font-display">Registered Scholars</span>
                  <p className="text-2xl font-black text-slate-800 mt-1 font-sans">{db.studentProfiles.filter(s => s.status !== 'Left').length}</p>
                </div>
                <div className="bg-emerald-50/55 p-4 rounded-2xl border border-emerald-100 shadow-sm text-center">
                  <span className="text-[10px] text-emerald-600 font-bold uppercase block tracking-wider font-display">Active Admissions</span>
                  <p className="text-2xl font-black text-slate-800 mt-1 font-sans">{db.applications.length}</p>
                </div>
                <div className="bg-rose-50/55 p-4 rounded-2xl border border-rose-100 shadow-sm text-center">
                  <span className="text-[10px] text-rose-600 font-bold uppercase block tracking-wider font-display">Published Grades</span>
                  <p className="text-2xl font-black text-slate-800 mt-1 font-sans">{db.results.length}</p>
                </div>
                <div className="bg-indigo-50/55 p-4 rounded-2xl border border-indigo-100 shadow-sm text-center">
                  <span className="text-[10px] text-indigo-600 font-bold uppercase block tracking-wider font-display">Course Syllabus</span>
                  <p className="text-2xl font-black text-slate-800 mt-1 font-sans">{db.courseMaterials.length}</p>
                </div>
              </div>

              {/* Master Registry Table Search and Filter Panel */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h4 className="font-extrabold text-[#111C24] text-sm uppercase tracking-wide font-display">Unified Institutional Registry</h4>
                    <p className="text-[11px] text-slate-400">Search, view, audit and explore all active student records, admission logs and syllabus databases.</p>
                  </div>
                  {/* Register and CSV Export Options */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button 
                      onClick={() => {
                        setRegName('');
                        setRegEmail('');
                        setRegError(null);
                        setIsRegisterModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl shadow transition cursor-pointer"
                    >
                      👤 Register Student
                    </button>
                    <button 
                      onClick={() => {
                        const csvContent = "data:text/csv;charset=utf-8," 
                          + "TYPE,NAME/TITLE,IDENTIFIER/CLASS,EMAIL/SUBJECT,STATUS/REMARK\n"
                          + db.studentProfiles.map(s => `STUDENT,"${s.name}",${s.class},"${s.email}",${s.status === 'Left' ? 'LEFT' : 'ACTIVE'}`).join("\n") + "\n"
                          + db.results.map(r => `RESULT,"${r.studentName}",${r.examType},"${r.examCode}","${r.remark}"`).join("\n") + "\n"
                          + db.applications.map(a => `ADMISSION,"${a.fullName}",${a.desiredClass},"${a.email}",${a.status}`).join("\n");
                        const encodedUri = encodeURI(csvContent);
                        const link = document.createElement("a");
                        link.setAttribute("href", encodedUri);
                        link.setAttribute("download", `wolcrest_official_registry_${Date.now()}.csv`);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="inline-flex items-center gap-1 bg-[#111C24] text-white hover:bg-[#722F37] text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl border border-white/10 shadow transition cursor-pointer"
                    >
                      📥 Export Registry (CSV)
                    </button>
                  </div>
                </div>

                {/* Registry View selector filter */}
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setRegistryView('students')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${registryView === 'students' ? 'bg-[#722F37] text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                  >
                    Scholars Register ({db.studentProfiles.filter(s => s.status !== 'Left').length})
                  </button>
                  <button 
                    onClick={() => setRegistryView('grades')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${registryView === 'grades' ? 'bg-[#722F37] text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                  >
                    Grade Sheet Reports ({db.results.length})
                  </button>
                  <button 
                    onClick={() => setRegistryView('admissions')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${registryView === 'admissions' ? 'bg-[#722F37] text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                  >
                    Admissions Ledger ({db.applications.length})
                  </button>
                  <button 
                    onClick={() => setRegistryView('materials')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${registryView === 'materials' ? 'bg-[#722F37] text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                  >
                    Syllabi Reference ({db.courseMaterials.length})
                  </button>
                  <button 
                    onClick={() => setRegistryView('settings_events')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${registryView === 'settings_events' ? 'bg-[#722F37] text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                  >
                    🗓️ Settings &amp; Events ({db.events?.length || 0})
                  </button>
                </div>

                {/* Sub table output based on selected selection */}
                <div className="overflow-x-auto rounded-xl border border-slate-150">
                  {registryView === 'students' && (
                    <div className="w-full">
                      {db.studentProfiles.filter(s => s.status !== 'Left').length === 0 ? (
                        <div className="text-center p-8 bg-slate-50 rounded-xl space-y-3">
                          <p className="text-xs text-slate-500 font-sans">No scholars registered yet in the Wolcrest Database.</p>
                          <button
                            onClick={() => {
                              setRegName('');
                              setRegEmail('');
                              setRegError(null);
                              setIsRegisterModalOpen(true);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase px-4 py-2 rounded-xl inline-flex items-center gap-1 transition cursor-pointer"
                          >
                            👤 Register First Student Now
                          </button>
                        </div>
                      ) : (
                        <div>
                          <table className="w-full text-xs text-left">
                            <thead>
                              <tr className="bg-slate-50 border-b border-indigo-900/10 font-bold text-slate-500 uppercase text-[9px] tracking-wider">
                                <th className="p-3">GIVEN NAME</th>
                                <th className="p-3">ASSIGNED SYLLABUS</th>
                                <th className="p-3">FACULTY DEPT</th>
                                <th className="p-3">EMAIL CORRESPONDENCE</th>
                                <th className="p-3 text-right">ACTIONS</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-150 font-mono text-[11px] text-slate-700">
                              {db.studentProfiles.filter(s => s.status !== 'Left').map((s, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50">
                                  <td className="p-3 font-bold text-slate-850 text-slate-900">
                                    {s.name}
                                    <div className="text-[9px] text-slate-400 font-mono select-all">ID: {s.id}</div>
                                  </td>
                                  <td className="p-3"><span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-850 text-[10px] border border-sky-100 font-bold">{s.class}</span></td>
                                  <td className="p-3 font-semibold font-display text-xs text-slate-600">{s.department}</td>
                                  <td className="p-3">{s.email}</td>
                                  <td className="p-3 text-right">
                                    <div className="inline-flex space-x-1.5">
                                      <button 
                                        onClick={() => openEditStudentDataModal(s)}
                                        className="inline-flex items-center gap-1 bg-[#722F37] hover:bg-[#111C24] text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition shadow-sm cursor-pointer"
                                        title="Edit & Grade"
                                      >
                                        ✏️ Edit
                                      </button>
                                      <button 
                                        onClick={() => setStudentToDelete(s)}
                                        className="inline-flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition shadow-sm cursor-pointer animate-pulse"
                                        title="Remove student who left"
                                      >
                                        🗑️ Delete Left Student
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>

                          {/* Scholar Recovery Desk */}
                          <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 font-sans">
                            <div className="flex items-center space-x-2">
                              <span className="text-base">🔄</span>
                              <h5 className="font-extrabold text-[#111C24] text-[11px] uppercase tracking-wider">Scholar Re-entry &amp; Reactivation Desk</h5>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-normal">
                              Did a student previously leave the school and return? Enter their unique ID (e.g., <code className="font-mono text-school-wine">WOL-SCI-SSS3-XXXX-AI</code>) below to securely restore their profile, grades, and academic records back to active roster.
                            </p>
                            <form onSubmit={recoverStudent} className="flex gap-2 max-w-md items-center">
                              <input 
                                type="text" 
                                value={recoverId}
                                onChange={(e) => setRecoverId(e.target.value)}
                                placeholder="Enter Student ID (e.g. WOL-SCI-SSS3-4081-AI)"
                                className="flex-1 text-xs p-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none uppercase font-mono"
                              />
                              <button 
                                type="submit" 
                                className="bg-[#111C24] hover:bg-[#722F37] text-white text-[10px] uppercase font-black px-4 py-2 rounded-lg transition shrink-0 cursor-pointer"
                              >
                                Restore Scholar
                              </button>
                            </form>
                            {recoverError && (
                              <p className="text-[10px] text-rose-600 font-semibold">{recoverError}</p>
                            )}
                            {recoverSuccess && (
                              <p className="text-[10px] text-emerald-600 font-semibold">{recoverSuccess}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {registryView === 'grades' && (
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="bg-slate-50 border-b border-indigo-900/10 font-bold text-slate-500 uppercase text-[9px] tracking-wider">
                          <th className="p-3">SCHOLAR EXAMINED</th>
                          <th className="p-3">VERIFICATION SECURITY CODE</th>
                          <th className="p-3">SYLLABUS STANDARD</th>
                          <th className="p-3">TEST EVALUATION SCORES</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150 font-mono text-[11px] text-slate-700">
                        {db.results.map((r, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="p-3 font-bold text-slate-900">{r.studentName}</td>
                            <td className="p-3">
                              <span className="font-mono bg-rose-50 text-[#722F37] px-2 py-1 rounded font-black border border-rose-200 text-[10px] tracking-widest leading-none">
                                {r.examCode}
                              </span>
                            </td>
                            <td className="p-3 font-sans font-black text-rose-800 text-[10px]">{r.examType}</td>
                            <td className="p-3 leading-normal font-sans">
                              {r.subjects.map((sub, sIdx) => (
                                <span key={sIdx} className="inline-block bg-slate-100 border border-slate-200 text-slate-700 rounded px-1.5 py-0.5 mr-1 mb-1 text-[10px]">
                                  {sub.subject}: <strong>{sub.score}%</strong>
                                </span>
                              ))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {registryView === 'admissions' && (
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="bg-slate-50 border-b border-indigo-900/10 font-bold text-slate-500 uppercase text-[9px] tracking-wider">
                          <th className="p-3">FULL CANDIDATE NAME</th>
                          <th className="p-3">CLASS REQUESTED</th>
                          <th className="p-3">PREVIOUS SCHOOL</th>
                          <th className="p-3">STATUS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150 font-mono text-[11px] text-slate-700">
                        {db.applications.map((a, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="p-3 font-bold text-slate-900">{a.fullName}</td>
                            <td className="p-3 text-indigo-700 font-bold">{a.desiredClass}</td>
                            <td className="p-3 font-sans max-w-[150px] truncate">{a.lastSchool}</td>
                            <td className="p-3 font-sans">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${a.status === 'Approved' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : a.status === 'Declined' ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-slate-100 text-slate-600 border-slate-200 animate-pulse'}`}>
                                {a.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {registryView === 'materials' && (
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="bg-slate-50 border-b border-indigo-900/10 font-bold text-slate-500 uppercase text-[9px] tracking-wider">
                          <th className="p-3">SYLLABUS CLASS</th>
                          <th className="p-3">COURSE SUBJECT</th>
                          <th className="p-3">MATERIAL DOCUMENT TITLE</th>
                          <th className="p-3">CLOUD FILE ATTACHED</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150 font-mono text-[11px] text-slate-700">
                        {db.courseMaterials.map((m, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="p-3 font-bold text-[#111C24]">{m.class}</td>
                            <td className="p-3 text-indigo-700 font-bold">{m.subject}</td>
                            <td className="p-3 font-sans text-xs">{m.title}</td>
                            <td className="p-3 text-blue-700 underline truncate max-w-[140px] font-sans text-[10px]">
                              <a href={m.url} target="_blank" rel="noreferrer">{m.url}</a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {registryView === 'settings_events' && (
                    <div className="p-6 bg-white space-y-8 animate-fadeIn text-slate-800">
                      {/* Top status/messages */}
                      {settingsError && (
                        <div className="p-3 bg-rose-50 text-rose-750 text-xs font-semibold rounded-xl border border-rose-150 animate-shake flex items-center justify-between">
                          <span>⚠️ {settingsError}</span>
                          <button onClick={()=>setSettingsError(null)} className="text-rose-500 hover:text-rose-700 font-bold">×</button>
                        </div>
                      )}
                      {settingsSuccess && (
                        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-150 animate-fadeIn flex items-center justify-between">
                          <span>✅ {settingsSuccess}</span>
                          <button onClick={()=>setSettingsSuccess(null)} className="text-emerald-650 hover:text-emerald-800 font-bold font-sans">×</button>
                        </div>
                      )}

                      {/* Flex grid for settings and event management */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        
                        {/* 1. Academic Settings Card */}
                        <div className="lg:col-span-5 p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                          <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                            <span>🏫 Session &amp; Term Guidelines</span>
                          </h4>

                          <div className="space-y-4">
                            {/* Academic Session */}
                            <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">Active Session</span>
                                <span className="text-[11px] font-mono font-bold bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded text-indigo-700">
                                  {db?.currentSession || "2025/2026"}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  placeholder="e.g. 2026/2027" 
                                  value={newSessionInput}
                                  onChange={(e)=>setNewSessionInput(e.target.value)}
                                  className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-school-wine focus:bg-white"
                                />
                                <button
                                  type="button"
                                  onClick={async () => {
                                    setSettingsError(null);
                                    setSettingsSuccess(null);
                                    if(!newSessionInput.trim()){
                                      setSettingsError("Please input a valid session (e.g. 2026/2027)");
                                      return;
                                    }
                                    try {
                                      const resp = await fetch('/api/admin/settings/session', {
                                        method: 'POST',
                                        headers: {
                                          'Content-Type': 'application/json',
                                          'X-Admin-Token': 'wolcrest-admin-premium-bypass-lock'
                                        },
                                        body: JSON.stringify({ session: newSessionInput.trim() })
                                      });
                                      if (resp.ok) {
                                        setSettingsSuccess(`Academic Session altered to ${newSessionInput.trim()}!`);
                                        setNewSessionInput('');
                                        loadDb();
                                        onDbUpdated?.();
                                      } else {
                                        const errData = await resp.json();
                                        setSettingsError(errData.error || "Failed to update session.");
                                      }
                                    } catch(err) {
                                      setSettingsError("Network connection issue.");
                                    }
                                  }}
                                  className="bg-[#111C24] hover:bg-school-wine text-white text-[10px] font-bold uppercase px-3 py-1.5 rounded-xl cursor-pointer transition whitespace-nowrap"
                                >
                                  Update Session
                                </button>
                              </div>
                            </div>

                            {/* Academic Term */}
                            <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">Active Term</span>
                                <span className="text-[11px] font-mono font-bold bg-rose-50 border border-rose-150 px-2 py-0.5 rounded text-rose-700">
                                  {db?.currentTerm || "3rd Term"}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  placeholder="e.g. 1st Term" 
                                  value={newTermInput}
                                  onChange={(e)=>setNewTermInput(e.target.value)}
                                  className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-school-wine focus:bg-white"
                                />
                                <button
                                  type="button"
                                  onClick={async () => {
                                    setSettingsError(null);
                                    setSettingsSuccess(null);
                                    if(!newTermInput.trim()){
                                      setSettingsError("Please input an academic term (e.g. 1st Term)");
                                      return;
                                    }
                                    try {
                                      const resp = await fetch('/api/admin/settings/term', {
                                        method: 'POST',
                                        headers: {
                                          'Content-Type': 'application/json',
                                          'X-Admin-Token': 'wolcrest-admin-premium-bypass-lock'
                                        },
                                        body: JSON.stringify({ term: newTermInput.trim() })
                                      });
                                      if (resp.ok) {
                                        setSettingsSuccess(`Academic Term adjusted to ${newTermInput.trim()}!`);
                                        setNewTermInput('');
                                        loadDb();
                                        onDbUpdated?.();
                                      } else {
                                        const errData = await resp.json();
                                        setSettingsError(errData.error || "Failed to update term.");
                                      }
                                    } catch(err) {
                                      setSettingsError("Network connection issue.");
                                    }
                                  }}
                                  className="bg-[#111C24] hover:bg-school-wine text-white text-[10px] font-bold uppercase px-3 py-1.5 rounded-xl cursor-pointer transition whitespace-nowrap"
                                >
                                  Update Term
                                </button>
                              </div>
                            </div>

                          </div>
                        </div>

                        {/* 2. School Events List and Form */}
                        <div className="lg:col-span-7 space-y-6">
                          
                          {/* Create event card */}
                          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                            <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center justify-between border-b border-slate-200 pb-2">
                              <span>📅 Scheduled Event Register Form</span>
                            </h4>
                            
                            <form 
                              onSubmit={async (e) => {
                                e.preventDefault();
                                setSettingsError(null);
                                setSettingsSuccess(null);
                                if (!newEventName.trim() || !newEventDesc.trim()) {
                                  setSettingsError("Both Event Title and Description are required.");
                                  return;
                                }
                                try {
                                  const resp = await fetch('/api/admin/events', {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json',
                                      'X-Admin-Token': 'wolcrest-admin-premium-bypass-lock'
                                    },
                                    body: JSON.stringify({
                                      name: newEventName.trim(),
                                      description: newEventDesc.trim(),
                                      date: newEventDate || new Date().toISOString().split('T')[0]
                                    })
                                  });
                                  if (resp.ok) {
                                    setSettingsSuccess(`School Event '${newEventName.trim()}' successfully scheduled!`);
                                    setNewEventName('');
                                    setNewEventDesc('');
                                    setNewEventDate('');
                                    loadDb();
                                    onDbUpdated?.();
                                  } else {
                                    const errData = await resp.json();
                                    setSettingsError(errData.error || "Failed to add event.");
                                  }
                                } catch(err) {
                                  setSettingsError("Network error occurred.");
                                }
                              }}
                              className="space-y-3"
                            >
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase">Event Name / Title</label>
                                  <input 
                                    type="text" 
                                    placeholder="e.g. Inter-House Sports Gala" 
                                    value={newEventName}
                                    onChange={(e)=>setNewEventName(e.target.value)}
                                    className="w-full text-xs px-3 py-1.8 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-school-wine text-slate-800"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase">Scheduled Date</label>
                                  <input 
                                    type="date" 
                                    value={newEventDate}
                                    onChange={(e)=>setNewEventDate(e.target.value)}
                                    className="w-full text-xs px-3 py-1.8 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-school-wine text-slate-700 font-sans"
                                  />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Event Description &amp; Targets</label>
                                <textarea
                                  placeholder="Provide descriptive parameters for this official school seminar or event..."
                                  rows={2}
                                  value={newEventDesc}
                                  onChange={(e)=>setNewEventDesc(e.target.value)}
                                  className="w-full text-xs p-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-school-wine text-slate-800"
                                />
                              </div>
                              <button
                                type="submit"
                                className="w-full bg-[#722F37] hover:bg-[#111C24] text-white text-xs font-black uppercase tracking-wider py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                              >
                                ➕ Schedule Event
                              </button>
                            </form>
                          </div>

                          {/* Events lists status display */}
                          <div className="p-5 bg-[#111C24] text-white rounded-2xl space-y-4">
                            <h4 className="text-xs font-black text-rose-300 uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-2 font-display">
                              <span>📋 Scheduled Bulletin Events ({db?.events?.length || 0})</span>
                            </h4>

                            {db?.events && db.events.length > 0 ? (
                              <div className="divide-y divide-white/10 max-h-[300px] overflow-y-auto pr-1">
                                {db.events.map((ev) => (
                                  <div key={ev.id} className="py-3 flex justify-between items-start gap-3">
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <span className="text-[9px] bg-white/10 border border-white/15 text-rose-300 font-mono font-bold px-1.5 py-0.5 rounded">
                                          📅 {ev.date}
                                        </span>
                                        <span className="text-[8px] text-slate-400 font-mono">ID: {ev.id}</span>
                                      </div>
                                      <h5 className="font-extrabold text-xs uppercase leading-tight">{ev.name}</h5>
                                      <p className="text-[10px] text-slate-300 leading-relaxed max-w-sm font-sans">{ev.description}</p>
                                    </div>
                                    <button 
                                      type="button"
                                      onClick={async () => {
                                        if(!confirm(`Are you sure you want to remove event: "${ev.name}"?`)) return;
                                        setSettingsError(null);
                                        setSettingsSuccess(null);
                                        try {
                                          const resp = await fetch(`/api/admin/events/${ev.id}`, {
                                            method: 'DELETE',
                                            headers: {
                                              'X-Admin-Token': 'wolcrest-admin-premium-bypass-lock'
                                            }
                                          });
                                          if (resp.ok) {
                                            setSettingsSuccess("School Event deleted successfully!");
                                            loadDb();
                                            onDbUpdated?.();
                                          } else {
                                            setSettingsError("Failed to delete event.");
                                          }
                                        } catch(err) {
                                          setSettingsError("Connection issue occurred.");
                                        }
                                      }}
                                      className="p-1.5 text-slate-400 hover:text-rose-400 text-xs font-bold transition cursor-pointer font-sans"
                                      title="Delete Event"
                                    >
                                      🗑️
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-6 border border-dashed border-white/10 rounded-xl">
                                <p className="text-xs text-slate-400">No school events scheduled currently.</p>
                              </div>
                            )}

                          </div>

                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* 1. Register Student Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-slideUp">
            <div className="bg-[#722F37] text-white p-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-rose-300" />
                <h3 className="font-extrabold text-xs tracking-wider uppercase">New Scholar Registration Form</h3>
              </div>
              <button 
                onClick={() => setIsRegisterModalOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegSubmit} className="p-6 space-y-4">
              {regError && (
                <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg flex items-center space-x-2 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 block uppercase">Candidate Student Full Name *</label>
                <input 
                  type="text" 
                  value={regName} 
                  onChange={(e) => setRegName(e.target.value)} 
                  required 
                  placeholder="e.g. Adebayo Akinolu" 
                  className="w-full text-xs p-2.5 border border-slate-250 rounded-lg focus:outline-none" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 block uppercase">Assigned Class Standard</label>
                  <select 
                    value={regClass} 
                    onChange={(e) => setRegClass(e.target.value)} 
                    className="w-full text-xs p-2.5 border border-slate-250 rounded-lg bg-white"
                  >
                    <option value="SSS 3">SSS 3</option>
                    <option value="SSS 2">SSS 2</option>
                    <option value="SSS 1">SSS 1</option>
                    <option value="JSS 3">JSS 3</option>
                    <option value="JSS 2">JSS 2</option>
                    <option value="JSS 1">JSS 1</option>
                    <option value="Grade 5">Grade 5</option>
                    <option value="Grade 4">Grade 4</option>
                    <option value="Grade 3">Grade 3</option>
                    <option value="Grade 2">Grade 2</option>
                    <option value="Grade 1">Grade 1</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 block uppercase">Assigned Faculty Department</label>
                  <select 
                    value={regDept} 
                    onChange={(e) => setRegDept(e.target.value)} 
                    className="w-full text-xs p-2.5 border border-slate-250 rounded-lg bg-white"
                  >
                    <option value="Sciences (STEM)">Sciences (STEM)</option>
                    <option value="Commercial &amp; Business">Commercial &amp; Business</option>
                    <option value="Arts &amp; Humanities">Arts &amp; Humanities</option>
                    <option value="General Studies">General Studies</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 block uppercase">Contact Email (Optional)</label>
                <input 
                  type="email" 
                  value={regEmail} 
                  onChange={(e) => setRegEmail(e.target.value)} 
                  placeholder="e.g. adebayo@example.com" 
                  className="w-full text-xs p-2.5 border border-slate-250 rounded-lg focus:outline-none" 
                />
                <p className="text-[10px] text-slate-400">If omitted, an official institutional address will be automatically allocated.</p>
              </div>

              <div className="pt-2 flex justify-end space-x-2 border-t border-slate-100 mt-4">
                <button 
                  type="button" 
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-black text-xs flex items-center space-x-1 transition"
                >
                  <span>Submit Registration</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Edit Student Info & Grade Scorecard Modal */}
      {isEditGradeModalOpen && gradingStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-slideUp max-h-[90vh] flex flex-col">
            
            <div className="bg-[#111C24] text-white p-4 shrink-0 flex justify-between items-center border-b border-white/5 font-sans">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-[#722F37] text-white rounded-lg">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xs tracking-wider uppercase">Configure Scholar &amp; Grade Report Sheets</h3>
                  <p className="text-[10px] text-slate-400 font-mono">ID: {gradingStudent.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsEditGradeModalOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scroll Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Dynamic Information Banner */}
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-black text-[#722F37] uppercase tracking-widest block font-sans">Active Scholar</span>
                  <span className="text-sm font-bold text-slate-900 block font-sans">{gradingStudent.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-sky-50 text-sky-800 border border-sky-100 font-bold px-2 py-1 rounded inline-block font-mono mb-1">{gradingStudent.class}</span>
                  <span className="text-[10px] block text-slate-500 font-sans">{gradingStudent.department}</span>
                </div>
              </div>

              {/* SECTION A: EDIT STUDENT ACCOUNT DEMOGRAPHICS */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-[#111C24] uppercase tracking-widest border-b border-slate-100 pb-1 font-sans">A. Update Profile Demographics</h4>
                
                <form onSubmit={handleEditInfoSubmit} className="space-y-3 font-sans">
                  {editError && (
                    <div className="p-2 bg-rose-50 border border-rose-250 text-rose-800 text-xs rounded-lg flex items-center space-x-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{editError}</span>
                    </div>
                  )}
                  {editSuccessMsg && (
                    <div className="p-2 bg-emerald-50 border border-emerald-250 text-emerald-800 text-xs rounded-lg flex items-center space-x-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{editSuccessMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">SCHOLAR FULL NAME</label>
                      <input 
                        type="text" 
                        value={editName} 
                        onChange={(e)=>setEditName(e.target.value)} 
                        required 
                        className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-amber-900 focus:outline-none" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">CORRESPONDENCE EMAIL</label>
                      <input 
                        type="email" 
                        value={editEmail} 
                        onChange={(e)=>setEditEmail(e.target.value)} 
                        required 
                        className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-amber-900 focus:outline-none" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">SYLLABUS CLASS LEVEL</label>
                      <select 
                        value={editClass} 
                        onChange={(e)=>setEditClass(e.target.value)} 
                        className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white"
                      >
                        <option value="SSS 3">SSS 3</option>
                        <option value="SSS 2">SSS 2</option>
                        <option value="SSS 1">SSS 1</option>
                        <option value="JSS 3">JSS 3</option>
                        <option value="JSS 2">JSS 2</option>
                        <option value="JSS 1">JSS 1</option>
                        <option value="Grade 5">Grade 5</option>
                        <option value="Grade 4">Grade 4</option>
                        <option value="Grade 3">Grade 3</option>
                        <option value="Grade 2">Grade 2</option>
                        <option value="Grade 1">Grade 1</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">SPECIALLISED ACADEMIC STREAM</label>
                      <select 
                        value={editDept} 
                        onChange={(e)=>setEditDept(e.target.value)} 
                        className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white"
                      >
                        <option value="Sciences (STEM)">Sciences (STEM)</option>
                        <option value="Commercial &amp; Business">Commercial &amp; Business</option>
                        <option value="Arts &amp; Humanities">Arts &amp; Humanities</option>
                        <option value="General Studies">General Studies</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button 
                      type="submit" 
                      className="inline-flex justify-center bg-[#111C24] hover:bg-[#722F37] text-white font-bold text-[10px] uppercase px-4 py-2 rounded-lg transition tracking-wide shadow-sm cursor-pointer"
                    >
                      Save Account Modifications
                    </button>
                  </div>
                </form>
              </div>

              {/* SECTION B: GRADE STUDENT CORES AND ENTRYS */}
              <div className="space-y-4 border-t border-slate-100 pt-4 font-sans">
                <div className="flex justify-between items-center border-b border-slate-100 pb-1 flex-wrap gap-2">
                  <h4 className="text-[10px] font-black text-[#111C24] uppercase tracking-widest font-sans">B. Grade Cores &amp; Certify Transcript</h4>
                  {/* General subjects note */}
                  <span className="text-[9px] bg-amber-50 text-amber-800 border border-amber-100 rounded px-2 py-0.5 leading-none block font-mono font-bold">
                    English &amp; Maths (All) • Grade: Science &amp; Tech, History, Home Econ, CCA • JSS: Science, Social Studies, History • SSS: CCA, History
                  </span>
                </div>

                {gradeError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-150 text-rose-800 text-xs rounded-lg flex items-center space-x-1.5 font-mono">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{gradeError}</span>
                  </div>
                )}

                {gradeSuccessCode && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-250 text-emerald-800 rounded-xl space-y-1.5 shadow-sm text-xs">
                    <div className="flex items-center space-x-1 font-black">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>GRADE SHEET REGISTERED IN DATABASE</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-normal">
                      The official transcript was cataloged! Share this verification check keycode with the scholar so they can retrieve it on the results lookup desk:
                    </p>
                    <div className="font-mono bg-emerald-950 text-emerald-300 text-center uppercase tracking-widest text-base font-black p-2.5 rounded-lg border border-emerald-700">
                      {gradeSuccessCode}
                    </div>
                  </div>
                )}

                <div className="space-y-3.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">SELECT ASSESSMENT TYPE *</label>
                      <select 
                        value={gradeExamType} 
                        onChange={(e)=>setGradeExamType(e.target.value)} 
                        className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none"
                      >
                        <option value="WAEC Mastery Evaluation">WAEC Mastery Evaluation</option>
                        <option value="JAMB Complete Mock">JAMB Complete Mock</option>
                        <option value="BECE Junior WAEC Exam">BECE Junior WAEC Exam</option>
                        <option value="National Common Entrance Exam">National Common Entrance Exam</option>
                        <option value="Semester Terminal Report Card">Semester Terminal Report Card</option>
                        <option value="Weekly Advanced Test Evaluation">Weekly Advanced Test Evaluation</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">HEAD TEACHER REMARK OVERALL</label>
                      <input 
                        type="text" 
                        value={gradeRemark} 
                        onChange={(e)=>setGradeRemark(e.target.value)} 
                        placeholder="e.g. Excellent critical study results." 
                        className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-none" 
                      />
                    </div>
                  </div>

                  {/* Dynamic Score Composer Panel */}
                  <div className="bg-white p-3 rounded-lg border border-slate-150 space-y-2">
                    <span className="text-[10px] font-black text-[#111C24] uppercase block tracking-wider font-sans">Grade Composite Subjects</span>
                    
                    <div className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-12 md:col-span-4">
                        <label className="text-[8px] font-bold text-slate-400 block mb-0.5 uppercase">Course Subject Field</label>
                        <select 
                          value={newGradeSubject} 
                          onChange={(e)=>setNewGradeSubject(e.target.value)} 
                          className="w-full text-xs p-1.5 border border-slate-200 rounded bg-white text-slate-800 focus:outline-none focus:border-[#722F37]"
                        >
                          <option value="Mathematics">Mathematics</option>
                          <option value="Further Mathematics">Further Mathematics</option>
                          <option value="English Language">English Language</option>
                          <option value="Physics">Physics</option>
                          <option value="Chemistry">Chemistry</option>
                          <option value="Biology">Biology</option>
                          <option value="Yoruba">Yoruba</option>
                          <option value="Civic Education">Civic Education</option>
                          <option value="Economics">Economics</option>
                          <option value="Financial Accounting">Financial Accounting</option>
                          <option value="Commerce">Commerce</option>
                          <option value="Social Studies">Social Studies</option>
                          <option value="Basic Science">Basic Science</option>
                          <option value="Basic Science & Technology">Basic Science & Technology</option>
                          <option value="Government">Government</option>
                          <option value="Literature in English">Literature in English</option>
                          <option value="Nigerian History">Nigerian History</option>
                          <option value="Home Economics">Home Economics</option>
                          <option value="Fine Arts">Fine Arts</option>
                          <option value="CCA">CCA (Cultural & Creative Arts)</option>
                        </select>
                      </div>

                      <div className="col-span-3 md:col-span-2">
                        <label className="text-[8px] font-bold text-slate-400 block mb-0.5 uppercase" title="Maximum 20 marks">1st CA (0-20)</label>
                        <input 
                          type="number" 
                          min="0" 
                          max="20" 
                          value={newGradeCA1} 
                          onChange={(e)=>setNewGradeCA1(Number(e.target.value))} 
                          className="w-full text-xs p-1.5 border border-slate-200 rounded text-center font-bold font-mono focus:outline-none focus:border-[#722F37]" 
                        />
                      </div>

                      <div className="col-span-3 md:col-span-2">
                        <label className="text-[8px] font-bold text-slate-400 block mb-0.5 uppercase" title="Maximum 20 marks">2nd CA (0-20)</label>
                        <input 
                          type="number" 
                          min="0" 
                          max="20" 
                          value={newGradeCA2} 
                          onChange={(e)=>setNewGradeCA2(Number(e.target.value))} 
                          className="w-full text-xs p-1.5 border border-slate-200 rounded text-center font-bold font-mono focus:outline-none focus:border-[#722F37]" 
                        />
                      </div>

                      <div className="col-span-3 md:col-span-2">
                        <label className="text-[8px] font-bold text-slate-400 block mb-0.5 uppercase" title="Maximum 60 marks">Exam (0-60)</label>
                        <input 
                          type="number" 
                          min="0" 
                          max="60" 
                          value={newGradeExam} 
                          onChange={(e)=>setNewGradeExam(Number(e.target.value))} 
                          className="w-full text-xs p-1.5 border border-slate-200 rounded text-center font-bold font-mono focus:outline-none focus:border-[#722F37]" 
                        />
                      </div>

                      <div className="col-span-3 md:col-span-2">
                        <label className="text-[8px] font-bold text-slate-400 block mb-0.5 uppercase">Total (100)</label>
                        <div className="w-full text-xs p-1.5 border border-purple-200 bg-purple-50 text-purple-900 rounded text-center font-black font-mono">
                          {newGradeCA1 + newGradeCA2 + newGradeExam}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button 
                        type="button" 
                        onClick={()=>{
                          if (gradeSubjectList.some(item => item.subject.toLowerCase() === newGradeSubject.toLowerCase())) {
                            setGradeError(`Subject '${newGradeSubject}' is already graded in this draft sheet.`);
                            return;
                          }
                          const calculatedScore = newGradeCA1 + newGradeCA2 + newGradeExam;
                          if (calculatedScore > 100 || calculatedScore < 0) {
                            setGradeError("Scores total must be between 0 and 100%. Please verify CA1, CA2, and Exam metrics.");
                            return;
                          }
                          setGradeError(null);
                          setGradeSubjectList([
                            ...gradeSubjectList, 
                            { 
                              subject: newGradeSubject, 
                              score: calculatedScore,
                              ca1: newGradeCA1,
                              ca2: newGradeCA2,
                              exam: newGradeExam
                            }
                          ]);
                        }}
                        className="bg-emerald-600 hover:bg-[#722F37] text-white text-[10px] font-extrabold uppercase py-1.5 px-3 rounded transition cursor-pointer flex items-center gap-1"
                      >
                        ➕ Add Subject Score
                      </button>
                    </div>

                    {/* Temporary entries display */}
                    {gradeSubjectList.length > 0 ? (
                      <div className="mt-2 overflow-hidden rounded border border-slate-100 font-mono text-[10px]">
                        <div className="bg-slate-50 p-1.5 text-slate-500 font-bold uppercase tracking-wider flex justify-between font-sans">
                          <span>Draft Subjects Checklist</span>
                          <span>{gradeSubjectList.length} items</span>
                        </div>
                        <div className="divide-y divide-slate-100 bg-white">
                          {gradeSubjectList.map((item, idx) => {
                            // Enforce visual indicator of class requirement rules on drafts
                            const isSenior = editClass.startsWith("SSS");
                            const isJunior = editClass.startsWith("JSS");
                            const isGrade = editClass.startsWith("Grade");
                            let isGeneralOfClass = false;
                            
                            if (["English Language", "English", "Mathematics", "Civic Education", "Biology", "Further Mathematics", "Further Maths", "Economics"].includes(item.subject)) {
                              isGeneralOfClass = true; // general for every class
                            } else if (isSenior && ["Yoruba", "CCA", "Nigerian History", "Literature in English", "Physics", "Chemistry", "Financial Accounting", "Commerce"].includes(item.subject)) {
                              isGeneralOfClass = true;
                            } else if (isJunior && ["Yoruba", "Basic Science", "Social Studies", "Nigerian History"].includes(item.subject)) {
                              isGeneralOfClass = true;
                            } else if (isGrade && ["Basic Science & Technology", "Social Studies", "Nigerian History", "Home Economics", "Fine Arts", "CCA"].includes(item.subject)) {
                              isGeneralOfClass = true;
                            }

                            return (
                              <div key={idx} className="p-2 flex justify-between items-center hover:bg-slate-50">
                                <span className="font-sans text-slate-800 font-semibold text-xs">
                                  {item.subject} 
                                  {isGeneralOfClass && (
                                    <span className="text-[8px] ml-1 bg-[#722F37]/10 text-[#722F37] border border-[#722F37]/20 px-1 py-0.5 rounded uppercase font-black font-sans">Core General</span>
                                  )}
                                </span>
                                <div className="flex items-center space-x-3 text-right">
                                  <div className="text-[9px] text-slate-400 font-mono">
                                    CA1: <span className="text-slate-600 font-semibold">{item.ca1 !== undefined ? item.ca1 : '-'}</span> • 
                                    CA2: <span className="text-slate-600 font-semibold">{item.ca2 !== undefined ? item.ca2 : '-'}</span> • 
                                    Exam: <span className="text-slate-600 font-semibold">{item.exam !== undefined ? item.exam : '-'}</span>
                                  </div>
                                  <span className="font-extrabold text-indigo-900 font-mono text-xs">{item.score}%</span>
                                  <button 
                                    type="button" 
                                    onClick={() => setGradeSubjectList(gradeSubjectList.filter((_, i) => i !== idx))} 
                                    className="text-rose-600 hover:text-white hover:bg-rose-650 p-1 rounded transition text-[11px]"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-400 italic text-center p-1.5 font-sans">No subject score additions added yet in this draft document.</p>
                    )}
                  </div>

                  {/* Submission triggers */}
                  <div className="flex justify-between items-center pt-1 flex-wrap gap-2">
                    <button 
                      type="button" 
                      onClick={() => {
                        // Prepopulate the draft with core general subjects based on class level (Senior/Junior/Grade)
                        const isSenior = editClass.startsWith("SSS");
                        const isJunior = editClass.startsWith("JSS");
                        const isGrade = editClass.startsWith("Grade");
                        
                        const defaults = [{ subject: 'English Language', score: 75, ca1: 15, ca2: 15, exam: 45 }];
                        if (isSenior) {
                          defaults.push(
                            { subject: 'Mathematics', score: 80, ca1: 16, ca2: 16, exam: 48 },
                            { subject: 'Yoruba', score: 65, ca1: 13, ca2: 12, exam: 40 },
                            { subject: 'Civic Education', score: 82, ca1: 16, ca2: 16, exam: 50 },
                            { subject: 'CCA', score: 80, ca1: 16, ca2: 16, exam: 48 },
                            { subject: 'Nigerian History', score: 75, ca1: 15, ca2: 15, exam: 45 }
                          );
                        } else if (isJunior) {
                          defaults.push(
                            { subject: 'Mathematics', score: 75, ca1: 15, ca2: 15, exam: 45 },
                            { subject: 'Basic Science', score: 78, ca1: 15, ca2: 15, exam: 48 },
                            { subject: 'Social Studies', score: 80, ca1: 16, ca2: 16, exam: 48 },
                            { subject: 'Yoruba', score: 70, ca1: 14, ca2: 14, exam: 42 },
                            { subject: 'Civic Education', score: 75, ca1: 15, ca2: 15, exam: 45 },
                            { subject: 'Nigerian History', score: 78, ca1: 15, ca2: 15, exam: 48 }
                          );
                        } else if (isGrade) {
                          defaults.push(
                            { subject: 'Mathematics', score: 80, ca1: 16, ca2: 16, exam: 48 },
                            { subject: 'Basic Science & Technology', score: 85, ca1: 17, ca2: 17, exam: 51 },
                            { subject: 'Social Studies', score: 78, ca1: 15, ca2: 15, exam: 48 },
                            { subject: 'Nigerian History', score: 85, ca1: 17, ca2: 17, exam: 51 },
                            { subject: 'Civic Education', score: 80, ca1: 16, ca2: 16, exam: 48 },
                            { subject: 'Home Economics', score: 75, ca1: 15, ca2: 15, exam: 45 },
                            { subject: 'Fine Arts', score: 80, ca1: 16, ca2: 16, exam: 48 },
                            { subject: 'CCA', score: 82, ca1: 16, ca2: 16, exam: 50 }
                          );
                        } else {
                          defaults.push({ subject: 'Mathematics', score: 80, ca1: 16, ca2: 16, exam: 48 });
                        }
                        setGradeSubjectList(defaults);
                      }}
                      className="bg-slate-100 hover:bg-[#111C24] hover:text-white text-slate-700 text-[10px] uppercase font-bold py-1.5 px-3 rounded-lg border border-slate-200 transition"
                    >
                      🚀 Auto-Fill Core General Drafts
                    </button>

                    <button 
                      type="button"
                      onClick={handleGradeSubmit}
                      className="inline-flex items-center gap-1 bg-[#722F37] hover:bg-slate-900 text-white font-black text-xs px-5 py-2.5 rounded-xl transition cursor-pointer"
                    >
                      📄 Save &amp; Certify Grade Sheet
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION C: SHOW CURRENTLY KNOWN RESULTS FOR THIS SPECIFIC STUDENT */}
              <div className="space-y-3 border-t border-slate-100 pt-4 font-sans">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">C. Graded Scorecards Collection Sheets ({db ? db.results.filter(r => r.studentName.trim().toLowerCase() === gradingStudent.name.trim().toLowerCase()).length : 0})</h4>
                
                {db && db.results.filter(r => r.studentName.trim().toLowerCase() === gradingStudent.name.trim().toLowerCase()).length > 0 ? (
                  <div className="space-y-2.5 font-mono text-[10px]">
                    {db.results
                      .filter(r => r.studentName.trim().toLowerCase() === gradingStudent.name.trim().toLowerCase())
                      .map((resItem) => {
                        const sumScores = resItem.subjects.reduce((sum, sub) => sum + sub.score, 0);
                        const avgScore = resItem.subjects.length > 0 ? (sumScores / resItem.subjects.length).toFixed(1) : '0';
                        return (
                          <div key={resItem.id} className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                            <div className="flex justify-between items-center flex-wrap gap-1">
                              <div>
                                <span className="font-bold text-slate-800 text-[11px] block font-sans">{resItem.examType}</span>
                                <span className="text-[9px] bg-indigo-50 border border-indigo-150 text-indigo-800 px-1.5 py-0.5 rounded font-bold uppercase tracking-widest font-mono">CODE: {resItem.examCode}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-black text-[#722F37] leading-none block">{avgScore}% AVG</span>
                                <button 
                                  onClick={()=>deleteResult(resItem.id)} 
                                  className="text-rose-600 hover:underline hover:text-[#722F37] text-[9px] font-bold block mt-1"
                                >
                                  Recall Certificate
                                </button>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {resItem.subjects.map((s, sIdx) => {
                                let badgeColor = "bg-stone-100 text-stone-700";
                                if (s.score >= 75) badgeColor = "bg-emerald-50 text-emerald-850 border-emerald-200 border";
                                else if (s.score >= 50) badgeColor = "bg-sky-50 text-sky-850 border-sky-150 border";
                                else badgeColor = "bg-rose-50 text-rose-800 border-rose-150 border";
                                return (
                                  <span key={sIdx} className={`px-2 py-0.5 rounded text-[9px] font-medium font-sans ${badgeColor}`}>
                                    {s.subject}: <strong>{s.score}%</strong>
                                  </span>
                                );
                              })}
                            </div>
                            <p className="text-[9px] text-slate-400 italic">" {resItem.remark} "</p>
                          </div>
                        );
                      })
                    }
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-400 italic text-center p-4 bg-slate-50 rounded-xl">No published scorecard reports found on active databases matching this name.</p>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-4 shrink-0 flex justify-end border-t border-slate-100 font-sans">
              <button 
                type="button" 
                onClick={() => setIsEditGradeModalOpen(false)}
                className="bg-slate-205 bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold text-[#111C24] text-xs px-5 py-2.5 rounded-xl transition"
              >
                Close Registry Editor
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Student Deletion / Left Registry Confirmation Modal */}
      {studentToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn font-sans">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-slate-100 flex flex-col transform transition-all animate-scaleUp">
            
            <div className="p-6 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-50 text-rose-600 mb-2">
                <Trash2 className="w-6 h-6" />
              </div>
              
              <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">
                Log Student as Having Left?
              </h3>
              
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to log <strong className="text-slate-800 font-bold">{studentToDelete.name}</strong> ({studentToDelete.email}) as having <strong className="text-slate-900 font-bold">Left</strong> the school?
              </p>
              
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-[10px] text-slate-600 text-left space-y-1 font-mono">
                <span className="font-bold text-[#722F37] uppercase block text-[9px] tracking-wider font-sans mb-1">RECOVERY INFORMATION</span>
                • They will be removed from the active register and lists.<br />
                • All historical data and score sheets will remain preserved.<br />
                • You can restore them back anytime at the <span className="font-bold">Scholar Re-entry & Reactivation Desk</span> using their ID: <span className="font-bold select-all bg-amber-50 px-1 rounded">{studentToDelete.id}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel / Keep Student
              </button>
              <button
                type="button"
                onClick={() => deleteStudent(studentToDelete.id)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-lg transition cursor-pointer flex items-center gap-1.5"
              >
                🗑️ Log Student as Left
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
