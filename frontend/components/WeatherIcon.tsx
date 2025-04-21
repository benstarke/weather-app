import React from 'react';
import Image from 'next/image';

interface WeatherIconProps {
  icon: string;
  description: string;
  size?: number;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ icon, description, size = 50 }) => {
  return (
    <Image 
      src={`https://openweathermap.org/img/wn/${icon}@2x.png`} 
      alt={description}
      width={size} 
      height={size}
    />
  );
};

export default WeatherIcon;