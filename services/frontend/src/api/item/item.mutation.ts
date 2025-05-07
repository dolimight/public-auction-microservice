import { z } from "zod";
import { itemApi } from "./item.api";

export const itemMutationDataSchema = z.object({
  title: z.string().min(1, "Title is required"),
  image: z
    .string()
    .regex(
      /^data:image\/[a-zA-Z]+;base64,[a-zA-Z0-9+/=]+$/,
      "Image is required"
    ),
  shortDescription: z.string().min(1, "Short description is required"),
  longDescription: z.string().min(1, "Long description is required"),
  startingBid: z.number().min(1, "Starting bid must be a positive number"),
  buyNowPrice: z.number().nullable(),
  bidIncrement: z.number().min(1, "Bid increment must be a positive number"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  sellerId: z.string().uuid().min(1, "Seller is required"),
  categoryId: z.coerce.number().min(1, "Category is required"),
  subCategoryId: z.coerce.number().min(1, "Sub-category is required"),
  conditionId: z.coerce.number().min(1, "Condition is required"),
});

export type ItemMutationDataShape = typeof itemMutationDataSchema.shape;
export type ItemMutationDataRequest = z.infer<typeof itemMutationDataSchema>;

export function itemMutation() {
  return async (payload: ItemMutationDataRequest) => {
    const { data, error } = await itemApi("/item", {
      method: "PUT",
      body: payload,
    });

    if (error) {
      throw new Error("Network response was not ok");
    }

    return data;
  };
}
