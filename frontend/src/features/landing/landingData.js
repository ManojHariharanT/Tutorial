export const categoryMenuItems = [
  "Python",
  "Java",
  "JavaScript",
  "C++",
  "React",
  "Node.js",
  "SQL",
  "System Design",
  "Data Structures",
  "Algorithms",
  "Machine Learning",
  "DevOps",
  "Linux",
  "Git & GitHub",
  "Cloud",
  "MongoDB",
];

export const heroHighlights = [
  {
    id: "feature-hot",
    badge: "HOT",
    icon: "🔥",
    title: "Interview Sprint",
    description: "Targeted company-tagged problems, fast revision notes, and acceptance benchmarks.",
    cta: "Open problem sets",
    href: "#coding-problems",
  },
  {
    id: "feature-ai",
    badge: "AI",
    icon: "🤖",
    title: "AI Pairing Lab",
    description: "Prompt-ready code helpers, debugging drills, and structured solution reviews.",
    cta: "Explore AI workflows",
    href: "#developer-toolbox",
  },
  {
    id: "feature-new",
    badge: "NEW",
    icon: "🧠",
    title: "Pattern Atlas",
    description: "Compare linked lists, trees, graphs, and hashmap tactics in one scannable hub.",
    cta: "Browse patterns",
    href: "#topic-grid",
  },
  {
    id: "feature-pro",
    badge: "PRO",
    icon: "💼",
    title: "Career Track",
    description: "Course lanes for full-stack, backend, and ML engineers with project-driven checkpoints.",
    cta: "View premium tracks",
    href: "#tutorial-library",
  },
];

export const topicCards = [
  { id: "arrays", name: "Arrays", problemCount: 148, difficulty: "Easy", accent: "#27ae60" },
  { id: "strings", name: "Strings", problemCount: 122, difficulty: "Easy", accent: "#2ecc71" },
  { id: "trees", name: "Trees", problemCount: 94, difficulty: "Medium", accent: "#f39c12" },
  { id: "graphs", name: "Graphs", problemCount: 67, difficulty: "Hard", accent: "#e74c3c" },
  { id: "dp", name: "Dynamic Programming", problemCount: 89, difficulty: "Hard", accent: "#e74c3c" },
  { id: "linked-lists", name: "Linked Lists", problemCount: 73, difficulty: "Easy", accent: "#27ae60" },
  { id: "heaps", name: "Heaps", problemCount: 44, difficulty: "Medium", accent: "#f39c12" },
  { id: "system-design", name: "System Design", problemCount: 36, difficulty: "Hard", accent: "#e74c3c" },
  { id: "sql", name: "SQL", problemCount: 58, difficulty: "Medium", accent: "#f39c12" },
  { id: "recursion", name: "Recursion", problemCount: 51, difficulty: "Medium", accent: "#f39c12" },
];

export const companyFilters = ["All", "Google", "Amazon", "Meta", "Microsoft", "Netflix", "Adobe"];

export const codingProblems = [
  {
    id: 1,
    name: "Two Sum",
    difficulty: "Easy",
    topics: ["Array", "Hash Map"],
    companies: ["Google", "Amazon", "Meta"],
  },
  {
    id: 2,
    name: "Merge Sorted Lists",
    difficulty: "Easy",
    topics: ["Linked List", "Recursion"],
    companies: ["Microsoft", "Amazon"],
  },
  {
    id: 3,
    name: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    topics: ["Tree", "BFS"],
    companies: ["Meta", "Adobe"],
  },
  {
    id: 4,
    name: "LRU Cache",
    difficulty: "Medium",
    topics: ["Design", "Hash Map"],
    companies: ["Google", "Netflix"],
  },
  {
    id: 5,
    name: "Word Ladder",
    difficulty: "Hard",
    topics: ["Graph", "BFS"],
    companies: ["Amazon", "Meta"],
  },
  {
    id: 6,
    name: "Kth Largest Element",
    difficulty: "Medium",
    topics: ["Heap", "Array"],
    companies: ["Microsoft", "Google"],
  },
  {
    id: 7,
    name: "Regular Expression Matching",
    difficulty: "Hard",
    topics: ["Dynamic Programming", "String"],
    companies: ["Google", "Adobe"],
  },
  {
    id: 8,
    name: "Valid Parentheses",
    difficulty: "Easy",
    topics: ["Stack", "String"],
    companies: ["Amazon", "Microsoft"],
  },
  {
    id: 9,
    name: "Course Schedule",
    difficulty: "Medium",
    topics: ["Graph", "Topological Sort"],
    companies: ["Meta", "Google"],
  },
  {
    id: 10,
    name: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    topics: ["Binary Search", "Array"],
    companies: ["Google", "Netflix"],
  },
];

export const tutorialTabs = [
  "Programming Languages",
  "Web Dev",
  "ML",
  "DevOps",
  "Databases",
];

export const tutorialLibrary = [
  { id: "python", title: "Python", category: "Programming Languages", lessons: 86, level: "Core", logo: "python" },
  { id: "java", title: "Java", category: "Programming Languages", lessons: 74, level: "Core", logo: "java" },
  { id: "javascript", title: "JavaScript", category: "Programming Languages", lessons: 92, level: "Core", logo: "javascript" },
  { id: "cplusplus", title: "C++", category: "Programming Languages", lessons: 68, level: "Core", logo: "cplusplus" },
  { id: "typescript", title: "TypeScript", category: "Web Dev", lessons: 48, level: "Applied", logo: "typescript" },
  { id: "react", title: "React", category: "Web Dev", lessons: 58, level: "Applied", logo: "react" },
  { id: "nodejs", title: "Node.js", category: "Web Dev", lessons: 46, level: "Applied", logo: "nodejs" },
  { id: "tensorflow", title: "TensorFlow", category: "ML", lessons: 39, level: "Advanced", logo: "tensorflow" },
  { id: "pytorch", title: "PyTorch", category: "ML", lessons: 34, level: "Advanced", logo: "pytorch" },
  { id: "docker", title: "Docker", category: "DevOps", lessons: 31, level: "Applied", logo: "docker" },
  { id: "git", title: "Git", category: "DevOps", lessons: 25, level: "Core", logo: "git" },
  { id: "linux", title: "Linux", category: "DevOps", lessons: 41, level: "Core", logo: "linux" },
  { id: "mongodb", title: "MongoDB", category: "Databases", lessons: 29, level: "Applied", logo: "mongodb" },
  { id: "postgresql", title: "PostgreSQL", category: "Databases", lessons: 35, level: "Applied", logo: "postgresql" },
];

export const toolboxItems = [
  { id: "resume", label: "AI Resume Builder", icon: "CV", href: "#developer-toolbox" },
  { id: "whiteboard", label: "Whiteboard", icon: "WB", href: "#developer-toolbox" },
  { id: "json", label: "JSON Editor", icon: "{}", href: "#developer-toolbox" },
  { id: "qr", label: "QR Generator", icon: "QR", href: "#developer-toolbox" },
  { id: "regex", label: "Regex Lab", icon: ".*", href: "#developer-toolbox" },
  { id: "diff", label: "Code Diff", icon: "</>", href: "#developer-toolbox" },
];

export const footerColumns = [
  {
    title: "Explore",
    links: ["Practice Code", "Compilers", "Articles", "Interview Prep"],
  },
  {
    title: "Programs",
    links: ["Courses", "Career Paths", "AI Tutorials", "DevOps Tracks"],
  },
  {
    title: "Resources",
    links: ["Community", "Jobs", "Docs", "Support"],
  },
];
