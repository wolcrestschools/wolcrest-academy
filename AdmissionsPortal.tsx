import React, { useState } from 'react';
import { 
  GraduationCap, 
  Send, 
  BookOpen, 
  CheckCircle, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function AdmissionsPortal() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [desiredClass, setDesiredClass] = useState('SSS 1');
  const [lastSchool, setLastSchool] = useState('');
  const [reason, setReason] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !desiredClass) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/admissions/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName,
          email,
          desiredClass,
          lastSchool,
          reason
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSuccessMessage(`Outstanding! Application submitted successfully. Reference ID: ${data.application.id}. Please keep an eye on your email for admissions interview dates.`);
        // Reset forms
        setFullName('');
        setEmail('');
        setLastSchool('');
        setReason('');
      } else {
        const err = await res.json();
        setErrorMessage(err.error || "Application submission failed.");
      }
    } catch (e) {
      setErrorMessage("Server communication error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="admissions-apply-screen" className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      
      {/* Introduction guidelines banner */}
      <div className="bg-gradient-to-r from-school-navy via-[#1E3A7A] to-school-wine text-white p-6 sm:p-8 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-6 w-6 text-[#FAF0E6]" />
          <h2 className="text-xl sm:text-2xl font-extrabold font-display uppercase tracking-wide">Wolcrest Online Admission Portal</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-150 text-slate-200 leading-relaxed max-w-3xl">
          Apply to Wolcrest College from the comfort of your home. We welcome transfer candidates and grade school scholars into all tiers (Grade 1-5, JSS 1-3, SSS 1-3).
        </p>
        
        <div className="p-3 bg-white/10 rounded-xl text-xs text-sky-200 border border-white/10">
          <strong>Elite Grade school Pacing:</strong> Continuing our commitment to agile scholarship, students in Grade 5 are permitted direct entry checks into JSS 1 secondary stream upon passing the National Common Entrance. There is no Grade 6 requirement!
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Form panel (col-span-8) */}
        <div className="md:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-extrabold text-slate-900 text-md uppercase tracking-wide border-b border-slate-100 pb-2 mb-6">
            Admissions Application Form
          </h3>

          {successMessage && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-450 text-slate-500 block mb-1">CANDIDATE FULL NAME *</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ibrahim Alao"
                  required
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-slate-55 bg-slate-50 text-slate-800 focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-450 text-slate-500 block mb-1">CONTACT EMAIL *</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. adebayo@mail.com"
                  required
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-slate-55 bg-slate-50 text-slate-800 focus:outline-none focus:border-indigo-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-450 text-slate-500 block mb-1">DESIRED ENTRY CLASS *</label>
                <select 
                  value={desiredClass}
                  onChange={(e) => setDesiredClass(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-slate-55 bg-slate-50 text-slate-800 focus:outline-none"
                >
                  <option value="Grade 1">Grade 1</option>
                  <option value="Grade 2">Grade 2</option>
                  <option value="Grade 3">Grade 3</option>
                  <option value="Grade 4">Grade 4</option>
                  <option value="Grade 5">Grade 5</option>
                  <option value="JSS 1">JSS 1 (Junior Secondary)</option>
                  <option value="JSS 2">JSS 2</option>
                  <option value="JSS 3">JSS 3</option>
                  <option value="SSS 1">SSS 1 (Senior Science/Arts/Comm)</option>
                  <option value="SSS 2">SSS 2</option>
                  <option value="SSS 3">SSS 3</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-450 text-slate-500 block mb-1">PREVIOUS SCHOOL &amp; ADDRESS</label>
                <input 
                  type="text" 
                  value={lastSchool}
                  onChange={(e) => setLastSchool(e.target.value)}
                  placeholder="e.g. Premier Academy, Port Harcourt"
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-slate-55 bg-slate-50 text-slate-800 focus:outline-none focus:border-indigo-400"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-450 text-slate-500 block mb-1">WHY DO YOU CHOOSE WOLCREST SCHOOLS? (ESSAY STATEMENT)</label>
              <textarea 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                placeholder="Declare details of your STEM, Arts, or Vocational aspirations. State if you intend to prepare for JAMB, BECE or WAEC."
                className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-slate-55 bg-slate-50 text-slate-800 focus:outline-none focus:border-indigo-400 font-sans"
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-school-wine hover:bg-school-wine-hover text-white font-black text-xs px-6 py-3 rounded-xl transition duration-150 flex items-center space-x-2 shadow-md cursor-pointer disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{isSubmitting ? "Uploading Documents..." : "Submit Candidate Application"}</span>
            </button>

          </form>
        </div>

        {/* Requirements and checklist panel (col-span-4) */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 shadow-inner">
            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wide">Application Requirements</h4>
            
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-school-wine mt-0.5 flex-shrink-0" />
                <span>Digitized passport photographs (to be provided at offline interview).</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-school-wine mt-0.5 flex-shrink-0" />
                <span>Last examination transcript card or BECE certified reference.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-school-wine mt-0.5 flex-shrink-0" />
                <span>Birth certificate or certified national declaration letter.</span>
              </li>
            </ul>
          </div>

          <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-200 space-y-3">
            <div className="flex items-center space-x-1 text-[#722F37]">
              <Sparkles className="h-4 w-4 animate-spin text-school-wine" />
              <h4 className="font-extrabold text-xs uppercase tracking-wide">Entrance Examination</h4>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Once approved, prospective students sit for an offline entrance general exam covering core Mathematics, Analytical English, and General Logic. Preparing can be completed using our **Crest AI tutor** directly on this portal!
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
