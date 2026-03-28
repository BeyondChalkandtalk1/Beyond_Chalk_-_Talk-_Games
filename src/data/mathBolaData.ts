// // ─── IMAGE IMPORTS ───
// // import runningTrack from '@/assets/running-track.png';
// import blackboard from '@/assets/Blackboard.png';
// import Badminton from '@/assets/Badminton-Racquet.png';
// import ludoBoard from '@/assets/Ludo-BOard.png';
// import runningTrack from '@/assets/runninTrack.jpeg';
// import MadAngles from '@/assets/Mad-angles.webp';
// import chessBoard from '@/assets/Chess-Board.png';
// import ChocolateBar from '@/assets/Chocolate-Bar.png';
// import birthdayCap from '@/assets/Birthday-Cap.png';
// import brick from '@/assets/Brick.png';
// import candle from '@/assets/Candle.png';
// import Dice from '@/assets/Dice.png';
// import Eraser from '@/assets/Eraser.png';
// import Funnel from '@/assets/Funnel.png';
// import Matchbox from '@/assets/Matchbox.png';
// import Mirror from '@/assets/Mirror.png';
// import trafficCone from '@/assets/Traffic-Cone.png';
// import Triangularflaginsports from '@/assets/Triangularflaginsports.png';
// import nachos from '@/assets/Nachos.jpeg';
// import Pine from '@/assets/Pine.png';
// import Pole from '@/assets/Pole.png';
// import Rubiccube from '@/assets/Rubiccube.png';
// import Cheeseslice from '@/assets/Cheese-slice.jpeg';
// import TV from '@/assets/TV.png';
// import Waterbottle from '@/assets/Waterbottle.png';
// import Whiteboard from '@/assets/Whiteboard.png';
// // import clothHanger from '@/assets/cloth-hanger.png';
// // import rubiksCube from '@/assets/rubiks-cube.png';
// import gasCylinder from '@/assets/Gas-cylinder.png';
// import Hanger from '@/assets/Hanger.png';
// import IceCreamCone from '@/assets/Ice-cream-cone.png';
// // Math Bola — Tambola-style math game data (Document-based clue cards)

// // Math Bola — Tambola-style math game data (Document-based clue cards)

// export type AgeGroup = '7' | '8' | '9+';

// // A clue card from the document
// export interface ClueCard {
//   id: number;
//   clues: string[];       // possible clue phrasings (one picked per game)
//   answers: { display: string; label: string;isImage?: boolean }[]; // possible ticket displays (one picked per game)
// }

// // What a ticket cell holds
// export interface TicketCell {
//   clueId: number;
//   display: string;
//   label: string;
//     isImage?: boolean; 
// }

// // A game clue (announced during gameplay)
// export interface GameClue {
//   id: number;
//   clueId: number;
//   clueText: string;
//   answerDisplay: string;
//   answerLabel: string;
//    isImage?: boolean; 
// }

