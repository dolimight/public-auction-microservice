import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { usersQuery } from "../../../api/user/users.query";
import {
  Button,
  Card,
  Center,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useUserStore } from "../../../hooks/useUserStore";
import { z } from "zod";

export const Route = createFileRoute("/_app/spoof/users")({
  component: RouteComponent,
  validateSearch: z.object({ returnTo: z.string().optional() }),
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { returnTo } = Route.useSearch();
  const { setUser } = useUserStore();
  const { data: users, isError, isPending, error } = useQuery(usersQuery());

  return isPending ? (
    <Center p="md">
      <Loader />
    </Center>
  ) : isError ? (
    <Text c="red">Error: {error.message}</Text>
  ) : (
    <Stack>
      <Title order={2}>Users</Title>
      {users.map((user) => (
        <Card key={user.id} withBorder p="md" radius="md">
          <Group justify="space-between">
            <Stack gap={0}>
              <Text>{user.name}</Text>
              <Text c="dimmed" size="sm">
                {user.email}
              </Text>
            </Stack>
            <Button
              onClick={() => {
                setUser(user);
                navigate({ to: returnTo ?? "/" });
              }}
            >
              Sign In
            </Button>
          </Group>
        </Card>
      ))}
    </Stack>
  );
}
