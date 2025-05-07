import { create } from "zustand";
import { UsersQueryData } from "../api/user/users.query";

type UserState = {
  user?: UsersQueryData;
  setUser: (user?: UsersQueryData) => void;
};

export const useUserStore = create<UserState>()((set) => ({
  setUser: (user) => set({ user }),
}));
