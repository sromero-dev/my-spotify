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
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Album {
  _id?: string;
  title: string;
  artist: string;
  imageUrl: string;
  year: number;
  songs?: string[] | Song[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MusicStore {
  albums: Album[];
  songs: Song[];
  isLoading: boolean;
  error: string | null;
  fetchAlbums: () => Promise<void>;
}
