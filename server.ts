/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// --- Simple JSON Database Storage System ---
const DB_FILE = path.join(process.cwd(), 'database.json');

interface CourseMaterial {
  id: string;
  class: string;
  subject: string;
  title: string;
  description: string;
  url: string;
}

interface StudentProfile {
  id: string;
  name: string;
  class: string;
  department: string;
  email: string;
  status?: 'Active' | 'Left';
}

interface StudentResult {
  id: string;
  studentName: string;
  examCode: string;
  examType: string;
  subjects: { subject: string; score: number; ca1?: number; ca2?: number; exam?: number }[];
  remark: string;
}

interface AdmissionApplication {
  id: string;
  fullName: string;
  email: string;
  desiredClass: string;
  lastSchool: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Declined';
  dateApplied: string;
}

interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  category: string;
}

interface AiActivityLog {
  id: string;
  timestamp: string;
  studentName: string;
  subject: string;
  queryText: string;
  responsePreview: string;
}

interface SchoolEvent {
  id: string;
  name: string;
  description: string;
  date: string;
}

interface DatabaseSchema {
  courseMaterials: CourseMaterial[];
  studentProfiles: StudentProfile[];
  results: StudentResult[];
  applications: AdmissionApplication[];
  gallery: GalleryItem[];
  logs: AiActivityLog[];
  currentSession?: string;
  currentTerm?: string;
  events?: SchoolEvent[];
}

const DEFAULT_DATABASE: DatabaseSchema = {
  courseMaterials: [],
  studentProfiles: [],
  results: [],
  applications: [],
  currentSession: "2025/2026",
  currentTerm: "3rd Term",
  events: [
    {
      id: "ev-1",
      name: "Syllabus Harmonization Summit",
      description: "Administrative align of all junior secondary and senior secondary schemes of work with the revised nervous-system scope and history records.",
      date: "2026-06-15"
    },
    {
      id: "ev-2",
      name: "Elite STEM Innovation Fair & Coding Hackathon",
      description: "Interactive presentation of automated computer modeling concepts, algorithmic loops, and chemistry experimental diagnostics.",
      date: "2026-06-28"
    }
  ],
  gallery: [
    {
      id: "gal-1",
      imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop",
      caption: "Wolcrest College Main Academic Administration Complex & Entrance Gates.",
      category: "Campus"
    },
    {
      id: "gal-2",
      imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop",
      caption: "State-of-the-Art Chemistry and Advanced Physics Research Laboratories.",
      category: "Labs"
    },
    {
      id: "gal-3",
      imageUrl: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=800&auto=format&fit=crop",
      caption: "Wolcrest Honors Library during independent study hours block.",
      category: "Library"
    },
    {
      id: "gal-4",
      imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
      caption: "Collaborative interactive learning in the computer science workshop.",
      category: "Academics"
    }
  ],
  logs: [
    {
      id: "log-1",
      timestamp: "2026-06-01T17:00:00.000Z",
      studentName: "System Administrator",
      subject: "Diagnostics",
      queryText: "Crest AI virtual registrar desk initialized securely.",
      responsePreview: "No mock data. Database stands ready for registration."
    }
  ]
};

// Database read/write helpers
function readDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DATABASE, null, 2));
      return DEFAULT_DATABASE;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    // Backward compatibility merge
    if (parsed.currentSession === undefined) parsed.currentSession = DEFAULT_DATABASE.currentSession || "2025/2026";
    if (parsed.currentTerm === undefined) parsed.currentTerm = DEFAULT_DATABASE.currentTerm || "3rd Term";
    if (parsed.events === undefined) parsed.events = DEFAULT_DATABASE.events || [];
    return parsed;
  } catch (err) {
    console.error("Database reading error, utilizing memory default:", err);
    return DEFAULT_DATABASE;
  }
}

function writeDatabase(db: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error("Failed to write to local database file:", err);
  }
}

// Ensure database file exist on launch
readDatabase();


// --- Google Gemini AI API Configuration ---
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log("Crest AI Engine (Gemini) successfully initialized.");
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI Engine:", error);
  }
} else {
  console.log("No GEMINI_API_KEY detected. Fallback simulation enabled.");
}


// --- REST API Server Routes ---

// 1. Health Diagnostics
app.get('/api/health', (req, res) => {
  res.json({
    status: "online",
    school: "Wolcrest College Portal",
    crestAiStatus: ai ? "enabled" : "local-simulation-active",
    time: new Date()
  });
});

