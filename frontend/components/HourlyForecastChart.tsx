import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { HourlyForecast } from '../types/weather';

interface HourlyForecastChartProps {
  forecast: HourlyForecast[];
  units: string;
}

const HourlyForecastChart: React.FC<HourlyForecastChartProps> = ({ forecast, units }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy existing chart if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Prepare data
    const labels = forecast.map((hour) =>
      new Date(hour.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })
    );
    const temperatures = forecast.map((hour) => Number(hour.temp.toFixed(2)));
    const precipProbabilities = forecast.map((hour) => Math.round(hour.pop * 100));

    // Create new chart
    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: `Temperature (${units === 'metric' ? '°C' : '°F'})`,
            data: temperatures,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            yAxisID: 'y',
          },
          {
            label: 'Precipitation (%)',
            data: precipProbabilities,
            borderColor: 'rgb(54, 162, 235)',
            tension: 0.1,
            yAxisID: 'y1',
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
          y1: {
            position: 'right',
            title: {
              display: true,
              text: 'Precipitation (%)',
            },
            grid: {
              drawOnChartArea: false,
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
      <div style={ { height: '300px' }}>
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
};

export default HourlyForecastChart;