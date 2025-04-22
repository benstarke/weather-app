import React from 'react';
import Image from 'next/image';

interface AnimatedWeatherIconProps {
  icon: string;
  description: string;
  size?: number;
  animated?: boolean;
}

const AnimatedWeatherIcon: React.FC<AnimatedWeatherIconProps> = ({ 
  icon, 
  description, 
  size = 50, 
  animated = true 
}) => {
  // Mapping for animated icons - in a real app, you'd have actual animated icons
  const getIconUrl = () => {
    if (animated) {
      // In a real implementation, you would have animated versions
      return `https://openweathermap.org/img/wn/${icon}@2x.png`;
    }
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  };

  return (
    <Image 
      src={getIconUrl()} 
      alt={description}
      width={size} 
      height={size}
      className={animated ? "weather-icon-animated" : ""}
    />
  );
};

export default AnimatedWeatherIcon;