// // ─── 40 CLUE CARDS FROM DOCUMENT ───
// export const CLUE_CARDS_6_7: ClueCard[] = [
  // {
  //   id: 1,
  //   clues: ['Oval in Shape'],
  //   answers: [
  //     { display: Mirror, label: 'Mirror', isImage:true },
  //     { display: runningTrack, label: 'Running Track', isImage:true },
  //     // { display: runningTrack, label: 'Running Track', isImage: true }
  //     { display: Badminton, label: 'Badminton Racquet', isImage:true },
  //   ],
  // },
  // {
  //   id: 2,
  //   clues: ['A shape of a Rectangle'],
  //   answers: [
  //     // { display: '📺', label: 'TV' },
  //     { display: TV, label: 'TV',isImage: true },
  //     { display: '📏', label: 'Ruler' },
  //     { display: ChocolateBar, label: 'Chocolate Bar', isImage:true },
  //     // { display: '📋', label: 'Blackboard' },
  //     { display: blackboard, label: 'Blackboard', isImage: true },
  //     { display: Whiteboard, label: 'Whiteboard', isImage: true }
  //   ],
  // },
  // {
  //   id: 3,
  //   clues: ['A shape of a Square'],
  //   answers: [
  //     { display: Cheeseslice, label: 'Cheese Slice', isImage:true },
  //     // { display: , label: 'Ludo Board', isImage:true },
  //     // { display: '♟️', label: 'Chess Board' },
  //        { display: ludoBoard, label: 'Ludo Board', isImage: true },   // ✅
  //   { display: chessBoard, label: 'Chess Board', isImage: true },
  //   ],
  // },
  // {
  //   id: 4,
  //   clues: ['Representation of 2 Tens'],
  //   answers: [{ display: '20', label: '20' }],
  // },
  // {
  //   id: 5,
  //   clues: ['1 digit smallest counting number'],
  //   answers: [{ display: '1️⃣', label: '1' }],
  // },
  // {
  //   id: 6,
  //   clues: ['A shape of a Cone'],
  //   answers: [
  //     // { display: '🎉', label: 'Birthday Cap' },
  //     // { display: '🍦', label: 'Ice Cream Cone' },
  //     // { display: '🚧', label: 'Traffic Cone' },
  //       { display: birthdayCap, label: 'Birthday Cap', isImage: true }, // ✅
  //   { display: IceCreamCone, label: 'Ice Cream Cone',isImage:true },
  //   { display: trafficCone, label: 'Traffic Cone', isImage: true },
  //     { display: Pine, label: 'Pine Tree',isImage:true },
  //     { display: Funnel, label: 'Funnel',isImage:true },
  //   ],
  // },
  // {
  //   id: 7,
  //   clues: ['A shape of a Triangle'],
  //   answers: [
  //     // { display: '🔺', label: 'Nachos' },
  //     { display: nachos, label: 'Nachos', isImage: true },
  //     { display: MadAngles, label: 'Mad Angles' ,isImage:true},
  //     { display: Triangularflaginsports, label: 'Flag',isImage:true },
  //     // { display: '👔', label: 'Cloth Hanger' },

  //   { display: Hanger, label: 'Cloth Hanger', isImage: true },
  //   ],
  // },
  // {
  //   id: 8,
  //   clues: ['A shape of a Cuboid'],
  //   answers: [
  //     { display: Matchbox, label: 'Match Box',isImage:true },
  //     { display: Eraser, label: 'Eraser',isImage:true },
  //     { display: brick, label: 'Brick',isImage:true },
  //   ],
  // },
  // {
  //   id: 9,
  //   clues: ['Representation of 2 groups of 3'],
  //   answers: [{ display: '3+3', label: '3 + 3' }],
  // },
  // {
  //   id: 10,
  //   clues: ['Representation of 3 groups of 2'],
  //   answers: [{ display: '2+2+2', label: '2 + 2 + 2' }],
  // },
  // {
  //   id: 11,
  //   clues: ['2-digit largest number'],
  //   answers: [{ display: '99', label: '99' }],
  // },
  // {
  //   id: 12,
  //   clues: ['2-digit smallest number'],
  //   answers: [{ display: '10', label: '10' }],
  // },
  // {
  //   id: 13,
  //   clues: ['9 + 9 = ?', '8 + 10 = ?', '12 + 6 = ?', '11 + 7 = ?', '14 + 4 = ?', '15 + 3 = ?'],
  //   answers: [{ display: '18', label: '18' }],
  // },
  // {
  //   id: 14,
  //   clues: ['A shape of a Cube'],
  //   answers: [
  //     { display: '🧊', label: 'Sugar Cube' },
  //     { display: Rubiccube, label: "Rubik's Cube",isImage:true },

  //   // { display: rubiksCube, label: "Rubik's Cube", isImage: true }
  //     { display: Dice, label: 'Dice',isImage:true },
  //   ],
  // },
  // {
  //   id: 15,
  //   clues: ['Weekend'],
  //   answers: [{ display: 'Sat & Sun', label: 'Sat & Sun' }],
  // },
  // {
  //   id: 16,
  //   clues: ['Even number that comes just before 9'],
  //   answers: [{ display: '8', label: '8' }],
  // },
  // {
  //   id: 17,
  //   clues: ['Number name for 40'],
  //   answers: [{ display: 'Forty', label: 'Forty' }],
  // },
  // {
  //   id: 18,
  //   clues: ['2 Tens and 5 Ones make a number'],
  //   answers: [{ display: '25', label: '25' }],
  // },
  // {
  //   id: 19,
  //   clues: ['Which month comes just after February?'],
  //   answers: [{ display: 'March', label: 'March' }],
  // },
  // {
  //   id: 20,
  //   clues: ['Week 29 falls in which month?'],
  //   answers: [{ display: 'July', label: 'July' }],
  // },
  // {
  //   id: 21,
  //   clues: ['10 − 10 = ?', '9 − 9 = ?', '8 − 8 = ?', '7 − 7 = ?', '6 − 6 = ?', '5 − 5 = ?'],
  //   answers: [{ display: '0️⃣', label: '0' }],
  // },
  // {
  //   id: 22,
  //   clues: ['The sign of greater than'],
  //   answers: [{ display: '>', label: '>' }],
  // },
  // {
  //   id: 23,
  //   clues: ['The sign of less than'],
  //   answers: [{ display: '<', label: '<' }],
  // },
  // {
  //   id: 24,
  //   clues: ['A shape of a Cylinder'],
  //   answers: [
  //     { display: Waterbottle, label: 'Bottle',isImage:true },
  //     { display: candle, label: 'Candle',isImage:true },
  //     { display: gasCylinder, label: 'Gas Cylinder',isImage:true},
  //     // { display: gasCylinder, label: 'Gas Cylinder', isImage: true },
  //   ],
  // },
  // {
  //   id: 25,
  //   clues: ['A shape with no corners'],
  //   answers: [{ display: '⭕', label: 'Circle' }],
  // },
  // {
  //   id: 26,
  //   clues: ['6 × 7 = ?'],
  //   answers: [{ display: '42', label: '42' }],
  // },
  // {
  //   id: 27,
  //   clues: ['Number of days in February in a leap year'],
  //   answers: [{ display: '29', label: '29' }],
  // },
  // {
  //   id: 28,
  //   clues: ['Skip count the numeral 10 twice by 3'],
  //   answers: [{ display: '16', label: '16' }],
  // },
  // {
  //   id: 29,
  //   clues: ['Next number in pattern: 9, 0, 0, 9, 0, 0, 9, 0, 0, ?'],
  //   answers: [{ display: '9', label: '9 (pattern)' }],
  // },
  // {
  //   id: 30,
  //   clues: ['Number of months in a year'],
  //   answers: [{ display: '12', label: '12' }],
  // },
  // {
  //   id: 31,
  //   clues: ['Number of days in a week'],
  //   answers: [{ display: '7️⃣', label: '7' }],
  // },
  // {
  //   id: 32,
  //   clues: ['Number made of 3 groups of 7'],
  //   answers: [{ display: '21', label: '21' }],
  // },
  // {
  //   id: 33,
  //   clues: ['Number with 0 in Ones place and 1 in Forty place'],
  //   answers: [{ display: '40', label: '40' }],
  // },
  // {
  //   id: 34,
  //   clues: ['Number of fingers and toes on your hands and feet'],
  //   answers: [{ display: '20', label: '20' }],
  // },
  // {
  //   id: 35,
  //   clues: ['The shape of a Honeycomb'],
  //   answers: [{ display: '⬡', label: 'Hexagon' }],
  // },
  // {
  //   id: 36,
  //   clues: ['Number of hours in a day'],
  //   answers: [{ display: '24', label: '24' }],
  // },
  // {
  //   id: 37,
  //   clues: ['I am the number of days in 2 weeks'],
  //   answers: [{ display: '14', label: '14' }],
  // },
  // {
  //   id: 38,
  //   clues: ['I am the number at the bottom of the clock'],
  //   answers: [{ display: '🕕', label: '6' }],
  // },
  // {
  //   id: 39,
  //   clues: ['I am two hours before 7 O\'clock'],
  //   answers: [{ display: '🕔', label: '5 O\'clock' }],
  // },
  // {
  //   id: 40,
  //   clues: ['19 − 4 = ?', '16 − 1 = ?', '17 − 2 = ?', '20 − 5 = ?', '18 − 3 = ?'],
  //   answers: [{ display: '15', label: '15' }],
  // },
// ];

// export const CLUE_CARDS_7_8: ClueCard[] = [
//   {
//     id: 1,
//     clues: ['Oval in Shape'],
//     answers: [
//       { display: Mirror, label: 'Mirror', isImage: true },
//       { display: runningTrack, label: 'Running Track', isImage: true },
//       { display: Badminton, label: 'Badminton Racquet', isImage: true },
//     ],
//   },
//   {
//     id: 2,
//     clues: ['A shape of a Rectangle'],
//     answers: [
//       { display: TV, label: 'TV', isImage: true },
//       { display: '📏', label: 'Ruler' },
//       { display: ChocolateBar, label: 'Chocolate Bar', isImage: true },
//       { display: blackboard, label: 'Blackboard', isImage: true },
//       { display: Whiteboard, label: 'Whiteboard', isImage: true },
//     ],
//   },
//   {
//     id: 3,
//     clues: ['A shape of a Square'],
//     answers: [
//       { display: Cheeseslice, label: 'Cheese Slice', isImage: true },
//       { display: ludoBoard, label: 'Ludo Board', isImage: true },
//       { display: chessBoard, label: 'Chess Board', isImage: true },
//     ],
//   },
//   {
//     id: 4,
//     clues: ['Representation of 2 Tens'],
//     answers: [{ display: '20', label: '20' }],
//   },
//   {
//     id: 5,
//     clues: ['1 digit smallest counting number'],
//     answers: [{ display: '1️⃣', label: '1' }],
//   },
//   {
//     id: 6,
//     clues: ['A shape of a Cone'],
//     answers: [
//       { display: birthdayCap, label: 'Birthday Cap', isImage: true },
//       { display: IceCreamCone, label: 'Ice Cream Cone', isImage: true },
//       { display: trafficCone, label: 'Traffic Cone', isImage: true },
//       { display: Pine, label: 'Pine Tree', isImage: true },
//       { display: Funnel, label: 'Funnel', isImage: true },
//     ],
//   },
//   {
//     id: 7,
//     clues: ['A shape of a Triangle'],
//     answers: [
//       { display: nachos, label: 'Nachos', isImage: true },
//       { display: MadAngles, label: 'Mad Angles', isImage: true },
//       { display: Triangularflaginsports, label: 'Flag', isImage: true },
//       { display: Hanger, label: 'Cloth Hanger', isImage: true },
//     ],
//   },
//   {
//     id: 8,
//     clues: ['A shape of a Cuboid'],
//     answers: [
//       { display: Matchbox, label: 'Match Box', isImage: true },
//       { display: Eraser, label: 'Eraser', isImage: true },
//       { display: brick, label: 'Brick', isImage: true },
//     ],
//   },
//   {
//     id: 9,
//     clues: ['Representation of 2 groups of 3'],
//     answers: [{ display: '3+3', label: '3 + 3' }],
//   },
//   {
//     id: 10,
//     clues: ['Representation of 3 groups of 2'],
//     answers: [{ display: '2+2+2', label: '2 + 2 + 2' }],
//   },
//   {
//     id: 11,
//     clues: ['2-digit largest number'],
//     answers: [{ display: '99', label: '99' }],
//   },
//   {
//     id: 12,
//     clues: ['2-digit smallest number'],
//     answers: [{ display: '10', label: '10' }],
//   },
//   {
//     id: 13,
//     clues: ['9 + 9 = ?', '8 + 10 = ?', '12 + 6 = ?', '11 + 7 = ?', '14 + 4 = ?', '15 + 3 = ?'],
//     answers: [{ display: '18', label: '18' }],
//   },
//   {
//     id: 14,
//     clues: ['A shape of a Cube'],
//     answers: [
//       { display: '🧊', label: 'Sugar Cube' },
//       { display: Rubiccube, label: "Rubik's Cube", isImage: true },
//       { display: Dice, label: 'Dice', isImage: true },
//     ],
//   },
//   {
//     id: 15,
//     clues: ['Weekend'],
//     answers: [{ display: 'Sat & Sun', label: 'Sat & Sun' }],
//   },
//   {
//     id: 16,
//     clues: ['Even number that comes just before 9'],
//     answers: [{ display: '8', label: '8' }],
//   },
//   {
//     id: 17,
//     clues: ['Number name for 40'],
//     answers: [{ display: 'Forty', label: 'Forty' }],
//   },
//   {
//     id: 18,
//     clues: ['2 Tens and 5 Ones make a number'],
//     answers: [{ display: '25', label: '25' }],
//   },
//   {
//     id: 19,
//     clues: ['Which month comes just after February?'],
//     answers: [{ display: 'March', label: 'March' }],
//   },
//   {
//     id: 20,
//     clues: ['Week 29 falls in which month?'],
//     answers: [{ display: 'July', label: 'July' }],
//   },
//   {
//     id: 21,
//     clues: ['10 − 10 = ?', '9 − 9 = ?', '8 − 8 = ?', '7 − 7 = ?', '6 − 6 = ?', '5 − 5 = ?'],
//     answers: [{ display: '0️⃣', label: '0' }],
//   },
//   {
//     id: 22,
//     clues: ['The sign of greater than'],
//     answers: [{ display: '>', label: '>' }],
//   },
//   {
//     id: 23,
//     clues: ['The sign of less than'],
//     answers: [{ display: '<', label: '<' }],
//   },
//   {
//     id: 24,
//     clues: ['A shape of a Cylinder'],
//     answers: [
//       { display: Waterbottle, label: 'Bottle', isImage: true },
//       { display: candle, label: 'Candle', isImage: true },
//       { display: gasCylinder, label: 'Gas Cylinder', isImage: true },
//     ],
//   },
//   {
//     id: 25,
//     clues: ['A shape with no corners'],
//     answers: [{ display: '⭕', label: 'Circle' }],
//   },
//   {
//     id: 26,
//     clues: ['6 × 7 = ?'],
//     answers: [{ display: '42', label: '42' }],
//   },
//   {
//     id: 27,
//     clues: ['Number of days in February in a leap year'],
//     answers: [{ display: '29', label: '29' }],
//   },
//   {
//     id: 28,
//     clues: ['Skip count the numeral 10 twice by 3'],
//     answers: [{ display: '16', label: '16' }],
//   },
//   {
//     id: 29,
//     clues: ['Next number in pattern: 9, 0, 0, 9, 0, 0, 9, 0, 0, ?'],
//     answers: [{ display: '9', label: '9 (pattern)' }],
//   },
//   {
//     id: 30,
//     clues: ['Number of months in a year'],
//     answers: [{ display: '12', label: '12' }],
//   },
//   {
//     id: 31,
//     clues: ['Number of days in a week'],
//     answers: [{ display: '7️⃣', label: '7' }],
//   },
//   {
//     id: 32,
//     clues: ['Number made of 3 groups of 7'],
//     answers: [{ display: '21', label: '21' }],
//   },
//   {
//     id: 33,
//     clues: ['Number with 0 in Ones place and 1 in Forty place'],
//     answers: [{ display: '40', label: '40' }],
//   },
//   {
//     id: 34,
//     clues: ['Number of fingers and toes on your hands and feet'],
//     answers: [{ display: '20', label: '20' }],
//   },
//   {
//     id: 35,
//     clues: ['The shape of a Honeycomb'],
//     answers: [{ display: '⬡', label: 'Hexagon' }],
//   },
//   {
//     id: 36,
//     clues: ['Number of hours in a day'],
//     answers: [{ display: '24', label: '24' }],
//   },
//   {
//     id: 37,
//     clues: ['I am the number of days in 2 weeks'],
//     answers: [{ display: '14', label: '14' }],
//   },
//   {
//     id: 38,
//     clues: ['I am the number at the bottom of the clock'],
//     answers: [{ display: '🕕', label: '6' }],
//   },
//   {
//     id: 39,
//     clues: ["I am two hours before 7 O'clock"],
//     answers: [{ display: '🕔', label: "5 O'clock" }],
//   },
//   {
//     id: 40,
//     clues: ['19 − 4 = ?', '16 − 1 = ?', '17 − 2 = ?', '20 − 5 = ?', '18 − 3 = ?'],
//     answers: [{ display: '15', label: '15' }],
//   },
// ];
 
// export const CLUE_CARDS_8_9: ClueCard[] = [
//   // ✅ Add 8-9 year specific clue cards here when ready.
//   // Until then, falls back to CLUE_CARDS_7_8 (see getClueCards below).
// ];

// export function getClueCards(age: AgeGroup): ClueCard[] {
//   if (age === '7') return CLUE_CARDS_6_7;
//   if (age === '8') return CLUE_CARDS_7_8;
//   // 9+ falls back to 7-8 cards until you add dedicated 8-9 cards
//   return CLUE_CARDS_8_9.length > 0 ? CLUE_CARDS_8_9 : CLUE_CARDS_7_8;
// }

// export const CLUE_CARDS = CLUE_CARDS_7_8;
// // Pick a random element from an array
// function pickRandom<T>(arr: T[]): T {
//   return arr[Math.floor(Math.random() * arr.length)];
// }

// // Shuffle an array
// function shuffle<T>(arr: T[]): T[] {
//   const a = [...arr];
//   for (let i = a.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [a[i], a[j]] = [a[j], a[i]];
//   }
//   return a;
// }

// // Generate a 3×9 tambola ticket from 15 TicketCells
// // export function generateTicket(cells: TicketCell[]): (TicketCell | null)[][] {
// //   const ticket: (TicketCell | null)[][] = [
// //     Array(9).fill(null),
// //     Array(9).fill(null),
// //     Array(9).fill(null),
// //   ];

// //   for (let row = 0; row < 3; row++) {
// //     const rowCells = cells.slice(row * 5, row * 5 + 5);
// //     const cols: number[] = [];
// //     while (cols.length < 5) {
// //       const c = Math.floor(Math.random() * 9);
// //       if (!cols.includes(c)) cols.push(c);
// //     }
// //     cols.sort((a, b) => a - b);
// //     for (let i = 0; i < 5; i++) {
// //       ticket[row][cols[i]] = rowCells[i];
// //     }
// //   }

// //   return ticket;
// // }

// function pickValidCols(): number[] {
//   const MAX_CONSECUTIVE = 2;

