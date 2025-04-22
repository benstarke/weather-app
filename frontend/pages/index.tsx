import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import SearchBar from '../components/SearchBar';
import EnhancedCurrentWeatherCard from '../components/EnhancedCurrentWeatherCard';
import EnhancedForecastCard from '../components/EnhancedForecastCard';
import HourlyForecastChart from '../components/HourlyForecastChart';
import WeatherDetailCard from '../components/WeatherDetailCard';
import AirQualityCard from '../components/AirQualityCard';
import WeatherActivityIndicator from '../components/WeatherActivityIndicator';
import WeatherTrendsCard from '../components/WeatherTrendsCard';
import { City, CurrentWeather, DailyForecast, HourlyForecast, AirQualityData } from '../types/weather';
import { getCurrentWeather, getForecast, getHourlyForecast, getAirQuality, getUserLocation } from '../services/api';

export default function Home() {
  // State management
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [locating, setLocating] = useState<boolean>(false);

  // Load weather data when city or units change
  useEffect(() => {
    const loadWeatherData = async () => {
      if (!selectedCity) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch all data in parallel
        const [weatherData, forecastData, hourlyData, airQualityData] = await Promise.all([
          getCurrentWeather(selectedCity.lat, selectedCity.lon, units),
          getForecast(selectedCity.lat, selectedCity.lon, units),
          getHourlyForecast(selectedCity.lat, selectedCity.lon, units),
          getAirQuality(selectedCity.lat, selectedCity.lon),
        ]);

        setCurrentWeather(weatherData);
        setForecast(forecastData); // Full week forecast
        setHourlyForecast(hourlyData.slice(0, 24)); // Next 24 hours
        setAirQuality(airQualityData);
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

  // Detect user location
  const detectLocation = async () => {
    setLocating(true);
    setError(null);

    try {
      const position = await getUserLocation();
      const { latitude, longitude } = position.coords;

      // Set user's location as selected city
      setSelectedCity({
        name: 'Your Location',
        country: '',
        lat: latitude,
        lon: longitude,
      });
    } catch (err) {
      console.error('Error getting location:', err);
      setError('Unable to detect your location. Please try searching for a city instead.');
    } finally {
      setLocating(false);
    }
  };

  // Default to Nairobi if no city is selected
  useEffect(() => {
    if (!selectedCity) {
      setSelectedCity({
        name: 'Nairobi',
        country: 'KE',
        lat: -1.292066,
        lon: 36.821945,
      });
    }
  }, []);

  // Format date for sidebar
  const formatSidebarDate = () => {
    if (!currentWeather) return '';
    const date = new Date(currentWeather.dt * 1000);
    const day = date.getDate();
    const ordinalSuffix = getOrdinalSuffix(day);
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const year = date.getFullYear();
    return `${day}${ordinalSuffix} ${month} ${year}`;
  };

  // Helper function to get ordinal suffix
  function getOrdinalSuffix(day: number): string {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      <Head>
        <title>Enhanced Weather App</title>
        <meta name="description" content="Enhanced weather application with forecast and weather impacts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Sidebar/Card for Current Weather */}
      <div className="md:w-80 md:fixed md:top-0 md:left-0 md:h-screen bg-white shadow-md md:flex md:flex-col">
        {currentWeather && (
          <>
            <div className="flex-grow">
              <EnhancedCurrentWeatherCard weather={currentWeather} units={units} />
            </div>
            <div className="p-4 text-center text-gray-600">
              <div>{formatSidebarDate()}</div>
              <div>{currentWeather.name}, {currentWeather.sys.country}</div>
            </div>
          </>
        )}
      </div>

      {/* Main Content Area */}
      <main className="flex-grow md:ml-80 p-4 md:p-8 overflow-auto">
        {/* Search Bar, Unit Toggle, and Location Detection */}
        <div className="flex flex-col sm:flex-row items-center mb-6 gap-4">
          <div className="flex-grow w-full sm:w-auto">
            <SearchBar onCitySelect={handleCitySelect} />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border border-gray-300 h-10" style={{ borderRadius: 0 }}>
              <button
                className={`px-4 ${units === 'metric' ? 'bg-gray-200' : ' bg-white'}`}
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
            <button
              className="bg-blue-500 text-white px-4 h-10 flex items-center"
              onClick={detectLocation}
              disabled={locating}
              style={{ borderRadius: 0 }}
            >
              {locating ? 'Locating...' : '📍 Use My Location'}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Loading and Error States */}
          {loading && (
            <div className="text-center py-8">
              <div className="spinner-circle"></div>
              <p className="mt-2">Loading weather data...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-error p-4 bg-red-100 border-l-4 border-red-500 text-red-700" style={{ borderRadius: 0 }}>
              <p>{error}</p>
            </div>
          )}

          {/* Hourly Forecast Chart */}
          {!loading && hourlyForecast.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Hourly Forecast</h2>
              <HourlyForecastChart forecast={hourlyForecast} units={units} />
            </div>
          )}

          {/* Weekly Forecast */}
          {!loading && forecast.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">7-Day Forecast</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {forecast.slice(0, 7).map((day, index) => (
                  <EnhancedForecastCard key={index} forecast={day} units={units} />
                ))}
              </div>
            </div>
          )}

          {/* Weather Details and Additional Information */}
          {!loading && currentWeather && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <WeatherDetailCard
                title="Wind Status"
                value={currentWeather.wind.speed.toFixed(2)}
                unit={units === 'metric' ? 'km/h' : 'mph'}
              />
              <WeatherDetailCard
                title="Humidity"
                value={currentWeather.main.humidity.toFixed(2)}
                unit="%"
                showProgress={true}
                progressValue={currentWeather.main.humidity}
              />
              <WeatherDetailCard
                title="Visibility"
                value={(currentWeather.visibility / 1000).toFixed(2)}
                unit="km"
              />
              {airQuality && <AirQualityCard airQuality={airQuality} />}
              <WeatherActivityIndicator weather={currentWeather} />
              <WeatherTrendsCard forecast={hourlyForecast} units={units} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}