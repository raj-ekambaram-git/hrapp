import {
    Button,
    Center,
    Container,
    Heading,
    Text,
    VStack,
    Image,
    HStack
  } from "@chakra-ui/react";
  import { FunctionComponent } from "react";
  import content from '../../static.content.json';

  interface HeroSectionProps {}
  
  export const HeroSection: FunctionComponent<HeroSectionProps> = () => {
    return (
      <Container maxW="container.xl">
        <Center p={4} minHeight="70vh">
          <VStack>
            <Container maxW="container.2xl" textAlign="center">
              <HStack>
                <Image
                  src={content.index.content.heroSection.image}
                  width={800}
                  height={433}
                  alt="hero"
                />
                <VStack>
                    <Heading size="2xl" mb={4} color="gray.700">
                    {content.index.content.heroSection.heading1}
                  </Heading>
      
                  <Text fontSize="xl" color="gray.500">
                    {content.index.content.heroSection.heading2}
                  </Text>
      
                  <Button
                    mt={8}
                    colorScheme="teal"
                    onClick={() => {
                      window.open(content.index.content.heroSection.cta.url,);
                    }}
                  >
                    {content.index.content.heroSection.cta.label}
                  </Button>
      
                  <Text my={2} fontSize="sm" color="gray.500">
                  {content.index.content.heroSection.heading3}
                  </Text>
                </VStack>
              </HStack>

            </Container>
          </VStack>
        </Center>
      </Container>
    );
  };