//   while (true) {
//     // Pick 5 unique random cols
//     const cols: number[] = [];
//     while (cols.length < 5) {
//       const c = Math.floor(Math.random() * 9);
//       if (!cols.includes(c)) cols.push(c);
//     }
//     cols.sort((a, b) => a - b);

//     // Check consecutive constraint
//     let valid = true;
//     let streak = 1;
//     for (let i = 1; i < cols.length; i++) {
//       if (cols[i] === cols[i - 1] + 1) {
//         streak++;
//         if (streak > MAX_CONSECUTIVE) {
//           valid = false;
//           break;
//         }
//       } else {
//         streak = 1;
//       }
//     }

//     if (valid) return cols;
//     // else retry
//   }
// }

// export function generateTicket(cells: TicketCell[]): (TicketCell | null)[][] {
//   const ticket: (TicketCell | null)[][] = [
//     Array(9).fill(null),
//     Array(9).fill(null),
//     Array(9).fill(null),
//   ];

//   for (let row = 0; row < 3; row++) {
//     const rowCells = cells.slice(row * 5, row * 5 + 5);
//     const cols = pickValidCols(); // ✅ constraint enforced here
//     for (let i = 0; i < 5; i++) {
//       ticket[row][cols[i]] = rowCells[i];
//     }
//   }

//   return ticket;
// }

// // Generate 9 unique tickets from the 40 clue cards
// // Each ticket gets 15 UNIQUE clue cards (no duplicate clueIds within a ticket)
// export function generateTickets(_age: AgeGroup): { tickets: (TicketCell | null)[][][]; } {
//   const tickets: (TicketCell | null)[][][] = [];

//   for (let t = 0; t < 9; t++) {
//     // Shuffle all cards fresh for each ticket to ensure 15 unique picks
//     const shuffled = shuffle(CLUE_CARDS);
//     const ticketCards = shuffled.slice(0, 15);

//     // Convert to TicketCells (pick random answer for each)
//     const cells: TicketCell[] = ticketCards.map(card => {
//       const answer = pickRandom(card.answers);
//       return {
//         clueId: card.id,
//         display: answer.display,
//         label: answer.label,
//          isImage: answer.isImage ?? false
//       };
//     });

//     tickets.push(generateTicket(cells));
//   }

//   return { tickets };
// }

// // Generate clues for all items on a specific ticket
// export function generateCluesForTicket(ticket: (TicketCell | null)[][]): GameClue[] {
//   const cells: TicketCell[] = [];
//   ticket.forEach(row => row.forEach(cell => {
//     if (cell !== null) cells.push(cell);
//   }));

//   const shuffled = shuffle(cells);

//   return shuffled.map((cell, idx) => {
//     const card = CLUE_CARDS.find(c => c.id === cell.clueId)!;
//     return {
//       id: idx + 1,
//       clueId: cell.clueId,
//       clueText: pickRandom(card.clues),
//       answerDisplay: cell.display,
//       answerLabel: cell.label,
//       isImage: cell.isImage, 
//     };
//   });
// }

// // How to play instructions
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


// ─── IMAGE IMPORTS ───
import blackboard from '@/assets/Blackboard.png';
import Badminton from '@/assets/Badminton-Racquet.png';
import ludoBoard from '@/assets/Ludo-BOard.png';
import runningTrack from '@/assets/runninTrack.jpeg';
import MadAngles from '@/assets/Mad-angles.webp';
import chessBoard from '@/assets/Chess-Board.png';
import ChocolateBar from '@/assets/Chocolate-Bar.png';
import birthdayCap from '@/assets/Birthday-Cap.png';
import brick from '@/assets/Brick.png';
import candle from '@/assets/Candle.png';
import Dice from '@/assets/Dice.png';
import Eraser from '@/assets/Eraser.png';
import Funnel from '@/assets/Funnel.png';
import Matchbox from '@/assets/Matchbox.png';
import Mirror from '@/assets/Mirror.png';
import trafficCone from '@/assets/Traffic-Cone.png';
import Triangularflaginsports from '@/assets/Triangularflaginsports.png';
import nachos from '@/assets/Nachos.jpeg';
import Pine from '@/assets/Pine.png';
import Pole from '@/assets/Pole.png';
import Rubiccube from '@/assets/Rubiccube.png';
import Cheeseslice from '@/assets/Cheese-slice.jpeg';
import TV from '@/assets/TV.png';
import Waterbottle from '@/assets/Waterbottle.png';
import pole from '@/assets/Pole.png';
import Whiteboard from '@/assets/Whiteboard.png';
import gasCylinder from '@/assets/Gas-cylinder.png';
import Hanger from '@/assets/Hanger.png';
import Ruler from '@/assets/ruler.jpeg';
import circleImage from '@/assets/circle.jpeg';
import clock from '@/assets/clock.jpg';
import ovalImage from '@/assets/oval.jpeg';
import honeyComb1 from '@/assets/honeyComb1.jpeg';
import honeyComb2 from '@/assets/honeyComb2.jpeg';
import representationof2bars from '@/assets/representationof2bars.png';
import IceCreamCone from '@/assets/Ice-cream-cone.png';
import blocks45 from '@/assets/image.png';
import sugarCubeImage from '@/assets/sugarCubeImage.png';

export type AgeGroup = '7' | '8' | '9+';

export interface ClueCard {
  id: number;
  clues: string[];
  clueImage?: string; 
  answers: { display: string; label: string; isImage?: boolean }[];
}

export interface TicketCell {
  clueId: number;
  display: string;
  label: string;
  isImage?: boolean;
}

export interface GameClue {
  id: number;
  clueId: number;
  clueText: string;
  answerDisplay: string;
  answerLabel: string;
  isImage?: boolean;
   clueImage?: string; 
}

