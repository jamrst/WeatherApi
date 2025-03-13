import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  try {
    const { cityName } = req.body;
    console.log('city:', cityName);
    if (!cityName) {
      return res.status(400).json({ error: 'City is required' });
    }

    // TODO: GET weather data from city name
    const weatherData = await WeatherService.getWeatherForCity(cityName);
    console.log('weatherDataWR:', weatherData);

    if (!weatherData) {
      return res.status(404).json({ error: 'City not found or weather data unavailable' });
    }

    // TODO: save city to search history
    const historyEntry = await HistoryService.addCity(cityName);

    return res.status(200).json({ weather: weatherData, historyId: historyEntry.id });
  } catch (error) {
    console.error('Error processing weather request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// TODO: GET search history
router.get('/history', async (_, res) => {
  try {
    const history = await HistoryService.getCities();
    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching search history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await HistoryService.removeCity(id);
    res.status(204).send(); // 204 No Content for successful deletion
  } catch (error) {
    console.error('Error deleting history entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
