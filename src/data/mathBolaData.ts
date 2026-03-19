// Math Bola — Tambola-style math game data

export type AgeGroup = '7' | '8' | '9+';

export interface MathClue {
  id: number;
  clue: string;
  answer: number;
}

// Generate a math clue for a given answer and age group
function generateClue(answer: number, age: AgeGroup): string {
  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  if (age === '7') {
    // Simple addition / subtraction for 7-year-olds
    const type = Math.random() < 0.5 ? 'add' : 'sub';
    if (type === 'add') {
      const a = rand(1, answer - 1 > 0 ? answer - 1 : 1);
      const b = answer - a;
      return `${a} + ${b}`;
    } else {
      const a = rand(answer + 1, answer + 10);
      const b = a - answer;
      return `${a} − ${b}`;
    }
  }

  if (age === '8') {
    // Multiplication, division, mixed for 8-year-olds
    const types = ['mul', 'add', 'sub'];
    const type = types[rand(0, 2)];
    if (type === 'mul') {
      // Find a factor pair
      const factors: [number, number][] = [];
      for (let i = 2; i <= Math.sqrt(answer); i++) {
        if (answer % i === 0) factors.push([i, answer / i]);
      }
      if (factors.length > 0) {
        const [a, b] = factors[rand(0, factors.length - 1)];
        return `${a} × ${b}`;
      }
      const a = rand(1, answer - 1 > 0 ? answer - 1 : 1);
      return `${a} + ${answer - a}`;
    }
    if (type === 'add') {
      const a = rand(1, answer - 1 > 0 ? answer - 1 : 1);
      return `${a} + ${answer - a}`;
    }
    const a = rand(answer + 1, answer + 15);
    return `${a} − ${a - answer}`;
  }

  // 9+ — harder mixed operations
  const types = ['mul', 'div', 'mixed'];
  const type = types[rand(0, 2)];
  if (type === 'mul') {
    const factors: [number, number][] = [];
    for (let i = 2; i <= Math.sqrt(answer); i++) {
      if (answer % i === 0) factors.push([i, answer / i]);
    }
    if (factors.length > 0) {
      const [a, b] = factors[rand(0, factors.length - 1)];
      return `${a} × ${b}`;
    }
    const a = rand(1, answer - 1 > 0 ? answer - 1 : 1);
    return `${a} + ${answer - a}`;
  }
  if (type === 'div') {
    const multiplier = rand(2, 5);
    return `${answer * multiplier} ÷ ${multiplier}`;
  }
  // mixed
  const sub = rand(1, 10);
  const base = answer + sub;
  return `${base} − ${sub}`;
}

// Generate a 3×9 tambola ticket with max 5 items per row
export function generateTicket(numberPool: number[]): (number | null)[][] {
  const ticket: (number | null)[][] = [
    Array(9).fill(null),
    Array(9).fill(null),
    Array(9).fill(null),
  ];

  const shuffled = [...numberPool].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 15); // 5 per row × 3 rows

  for (let row = 0; row < 3; row++) {
    const rowNumbers = selected.slice(row * 5, row * 5 + 5);
    // Pick 5 random column indices
    const cols: number[] = [];
    while (cols.length < 5) {
      const c = Math.floor(Math.random() * 9);
      if (!cols.includes(c)) cols.push(c);
    }
    cols.sort((a, b) => a - b);
    rowNumbers.sort((a, b) => a - b);
    for (let i = 0; i < 5; i++) {
      ticket[row][cols[i]] = rowNumbers[i];
    }
  }

  return ticket;
}

// Generate 6 unique tickets
export function generateTickets(age: AgeGroup): { tickets: (number | null)[][][]; allNumbers: number[] } {
  const maxNum = age === '7' ? 30 : age === '8' ? 50 : 90;
  
  // Create a pool of unique numbers
  const pool: number[] = [];
  for (let i = 1; i <= maxNum; i++) pool.push(i);
  
  // Shuffle and take enough for 6 tickets (6 × 15 = 90, but we may have overlap)
  const shuffledPool = [...pool].sort(() => Math.random() - 0.5);
  
  const tickets: (number | null)[][][] = [];
  const allUsedNumbers = new Set<number>();
  
  for (let t = 0; t < 6; t++) {
    const start = t * 15;
    const ticketNumbers = shuffledPool.slice(start, start + 15).length >= 15
      ? shuffledPool.slice(start, start + 15)
      : shuffledPool.slice(0, 15).map(n => {
          // If not enough unique, wrap around with offset
          const offset = t * 3;
          return ((n + offset - 1) % maxNum) + 1;
        });
    
    ticketNumbers.forEach(n => allUsedNumbers.add(n));
    tickets.push(generateTicket(ticketNumbers));
  }

  return { tickets, allNumbers: Array.from(allUsedNumbers) };
}

// Generate clues for all numbers on a specific ticket
export function generateCluesForTicket(ticket: (number | null)[][], age: AgeGroup): MathClue[] {
  const numbers: number[] = [];
  ticket.forEach(row => row.forEach(cell => {
    if (cell !== null) numbers.push(cell);
  }));

  // Shuffle the order of announcements
  const shuffled = [...numbers].sort(() => Math.random() - 0.5);
  
  return shuffled.map((answer, idx) => ({
    id: idx + 1,
    clue: generateClue(answer, age),
    answer,
  }));
}

// How to play instructions for Math Bola
export const mathBolaInstructions = [
  { emoji: '🎫', text: '•	You have chosen your MathBola card — let’s begin!' },
  { emoji: '📢', text: '•	Get ready! A clue will be read aloud and shown on the screen.' },
  { emoji: '🧮', text: '•	Think fast — you have 20 seconds for each clue.' },
  { emoji: '✅', text: '•	Solve it and search for the matching number on your card.' },
  { emoji: '❌', text: '•	Found it? Cross it out quickly!' },
  { emoji: '🏆', text: '•	Not there? Stay sharp for the next clue.' },
  { emoji: '🏆', text: '•	There are 15 clues in this round — keep going!' },
  { emoji: '🏆', text: '•	Race to cross out any 5 numbers on your card.' },
  { emoji: '🏆', text: '•	Be the fastest to complete your Early 5 and win!' },
];
