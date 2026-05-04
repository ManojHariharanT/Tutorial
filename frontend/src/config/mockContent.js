const tutorialSeeds = [
  {
    _id: "tutorial-js-foundations",
    title: "JavaScript Foundations",
    description: "Build confidence with variables, loops, functions, and array patterns.",
    category: "Frontend Core",
    difficulty: "Starter",
    duration: "42 min",
    lessons: 6,
    track: "JavaScript Core",
    author: "Platform Team",
    tags: ["Functions", "Arrays", "Control Flow"],
    learningObjectives: [
      "Break logic into reusable functions.",
      "Recognize array traversal patterns quickly.",
      "Translate problem statements into predictable outputs.",
    ],
    prerequisites: ["Comfort reading basic syntax", "A code editor and browser console"],
    sections: [
      {
        title: "Why small functions matter",
        content:
          "Learning platforms feel overwhelming when every exercise looks different. Small, composable functions reduce that cognitive load and make debugging practical.",
        bullets: [
          "Each function should answer one question.",
          "Return values should stay predictable.",
          "Naming matters because it becomes your mental model.",
        ],
      },
      {
        title: "Array reasoning",
        content:
          "Most beginner exercises are scans, transforms, or accumulations. Once you identify the pattern, implementation becomes much faster.",
        bullets: [
          "Use `map` for shape changes.",
          "Use `filter` for inclusion decisions.",
          "Use a running variable when you need aggregate state.",
        ],
      },
      {
        title: "From example to reusable solution",
        content:
          "Do not optimize for the first example. Optimize for the contract: inputs, outputs, and edge cases.",
      },
    ],
    challenge: {
      title: "Mini challenge",
      prompt: "Create a helper that returns the total of all positive numbers in an array.",
      starterCode:
        "function sumPositive(values) {\n  return values.filter((value) => value > 0).reduce((total, value) => total + value, 0);\n}\n\nconsole.log(sumPositive([-4, 3, 8, -1, 6]));",
    },
    languageExamples: [
      {
        language: "JavaScript",
        code: "const learners = ['Ada', 'Ravi', 'Mina'];\nconst shoutNames = (items) => items.map((item) => item.toUpperCase());\nconsole.log(shoutNames(learners));",
      },
      {
        language: "Python",
        code: "learners = ['Ada', 'Ravi', 'Mina']\n\ndef shout_names(items):\n    return [item.upper() for item in items]\n\nprint(shout_names(learners))",
      },
    ],
    trendingScore: "2.1k active learners",
  },
  {
    _id: "tutorial-async-patterns",
    title: "Async Workflows",
    description: "Handle promises, async functions, loading states, and failure paths cleanly.",
    category: "Runtime Systems",
    difficulty: "Intermediate",
    duration: "36 min",
    lessons: 5,
    track: "Modern JavaScript",
    author: "Runtime Lab",
    tags: ["Promises", "Fetch", "Error Handling"],
    learningObjectives: [
      "Differentiate sequential and parallel async work.",
      "Model optimistic, loading, and error states in UI.",
      "Keep async code readable under failure.",
    ],
    prerequisites: ["JavaScript syntax", "Basic API familiarity"],
    sections: [
      {
        title: "Promises are state containers",
        content:
          "A promise is not magic. It is just a container that will eventually settle into a value or error, and your UI should reflect both outcomes.",
      },
      {
        title: "Parallelize safely",
        content:
          "When requests do not depend on each other, run them together and reconcile the results later.",
        bullets: [
          "Use `Promise.allSettled` when partial failure is acceptable.",
          "Separate data orchestration from rendering.",
          "Always expose a useful fallback state.",
        ],
      },
      {
        title: "Readable retries",
        content:
          "A retry strategy is only helpful if the user understands what failed and what happens next.",
      },
    ],
    challenge: {
      title: "Mini challenge",
      prompt: "Fetch three resources in parallel and return only the successful payloads.",
      starterCode:
        "async function loadResources(tasks) {\n  const results = await Promise.allSettled(tasks.map((task) => task()));\n  return results.filter((entry) => entry.status === 'fulfilled').map((entry) => entry.value);\n}\n\nloadResources([\n  () => Promise.resolve('tutorials'),\n  () => Promise.reject(new Error('practice failed')),\n  () => Promise.resolve('progress'),\n]).then(console.log);",
    },
    languageExamples: [
      {
        language: "JavaScript",
        code: "async function loadDashboard() {\n  const [tutorials, problems] = await Promise.all([\n    Promise.resolve(['Intro', 'Arrays']),\n    Promise.resolve(['Two Sum', 'Palindrome']),\n  ]);\n\n  return { tutorials, problems };\n}\n\nloadDashboard().then(console.log);",
      },
      {
        language: "TypeScript",
        code: "async function loadDashboard(): Promise<{ tutorials: string[]; problems: string[] }> {\n  const [tutorials, problems] = await Promise.all([\n    Promise.resolve(['Intro', 'Arrays']),\n    Promise.resolve(['Two Sum', 'Palindrome']),\n  ]);\n\n  return { tutorials, problems };\n}\n\nloadDashboard().then(console.log);",
      },
    ],
    trendingScore: "1.7k weekly runs",
  },
  {
    _id: "tutorial-react-state-labs",
    title: "React State Labs",
    description: "Design resilient component state for dashboards, editors, and filtered views.",
    category: "Frontend Patterns",
    difficulty: "Intermediate",
    duration: "54 min",
    lessons: 8,
    track: "React Architecture",
    author: "UI Systems",
    tags: ["React", "State", "Effects"],
    learningObjectives: [
      "Separate transient UI state from persisted data.",
      "Avoid duplicated derived state.",
      "Model editor interactions without brittle prop chains.",
    ],
    prerequisites: ["React basics", "Understanding of hooks"],
    sections: [
      {
        title: "State should describe the interface",
        content:
          "If a piece of state does not correspond to an interface concern, it is often redundant. Derived values should usually stay derived.",
      },
      {
        title: "Effects coordinate, they do not compute",
        content:
          "Effects should synchronize with external systems. Internal calculations belong in normal render logic whenever possible.",
      },
      {
        title: "Cross-page reuse",
        content:
          "Shared editor, console, and split layouts reduce drift between practice, tutorials, and playground surfaces.",
      },
    ],
    challenge: {
      title: "Mini challenge",
      prompt: "Build a filter state object that drives a searchable tutorial list.",
      starterCode:
        "const tutorials = ['React State', 'Async Workflows', 'Arrays'];\nconst filters = { search: 'state' };\nconst visibleTutorials = tutorials.filter((item) =>\n  item.toLowerCase().includes(filters.search.toLowerCase()),\n);\n\nconsole.log(visibleTutorials);",
    },
    languageExamples: [
      {
        language: "JavaScript",
        code: "const filters = { difficulty: 'Easy', tag: 'Array' };\nconst nextFilters = { ...filters, difficulty: 'Medium' };\nconsole.log(nextFilters);",
      },
      {
        language: "TypeScript",
        code: "type Filters = { difficulty: string; tag: string };\nconst filters: Filters = { difficulty: 'Easy', tag: 'Array' };\nconst nextFilters: Filters = { ...filters, difficulty: 'Medium' };\nconsole.log(nextFilters);",
      },
    ],
    trendingScore: "3 active learning paths",
  },
  {
    _id: "tutorial-data-structures",
    title: "Data Structure Patterns",
    description: "Use maps, sets, queues, and stacks to simplify problem solving.",
    category: "Algorithm Thinking",
    difficulty: "Intermediate",
    duration: "48 min",
    lessons: 7,
    track: "Problem Solving",
    author: "Interview Prep",
    tags: ["Hash Map", "Set", "Queue"],
    learningObjectives: [
      "Pick the right structure before writing code.",
      "Reduce nested loops with constant-time lookups.",
      "Translate business rules into data operations.",
    ],
    prerequisites: ["Loop fluency", "Comfort with objects and arrays"],
    sections: [
      {
        title: "Maps reduce rework",
        content:
          "When you find yourself repeatedly scanning a list, a map or set is usually the missing abstraction.",
      },
      {
        title: "Queues model flow",
        content:
          "Queues are not only for algorithms. They show up in UI task scheduling, notifications, and background work.",
      },
      {
        title: "Stacks preserve reversal intent",
        content:
          "A stack clarifies history, undo, and traversal problems better than ad hoc index logic.",
      },
    ],
    challenge: {
      title: "Mini challenge",
      prompt: "Return the first repeated item in a list using a set.",
      starterCode:
        "function firstRepeat(items) {\n  const seen = new Set();\n  for (const item of items) {\n    if (seen.has(item)) return item;\n    seen.add(item);\n  }\n  return null;\n}\n\nconsole.log(firstRepeat(['a', 'b', 'c', 'b']));",
    },
    languageExamples: [
      {
        language: "JavaScript",
        code: "const ids = ['a1', 'b4', 'a1'];\nconst seen = new Set();\nconst duplicate = ids.find((id) => (seen.has(id) ? true : (seen.add(id), false)));\nconsole.log(duplicate);",
      },
      {
        language: "Python",
        code: "ids = ['a1', 'b4', 'a1']\nseen = set()\nduplicate = next((item for item in ids if item in seen or seen.add(item)), None)\nprint(duplicate)",
      },
    ],
    trendingScore: "86% path completion rate",
  },
];

