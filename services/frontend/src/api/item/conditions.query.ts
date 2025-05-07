import { z } from "zod";
import { itemApi } from "./item.api";
import { queryOptions } from "@tanstack/react-query";

export const conditionQueryDataSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export type ConditionQueryData = z.infer<typeof conditionQueryDataSchema>;

export const conditionsQueryDataSchema = z.array(conditionQueryDataSchema);

export type ConditionsQueryDataResponse = z.infer<
  typeof conditionsQueryDataSchema
>;

export function conditionsQuery() {
  return queryOptions({
    queryKey: ["conditions"],
    queryFn: async () => {
      const { data, error } = await itemApi("condition", {
        method: "GET",
        output: conditionsQueryDataSchema,
      });

      if (error) {
        throw new Error("Network response was not ok");
      }

      return data;
    },
  });
}
