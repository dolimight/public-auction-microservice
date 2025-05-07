import { z } from "zod";
import { itemApi } from "./item.api";
import { infiniteQueryOptions } from "@tanstack/react-query";

export const itemsQueryDataSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  image: z.string(),
  shortDescription: z.string(),
  longDescription: z.string(),
  startingBid: z.number(),
  buyNowPrice: z.number().nullable(),
  bidIncrement: z.number(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  sellerId: z.string().uuid(),
  category: z.object({
    id: z.number(),
    name: z.string(),
  }),
  subCategory: z.object({
    id: z.number(),
    name: z.string(),
  }),
  condition: z.object({
    id: z.number(),
    name: z.string(),
  }),
});

export type ItemsQueryData = z.infer<typeof itemsQueryDataSchema>;

export const itemQueryDataResponseSchema = z.object({
  items: z.array(itemsQueryDataSchema),
  nextCursor: itemsQueryDataSchema.shape.id.optional(),
});

export type ItemQueryDataResponse = z.infer<typeof itemQueryDataResponseSchema>;

export function itemsQuery() {
  return infiniteQueryOptions<ItemQueryDataResponse>({
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    queryKey: ["items"],
    queryFn: async ({ pageParam }) => {
      const { data, error } = await itemApi("/item", {
        method: "GET",
        query: { cursor: pageParam },
        output: itemQueryDataResponseSchema,
      });

      if (error) {
        throw new Error("Network response was not ok");
      }

      return data;
    },
  });
}
