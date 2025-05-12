import { ably } from "../utils/ably";

export type Channel = "bid" | `bid:item:${string}` | `bid:user:${string}`;

export async function publish(key: Channel, data: object) {
  const channel = ably.channels.get(key);
  await channel.publish(key, JSON.stringify(data));
}
