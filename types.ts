/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export interface QuizQuestion {
  id: string; // "question-1", etc
  question: string;
  options: string[]; // 4 options
  correctIndex: number; // 0 to 3
  explanation: string;
}

export interface QuizOption {
  value: string;
  label: string; // "A", "B", "C", "D"
}

export interface ClassCurriculum {
  className: string;
  level: 'primary' | 'junior_secondary' | 'senior_secondary';
  subjects: {
    name: string;
    topics: string[];
    description: string;
  }[];
}

export interface Department {
  name: string;
  description: string;
  subjects: {
    name: string;
    description: string;
    curriculumLink?: string;
  }[];
}

// --- Extended Database Schemas for Full-Stack Synchronization ---

export interface CourseMaterial {
  id: string;
  class: string;
  subject: string;
  title: string;
  description: string;
  url: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  class: string;
  department: string;
  email: string;
  status?: 'Active' | 'Left';
}

export interface StudentResult {
  id: string;
  studentName: string;
  examCode: string;
  examType: string;
  subjects: { subject: string; score: number; ca1?: number; ca2?: number; exam?: number }[];
  remark: string;
}

export interface AdmissionApplication {
  id: string;
  fullName: string;
  email: string;
  desiredClass: string;
  lastSchool: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Declined';
  dateApplied: string;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  category: string;
}

export interface AiActivityLog {
  id: string;
  timestamp: string;
  studentName: string;
  subject: string;
  queryText: string;
  responsePreview: string;
}

export interface SchoolEvent {
  id: string;
  name: string;
  description: string;
  date: string;
}

export interface DatabaseSchema {
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
