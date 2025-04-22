import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { HourlyForecast } from '../types/weather';

interface WeatherTrendsCardProps {
  forecast: HourlyForecast[];
  units: string;
}

const WeatherTrendsCard: React.FC<WeatherTrendsCardProps> = ({ forecast, units }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy existing chart if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Group data by day
    const dailyData: { [key: string]: HourlyForecast[] } = {};
    forecast.forEach((hour) => {
      const date = new Date(hour.dt * 1000).toLocaleDateString();
      if (!dailyData[date]) dailyData[date] = [];
      dailyData[date].push(hour);
    });

    // Prepare data for the chart (using today's data)
    const today = new Date().toLocaleDateString();
    const todayData = dailyData[today] || forecast.slice(0, 24);
    const labels = todayData.map((hour) =>
      new Date(hour.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })
    );
    const temperatures = todayData.map((hour) => Number(hour.temp.toFixed(2)));

    // Create new chart
    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: `Temperature (${units === 'metric' ? '°C' : '°F'})`,
            data: temperatures,
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            title: {
              display: true,
              text: `Temperature (${units === 'metric' ? '°C' : '°F'})`,
            },
          },
          x: {
            title: {
              display: true,
              text: 'Time',
            },
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Daily Temperature Trend',
          },
        },
      },
    });

    // Cleanup
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [forecast, units]);

  return (
    <div className="p-4 bg-white shadow-md" style={ { borderRadius: 0 }}>
      <div style={ { height: '200px' }}>
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
};

export default WeatherTrendsCard;