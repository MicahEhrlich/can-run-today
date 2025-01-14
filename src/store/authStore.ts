import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
    name: string;
    id: string;
    email: string;
    phoneNumber: string;
    city: string;
}

interface AuthStoreState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    error: string;
    code: string;
    loading: boolean;

    setUser: (user: User) => void;
    setAuthData: (user: User, token: string, refreshToken: string) => void;
    setToken: (token: string) => void;
    setRefreshToken: (token: string) => void;
    setError: (error: string) => void;
    setCode: (code: string) => void;
    setLoading: (loading: boolean) => void;
    reset: () => void;
    signOut: () => void;
}

const useAuthStore = create<AuthStoreState>()(
        persist<AuthStoreState>((set) => ({
        user: {
            name: '',
            id: '',
            email: '',
            phoneNumber: '',
            city: ''
        },
        token: '',
        refreshToken: '',
        error: '',
        code: '',
        loading: false,
    
        setUser: (user: User) => {
            set((state) => ({
                ...state, user
            }))
        },
        setAuthData: (user: User, token: string, refreshToken) => {
            set((state) => ({
                ...state, user, token, refreshToken
            }))
        },
        setToken: (token: string) => {
            set((state) => ({
                ...state, token
            }))
        },
        setRefreshToken: (token: string) => {
            set((state) => ({
                ...state, refreshToken: token
            }))
        },
        setCode: (code: string) => {
            set((state) => ({
                ...state, code
            }))
        },
        setError: (error: string) => {
            set((state) => ({
                ...state, error
            }))
        },
        setLoading: (loading: boolean) => {
            set((state) => ({
                ...state, loading
            }))
        },
        reset: () => {
            set({
                token: '',
                error: '',
                code: '',
                loading: false
            })
        },
        signOut: () => set({ 
            user: null,
            token: null,
            refreshToken: null,
            loading: false
        }),
    }), {
        name: "auth-storage",
    }));

export default useAuthStore;