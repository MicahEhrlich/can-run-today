import React, { useCallback, useRef, useState } from 'react';
import {
    useQuery,
} from '@tanstack/react-query';
import useAuthStore from '../../store/authStore';
import useDashboardStore, { FavoriteCity } from '../../store/dashboardStore';
import useDebounce from '../../hooks/debounce';
import { FaLocationDot } from "react-icons/fa6";
import { Container, Box, Typography, CircularProgress, TextField, Autocomplete, Button, Alert } from '@mui/material';
import { Title, WeatherSearchWrapper } from './Dashboard.styled';
import { currentWeatherApiRequest, searchCityApiRequest } from '../../api/weather-api';
import { getCurrentLocation } from '../../utils/utils';
import { Favorites } from './Favorites';
import { WeatherDisplay } from './WeatherDisplay';

const DEFAULT_DEBOUNCE = 500
const CURRENT_WEATHER = 'Current Weather'

export interface WeatherData {
    current: {
        time: Date;
        temperature2m: number;
        isDay: number;
        precipitation: number;
        rain: number;
        showers: number;
        weatherCode: number;
        windSpeed10m: number;
    };
}

export interface CitySearchResult {
    admin1: string;
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    elevation: number;
    feature_code: string;
    country_code: string;
    admin1_id: number;
    timezone: string;
    population: number;
    country_id: number;
    country: string;
    postcodes?: string[];
}

const MAX_CITIES = 5;

