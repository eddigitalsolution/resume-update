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
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white text-black w-full overflow-visible relative font-serif">
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0.8cm 1cm;
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
            page-break-inside: auto !important;
            break-inside: auto !important;
            margin-bottom: 0.8rem;
          }
          h2 {
            page-break-after: avoid;
            break-after: avoid;
          }
          .experience-item, .project-item {
            page-break-inside: avoid;
            break-inside: avoid;
            margin-bottom: 0.6rem;
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
          className="bg-black text-white px-5 py-2 rounded-full text-xs font-bold shadow-xl flex items-center gap-2 hover:bg-zinc-800 transition-colors"
        >
          Print / Save PDF
        </button>
      </div>

      <div className="max-w-[21cm] mx-auto p-4 md:p-6 text-black leading-snug">
        {/* Header: Name at 18pt */}
        <div className="flex items-center gap-5 border-b-2 border-black pb-3 mb-4">
          {data.photo_url && (
            <div className="h-16 w-16 rounded-full overflow-hidden border border-black/10 shrink-0">
              <img src={data.photo_url} alt={data.full_name} className="h-full w-full object-cover" />
            </div>
          )}
          <div className="flex-1 text-center">
            <h1 className="text-[18pt] font-bold uppercase tracking-tight mb-1">{data.full_name}</h1>
            <div className="text-[10pt] flex flex-wrap justify-center gap-x-2.5 gap-y-0.5 text-gray-800 font-sans font-medium">
              <span>{data.role}</span>
              <span>•</span>
              <span>{data.location}</span>
              <span>•</span>
              <span>{data.email}</span>
              <span>•</span>
              <span>{data.phone}</span>
              {data.website_url && (
                <>
                  <span>•</span>
                  <span>{data.website_url}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-4">
          {/* Summary */}
          {data.summary && (
            <section className="mb-3">
              <h2 className="text-[12pt] font-bold uppercase border-b border-black mb-1.5 py-0.5 tracking-wider font-sans">Professional Summary</h2>
              <p className="text-[10pt] leading-relaxed text-gray-900">{data.summary}</p>
            </section>
          )}

          {/* Work Experience */}
          {data.experience && data.experience.length > 0 && (
            <section className="mb-3">
              <h2 className="text-[12pt] font-bold uppercase border-b border-black mb-2 py-0.5 tracking-wider font-sans">Work Experience</h2>
              <div className="space-y-2.5">
                {data.experience.map((exp: Experience, i: number) => (
                  <div key={i} className="experience-item">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="text-[10.5pt] font-bold">{exp.company}</h3>
                      <span className="text-[10pt] italic font-sans">{exp.period}</span>
                    </div>
                    <p className="text-[10pt] font-bold italic mb-1 font-sans text-gray-800">{exp.role}</p>
                    <ul className="list-disc ml-4 space-y-0.5">
                      {exp.desc?.map((d: string, j: number) => (
                        <li key={j} className="text-[10pt] leading-relaxed text-gray-800">{d}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects Duality Split */}
          {(() => {
            const projects = data.featured_projects || [];
            if (projects.length === 0) return null;

            const sections = [
              { label: "Freelance Success", type: "Freelance" },
              { label: "Engineering Portfolio", type: "Portfolio" }
            ];

            return sections.map((section) => {
              const sectionProjects = projects.filter((p: Project) => {
                if (p.type === section.type) return true;
                if (!p.type && section.type === 'Portfolio') return true;
                return false;
              });

              if (sectionProjects.length === 0) return null;

              return (
                <section key={section.type} className="mb-3">
                  <h2 className="text-[12pt] font-bold uppercase border-b border-black mb-2 py-0.5 tracking-wider font-sans">{section.label}</h2>
                  <div className="space-y-2">
                    {sectionProjects.map((p: Project, i: number) => (
                      <div key={i} className="project-item">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <h3 className="text-[10.5pt] font-bold">{p.title}</h3>
                          <span className="text-[10pt] italic font-sans">{p.category}</span>
                        </div>
                        {p.tech_stack && p.tech_stack.length > 0 && (
                          <p className="text-[9.5pt] font-bold italic mb-0.5 font-sans text-gray-700">Tech: {p.tech_stack.join(", ")}</p>
                        )}
                        <p className="text-[10pt] leading-relaxed text-gray-800">{p.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              );
            });
          })()}

          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <section className="mb-3">
              <h2 className="text-[12pt] font-bold uppercase border-b border-black mb-1.5 py-0.5 tracking-wider font-sans">Technical Skills</h2>
              <p className="text-[10pt] leading-relaxed text-gray-900 font-medium">
                {data.skills.filter(s => s && s.trim() !== "").join(" • ")}
              </p>
            </section>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <section className="mb-3">
              <h2 className="text-[12pt] font-bold uppercase border-b border-black mb-2 py-0.5 tracking-wider font-sans">Education</h2>
              <div className="space-y-1.5">
                {data.education.map((edu: Education, i: number) => (
                  <div key={i} className="flex justify-between items-baseline">
                    <div>
                      <h3 className="text-[10.5pt] font-bold">{edu.school}</h3>
                      <p className="text-[10pt] italic font-sans">{edu.degree}</p>
                    </div>
                    <span className="text-[10pt] font-sans">{edu.period}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
