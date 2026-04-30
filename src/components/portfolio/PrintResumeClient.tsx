"use client";

import { useEffect } from "react";
import type { ResumeData, Project, Experience, Education } from "@/types";

interface PrintData extends Omit<ResumeData, 'id'> {
  featured_projects?: Project[];
}

export function PrintResumeClient({ data }: { data: PrintData }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white text-black w-full overflow-visible relative">
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 1.5cm;
          }
          body {
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            overflow: visible !important;
            height: auto !important;
          }
          .no-print {
            display: none !important;
          }
          section {
            page-break-inside: avoid;
            break-inside: avoid;
            margin-bottom: 2.5rem; /* Increased spacing for better 2-page flow */
          }
          h2 {
            page-break-after: avoid;
            break-after: avoid;
          }
          /* Ensure no individual item inside a section gets split */
          .experience-item, .project-item {
            page-break-inside: avoid;
            break-inside: avoid;
            margin-bottom: 1.5rem;
          }
        }
        body {
          background-color: white;
          color: black;
        }
      `}</style>

      {/* Manual print button for non-auto triggers */}
      <div className="no-print fixed top-4 right-4 z-50">
        <button 
          onClick={() => window.print()}
          className="bg-black text-white px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 hover:bg-zinc-800 transition-colors"
        >
          Print / Save PDF
        </button>
      </div>

      <div className="max-w-[21cm] mx-auto p-4 md:p-8 font-serif">
        <div className="flex items-center gap-8 border-b-2 border-black pb-6 mb-8">
          {data.photo_url && (
            <div className="h-24 w-24 rounded-full overflow-hidden border border-black/10 shrink-0">
              <img src={data.photo_url} alt={data.full_name} className="h-full w-full object-cover" />
            </div>
          )}
          <div className="flex-1 text-center">
            <h1 className="text-3xl font-bold uppercase tracking-tight mb-2">{data.full_name}</h1>
            <div className="text-[11pt] flex flex-wrap justify-center gap-x-3 gap-y-1 text-gray-800 font-sans font-medium">
              <span>{data.role}</span>
              <span>|</span>
              <span>{data.location}</span>
              <span>|</span>
              <span>{data.email}</span>
              <span>|</span>
              <span>{data.phone}</span>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {/* Summary */}
          <section>
            <h2 className="text-[12pt] font-bold uppercase border-b border-black mb-3 py-1 tracking-wider font-sans">Professional Summary</h2>
            <p className="text-[10pt] leading-relaxed text-gray-900">{data.summary}</p>
          </section>

          {/* Experience */}
          <section>
            <h2 className="text-[12pt] font-bold uppercase border-b border-black mb-4 py-1 tracking-wider font-sans">Work Experience</h2>
            <div className="space-y-6">
              {data.experience?.map((exp: Experience, i: number) => (
                <div key={i} className="experience-item">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-[11pt] font-bold">{exp.company}</h3>
                    <span className="text-[10pt] italic font-sans">{exp.period}</span>
                  </div>
                  <p className="text-[10pt] font-bold italic mb-2 font-sans">{exp.role}</p>
                  <ul className="list-disc ml-5 space-y-1.5">
                    {exp.desc?.map((d: string, j: number) => (
                      <li key={j} className="text-[10pt] leading-relaxed text-gray-800">{d}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Projects Duality Split */}
          {(() => {
            const projects = data.featured_projects || [];
            if (projects.length === 0) return null;

            // Group projects by type, providing a fallback for uncategorized items
            const sections = [
              { label: "Freelance Success", type: "Freelance" },
              { label: "Engineering Portfolio", type: "Portfolio" }
            ];

            return sections.map((section) => {
              const sectionProjects = projects.filter((p: Project) => {
                // Return projects that match the type exactly
                if (p.type === section.type) return true;
                // If a project has no type, default it to Portfolio for now
                if (!p.type && section.type === 'Portfolio') return true;
                return false;
              });

              if (sectionProjects.length === 0) return null;

              return (
                <section key={section.type}>
                  <h2 className="text-[12pt] font-bold uppercase border-b border-black mb-4 py-1 tracking-wider font-sans">{section.label}</h2>
                  <div className="space-y-4">
                    {sectionProjects.map((p: Project, i: number) => (
                      <div key={i} className="project-item">
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="text-[11pt] font-bold">{p.title}</h3>
                          <span className="text-[10pt] italic font-sans">{p.category}</span>
                        </div>
                        <p className="text-[10pt] font-bold italic mb-1 font-sans">Tech Stack: {p.tech_stack?.join(", ") || "Various"}</p>
                        <p className="text-[10pt] leading-relaxed text-gray-800">{p.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              );
            });
          })()}

          {/* Skills */}
          <section>
            <h2 className="text-[12pt] font-bold uppercase border-b border-black mb-3 py-1 tracking-wider font-sans">Technical Skills</h2>
            <p className="text-[10pt] leading-relaxed text-gray-900 font-medium">
              {data.skills?.join(" • ")}
            </p>
          </section>

          {/* Education */}
          <section>
            <h2 className="text-[12pt] font-bold uppercase border-b border-black mb-4 py-1 tracking-wider font-sans">Education</h2>
            <div className="space-y-4">
              {data.education?.map((edu: Education, i: number) => (
                <div key={i} className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-[11pt] font-bold">{edu.school}</h3>
                    <p className="text-[10pt] italic font-sans">{edu.degree}</p>
                  </div>
                  <span className="text-[10pt] font-sans">{edu.period}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-100 text-center no-print text-[8pt] text-gray-400 font-sans">
          Generated via Portfolio Admin &bull; 2026
        </div>
      </div>
    </div>
  );
}
