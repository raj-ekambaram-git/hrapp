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
    Text,
    VStack,
    Wrap,
    WrapItem,
  } from "@chakra-ui/react";
  import { FunctionComponent } from "react";
  
  interface FooterSectionProps {}
  
  export const FooterSection: FunctionComponent<FooterSectionProps> = () => {
    return (
      <Container maxW="container.lg">
          <Flex py={6}>
            <Box>
              <Text>© 2022 Biller</Text>

              <Text>Made by Sukh</Text>
            </Box>
            <Spacer />

            {/* <LinkBox
              <LinkOverlayProps href="https://twitter.com/@thisissukh_" isExternal>
                <Image src="twitter.svg" alt="Twitter logo"></Image>
              </LinkOverlay>
            </LinkBox> */}
          </Flex>
        </Container>
    );
  };