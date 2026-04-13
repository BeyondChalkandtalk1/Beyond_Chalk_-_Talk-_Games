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
//   { number: 1, label: '1 One', speechText: 'One One', image: hand1 },
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

// // Practice question types for PAHAL Practice
// export interface DragOption {
//   image: string;
//   label: string;
// }

// export interface PracticeQuestion {
//   type: 'mcq' | 'fill-blank' | 'drag-drop' | 'drag-count';
//   question: string;
//   options: string[];
//   correctAnswer: string;
//   handImages?: string[];  // images to show with the question
//   dragOptions?: DragOption[];  // for drag-drop questions
//   correctDragLabel?: string;   // label of the correct drag option
//   // drag-count type: drag one image multiple times into a grid
//   dragImage?: string;         // the image to drag (e.g. hand showing 1)
//   correctCount?: number;      // how many times to drag to be correct
//   gridSize?: number;          // max grid slots to show
// }

// // Fixed 10 PAHAL Challenges from the curriculum document
// export function getPracticeQuestions(): PracticeQuestion[] {
//   return [
//     {
//       type: 'mcq',
//       question: 'How many Ones are shown?',
//       handImages: [handRepresentations[7].image],
//       options: ['7', '7 Ones', '70'],
//       correctAnswer: '7 Ones',
//     },
//     {
//       type: 'drag-count',
//       question: 'Drag the hands to show 9 Ones.',
//       options: [],
//       correctAnswer: '9',
//       dragImage: handRepresentations[1].image,
//       correctCount: 9,
//       gridSize: 12,
//     },
//     {
//       type: 'mcq',
//       question: 'Look at the hands. What number is shown?',
//       handImages: [handTen, handRepresentations[2].image],
//       options: ['12', '1 Ten and 2 Ones', '12 Ones'],
//       correctAnswer: '12',
//     },
//     {
//       type: 'drag-count',
//       question: 'Drag the hands to show how many Ones make 2 Tens.',
//       options: [],
//       correctAnswer: '20',
//       dragImage: handRepresentations[1].image,
//       correctCount: 20,
//       gridSize: 24,
//     },
//     {
//       type: 'mcq',
//       question: 'Which box has more Ones?',
//       options: ['Box A: 1 Ten and 3 Ones (13 Ones)', 'Box B: 2 Tens (20 Ones)'],
//       correctAnswer: 'Box B: 2 Tens (20 Ones)',
//     },
//     {
//       type: 'mcq',
//       question: 'How many Ones make 2 Tens?',
//       options: ['10', '20', '15', '25'],
//       correctAnswer: '20',
//     },
//     {
//       type: 'mcq',
//       question: '30 Ones make how many Tens?',
//       options: ['2 Tens', '3 Tens', '4 Tens', '5 Tens'],
//       correctAnswer: '3 Tens',
//     },
//     {
//       type: 'fill-blank',
//       question: '2 Tens and ___ Ones make the number 28.',
//       options: ['6', '8', '10', '18'],
//       correctAnswer: '8',
//     },
//     {
//       type: 'mcq',
//       question: 'How do you make 14 using Tens and Ones?',
//       options: ['1 Ten and 4 Ones', '14 Ones only', '2 Tens and 4 Ones', '1 Ten and 14 Ones'],
//       correctAnswer: '1 Ten and 4 Ones',
//     },
//     {
//       type: 'mcq',
//       question: 'Which is greater: 3 Tens or 29?',
//       options: ['3 Tens (30)', '29'],
//       correctAnswer: '3 Tens (30)',
//     },
//   ];
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
  { number: 1, label: '1 One', speechText: 'One One', image: hand1 },
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
export interface DragOption {
  image: string;
  label: string;
}

export interface PracticeQuestion {
  type: 'mcq' | 'fill-blank' | 'drag-drop' | 'drag-count';
  question: string;
  options: string[];
  correctAnswer: string;
  handImages?: string[];  // images to show with the question
  dragOptions?: DragOption[];  // for drag-drop questions
  correctDragLabel?: string;   // label of the correct drag option
  // drag-count type: drag one image multiple times into a grid
  dragImage?: string;         // the image to drag (e.g. hand showing 1)
  correctCount?: number;      // how many times to drag to be correct
  gridSize?: number;          // max grid slots to show
  validateAnswer?: (droppedHands: { number: number; label: string }[]) => boolean;
}

