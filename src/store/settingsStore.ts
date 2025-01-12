import { create } from "zustand";

export interface UserSettings {
    name?: string;
    email?: string;
    phoneNumber?: string;
    city?: string;
    country?: string;
    minTemperature?: number;
    maxTemperature?: number;
    weekDaysRunning?: number[];
    noteByEmail?: boolean;
    noteByWhatsapp?: boolean;
    noteBySMS?: boolean;
}


export interface AppStoreState {
    userSettings: UserSettings | null;
    error: string;
    setError: (error: string) => void;
    setUserSettings: (settings: UserSettings) => void;
}


const useSettingsStore = create<AppStoreState>((set) => ({
    userSettings: null,
    error: '',
    setError: (error: string) => {
        set((state) => ({
            ...state, error
        }))
    },
    setUserSettings: (userSettings: UserSettings) => {
        set((state) => ({
            ...state, userSettings
        }));
    }
}));

export default useSettingsStore;