export const mockTutorials = tutorialSeeds;

export const mockProblems = [
  {
    _id: "practice-two-sum",
    title: "Two Sum",
    description: "Return the indices of the two numbers that add up to the target.",
    difficulty: "Easy",
    category: "Array Patterns",
    acceptanceRate: 78,
    completions: "12.6k",
    estimatedTime: "20 min",
    functionName: "twoSum",
    starterCode:
      "function twoSum(nums, target) {\n  const seen = new Map();\n\n  for (let index = 0; index < nums.length; index += 1) {\n    const current = nums[index];\n    const complement = target - current;\n\n    if (seen.has(complement)) {\n      return [seen.get(complement), index];\n    }\n\n    seen.set(current, index);\n  }\n\n  return [];\n}",
    examples: [
      {
        input: "twoSum([2, 7, 11, 15], 9)",
        output: "[0, 1]",
        explanation: "2 + 7 reaches the target immediately.",
      },
      {
        input: "twoSum([3, 2, 4], 6)",
        output: "[1, 2]",
        explanation: "Keep earlier values in a map so the lookup stays constant time.",
      },
    ],
    constraints: [
      "You can assume exactly one valid answer exists.",
      "Do not use the same element twice.",
      "Return indices in any order.",
    ],
    hints: [
      "Store previously seen numbers in a map.",
      "Check for the complement before adding the current value.",
    ],
    tags: ["Array", "Hash Map"],
    testCases: [
      { input: [[2, 7, 11, 15], 9], expectedOutput: [0, 1], isSample: true },
      { input: [[3, 2, 4], 6], expectedOutput: [1, 2], isSample: true },
      { input: [[3, 3], 6], expectedOutput: [0, 1], isSample: false },
    ],
  },
  {
    _id: "practice-valid-palindrome",
    title: "Palindrome Checker",
    description: "Return true when the provided text reads the same forwards and backwards.",
    difficulty: "Easy",
    category: "String Logic",
    acceptanceRate: 81,
    completions: "8.4k",
    estimatedTime: "15 min",
    functionName: "isPalindrome",
    starterCode:
      "function isPalindrome(text) {\n  const normalized = text.toLowerCase();\n  return normalized === normalized.split('').reverse().join('');\n}",
    examples: [
      {
        input: "isPalindrome('level')",
        output: "true",
        explanation: "The string is symmetrical from both directions.",
      },
    ],
    constraints: [
      "Case-insensitive comparisons are acceptable in this exercise.",
      "Return a boolean value.",
    ],
    hints: ["Normalize the string first.", "Compare it against its reversed representation."],
    tags: ["String", "Two Pointers"],
    testCases: [
      { input: ["level"], expectedOutput: true, isSample: true },
      { input: ["sf tutorial"], expectedOutput: false, isSample: true },
      { input: ["racecar"], expectedOutput: true, isSample: false },
    ],
  },
  {
    _id: "practice-sum-even",
    title: "Sum Even Numbers",
    description: "Return the sum of every even number in the array.",
    difficulty: "Medium",
    category: "Iteration",
    acceptanceRate: 69,
    completions: "5.7k",
    estimatedTime: "18 min",
    functionName: "sumEvenNumbers",
    starterCode:
      "function sumEvenNumbers(numbers) {\n  return numbers.reduce((total, number) => (number % 2 === 0 ? total + number : total), 0);\n}",
    examples: [
      {
        input: "sumEvenNumbers([1, 2, 3, 4, 5, 6])",
        output: "12",
        explanation: "Only 2, 4, and 6 contribute to the total.",
      },
    ],
    constraints: [
      "The function receives an array of integers.",
      "Return 0 when no even values exist.",
    ],
    hints: ["Think in terms of a running total.", "Guard with `% 2 === 0` before accumulating."],
    tags: ["Array", "Reduction"],
    testCases: [
      { input: [[1, 2, 3, 4, 5, 6]], expectedOutput: 12, isSample: true },
      { input: [[7, 11, 13]], expectedOutput: 0, isSample: true },
      { input: [[2, 10, 14]], expectedOutput: 26, isSample: false },
    ],
  },
  {
    _id: "practice-group-anagrams",
    title: "Group Anagrams",
    description: "Group words that contain the same letters regardless of order.",
    difficulty: "Medium",
    category: "Map Transformations",
    acceptanceRate: 63,
    completions: "4.2k",
    estimatedTime: "28 min",
    functionName: "groupAnagrams",
    starterCode:
      "function groupAnagrams(words) {\n  const groups = new Map();\n\n  for (const word of words) {\n    const signature = word.split('').sort().join('');\n    const nextGroup = groups.get(signature) || [];\n    nextGroup.push(word);\n    groups.set(signature, nextGroup);\n  }\n\n  return Array.from(groups.values());\n}",
    examples: [
      {
        input: "groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat'])",
        output: "[['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]",
        explanation: "Sort each word into a stable signature and group by that signature.",
      },
    ],
    constraints: ["Input is an array of lowercase strings.", "Order of groups does not matter."],
    hints: ["Generate a deterministic key per word.", "A map avoids repeated scans."],
    tags: ["Hash Map", "String"],
    testCases: [
      {
        input: [["eat", "tea", "tan", "ate", "nat", "bat"]],
        expectedOutput: [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]],
        isSample: true,
      },
      { input: [[""]], expectedOutput: [[""]], isSample: true },
      { input: [["abc"]], expectedOutput: [["abc"]], isSample: false },
    ],
  },
];

