import { queryOptions } from "@tanstack/react-query";
import { bidApi } from "./bid.api";
import { z } from "zod";
import { ItemsQueryData } from "../item/items.query";
import { usersQueryDataSchema } from "../user/users.query";

export const bidQueryDataSchema = z.object({
  id: z.string().uuid(),
  itemId: z.string().uuid(),
  amount: z.number().positive(),
  createdAt: z.coerce.date(),
  user: usersQueryDataSchema,
});

export type BidQueryData = z.infer<typeof bidQueryDataSchema>;

export const bidsQueryDataResponseSchema = z.array(bidQueryDataSchema);

export type BidsQueryDataResponse = z.infer<typeof bidsQueryDataResponseSchema>;

export function bidsQuery({ itemId }: { itemId: ItemsQueryData["id"] }) {
  return queryOptions({
    queryKey: ["bids", itemId],
    queryFn: async () => {
      const { data, error } = await bidApi("/bid/:itemId", {
        method: "GET",
        params: { itemId },
        output: bidsQueryDataResponseSchema,
      });

      if (error) {
        throw new Error("Network response was not ok");
      }

      return data;
    },
  });
}
