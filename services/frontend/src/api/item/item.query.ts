import { z } from "zod";
import { itemApi } from "./item.api";
import { queryOptions } from "@tanstack/react-query";

export const itemQueryDataSchema = z.object({
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

export type ItemQueryDataResponse = z.infer<typeof itemQueryDataSchema>;

export function itemQuery({ id }: { id: ItemQueryDataResponse["id"] }) {
  return queryOptions({
    queryKey: ["item", id],
    queryFn: async () => {
      const { data, error } = await itemApi("/item/:id", {
        method: "GET",
        params: { id },
        output: itemQueryDataSchema,
      });

      if (error) {
        throw new Error("Network response was not ok");
      }

      return data;
    },
  });
}
