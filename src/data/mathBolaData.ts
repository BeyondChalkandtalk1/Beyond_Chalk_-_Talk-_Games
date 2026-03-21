// // Math Bola — Tambola-style math game data

// export type AgeGroup = '7' | '8' | '9+';

// export interface MathClue {
//   id: number;
//   clue: string;
//   answer: number;
// }

// // Generate a math clue for a given answer and age group
// function generateClue(answer: number, age: AgeGroup): string {
//   const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

//   if (age === '7') {
//     // Simple addition / subtraction for 7-year-olds
//     const type = Math.random() < 0.5 ? 'add' : 'sub';
//     if (type === 'add') {
//       const a = rand(1, answer - 1 > 0 ? answer - 1 : 1);
//       const b = answer - a;
//       return `${a} + ${b}`;
//     } else {
//       const a = rand(answer + 1, answer + 10);
//       const b = a - answer;
//       return `${a} − ${b}`;
//     }
//   }

//   if (age === '8') {
//     // Multiplication, division, mixed for 8-year-olds
//     const types = ['mul', 'add', 'sub'];
//     const type = types[rand(0, 2)];
//     if (type === 'mul') {
//       // Find a factor pair
//       const factors: [number, number][] = [];
//       for (let i = 2; i <= Math.sqrt(answer); i++) {
//         if (answer % i === 0) factors.push([i, answer / i]);
//       }
//       if (factors.length > 0) {
//         const [a, b] = factors[rand(0, factors.length - 1)];
//         return `${a} × ${b}`;
//       }
//       const a = rand(1, answer - 1 > 0 ? answer - 1 : 1);
//       return `${a} + ${answer - a}`;
//     }
//     if (type === 'add') {
//       const a = rand(1, answer - 1 > 0 ? answer - 1 : 1);
//       return `${a} + ${answer - a}`;
//     }
//     const a = rand(answer + 1, answer + 15);
//     return `${a} − ${a - answer}`;
//   }

//   // 9+ — harder mixed operations
//   const types = ['mul', 'div', 'mixed'];
//   const type = types[rand(0, 2)];
//   if (type === 'mul') {
//     const factors: [number, number][] = [];
//     for (let i = 2; i <= Math.sqrt(answer); i++) {
//       if (answer % i === 0) factors.push([i, answer / i]);
//     }
//     if (factors.length > 0) {
//       const [a, b] = factors[rand(0, factors.length - 1)];
//       return `${a} × ${b}`;
//     }
//     const a = rand(1, answer - 1 > 0 ? answer - 1 : 1);
//     return `${a} + ${answer - a}`;
//   }
//   if (type === 'div') {
//     const multiplier = rand(2, 5);
//     return `${answer * multiplier} ÷ ${multiplier}`;
//   }
//   // mixed
//   const sub = rand(1, 10);
//   const base = answer + sub;
//   return `${base} − ${sub}`;
// }

// // Generate a 3×9 tambola ticket with max 5 items per row
// export function generateTicket(numberPool: number[]): (number | null)[][] {
//   const ticket: (number | null)[][] = [
//     Array(9).fill(null),
//     Array(9).fill(null),
//     Array(9).fill(null),
//   ];

//   const shuffled = [...numberPool].sort(() => Math.random() - 0.5);
//   const selected = shuffled.slice(0, 15); // 5 per row × 3 rows

//   for (let row = 0; row < 3; row++) {
//     const rowNumbers = selected.slice(row * 5, row * 5 + 5);
//     // Pick 5 random column indices
//     const cols: number[] = [];
//     while (cols.length < 5) {
//       const c = Math.floor(Math.random() * 9);
//       if (!cols.includes(c)) cols.push(c);
//     }
//     cols.sort((a, b) => a - b);
//     rowNumbers.sort((a, b) => a - b);
//     for (let i = 0; i < 5; i++) {
//       ticket[row][cols[i]] = rowNumbers[i];
//     }
//   }

//   return ticket;
// }

// // Generate 6 unique tickets
// export function generateTickets(age: AgeGroup): { tickets: (number | null)[][][]; allNumbers: number[] } {
//   const maxNum = age === '7' ? 30 : age === '8' ? 50 : 90;
  
//   // Create a pool of unique numbers
//   const pool: number[] = [];
//   for (let i = 1; i <= maxNum; i++) pool.push(i);
  
