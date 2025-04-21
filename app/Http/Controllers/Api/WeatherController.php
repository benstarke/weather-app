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

    public function __construct()
    {
        $this->apiKey = env('OPENWEATHERMAP_API_KEY');
        $this->apiUrl = env('OPENWEATHERMAP_API_URL');
        $this->geoApiUrl = env('OPENWEATHERMAP_GEO_API_URL');
    }

    public function getCurrentWeather(Request $request)
    {
        $lat = $request->query('lat');
        $lon = $request->query('lon');
        $units = $request->query('units', 'metric');

        $response = Http::get("{$this->apiUrl}/weather", [
            'lat' => $lat,
            'lon' => $lon,
            'units' => $units,
            'appid' => $this->apiKey,
        ]);

        return response()->json($response->json());
    }

    public function getForecast(Request $request)
    {
        $lat = $request->query('lat');
        $lon = $request->query('lon');
        $units = $request->query('units', 'metric');

        $response = Http::get("{$this->apiUrl}/forecast", [
            'lat' => $lat,
            'lon' => $lon,
            'units' => $units,
            'appid' => $this->apiKey,
        ]);

        $forecast = $response->json();
        
        // Process forecast data to group by day
        $dailyForecast = [];
        $currentDate = '';
        
        foreach ($forecast['list'] as $item) {
            $date = date('Y-m-d', $item['dt']);
            
            if (!isset($dailyForecast[$date])) {
                $dailyForecast[$date] = [
                    'date' => $date,
                    'day' => date('d M', $item['dt']),
                    'temp_min' => $item['main']['temp_min'],
                    'temp_max' => $item['main']['temp_max'],
                    'weather' => $item['weather'][0],
                ];
            } else {
                $dailyForecast[$date]['temp_min'] = min($dailyForecast[$date]['temp_min'], $item['main']['temp_min']);
                $dailyForecast[$date]['temp_max'] = max($dailyForecast[$date]['temp_max'], $item['main']['temp_max']);
            }
        }
        
        return response()->json(array_values($dailyForecast));
    }

    public function searchCity(Request $request)
    {
        $query = $request->query('q');
        $limit = $request->query('limit', 5);

        $response = Http::get("{$this->geoApiUrl}/direct", [
            'q' => $query,
            'limit' => $limit,
            'appid' => $this->apiKey,
        ]);

        return response()->json($response->json());
    }
}