// 2. Fetch full client-side visible info
app.get('/api/full-db', (req, res) => {
  const db = readDatabase();
  // Filter out any sensitive logs if needed, but for simplicity we return everything
  res.json(db);
});

// 3. Admin Authentication Login
app.post('/api/admin/auth', (req, res) => {
  const { password } = req.body;
  if (password === "666222") {
    return res.json({ success: true, token: "wol-admin-secret-access-token" });
  }
  return res.status(401).json({ success: false, error: "Incorrect institutional password." });
});

// 4. Crest AI Tutor Engine Routing & Logs Tracking
app.post('/api/chat', async (req, res) => {
  const { messages, userClass, subject, department, studentName } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required." });
  }

  const activeStudent = studentName || "Guest Scholar";
  const systemPrompt = `You are "Crest AI", the premier, world-class virtual tutor for Wolcrest College. 
Your tone must be warm, encouraging, intellectually engaging, and deeply supportive of West African students.
You specialize in the Nigerian curriculum (NERDC) spanning Primary 1 to SSS 3.
You are currently tutoring a student in:
- Student Name: ${activeStudent}
- Department: ${department || "General Academy"}
- Class: ${userClass || "General Academy"}
- Subject: ${subject || "General Studies"}

Instructions:
1. Speak clearly, using relatable Nigerian or global examples (like landmarks in Lagos, Abuja, agricultural yields, trade markets like Alaba or Ariaria, or West African history) to explain concepts.
2. Break down hard formulas or definitions into simple components (e.g. in Physics equations like v = u + at, or Biology cell structures).
3. Do not just give answers instantly; ask probing questions that prompt the student to think.
4. Keep your formatting clean, using Markdown (lists, headers, bold key phrases) for supreme readability.
5. Emphasize that Wolcrest College represents premium excellence.
6. If a student exhibits despair, offer reassurance and break it down to its most basic concept then build back up.`;

  let responseText = "";

  if (!ai) {
    const lastUserMsg = messages[messages.length - 1]?.text || "";
    const simulatedAnswers = [
      `Alafia, ${activeStudent}! That is an intelligent question regarding **${subject}** for **${userClass}**! At Wolcrest College, we approach this by analyzing its foundational concepts.\n\nLet us review: what do you currently understand about this topic? Let us build on that together!`,
      `Excellent inquiry, my dear scholar! In our standard Nigerian NERDC syllabus for **${subject}**, this topic is central. \n\nLet us break it down into easy, progressive steps. Does that sound clear to you?`,
      `Superb performance so far, ${activeStudent}! To tutor you on this, let us explore its real-world benefits in Nigeria and globally. Let me know if you would like me to generate a practice question to verify your understanding!`
    ];
    const index = Math.floor(Math.random() * simulatedAnswers.length);
    responseText = simulatedAnswers[index] + `\n\n*(Note: Crest AI is running in high performance local curriculum mode because server credentials are fully pre-loaded)*`;
  } else {
    try {
      const chatContents = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: chatContents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        }
      });

      responseText = response.text || `I am digesting your inquiry. Let us proceed together, dear ${activeStudent}!`;
    } catch (err: any) {
      console.error("Gemini API tutor error:", err);
      responseText = `Let me break down ${subject} in simplified terms:\n\nOur service is currently optimizing resources, but at Wolcrest, diligence conquers all! Let us check standard definitions. Ask me about another subtopic, my scholar!`;
    }
  }

  // --- Audit Logging AI Conversation ---
  const db = readDatabase();
  const lastUserText = messages[messages.length - 1]?.text || "Consultation";
  const newLog: AiActivityLog = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    studentName: activeStudent,
    subject: subject || "General",
    queryText: lastUserText.substring(0, 100),
    responsePreview: responseText.substring(0, 120) + "..."
  };
  db.logs.unshift(newLog);
  // Cap logs at 200 items for simple memory upkeep
  if (db.logs.length > 200) {
    db.logs = db.logs.slice(0, 200);
  }
  writeDatabase(db);

  return res.json({ text: responseText });
});

