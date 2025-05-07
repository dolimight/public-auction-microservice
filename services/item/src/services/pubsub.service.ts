import { ably } from "../utils/ably";

export type Channel = "user";

export async function publish(key: Channel, data: object) {
  const channel = ably.channels.get(key);
  await channel.publish(key, JSON.stringify(data));
}
