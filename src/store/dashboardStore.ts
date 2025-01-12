import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FavoriteCity {
    name: string;
    admin1: string;
    country: string;
    id: number;
    latitude: number;
    longitude: number;
    temperature: string;
    weatherCode: number;
}

interface DashboardState {
    favoriteCities: FavoriteCity[];
    addCity: (city: FavoriteCity) => void;
    removeCity: (cityId: number) => void;
    updateCityWeather: (cityId: number, temperature: string, weatherCode: number) => void;
    findCity: (cityId: number) => boolean;
    clear: () => void;
}


const useDashboardStore = create<DashboardState>()(
    persist<DashboardState>((set, get) => ({
        favoriteCities: [],
        addCity: (city: FavoriteCity) => set((state) => {
            if (!state.favoriteCities.some(c => c.id === city.id)) {
                return { favoriteCities: [...state.favoriteCities, city] };
            }
            return state;
        }),
        removeCity: (cityId: number) => set((state) => ({
            favoriteCities: state.favoriteCities.filter(c => c.id !== cityId)
        })),
        updateCityWeather: (cityId: number, temperature: string, weatherCode: number) => set((state) => ({
            favoriteCities: state.favoriteCities.map(c => c.id === cityId ? { ...c, temperature, weatherCode } : c)
        })),
        findCity: (cityId: number) => get().favoriteCities.some(c => c.id === cityId),
        clear: () => set({ favoriteCities: [] })
    }), {
        name: "dashboard-storage",
    })
);

export default useDashboardStore;