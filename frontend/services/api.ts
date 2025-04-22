import { City, CurrentWeather, DailyForecast, HourlyForecast, AirQualityData } from '../types/weather';

const API_BASE_URL = '/api';

// Add caching
const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

const getCachedData = <T>(key: string): T | null => {
  const cachedItem = cache[key];
  if (cachedItem && Date.now() - cachedItem.timestamp < CACHE_DURATION) {
    return cachedItem.data as T;
  }
  return null;
};

const setCachedData = <T>(key: string, data: T): void => {
  cache[key] = {
    data,
    timestamp: Date.now(),
  };
};

export const searchCity = async (query: string): Promise<City[]> => {
  const cacheKey = `search-${query}`;
  const cachedData = getCachedData<City[]>(cacheKey);
  
  if (cachedData) return cachedData;
  
  try {
    const response = await fetch(`${API_BASE_URL}/weather/search?q=${query}`);
    if (!response.ok) throw new Error('City search failed');
    
    const data = await response.json();
    setCachedData(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error searching cities:', error);
    throw error;
  }
};

export const getCurrentWeather = async (lat: number, lon: number, units: string = 'metric'): Promise<CurrentWeather> => {
  const cacheKey = `current-${lat}-${lon}-${units}`;
  const cachedData = getCachedData<CurrentWeather>(cacheKey);
  
  if (cachedData) return cachedData;
  
  try {
    const response = await fetch(`${API_BASE_URL}/weather/current?lat=${lat}&lon=${lon}&units=${units}`);
    if (!response.ok) throw new Error('Failed to fetch current weather');
    
    const data = await response.json();
    setCachedData(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error getting current weather:', error);
    throw error;
  }
};

export const getForecast = async (lat: number, lon: number, units: string = 'metric'): Promise<DailyForecast[]> => {
  const cacheKey = `forecast-${lat}-${lon}-${units}`;
  const cachedData = getCachedData<DailyForecast[]>(cacheKey);
  
  if (cachedData) return cachedData;
  
  try {
    const response = await fetch(`${API_BASE_URL}/weather/forecast?lat=${lat}&lon=${lon}&units=${units}`);
    if (!response.ok) throw new Error('Failed to fetch forecast');
    
    const data = await response.json();
    setCachedData(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error getting forecast:', error);
    throw error;
  }
};

export const getHourlyForecast = async (lat: number, lon: number, units: string = 'metric'): Promise<HourlyForecast[]> => {
  const cacheKey = `hourly-${lat}-${lon}-${units}`;
  const cachedData = getCachedData<HourlyForecast[]>(cacheKey);
  
  if (cachedData) return cachedData;
  
  try {
    const response = await fetch(`${API_BASE_URL}/weather/hourly?lat=${lat}&lon=${lon}&units=${units}`);
    if (!response.ok) throw new Error('Failed to fetch hourly forecast');
    
    const data = await response.json();
    setCachedData(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error getting hourly forecast:', error);
    throw error;
  }
};

export const getAirQuality = async (lat: number, lon: number): Promise<AirQualityData> => {
  const cacheKey = `air-${lat}-${lon}`;
  const cachedData = getCachedData<AirQualityData>(cacheKey);
  
  if (cachedData) return cachedData;
  
  try {
    const response = await fetch(`${API_BASE_URL}/weather/air-quality?lat=${lat}&lon=${lon}`);
    if (!response.ok) throw new Error('Failed to fetch air quality data');
    
    const data = await response.json();
    setCachedData(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error getting air quality:', error);
    throw error;
  }
};

// New utility function for location detection
export const getUserLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }
  });
};
