import { createLink, LinkComponent } from "@tanstack/react-router";
import { Anchor, AnchorProps } from "@mantine/core";
import { forwardRef } from "react";

type MantineAnchorProps = Omit<AnchorProps, "href">;

const MantineLinkComponent = forwardRef<HTMLAnchorElement, MantineAnchorProps>(
  (props, ref) => {
    return <Anchor ref={ref} {...props} />;
  }
);

const CreatedLinkComponent = createLink(MantineLinkComponent);

export const AppAnchor: LinkComponent<typeof MantineLinkComponent> = (
  props
) => {
  return <CreatedLinkComponent preload="intent" {...props} />;
};