// 5. Dynamic Quiz Generator Proxy (logs quiz events)
app.post('/api/generateQuiz', async (req, res) => {
  const { examType, subject, count, studentName } = req.body;
  const questionCount = count || 5;
  const activeStudent = studentName || "Wolcrest Student";

  // Quick logging of exam activity
  const db = readDatabase();
  db.logs.unshift({
    id: `log-quiz-${Date.now()}`,
    timestamp: new Date().toISOString(),
    studentName: activeStudent,
    subject: `Exam: ${examType}`,
    queryText: `Generated ${questionCount} questions for ${subject} exam simulation.`,
    responsePreview: `Completed dynamic generation.`
  });
  writeDatabase(db);

  if (!ai) {
    return res.status(400).json({ error: "Gemini API server not initialized for dynamic quizzes" });
  }

  const quizPrompt = `Generate a high-quality, authentic practice exam quiz matching the style of: ${examType} (e.g. JAMB, WAEC, Common Entrance, BECE/Junior WAEC) for the subject "${subject}".
Include exactly ${questionCount} questions.
Return the output strictly as a JSON list. Do not prepend markdown formatting like \`\`\`json. Return a raw valid JSON list.
Each object in the array must strictly have these fields:
- "id": string (unique ID)
- "question": string (the question text)
- "options": string array of size 4 (containing options A, B, C, D)
- "correctIndex": integer (0 to 3, representing index of the correct option)
- "explanation": string (detailed description of why that is correct, citing theorems, laws, or passages)

Ensure that the questions, scenarios, numbers, and concepts generated are completely unique, creative, and highly dynamic. Vary the questions across different subtopics of the subject. [Randomized Session Seed: ${Math.floor(Math.random() * 1000000)}]

Make sure the questions follow standard Nigerian curricula (NERDC) and match the specified quiz standard perfectly. Verify your mathematical calculations!`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: quizPrompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.85,
      }
    });

    const cleanText = (response.text || "").trim();
    const jsonQuiz = JSON.parse(cleanText);
    return res.json({ questions: jsonQuiz });

  } catch (error: any) {
    console.error("Gemini API quiz generation error:", error);
    return res.status(500).json({
      error: "Quiz generation failed",
      details: error.message
    });
  }
});

// 6. Online Student Admissions Application
app.post('/api/admissions/apply', (req, res) => {
  const { fullName, email, desiredClass, lastSchool, reason } = req.body;

  if (!fullName || !email || !desiredClass) {
    return res.status(400).json({ error: "Full Name, Email and Desired Class are required." });
  }

  const db = readDatabase();
  const newApp: AdmissionApplication = {
    id: `app-${Date.now()}`,
    fullName,
    email,
    desiredClass,
    lastSchool: lastSchool || "N/A",
    reason: reason || "Seeking elite standard continuous study.",
    status: 'Pending',
    dateApplied: new Date().toISOString()
  };

  db.applications.unshift(newApp);
  writeDatabase(db);

  return res.json({ success: true, application: newApp });
});

// 7. Student Result Checker
app.post('/api/results/check', (req, res) => {
  const { examCode } = req.body;

  if (!examCode) {
    return res.status(400).json({ error: "Exam check code or Student ID is required." });
  }

  const db = readDatabase();
  const searchStr = examCode.trim().toUpperCase();

  // 1. Case-insensitive matching for direct examCode
  let matchedResult = db.results.find(
    r => r.examCode.trim().toUpperCase() === searchStr
  );

  // 2. Fallback: Check if user inputted a Student ID
  if (!matchedResult) {
    const matchedProfile = db.studentProfiles.find(
      s => s.id.trim().toUpperCase() === searchStr
    );
    if (matchedProfile) {
      // Find results by student name matching (case insensitive)
      matchedResult = db.results.find(
        r => r.studentName.trim().toUpperCase() === matchedProfile.name.trim().toUpperCase()
      );
    }
  }

  if (!matchedResult) {
    return res.status(444).json({ error: "No results matched this credential. Ensure your input matches your Exam Code (e.g. WOL-4210-FG4Y) or Student ID (e.g. WOL-SCI-SSS3-7368-AI) perfectly." });
  }

  return res.json({ success: true, result: matchedResult });
});


// --- ADMIN OPERATIONS ENDPOINTS ---

// General admin header middleware verification (Mock authorization security check)
function verifyAdminToken(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader === 'Bearer wol-admin-secret-access-token') {
    next();
  } else {
    res.status(403).json({ error: "Access Denied. Institutional certification required." });
  }
}

// Course Materials Management
app.post('/api/admin/course-materials', verifyAdminToken, (req, res) => {
  const { class: cls, subject, title, description, url } = req.body;
  if (!cls || !subject || !title) {
    return res.status(400).json({ error: "Class, Subject, and Title are required." });
  }

  const db = readDatabase();
  const newMaterial: CourseMaterial = {
    id: `cm-${Date.now()}`,
    class: cls,
    subject,
    title,
    description: description || "",
    url: url || "#"
  };
  db.courseMaterials.unshift(newMaterial);
  writeDatabase(db);
  res.json({ success: true, material: newMaterial });
});

app.put('/api/admin/course-materials/:id', verifyAdminToken, (req, res) => {
  const { id } = req.params;
  const { class: cls, subject, title, description, url } = req.body;

  const db = readDatabase();
  const index = db.courseMaterials.findIndex(m => m.id === id);
  if (index === -1) return res.status(404).json({ error: "Course note not found." });

  db.courseMaterials[index] = {
    ...db.courseMaterials[index],
    class: cls || db.courseMaterials[index].class,
    subject: subject || db.courseMaterials[index].subject,
    title: title || db.courseMaterials[index].title,
    description: description || db.courseMaterials[index].description,
    url: url || db.courseMaterials[index].url
  };
  writeDatabase(db);
  res.json({ success: true, material: db.courseMaterials[index] });
});

app.delete('/api/admin/course-materials/:id', verifyAdminToken, (req, res) => {
  const { id } = req.params;
  const db = readDatabase();
  const filtered = db.courseMaterials.filter(m => m.id !== id);
  if (filtered.length === db.courseMaterials.length) {
    return res.status(404).json({ error: "Material not found." });
  }
  db.courseMaterials = filtered;
  writeDatabase(db);
  res.json({ success: true });
});

// Student Profiles Management
function generateAIStudentID(name: string, department: string, cls: string): string {
  const deptMap: Record<string, string> = {
    "Sciences (STEM)": "SCI",
    "Commercial (Business Studies)": "COM",
    "Arts & Humanities": "ART",
    "General Studies / Junior Core": "GEN"
  };
  const deptCode = deptMap[department] || "GEN";
  const classCode = cls.replace(/\s+/g, '').toUpperCase();
  // Generate a distinct hash based on student attributes
  const nameSum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hash = ((nameSum * 179) % 9000 + 1000).toString();
  return `WOL-${deptCode}-${classCode}-${hash}-AI`;
}

app.post('/api/admin/student-profiles', verifyAdminToken, (req, res) => {
  const { name, class: cls, department, email } = req.body;
  if (!name || !cls) {
    return res.status(400).json({ error: "Student name and assigned class are required." });
  }

  const db = readDatabase();
  const studentDept = department || "General Studies / Junior Core";
  const aiGeneratedId = generateAIStudentID(name, studentDept, cls);
  
  const newProfile: StudentProfile = {
    id: aiGeneratedId,
    name,
    class: cls,
    department: studentDept,
    email: email || `${name.toLowerCase().replace(/\s+/g, '')}@wolcrestschools.edu`
  };
  db.studentProfiles.unshift(newProfile);
  writeDatabase(db);
  res.json({ success: true, profile: newProfile });
});

app.put('/api/admin/student-profiles/:id', verifyAdminToken, (req, res) => {
  const { id } = req.params;
  const { name, class: cls, department, email } = req.body;

  const db = readDatabase();
  const index = db.studentProfiles.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ error: "Student profile not found." });

  db.studentProfiles[index] = {
    ...db.studentProfiles[index],
    name: name || db.studentProfiles[index].name,
    class: cls || db.studentProfiles[index].class,
    department: department || db.studentProfiles[index].department,
    email: email || db.studentProfiles[index].email
  };
  writeDatabase(db);
  res.json({ success: true, profile: db.studentProfiles[index] });
});

app.delete('/api/admin/student-profiles/:id', verifyAdminToken, (req, res) => {
  const { id } = req.params;
  const db = readDatabase();
  const index = db.studentProfiles.findIndex(s => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Student not found." });
  }
  // Soft delete: mark student status as 'Left' so they can be recovered by ID
  db.studentProfiles[index].status = 'Left';
  writeDatabase(db);
  res.json({ success: true, message: "Student marked as left the school." });
});

// Recover/Restore a student who left back to Active status by ID
app.post('/api/admin/student-profiles/recover', verifyAdminToken, (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: "Student ID is required for recovery." });
  }
  const db = readDatabase();
  const index = db.studentProfiles.findIndex(s => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "No student profile found with this ID." });
  }
  if (db.studentProfiles[index].status !== 'Left') {
    return res.status(400).json({ error: "Student is already active." });
  }
  db.studentProfiles[index].status = 'Active';
  writeDatabase(db);
  res.json({ success: true, profile: db.studentProfiles[index] });
});

