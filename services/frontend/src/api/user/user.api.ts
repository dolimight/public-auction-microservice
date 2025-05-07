import { createApi } from "../createApi";

export const userApi = createApi({
  baseURL: import.meta.env.VITE_USER_PROFILE_SERVICE,
});
