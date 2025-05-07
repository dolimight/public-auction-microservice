import { Rest } from "ably";

export const ably = new Rest(process.env.ABLY_API_KEY!);
