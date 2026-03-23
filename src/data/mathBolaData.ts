// ─── IMAGE IMPORTS ───
// import runningTrack from '@/assets/mathbola/running-track.png';
// import blackboard from '@/assets/mathbola/blackboard.png';
// import ludoBoard from '@/assets/mathbola/ludo-board.png';
// import chessBoard from '@/assets/mathbola/chess-board.png';
// import birthdayCap from '@/assets/mathbola/birthday-cap.png';
// import trafficCone from '@/assets/mathbola/traffic-cone.png';
// import nachos from '@/assets/mathbola/nachos.png';
// import clothHanger from '@/assets/mathbola/cloth-hanger.png';
// import rubiksCube from '@/assets/mathbola/rubiks-cube.png';
// import gasCylinder from '@/assets/mathbola/gas-cylinder.png';
// Math Bola — Tambola-style math game data (Document-based clue cards)

// Math Bola — Tambola-style math game data (Document-based clue cards)

export type AgeGroup = '7' | '8' | '9+';

// A clue card from the document
export interface ClueCard {
  id: number;
  clues: string[];       // possible clue phrasings (one picked per game)
  answers: { display: string; label: string;isImage?: boolean }[]; // possible ticket displays (one picked per game)
}

// What a ticket cell holds
export interface TicketCell {
  clueId: number;
  display: string;
  label: string;
    isImage?: boolean; 
}

// A game clue (announced during gameplay)
export interface GameClue {
  id: number;
  clueId: number;
  clueText: string;
  answerDisplay: string;
  answerLabel: string;
   isImage?: boolean; 
}

// ─── 40 CLUE CARDS FROM DOCUMENT ───
export const CLUE_CARDS: ClueCard[] = [
  {
    id: 1,
    clues: ['Oval in Shape'],
    answers: [
      { display: '🪞', label: 'Mirror' },
      // { display: '🏃', label: 'Running Track' },
      // { display: runningTrack, label: 'Running Track', isImage: true }
      { display: '🏸', label: 'Badminton Racquet' },
    ],
  },
  {
    id: 2,
    clues: ['A shape of a Rectangle'],
    answers: [
      // { display: '📺', label: 'TV' },
      // { display: TV, label: 'TV',isImage: true },
      { display: '📏', label: 'Ruler' },
      { display: '🍫', label: 'Chocolate Bar' },
      // { display: '📋', label: 'Blackboard' },
      // { display: blackboard, label: 'Blackboard', isImage: true }
    ],
  },
  {
    id: 3,
    clues: ['A shape of a Square'],
    answers: [
      { display: '🧀', label: 'Cheese Slice' },
      // { display: '🎯', label: 'Ludo Board' },
      // { display: '♟️', label: 'Chess Board' },
    //      { display: ludoBoard, label: 'Ludo Board', isImage: true },   // ✅
    // { display: chessBoard, label: 'Chess Board', isImage: true },
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
      // { display: '🎉', label: 'Birthday Cap' },
      // { display: '🍦', label: 'Ice Cream Cone' },
      // { display: '🚧', label: 'Traffic Cone' },
        // { display: birthdayCap, label: 'Birthday Cap', isImage: true }, // ✅
    { display: '🍦', label: 'Ice Cream Cone' },
    // { display: trafficCone, label: 'Traffic Cone', isImage: true }
      { display: '🌲', label: 'Pine Tree' },
    ],
  },
  {
    id: 7,
    clues: ['A shape of a Triangle'],
    answers: [
      // { display: '🔺', label: 'Nachos' },
      // { display: nachos, label: 'Nachos', isImage: true },
      { display: '📐', label: 'Mad Angles' },
      { display: '🚩', label: 'Flag' },
      // { display: '👔', label: 'Cloth Hanger' },

    // { display: clothHanger, label: 'Cloth Hanger', isImage: true }
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
      // { display: '🧩', label: "Rubik's Cube" },

    // { display: rubiksCube, label: "Rubik's Cube", isImage: true }
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
      // { display: '⛽', label: 'Gas Cylinder' },
      // { display: gasCylinder, label: 'Gas Cylinder', isImage: true },
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
    clues: ['Next number in pattern: 9, 0, 0, 9, 0, 0, 9, 0, 0, ?'],
    answers: [{ display: '9', label: '9 (pattern)' }],
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
// export function generateTicket(cells: TicketCell[]): (TicketCell | null)[][] {
//   const ticket: (TicketCell | null)[][] = [
//     Array(9).fill(null),
//     Array(9).fill(null),
//     Array(9).fill(null),
//   ];

//   for (let row = 0; row < 3; row++) {
//     const rowCells = cells.slice(row * 5, row * 5 + 5);
//     const cols: number[] = [];
//     while (cols.length < 5) {
//       const c = Math.floor(Math.random() * 9);
//       if (!cols.includes(c)) cols.push(c);
//     }
//     cols.sort((a, b) => a - b);
//     for (let i = 0; i < 5; i++) {
//       ticket[row][cols[i]] = rowCells[i];
//     }
//   }

//   return ticket;
// }

function pickValidCols(): number[] {
  const MAX_CONSECUTIVE = 2;

  while (true) {
    // Pick 5 unique random cols
    const cols: number[] = [];
    while (cols.length < 5) {
      const c = Math.floor(Math.random() * 9);
      if (!cols.includes(c)) cols.push(c);
    }
    cols.sort((a, b) => a - b);

    // Check consecutive constraint
    let valid = true;
    let streak = 1;
    for (let i = 1; i < cols.length; i++) {
      if (cols[i] === cols[i - 1] + 1) {
        streak++;
        if (streak > MAX_CONSECUTIVE) {
          valid = false;
          break;
        }
      } else {
        streak = 1;
      }
    }

    if (valid) return cols;
    // else retry
  }
}

export function generateTicket(cells: TicketCell[]): (TicketCell | null)[][] {
  const ticket: (TicketCell | null)[][] = [
    Array(9).fill(null),
    Array(9).fill(null),
    Array(9).fill(null),
  ];

  for (let row = 0; row < 3; row++) {
    const rowCells = cells.slice(row * 5, row * 5 + 5);
    const cols = pickValidCols(); // ✅ constraint enforced here
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
      isImage: cell.isImage, 
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
