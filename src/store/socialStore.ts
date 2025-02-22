import { persist } from "zustand/middleware";
import { create } from "zustand";

export interface Post {
    id: string;
    username: string;
    name: string;
    city?: string;
    text: string;
    distance: number;
    duration: string;
    likes: number;
    comments?: PostComment[];
    date: Date;
}

export interface PostComment {
    username: string;
    text: string;
    date: Date;
}

interface SocialState {
    posts: Post[];
    addPost: (post: Post) => void;
    addComment: (postId: string, comment: PostComment) => void;
    likePost: (postId: string) => void;
    clear: () => void;
}

export const useSocialStore = create<SocialState>()(
    persist<SocialState>((set) => ({
        posts: [],
        addPost: (post: Post) => set((state) => ({
            posts: [post, ...state.posts]
        })),
        addComment: (postId: string, comment: PostComment) => set((state) => ({
            posts: state.posts.map(p => p.id === postId ? { ...p, comments: [...p.comments || [], comment] } : p)
        })),
        likePost: (postId: string) => set((state) => ({
            posts: state.posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p)
        })),
        clear: () => set({ posts: [] })
    }), {
        name: "social-storage",
    })
)

