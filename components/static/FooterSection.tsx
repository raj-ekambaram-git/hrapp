import {
  Box,
    Button,
    Center,
    Container,
    Flex,
    Heading,
    Image,
    LinkBox,
    LinkOverlayProps,
    Spacer,
    Stack,
    Text,
    VStack,
    Wrap,
    WrapItem,
  } from "@chakra-ui/react";
  import { FunctionComponent } from "react";
  
  interface FooterSectionProps {}
  
  export const FooterSection: FunctionComponent<FooterSectionProps> = () => {
    return (
      <Center w="full" maxH={["30px", "90vh"]}>
        <Container maxW="container.xl" rounded="lg">
        <Stack
            spacing={[4, 16]}
            alignItems="center"
            direction={["column", null]}
            w="full"
            h="full"
          >
            <Box rounded="lg">
              <Text>© 2023 boNeeds</Text>
            </Box>
          </Stack>          
        </Container>
      </Center>
    );
  };