export const mockProblemSummaries = mockProblems.map(
  ({
    _id,
    title,
    description,
    difficulty,
    category,
    acceptanceRate,
    completions,
    estimatedTime,
    tags,
  }) => ({
    _id,
    title,
    description,
    difficulty,
    category,
    acceptanceRate,
    completions,
    estimatedTime,
    tags,
  }),
);

export const mockLearningPaths = [
  {
    id: "path-foundations",
    title: "Frontend Fundamentals",
    description: "Go from syntax to repeatable problem solving and state management.",
    level: "Starter",
    duration: "4 weeks",
    color: "from-accent-400/20 via-brand-400/18 to-transparent",
    tutorialIds: ["tutorial-js-foundations", "tutorial-react-state-labs"],
    problemIds: ["practice-two-sum", "practice-valid-palindrome"],
  },
  {
    id: "path-runtime",
    title: "Async + Systems Thinking",
    description: "Learn how runtime behavior affects UI, data, and execution feedback loops.",
    level: "Intermediate",
    duration: "3 weeks",
    color: "from-gold-200/18 via-peach-200/16 to-transparent",
    tutorialIds: ["tutorial-async-patterns", "tutorial-data-structures"],
    problemIds: ["practice-sum-even", "practice-group-anagrams"],
  },
];

