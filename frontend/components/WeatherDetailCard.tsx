import React from 'react';

interface WeatherDetailCardProps {
  title: string;
  value: string | number;
  unit?: string;
  showProgress?: boolean;
  progressValue?: number;
}

const WeatherDetailCard: React.FC<WeatherDetailCardProps> = ({ 
  title, 
  value, 
  unit, 
  showProgress = false,
  progressValue = 0
}) => {
  return (
    <div className="p-4 bg-white shadow-md" style={{ borderRadius: 0 }}>
      <div className="text-gray-600">{title}</div>
      <div className="text-2xl font-bold mt-2">
        {value}{unit && ` ${unit}`}
      </div>
      {showProgress && (
        <div className="mt-4 relative">
          <div className="w-full h-4 bg-gray-200 relative">
            <div 
              className="h-full bg-green-500" 
              style={{ width: `${progressValue}%` }}
            ></div>
          </div>
          {/* Add markers for 0, 50, 100 */}
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherDetailCard;