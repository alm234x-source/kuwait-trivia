"use client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OTDBQuestion {
  category: string;
  type: "multiple" | "boolean";
  difficulty: "easy" | "medium" | "hard";
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface ProcessedQuestion {
  question: string;
  options: string[];      // shuffled, decoded
  correctIndex: number;   // index in shuffled options
  category: string;
  difficulty: string;
  fact?: string;          // optional — present only for Kuwait culture questions
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Decode HTML entities (e.g. &amp; → & , &#039; → ' ) */
export function decodeHtml(html: string): string {
  if (typeof document === "undefined") {
    // SSR fallback — basic replacements only
    return html
      .replace(/&amp;/g, "&")
      .replace(/&#039;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&ldquo;/g, "“")
      .replace(/&rdquo;/g, "”")
      .replace(/&lsquo;/g, "‘")
      .replace(/&rsquo;/g, "’")
      .replace(/&ndash;/g, "–")
      .replace(/&mdash;/g, "—");
  }
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

/** Fisher-Yates shuffle */
export function shuffleArray<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Convert a raw OTDB question into a display-ready ProcessedQuestion */
export function processOTDBQuestion(q: OTDBQuestion): ProcessedQuestion {
  const question   = decodeHtml(q.question);
  const correct    = decodeHtml(q.correct_answer);
  const incorrect  = q.incorrect_answers.map(decodeHtml);

  const options    = shuffleArray([correct, ...incorrect]);
  const correctIndex = options.indexOf(correct);

  return {
    question,
    options,
    correctIndex,
    category:   decodeHtml(q.category),
    difficulty: q.difficulty,
  };
}

// ─── API fetch ────────────────────────────────────────────────────────────────

export async function fetchOTDBQuestions(
  amount: number,
  category?: number,
  difficulty?: string
): Promise<ProcessedQuestion[]> {
  let url = `https://opentdb.com/api.php?amount=${amount}&type=multiple`;
  if (category && category > 0) url += `&category=${category}`;
  if (difficulty && difficulty !== "any") url += `&difficulty=${difficulty}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Network error ${res.status} — check your connection.`);

  const data: { response_code: number; results: OTDBQuestion[] } = await res.json();

  switch (data.response_code) {
    case 0: break; // success
    case 1: throw new Error("Not enough questions for that combo. Try fewer questions, a broader category, or a different difficulty.");
    case 2: throw new Error("Invalid request parameters.");
    case 5: throw new Error("Too many requests. Wait a few seconds and try again.");
    default: throw new Error(`API error (code ${data.response_code}). Please try again.`);
  }

  return data.results.map(processOTDBQuestion);
}

// ─── Static config ────────────────────────────────────────────────────────────

export const CATEGORIES = [
  { id:  0, name: "Any Category",      emoji: "🎲" },
  { id:  9, name: "General Knowledge", emoji: "💡" },
  { id: 17, name: "Science & Nature",  emoji: "🔬" },
  { id: 18, name: "Computers",         emoji: "💻" },
  { id: 19, name: "Mathematics",       emoji: "🔢" },
  { id: 21, name: "Sports",            emoji: "⚽" },
  { id: 22, name: "Geography",         emoji: "🌍" },
  { id: 23, name: "History",           emoji: "📜" },
  { id: 25, name: "Art",               emoji: "🎨" },
  { id: -1, name: "Kuwait Culture",    emoji: "🇰🇼" },
] as const;

export const DIFFICULTIES = [
  { id: "any",    name: "Any",    emoji: "🎲", color: "from-slate-600 to-slate-700"   },
  { id: "easy",   name: "Easy",   emoji: "😊", color: "from-green-700 to-emerald-800" },
  { id: "medium", name: "Medium", emoji: "😤", color: "from-amber-700 to-yellow-800"  },
  { id: "hard",   name: "Hard",   emoji: "🔥", color: "from-red-700 to-rose-800"      },
] as const;

export const AMOUNTS = [5, 10, 15, 20] as const;
