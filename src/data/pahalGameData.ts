// import hand0 from '@/assets/pahal/hand_0.png';
// import hand1 from '@/assets/pahal/hand_1.png';
// import hand2 from '@/assets/pahal/hand_2.png';
// import hand3 from '@/assets/pahal/hand_3.png';
// import hand4 from '@/assets/pahal/hand_4.png';
// import hand5 from '@/assets/pahal/hand_5.png';
// import hand6 from '@/assets/pahal/hand_6.png';
// import hand7 from '@/assets/pahal/hand_7.png';
// import hand8 from '@/assets/pahal/hand_8.png';
// import hand9 from '@/assets/pahal/hand_9.png';
// import hand10 from '@/assets/pahal/hand_10.png';
// import handTen from '@/assets/pahal/hand_ten.png';

// export interface HandRepresentation {
//   number: number;
//   label: string;
//   speechText: string;
//   image: string;
// }

// export const handRepresentations: HandRepresentation[] = [
//   { number: 0, label: 'Zero', speechText: 'Zero', image: hand0 },
//   { number: 1, label: '1 One', speechText: 'One', image: hand1 },
//   { number: 2, label: '2 Ones', speechText: 'Two Ones', image: hand2 },
//   { number: 3, label: '3 Ones', speechText: 'Three Ones', image: hand3 },
//   { number: 4, label: '4 Ones', speechText: 'Four Ones', image: hand4 },
//   { number: 5, label: '5 Ones', speechText: 'Five Ones', image: hand5 },
//   { number: 6, label: '6 Ones', speechText: 'Six Ones', image: hand6 },
//   { number: 7, label: '7 Ones', speechText: 'Seven Ones', image: hand7 },
//   { number: 8, label: '8 Ones', speechText: 'Eight Ones', image: hand8 },
//   { number: 9, label: '9 Ones', speechText: 'Nine Ones', image: hand9 },
//   { number: 10, label: '10 Ones', speechText: 'Ten Ones', image: hand10 },
// ];

// export const tenEqualsImage = handTen;

// // Number words for speech
// const numberWords: Record<number, string> = {
//   0: 'Zero', 1: 'One', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five',
//   6: 'Six', 7: 'Seven', 8: 'Eight', 9: 'Nine', 10: 'Ten',
// };

// export function getNumberWord(n: number): string {
//   return numberWords[n] || n.toString();
// }

// // Practice question types for Pre-PAHAL
// export interface PracticeQuestion {
//   type: 'identify' | 'select-hand' | 'how-many';
//   question: string;
//   options: string[];
//   correctAnswer: string;
//   handImage?: string;
//   number?: number;
// }

// export function generatePracticeQuestions(): PracticeQuestion[] {
//   const questions: PracticeQuestion[] = [];
  
//   // Type 1: Show hand image, ask "How many fingers?"
//   const usedNumbers = new Set<number>();
//   while (questions.length < 5) {
//     const n = Math.floor(Math.random() * 10) + 1; // 1-10
//     if (usedNumbers.has(n)) continue;
//     usedNumbers.add(n);
//     const rep = handRepresentations[n];
//     const opts = generateOptions(n, 0, 10);
//     questions.push({
//       type: 'how-many',
//       question: 'How many Ones does this hand show?',
//       handImage: rep.image,
//       options: opts.map(String),
//       correctAnswer: String(n),
//       number: n,
//     });
//   }

//   // Type 2: Give a number, ask to identify the correct label
//   const usedNumbers2 = new Set<number>();
//   while (questions.length < 10) {
//     const n = Math.floor(Math.random() * 11); // 0-10
//     if (usedNumbers2.has(n)) continue;
//     usedNumbers2.add(n);
//     const rep = handRepresentations[n];
//     const labelOpts = generateLabelOptions(n);
//     questions.push({
//       type: 'identify',
//       question: `What is the correct way to say ${n}?`,
//       options: labelOpts,
//       correctAnswer: rep.label,
//       number: n,
//     });
//   }

//   // Shuffle
//   for (let i = questions.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [questions[i], questions[j]] = [questions[j], questions[i]];
//   }

//   return questions;
// }

// function generateOptions(correct: number, min: number, max: number): number[] {
//   const opts = new Set<number>([correct]);
//   while (opts.size < 4) {
//     const r = Math.floor(Math.random() * (max - min + 1)) + min;
//     opts.add(r);
//   }
//   return shuffleArray([...opts]);
// }

// function generateLabelOptions(correct: number): string[] {
//   const correctLabel = handRepresentations[correct].label;
//   const opts = new Set<string>([correctLabel]);
//   while (opts.size < 4) {
//     const r = Math.floor(Math.random() * 11);
//     opts.add(handRepresentations[r].label);
//   }
//   return shuffleArray([...opts]);
// }

// function shuffleArray<T>(arr: T[]): T[] {
//   for (let i = arr.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [arr[i], arr[j]] = [arr[j], arr[i]];
//   }
//   return arr;
// }


