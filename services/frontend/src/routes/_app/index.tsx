import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { itemsQuery } from "../../api/item/items.query";
import {
  Button,
  Center,
  Group,
  Loader,
  Modal,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure, useIntersection } from "@mantine/hooks";
import { useCallback, useEffect, useRef } from "react";
import { ItemCard } from "../../components/item-card";
import { CreateAuctionForm } from "../../components/forms/create-auction-form";
import { useUserStore } from "../../hooks/useUserStore";

export const Route = createFileRoute("/_app/")({
  component: Index,
});

function Index() {
  const queryClient = useQueryClient();
  const { user } = useUserStore();
  const [opened, { open, close }] = useDisclosure(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({
    root: containerRef.current,
    threshold: 1,
  });
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isPending,
    isError,
  } = useInfiniteQuery(itemsQuery());

  const handleBottomReached = useCallback(() => {
    if (hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage]);

  useEffect(() => {
    if (entry?.isIntersecting && handleBottomReached && !isFetching) {
      handleBottomReached();
    }
  }, [entry, handleBottomReached, isFetching]);

  const handleCreateAuctionSuccess = () => {
    queryClient.invalidateQueries({ queryKey: itemsQuery().queryKey });
    close();
  };

  return isPending ? (
    <Center p="md">
      <Loader />
    </Center>
  ) : isError ? (
    <Text c="red">Error: {error.message}</Text>
  ) : (
    <Stack>
      <Group justify="space-between">
        <Title order={2}>Auctions</Title>
        <Button onClick={open} disabled={!user}>
          New Auction
        </Button>
      </Group>
      <ScrollArea onBottomReached={handleBottomReached}>
        <SimpleGrid cols={4}>
          {data.pages.map((group) =>
            group.items.map((item) => <ItemCard key={item.id} item={item} />)
          )}
        </SimpleGrid>
        <Center ref={ref} p="md">
          {isFetchingNextPage ? <Loader /> : null}
        </Center>
      </ScrollArea>
      <Modal opened={opened} onClose={close} title="New Auction">
        <CreateAuctionForm onSuccess={handleCreateAuctionSuccess} />
      </Modal>
    </Stack>
  );
}