export const mockTrendingItems = [
  {
    id: "trend-1",
    type: "Tutorial",
    title: "React State Labs",
    description: "Reusable state patterns for split views, filters, and editor surfaces.",
    metric: "1.4k completions",
    path: "/tutorials/tutorial-react-state-labs",
    tags: ["React", "State"],
  },
  {
    id: "trend-2",
    type: "Practice",
    title: "Group Anagrams",
    description: "A strong map-based exercise with visible gains from better data structures.",
    metric: "63% acceptance",
    path: "/practice/practice-group-anagrams",
    tags: ["Hash Map", "String"],
  },
  {
    id: "trend-3",
    type: "Tool",
    title: "JSON Formatter",
    description: "Quickly format, validate, and inspect payloads while you learn.",
    metric: "Most used utility",
    path: "/tools",
    tags: ["Formatter", "JSON"],
  },
];

export const mockNotifications = [
  {
    id: "notif-1",
    title: "New async lab unlocked",
    body: "The async workflows tutorial has a new challenge block ready to run.",
  },
  {
    id: "notif-2",
    title: "Practice streak updated",
    body: "You kept your coding streak alive with two successful sample runs.",
  },
  {
    id: "notif-3",
    title: "Tooling workspace ready",
    body: "Use the JSON tools to inspect responses while the backend is in progress.",
  },
];