const Dashboard: React.FC = () => {
    const user = useAuthStore((state) => state.user);
    const addFavoriteCity = useDashboardStore((state) => state.addCity);
    const cityExists = useDashboardStore((state) => state.findCity);
    const favoriteCities = useDashboardStore((state) => state.favoriteCities);

    const [currentCity, setCurrentCity] = useState<string>('');
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<CitySearchResult[]>([]);
    const [selectedCity, setSelectedCity] = useState<CitySearchResult | null>(null);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

    const handleDebouncedSearch = async (debouncedValue: string) => {
        try {
            const response = await searchCityApiRequest(debouncedValue);
            if (response.data) {
                const { results } = response.data as { results: CitySearchResult[] };
                setSearchResults(results);
            }
        } catch (error) {
            console.error('Search API Error:', error);
        }
    };

    const debouncedSearch = useCallback(handleDebouncedSearch, []);

    useDebounce(searchTerm, DEFAULT_DEBOUNCE, debouncedSearch);

    const { name } = user ?? { name: '' };

    const getCurrentWeather = async (lat: number, lon: number) => {
        const response = await currentWeatherApiRequest(lat, lon);
        if (response.success && response.data) {
            const parsedResponse = response.data[0];
            const utcOffsetSeconds = parsedResponse.utcOffsetSeconds();
            const current = parsedResponse.current()!;
            const weatherData = {
                current: {
                    time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
                    temperature2m: current.variables(0)!.value(),
                    isDay: current.variables(1)!.value(),
                    precipitation: current.variables(2)!.value(),
                    rain: current.variables(3)!.value(),
                    showers: current.variables(4)!.value(),
                    weatherCode: current.variables(5)!.value(),
                    windSpeed10m: current.variables(6)!.value(),
                },

            };
            setWeatherData(weatherData);
        }
    }

    const prevCoords = useRef<{ latitude: number; longitude: number } | null>(null);

    const handleOptionSelect = (event: React.SyntheticEvent, value: CitySearchResult | null) => {
        if (value) {
            setSelectedCity(value);
            const selectedCity = searchResults.find((result) => result.id === value.id);
            if (selectedCity) {
                const { latitude, longitude } = selectedCity;
                if (!prevCoords.current || prevCoords.current.latitude !== latitude || prevCoords.current.longitude !== longitude) {
                    getCurrentWeather(latitude, longitude);
                    setCurrentCity(selectedCity.name);
                    prevCoords.current = { latitude, longitude }
                }
            }
        }
    };

    const handleAddToFavorites = () => {
        if (favoriteCities.length === MAX_CITIES) {
            setAlertMessage('Reached maximum number of favorite cities');
            setAlertSeverity('error');
        }
        else if (selectedCity) {
            const favoriteCity: FavoriteCity = {
                id: selectedCity.id,
                name: selectedCity.name,
                admin1: selectedCity.admin1,
                country: selectedCity.country,
                latitude: selectedCity.latitude,
                longitude: selectedCity.longitude,
                temperature: weatherData?.current.temperature2m.toFixed(0) ?? '0',
                weatherCode: weatherData?.current.weatherCode ?? 0,
            };
            addFavoriteCity(favoriteCity);
        }
    };

    const handleFavoriteCityClick = (city: FavoriteCity) => {
        getCurrentWeather(city.latitude, city.longitude);
        setCurrentCity(city.name);
    };

    const getCurrentLocationWeather = () => {
        getCurrentLocation()
            .then(async (location) => {
                getCurrentWeather(location.lat, location.lon);
                setCurrentCity(CURRENT_WEATHER);
            })
            .catch((error) => {
                console.error(error.message);
            });
    };


    const { isPending, isFetching, error, data } = useQuery({
        queryKey: ['weatherData'],
        queryFn: async () => {
            return getCurrentLocation()
                .then(async (location) => {
                    setCurrentCity(CURRENT_WEATHER);
                    let weatherData;
                    const response = await currentWeatherApiRequest(location.lat, location.lon);
                    if (response.success && response.data) {
                        const parsedResponse = response.data[0];
                        const utcOffsetSeconds = parsedResponse.utcOffsetSeconds();
                        const current = parsedResponse.current()!;
                        weatherData = {
                            current: {
                                time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
                                temperature2m: current.variables(0)!.value(),
                                isDay: current.variables(1)!.value(),
                                precipitation: current.variables(2)!.value(),
                                rain: current.variables(3)!.value(),
                                showers: current.variables(4)!.value(),
                                weatherCode: current.variables(5)!.value(),
                                windSpeed10m: current.variables(6)!.value(),
                            },

                        };
                    }
                    return weatherData;

                })
                .catch((error) => {
                    console.error(error.message);
                    return null;
                });

        }
    })

    {/* Add the following code snippet to the Dashboard component 
     
     When adding new posts we can save the running stats to the user's profile.
     Then we can have a section in the dashboard that displays the user's running stats, and running history.
     
     
     */}

    return (
        <Container>
            <Title>Dashboard</Title>
            <Typography>Welcome {name} to the dashboard!</Typography>
            <WeatherSearchWrapper>
                <Autocomplete
                    freeSolo={false}
                    options={searchResults ?? []}
                    getOptionLabel={(option) => `${option.name}, ${option.admin1}, ${option.country}`}
                    getOptionKey={(option) => option.id}
                    inputValue={searchTerm}
                    onInputChange={(event, newInputValue) => {
                        setSearchTerm(newInputValue);
                    }}
                    onChange={handleOptionSelect}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Search"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            sx={{
                                width: 350,
                                '& .MuiOutlinedInput-root': { color: 'white' },
                                '& .MuiInputLabel-root': { color: 'white' }
                            }}
                        />
                    )}
                />
                <Button color="primary" onClick={getCurrentLocationWeather}><FaLocationDot /></Button>
            </WeatherSearchWrapper>
            {selectedCity && !cityExists(selectedCity.id) && (
                <Button variant="contained" color="primary" onClick={handleAddToFavorites}>
                    Add to Favorites
                </Button>
            )}
            {alertMessage && (
                <Box sx={{ mt: 2 }}>
                    <Alert severity={alertSeverity} onClose={() => setAlertMessage(null)}>
                        {alertMessage}
                    </Alert>
                </Box>
            )}
            {error && <h2>An error has occured</h2>}
            {isFetching ? (<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
                {isPending ? <h2>Loading Weather from API...</h2> : <h2>Loading Weather...</h2>}
                <CircularProgress />
            </Box>) :
                data && currentCity == CURRENT_WEATHER ?
                    <WeatherDisplay weatherData={data} currentCity={currentCity} /> :
                    (weatherData && <WeatherDisplay weatherData={weatherData} currentCity={currentCity} />)
            }
            <Favorites handleFavoriteCityClick={handleFavoriteCityClick} />
        </Container>
    );
};

export default Dashboard;