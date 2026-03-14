export const lessons = {
  targetLanguage: "en",
  scenes: [
    {
      id: "home",
      title: "Greetings at Home",
      cards: [
        {
          cardId: "home-hello",
          emoji: "👋",
          imagePlaceholder: "/images/hello.jpg",
          phrase: "Hello",
          audioAssetId: "en-home-hello-1"
        },
        {
          cardId: "home-how-are-you",
          emoji: "🙂",
          imagePlaceholder: "/images/how-are-you.jpg",
          phrase: "How are you?",
          audioAssetId: "en-home-how-are-you-1"
        },
        {
          cardId: "home-i-am-fine",
          emoji: "😊",
          imagePlaceholder: "/images/i-am-fine.jpg",
          phrase: "I am fine.",
          audioAssetId: "en-home-i-am-fine-1"
        },
        {
          cardId: "home-see-you-later",
          emoji: "👋",
          imagePlaceholder: "/images/goodbye.jpg",
          phrase: "See you later.",
          audioAssetId: "en-home-see-you-later-1"
        },
        {
          cardId: "home-good-morning",
          emoji: "🌅",
          imagePlaceholder: "/images/good-morning.jpg",
          phrase: "Good morning.",
          audioAssetId: "en-home-good-morning-1"
        },
        {
          cardId: "home-good-night",
          emoji: "🌙",
          imagePlaceholder: "/images/good-night.jpg",
          phrase: "Good night.",
          audioAssetId: "en-home-good-night-1"
        },
        {
          cardId: "home-welcome",
          emoji: "🤗",
          imagePlaceholder: "/images/home-welcome.png",
          phrase: "Welcome.",
          audioAssetId: "en-home-welcome-1"
        },
        {
          cardId: "home-please-come-in",
          emoji: "🚪",
          imagePlaceholder: "/images/please-come-in.jpg",
          phrase: "Please come in.",
          audioAssetId: "en-home-please-come-in-1"
        },
        {
          cardId: "home-have-a-nice-day",
          emoji: "🌞",
          imagePlaceholder: "/images/home-have-a-nice-day.png",
          phrase: "Have a nice day.",
          audioAssetId: "en-home-have-a-nice-day-1"
        },
        {
          cardId: "home-thank-you",
          emoji: "🙏",
          imagePlaceholder: "/images/thank-you.jpg",
          phrase: "Thank you.",
          audioAssetId: "en-home-thank-you-1"
        }
      ]
    },
    {
      id: "market",
      title: "At the Market",
      cards: [
        {
          cardId: "market-water",
          emoji: "💧",
          imagePlaceholder: "/images/water.jpg",
          phrase: "Water",
          audioAssetId: "en-market-water-1",
          phonicsWords: [
            { word: "Water", sounds: [
              { letters: "W", audioAssetId: "phonics-w" },
              { letters: "a", audioAssetId: "phonics-short-a" },
              { letters: "t", audioAssetId: "phonics-t" },
              { letters: "er", audioAssetId: "phonics-er" }
            ]}
          ]
        },
        {
          cardId: "market-how-much-is-this",
          emoji: "❓",
          imagePlaceholder: "/images/how-much-is-this.jpg",
          phrase: "How much is this?",
          audioAssetId: "en-market-how-much-is-this-1",
          phonicsWords: [
            { word: "How", sounds: [
              { letters: "H", audioAssetId: "phonics-h" },
              { letters: "ow", audioAssetId: "phonics-ow-diphthong" }
            ]},
            { word: "much", sounds: [
              { letters: "m", audioAssetId: "phonics-m" },
              { letters: "u", audioAssetId: "phonics-short-u" },
              { letters: "ch", audioAssetId: "phonics-ch" }
            ]},
            { word: "is", sounds: [
              { letters: "i", audioAssetId: "phonics-short-i" },
              { letters: "s", audioAssetId: "phonics-s" }
            ]},
            { word: "this", sounds: [
              { letters: "th", audioAssetId: "phonics-th-voiced" },
              { letters: "i", audioAssetId: "phonics-short-i" },
              { letters: "s", audioAssetId: "phonics-s" }
            ]}
          ]
        },
        {
          cardId: "market-this-costs-twenty-dollars",
          emoji: "💵",
          imagePlaceholder: "/images/this-costs-20-dollars.jpg",
          phrase: "This costs twenty dollars.",
          audioAssetId: "en-market-this-costs-twenty-dollars-1",
          phonicsWords: [
            { word: "This", sounds: [
              { letters: "Th", audioAssetId: "phonics-th-voiced" },
              { letters: "i", audioAssetId: "phonics-short-i" },
              { letters: "s", audioAssetId: "phonics-s" }
            ]},
            { word: "costs", sounds: [
              { letters: "c", audioAssetId: "phonics-k" },
              { letters: "o", audioAssetId: "phonics-long-o" },
              { letters: "s", audioAssetId: "phonics-s" },
              { letters: "t", audioAssetId: "phonics-t" },
              { letters: "s", audioAssetId: "phonics-s" }
            ]},
            { word: "twenty", sounds: [
              { letters: "t", audioAssetId: "phonics-t" },
              { letters: "w", audioAssetId: "phonics-w" },
              { letters: "e", audioAssetId: "phonics-short-e" },
              { letters: "n", audioAssetId: "phonics-n" },
              { letters: "t", audioAssetId: "phonics-t" },
              { letters: "y", audioAssetId: "phonics-long-e" }
            ]},
            { word: "dollars", sounds: [
              { letters: "d", audioAssetId: "phonics-d" },
              { letters: "o", audioAssetId: "phonics-long-o" },
              { letters: "ll", audioAssetId: "phonics-l" },
              { letters: "ar", audioAssetId: "phonics-er" },
              { letters: "s", audioAssetId: "phonics-s" }
            ]}
          ]
        },
        {
          cardId: "market-i-want-apples",
          emoji: "🍎",
          imagePlaceholder: "/images/apple.jpg",
          phrase: "I want apples.",
          audioAssetId: "en-market-i-want-apples-1",
          phonicsWords: [
            { word: "I", sounds: [
              { letters: "I", audioAssetId: "phonics-ice" }
            ]},
            { word: "want", sounds: [
              { letters: "w", audioAssetId: "phonics-w" },
              { letters: "a", audioAssetId: "phonics-short-a" },
              { letters: "n", audioAssetId: "phonics-n" },
              { letters: "t", audioAssetId: "phonics-t" }
            ]},
            { word: "apples", sounds: [
              { letters: "a", audioAssetId: "phonics-short-a" },
              { letters: "pp", audioAssetId: "phonics-p" },
              { letters: "l", audioAssetId: "phonics-l" },
              { letters: "e", audioAssetId: null },
              { letters: "s", audioAssetId: "phonics-s" }
            ]}
          ]
        },
        {
          cardId: "market-i-want-meat",
          emoji: "🥩",
          imagePlaceholder: "/images/chicken.jpg",
          phrase: "I want meat.",
          audioAssetId: "en-market-i-want-meat-1",
          phonicsWords: [
            { word: "I", sounds: [
              { letters: "I", audioAssetId: "phonics-ice" }
            ]},
            { word: "want", sounds: [
              { letters: "w", audioAssetId: "phonics-w" },
              { letters: "a", audioAssetId: "phonics-short-a" },
              { letters: "n", audioAssetId: "phonics-n" },
              { letters: "t", audioAssetId: "phonics-t" }
            ]},
            { word: "meat", sounds: [
              { letters: "m", audioAssetId: "phonics-m" },
              { letters: "ea", audioAssetId: "phonics-long-e" },
              { letters: "t", audioAssetId: "phonics-t" }
            ]}
          ]
        },
        {
          cardId: "market-i-want-rice",
          emoji: "🍚",
          imagePlaceholder: "/images/rice.jpg",
          phrase: "I want rice.",
          audioAssetId: "en-market-i-want-rice-1",
          phonicsWords: [
            { word: "I", sounds: [
              { letters: "I", audioAssetId: "phonics-ice" }
            ]},
            { word: "want", sounds: [
              { letters: "w", audioAssetId: "phonics-w" },
              { letters: "a", audioAssetId: "phonics-short-a" },
              { letters: "n", audioAssetId: "phonics-n" },
              { letters: "t", audioAssetId: "phonics-t" }
            ]},
            { word: "rice", sounds: [
              { letters: "r", audioAssetId: "phonics-r" },
              { letters: "i", audioAssetId: "phonics-ice" },
              { letters: "c", audioAssetId: "phonics-s" },
              { letters: "e", audioAssetId: null }
            ]}
          ]
        },
        {
          cardId: "market-where-is-the-milk",
          emoji: "🥛",
          imagePlaceholder: "/images/milk.jpg",
          phrase: "Where can I get milk?",
          audioAssetId: "en-market-where-is-the-milk-1",
          phonicsWords: [
            { word: "Where", sounds: [
              { letters: "Wh", audioAssetId: "phonics-wh" },
              { letters: "ere", audioAssetId: "phonics-air" }
            ]},
            { word: "can", sounds: [
              { letters: "c", audioAssetId: "phonics-k" },
              { letters: "a", audioAssetId: "phonics-short-a" },
              { letters: "n", audioAssetId: "phonics-n" }
            ]},
            { word: "I", sounds: [
              { letters: "I", audioAssetId: "phonics-ice" }
            ]},
            { word: "get", sounds: [
              { letters: "g", audioAssetId: "phonics-g" },
              { letters: "e", audioAssetId: "phonics-short-e" },
              { letters: "t", audioAssetId: "phonics-t" }
            ]},
            { word: "milk", sounds: [
              { letters: "m", audioAssetId: "phonics-m" },
              { letters: "i", audioAssetId: "phonics-short-i" },
              { letters: "l", audioAssetId: "phonics-l" },
              { letters: "k", audioAssetId: "phonics-k" }
            ]}
          ]
        },
        {
          cardId: "market-thats-too-expensive",
          emoji: "😕",
          imagePlaceholder: null,
          phrase: "That is too expensive.",
          audioAssetId: "en-market-thats-too-expensive-1",
          phonicsWords: [
            { word: "That", sounds: [
              { letters: "Th", audioAssetId: "phonics-th-voiced" },
              { letters: "a", audioAssetId: "phonics-short-a" },
              { letters: "t", audioAssetId: "phonics-t" }
            ]},
            { word: "is", sounds: [
              { letters: "i", audioAssetId: "phonics-short-i" },
              { letters: "s", audioAssetId: "phonics-s" }
            ]},
            { word: "too", sounds: [
              { letters: "t", audioAssetId: "phonics-t" },
              { letters: "oo", audioAssetId: "phonics-y-oo" }
            ]},
            { word: "expensive", sounds: [
              { letters: "e", audioAssetId: "phonics-short-i" },
              { letters: "x", audioAssetId: ["phonics-k", "phonics-s"] },
              { letters: "p", audioAssetId: "phonics-p" },
              { letters: "e", audioAssetId: "phonics-short-e" },
              { letters: "n", audioAssetId: "phonics-n" },
              { letters: "s", audioAssetId: "phonics-s" },
              { letters: "i", audioAssetId: "phonics-short-i" },
              { letters: "ve", audioAssetId: "phonics-v" }
            ]}
          ]
        },
        {
          cardId: "market-can-you-give-discount",
          emoji: "🤝",
          imagePlaceholder: null,
          phrase: "Can you give a discount?",
          audioAssetId: "en-market-can-you-give-discount-1",
          phonicsWords: [
            { word: "Can", sounds: [
              { letters: "C", audioAssetId: "phonics-k" },
              { letters: "a", audioAssetId: "phonics-short-a" },
              { letters: "n", audioAssetId: "phonics-n" }
            ]},
            { word: "you", sounds: [
              { letters: "y", audioAssetId: "phonics-j" },
              { letters: "ou", audioAssetId: "phonics-y-oo" }
            ]},
            { word: "give", sounds: [
              { letters: "g", audioAssetId: "phonics-g" },
              { letters: "i", audioAssetId: "phonics-short-i" },
              { letters: "ve", audioAssetId: "phonics-v" }
            ]},
            { word: "a", sounds: [
              { letters: "a", audioAssetId: "phonics-short-a" }
            ]},
            { word: "discount", sounds: [
              { letters: "d", audioAssetId: "phonics-d" },
              { letters: "i", audioAssetId: "phonics-short-i" },
              { letters: "s", audioAssetId: "phonics-s" },
              { letters: "c", audioAssetId: "phonics-k" },
              { letters: "ou", audioAssetId: "phonics-ow-diphthong" },
              { letters: "n", audioAssetId: "phonics-n" },
              { letters: "t", audioAssetId: "phonics-t" }
            ]}
          ]
        },
        {
          cardId: "market-i-dont-have-money",
          emoji: "😔",
          imagePlaceholder: null,
          phrase: "I don't have money.",
          audioAssetId: "en-market-i-dont-have-money-1",
          phonicsWords: [
            { word: "I", sounds: [
              { letters: "I", audioAssetId: "phonics-ice" }
            ]},
            { word: "don't", sounds: [
              { letters: "d", audioAssetId: "phonics-d" },
              { letters: "o", audioAssetId: "phonics-long-o" },
              { letters: "n", audioAssetId: "phonics-n" },
              { letters: "t", audioAssetId: "phonics-t" }
            ]},
            { word: "have", sounds: [
              { letters: "h", audioAssetId: "phonics-h" },
              { letters: "a", audioAssetId: "phonics-short-a" },
              { letters: "ve", audioAssetId: "phonics-v" }
            ]},
            { word: "money", sounds: [
              { letters: "m", audioAssetId: "phonics-m" },
              { letters: "o", audioAssetId: "phonics-short-u" },
              { letters: "n", audioAssetId: "phonics-n" },
              { letters: "ey", audioAssetId: "phonics-long-e" }
            ]}
          ]
        }
      ]
    },
    {
      id: "clinic",
      title: "At the Clinic",
      cards: [
        {
          cardId: "clinic-i-feel-sick",
          emoji: "🤒",
          imagePlaceholder: "/images/sick.jpg",
          phrase: "I feel sick.",
          audioAssetId: "en-clinic-i-feel-sick-1"
        },
        {
          cardId: "clinic-i-have-pain",
          emoji: "😣",
          imagePlaceholder: "/images/i-am-hurt.jpg",
          phrase: "I have pain.",
          audioAssetId: "en-clinic-i-have-pain-1"
        },
        {
          cardId: "clinic-my-head-hurts",
          emoji: "🤕",
          imagePlaceholder: "/images/my-head-hurts.jpg",
          phrase: "My head hurts.",
          audioAssetId: "en-clinic-my-head-hurts-1"
        },
        {
          cardId: "clinic-my-stomach-hurts",
          emoji: "🤢",
          imagePlaceholder: "/images/my-stomach-hurts.jpg",
          phrase: "My stomach hurts.",
          audioAssetId: "en-clinic-my-stomach-hurts-1"
        },
        {
          cardId: "clinic-i-need-a-doctor",
          emoji: "🩺",
          imagePlaceholder: "/images/doctor.jpg",
          phrase: "I need a doctor.",
          audioAssetId: "en-clinic-i-need-a-doctor-1"
        },
        {
          cardId: "clinic-do-i-need-medicine",
          emoji: "💊",
          imagePlaceholder: "/images/medicine.jpg",
          phrase: "Do I need medicine?",
          audioAssetId: "en-clinic-do-i-need-medicine-1"
        },
        {
          cardId: "clinic-how-many-times-a-day",
          emoji: "⏰",
          imagePlaceholder: null,
          phrase: "How many times a day?",
          audioAssetId: "en-clinic-how-many-times-a-day-1"
        },
        {
          cardId: "clinic-i-am-allergic",
          emoji: "🤧",
          imagePlaceholder: "/images/clinic-i-am-allergic.png",
          phrase: "I am allergic.",
          audioAssetId: "en-clinic-i-am-allergic-1"
        },
        {
          cardId: "clinic-thank-you-doctor",
          emoji: "🙏",
          imagePlaceholder: "/images/thank-you.jpg",
          phrase: "Thank you, doctor.",
          audioAssetId: "en-clinic-thank-you-doctor-1"
        },
        {
          cardId: "clinic-when-should-i-come-back",
          emoji: "📅",
          imagePlaceholder: null,
          phrase: "When should I come back?",
          audioAssetId: "en-clinic-when-should-i-come-back-1"
        }
      ]
    },
    {
      id: "fable",
      title: "Advanced Story (Fable)",
      cards: [
        {
          cardId: "fable2",
          emoji: "📖",
          imagePlaceholder: "/images/oldlady_elephant.png",
          phrase: "The Old Woman and the Elephant",
          isAdvanced: true
        },
        {
          cardId: "0_07_to_0_11",
          emoji: "📖",
          imagePlaceholder: "/images/elephant_moral.png",
          phrase: "The moral of the story is that if we help someone, they will help us when we need them.",
          isAdvanced: true
        }
      ]
    }
  ]
};
