import { AspectRatio, Card, Group, Image, Text } from "@mantine/core";
import { ItemsQueryData } from "../api/item/items.query";
import { AppAnchor } from "./app-anchor";

export type ItemCardProps = {
  item: ItemsQueryData;
};

export function ItemCard({ item }: ItemCardProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder pos="relative">
      <Card.Section bg="gray.1">
        <AspectRatio m="md">
          <Image src={item.image} />
        </AspectRatio>
      </Card.Section>
      <Group
        justify="space-between"
        align="start"
        mt="md"
        mb="xs"
        wrap="nowrap"
      >
        <AppAnchor to="/item/$itemId" params={{ itemId: item.id }}>
          <Text fw={500}>{item.title}</Text>
        </AppAnchor>
      </Group>
      <Text size="sm" c="dimmed">
        {item.shortDescription}
      </Text>
    </Card>
  );
}
