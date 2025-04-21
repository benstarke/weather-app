import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import SearchBar from '../components/SearchBar';
import CurrentWeatherCard from '../components/CurrentWeatherCard';
import ForecastCard from '../components/ForecastCard';
import WeatherDetailCard from '../components/WeatherDetailCard';
import { City, CurrentWeather, DailyForecast } from '../types/weather';
import { getCurrentWeather, getForecast } from '../services/api';

export default function Home() {
  // State for weather data
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load weather data when city or units change
  useEffect(() => {
    const loadWeatherData = async () => {
      if (!selectedCity) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Get current weather and forecast in parallel
        const [weatherData, forecastData] = await Promise.all([
          getCurrentWeather(selectedCity.lat, selectedCity.lon, units),
          getForecast(selectedCity.lat, selectedCity.lon, units)
        ]);
        
        setCurrentWeather(weatherData);
        // Limit to next 3 days
        setForecast(forecastData.slice(1, 4));
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError('Failed to fetch weather data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadWeatherData();
  }, [selectedCity, units]);

  // Handle city selection from search
  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
  };

  // Toggle between Celsius and Fahrenheit
  const toggleUnits = (newUnit: 'metric' | 'imperial') => {
    setUnits(newUnit);
  };

  // Default to Nairobi if no city is selected (for demo purposes)
  useEffect(() => {
    if (!selectedCity) {
      // Default to Nairobi
      setSelectedCity({
        name: 'Nairobi',
        country: 'KE',
        lat: -1.292066,
        lon: 36.821945
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Weather App</title>
        <meta name="description" content="Weather application with forecast" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[600px]">
          {/* Left Panel - Current Weather - Full Height */}
          <div className="lg:col-span-1 h-full">
            {currentWeather && (
              <div className="h-full">
                <CurrentWeatherCard weather={currentWeather} units={units} />
              </div>
            )}
          </div>

          {/* Right Panel - Search and Forecast */}
          <div className="lg:col-span-3">
            {/* Search Bar and Unit Toggle */}
            <div className="flex items-center mb-6">
              <div className="flex-grow">
                <SearchBar onCitySelect={handleCitySelect} />
              </div>
              <div className="ml-4">
                {/* Updated unit toggle to match wireframe and search bar height */}
                <div className="flex border border-gray-300 h-10" style={{ borderRadius: 0 }}>
                  <button 
                    className={`px-4 ${units === 'metric' ? 'bg-gray-200' : 'bg-white'}`}
                    onClick={() => toggleUnits('metric')}
                    style={{ borderRadius: 0 }}
                  >
                    °C
                  </button>
                  <button 
                    className={`px-4 ${units === 'imperial' ? 'bg-gray-200' : 'bg-white'}`}
                    onClick={() => toggleUnits('imperial')}
                    style={{ borderRadius: 0 }}
                  >
                    °F
                  </button>
                </div>
              </div>
            </div>

            {/* Loading and Error States */}
            {loading && (
              <div className="text-center py-8">
                <div className="spinner-circle"></div>
                <p className="mt-2">Loading weather data...</p>
              </div>
            )}

            {error && (
              <div className="alert alert-error" style={{ borderRadius: 0 }}>
                <p>{error}</p>
              </div>
            )}

            {/* 3-Day Forecast */}
            {!loading && forecast.length > 0 && (
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {forecast.map((day, index) => (
                    <ForecastCard key={index} forecast={day} units={units} />
                  ))}
                </div>
              </div>
            )}

            {/* Weather Details */}
            {!loading && currentWeather && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <WeatherDetailCard 
                  title="Wind Status" 
                  value={currentWeather.wind.speed}
                  unit={units === 'metric' ? 'km/h' : 'mph'}
                />
                <WeatherDetailCard 
                  title="Humidity" 
                  value={currentWeather.main.humidity}
                  unit="%"
                  showProgress={true}
                  progressValue={currentWeather.main.humidity}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}