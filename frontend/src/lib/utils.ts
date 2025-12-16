import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Functions exports
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

export function formatDuration(duration: number): string {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

// Types exports
export interface Song {
  _id?: string;
  title: string;
  artist: string;
  albumId?: string | null;
  imageUrl: string;
  audioUrl?: string;
  duration: number;
  year: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Album {
  _id?: string;
  title: string;
  artist: string;
  imageUrl: string;
  year: number;
  songs?: string[] | Song[];
  createdAt?: string;
  updatedAt?: string;
}

export interface MusicStore {
  albums: Album[];
  songs: Song[];
  isLoading: boolean;
  error: string | null;
  currentAlbum: Album | null;
  madeForYouSongs: Song[];
  trendingSongs: Song[];
  featuredSongs: Song[];
  fetchAlbums: () => Promise<void>;
  fetchAlbumById: (id: string) => Promise<void>;
  fetchMadeForYouSongs: () => Promise<void>;
  fetchTrendingSongs: () => Promise<void>;
  fetchFeaturedSongs: () => Promise<void>;
}

export interface User {
  _id?: string;
  username: string;
  profileImage: string;
  clerkId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChatStore {
  users: User[];
  error: string | null;
  isLoading: boolean;
  fetchUsers: () => Promise<void>;
}

export interface AuthStore {
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;

  checkAdminStatus: () => Promise<void>;
  reset: () => void;
}

export interface PlayerStore {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;

  initializeQueue: (songs: Song[]) => void;
  playAlbum: (songs: Song[], startIndex?: number) => void;
  setCurrentSong: (song: Song | null) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
}
