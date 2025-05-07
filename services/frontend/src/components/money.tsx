import { NumberFormatter } from "@mantine/core";

export type MoneyProps = {
  value: number;
};

export function Money({ value }: MoneyProps) {
  return (
    <NumberFormatter
      prefix="$"
      thousandSeparator
      fixedDecimalScale
      decimalScale={2}
      value={value}
    />
  );
}
