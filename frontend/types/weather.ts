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
    };
    name: string;
    dt: number;
  }
  
  export interface DailyForecast {
    date: string;
    day: string;
    temp_min: number;
    temp_max: number;
    weather: WeatherData;
  }
  
  export interface City {
    name: string;
    country: string;
    lat: number;
    lon: number;
  }