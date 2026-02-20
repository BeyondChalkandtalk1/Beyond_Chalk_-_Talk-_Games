// MCQ questions for each month (index 0 = January, 11 = December)
// enableMCQ flag se poora feature on/off hota hai

export const enableMCQ = true; // ← isko false karo to MCQ band ho jaata hai

export const MONTH_MCQ = [
  // 0 - January
  {
    question: "January mein kitne din hote hain? ❄️",
    options: ["28", "30", "31", "32"],
    correct: 2,
    fact: "January mein 31 din hote hain! Yeh saal ka pehla mahina hai. 🎉",
  },
  // 1 - February
  {
    question: "February kiss liye famous hai? 💕",
    options: ["Halloween", "Valentine's Day", "Diwali", "Christmas"],
    correct: 1,
    fact: "February 14 ko Valentine's Day manaya jaata hai! 💝",
  },
  // 2 - March
  {
    question: "March mein kaun sa festival aata hai? 🌸",
    options: ["Eid", "Holi", "Dussehra", "Baisakhi"],
    correct: 1,
    fact: "March mein Holi aata hai — rang aur khushi ka tyohaar! 🌈",
  },
  // 3 - April
  {
    question: "April Fool's Day kab manaya jaata hai? 🌧️",
    options: ["April 10", "April 15", "April 1", "April 30"],
    correct: 2,
    fact: "April 1 ko April Fool's Day hota hai — mazaak ka din! 😄",
  },
  // 4 - May
  {
    question: "International Labour Day kab hai? 🌻",
    options: ["May 5", "May 1", "May 15", "May 31"],
    correct: 1,
    fact: "1 May ko Mazdoor Diwas (Labour Day) manaya jaata hai! 👷",
  },
  // 5 - June
  {
    question: "World Environment Day kab manaya jaata hai? ☀️",
    options: ["June 1", "June 10", "June 5", "June 21"],
    correct: 2,
    fact: "5 June ko World Environment Day hota hai — pedh lagao! 🌳",
  },
  // 6 - July
  {
    question: "India ka Independence Day kab hai? 🌈",
    options: ["July 4", "July 15", "July 26", "July 15"],
    correct: 2,
    fact: "Nahi! India ka Independence Day 15 August ko hota hai! Lekin America ka 4 July ko! 🇮🇳",
  },
  // 7 - August
  {
    question: "India ka Swatantrata Diwas kab hai? 🌾",
    options: ["August 15", "August 26", "August 1", "August 30"],
    correct: 0,
    fact: "15 August 1947 ko India azaad hua tha! Jai Hind! 🇮🇳🎉",
  },
  // 8 - September
  {
    question: "Teachers' Day India mein kab manaya jaata hai? 📚",
    options: ["Sep 1", "Sep 5", "Sep 10", "Sep 15"],
    correct: 1,
    fact: "5 September ko Dr. Sarvepalli Radhakrishnan ke janamdin par Teachers' Day manate hain! 📖",
  },
  // 9 - October
  {
    question: "Gandhi Jayanti kab manaya jaata hai? 🎃",
    options: ["October 15", "October 10", "October 2", "October 31"],
    correct: 2,
    fact: "2 October ko Mahatma Gandhi ka janamdin hai — Gandhi Jayanti! 🕊️",
  },
  // 10 - November
  {
    question: "Bal Diwas kab manaya jaata hai? 🍂",
    options: ["Nov 5", "Nov 14", "Nov 20", "Nov 26"],
    correct: 1,
    fact: "14 November ko Chacha Nehru ke birthday par Bal Diwas (Children's Day) manate hain! 🧒",
  },
  // 11 - December
  {
    question: "Christmas kab manaya jaata hai? 🎄",
    options: ["December 20", "December 24", "December 26", "December 25"],
    correct: 3,
    fact: "25 December ko Christmas manaya jaata hai — gifts aur khushi ka din! 🎁",
  },
];
