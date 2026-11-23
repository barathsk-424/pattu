// Birthday Surprise Website Configuration
const CONFIG = {
  // Birthday Star Info
  recipientName: "Tharuma",
  recipientNickname: "my absolute favorite human",
  birthdayDate: "July 1st", // Used in count down/display

  // Background Music
  // You can replace this link with any direct mp3 link (e.g. from Google Drive, Dropbox, or a public CDN)
  musicUrl: "love.mp3?v=2",
  musicVolume: 0.3,

  // Balloons Game Settings
  // Keywords that pop up when each balloon is popped
  balloonKeywords: [
    "hand touching🫴",
    "eye to eye contact👀",
    "night talk😉",
    "cute smile😊",
    "insta talk💬",
    "cuteness 😍",
    "childness👶",
    "Growing Together ❤️‍🩹"
  ],

  // Memories Slideshow/Gallery
  // Keep the filenames consistent with what you upload or use the generated assets
  memories: [
    {
      url: "assets/memory1.jpg",
      caption: "Lost in thoughts, still the prettiest 🌸"
    },
    {
      url: "assets/memory2.jpg",
      caption: "my cutest girl 💜"
    },
    {
      url: "assets/memory3.jpg",
      caption: "Hiding that cute smile 🙈"
    },
    {
      url: "assets/memory4.jpg",
      caption: "This smile is my whole world 😊"
    }
  ],

  // Personal Letter Content
  // Supports basic text structure. It will type out character by character.
  letterText: `My Dearest Tharuma,

Happy Birthday to the most wonderful person in my life! ❤️
hiiii thango 
first happa birthday di papa 
etha year nee ethukum feel pana kudathu seriya entha problem vanthalum na eruken eppothum erupen ini ok ethukum ini feel panatha life long kuda irupen ethu enoda promise life ennala mudicha lavuku happya vechukuren na thapu panalum seri nee thapu panalum sorry nane vanthu samathanam paduthuren nane first sorry kekuren ego unkitha eppothum katha maten kutty kutty sanda podala Periya sanda la poda maten suppose periya sanda vanthalum end of the day 12.00 kula antha sandaya mudichikala next puthu sanda podalaunna alugura mathuri ethume nadathuka maten aprm evlo nal eppadi eruthen teriyathu na life la vanthathuku aprm you are my property yarakavum ethukum vithu kuduka maten evlo periya broblem vanthlum last varaikum fight panuren ok va unna vida maten teriya unkitha konjam nal tha pesi irupen ana romba close ana mathuri feel aguthu aprm ellathukum thanks na polaburathala kethu eruka athuku
anyways
love you endlessly, always and forever.



Yours,
[sk] 💍`,

  // Grand Finale Settings
  // Can be a YouTube embed video or a custom message
  // To use a YouTube video, get the embed link (e.g., https://www.youtube.com/embed/VIDEO_ID)
  videoUrl: "", // Leave empty — no video
  finaleText: "Happy Birthday, My Star! ✨ May all your wishes come true today and always.",

  // ── NEW: "Together since" live counter on the hero screen ──
  // Set this to the day your story began (YYYY-MM-DD). Leave "" to hide the counter.
  togetherSince: "2024-02-14", // ← CHANGE THIS to your real date

  // ── NEW: "reasons of love" flip cards (new chapter after Memories) ──
  reasons: [
    { emoji: "😊", text: "Your smile makes every bad day disappear." },
    { emoji: "🫶", text: "One message from you turns my whole day into something special.." },
    { emoji: "😂", text: "Your laugh is my favourite song in the world." },
    { emoji: "🌙", text: "Our late-night talks feel like home." },
    { emoji: "🌱", text: "You make me want to become a better person." },
    { emoji: "♾️", text: "Because with you, forever feels too short." }
  ],

  // ── NEW: Scratch card in the finale ──
  scratchCardMessage: "entha birthday un kuda eruka mudiyala next oru oru birthday yum mudicha alavuku un kuda eruthu celebrate panuren sorry and miss you",

  // ── NEW: Floating "I love you" in many languages (finale) ──
  loveLanguages: [
    "love you", "நான் உன்னை காதலிக்கிறேன்", "నేను నిన్ను ప్రేమిస్తున్నాను",
    "मुझे तुमसे प्यार है", "Te amo", "Je t'aime", "Ti amo", "Ich liebe dich",
    "愛してる", "사랑해", "Eu te amo", "Seni seviyorum"
  ],

  // ── NEW: Love Quiz (new chapter after Reasons) ──
  // answer: index of the right option (0-3), or "all" if every option is right.
  quiz: [
    {
      q: "Who is the most beautiful birthday star in the world?",
      options: ["Tharuma 😍", "Also Tharuma 💖", "Still Tharuma 🌸", "Only Tharuma 👑"],
      answer: "all",
      right: "Every answer was correct — just like you 😌"
    },
    {
      q: "How much do I love you?",
      options: ["A little 🤏", "A lot 💗", "To the moon 🌙", "Infinity & beyond ♾️"],
      answer: 3,
      right: "Correct! And then some more 💞",
      wrong: "Way more than that! Try again 😉"
    },
    {
      q: "What's my favourite thing about you?",
      options: ["Your smile 😊", "Your heart 💓", "Your laugh 😂", "Everything 💞"],
      answer: 3,
      right: "Yes! Every single thing 🥰",
      wrong: "Close… but think bigger 😏"
    }
  ],

  // ── NEW: "Dedicated to You" chapter (song dedication) ──
  dedicationSong: {
    title: "Our Song",              // ← the song's name
    artist: "Played with love, by sk", // ← artist, or a little note
    url: ""                          // optional separate mp3; "" = uses the background music
  },
  dedicationLines: [
    "For the one who turned my ordinary days into a love story.",
    "Every time this plays, I see your smile.",
    "If my heart had a soundtrack, it would sound exactly like you.",
    "Happy Birthday, my forever favourite song. 🎶"
  ],

  // ── NEW: Keepsake card (finale "Save" button) ──
  keepsakeFrom: "sk", // signature shown on the downloadable card

  // Easter Eggs
  hiddenMessage: "Psst... You found the secret message! I have a special dinner reservation for us tonight at 7 PM. Dress up! 😉",
  konamiCodeResponse: "💖 UNLIMITED LOVE MODE ACTIVATED 💖"
};

// Export config for module usage if needed (or keep global)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
