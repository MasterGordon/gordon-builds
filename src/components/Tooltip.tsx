import {
  Tooltip as ChakraTooltip,
  Heading,
  VStack,
  TooltipProps as ChakraTooltipProps,
} from "@chakra-ui/react";
import { PropsWithChildren } from "react";

interface TooltipProps extends PropsWithChildren {
  content?: React.ReactNode;
  header?: React.ReactNode;
  placement?: ChakraTooltipProps["placement"];
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  header,
  placement,
}) => {
  return (
    <ChakraTooltip
      label={
        <>
          {header && (
            <Heading
              size="md"
              color="white"
              backgroundColor="gray.700"
              padding="3"
              borderTopRadius={content ? "sm" : undefined}
              borderRadius={content ? undefined : "sm"}
            >
              {header}
            </Heading>
          )}
          {content && (
            <VStack
              backgroundColor="gray.800"
              alignItems="stretch"
              padding="3"
              borderBottomRadius={header ? "sm" : undefined}
              borderRadius={header ? undefined : "sm"}
            >
              {content}
            </VStack>
          )}
        </>
      }
      hasArrow
      placement={placement}
      bg="gray.800"
      color="white"
      borderRadius="md"
    >
      {children}
    </ChakraTooltip>
  );
};

export default Tooltip;
