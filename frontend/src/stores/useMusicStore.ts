import type { MusicStore, Album } from "@/lib/utils";
import { getErrorMessage } from "@/lib/utils";
import { axiostInstance } from "@/lib/axios";
import { create } from "zustand";

const useMusicStore = create<MusicStore>((set) => ({
  albums: [],
  songs: [],
  isLoading: false,
  error: null,
  currentAlbum: null,

  fetchAlbums: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiostInstance.get<Album[]>("/albums");
      set({ albums: res.data });
    } catch (error: unknown) {
      set({ error: getErrorMessage(error) });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAlbumById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiostInstance.get<Album>(`/albums/${id}`);
      set({ currentAlbum: res.data });
    } catch (error) {
      set({ error: getErrorMessage(error) });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useMusicStore;