// Pre-PAHAL Q&A questions (shown after hand representation)
export function getPrePahalQuestions(): PracticeQuestion[] {
  return [
    {
      type: 'mcq',
      question: 'How many Ones are shown?',
      handImages: [handRepresentations[7].image],
      options: ['7', '7 Ones', '70'],
      correctAnswer: '7 Ones',
    },
    // {
    //   type: 'drag-count',
    //   question: 'Drag the hands to show 9 Ones.',
    //   options: [],
    //   correctAnswer: '9',
    //   dragImage: handRepresentations[1].image,
    //   correctCount: 9,
    //   gridSize: 12,
    // },
    {
  type: 'drag-count',
  question: 'Drag the hands to show 9 Ones.',
  options: [],
  correctAnswer: '9',
  dragImage: handRepresentations[1].image,
  correctCount: 9,
  gridSize: 12,
  validateAnswer: (droppedHands: { number: number; label: string }[]) => {
    if (droppedHands.length !== 1) return false;
    return droppedHands[0].number === 9 && droppedHands[0].label === '9 Ones';
  },
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
      question: 'How many Tens are there?',
      handImages: [handTen, handTen],
      options: ['20 Ones', '20', '2 Tens'],
      correctAnswer: '2 Tens',
    },
    {
  type: 'mcq',
  question: 'Look at the hands carefully. What number is being shown?',
  handImages: [
    handRepresentations[10].image, // hand_10 (Ten fist)
    handRepresentations[10].image, // hand_10 (Ten fist)
    handRepresentations[10].image, // hand_10 (Ten fist)
    handRepresentations[6].image,  // hand_6 (6 Ones)
  ],
  options: ['36', '3 Tens and 6 Ones', '30+6'],
  correctAnswer: '36',
},
//     {
//   type: 'drag-count',
//   question: "Drag the hands to show how many 'Ones' make 2 Tens.",
//   options: [],
//   correctAnswer: '2 Tens',
//   dragImage: handRepresentations[1].image,
//   correctCount: 20,
//   gridSize: 24,
//   // ✅ Custom validator: sirf 2x Ten image allowed
//   validateAnswer: (droppedHands: { number: number; label: string }[]) => {
//     const tenCount = droppedHands.filter(h => h.label === '1 Ten').length;
//     const totalValue = droppedHands.reduce((sum, h) => sum + h.number, 0);
//     return tenCount === 2 && totalValue === 20;
//   },
// },
{
  type: 'drag-count',
  question: "Drag the hands to show how many 'Ones' make 2 Tens.",
  options: [],
  correctAnswer: '2 Tens',
  dragImage: handRepresentations[10].image, // ✅ hand_10 (Ten fist) use hoga
  correctCount: 20,
  gridSize: 24,
  validateAnswer: (droppedHands: { number: number; label: string }[]) => {
    const tenCount = droppedHands.filter(h => h.label === '10 Ones').length;
    const totalValue = droppedHands.reduce((sum, h) => sum + h.number, 0);
    return tenCount === 2 && totalValue === 20;
  },
},
    {
      type: 'drag-count',
      question: '30 Ones make how many Tens? Show it by dragging the hands.',
      options: [],
      correctAnswer: '30 ones',
      dragImage: handRepresentations[1].image,
      correctCount: 30,
      gridSize: 24,
        validateAnswer: (droppedHands: { number: number; label: string }[]) => {
    const tenCount = droppedHands.filter(h => h.label === '1 Ten').length;
    const totalValue = droppedHands.reduce((sum, h) => sum + h.number, 0);
    return tenCount === 3 && totalValue === 30;
  },
    },
    {
      type: 'drag-count',
      question: '2 Tens and __ Ones make the number 28. Complete it by dragging the correct hands.',
      options: [],
      correctAnswer: '8 ones',
      dragImage: handRepresentations[1].image,
      correctCount: 8,
      gridSize: 24,
      validateAnswer: (droppedHands: { number: number; label: string }[]) => {
      const tenCount = droppedHands.filter(h => h.label === '8 Ones').length;
      const totalValue = droppedHands.reduce((sum, h) => sum + h.number, 0);
      return tenCount === 1 && totalValue === 8;
  },
    },
  //   {
  //     type: 'drag-count',
  //     question: 'Can you make 14 using Tens and Ones? Drag the hands.',
  //     options: [],
  //     correctAnswer: '8 ones',
  //     dragImage: handRepresentations[1].image,
  //     correctCount: 20,
  //     gridSize: 24,
  //     validateAnswer: (droppedHands: { number: number; label: string }[]) => {
  //     const tenCount = droppedHands.filter(h => h.label === '8 Ones').length;
  //     const totalValue = droppedHands.reduce((sum, h) => sum + h.number, 0);
  //     return tenCount === 1 && totalValue === 8;
  // },
  //   },
  {
  type: 'drag-count',
  question: 'Can you make 14 using Tens and Ones? Drag the hands.',
  options: [],
  correctAnswer: '14',
  dragImage: handRepresentations[1].image,
  correctCount: 14,
  gridSize: 24,
  // ✅ Sirf 1x Ten + 1x Hand_4 allowed
validateAnswer: (droppedHands: { number: number; label: string }[]) => {
  if (droppedHands.length !== 2) return false;
  
  const hasTen = droppedHands.some(h => h.label === '1 Ten');
  const hasFour = droppedHands.some(h => h.number === 4 && h.label !== '1 Ten');
  
  return hasTen && hasFour;
},
},
   {
  type: 'drag-count',
  question: 'How many Ones are there in 3 Tens? Show by dragging the correct hands.',
  options: [],
  correctAnswer: '0',
  dragImage: handRepresentations[0].image,
  correctCount: 0,
  gridSize: 36,
  // ✅ Sirf 1x hand_0 (Zero) allowed
  validateAnswer: (droppedHands: { number: number; label: string }[]) => {
    if (droppedHands.length !== 1) return false;
    return droppedHands[0].number === 0 && droppedHands[0].label === 'Zero';
  },
}
  ];
}