import hand0 from '@/assets/pahal/hand_0.png';
import hand1 from '@/assets/pahal/hand_1.png';
import hand2 from '@/assets/pahal/hand_2.png';
import hand3 from '@/assets/pahal/hand_3.png';
import hand4 from '@/assets/pahal/hand_4.png';
import hand5 from '@/assets/pahal/hand_5.png';
import hand6 from '@/assets/pahal/hand_6.png';
import hand7 from '@/assets/pahal/hand_7.png';
import hand8 from '@/assets/pahal/hand_8.png';
import hand9 from '@/assets/pahal/hand_9.png';
import hand10 from '@/assets/pahal/hand_10.png';
import handTen from '@/assets/pahal/hand_ten.png';

export interface HandRepresentation {
  number: number;
  label: string;
  speechText: string;
  image: string;
}

export const handRepresentations: HandRepresentation[] = [
  { number: 0, label: 'Zero', speechText: 'Zero', image: hand0 },
  { number: 1, label: '1 One', speechText: 'One', image: hand1 },
  { number: 2, label: '2 Ones', speechText: 'Two Ones', image: hand2 },
  { number: 3, label: '3 Ones', speechText: 'Three Ones', image: hand3 },
  { number: 4, label: '4 Ones', speechText: 'Four Ones', image: hand4 },
  { number: 5, label: '5 Ones', speechText: 'Five Ones', image: hand5 },
  { number: 6, label: '6 Ones', speechText: 'Six Ones', image: hand6 },
  { number: 7, label: '7 Ones', speechText: 'Seven Ones', image: hand7 },
  { number: 8, label: '8 Ones', speechText: 'Eight Ones', image: hand8 },
  { number: 9, label: '9 Ones', speechText: 'Nine Ones', image: hand9 },
  { number: 10, label: '10 Ones', speechText: 'Ten Ones', image: hand10 },
];

export const tenEqualsImage = handTen;

// Number words for speech
const numberWords: Record<number, string> = {
  0: 'Zero', 1: 'One', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five',
  6: 'Six', 7: 'Seven', 8: 'Eight', 9: 'Nine', 10: 'Ten',
};

export function getNumberWord(n: number): string {
  return numberWords[n] || n.toString();
}

// Practice question types for PAHAL Practice
export interface PracticeQuestion {
  type: 'mcq' | 'fill-blank';
  question: string;
  options: string[];
  correctAnswer: string;
  handImages?: string[];  // images to show with the question
}

// Fixed 10 PAHAL Challenges from the curriculum document
export function getPracticeQuestions(): PracticeQuestion[] {
  return [
    {
      type: 'mcq',
      question: 'How many Ones are shown?',
      handImages: [handRepresentations[7].image],
      options: ['7', '7 Ones', '70'],
      correctAnswer: '7 Ones',
    },
    {
      type: 'mcq',
      question: 'Which hand shows 9 Ones?',
      options: ['7 Ones', '9 Ones', '10 Ones', '5 Ones'],
      correctAnswer: '9 Ones',
      handImages: [handRepresentations[7].image, handRepresentations[9].image, handRepresentations[10].image, handRepresentations[5].image],
    },
    {
      type: 'mcq',
      question: 'Look at the hands. What number is shown?',
      handImages: [handTen, handRepresentations[2].image],
      options: ['12', '1 Ten and 2 Ones', '12 Ones'],
      correctAnswer: '12',
    },
    {
      type: 'mcq',
      question: 'How many Ones are there?',
      handImages: [handTen, handTen],
      options: ['20 Ones', '20', '2 Tens'],
      correctAnswer: '20 Ones',
    },
    // {
    //   type: 'mcq',
    //   question: 'Which box has more Ones?',
    //   options: ['Box A: 1 Ten and 3 Ones (13 Ones)', 'Box B: 2 Tens (20 Ones)'],
    //   correctAnswer: 'Box B: 2 Tens (20 Ones)',
    // },
    // {
    //   type: 'mcq',
    //   question: 'How many Ones make 2 Tens?',
    //   options: ['10', '20', '15', '25'],
    //   correctAnswer: '20',
    // },
    // {
    //   type: 'mcq',
    //   question: '30 Ones make how many Tens?',
    //   options: ['2 Tens', '3 Tens', '4 Tens', '5 Tens'],
    //   correctAnswer: '3 Tens',
    // },
    // {
    //   type: 'fill-blank',
    //   question: '2 Tens and ___ Ones make the number 28.',
    //   options: ['6', '8', '10', '18'],
    //   correctAnswer: '8',
    // },
    // {
    //   type: 'mcq',
    //   question: 'How do you make 14 using Tens and Ones?',
    //   options: ['1 Ten and 4 Ones', '14 Ones only', '2 Tens and 4 Ones', '1 Ten and 14 Ones'],
    //   correctAnswer: '1 Ten and 4 Ones',
    // },
    // {
    //   type: 'mcq',
    //   question: 'Which is greater: 3 Tens or 29?',
    //   options: ['3 Tens (30)', '29'],
    //   correctAnswer: '3 Tens (30)',
    // },
  ];
}
