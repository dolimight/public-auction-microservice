import { Realtime } from "ably";

export const ably = new Realtime(import.meta.env.VITE_ABLY_API_KEY!);
