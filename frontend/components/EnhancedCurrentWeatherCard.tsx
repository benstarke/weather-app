import React from 'react';
import { CurrentWeather } from '../types/weather';
import AnimatedWeatherIcon from './AnimatedWeatherIcon';

interface EnhancedCurrentWeatherCardProps {
  weather: CurrentWeather;
  units: string;
}

const EnhancedCurrentWeatherCard: React.FC<EnhancedCurrentWeatherCardProps> = ({ weather, units }) => {
  const tempUnit = units === 'metric' ? '°C' : '°F';

  // Day/Night indicator
  const isDay = isDaytime(weather.dt, weather.sys.sunrise, weather.sys.sunset);

  // Check for precipitation
  const hasPrecipitation = weather.rain?.['1h'] || weather.snow?.['1h'];
  const precipAmount = weather.rain?.['1h']
    ? `${weather.rain['1h'].toFixed(2)} mm rain`
    : weather.snow?.['1h']
      ? `${weather.snow['1h'].toFixed(2)} mm snow`
      : null;

  return (
    <div className={`p-6 flex flex-col h-full transition-colors duration-500 ${getWeatherBackground(weather, isDay)}`} style={ { borderRadius: 0 }}>
      <div className="flex items-center justify-center flex-grow-0">
        <AnimatedWeatherIcon
          icon={weather.weather[0].icon}
          description={weather.weather[0].description}
          size={80}
        />
      </div>
      <div className="text-center mt-4 flex-grow-0">
        <div className="text-4xl font-bold">{Math.round(weather.main.temp)}{tempUnit}</div>
        <div className="text-xl capitalize mt-2">{weather.weather[0].description}</div>
        <div className="text-sm mt-1">Feels like {Math.round(weather.main.feels_like)}{tempUnit}</div>

        {/* Day/Night indicator */}
        <div className="mt-2 text-sm">
          <span className={` INLINE-block w-4 h-4 rounded-full mr-1 ${isDay ? 'bg-yellow-400' : 'bg-indigo-900'}`}></span>
          <span>{isDay ? 'Day' : 'Night'}</span>
        </div>

        {/* Precipitation if present */}
        {precipAmount && (
          <div className="mt-2 text-sm">
            <span className="text-blue-500">💧</span> {precipAmount}
          </div>
        )}
      </div>

      {/* Sunrise/Sunset times */}
      <div className="text-center mt-auto pt-8 flex-grow-0">
        <div className="flex justify-between text-xs">
          <div>
            <span className="text-yellow-500">🌅</span> {formatTime(weather.sys.sunrise)}
          </div>
          <div>
            <span className="text-orange-500">🌇</span> {formatTime(weather.sys.sunset)}
          </div>
        </div>
      </div>

      {/* Weather alerts if present */}
      {weather.alerts && weather.alerts.length > 0 && (
        <div className="mt-4 p-2 bg-red-100 border-l-4 border-red-500 text-red-700">
          <div className="font-bold">Weather Alert:</div>
          <div className="text-sm">{weather.alerts[0].event}</div>
        </div>
      )}
    </div>
  );
};

// Helper function to format time
function formatTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

// Helper function to determine if it's daytime
function isDaytime(currentTime: number, sunrise: number, sunset: number): boolean {
  return currentTime >= sunrise && currentTime < sunset;
}

// Helper function to get appropriate background class based on weather
function getWeatherBackground(weather: CurrentWeather, isDay: boolean): string {
  const condition = weather.weather[0].main.toLowerCase();

  if (!isDay) {
    return 'bg-indigo-900 text-white';
  }

  switch (condition) {
    case 'clear':
      return 'bg-blue-400 text-white';
    case 'clouds':
      return 'bg-gray-300 text-gray-800';
    case 'rain':
    case 'drizzle':
      return 'bg-blue-700 text-white';
    case 'thunderstorm':
      return 'bg-gray-800 text-white';
    case 'snow':
      return 'bg-blue-100 text-gray-800';
    case 'mist':
    case 'fog':
      return 'bg-gray-400 text-gray-800';
    default:
      return 'bg-white text-gray-800';
  }
}

export default EnhancedCurrentWeatherCard;