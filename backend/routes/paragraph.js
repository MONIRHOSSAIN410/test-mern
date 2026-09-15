import express from "express";

const router = express.Router();

// English paragraph served to the Search Page (Searchtxt.jsx)
const paragraph = `In the quiet hours of dawn, a small fishing village along the coast begins to stir. Fishermen prepare their nets while the gentle aroma of freshly brewed tea fills the air. Children run along the sandy shore, laughing as the waves gently kiss their feet. The old lighthouse standing tall at the edge of the village has guided sailors safely home for over a century. Every evening, the sky turns brilliant shades of orange and purple, painting a breathtaking backdrop over the calm sea. Life here moves slowly, guided by the rhythm of the tides and the changing seasons, reminding everyone that patience and nature always walk hand in hand.`;

router.get("/", (req, res) => {
  res.json({ success: true, text: paragraph });
});

export default router;
