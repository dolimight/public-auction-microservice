import { useEffect, useState } from "react";
import dayjs, { duration } from "dayjs";
import { Group, Stack, Text } from "@mantine/core";

export type CountdownProps = {
  date: Date;
};

export function Countdown({ date }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(date));

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(date);
      setTimeLeft(newTimeLeft);
      if (newTimeLeft.asSeconds() <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [date]);

  return (
    <Group gap="lg">
      <Stack gap={0}>
        <Number>{timeLeft.days()}</Number>
        <Text c="dimmed">Days</Text>
      </Stack>
      <Stack gap={0}>
        <Number>{timeLeft.hours()}</Number>
        <Text c="dimmed">Hours</Text>
      </Stack>
      <Stack gap={0}>
        <Number>{timeLeft.minutes()}</Number>
        <Text c="dimmed">Minutes</Text>
      </Stack>
      <Stack gap={0}>
        <Number>{timeLeft.seconds()}</Number>
        <Text c="dimmed">Seconds</Text>
      </Stack>
    </Group>
  );
}

function Number({ children }: { children: number }) {
  const value = children < 0 ? 0 : children;
  return (
    <Text size="lg" fw={700}>
      {value.toString().padStart(2, "0")}
    </Text>
  );
}

function calculateTimeLeft(date: Date) {
  return duration(dayjs(date).diff(dayjs()));
}
