import { useEffect } from "react";
import { ably } from "../utils/ably";

export type Channel = "user" | "bid" | `bid:item:${string}`;

export type UseSubscribeArgs = {
  onEvent: () => void;
};

export const useSubscribe = (key: Channel, { onEvent }: UseSubscribeArgs) => {
  useEffect(() => {
    const channel = ably.channels.get(key);
    channel.subscribe(onEvent);

    return () => {
      channel.unsubscribe();
    };
  }, [key, onEvent]);
};
