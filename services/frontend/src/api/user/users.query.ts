import { queryOptions } from "@tanstack/react-query";
import { userApi } from "./user.api";
import { z } from "zod";

export const usersQueryDataSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
});

export type UsersQueryData = z.infer<typeof usersQueryDataSchema>;

export const usersQueryDataResponseSchema = z.array(usersQueryDataSchema);

export type UsersQueryDataResponse = z.infer<
  typeof usersQueryDataResponseSchema
>;

export function usersQuery() {
  return queryOptions({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await userApi("/users", {
        method: "GET",
        output: usersQueryDataResponseSchema,
      });

      if (error) {
        throw new Error("Network response was not ok");
      }

      return data;
    },
  });
}