export const mockPlaygroundFiles = [
  {
    id: "file-main",
    name: "main.js",
    path: "/src/main.js",
    language: "javascript",
    content:
      "import { totalLessons } from './stats.js';\n\nconst output = totalLessons([4, 6, 8]);\nconsole.log('Total lessons this week:', output);",
  },
  {
    id: "file-stats",
    name: "stats.js",
    path: "/src/stats.js",
    language: "javascript",
    content:
      "export const totalLessons = (weeks) => weeks.reduce((sum, value) => sum + value, 0);",
  },
  {
    id: "file-python",
    name: "main.py",
    path: "/src/main.py",
    language: "python",
    content:
      "def total_lessons(weeks):\n    return sum(weeks)\n\nprint('Total lessons this week:', total_lessons([4, 6, 8]))",
  },
];

const findByIdOrTitle = (collection, entity) =>
  collection.find(
    (item) => item._id === entity?._id || item._id === entity || item.title === entity?.title,
  );

export const normalizeTutorial = (tutorial, index = 0) => {
  if (!tutorial) {
    return null;
  }

  const seed = findByIdOrTitle(mockTutorials, tutorial) || mockTutorials[index % mockTutorials.length];

  return {
    ...seed,
    ...tutorial,
    _id: seed._id,
    remoteId: tutorial._id || seed.remoteId || null,
    tags: tutorial.tags?.length ? tutorial.tags : seed.tags,
    learningObjectives:
      tutorial.learningObjectives?.length ? tutorial.learningObjectives : seed.learningObjectives,
    prerequisites: tutorial.prerequisites?.length ? tutorial.prerequisites : seed.prerequisites,
    sections: tutorial.sections?.length ? tutorial.sections : seed.sections,
    challenge: tutorial.challenge || seed.challenge,
    languageExamples:
      tutorial.languageExamples?.length ? tutorial.languageExamples : seed.languageExamples,
  };
};

export const getMockTutorialById = (tutorialId) =>
  mockTutorials.find((tutorial) => tutorial._id === tutorialId) || null;

export const normalizeProblemSummary = (problem, index = 0) => {
  if (!problem) {
    return null;
  }

  const seed = findByIdOrTitle(mockProblems, problem) || mockProblems[index % mockProblems.length];

  return {
    ...seed,
    ...problem,
    _id: seed._id,
    remoteId: problem._id || seed.remoteId || null,
    acceptanceRate: problem.acceptanceRate ?? seed.acceptanceRate,
    completions: problem.completions || seed.completions,
    estimatedTime: problem.estimatedTime || seed.estimatedTime,
    category: problem.category || seed.category,
    tags: problem.tags?.length ? problem.tags : seed.tags,
  };
};

