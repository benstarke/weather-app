import { City, CurrentWeather, DailyForecast } from '../types/weather';

const API_BASE_URL = '/api';

export const searchCity = async (query: string): Promise<City[]> => {
  const response = await fetch(`${API_BASE_URL}/weather/search?q=${query}`);
  return await response.json();
};

export const getCurrentWeather = async (lat: number, lon: number, units: string = 'metric'): Promise<CurrentWeather> => {
  const response = await fetch(`${API_BASE_URL}/weather/current?lat=${lat}&lon=${lon}&units=${units}`);
  return await response.json();
};

export const getForecast = async (lat: number, lon: number, units: string = 'metric'): Promise<DailyForecast[]> => {
  const response = await fetch(`${API_BASE_URL}/weather/forecast?lat=${lat}&lon=${lon}&units=${units}`);
  return await response.json();
};