// routes/lullabyRoutes.js
import express from 'express';

const router = express.Router();

const lullabies = {
  calm: [
    "🌙 Brahms' Lullaby – <a href='https://www.youtube.com/watch?v=t894eGoymio' target='_blank'>Listen</a>",
    "✨ Twinkle Twinkle Little Star – <a href='https://www.youtube.com/watch?v=yCjJyiqpAuU' target='_blank'>Watch</a>",
    "🎵 Clair de Lune by Debussy – <a href='https://www.youtube.com/watch?v=CvFH_6DNRCY' target='_blank'>Listen</a>",
    "🌌 Weightless by Marconi Union – <a href='https://www.youtube.com/watch?v=UfcAVejslrU' target='_blank'>Listen</a>",
  ],
  sleepy: [
    "🛏️ Rock-a-bye Baby – <a href='https://www.youtube.com/watch?v=6bsLz1FIyNc' target='_blank'>Watch</a>",
    "😴 Sleep Baby Sleep – <a href='https://www.youtube.com/watch?v=8xxzJ8fs3Uw' target='_blank'>Listen</a>",
    "🌙 Lullaby by Johannes Brahms (Instrumental) – <a href='https://www.youtube.com/watch?v=Kro5Xx5eYOQ' target='_blank'>Listen</a>",
    "💤 Canon in D by Pachelbel – <a href='https://www.youtube.com/watch?v=NlprozGcs80' target='_blank'>Listen</a>",
  ],
  playful: [
    "🎈 The Wheels on the Bus – <a href='https://www.youtube.com/watch?v=GzrjwOQpAl0' target='_blank'>Sing Along</a>",
    "🕺 If You’re Happy and You Know It – <a href='https://www.youtube.com/watch?v=71hqRT9U0wg' target='_blank'>Watch</a>",
    "🎶 Baby Shark Dance – <a href='https://www.youtube.com/watch?v=XqZsoesa55w' target='_blank'>Watch</a>",
    "🎉 Hokey Pokey – <a href='https://www.youtube.com/watch?v=iZinb6rVozc' target='_blank'>Sing Along</a>",
  ],
  joyful: [
    "😊 You Are My Sunshine – <a href='https://www.youtube.com/watch?v=2F6XFNtXhRk' target='_blank'>Watch</a>",
    "🌞 Over the Rainbow – <a href='https://www.youtube.com/watch?v=PSZxmZmBfnU' target='_blank'>Listen</a>",
    "🎤 Let It Go (Frozen) – <a href='https://www.youtube.com/watch?v=L0MK7qz13bU' target='_blank'>Watch</a>",
  ],
  soothing: [
    "🌿 Sounds of Nature for Sleep – <a href='https://www.youtube.com/watch?v=OdIJ2x3nxzQ' target='_blank'>Listen</a>",
    "🕊️ Gentle Rain Sounds – <a href='https://www.youtube.com/watch?v=7cOuF0Xv3Gc' target='_blank'>Listen</a>",
    "🎼 Soft Piano Lullaby – <a href='https://www.youtube.com/watch?v=9Q1IdbWyQHc' target='_blank'>Listen</a>",
  ],
};

router.post('/', (req, res) => {
  const { mood } = req.body;
  if (!mood || !lullabies[mood]) {
    return res.status(400).json({ reply: 'Please select a valid mood.' });
  }

  const randomPick = lullabies[mood][Math.floor(Math.random() * lullabies[mood].length)];
  res.json({ reply: randomPick });
});

export default router;