// ─────────────────────────────────────────────
// AGE GROUP 6-7 YEARS — Text/Number based clues
// (from the document image provided)
// ─────────────────────────────────────────────
export const CLUE_CARDS_6_7: ClueCard[] = 
[
  {
    id: 1,
    clues: ['Oval in Shape'],
    answers: [
      { display: Mirror, label: 'Mirror', isImage:true },
      { display: runningTrack, label: 'Running Track', isImage:true },
      // { display: runningTrack, label: 'Running Track', isImage: true }
      { display: Badminton, label: 'Badminton Racquet', isImage:true },
    ],
  },
  {
    id: 2,
    clues: ['A shape of a Rectangle'],
    answers: [
      // { display: '📺', label: 'TV' },
      { display: TV, label: 'TV',isImage: true },
      { display: Ruler, label: 'Ruler', isImage:true },
      { display: ChocolateBar, label: 'Chocolate Bar', isImage:true },
      // { display: '📋', label: 'Blackboard' },
      { display: blackboard, label: 'Blackboard', isImage: true },
      { display: Whiteboard, label: 'Whiteboard', isImage: true }
    ],
  },
  {
    id: 3,
    clues: ['A shape of a Square'],
    answers: [
      { display: Cheeseslice, label: 'Cheese Slice', isImage:true },
      // { display: , label: 'Ludo Board', isImage:true },
      // { display: '♟️', label: 'Chess Board' },
         { display: ludoBoard, label: 'Ludo Board', isImage: true },   // ✅
    { display: chessBoard, label: 'Chess Board', isImage: true },
    ],
  },
  {
    id: 4,
    clues: ['Representation of 2 Tens'],
    answers: [
      { display: representationof2bars, label: '20', isImage:true }
    ],
  },
  {
    id: 5,
    clues: ['1 digit smallest counting number'],
    answers: [{ display: '1️', label: '1' }],
  },
  {
    id: 6,
    clues: ['A shape of a Cone'],
    answers: [
      // { display: '🎉', label: 'Birthday Cap' },
      // { display: '🍦', label: 'Ice Cream Cone' },
      // { display: '🚧', label: 'Traffic Cone' },
        { display: birthdayCap, label: 'Birthday Cap', isImage: true }, // ✅
    { display: IceCreamCone, label: 'Ice Cream Cone',isImage:true },
    { display: trafficCone, label: 'Traffic Cone', isImage: true },
      { display: Pine, label: 'Pine Tree',isImage:true },
      { display: Funnel, label: 'Funnel',isImage:true },
    ],
  },
  {
    id: 7,
    clues: ['A shape of a Triangle'],
    answers: [
      // { display: '🔺', label: 'Nachos' },
      { display: nachos, label: 'Nachos', isImage: true },
      { display: MadAngles, label: 'Mad Angles' ,isImage:true},
      { display: Triangularflaginsports, label: 'Flag',isImage:true },
      // { display: '👔', label: 'Cloth Hanger' },

    { display: Hanger, label: 'Cloth Hanger', isImage: true },
    ],
  },
  {
    id: 8,
    clues: ['A shape of a Cuboid'],
    answers: [
      { display: Matchbox, label: 'Match Box',isImage:true },
      { display: Eraser, label: 'Eraser',isImage:true },
      { display: brick, label: 'Brick',isImage:true },
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
    clues: ['Reach the sum of 18 '],
    answers: [
      { display: '9+9', label: '9+9' },
      { display: '8+10', label: '8+10' },
      { display: '12+6', label: '12+6' },
      { display: '11+7', label: '11+7' },
      { display: '14+4', label: '14+4' },
      { display: '15+3', label: '15+3' },
    ],
  },
  {
    id: 14,
    clues: ['A shape of a Cube'],
    answers: [
      // { display: '🧊', label: 'Sugar Cube' },
      { display: sugarCubeImage, label: "Sugar Cube",isImage:true },
      { display: Rubiccube, label: "Rubik's Cube",isImage:true },

    // { display: rubiksCube, label: "Rubik's Cube", isImage: true }
      { display: Dice, label: 'Dice',isImage:true },
    ],
  },
  {
    id: 15,
    clues: ['Weekend'],
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
    clues: ['Reach the difference of 0'],
    answers: [
      { display: '10-10', label: '10-10' },
      { display: '9-9', label: '9-9' },
      { display: '8-8', label: '8-8' },
      { display: '7-7', label: '7-7' },
      { display: '6-6', label: '6-6' },
      { display: '5-5', label: '5-5' },
      { display: '1-1', label: '1-1' },
    ],
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
      { display: Waterbottle, label: 'Bottle',isImage:true },
      { display: candle, label: 'Candle',isImage:true },
      { display: gasCylinder, label: 'Gas Cylinder',isImage:true},
      // { display: gasCylinder, label: 'Gas Cylinder', isImage: true },
    ],
  },
  {
    id: 25,
    clues: ['A shape with no corners'],
    answers: [
      { display: circleImage, label: 'Circle', isImage:true },
      { display: ovalImage, label: 'Oval', isImage:true }
    ],
  },
  {
    id: 26,
    clues: ['6 times 7 is '],
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
    answers: [{ display: '7️', label: '7' }],
  },
  {
    id: 32,
    clues: ['Number made of 3 groups of 7'],
    answers: [{ display: '21', label: '21' }],
  },
  {
    id: 33,
    clues: ['Number with 0 in Ones place and 4 in Tens place'],
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
    answers: [
      { display: honeyComb1, label: 'Hexagon shapcirc', isImage:true },
      { display: honeyComb2, label: 'Hexagon', isImage:true }

    ],
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
    answers: [{ display: '6', label: '6' }],
  },
  {
    id: 39,
    clues: ['I am two hours before 7 O\'clock'],
    answers: [{ display: clock, label: '5 O\'clock', isImage:true }],
  },
  {
    id: 40,
    clues: ['Reach to the difference of 15'],
    answers: [
      { display: '19-4', label: '19-4' },
      { display: '16-1', label: '16-1' },
      { display: '17-2', label: '17-2' },
      { display: '20-5', label: '20-5' },
      { display: '18-3', label: '18-3' },
    ],
  },
];

