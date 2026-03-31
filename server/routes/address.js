import express from 'express';
const router = express.Router();

router.get('/autocomplete', async (req, res) => {
  try {
    const { input } = req.query;
    console.log('Searching for:', input);

    if (!input || input.length < 3) {
      return res.json({ predictions: [] });
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}&addressdetails=1&limit=5`,
      {
        headers: {
          'User-Agent': 'GAULA-KORNER/1.0'
        }
      }
    );
    
    const data = await response.json();
    
    const predictions = data.map((place) => ({
      place_id: place.place_id,
      description: place.display_name,
      structured_formatting: {
        main_text: place.name || place.display_name.split(',')[0],
        secondary_text: place.display_name.split(',').slice(1).join(',').trim()
      },
      lat: place.lat,
      lon: place.lon
    }));
    
    res.json({ predictions });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;