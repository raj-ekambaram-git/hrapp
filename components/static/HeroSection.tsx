import {
    Button,
    Center,
    Container,
    Heading,
    Text,
    VStack,
  } from "@chakra-ui/react";
  import { FunctionComponent } from "react";
  import content from '../../static.content.json';

  interface HeroSectionProps {}
  
  export const HeroSection: FunctionComponent<HeroSectionProps> = () => {
    return (
      <Container maxW="container.lg">
        <Center p={4} minHeight="70vh">
          <VStack>
            <Container maxW="container.md" textAlign="center">
              <Heading size="2xl" mb={4} color="gray.700">
                
              </Heading>
  
              <Text fontSize="xl" color="gray.500">
                Freelancers use Biller to accept payments and send invoices to
                clients with a single click
              </Text>
  
              <Button
                mt={8}
                colorScheme="brand"
                onClick={() => {
                  window.open("https://launchman.cc", "_blank");
                }}
              >
                I need this for $10/month →
              </Button>
  
              <Text my={2} fontSize="sm" color="gray.500">
                102+ builders have signed up in the last 30 days
              </Text>
            </Container>
          </VStack>
        </Center>
      </Container>
    );
  };