import { Image, ImageProps } from "@mantine/core";

import logo from "./logo.png";

export type LogoProps = Omit<ImageProps, "src">;

export function Logo(props: LogoProps) {
  return <Image src={logo} {...props} />;
}
