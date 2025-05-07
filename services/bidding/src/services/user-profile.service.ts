import { z } from "zod";
import { createApi } from "../utils/createApi";

const userApi = createApi({
  baseURL: process.env.USER_PROFILE_SERVICE!,
});

export const userDataSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
});

export type UserData = z.infer<typeof userDataSchema>;

export const usersDataResponseSchema = z.array(userDataSchema);

export type UsersDataResponse = z.infer<typeof usersDataResponseSchema>;

export async function getUsers() {
  const { data, error } = await userApi("/users", {
    method: "GET",
    output: usersDataResponseSchema,
  });

  if (error) {
    throw new Error("Network response was not ok");
  }

  return data;
}