//   // Shuffle and take enough for 6 tickets (6 × 15 = 90, but we may have overlap)
//   const shuffledPool = [...pool].sort(() => Math.random() - 0.5);
  
//   const tickets: (number | null)[][][] = [];
//   const allUsedNumbers = new Set<number>();
  
//   for (let t = 0; t < 6; t++) {
//     const start = t * 15;
//     const ticketNumbers = shuffledPool.slice(start, start + 15).length >= 15
//       ? shuffledPool.slice(start, start + 15)
//       : shuffledPool.slice(0, 15).map(n => {
//           // If not enough unique, wrap around with offset
//           const offset = t * 3;
//           return ((n + offset - 1) % maxNum) + 1;
//         });
    
//     ticketNumbers.forEach(n => allUsedNumbers.add(n));
//     tickets.push(generateTicket(ticketNumbers));
//   }

//   return { tickets, allNumbers: Array.from(allUsedNumbers) };
// }

// // Generate clues for all numbers on a specific ticket
// export function generateCluesForTicket(ticket: (number | null)[][], age: AgeGroup): MathClue[] {
//   const numbers: number[] = [];
//   ticket.forEach(row => row.forEach(cell => {
//     if (cell !== null) numbers.push(cell);
//   }));

//   // Shuffle the order of announcements
//   const shuffled = [...numbers].sort(() => Math.random() - 0.5);
  
//   return shuffled.map((answer, idx) => ({
//     id: idx + 1,
//     clue: generateClue(answer, age),
//     answer,
//   }));
// }

// // How to play instructions for Math Bola
// export const mathBolaInstructions = [
//   { emoji: '🎫', text: '•	You have chosen your MathBola card — let’s begin!' },
//   { emoji: '📢', text: '•	Get ready! A clue will be read aloud and shown on the screen.' },
//   { emoji: '🧮', text: '•	Think fast — you have 20 seconds for each clue.' },
//   { emoji: '✅', text: '•	Solve it and search for the matching number on your card.' },
//   { emoji: '❌', text: '•	Found it? Cross it out quickly!' },
//   { emoji: '🏆', text: '•	Not there? Stay sharp for the next clue.' },
//   { emoji: '🏆', text: '•	There are 15 clues in this round — keep going!' },
//   { emoji: '🏆', text: '•	Race to cross out any 5 numbers on your card.' },
//   { emoji: '🏆', text: '•	Be the fastest to complete your Early 5 and win!' },
// ];

// Math Bola — Tambola-style math game data (Document-based clue cards)

// Math Bola — Tambola-style math game data (Document-based clue cards)

export type AgeGroup = '7' | '8' | '9+';

// A clue card from the document
export interface ClueCard {
  id: number;
  clues: string[];       // possible clue phrasings (one picked per game)
  answers: { display: string; label: string }[]; // possible ticket displays (one picked per game)
}

// What a ticket cell holds
export interface TicketCell {
  clueId: number;
  display: string;
  label: string;
}

// A game clue (announced during gameplay)
export interface GameClue {
  id: number;
  clueId: number;
  clueText: string;
  answerDisplay: string;
  answerLabel: string;
}

