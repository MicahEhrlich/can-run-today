
// Weather condition to image mapping
const weatherIcons: { [key: string]: string } = {
    clear: "https://cdn-icons-png.flaticon.com/512/869/869869.png", // Clear sky icon
    cloudy: "https://cdn-icons-png.flaticon.com/512/1163/1163657.png", // Partly cloudy icon
    rain: "https://cdn-icons-png.flaticon.com/512/1163/1163627.png", // Rain icon
    snow: "https://cdn-icons-png.flaticon.com/512/1163/1163666.png", // Snow icon
    Thunderstorm: "https://cdn-icons-png.flaticon.com/512/1163/1163641.png", // Thunderstorm icon
    default: "https://cdn-icons-png.flaticon.com/512/869/869857.png", // Default weather icon
};

export const getWeatherIcon = (weatherCode: number) => {
    if (weatherCode >= 0 && weatherCode <= 3) return weatherIcons['clear'];
    if (weatherCode >= 45 && weatherCode <= 48) return weatherIcons['cloudy'];
    if (weatherCode >= 51 && weatherCode <= 67) return weatherIcons['rain'];
    if (weatherCode >= 71 && weatherCode <= 77) return weatherIcons['snow'];
    return weatherIcons['default'];
};

export function getCurrentLocation(): Promise<{ lat: number; lon: number }> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by your browser"));
        } else {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    resolve({ lat: latitude, lon: longitude });
                },
                (error) => {
                    reject(new Error(`Geolocation error: ${error.message}`));
                }
            );
        }
    });
}

export function validateTimeFormat(value:string) {
    // Regular expression to match hh:mm:ss format
    const timeFormatRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
  
    if (timeFormatRegex.test(value)) {
      return true; // Valid format
    } else {
      return false; // Invalid format
    }
  }
  
  export function calculateRunningPace(distance: number, time: string) {
    // Convert time to seconds
    const timeArray = time.split(':').map(Number);
    const timeInSeconds = timeArray[0] * 3600 + timeArray[1] * 60 + timeArray[2];
  
    // Calculate pace in seconds per meter
    const pace = timeInSeconds / distance;
  
    // Convert pace to mm:ss format
    const minutes = Math.floor(pace / 60);
    const seconds = Math.round(pace % 60);
  
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }