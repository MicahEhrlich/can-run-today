import { Typography, Box } from "@mui/material"
import { getWeatherIcon } from "../../utils/utils"
import { Section, SectionTitle, WeatherIcon } from "./Dashboard.styled"
import { WeatherData } from "./Dashboard";

type WeatherDisplayProps = {
    currentCity: string;
    weatherData: WeatherData;
}

export const WeatherDisplay = ({ currentCity, weatherData }: WeatherDisplayProps) => {
    return (
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
        </Section>)
}