import {
    Button,
    Center,
    Container,
    Heading,
    Text,
    VStack,
    Image,
    HStack,
    chakra,
    Box,
    Stack,
  } from "@chakra-ui/react";
  import { FunctionComponent } from "react";
  import content from '../../static.content.json';

  interface HeroSectionProps {}
  
  export const HeroSection: FunctionComponent<HeroSectionProps> = () => {
    return (
      <chakra.header id="hero">
        <Box display={{ base: 'flex', md: 'none' }} p={4}>         
          <Container maxW="container.full" >
            <Center p={4} minHeight="70vh">
              <Stack
                  justify="space-between"
                  p={[0, 4]}
                  w="full"
                  direction={['column', 'row']}
                >
                    <Image
                      src={content.index.content.heroSection.image}
                      width={300}
                      height={200}
                      alt="hero"
                    />
                    <Stack
                      justify="space-between"
                      p={[0, 4]}
                      w="full"
                      direction={['column', 'column']}
                    >
                      <Heading size="2xl" mb={4} color="gray.700">
                        {content.index.content.heroSection.heading1}
                      </Heading>
          
                      <Text fontSize="xl" color="gray.500">
                        {content.index.content.heroSection.heading2}
                      </Text>
          
                      <Button
                        alignSelf="center"
                        width="50%"
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
                    </Stack>
                </Stack>
              </Center>
          </Container>             
        </Box>      

        <Box display={{ base: 'none', md: 'flex' }}>
          <Container maxW="container.2xl">
            <Center p={4} minHeight="70vh">
              <Stack
                  justify="space-between"
                  p={[0, 4]}
                  w="full"
                  direction={['column', 'row']}
                >
                <Container maxW="container.xl" textAlign="center">
                  <Stack
                      justify="space-between"
                      p={[0, 4]}
                      w="full"
                      direction={['column', 'row']}
                    >
                    <Image
                      src={content.index.content.heroSection.image}
                      width={800}
                      height={433}
                      alt="hero"
                    />
                    <Stack
                      justify="space-between"
                      p={[0, 4]}
                      w="full"
                      direction={['row', 'column']}
                    >
                      <Heading size="2xl" mb={4} color="gray.700">
                        {content.index.content.heroSection.heading1}
                      </Heading>
          
                      <Text fontSize="xl" color="gray.500">
                        {content.index.content.heroSection.heading2}
                      </Text>
          
                      <Button
                        alignSelf="center"
                        width="50%"
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
                    </Stack>
                  </Stack>

                </Container>
              </Stack>
            </Center>
          </Container>        
        </Box>
      </chakra.header>
    );
  };