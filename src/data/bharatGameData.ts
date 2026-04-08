import table1 from "../assets/Bharat/Table/1.png"
import table2 from "../assets/Bharat/Table/2.png"
import table3 from "../assets/Bharat/Table/3.png"
import table4 from "../assets/Bharat/Table/4.png"
import table5 from "../assets/Bharat/Table/5.png"
import table6 from "../assets/Bharat/Table/6.png"
import table7 from "../assets/Bharat/Table/7.png"
import table8 from "../assets/Bharat/Table/8.png"
import table9 from "../assets/Bharat/Table/9.png"
import table10 from "../assets/Bharat/Table/10.png"
import earth from "../assets/Bharat/earth.png"
import bicycle from "../assets/Bharat/2_wheels_of_bicycle.png"
import bealPlant from "../assets/Bharat/3_leaves_in_bael_plant.png"
import violin from "../assets/Bharat/4_strings_in_violin.png"
import starfish from "../assets/Bharat/5_hands_of_starfish.png"
import snowflake from "../assets/Bharat/6_Snowflake.png"
import rainbow from "../assets/Bharat/7_colors_in_rainbow.jpg"
import octopus from "../assets/Bharat/8_hands_of_octopus.png"
import ticTac from "../assets/Bharat/9_squares_in_tic_tac_toe.png"
import bowling from "../assets/Bharat/10_bowling_pins.png"


// Graphical icons for each number (from counting document)
// export const numberIcons: Record<number, { emoji: string; label: string }> = {
//   1: { emoji: '☀️', label: 'sun' },
//   2: { emoji: '🖐️', label: 'hand' },
//   3: { emoji: '🚦', label: 'traffic light' },
//   4: { emoji: '🚗', label: 'car wheel' },
//   5: { emoji: '✋', label: 'fingers' },
//   6: { emoji: '❄️', label: 'snowflake' },
//   7: { emoji: '🌈', label: 'rainbow' },
//   8: { emoji: '🐙', label: 'octopus' },
//   9: { emoji: '🎯', label: 'tic-tac-toe' },
//   10: { emoji: '🎳', label: 'bowling pins' },
// };

// Number words for constructing statements
// const numberWords = [
//   '', 'Ones', 'Two', 'Three', 'Four', 'Five', 
//   'Six', 'Seven', 'Eight', 'Nine', 'Ten'
// ];
// ✅ Sahi
const numberWords = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 
  'Six', 'Seven', 'Eight', 'Nine', 'Ten'
];

const resultWords: Record<number, string> = {
  1: 'One', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five',
  6: 'Six', 7: 'Seven', 8: 'Eight', 9: 'Nine', 10: 'Ten',
  11: 'Eleven', 12: 'Twelve', 13: 'Thirteen', 14: 'Fourteen', 15: 'Fifteen',
  16: 'Sixteen', 17: 'Seventeen', 18: 'Eighteen', 19: 'Nineteen', 20: 'Twenty',
  21: 'Twenty One', 22: 'Twenty Two', 23: 'Twenty Three', 24: 'Twenty Four',
  25: 'Twenty Five', 26: 'Twenty Six', 27: 'Twenty Seven', 28: 'Twenty Eight',
  29: 'Twenty Nine', 30: 'Thirty', 31: 'Thirty One', 32: 'Thirty Two',
  33: 'Thirty Three', 34: 'Thirty Four', 35: 'Thirty Five', 36: 'Thirty Six',
  37: 'Thirty Seven', 38: 'Thirty Eight', 39: 'Thirty Nine', 40: 'Forty',
  41: 'Forty One', 42: 'Forty Two', 43: 'Forty Three', 44: 'Forty Four',
  45: 'Forty Five', 46: 'Forty Six', 47: 'Forty Seven', 48: 'Forty Eight',
  49: 'Forty Nine', 50: 'Fifty', 54: 'Fifty Four', 56: 'Fifty Six',
  60: 'Sixty', 63: 'Sixty Three', 64: 'Sixty Four', 70: 'Seventy',
  72: 'Seventy Two', 80: 'Eighty', 81: 'Eighty One', 90: 'Ninety', 100: 'Hundred'
};


export const numberIcons: Record<number, { emoji: string; label: string; represents: string }> = {
  1: { emoji: earth, label: 'earth', represents: '1 – Represents the Earth' },
  2: { emoji: bicycle, label: 'bicycle', represents: '2 – Represents the wheels of a bicycle' },
  3: { emoji: bealPlant, label: 'bael plant', represents: '3 – Represents the leaves of a Bael plant' },
  4: { emoji: violin, label: 'violin', represents: '4 – Represents the strings of a violin' },
  5: { emoji: starfish, label: 'starfish', represents: '5 – Represents the arms of a starfish' },
  6: { emoji: snowflake, label: 'snowflake', represents: '6 – Represents the sides of a snowflake' },
  7: { emoji: rainbow, label: 'rainbow', represents: '7 – Represents the colors of a rainbow' },
  8: { emoji: octopus, label: 'octopus', represents: '8 – Represents the arms of an octopus' },
  9: { emoji: ticTac, label: 'tic-tac-toe', represents: '9 – Represents the squares of a tic-tac-toe board' },
  10: { emoji: bowling, label: 'bowling pins', represents: '10 – Represents the bowling pins' },
};


