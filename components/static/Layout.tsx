import { Box, Stack, VStack } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { Header } from "./HeaderSection";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: FunctionComponent<LayoutProps> = ({
  children,
}: LayoutProps) => {
  return (
    <Box>
      <Stack
        justify="space-between"
        p={[0, 4]}
        w={['full', 'full']}
        direction={['column']}
      >
        <Header name="boNeeds" />
        {children}
      </Stack>
    </Box>
  );
};