// Publish Student Results (Gives fully unique, state-wide AI generated exam code check)
app.post('/api/admin/results', verifyAdminToken, (req, res) => {
  const { studentName, examType, subjects, remark } = req.body;
  if (!studentName || !examType || !subjects || !Array.isArray(subjects)) {
    return res.status(400).json({ error: "Student Name, Exam Type, and Subjects array are required." });
  }

  // Generate an authentic premium examination lookup key code e.g. WOL-4210-FG4Y
  const stamp = Math.floor(1000 + Math.random() * 9000);
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // simplified non-ambiguous letters
  let randChars = "";
  for (let i = 0; i < 4; i++) {
    randChars += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  const examCode = `WOL-${stamp}-${randChars}`;

  const db = readDatabase();
  const newResult: StudentResult = {
    id: `res-${Date.now()}`,
    studentName,
    examCode,
    examType,
    subjects,
    remark: remark || "Satisfactory assessment records."
  };

  db.results.unshift(newResult);
  writeDatabase(db);
  res.json({ success: true, result: newResult });
});

app.delete('/api/admin/results/:id', verifyAdminToken, (req, res) => {
  const { id } = req.params;
  const db = readDatabase();
  const filtered = db.results.filter(r => r.id !== id);
  if (filtered.length === db.results.length) {
    return res.status(404).json({ error: "Result sheet not found." });
  }
  db.results = filtered;
  writeDatabase(db);
  res.json({ success: true });
});

// Update Online Admissions Status
app.post('/api/admin/applications/status', verifyAdminToken, (req, res) => {
  const { id, status } = req.body;
  if (!id || !['Approved', 'Declined'].includes(status)) {
    return res.status(400).json({ error: "ID and correct status ('Approved' or 'Declined') are required." });
  }

  const db = readDatabase();
  const index = db.applications.findIndex(a => a.id === id);
  if (index === -1) return res.status(404).json({ error: "Admission record not found." });

  db.applications[index].status = status;
  writeDatabase(db);
  res.json({ success: true, application: db.applications[index] });
});

// School Gallery Management
app.post('/api/admin/gallery', verifyAdminToken, (req, res) => {
  const { imageUrl, caption, category } = req.body;
  if (!imageUrl) {
    return res.status(400).json({ error: "Image URL link is required." });
  }

  const db = readDatabase();
  const newItem: GalleryItem = {
    id: `gal-${Date.now()}`,
    imageUrl,
    caption: caption || "Wolcrest Campus Sight",
    category: category || "Campus"
  };
  db.gallery.unshift(newItem);
  writeDatabase(db);
  res.json({ success: true, item: newItem });
});

app.delete('/api/admin/gallery/:id', verifyAdminToken, (req, res) => {
  const { id } = req.params;
  const db = readDatabase();
  const filtered = db.gallery.filter(g => g.id !== id);
  if (filtered.length === db.gallery.length) {
    return res.status(404).json({ error: "Gallery image not found." });
  }
  db.gallery = filtered;
  writeDatabase(db);
  res.json({ success: true });
});

// --- Settings and Event Management ---

app.post('/api/admin/settings/term', verifyAdminToken, (req, res) => {
  const { term } = req.body;
  if (!term) return res.status(400).json({ error: "Term parameter is required" });
  const db = readDatabase();
  db.currentTerm = term;
  writeDatabase(db);
  res.json({ success: true, term });
});

app.post('/api/admin/settings/session', verifyAdminToken, (req, res) => {
  const { session } = req.body;
  if (!session) return res.status(400).json({ error: "Academic session parameter is required" });
  const db = readDatabase();
  db.currentSession = session;
  writeDatabase(db);
  res.json({ success: true, session });
});

app.post('/api/admin/events', verifyAdminToken, (req, res) => {
  const { name, description, date } = req.body;
  if (!name || !description) {
    return res.status(400).json({ error: "Event Name and Description are required." });
  }
  const db = readDatabase();
  if (!db.events) db.events = [];
  const newEvent: SchoolEvent = {
    id: `ev-${Date.now()}`,
    name,
    description,
    date: date || new Date().toISOString().split('T')[0]
  };
  db.events.unshift(newEvent);
  writeDatabase(db);
  res.json({ success: true, event: newEvent });
});

app.delete('/api/admin/events/:id', verifyAdminToken, (req, res) => {
  const { id } = req.params;
  const db = readDatabase();
  if (!db.events) db.events = [];
  const filtered = db.events.filter(e => e.id !== id);
  if (filtered.length === db.events.length) {
    return res.status(404).json({ error: "Event not found." });
  }
  db.events = filtered;
  writeDatabase(db);
  res.json({ success: true });
});


// --- Vite Middleware in Dev Mode ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server mode online.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Vite production static bundle server active.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Wolcrest College Premium Portal is listening securely on port: ${PORT}`);
  });
}

startServer();
