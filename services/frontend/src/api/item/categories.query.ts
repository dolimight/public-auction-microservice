import { z } from "zod";
import { itemApi } from "./item.api";
import { queryOptions } from "@tanstack/react-query";

export const categoryQueryDataSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export type CategoryQueryData = z.infer<typeof categoryQueryDataSchema>;

export const categoriesQueryDataSchema = z.array(categoryQueryDataSchema);

export type CategoriesQueryDataResponse = z.infer<
  typeof categoriesQueryDataSchema
>;

export function categoriesQuery() {
  return queryOptions({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await itemApi("category", {
        method: "GET",
        output: categoriesQueryDataSchema,
      });

      if (error) {
        throw new Error("Network response was not ok");
      }

      return data;
    },
  });
}