export const normalizeProblemDetail = (problem, index = 0) => {
  const normalized = normalizeProblemSummary(problem, index);

  if (!normalized) {
    return null;
  }

  const seed = findByIdOrTitle(mockProblems, problem) || mockProblems[index % mockProblems.length];

  return {
    ...normalized,
    functionName: problem.functionName || seed.functionName,
    starterCode: problem.starterCode || seed.starterCode,
    examples: problem.examples?.length ? problem.examples : seed.examples,
    constraints: problem.constraints?.length ? problem.constraints : seed.constraints,
    hints: problem.hints?.length ? problem.hints : seed.hints,
    testCases: problem.testCases?.length ? problem.testCases : seed.testCases,
  };
};

export const getMockProblemById = (problemId) =>
  mockProblems.find((problem) => problem._id === problemId) || null;

export const getMockProblemsByDifficulty = (difficulty = "All") =>
  difficulty === "All"
    ? mockProblemSummaries
    : mockProblemSummaries.filter((problem) => problem.difficulty === difficulty);

const seededSubmissionCases = [
  {
    input: [[2, 7, 11, 15], 9],
    expectedOutput: [0, 1],
    actualOutput: [0, 1],
    passed: true,
  },
  {
    input: [[3, 2, 4], 6],
    expectedOutput: [1, 2],
    actualOutput: [1, 2],
    passed: true,
  },
];

export const mockProgressOverview = {
  stats: {
    completedTutorialCount: 1,
    solvedProblemCount: 1,
    totalSubmissions: 2,
    acceptanceRate: 50,
  },
  completedTutorials: [mockTutorials[0]],
  solvedProblems: [mockProblems[0]],
  recentSubmissions: [
    {
      _id: "submission-seed-1",
      problemId: { title: mockProblems[0].title, difficulty: mockProblems[0].difficulty },
      passed: 2,
      total: 2,
      status: "Accepted",
      createdAt: "2026-04-15T08:30:00.000Z",
      cases: seededSubmissionCases,
    },
    {
      _id: "submission-seed-2",
      problemId: { title: mockProblems[2].title, difficulty: mockProblems[2].difficulty },
      passed: 1,
      total: 2,
      status: "Try Again",
      createdAt: "2026-04-14T19:00:00.000Z",
      cases: [],
    },
  ],
};

export const normalizeProgressOverview = (overview = {}) => {
  const completedTutorials = (overview.completedTutorials || []).map((tutorial, index) =>
    normalizeTutorial(tutorial, index),
  );
  const solvedProblems = (overview.solvedProblems || []).map((problem, index) =>
    normalizeProblemSummary(problem, index),
  );
  const recentSubmissions = (overview.recentSubmissions || []).map((submission, index) => {
    const fallback = mockProgressOverview.recentSubmissions[index % mockProgressOverview.recentSubmissions.length];
    const problemId = submission.problemId
      ? normalizeProblemSummary(submission.problemId, index)
      : fallback.problemId;

    return {
      ...fallback,
      ...submission,
      problemId: {
        title: problemId.title,
        difficulty: problemId.difficulty,
      },
    };
  });

  const completedTutorialCount =
    overview.stats?.completedTutorialCount ?? completedTutorials.length ?? 0;
  const solvedProblemCount = overview.stats?.solvedProblemCount ?? solvedProblems.length ?? 0;
  const totalSubmissions =
    overview.stats?.totalSubmissions ?? recentSubmissions.length ?? 0;
  const acceptanceRate = overview.stats?.acceptanceRate ?? 0;

  return {
    stats: {
      completedTutorialCount,
      solvedProblemCount,
      totalSubmissions,
      acceptanceRate,
    },
    completedTutorials: completedTutorials.length ? completedTutorials : mockProgressOverview.completedTutorials,
    solvedProblems: solvedProblems.length ? solvedProblems : mockProgressOverview.solvedProblems,
    recentSubmissions: recentSubmissions.length ? recentSubmissions : mockProgressOverview.recentSubmissions,
  };
};
