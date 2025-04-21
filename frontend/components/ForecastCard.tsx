import React from 'react';
import { DailyForecast } from '../types/weather';
import WeatherIcon from './WeatherIcon';

interface ForecastCardProps {
  forecast: DailyForecast;
  units: string;
}

const ForecastCard: React.FC<ForecastCardProps> = ({ forecast, units }) => {
  const tempUnit = units === 'metric' ? '°C' : '°F';

  return (
    <div className="p-4 bg-white shadow-md text-center" style={{ borderRadius: 0 }}>
      <div className="font-medium">{forecast.day}</div>
      <div className="flex justify-center my-2">
        <WeatherIcon 
          icon={forecast.weather.icon} 
          description={forecast.weather.description}
          size={50}
        />
      </div>
      <div className="text-sm">
        {Math.round(forecast.temp_min)}-{Math.round(forecast.temp_max)}{tempUnit}
      </div>
    </div>
  );
};

export default ForecastCard;