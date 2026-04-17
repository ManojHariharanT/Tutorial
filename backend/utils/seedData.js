import bcrypt from "bcrypt";
import { Problem } from "../modules/practice/practice.model.js";
import { Tutorial } from "../modules/tutorials/tutorial.model.js";
import { User } from "../modules/auth/auth.model.js";

// Helper function to hash passwords
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// User seed data
const userSeed = [
  {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
  },
  {
    name: "Alex Johnson",
    email: "alex@example.com",
    password: "password123",
  },
  {
    name: "Sarah Williams",
    email: "sarah@example.com",
    password: "password123",
  },
];

const tutorialSeed = [
  {
    title: "JavaScript Fundamentals",
    description: "Variables, functions, and control flow for beginners.",
    content:
      "Learn how JavaScript variables, functions, and conditionals work together to build simple programs.",
    languageExamples: [
      {
        language: "JavaScript",
        code: "const greet = (name) => `Hello, ${name}`;\nconsole.log(greet('Learner'));",
      },
      {
        language: "Python",
        code: "def greet(name):\n    return f'Hello, {name}'\n\nprint(greet('Learner'))",
      },
    ],
  },
  {
    title: "Working With Arrays",
    description: "Practice iterating, filtering, and transforming collections.",
    content:
      "Arrays are the backbone of many algorithm problems. This tutorial covers map, filter, reduce, and loops.",
    languageExamples: [
      {
        language: "JavaScript",
        code: "const numbers = [1, 2, 3, 4];\nconst doubled = numbers.map((value) => value * 2);\nconsole.log(doubled);",
      },
      {
        language: "Python",
        code: "numbers = [1, 2, 3, 4]\ndoubled = [value * 2 for value in numbers]\nprint(doubled)",
      },
    ],
  },
  {
    title: "Async JavaScript",
    description: "Understand promises and async/await through simple examples.",
    content:
      "Asynchronous code lets you fetch data and coordinate tasks without blocking the main thread.",
    languageExamples: [
      {
        language: "JavaScript",
        code: "async function loadProfile() {\n  return Promise.resolve({ name: 'SF Tutorial learner' });\n}\n\nloadProfile().then(console.log);",
      },
      {
        language: "TypeScript",
        code: "async function loadProfile(): Promise<{ name: string }> {\n  return { name: 'SF Tutorial learner' };\n}\n\nloadProfile().then(console.log);",
      },
    ],
  },
];

const problemSeed = [
  {
    title: "Two Sum",
    difficulty: "Easy",
    description: "Return the indices of the two numbers that add up to the target.",
    functionName: "twoSum",
    starterCode:
      "function twoSum(nums, target) {\n  // Write your solution here\n  return [];\n}",
    examples: [
      {
        input: "twoSum([2, 7, 11, 15], 9)",
        output: "[0, 1]",
        explanation: "2 + 7 equals 9.",
      },
    ],
    testCases: [
      {
        input: [[2, 7, 11, 15], 9],
        expectedOutput: [0, 1],
        isSample: true,
      },
      {
        input: [[3, 2, 4], 6],
        expectedOutput: [1, 2],
        isSample: true,
      },
      {
        input: [[3, 3], 6],
        expectedOutput: [0, 1],
        isSample: false,
      },
    ],
    tags: ["Array", "Hash Map"],
  },
  {
    title: "Palindrome Checker",
    difficulty: "Easy",
    description: "Return true when the provided text reads the same backwards.",
    functionName: "isPalindrome",
    starterCode:
      "function isPalindrome(text) {\n  // Write your solution here\n  return false;\n}",
    examples: [
      {
        input: "isPalindrome('level')",
        output: "true",
        explanation: "level reads the same from both directions.",
      },
    ],
    testCases: [
      {
        input: ["level"],
        expectedOutput: true,
        isSample: true,
      },
      {
        input: ["sf tutorial"],
        expectedOutput: false,
        isSample: true,
      },
      {
        input: ["racecar"],
        expectedOutput: true,
        isSample: false,
      },
    ],
    tags: ["String"],
  },
  {
    title: "Sum Even Numbers",
    difficulty: "Medium",
    description: "Return the sum of all even numbers in the array.",
    functionName: "sumEvenNumbers",
    starterCode:
      "function sumEvenNumbers(numbers) {\n  // Write your solution here\n  return 0;\n}",
    examples: [
      {
        input: "sumEvenNumbers([1, 2, 3, 4, 5, 6])",
        output: "12",
        explanation: "2 + 4 + 6 equals 12.",
      },
    ],
    testCases: [
      {
        input: [[1, 2, 3, 4, 5, 6]],
        expectedOutput: 12,
        isSample: true,
      },
      {
        input: [[7, 11, 13]],
        expectedOutput: 0,
        isSample: true,
      },
      {
        input: [[2, 10, 14]],
        expectedOutput: 26,
        isSample: false,
      },
    ],
    tags: ["Array", "Iteration"],
  },
];

export const seedInitialData = async () => {
  try {
    // Seed users
    let userCount = await User.countDocuments();
   
    // Force reseed with demo accounts (clear old data if it exists)
    if (userCount > 0) {
      await User.deleteMany({});
    
      // Drop old indices to prevent duplicate key errors
      try {
        await User.collection.dropIndex("username_1");
      } catch (e) {
        // Ignore if index doesn't exist
      }
      
      userCount = 0;
    }
    
    if (!userCount) {
      const usersWithHashedPasswords = await Promise.all(
        userSeed.map(async (user) => ({
          ...user,
          password: await hashPassword(user.password),
        })),
      );
      await User.insertMany(usersWithHashedPasswords);
      console.log("✓ Users seeded successfully");
    }

    // Seed tutorials
    const tutorialCount = await Tutorial.countDocuments();
    if (!tutorialCount) {
      await Tutorial.insertMany(tutorialSeed);
      console.log("✓ Tutorials seeded successfully");
    }

    // Seed problems
    const problemCount = await Problem.countDocuments();
    if (!problemCount) {
      await Problem.insertMany(problemSeed);
      console.log("✓ Problems seeded successfully");
    }
  } catch (error) {
    console.error("Error seeding data:", error.message);
  }
};