export interface StepData {
  step: number;
  title: string;
  content: {
    writtenText: string;
    additionForm: string;
    graphicalIcons: string[];
    graphicalLabel: string;
    arrayRows: number;
    arrayCols: number;
    multiplicationForm: string;
    result: number;
  };
}

const pluralWords: Record<string, string> = {
  'One': 'Ones',
  'Two': 'Twos',
  'Three': 'Threes',
  'Four': 'Fours',
  'Five': 'Fives',
  'Six': 'Sixes',
  'Seven': 'Sevens',
  'Eight': 'Eights',
  'Nine': 'Nines',
  'Ten': 'Tens',
};

// export function getStatementText(tableOf: number, multipliedBy: number): string {
//   const result = tableOf * multipliedBy;
//   const tableWord = numberWords[tableOf];
//   const multWord = numberWords[multipliedBy];
//   const resultWord = resultWords[result] || result.toString();
  
//   // Format: "Three Ones are Three" or "Three One is Three"
//   const pluralMult = tableOf === 1 ? multWord : multWord;
//   const verb = tableOf === 1 ? 'is' : 'are';
  
//   return `${tableWord} ${pluralMult} ${verb} ${resultWord}`;
// }

export function getStatementText(tableOf: number, multipliedBy: number): string {
  const result = tableOf * multipliedBy;
  const tableWord = numberWords[tableOf];
  const multWord = numberWords[multipliedBy];
  const resultWord = resultWords[result] || result.toString();

  // Plural tabOf > 1 ho to plural form use karo
  const pluralMult = tableOf === 1 ? multWord : (pluralWords[multWord] ?? multWord);
  const verb = tableOf === 1 ? 'is' : 'are';

  return `${tableWord} ${pluralMult} ${verb} ${resultWord}`;
}

// export function getAdditionForm(tableOf: number, multipliedBy: number): string {
//   const result = tableOf * multipliedBy;
//   if (tableOf === 1) {
//     return `${multipliedBy} = ${result}`;
//   }
//   const parts = Array(tableOf).fill(multipliedBy).join('+');
//   return `${parts} = ${result}`;
// }

export function getAdditionForm(tableOf: number, multipliedBy: number): string {
  const result = tableOf * multipliedBy;
  if (tableOf === 1) {
    return `${multipliedBy}`;  // ✅ Sirf number dikhao, koi = nahi
  }
  const parts = Array(tableOf).fill(multipliedBy).join(' + ');
  return `${parts} = ${result}`;
}

export function getMultiplicationForm(tableOf: number, multipliedBy: number): string {
  return `${tableOf} × ${multipliedBy} = ${tableOf * multipliedBy}`;
}

export function getGraphicalRepresentation(tableOf: number, multipliedBy: number) {
  const icon = numberIcons[multipliedBy];
  // Show tableOf groups of the icon
  const groups: string[][] = [];
  for (let i = 0; i < tableOf; i++) {
    groups.push([icon.emoji]);
  }
  return { groups, label: icon.label, emoji: icon.emoji };
}

export function generateStepData(tableOf: number, multipliedBy: number): StepData {
  const icon = numberIcons[multipliedBy];
  const graphicalIcons = Array(tableOf).fill(icon.emoji);
  
  return {
    step: multipliedBy,
    title: `${tableOf} × ${multipliedBy}`,
    content: {
      writtenText: getStatementText(tableOf, multipliedBy),
      additionForm: getAdditionForm(tableOf, multipliedBy),
      graphicalIcons,
      graphicalLabel: icon.label,
      arrayRows: tableOf,
      arrayCols: multipliedBy,
      multiplicationForm: getMultiplicationForm(tableOf, multipliedBy),
      result: tableOf * multipliedBy,
    },
  };
}

// export const TABLES_RANGE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const TABLES_RANGE =[
    {
  table: 1,
  image: table1,
  bg:"from-red-400 to-yellow-400 border-red-300" 
},
{
  table: 2,
  image: table2,
  bg:"from-purple-500 to-pink-500 border-purple-400"
},{

  table: 3,
  image: table3,
  bg:"from-cyan-400 to-blue-500 border-cyan-300"
},{
  table: 4,
  image: table4,
  bg:"from-green-400 to-emerald-500 border-green-300"
},{
  table: 5,
  image: table5,
  bg:"from-orange-400 to-amber-400 border-orange-300"
},{
  table: 6,
  image: table6,
  bg:"from-fuchsia-500 to-rose-500 border-fuchsia-400"
},{
  table: 7,
  image: table7,
  bg:"from-indigo-500 to-violet-500 border-indigo-400"
},{
  table: 8,
  image: table8,
  bg:"from-teal-400 to-green-400 border-teal-300"
},{
  table: 9,   
  image: table9,
  bg:"from-red-500 to-orange-400 border-red-400"
},{
  table: 10,
  image: table10,
  bg:"from-yellow-400 to-sky-400 border-yellow-300"
}

];

export const STEP_LABELS = [
  'Written Text',
  'Say It Aloud',
  'Addition Form',
  'Graphical Representation',
  'Array / Grid Form',
  'Multiplication Form',
];