// ─────────────────────────────────────────────
// AGE GROUP 7-8 YEARS — Image based clues
// (same as original CLUE_CARDS with images)
// ─────────────────────────────────────────────
export const CLUE_CARDS_7_8: ClueCard[] = [
  {
    id: 1,
    clues: ['Count backward by Tens from 89'],
    answers: [{ display: '79', label: '79' }],
  },
  {
    id: 2,
    clues: ['Oval in Shape'],
     answers: [
      { display: Mirror, label: 'Mirror', isImage:true },
      { display: runningTrack, label: 'Running Track', isImage:true },
      // { display: runningTrack, label: 'Running Track', isImage: true }
      { display: Badminton, label: 'Badminton Racquet', isImage:true },
    ],
  },
  {
    id: 3,
    clues: ['A shape of a Rectangle'],
   answers: [
      // { display: '📺', label: 'TV' },
      { display: TV, label: 'TV',isImage: true },
      
      { display: Ruler, label: 'Ruler', isImage:true },
      { display: ChocolateBar, label: 'Chocolate Bar', isImage:true },
      // { display: '📋', label: 'Blackboard' },
      { display: blackboard, label: 'Blackboard', isImage: true },
      { display: Whiteboard, label: 'Whiteboard', isImage: true }
    ],
  },
  {
    id: 4,
    clues: ['A shape of a Square'],
    answers: [
      { display: Cheeseslice, label: 'Cheese Slice', isImage:true },
      // { display: , label: 'Ludo Board', isImage:true },
      // { display: '♟️', label: 'Chess Board' },
         { display: ludoBoard, label: 'Ludo Board', isImage: true },   // ✅
    { display: chessBoard, label: 'Chess Board', isImage: true },
    ],
  },
  {
    id: 5,
    clues: ['A shape of a Cone'],
     answers: [
      // { display: '🎉', label: 'Birthday Cap' },
      // { display: '🍦', label: 'Ice Cream Cone' },
      // { display: '🚧', label: 'Traffic Cone' },
        { display: birthdayCap, label: 'Birthday Cap', isImage: true }, // ✅
    { display: IceCreamCone, label: 'Ice Cream Cone',isImage:true },
    { display: trafficCone, label: 'Traffic Cone', isImage: true },
      { display: Pine, label: 'Pine Tree',isImage:true },
      { display: Funnel, label: 'Funnel',isImage:true },
    ],
  },
  {
    id: 6,
    clues: ['A shape of a Triangle'],
    answers: [
      // { display: '🔺', label: 'Nachos' },
      { display: nachos, label: 'Nachos', isImage: true },
      { display: MadAngles, label: 'Mad Angles' ,isImage:true},
      { display: Triangularflaginsports, label: 'Flag',isImage:true },
      // { display: '👔', label: 'Cloth Hanger' },

    { display: Hanger, label: 'Cloth Hanger', isImage: true },
    ],
  },
  {
    id: 7,
    clues: ['A shape of a Cuboid'],
      answers: [
      { display: Matchbox, label: 'Match Box',isImage:true },
      { display: Eraser, label: 'Eraser',isImage:true },
      { display: brick, label: 'Brick',isImage:true },
    ],
  },
   {
    id: 8,
    clues: ['A shape of a Cube'],
      answers: [
      // { display: '🧊', label: 'Sugar Cube' },
      { display: sugarCubeImage, label: "Sugar Cube",isImage:true },
      { display: Rubiccube, label: "Rubik's Cube",isImage:true },

    // { display: rubiksCube, label: "Rubik's Cube", isImage: true }
      { display: Dice, label: 'Dice',isImage:true },
    ],  
  },
  {
    id: 9,
    clues: ['Representation of 3 groups of 4'],
    answers: [{ display: '4+4+4', label: '4+4+4' }],
  },
  {
    id: 10,
    clues: ['Representation of 4 groups of 3'],
    answers: [{ display: '3+3+3+3', label: '3+3+3+3' }],
  },
 
  {
    id: 11,
    clues: ['A shape of a Cylinder'],
    answers: [
      { display: Waterbottle, label: 'Bottle',isImage:true },
      { display: candle, label: 'Candle',isImage:true },
      { display: gasCylinder, label: 'Gas Cylinder',isImage:true},
      { display: pole, label: 'Pole', isImage: true },
    ],
  },
  {
    id: 12,
    clues: ['The word that will make the statement true: 89 ______ 98'],
    answers: [{ display: 'less than', label: 'less than' }],
  },
  {
    id: 13,
    clues: ['Reach the sum of 25'],
    answers: [
      { display: '18+7', label: '18+7' },
      { display: '20+5', label: '20+5' },
      { display: '21+4', label: '21+4' },
      { display: '19+6', label: '19+6' },
      { display: '11+14', label: '11+14' },
      { display: '17+8', label: '17+8' },
    ],
  },
  {
    id: 14,
    clues: ['Week 47 will fall in which month?'],
    answers: [{ display: 'November', label: 'November' }],
  },
  {
    id: 15,
    clues: ['Number made of 7 groups of 9'],
    answers: [{ display: '63', label: '63' }],
  },
  {
    id: 16,
    clues: ['Which digit will make the equation true: 8+8 = ____ + 9'],
    answers: [{ display: '7', label: '7' }],
  },
  {
    id: 17,
    clues: ['Reach the difference of 19'],
    answers: [
      { display: '19-0', label: '19-0' },
      { display: '28-9', label: '28-9' },
      { display: '25-6', label: '25-6' },
      { display: '23-4', label: '23-4' },
      { display: '20-1', label: '20-1' },
    ],
  },
  {
    id: 18,
    clues: ['Which digit will make the equation true: 82 - _____ = 91 - 43'],
    answers: [{ display: '34', label: '34' }],
  },
  {
    id: 19,
    clues: ['Which number is shown?'],
    clueImage: blocks45,
    answers: [{ display: '45', label: '45' }],
  },
  {
    id: 20,
    clues: ['52 rounded to nearest Tens'],
    answers: [{ display: '50', label: '50' }],
  },
  {
    id: 21,
    clues: ['Last third month of the year'],
    answers: [{ display: 'October', label: 'October' }],
  },
  {
    id: 22,
    clues: ['Altogether days in the month of July, August, and September'],
    answers: [{ display: '92', label: '92' }],
  },
  {
    id: 23,
    clues: ['Seconds in 1 minute 30 seconds'],
    answers: [{ display: '90', label: '90' }],
  },
  {
    id: 24,
    clues: ['Number of edges in a cube'],
    answers: [{ display: '12', label: '12' }],
  },
  {
    id: 25,
    clues: ['Number of faces in five cuboid'],
    answers: [{ display: '30', label: '30' }],
  },
  {
    id: 26,
    clues: ['Sum of all digits of the year 2025'],
    answers: [{ display: '9', label: '9' }],
  },
  {
    id: 27,
    clues: ['A number with 1 Hundred, 0 Tens, and 0 Ones'],
    answers: [{ display: '100', label: '100' }],
  },
  {
    id: 28,
    clues: ['Subtract two numbers to reach 32'],
    answers: [
      { display: '34-2', label: '34-2' },
      { display: '36-4', label: '36-4' },
      { display: '37-5', label: '37-5' },
      { display: '40-8', label: '40-8' },
      { display: '42-10', label: '42-10' },
    ],
  },
  {
    id: 29,
    clues: ['A number with 2 at the Tens Place'],
    answers: [
      { display: '26', label: '26' },
      { display: '27', label: '27' },
      { display: '29', label: '29' },
      { display: '21', label: '21' },
      { display: '22', label: '22' },
      { display: '23', label: '23' },
    ],
  },
  {
    id: 30,
    clues: ['3 steps forward from 189'],
    answers: [{ display: '192', label: '192' }],
  },
  {
    id: 31,
    clues: ['8 steps backward from 176'],
    answers: [{ display: '168', label: '168' }],
  },
  {
    id: 32,
    clues: ['The sign of greater than'],
    answers: [{ display: '>', label: '>' }],
  },
  {
    id: 33,
    clues: ['The sign of less than'],
    answers: [{ display: '<', label: '<' }],
  },
  {
    id: 34,
    clues: ['Even number that comes after 197'],
    answers: [
      { display: '198', label: '198' },
      { display: '200', label: '200' },
      { display: '202', label: '202' },
      { display: '208', label: '208' },
    ],
  },
  {
    id: 35,
    clues: ['An odd number greater than 10 and less than 15'],
    answers: [
      { display: '11', label: '11' },
      { display: '13', label: '13' },
    ],
  },
  {
    id: 36,
    clues: ['Number of days in the month of August'],
    answers: [{ display: '31', label: '31' }],
  },
  {
    id: 37,
    clues: ['90 divided by 6'],
    answers: [{ display: '15', label: '15' }],
  },
  {
    id: 38,
    clues: ['Number of hours in quarter a day'],
    answers: [{ display: '6', label: '6' }],
  },
  {
    id: 39,
    clues: ['The shape of a Honeycomb'],
    answers: [      { display: honeyComb1, label: 'Hexagon shapcirc', isImage:true },
      { display: honeyComb2, label: 'Hexagon', isImage:true }],
  },
  {
    id: 40,
    clues: ['Weekend'],
    answers: [
      { display: 'Sat & Sun', label: 'Saturday and Sunday' },
    ],
  },
];

