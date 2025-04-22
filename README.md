# Weather-app
Decoupled Weather App-This project is a modern weather application built with a decoupled architecture using a Next.js frontend (with TypeScript and Tailwind/RippleUI) and a Laravel API backend. 

# 🌤️ Decoupled Weather App (Next.js + Laravel + OpenWeatherMap)

A weather forecast application built with a modern **decoupled architecture** using:

- **Frontend:** [Next.js](https://nextjs.org/) + TypeScript + TailwindCSS with [RippleUI](https://ui.rippleui.com/)
- **Backend:** [Laravel 11](https://laravel.com/) API-only setup
- **Weather Data:** [OpenWeatherMap API](https://openweathermap.org/api)

---

## 📸 Screenshots
![First View Celsius](https://github.com/benstarke/weather-app/blob/main/frontend/Screenshots/FirstViewCelsius.PNG "Page Preview")

![Second View Celsius](https://github.com/benstarke/weather-app/blob/main/frontend/Screenshots/SecondViewCelsius.PNG "Page Preview")

![Search View](https://github.com/benstarke/weather-app/blob/main/frontend/Screenshots/SearchView.PNG "Page Preview")

![FahrenheitView](https://github.com/benstarke/weather-app/blob/main/frontend/Screenshots/FahrenheitView.PNG "Page Preview")

![Different City](https://github.com/benstarke/weather-app/blob/main/frontend/Screenshots/DifferentCity.PNG "Page Preview")

![Responsiveness Ipad](https://github.com/benstarke/weather-app/blob/main/frontend/Screenshots/ResponsivenessIpad.PNG "Page Preview")

![Responsiveness Small screens](https://github.com/benstarke/weather-app/blob/main/frontend/Screenshots/ResponsivenessSmallScreens.PNG "Page Preview")

![Responsiveness Small screens](https://github.com/benstarke/weather-app/blob/main/frontend/Screenshots/ResponsivenessSmallScreens-1.PNG "Page Preview")


---

## 🚀 Features

- Real-time weather data by location or city
- Clean UI with Tailwind CSS (RippleUI components)
- Fully typed with TypeScript (frontend)
- Decoupled architecture (Frontend <-> Laravel API <-> Weather API)
- Elegant code structure and modular components

---

## 🧑‍💻 Technologies Used

### Frontend:
- [Next.js 14+](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [RippleUI](https://ui.rippleui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- Fetch API for AJAX requests

### Backend:
- [Laravel 12](https://laravel.com/)
- [Guzzle](https://docs.guzzlephp.org/en/stable/) or [HTTP Client](https://laravel.com/docs/http-client)
- REST API responses (JSON)

---

## 🛠️ Setup Instructions

### 📦 Backend (Laravel)

```bash
# Clone the repo and cd into it
git clone https://github.com/benstarke/weather-app.git
cd weather-app

# Install dependencies
composer install

# Copy .env file and set up OpenWeatherMap API key
cp .env.example .env
php artisan key:generate

# Add the following to your .env
OPENWEATHERMAP_API_KEY=your_api_key_here

# Serve the app
php artisan serve

```


### 📦 Frontend (Nextjs)
```bash
cd weather-app/frontend
npm install


# Serve the app
npm run dev
```




