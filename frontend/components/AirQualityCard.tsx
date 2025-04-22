import React from 'react';
import { AirQualityData } from '../types/weather';

interface AirQualityCardProps {
  airQuality: AirQualityData;
}

const AirQualityCard: React.FC<AirQualityCardProps> = ({ airQuality }) => {
  // Get AQI rating text and color
  const getAqiInfo = (aqi: number) => {
    if (aqi <= 1) return { label: 'Good', color: 'bg-green-500' };
    if (aqi <= 2) return { label: 'Fair', color: 'bg-yellow-500' };
    if (aqi <= 3) return { label: 'Moderate', color: 'bg-orange-500' };
    if (aqi <= 4) return { label: 'Poor', color: 'bg-red-500' };
    return { label: 'Very Poor', color: 'bg-purple-500' };
  };

  const aqiInfo = getAqiInfo(airQuality.aqi);

  return (
    <div className="p-4 bg-white shadow-md" style={ { borderRadius: 0 }}>
      <div className="text-gray-600">Air Quality</div>
      <div className="text-2xl font-bold mt-2">{aqiInfo.label}</div>

      <div className="mt-4 relative">
        <div className="w-full h-4 bg-gray-200 relative">
          <div
            className={`h-full ${aqiInfo.color}`}
            style={ { width: `${(airQuality.aqi / 5) * 100}%` }}
          ></div>
        </div>

        {/* Major pollutants */}
        <div className="mt-3 text-sm">
          <p className="font-medium">Major pollutants:</p>
          <div className="grid grid-cols-2 gap-1 mt-1">
            <div>PM2.5: {airQuality.components.pm2_5.toFixed(2)} µg/m³</div>
            <div>PM10: {airQuality.components.pm10.toFixed(2)} µg/m³</div>
            <div>O3: {airQuality.components.o3.toFixed(2)} µg/m³</div>
            <div>NO2: {airQuality.components.no2.toFixed(2)} µg/m³</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirQualityCard;