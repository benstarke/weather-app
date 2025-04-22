import React from 'react';
import { DailyForecast } from '../types/weather';
import AnimatedWeatherIcon from './AnimatedWeatherIcon';

interface EnhancedForecastCardProps {
  forecast: DailyForecast;
  units: string;
}

const EnhancedForecastCard: React.FC<EnhancedForecastCardProps> = ({ forecast, units }) => {
  const tempUnit = units === 'metric' ? '°C' : '°F';
  const precipProbability = Math.round(forecast.pop * 100);

  return (
    <div className="p-4 bg-white shadow-md" style={ { borderRadius: 0 }}>
      <div className="font-medium text-center">{forecast.day}</div>
      <div className="font-light text-xs text-center text-gray-600">{forecast.date}</div>
      <div className="flex justify-center my-2">
        <AnimatedWeatherIcon
          icon={forecast.weather.icon}
          description={forecast.weather.description}
          size={50}
        />
      </div>
      <div className="text-sm text-center">
        {forecast.temp_min.toFixed(2)}-{forecast.temp_max.toFixed(2)}{tempUnit}
      </div>

      {/* Precipitation information */}
      {precipProbability > 0 && (
        <div className="mt-2 flex items-center justify-center text-xs">
          <span className="mr-1 text-blue-500">💧</span>
          <span>{precipProbability}%</span>

          {/* Rainfall or snowfall amount if available */}
          {forecast.rain && <span className="ml-2">Rain: {forecast.rain.toFixed(2)} mm</span>}
          {forecast.snow && <span className="ml-2">Snow: {forecast.snow.toFixed(2)} mm</span>}
        </div>
      )}
    </div>
  );
};

export default EnhancedForecastCard;