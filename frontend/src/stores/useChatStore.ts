import { create } from "zustand";
import type { ChatStore } from "@/lib/utils";
import { axiostInstance } from "@/lib/axios";
import { getErrorMessage } from "@/lib/utils";

export const useChatStore = create<ChatStore>((set) => ({
  users: [],
  error: null,
  isLoading: false,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiostInstance.get("/users");
      set({ users: res.data });
    } catch (error: unknown) {
      set({ error: getErrorMessage(error) });
    } finally {
      set({ isLoading: false });
    }
  },
}));
