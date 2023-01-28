import {
    Button,
    Center,
    Container,
    Heading,
    Image,
    Text,
    VStack,
    Wrap,
    WrapItem,
  } from "@chakra-ui/react";
  import { FunctionComponent } from "react";
  
  interface SocialMediaSectionProps {}
  
  export const SocialMediaSection: FunctionComponent<SocialMediaSectionProps> = () => {
    return (
      <Container maxW="container.2xl" centerContent py={[20]}>
            <Text color="gray.600" fontSize="lg">
              Used by teams worldwide
            </Text>

            <Wrap
              spacing={[10, 20]}
              mt={8}
              align="center"
              justify="center"
              w="full"
            >
              <WrapItem>
                <Image src="microsoft-logo.svg" alt="Microsoft logo" />
              </WrapItem>

              <WrapItem>
                <Image src="adobe-logo.svg" alt="Adobe logo" />
              </WrapItem>

              <WrapItem>
                <Image src="microsoft-logo.svg" alt="Microsoft logo" />
              </WrapItem>

              <WrapItem>
                <Image src="adobe-logo.svg" alt="Adobe logo" />
              </WrapItem>
            </Wrap>
      </Container>
    );
  };