import React from "react";

const NextLink = (props: Record<string, unknown>) => {
  const { href, children, ...rest } = props;
  const hrefStr = typeof href === "object" && href !== null ? (href as { pathname: string }).pathname : (href as string);
  return React.createElement("a", { href: hrefStr, ...rest }, children as React.ReactNode);
};

export default NextLink;