// ─── 40 CLUE CARDS FROM DOCUMENT ───
export const CLUE_CARDS: ClueCard[] = [
  {
    id: 1,
    clues: ['Oval in Shape'],
    answers: [
      { display: '🪞', label: 'Mirror' },
      { display: '🏃', label: 'Running Track' },
      { display: '🏸', label: 'Badminton Racquet' },
    ],
  },
  {
    id: 2,
    clues: ['A shape of a Rectangle'],
    answers: [
      { display: '📺', label: 'TV' },
      { display: '📏', label: 'Ruler' },
      { display: '🍫', label: 'Chocolate Bar' },
      { display: '📋', label: 'Blackboard' },
    ],
  },
  {
    id: 3,
    clues: ['A shape of a Square'],
    answers: [
      { display: '🧀', label: 'Cheese Slice' },
      { display: '🎯', label: 'Ludo Board' },
      { display: '♟️', label: 'Chess Board' },
    ],
  },
  {
    id: 4,
    clues: ['Representation of 2 Tens'],
    answers: [{ display: '20', label: '20' }],
  },
  {
    id: 5,
    clues: ['1 digit smallest counting number'],
    answers: [{ display: '1️⃣', label: '1' }],
  },
  {
    id: 6,
    clues: ['A shape of a Cone'],
    answers: [
      { display: '🎉', label: 'Birthday Cap' },
      { display: '🍦', label: 'Ice Cream Cone' },
      { display: '🚧', label: 'Traffic Cone' },
      { display: '🌲', label: 'Pine Tree' },
    ],
  },
  {
    id: 7,
    clues: ['A shape of a Triangle'],
    answers: [
      { display: '🔺', label: 'Nachos' },
      { display: '📐', label: 'Mad Angles' },
      { display: '🚩', label: 'Flag' },
      { display: '👔', label: 'Cloth Hanger' },
    ],
  },
  {
    id: 8,
    clues: ['A shape of a Cuboid'],
    answers: [
      { display: '📦', label: 'Match Box' },
      { display: '🧽', label: 'Eraser' },
      { display: '🧱', label: 'Brick' },
    ],
  },
  {
    id: 9,
    clues: ['Representation of 2 groups of 3'],
    answers: [{ display: '3+3', label: '3 + 3' }],
  },
  {
    id: 10,
    clues: ['Representation of 3 groups of 2'],
    answers: [{ display: '2+2+2', label: '2 + 2 + 2' }],
  },
  {
    id: 11,
    clues: ['2-digit largest number'],
    answers: [{ display: '99', label: '99' }],
  },
  {
    id: 12,
    clues: ['2-digit smallest number'],
    answers: [{ display: '10', label: '10' }],
  },
  {
    id: 13,
    clues: ['9 + 9 = ?', '8 + 10 = ?', '12 + 6 = ?', '11 + 7 = ?', '14 + 4 = ?', '15 + 3 = ?'],
    answers: [{ display: '18', label: '18' }],
  },
  {
    id: 14,
    clues: ['A shape of a Cube'],
    answers: [
      { display: '🧊', label: 'Sugar Cube' },
      { display: '🧩', label: "Rubik's Cube" },
      { display: '🎲', label: 'Dice' },
    ],
  },
  {
    id: 15,
    clues: ['Weekend days'],
    answers: [{ display: 'Sat & Sun', label: 'Sat & Sun' }],
  },
  {
    id: 16,
    clues: ['Even number that comes just before 9'],
    answers: [{ display: '8', label: '8' }],
  },
  {
    id: 17,
    clues: ['Number name for 40'],
    answers: [{ display: 'Forty', label: 'Forty' }],
  },
  {
    id: 18,
    clues: ['2 Tens and 5 Ones make a number'],
    answers: [{ display: '25', label: '25' }],
  },
  {
    id: 19,
    clues: ['Which month comes just after February?'],
    answers: [{ display: 'March', label: 'March' }],
  },
  {
    id: 20,
    clues: ['Week 29 falls in which month?'],
    answers: [{ display: 'July', label: 'July' }],
  },
  {
    id: 21,
    clues: ['10 − 10 = ?', '9 − 9 = ?', '8 − 8 = ?', '7 − 7 = ?', '6 − 6 = ?', '5 − 5 = ?'],
    answers: [{ display: '0️⃣', label: '0' }],
  },
  {
    id: 22,
    clues: ['The sign of greater than'],
    answers: [{ display: '>', label: '>' }],
  },
  {
    id: 23,
    clues: ['The sign of less than'],
    answers: [{ display: '<', label: '<' }],
  },
  {
    id: 24,
    clues: ['A shape of a Cylinder'],
    answers: [
      { display: '🍶', label: 'Bottle' },
      { display: '🕯️', label: 'Candle' },
      { display: '⛽', label: 'Gas Cylinder' },
    ],
  },
  {
    id: 25,
    clues: ['A shape with no corners'],
    answers: [{ display: '⭕', label: 'Circle' }],
  },
  {
    id: 26,
    clues: ['6 × 7 = ?'],
    answers: [{ display: '42', label: '42' }],
  },
  {
    id: 27,
    clues: ['Number of days in February in a leap year'],
    answers: [{ display: '29', label: '29' }],
  },
  {
    id: 28,
    clues: ['Skip count the numeral 10 twice by 3'],
    answers: [{ display: '16', label: '16' }],
  },
  {
    id: 29,
    clues: ['Next number in pattern: 1, 0, 0, 1, 0, 0, 1, 0, 0, ?'],
    answers: [{ display: '1', label: '1 (pattern)' }],
  },
  {
    id: 30,
    clues: ['Number of months in a year'],
    answers: [{ display: '12', label: '12' }],
  },
  {
    id: 31,
    clues: ['Number of days in a week'],
    answers: [{ display: '7️⃣', label: '7' }],
  },
  {
    id: 32,
    clues: ['Number made of 3 groups of 7'],
    answers: [{ display: '21', label: '21' }],
  },
  {
    id: 33,
    clues: ['Number with 0 in Ones place and 1 in Forty place'],
    answers: [{ display: '40', label: '40' }],
  },
  {
    id: 34,
    clues: ['Number of fingers and toes on your hands and feet'],
    answers: [{ display: '20', label: '20' }],
  },
  {
    id: 35,
    clues: ['The shape of a Honeycomb'],
    answers: [{ display: '⬡', label: 'Hexagon' }],
  },
  {
    id: 36,
    clues: ['Number of hours in a day'],
    answers: [{ display: '24', label: '24' }],
  },
  {
    id: 37,
    clues: ['I am the number of days in 2 weeks'],
    answers: [{ display: '14', label: '14' }],
  },
  {
    id: 38,
    clues: ['I am the number at the bottom of the clock'],
    answers: [{ display: '🕕', label: '6' }],
  },
  {
    id: 39,
    clues: ['I am two hours before 7 O\'clock'],
    answers: [{ display: '🕔', label: '5 O\'clock' }],
  },
  {
    id: 40,
    clues: ['19 − 4 = ?', '16 − 1 = ?', '17 − 2 = ?', '20 − 5 = ?', '18 − 3 = ?'],
    answers: [{ display: '15', label: '15' }],
  },
];

