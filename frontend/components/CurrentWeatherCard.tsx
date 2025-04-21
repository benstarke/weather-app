import React from 'react';
import { CurrentWeather } from '../types/weather';
import WeatherIcon from './WeatherIcon';

interface CurrentWeatherCardProps {
  weather: CurrentWeather;
  units: string;
}

const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ weather, units }) => {
  // Format date to match wireframe (e.g., "20th May 2027")
  const date = new Date(weather.dt * 1000);
  
  // Get day with ordinal suffix (1st, 2nd, 3rd, etc.)
  const day = date.getDate();
  const ordinalSuffix = getOrdinalSuffix(day);
  
  // Get month name and year
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const year = date.getFullYear();
  
  // Construct the formatted date string to match wireframe
  const formattedDate = `${day}${ordinalSuffix} ${month} ${year}`;
  
  const tempUnit = units === 'metric' ? '°C' : '°F';

  return (
    <div className="p-6 bg-white shadow-md flex flex-col h-full" style={{ borderRadius: 0 }}>
      <div className="flex items-center justify-center flex-grow-0">
        <WeatherIcon 
          icon={weather.weather[0].icon} 
          description={weather.weather[0].description}
          size={80}
        />
      </div>
      <div className="text-center mt-4 flex-grow-0">
        <div className="text-4xl font-bold">{Math.round(weather.main.temp)}{tempUnit}</div>
        <div className="text-xl capitalize mt-2">{weather.weather[0].description}</div>
      </div>
      {/* Use flex-grow to push this to bottom */}
      <div className="text-center mt-auto pt-8 flex-grow-0">
        <div className="text-gray-600">{formattedDate}</div>
        <div className="text-gray-600">{weather.name}</div>
      </div>
    </div>
  );
};

// Helper function to get ordinal suffix for day numbers (1st, 2nd, 3rd, etc.)
function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

export default CurrentWeatherCard;