// ─────────────────────────────────────────────
// AGE GROUP 8-9 YEARS — Fallback to 7-8 clues
// (Add your own 8-9 specific cards here when ready)
// ─────────────────────────────────────────────
export const CLUE_CARDS_8_9: ClueCard[] = [
  {
    id: 1,
    clues: ['Oval in Shape'],
    answers: [
      { display: Mirror, label: 'Mirror', isImage:true },
      { display: runningTrack, label: 'Running Track', isImage:true },
      // { display: runningTrack, label: 'Running Track', isImage: true }
      { display: Badminton, label: 'Badminton Racquet', isImage:true },
    ],
  },
  {
    id: 2,
    clues: ['A shape of a Rectangle'],
    answers: [
      // { display: '📺', label: 'TV' },
      { display: TV, label: 'TV',isImage: true },
      { display: Ruler, label: 'Ruler', isImage:true },
      { display: ChocolateBar, label: 'Chocolate Bar', isImage:true },
      // { display: '📋', label: 'Blackboard' },
      { display: blackboard, label: 'Blackboard', isImage: true },
      { display: Whiteboard, label: 'Whiteboard', isImage: true }
    ],
  },
  {
    id: 3,
    clues: ['A shape of a Square'],
    answers: [
      { display: Cheeseslice, label: 'Cheese Slice', isImage:true },
      // { display: , label: 'Ludo Board', isImage:true },
      // { display: '♟️', label: 'Chess Board' },
         { display: ludoBoard, label: 'Ludo Board', isImage: true },   // ✅
    { display: chessBoard, label: 'Chess Board', isImage: true },
    ],
  },
    {
    id: 4,
    clues: ['A shape of a Cone'],
    answers: [
      // { display: '🎉', label: 'Birthday Cap' },
      // { display: '🍦', label: 'Ice Cream Cone' },
      // { display: '🚧', label: 'Traffic Cone' },
        { display: birthdayCap, label: 'Birthday Cap', isImage: true }, // ✅
    { display: IceCreamCone, label: 'Ice Cream Cone',isImage:true },
    { display: trafficCone, label: 'Traffic Cone', isImage: true },
      { display: Pine, label: 'Pine Tree',isImage:true },
      { display: Funnel, label: 'Funnel',isImage:true },
    ],
  },
    {
    id: 5,
    clues: ['A shape of a Triangle'],
    answers: [
      // { display: '🔺', label: 'Nachos' },
      { display: nachos, label: 'Nachos', isImage: true },
      { display: MadAngles, label: 'Mad Angles' ,isImage:true},
      { display: Triangularflaginsports, label: 'Flag',isImage:true },
      // { display: '👔', label: 'Cloth Hanger' },

    { display: Hanger, label: 'Cloth Hanger', isImage: true },
    ],
  },
    {
    id: 6,
    clues: ['A shape of a Cuboid'],
    answers: [
      { display: Matchbox, label: 'Match Box',isImage:true },
      { display: Eraser, label: 'Eraser',isImage:true },
      { display: brick, label: 'Brick',isImage:true },
    ],
  },
    {
    id: 7,
    clues: ['A shape of a Cube'],
    answers: [
      // { display: '🧊', label: 'Sugar Cube' },
      { display: sugarCubeImage, label: "Sugar Cube",isImage:true },
      { display: Rubiccube, label: "Rubik's Cube",isImage:true },

    // { display: rubiksCube, label: "Rubik's Cube", isImage: true }
      { display: Dice, label: 'Dice',isImage:true },
    ],
  },
    {
    id: 8,
    clues: ['A shape of a Cylinder'],
    answers: [
      { display: Waterbottle, label: 'Bottle',isImage:true },
      { display: candle, label: 'Candle',isImage:true },
      { display: gasCylinder, label: 'Gas Cylinder',isImage:true},
      // { display: gasCylinder, label: 'Gas Cylinder', isImage: true },
    ],
  },
    {
    id: 9,
    clues: ['Representation of 3 times of 4'],
    answers: [{ display: '4+4+4', label: '4+4+4' }],
  },
  {
    id: 10,
    clues: ['Representation of 4 groups of 3'],
    answers: [{ display: '3+3+3+3', label: '3+3+3+3' }],
  },
    {
    id: 11,
    clues: ['Number of Ones in 2 Tens'],
    answers: [{ display: '20', label: '20' }],
  },
    {
    id: 12,
    clues: ['Number with 5 Tens and 4 more Ones than Tens'],
    answers: [{ display: '59', label: '59' }],
  },
    {
    id: 13,
    clues: ['Smallest 3 digit number'],
    answers: [{ display: '100', label: '100' }],
  },
    {
    id: 14,
    clues: ['A number greater than 400 and less than 420, divisible by 5'],
    answers: [{ display: '415', label: '415' }],
  },
    {
    id: 15,
    clues: ['The difference between 750 and the sum of 200 and 300'],
    answers: [{ display: '250', label: '250' }],
  },
    {
    id: 16,
    clues: ['Double the difference of 50 and 18'],
    answers: [{ display: '64', label: '64' }],
  },
    {
    id: 17,
    clues: ['The number that is 25 more than 375'],
    answers: [{ display: '400', label: '400' }],
  },
    {
    id: 18,
    clues: ['The next multiple of 6 after 42'],
    answers: [{ display: '48', label: '48' }],
  },
    {
    id: 19,
    clues: ['The previous multiple of 7 before 50'],
    answers: [{ display: '49', label: '49' }],
  },
    {
    id: 20,
    clues: ['The number of Ones in 5 Hundreds'],
    answers: [{ display: '500', label: '500' }],
  },
    {
    id: 21,
    clues: ['The sum of the digits of 456'],
    answers: [{ display: '15', label: '15' }],
  },
    {
    id: 22,
    clues: ['The product of 7 times 8 minus 10'],
    answers: [{ display: '46', label: '46' }],
  },
    {
    id: 23,
    clues: ['The number which when halved gives 36'],
    answers: [{ display: '72', label: '72' }],
  },
    {
    id: 24,
    clues: ['The total number of days in 3 weeks and 2 days.'],
    answers: [{ display: '23', label: '23' }],
  },
    {
    id: 25,
    clues: ['The number of faces in 3 cubes.'],
    answers: [{ display: '18', label: '18' }],
  },
    {
    id: 26,
    clues: ['The sum of first four multiples of 3.'],
    answers: [{ display: '30', label: '30' }],
  },
    {
    id: 27,
    clues: ['The number of weeks in 28 days.'],
    answers: [{ display: '4', label: '4' }],
  },
    {
    id: 28,
    clues: ['Next number in the pattern 5, 11, 23'],
    answers: [{ display: '47', label: '47' }],
  },
    {
    id: 29,
    clues: ['The number of sides in two pentagons.'],
    answers: [{ display: '10', label: '10' }],
  },
    {
    id: 30,
    clues: ['The sum of 222 and 333.'],
    answers: [{ display: '555', label: '555' }],
  },
    {
    id: 31,
    clues: ['The number of Tens in 950.'],
    answers: [{ display: '95', label: '95' }],
  },
    {
    id: 32,
    clues: ['The number on reversing the digits of 409.'],
    answers: [{ display: '904', label: '904' }],
  },
    {
    id: 33,
    clues: ['The sum of digits of the number formed by 6 hundreds, 8 tens and 5 ones.'],
    answers: [{ display: '19', label: '19' }],
  },
    {
    id: 34,
    clues: ['The number of minutes in 1 hour 45 minutes.'],
    answers: [{ display: '105', label: '105' }],
  },
    {
    id: 35,
    clues: ['The number of corners in 2 squares and 1 triangle.'],
    answers: [{ display: '11', label: '11' }],
  },
    {
    id: 36,
    clues: ['The number which when divided by 5 gives 36.'],
    answers: [{ display: '108', label: '108' }],
  },
    {
    id: 37,
    clues: ['The remainder when 100 is divided by 9.'],
    answers: [{ display: '1', label: '1' }],
  },
    {
    id: 38,
    clues: ['The number which when divided by 4 gives the same result as 48÷ 6.'],
    answers: [{ display: '32', label: '32' }],
  },
    {
    id: 39,
    clues: ['The divisor if dividend is 81 and quotient is 9.'],
    answers: [{ display: '9', label: '9' }],
  },
    {
    id: 40,
    clues: ['Next number in the pattern 2, 6, 7, 21, 22.'],
    answers: [{ display: '66', label: '66' }],
  },
];

// ─────────────────────────────────────────────
// Helper: Get correct clue cards for age group
// ─────────────────────────────────────────────
export function getClueCards(age: AgeGroup): ClueCard[] {
  if (age === '7') return CLUE_CARDS_6_7;
  if (age === '8') return CLUE_CARDS_7_8;
  // 9+ falls back to 7-8 cards until you add dedicated 8-9 cards
  return CLUE_CARDS_8_9.length > 0 ? CLUE_CARDS_8_9 : CLUE_CARDS_7_8;
}

// Keep CLUE_CARDS exported for any legacy references
export const CLUE_CARDS = CLUE_CARDS_7_8;

