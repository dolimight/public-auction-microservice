import { createApi } from "../createApi";

export const bidApi = createApi({
  baseURL: import.meta.env.VITE_BIDDING_SERVICE,
});
