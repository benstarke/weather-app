<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\WeatherController;

Route::prefix('weather')->group(function () {
    Route::get('/current', [WeatherController::class, 'getCurrentWeather']);
    Route::get('/forecast', [WeatherController::class, 'getForecast']);
    Route::get('/hourly', [WeatherController::class, 'getHourlyForecast']);
    Route::get('/air-quality', [WeatherController::class, 'getAirQuality']);
    Route::get('/search', [WeatherController::class, 'searchCity']);
});