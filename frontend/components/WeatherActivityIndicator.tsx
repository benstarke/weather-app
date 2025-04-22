import React from 'react';
import { CurrentWeather } from '../types/weather';

interface WeatherActivityIndicatorProps {
  weather: CurrentWeather;
}

const WeatherActivityIndicator: React.FC<WeatherActivityIndicatorProps> = ({ weather }) => {
  const getActivities = () => {
    const condition = weather.weather[0].main.toLowerCase();
    const temp = weather.main.temp;
    const activities = [];

    // Temperature-based activities
    if (temp > 20) { // Warm weather (lowered from 25°C)
      activities.push({ name: 'Swimming', suitable: condition !== 'rain' && condition !== 'thunderstorm', icon: '🏊‍♂️' });
      activities.push({ name: 'Hiking', suitable: condition !== 'rain' && condition !== 'thunderstorm', icon: '🥾' });
      activities.push({ name: 'Cycling', suitable: condition !== 'rain' && condition !== 'thunderstorm', icon: '🚴‍♀️' });
    } else if (temp > 15) { // Mild weather
      activities.push({ name: 'Hiking', suitable: condition !== 'rain' && condition !== 'thunderstorm', icon: '🥾' });
      activities.push({ name: 'Cycling', suitable: condition !== 'rain' && condition !== 'thunderstorm', icon: '🚴‍♀️' });
      activities.push({ name: 'Picnic', suitable: condition === 'clear' || condition === 'clouds', icon: '🧺' });
    } else if (temp > 5) { // Cool weather
      activities.push({ name: 'Running', suitable: condition !== 'rain' && condition !== 'thunderstorm', icon: '🏃‍♂️' });
      activities.push({ name: 'Walking', suitable: condition !== 'thunderstorm', icon: '🚶‍♀️' });
    } else { // Cold weather
      activities.push({ name: 'Skiing', suitable: condition === 'snow', icon: '⛷️' });
      activities.push({ name: 'Indoor activities', suitable: true, icon: '🏠' });
    }

    // Condition-based activities
    if (condition === 'clear') {
      activities.push({ name: 'Sunbathing', suitable: temp > 18, icon: '☀️' }); // Lowered from 20°C
      activities.push({ name: 'Photography', suitable: true, icon: '📷' });
    } else if (condition === 'clouds') {
      activities.push({ name: 'Photography', suitable: true, icon: '📷' });
    } else if (condition === 'rain' || condition === 'drizzle') {
      activities.push({ name: 'Museum visit', suitable: true, icon: '🏛️' });
    }

    return activities;
  };

  const activities = getActivities();

  return (
    <div className="p-4 bg-white shadow-md" style={{ borderRadius: 0 }}>
      <div className="text-gray-600">Weather Impact</div>
      <div className="mt-3">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center mb-2">
            <span className="mr-2 text-xl">{activity.icon}</span>
            <span className={activity.suitable ? 'text-green-600' : 'text-red-600'}>
              {activity.name}: {activity.suitable ? 'Good' : 'Not ideal'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherActivityIndicator;