import { useEffect } from "react";
import { ably } from "../utils/ably";
import { isJSONParsable, jsonParse } from "@better-fetch/fetch";

export type Channel =
  | "user"
  | "bid"
  | `bid:item:${string}`
  | `bid:user:${string}`;

export type UseSubscribeArgs<T> = {
  onEvent: (data?: T) => void;
};

export const useSubscribe = <T>(
  key: Channel | undefined,
  { onEvent }: UseSubscribeArgs<T>
) => {
  useEffect(() => {
    if (!key) return;
    const channel = ably.channels.get(key);
    channel.subscribe((msg) => {
      if (isJSONParsable(msg.data)) {
        onEvent(jsonParse(msg.data) as T);
      }

      onEvent();
    });

    return () => {
      channel.unsubscribe();
    };
  }, [key, onEvent]);
};
