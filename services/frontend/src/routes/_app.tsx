import { AppShell, Group, Burger, Title, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Logo } from "../components/logo";
import { useUserStore } from "../hooks/useUserStore";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
});

const headerHeight = 60;

function RouteComponent() {
  const navigate = Route.useNavigate();
  const [opened, { toggle }] = useDisclosure();
  const { user, setUser } = useUserStore((state) => state);

  return (
    <AppShell header={{ height: headerHeight }} padding="md">
      <AppShell.Header>
        <Group h="100%" justify="space-between" px="md">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Group gap="sm">
              <Link to="/">
                <Logo radius="md" h={40} />
              </Link>
              <Title>Auction</Title>
            </Group>
          </Group>
          <Group>
            {user ? (
              <>
                <Title order={3}>{user.name}</Title>
                <Button
                  variant="default"
                  onClick={() => {
                    setUser();
                    navigate({ to: "/spoof/users" });
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                onClick={() =>
                  navigate({
                    to: "/spoof/users",
                    search: { returnTo: window.location.pathname },
                  })
                }
              >
                Sign In
              </Button>
            )}
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