// Level 1 Practice questions (separate from Pre-PAHAL)
export function getLevel1Questions(): PracticeQuestion[] {
  return [
    {
      type: 'mcq',
      question: 'How many Ones make 2 Tens?',
      options: ['10', '20', '15', '25'],
      correctAnswer: '20',
    },
    {
      type: 'mcq',
      question: '30 Ones make how many Tens?',
      options: ['2 Tens', '3 Tens', '4 Tens', '5 Tens'],
      correctAnswer: '3 Tens',
    },
    {
      type: 'fill-blank',
      question: '2 Tens and ___ Ones make the number 28.',
      options: ['6', '8', '10', '18'],
      correctAnswer: '8',
    },
    {
      type: 'mcq',
      question: 'How do you make 14 using Tens and Ones?',
      options: ['1 Ten and 4 Ones', '14 Ones only', '2 Tens and 4 Ones', '1 Ten and 14 Ones'],
      correctAnswer: '1 Ten and 4 Ones',
    },
    {
      type: 'mcq',
      question: 'Which is greater: 3 Tens or 29?',
      options: ['3 Tens (30)', '29'],
      correctAnswer: '3 Tens (30)',
    },
    {
      type: 'drag-count',
      question: 'Drag the hands to show 15 Ones.',
      options: [],
      correctAnswer: '15',
      dragImage: handRepresentations[1].image,
      correctCount: 15,
      gridSize: 20,
    },
    {
      type: 'mcq',
      question: 'What is the place value of 3 in 35?',
      options: ['3 Ones', '3 Tens', '30 Ones', '35'],
      correctAnswer: '3 Tens',
    },
    {
      type: 'fill-blank',
      question: '4 Tens and ___ Ones make 47.',
      options: ['3', '7', '4', '17'],
      correctAnswer: '7',
    },
    {
      type: 'mcq',
      question: 'How many Tens are in 50?',
      options: ['3 Tens', '4 Tens', '5 Tens', '50 Tens'],
      correctAnswer: '5 Tens',
    },
    {
      type: 'mcq',
      question: 'Which is smaller: 2 Tens and 5 Ones or 3 Tens?',
      options: ['2 Tens and 5 Ones (25)', '3 Tens (30)'],
      correctAnswer: '2 Tens and 5 Ones (25)',
    },
  ];
}


