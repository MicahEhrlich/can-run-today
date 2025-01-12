import { create } from "zustand";


export interface RegisterFields extends Record<string, unknown> {
    name: string;
    phoneNumber: string;
    email: string;
    password: string;
    country: string;
    city: string;
    minTemperature: number;
    maxTemperature: number;
    weekDaysRunning: string;
    noteBySMS: boolean;
    noteByWhatsapp: boolean;
    noteByEmail: boolean;
}

export interface AppStoreState extends RegisterFields {
    error: string;

    setName: (name: string) => void;
    setPhoneNumber: (phoneNumber: string) => void;
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    setCity: (city: string) => void;
    setCountry: (country: string) => void;
    setMinTemperature: (minTemperature: number) => void;
    setMaxTemperature: (maxTemperature: number) => void;
    setWeekDaysRunning: (days: string) => void;
    setNoteBySMS: (value: boolean) => void;
    setNoteByWhatsapp: (value: boolean) => void;
    setNoteByEmail: (value: boolean) => void;
    reset: () => void;
    setError: (error: string) => void;
}

const useRegisterStore = create<AppStoreState>()((set) => ({
    name: '',
    phoneNumber: '',
    email: '',
    password: '',
    country: '',
    city: '',
    minTemperature: 15,
    maxTemperature: 25,
    step: 0,
    weekDaysRunning: '1111111',
    noteByEmail: false,
    noteByWhatsapp: false,
    noteBySMS: true,
    error: '',
    
    setStep: (step: number) => {
        set((state) => ({
            ...state, step
        }))
    },
    setName: (name: string) => {
        set((state) => ({
            ...state, name
        }));
    },
    setEmail: (email: string) => {
        set((state) => ({
            ...state, email
        }));
    },
    setPassword: (password: string) => {
        set((state) => ({
            ...state, password
        }));
    },
    setPhoneNumber: (phoneNumber: string) => {
        set((state) => ({
            ...state, phoneNumber
        }))
    },
    setCountry: (country: string) => {
        set((state) => ({
            ...state, country
        }))
    },
    setCity: (city: string) => {
        set((state) => ({
            ...state, city
        }))
    },
    setMinTemperature: (minTemperature: number) => {
        set((state) => ({
            ...state, minTemperature
        }))
    },
    setMaxTemperature: (maxTemperature: number) => {
        set((state) => ({
            ...state, maxTemperature
        }))
    },
    setNoteBySMS: (noteBySMS: boolean) => {
        set((state) => ({
            ...state, noteBySMS
        }))
    },
    setNoteByWhatsapp: (noteByWhatsapp: boolean) => {
        set((state) => ({
            ...state, noteByWhatsapp
        }))

    },
    setNoteByEmail: (noteByEmail: boolean) => {
        set((state) => ({
            ...state, noteByEmail
        }))
    },
    setWeekDaysRunning: (weekDaysRunning: string) => {
        set((state) => ({
            ...state,  weekDaysRunning
        }))
    },
    setError: (error: string) => {
        set((state) => ({
            ...state, error
        }))
    },
    reset: () => {
        set({
            name: '',
            phoneNumber: '',
            email: '',
            password: '',
            country: '',
            city: '',
            minTemperature: 15,
            maxTemperature: 25,
            weekDaysRunning: '1111111',
            noteByEmail: false,
            noteByWhatsapp: false,
            noteBySMS: true,
            error: '',
        });
    },
}));

export default useRegisterStore;