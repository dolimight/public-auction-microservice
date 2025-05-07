import { createApi } from "../createApi";

export const itemApi = createApi({
  baseURL: import.meta.env.VITE_ITEM_SERVICE,
});
