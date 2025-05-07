import { createFetch } from "@better-fetch/fetch";
import { logger } from "@better-fetch/logger";

export function createApi({ baseURL }: { baseURL: string }) {
  return createFetch({
    baseURL,
    plugins: [logger()],
  });
}
