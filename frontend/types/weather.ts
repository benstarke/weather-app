export interface WeatherData {
    id: number;
    main: string;
    description: string;
    icon: string;
  }
  
  export interface CurrentWeather {
    weather: WeatherData[];
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      humidity: number;
    };
    wind: {
      speed: number;
      deg: number;
    };
    clouds: {
      all: number;
    };
    rain?: {
      "1h"?: number;
      "3h"?: number;
    };
    snow?: {
      "1h"?: number;
      "3h"?: number;
    };
    visibility: number;
    name: string;
    dt: number;
    sys: {
      sunrise: number;
      sunset: number;
      country: string;
    };
    alerts?: WeatherAlert[];
    air_quality?: AirQualityData;
  }
  
  export interface WeatherAlert {
    sender_name: string;
    event: string;
    description: string;
    start: number;
    end: number;
  }
  
  export interface AirQualityData {
    aqi: number;
    components: {
      co: number;
      no: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      nh3: number;
    };
  }
  
  export interface DailyForecast {
    date: string;
    day: string;
    temp_min: number;
    temp_max: number;
    weather: WeatherData;
    rain?: number;
    snow?: number;
    pop: number; // Probability of precipitation
  }
  
  export interface HourlyForecast {
    dt: number;
    temp: number;
    feels_like: number;
    weather: WeatherData;
    pop: number; // Probability of precipitation
    rain?: { "1h": number };
    snow?: { "1h": number };
  }
  
  export interface City {
    name: string;
    country: string;
    lat: number;
    lon: number;
  }
  