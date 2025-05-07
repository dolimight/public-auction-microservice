import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { itemQuery } from "../../../api/item/item.query";
import {
  AspectRatio,
  Avatar,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Center,
  Divider,
  Group,
  Image,
  Loader,
  SimpleGrid,
  Skeleton,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { AppAnchor } from "../../../components/app-anchor";
import { Money } from "../../../components/money";
import { Countdown } from "../../../components/countdown";
import { useUserStore } from "../../../hooks/useUserStore";
import { useSubscribe } from "../../../hooks/useSubscribe";
import { bidsQuery } from "../../../api/bid/bid.query";
import { bidMutation } from "../../../api/bid/bid.mutation";

export const Route = createFileRoute("/_app/item/$itemId")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const { user } = useUserStore();
  const { itemId } = Route.useParams();
  const [item, bids] = useQueries({
    queries: [itemQuery({ id: itemId }), bidsQuery({ itemId })],
  });
  const bid = useMutation({ mutationFn: bidMutation({ itemId }) });

  useSubscribe(`bid:item:${itemId}`, {
    onEvent: () => {
      queryClient.invalidateQueries({
        queryKey: bidsQuery({ itemId }).queryKey,
      });
    },
  });

  const lastBid = bids.data?.at(0);
  const nextBidAmount =
    bids.isPending || item.isPending
      ? {
          status: "loading" as const,
        }
      : !item.data
        ? {
            status: "error" as const,
            error: new Error("Item not found"),
          }
        : {
            status: "success" as const,
            value:
              (lastBid ? lastBid.amount : item.data.startingBid) +
              item.data.bidIncrement,
          };

  const handlePlaceBid = () => {
    if (!nextBidAmount.value || !user) return;
    bid.mutate({
      amount: nextBidAmount.value,
      userId: user?.id,
    });
  };

  return item.isPending ? (
    <Center p="md">
      <Loader />
    </Center>
  ) : item.isError ? (
    <Text c="red">Error: {item.error.message}</Text>
  ) : (
    <Stack>
      <Breadcrumbs>
        <AppAnchor to="/">Home</AppAnchor>
        <Text c="dimmed">{item.data.title}</Text>
      </Breadcrumbs>
      <SimpleGrid cols={2} spacing="xl" verticalSpacing="md">
        <Card shadow="sm" radius="md" p="xs" withBorder>
          <Card radius="md" bg="gray.1" withBorder>
            <AspectRatio m="md">
              <Image src={item.data.image} />
            </AspectRatio>
          </Card>
        </Card>
        <Stack gap="xl">
          <Stack>
            <Stack gap={0}>
              <Text>{item.data.category.name}</Text>
              <Title>{item.data.title}</Title>{" "}
            </Stack>
            <Badge size="lg" p="md" color="blue">
              <Group gap="xs" align="center">
                {bids.isPending ? (
                  <Skeleton>
                    <Money value={0} />
                  </Skeleton>
                ) : lastBid ? (
                  <Money value={lastBid.amount} />
                ) : (
                  <Money value={item.data.startingBid} />
                )}
                <Badge size="lg" color="blue.8">
                  USD
                </Badge>
              </Group>
            </Badge>
          </Stack>
          <Stack>
            <Stack gap="xs">
              <Text c="dimmed" fw={500}>
                Highest bid by
              </Text>
              {bids.isPending ? (
                <Skeleton>
                  <Text>No bids yet</Text>
                </Skeleton>
              ) : lastBid ? (
                <Group>
                  <Avatar size="lg" />
                  <Stack gap={0}>
                    <Text fw={700} span>
                      {lastBid.user.name}
                    </Text>
                    <Text>
                      <Money value={lastBid.amount} />
                    </Text>
                  </Stack>
                </Group>
              ) : (
                <Text c="dimmed">No bids yet</Text>
              )}
            </Stack>
            <Stack gap="xs">
              <Text c="dimmed" fw={500}>
                Auction ends in{" "}
              </Text>
              <Countdown date={item.data.endDate} />
            </Stack>
          </Stack>
          <Divider />
          <Group>
            {/* {item.data.buyNowPrice ? (
              <Button
                size="lg"
                radius="xl"
                disabled={!user || item.data.sellerId === user.id}
              >
                Buy for <Space w={4} />
                <Money value={item.data.buyNowPrice} />
              </Button>
            ) : null} */}
            <Button
              variant="default"
              size="lg"
              radius="xl"
              disabled={
                bid.isPending ||
                bids.isPending ||
                !user ||
                item.data.sellerId === user.id ||
                !nextBidAmount ||
                (lastBid && lastBid.user.id === user.id)
              }
              loading={bid.isPending}
              onClick={handlePlaceBid}
            >
              Place a bid for <Space w={4} />
              {nextBidAmount.status === "success" ? (
                <Money value={nextBidAmount.value} />
              ) : (
                <Skeleton>
                  <Money value={0} />
                </Skeleton>
              )}
            </Button>
          </Group>
        </Stack>
        <Stack gap="xs">
          <Text fw={500}>Description</Text>
          <Text size="sm">
            {item.data.longDescription.length
              ? item.data.longDescription
              : "None"}
          </Text>
        </Stack>
      </SimpleGrid>
    </Stack>
  );
}
