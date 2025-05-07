import { z } from "zod";
import { bidApi } from "./bid.api";
import { ItemsQueryData } from "../item/items.query";

export const bidMutationDataSchema = z.object({
  amount: z.number().positive().min(1, "Bid amount must be greater than 0"),
  userId: z.string().uuid().min(1, "User is required"),
});

export type BidMutationDataShape = typeof bidMutationDataSchema.shape;
export type BidMutationDataRequest = z.infer<typeof bidMutationDataSchema>;

export function bidMutation({ itemId }: { itemId: ItemsQueryData["id"] }) {
  return async (payload: BidMutationDataRequest) => {
    const { data, error } = await bidApi("/bid/:itemId", {
      method: "POST",
      params: { itemId },
      body: payload,
    });

    if (error) {
      throw new Error("Network response was not ok");
    }

    return data;
  };
}
