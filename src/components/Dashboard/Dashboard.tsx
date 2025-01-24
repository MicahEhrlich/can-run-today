import React, { useCallback, useEffect, useState } from 'react';
import useAuthStore from '../../store/authStore';
import useDashboardStore, { FavoriteCity } from '../../store/dashboardStore';
import useDebounce from '../../hooks/debounce';
import { FaLocationDot } from "react-icons/fa6";
import { Container, Box, Typography, CircularProgress, TextField, Autocomplete, Button } from '@mui/material';
import { Title, Section, SectionTitle, WeatherIcon, WeatherSearchWrapper } from './Dashboard.styled';
import { currentWeatherApiRequest, searchCityApiRequest } from '../../api/weather-api';
import { getCurrentLocation, getWeatherIcon } from '../../utils/utils';
import { Favorites } from './Favorites';

const DEFAULT_DEBOUNCE = 500

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


const Dashboard: React.FC = () => {
    const user = useAuthStore((state) => state.user);
    const addFavoriteCity = useDashboardStore((state) => state.addCity);
    const cityExists = useDashboardStore((state) => state.findCity);

    const [currentCity, setCurrentCity] = useState<string>('');
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<CitySearchResult[]>([]);
    const [selectedCity, setSelectedCity] = useState<CitySearchResult | null>(null);

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

    const handleOptionSelect = (event: React.SyntheticEvent, value: CitySearchResult | null) => {
        if (value) {
            setSelectedCity(value);
            const selectedCity = searchResults.find((result) => result.id === value.id);
            if (selectedCity) {
                getCurrentWeather(selectedCity.latitude, selectedCity.longitude);
                setCurrentCity(selectedCity.name);
            }
        }
    };

    const handleAddToFavorites = () => {
        if (selectedCity) {
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

    const getCurrentLocationWeather = useCallback(() => {
        getCurrentLocation()
            .then(async (location) => {
                getCurrentWeather(location.lat, location.lon);
                setCurrentCity('Current Weather');
            })
            .catch((error) => {
                console.error(error.message);
            });
    }, []);

    useEffect(() => {
        getCurrentLocationWeather()
    }, [getCurrentLocationWeather]);

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
                <Button color="primary" onClick={getCurrentLocationWeather}><FaLocationDot/></Button>
            </WeatherSearchWrapper>
            {selectedCity && !cityExists(selectedCity.id) && (
                <Button variant="contained" color="primary" onClick={handleAddToFavorites}>
                    Add to Favorites
                </Button>
            )}

            {weatherData ? (
                <Section>
                    <SectionTitle>{currentCity}</SectionTitle>
                    <WeatherIcon
                        src={getWeatherIcon(weatherData.current.weatherCode)}
                        alt="Weather Icon"
                    />
                    <Typography variant="h2">{weatherData.current.temperature2m.toFixed(0)}°C</Typography>
                    <Box className="current-weather" sx={{ mt: 2 }}>
                        <Typography variant="body1">{new Date(Number(weatherData.current.time)).toDateString()}</Typography>
                        <Typography variant="body1">Temperature: {weatherData.current.temperature2m.toFixed(0)}°C</Typography>
                        <Typography variant="body1">Is Day: {weatherData.current.isDay ? 'Yes' : 'No'}</Typography>
                        <Typography variant="body1">Precipitation: {weatherData.current.precipitation.toFixed(0)} mm</Typography>
                        <Typography variant="body1">Rain: {weatherData.current.rain.toFixed(0)} mm</Typography>
                        <Typography variant="body1">Showers: {weatherData.current.showers.toFixed(0)} mm</Typography>
                        <Typography variant="body1">Wind Speed: {weatherData.current.windSpeed10m.toFixed(2)} m/s</Typography>

                    </Box>
                </Section>
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            )}
            <Favorites handleFavoriteCityClick={handleFavoriteCityClick} />
        </Container>
    );
};

export default Dashboard;