// Pick a random element from an array
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Shuffle an array
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Generate a 3×9 tambola ticket from 15 TicketCells
export function generateTicket(cells: TicketCell[]): (TicketCell | null)[][] {
  const ticket: (TicketCell | null)[][] = [
    Array(9).fill(null),
    Array(9).fill(null),
    Array(9).fill(null),
  ];

  for (let row = 0; row < 3; row++) {
    const rowCells = cells.slice(row * 5, row * 5 + 5);
    const cols: number[] = [];
    while (cols.length < 5) {
      const c = Math.floor(Math.random() * 9);
      if (!cols.includes(c)) cols.push(c);
    }
    cols.sort((a, b) => a - b);
    for (let i = 0; i < 5; i++) {
      ticket[row][cols[i]] = rowCells[i];
    }
  }

  return ticket;
}

// Generate 9 unique tickets from the 40 clue cards
// Each ticket gets 15 UNIQUE clue cards (no duplicate clueIds within a ticket)
export function generateTickets(_age: AgeGroup): { tickets: (TicketCell | null)[][][]; } {
  const tickets: (TicketCell | null)[][][] = [];

  for (let t = 0; t < 9; t++) {
    // Shuffle all cards fresh for each ticket to ensure 15 unique picks
    const shuffled = shuffle(CLUE_CARDS);
    const ticketCards = shuffled.slice(0, 15);

    // Convert to TicketCells (pick random answer for each)
    const cells: TicketCell[] = ticketCards.map(card => {
      const answer = pickRandom(card.answers);
      return {
        clueId: card.id,
        display: answer.display,
        label: answer.label,
      };
    });

    tickets.push(generateTicket(cells));
  }

  return { tickets };
}

// Generate clues for all items on a specific ticket
export function generateCluesForTicket(ticket: (TicketCell | null)[][]): GameClue[] {
  const cells: TicketCell[] = [];
  ticket.forEach(row => row.forEach(cell => {
    if (cell !== null) cells.push(cell);
  }));

  const shuffled = shuffle(cells);

  return shuffled.map((cell, idx) => {
    const card = CLUE_CARDS.find(c => c.id === cell.clueId)!;
    return {
      id: idx + 1,
      clueId: cell.clueId,
      clueText: pickRandom(card.clues),
      answerDisplay: cell.display,
      answerLabel: cell.label,
    };
  });
}

// How to play instructions
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
