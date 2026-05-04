import { useState } from "react";
import Card, { CardContent, CardHeader, CardTitle } from "../../components/ui/Card.jsx";
import Input from "../../components/ui/Input.jsx";
import ToolShell from "./components/ToolShell.jsx";

const initialResume = {
  name: "Maya Srinivasan",
  title: "Frontend Developer",
  email: "maya@example.com",
  location: "Bengaluru, India",
  summary: "Frontend developer focused on React, accessible interfaces, and practical developer tooling.",
  skills: "React, JavaScript, Tailwind CSS, Node.js, Testing",
  experience:
    "Built reusable dashboard components for a learning platform.\nImproved API-driven workflows with loading, error, and fallback states.",
  education: "B.Tech Computer Science, 2024",
};

const ResumeBuilderTool = () => {
  const [resume, setResume] = useState(initialResume);

  const updateField = (field) => (event) => {
    setResume((current) => ({ ...current, [field]: event.target.value }));
  };

  const skills = resume.skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
  const experience = resume.experience.split("\n").filter(Boolean);

  return (
    <ToolShell
      description="Draft a compact resume from structured fields and preview the final shape as you type."
      title="Resume Builder"
    >
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Resume form</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <Input label="Name" onChange={updateField("name")} value={resume.name} />
            <Input label="Role title" onChange={updateField("title")} value={resume.title} />
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Email" onChange={updateField("email")} value={resume.email} />
              <Input label="Location" onChange={updateField("location")} value={resume.location} />
            </div>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Summary</span>
              <textarea className="form-input min-h-[7rem]" onChange={updateField("summary")} value={resume.summary} />
            </label>
            <Input label="Skills, comma separated" onChange={updateField("skills")} value={resume.skills} />
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Experience, one line per bullet</span>
              <textarea className="form-input min-h-[9rem]" onChange={updateField("experience")} value={resume.experience} />
            </label>
            <Input label="Education" onChange={updateField("education")} value={resume.education} />
          </CardContent>
        </Card>

        <Card className="bg-slate-100 text-slate-950">
          <CardContent className="space-y-6 p-8">
            <header className="border-b border-slate-300 pb-5">
              <h2 className="text-3xl font-bold text-slate-950">{resume.name || "Your Name"}</h2>
              <p className="mt-1 text-lg font-semibold text-slate-700">{resume.title || "Role title"}</p>
              <p className="mt-3 text-sm text-slate-600">
                {[resume.email, resume.location].filter(Boolean).join(" | ")}
              </p>
            </header>
            <section>
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">Summary</h3>
              <p className="mt-2 leading-7 text-slate-700">{resume.summary}</p>
            </section>
            <section>
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">Skills</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span className="rounded-full bg-slate-200 px-3 py-1 text-sm font-semibold text-slate-700" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </section>
            <section>
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">Experience</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
                {experience.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">Education</h3>
              <p className="mt-2 text-slate-700">{resume.education}</p>
            </section>
          </CardContent>
        </Card>
      </div>
    </ToolShell>
  );
};

export default ResumeBuilderTool;
