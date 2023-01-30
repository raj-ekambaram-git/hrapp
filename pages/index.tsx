import { Box, Center, Container, Flex, Heading, Stack, VStack } from '@chakra-ui/react';
import Head from 'next/head';
import { FAQSection } from '../components/static/FAQSection';
import { Feature } from '../components/static/Features';
import { FooterSection } from '../components/static/FooterSection';
import { HeroSection } from '../components/static/HeroSection';
import { HighlightsSection } from '../components/static/HighlightsSection';
import { Layout } from '../components/static/Layout';
import { PricingSection } from '../components/static/PricingSection';
import { SocialMediaSection } from '../components/static/SocialMediaSection';
import content from '../static.content.json';


export default function Index() {

  interface FeatureType {
    title: string
    description: string
    image: string
  }
  
  const features: FeatureType[] = [
    {
      title: "Detailed Analytics",
      description:
        "No more spending hours writing formulas in Excel to figure out how much you're making. We surface important metrics to keep your business going strong.",
      image:
        "https://launchman-space.nyc3.digitaloceanspaces.com/chakra-ui-landing-page-feature-1.png",
    },
    {
      title: "Track your clients",
      description:
        "Know when and how your projects are going so you can stay on top of delivery dates.",
      image:
        "https://launchman-space.nyc3.digitaloceanspaces.com/chakra-ui-landing-page-feature-2.png",
    },
    {
      title: "Manage projects",
      description:
        "You don't have to hunt your email inbox to find that one conversation. Every task, project, and client information is just a click away.",
      image:
        "https://launchman-space.nyc3.digitaloceanspaces.com/chakra-ui-landing-page-feature-3.png",
    },
  ];

  return (
      <>
        <Head>
          <title>{content.title}</title>
        </Head>
        <Layout>
          <Box bg="gray.50" width="1900">
            <HeroSection />
          </Box>
          <Container maxW="container.xl">
            <Center p={[0, 10]}>
              <video playsInline autoPlay muted poster="/image.png" loop>
                <source src="/video.mp4" type="video/mp4" />
              </video>
            </Center>
		      </Container>    
          <SocialMediaSection/>    
          <VStack
              backgroundColor="white"
              w="full"
              id="features"
              spacing={16}
              py={[16, 0]}
            >
              {features.map(
                ({ title, description, image }: FeatureType, i: number) => {
                  return (
                    <Feature
                      key={`feature_${i}`}
                      title={title}
                      description={description}
                      image={image}
                      reverse={i % 2 === 1}
                    />
                  )
                }
              )}
            </VStack>    
            <HighlightsSection/>
            <PricingSection />
            {/* <FAQSection> */}
            <FooterSection/>
        </Layout>
      </>
  );
}