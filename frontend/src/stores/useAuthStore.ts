import { create } from "zustand";
import type { AuthStore } from "@/lib/utils";
import { getErrorMessage } from "@/lib/utils";
import { axiostInstance } from "@/lib/axios";

export const useAuthStore = create<AuthStore>((set) => ({
  error: null,
  isAdmin: false,
  isLoading: false,

  checkAdminStatus: async () => {
    set({ isLoading: true });
    try {
      const res = await axiostInstance.get("/admin/check");
      set({ isAdmin: res.data.admin });
    } catch (error: unknown) {
      set({ error: getErrorMessage(error) });
    } finally {
      set({ isLoading: false });
    }
  },

  reset: () => set({ isAdmin: false, isLoading: false, error: null }),
}));