// ─── UTILITY FUNCTIONS (unchanged) ───

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickValidCols(): number[] {
  const MAX_CONSECUTIVE = 2;
  while (true) {
    const cols: number[] = [];
    while (cols.length < 5) {
      const c = Math.floor(Math.random() * 9);
      if (!cols.includes(c)) cols.push(c);
    }
    cols.sort((a, b) => a - b);
    let valid = true;
    let streak = 1;
    for (let i = 1; i < cols.length; i++) {
      if (cols[i] === cols[i - 1] + 1) {
        streak++;
        if (streak > MAX_CONSECUTIVE) { valid = false; break; }
      } else {
        streak = 1;
      }
    }
    if (valid) return cols;
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
    const cols = pickValidCols();
    for (let i = 0; i < 5; i++) {
      ticket[row][cols[i]] = rowCells[i];
    }
  }
  return ticket;
}

// ─── UPDATED: generateTickets now uses age-specific clue cards ───
// export function generateTickets(age: AgeGroup): { tickets: (TicketCell | null)[][][]; } {
//   const clueCards = getClueCards(age); // ✅ Age-wise cards selected here
//   const tickets: (TicketCell | null)[][][] = [];

//   for (let t = 0; t < 9; t++) {
//     const shuffled = shuffle(clueCards);
//     const ticketCards = shuffled.slice(0, 15);

//     const cells: TicketCell[] = ticketCards.map(card => {
//       const answer = pickRandom(card.answers);
//       return {
//         clueId: card.id,
//         display: answer.display,
//         label: answer.label,
//         isImage: answer.isImage ?? false,
//       };
//     });

//     tickets.push(generateTicket(cells));
//   }

//   return { tickets };
// }

// ─── PAIRED CLUE IDs — jo hamesha saath aate hain ───
const PAIRED_CLUE_IDS: [number, number][] = [
  [9, 10], // "2 groups of 3" aur "3 groups of 2" hamesha saath
];

export function generateTickets(age: AgeGroup): { tickets: (TicketCell | null)[][][]; } {
  const clueCards = getClueCards(age);
  const tickets: (TicketCell | null)[][][] = [];

  for (let t = 0; t < 9; t++) {
    let selectedCards: ClueCard[] = [];

    // Step 1: Pehle check karo koi paired clue include hoga ya nahi
    const remainingCards = shuffle(clueCards);
    
    // Paired IDs ko alag kar lo
    const pairedGroups: ClueCard[][] = PAIRED_CLUE_IDS.map(([idA, idB]) => {
      const cardA = clueCards.find(c => c.id === idA)!;
      const cardB = clueCards.find(c => c.id === idB)!;
      return [cardA, cardB];
    }).filter(pair => pair[0] && pair[1]);

    // Wo cards jo kisi pair ka hissa nahi hain
    const pairedIds = PAIRED_CLUE_IDS.flat();
    const unpairedCards = remainingCards.filter(c => !pairedIds.includes(c.id));

    // Step 2: Randomly decide karo kaunsi pairs include hongi
    // (har pair 50% chance se aayegi, ya aap hamesha ek pair force kar sakte ho)
    const includedPairs: ClueCard[][] = [];
    for (const pair of pairedGroups) {
      // 50% chance se pair include hoga — ya hamesha include karna ho toh `true` karo
      if (Math.random() < 0.5) {
        includedPairs.push(pair);
      }
    }

    // Step 3: Kitne unpaired cards chahiye
    const pairSlots = includedPairs.reduce((sum, pair) => sum + pair.length, 0);
    const unpairedNeeded = 15 - pairSlots;

    // Step 4: Unpaired cards se fill karo baaki slots
    const pickedUnpaired = unpairedCards.slice(0, unpairedNeeded);

    // Step 5: Saare cards combine karo aur shuffle karo
    selectedCards = shuffle([
      ...includedPairs.flat(),
      ...pickedUnpaired,
    ]);

    // Step 6: TicketCells banao
    const cells: TicketCell[] = selectedCards.map(card => {
      const answer = pickRandom(card.answers);
      return {
        clueId: card.id,
        display: answer.display,
        label: answer.label,
        isImage: answer.isImage ?? false,
      };
    });

    tickets.push(generateTicket(cells));
  }

  return { tickets };
}

// ─── UPDATED: generateCluesForTicket uses age-specific clue cards ───
// export function generateCluesForTicket(
//   ticket: (TicketCell | null)[][],
//   age?: AgeGroup,
// ): GameClue[] {
//   const clueCards = age ? getClueCards(age) : CLUE_CARDS;

//   const cells: TicketCell[] = [];
//   ticket.forEach(row => row.forEach(cell => {
//     if (cell !== null) cells.push(cell);
//   }));

//   const shuffled = shuffle(cells);

//   return shuffled.map((cell, idx) => {
//     const card = clueCards.find(c => c.id === cell.clueId)!;
//     return {
//       id: idx + 1,
//       clueId: cell.clueId,
//       clueText: pickRandom(card.clues),
//       answerDisplay: cell.display,
//       answerLabel: cell.label,
//       isImage: cell.isImage,
//     };
//   });
// }

export function generateCluesForTicket(
  ticket: (TicketCell | null)[][],
  age?: AgeGroup,
): GameClue[] {
  const clueCards = age ? getClueCards(age) : CLUE_CARDS;

  const cells: TicketCell[] = [];
  ticket.forEach(row => row.forEach(cell => {
    if (cell !== null) cells.push(cell);
  }));

  // Shuffle karo pehle
  let shuffled = shuffle(cells);

  // ─── Paired clues ko adjacent positions pe laao ───
  const pairedIds = PAIRED_CLUE_IDS.flat();
  
  for (const [idA, idB] of PAIRED_CLUE_IDS) {
    const idxA = shuffled.findIndex(c => c.clueId === idA);
    const idxB = shuffled.findIndex(c => c.clueId === idB);

    // Agar dono ticket mein hain toh idxB ko idxA ke theek baad rakho
    if (idxA !== -1 && idxB !== -1) {
      const cellB = shuffled[idxB];
      // idxB ko remove karo
      shuffled.splice(idxB, 1);
      // idxA ke baad insert karo (splice recalculate karo agar idxB < idxA tha)
      const insertAt = idxB < idxA ? idxA : idxA + 1;
      shuffled.splice(insertAt, 0, cellB);
    }
  }

  return shuffled.map((cell, idx) => {
    const card = clueCards.find(c => c.id === cell.clueId)!;
    return {
      id: idx + 1,
      clueId: cell.clueId,
      clueText: pickRandom(card.clues),
      answerDisplay: cell.display,
      answerLabel: cell.label,
      isImage: cell.isImage,
       clueImage: card.clueImage ?? undefined,
    };
  });
}

// ─── HOW TO PLAY INSTRUCTIONS (unchanged) ───
export const mathBolaInstructions = [
  { emoji: '🎫', text: '•	You have chosen your MathBola card — let\'s begin!' },
  { emoji: '📢', text: '•	Get ready! A clue will be read aloud and shown on the screen.' },
  { emoji: '🧮', text: '•	Think fast — you have 20 seconds for each clue.' },
  { emoji: '✅', text: '•	Solve it and search for the matching clue on your card.' },
  { emoji: '❌', text: '•	Found it? Cross it out quickly!' },
  { emoji: '🏆', text: '•	Not there? Stay sharp for the next clue.' },
  { emoji: '🏆', text: '•	There are 15 clues in this round — keep going!' },
  { emoji: '🏆', text: '•	Race to cross out any 5 clues on your card.' },
  { emoji: '🏆', text: '•	Be the fastest to complete your Early 5 and win!' },
];