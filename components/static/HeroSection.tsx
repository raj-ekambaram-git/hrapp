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
      <Container maxW="container.2xl">
        <Center p={4} minHeight="70vh">
          <VStack>
            <Container maxW="container.2xl" textAlign="center">

            </Container>
          </VStack>
        </Center>
      </Container>
    );
  };