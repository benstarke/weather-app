<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class WeatherController extends Controller
{
    protected $apiKey;
    protected $apiUrl;
    protected $geoApiUrl;
    protected $airQualityUrl;

    public function __construct()
    {
        $this->apiKey = env('OPENWEATHERMAP_API_KEY');
        $this->apiUrl = env('OPENWEATHERMAP_API_URL', 'https://api.openweathermap.org/data/2.5');
        $this->geoApiUrl = env('OPENWEATHERMAP_GEO_API_URL', 'http://api.openweathermap.org/geo/1.0');
        $this->airQualityUrl = env('OPENWEATHERMAP_AIR_QUALITY_URL', 'http://api.openweathermap.org/data/2.5/air_pollution');
    }

    public function getCurrentWeather(Request $request)
    {
        $lat = $request->query('lat');
        $lon = $request->query('lon');
        $units = $request->query('units', 'metric');

        try {
            $response = Http::get("{$this->apiUrl}/weather", [
                'lat' => $lat,
                'lon' => $lon,
                'units' => $units,
                'appid' => $this->apiKey,
            ]);

            if (!$response->successful()) {
                return response()->json(['error' => 'Failed to fetch current weather'], 500);
            }

            $data = $response->json();
            // Include alerts if available
            if (isset($data['alerts'])) {
                $data['alerts'] = array_map(function ($alert) {
                    return [
                        'sender_name' => $alert['sender_name'],
                        'event' => $alert['event'],
                        'description' => $alert['description'],
                        'start' => $alert['start'],
                        'end' => $alert['end'],
                    ];
                }, $data['alerts']);
            }

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error fetching current weather: ' . $e->getMessage()], 500);
        }
    }

    public function getForecast(Request $request)
    {
        $lat = $request->query('lat');
        $lon = $request->query('lon');
        $units = $request->query('units', 'metric');

        try {
            $response = Http::get("{$this->apiUrl}/forecast", [
                'lat' => $lat,
                'lon' => $lon,
                'units' => $units,
                'appid' => $this->apiKey,
            ]);

            if (!$response->successful()) {
                return response()->json(['error' => 'Failed to fetch forecast'], 500);
            }

            $forecast = $response->json();
            $dailyForecast = [];

            // Group forecast data by day
            foreach ($forecast['list'] as $item) {
                $date = date('Y-m-d', $item['dt']);
                if (!isset($dailyForecast[$date])) {
                    $dailyForecast[$date] = [
                        'date' => date('d M', $item['dt']),
                        'day' => date('l', $item['dt']), // Full day name (e.g., Monday)
                        'temp_min' => $item['main']['temp_min'],
                        'temp_max' => $item['main']['temp_max'],
                        'weather' => $item['weather'][0],
                        'pop' => $item['pop'], // Probability of precipitation
                        'rain' => isset($item['rain']['3h']) ? $item['rain']['3h'] : 0,
                        'snow' => isset($item['snow']['3h']) ? $item['snow']['3h'] : 0,
                    ];
                } else {
                    $dailyForecast[$date]['temp_min'] = min($dailyForecast[$date]['temp_min'], $item['main']['temp_min']);
                    $dailyForecast[$date]['temp_max'] = max($dailyForecast[$date]['temp_max'], $item['main']['temp_max']);
                    $dailyForecast[$date]['pop'] = max($dailyForecast[$date]['pop'], $item['pop']);
                    $dailyForecast[$date]['rain'] += isset($item['rain']['3h']) ? $item['rain']['3h'] : 0;
                    $dailyForecast[$date]['snow'] += isset($item['snow']['3h']) ? $item['snow']['3h'] : 0;
                }
            }

            return response()->json(array_values($dailyForecast));
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error fetching forecast: ' . $e->getMessage()], 500);
        }
    }

    public function getHourlyForecast(Request $request)
    {
        $lat = $request->query('lat');
        $lon = $request->query('lon');
        $units = $request->query('units', 'metric');

        try {
            $response = Http::get("{$this->apiUrl}/forecast", [
                'lat' => $lat,
                'lon' => $lon,
                'units' => $units,
                'appid' => $this->apiKey,
            ]);

            if (!$response->successful()) {
                return response()->json(['error' => 'Failed to fetch hourly forecast'], 500);
            }

            $forecast = $response->json();
            $hourlyForecast = array_map(function ($item) {
                return [
                    'dt' => $item['dt'],
                    'temp' => $item['main']['temp'],
                    'feels_like' => $item['main']['feels_like'],
                    'weather' => $item['weather'][0],
                    'pop' => $item['pop'],
                    'rain' => isset($item['rain']) ? $item['rain'] : null,
                    'snow' => isset($item['snow']) ? $item['snow'] : null,
                ];
            }, $forecast['list']);

            return response()->json($hourlyForecast);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error fetching hourly forecast: ' . $e->getMessage()], 500);
        }
    }

    public function getAirQuality(Request $request)
    {
        $lat = $request->query('lat');
        $lon = $request->query('lon');

        try {
            $response = Http::get("{$this->airQualityUrl}", [
                'lat' => $lat,
                'lon' => $lon,
                'appid' => $this->apiKey,
            ]);

            if (!$response->successful()) {
                return response()->json(['error' => 'Failed to fetch air quality data'], 500);
            }

            $data = $response->json();
            return response()->json([
                'aqi' => $data['list'][0]['main']['aqi'],
                'components' => $data['list'][0]['components'],
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error fetching air quality data: ' . $e->getMessage()], 500);
        }
    }

    public function searchCity(Request $request)
    {
        $query = $request->query('q');
        $limit = $request->query('limit', 5);

        try {
            $response = Http::get("{$this->geoApiUrl}/direct", [
                'q' => $query,
                'limit' => $limit,
                'appid' => $this->apiKey,
            ]);

            if (!$response->successful()) {
                return response()->json(['error' => 'Failed to search cities'], 500);
            }

            return response()->json($response->json());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error searching cities: ' . $e->getMessage()], 500);
        }
    }
}