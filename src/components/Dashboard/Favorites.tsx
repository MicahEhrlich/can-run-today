import { Box, Typography, Button, CircularProgress } from "@mui/material";
import useDashboardStore, { FavoriteCity } from "../../store/dashboardStore";
import { getWeatherIcon } from "../../utils/utils";
import { Section, SectionTitle, WeatherIcon } from "./Dashboard.styled";
import { currentWeatherApiRequest } from "../../api/weather-api";
import { useQuery } from "@tanstack/react-query";

type FavoritesProps = {
    handleFavoriteCityClick: (city: FavoriteCity) => void;
};

type WeatherDataResult = {
    cityId: number;
    temperature: string;
    weatherCode: number;
}

export const Favorites = ({ handleFavoriteCityClick }: FavoritesProps) => {
    const removeFavoriteCity = useDashboardStore((state) => state.removeCity);
    const updateWeather = useDashboardStore((state) => state.updateCityWeather);
    const favoriteCities = useDashboardStore((state) => state.favoriteCities);

    const { isPending, isFetching } = useQuery({
        queryKey: ['favoritesWeatherData'],
        queryFn: async () => {
            const weatherDataResult: WeatherDataResult[] = [];
            favoriteCities.forEach(async (city) => {
                const response = await currentWeatherApiRequest(city.latitude, city.longitude);
                if (response.success && response.data) {
                    const parsedResponse = response.data[0];
                    const current = parsedResponse.current()!;
                    const temperature = current.variables(0)!.value().toFixed(0) ?? '0';
                    const weatherCode = current.variables(5)!.value();
                    updateWeather(city.id, temperature, weatherCode);
                    const weatherDataElement = {
                        cityId: city.id, temperature, weatherCode
                    }
                    weatherDataResult.push(weatherDataElement)
                }
            });
            return weatherDataResult;
        }
    })

    return (
        <>
            {favoriteCities.length > 0 && (
                <Section>
                    <SectionTitle>Favorite Cities</SectionTitle>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        {favoriteCities.map((city) => (
                            <Box
                                key={city.id}
                                sx={{
                                    border: '1px solid',
                                    borderColor: 'grey.400',
                                    borderRadius: 1,
                                    padding: 2,
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: 'grey.400',
                                    },
                                }}
                                onClick={() => handleFavoriteCityClick(city)}
                            >
                                <WeatherIcon
                                    src={getWeatherIcon(city.weatherCode)}
                                    alt="Weather Icon"
                                />
                                <Typography variant="body1">{city.temperature}°C</Typography>
                                <Typography variant="body1">{city.name}</Typography>
                                <Typography variant="body2">{city.admin1}, {city.country}</Typography>
                                <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFavoriteCity(city.id);
                                    }}
                                    sx={{ minWidth: 'auto', padding: '4px' }}
                                >
                                    X
                                </Button>
                            </Box>
                        ))}
                    </Box>
                </Section>
            )}
            {isFetching && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                    {isPending && <h3>Loading weather for the first time...</h3>}
                </Box>)}
        </>
    )
}