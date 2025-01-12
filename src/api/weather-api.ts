
import { fetchWeatherApi } from 'openmeteo';
import { WeatherApiResponse } from '@openmeteo/sdk/weather-api-response';
import { ApiResponse } from './types-api';
import axios from 'axios';

const SEARCH_RESULTS_COUNT = 5;
// TODO: move to env file, ewaaaa disgusting
const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast'
const OPEN_METEO_CITY_SEARCH = 'https://geocoding-api.open-meteo.com/v1/search?'

interface WeatherApiDataResponse {
    success: boolean;
    message: string;
    data?: WeatherApiResponse[];
}

export const searchCityApiRequest = async (city: string): Promise<ApiResponse> => {
    try {
        const response = await axios.get(`${OPEN_METEO_CITY_SEARCH}name=${city}&count=${SEARCH_RESULTS_COUNT}&language=en&format=json`);
        if (response.status === 200) {
            return {
                success: true,
                message: 'Success',
                data: response.data,
            };
        } else {
            console.error(response.data || 'An error occurred');
            return {
                success: false,
                message: response.data.detail || 'An error occurred',
            };
        }   
    } catch (error) {
        console.error(error)
        return {
            success: false,
            message: 'An error occurred',
        }
    }

}

export const currentWeatherApiRequest = async (lat: number, lon: number): Promise<WeatherApiDataResponse> => {
    try {
        const params = {
            latitude: lat,
            longitude: lon,
            current: ["temperature_2m", "is_day", "precipitation", "rain", "showers", "weather_code", "wind_speed_10m"],
	        forecast_days: 1
        };
        const responses = await fetchWeatherApi(OPEN_METEO_URL, params);
        return {
            success: true,
            message: 'Success',
            data: responses,
        }
    } catch (error) {
        console.error(error)
        return {
            success: false,
            message: 'An error occurred',
        }
    }
}