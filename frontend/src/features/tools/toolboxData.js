export const developerTools = [
  {
    id: "json-editor",
    name: "JSON Editor",
    category: "Formatter",
    description: "Format payloads, inspect parse errors, and validate structure in Monaco.",
    path: "/tools/json-editor",
    accent: "from-accent-400/24 to-brand-400/10",
  },
  {
    id: "regex-lab",
    name: "Regex Lab",
    category: "Tester",
    description: "Try patterns against sample text and review every captured result.",
    path: "/tools/regex-lab",
    accent: "from-gold-200/20 to-accent-400/10",
  },
  {
    id: "code-diff",
    name: "Code Diff",
    category: "Review",
    description: "Compare two snippets side by side with the Monaco diff editor.",
    path: "/tools/code-diff",
    accent: "from-brand-400/20 to-peach-200/10",
  },
  {
    id: "qr-generator",
    name: "QR Generator",
    category: "Utility",
    description: "Generate a scannable QR image for URLs, text, or local notes.",
    path: "/tools/qr-generator",
    accent: "from-success-300/20 to-accent-400/10",
  },
  {
    id: "whiteboard",
    name: "Whiteboard",
    category: "Sketch",
    description: "Draw diagrams and quick ideas in an embedded Excalidraw canvas.",
    path: "/tools/whiteboard",
    accent: "from-peach-200/18 to-brand-400/10",
  },
  {
    id: "resume-builder",
    name: "Resume Builder",
    category: "Builder",
    description: "Fill a focused resume form and preview the result live.",
    path: "/tools/resume-builder",
    accent: "from-gold-200/20 to-brand-400/10",
  },
];

export const getDeveloperToolById = (id) =>
  developerTools.find((tool) => tool.id === id) || developerTools[0];
