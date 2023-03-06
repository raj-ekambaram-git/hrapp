import { Box, Center, Container, Flex, Heading, Stack, VStack } from '@chakra-ui/react';
import Head from 'next/head';
import FAQSection from '../components/static/FAQSection';
import { Feature } from '../components/static/Features';
import { FooterSection } from '../components/static/FooterSection';
import { HeroSection } from '../components/static/HeroSection';
import Carousel from '../components/static/Carousel';
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
  
  const features: FeatureType[] = content.index.content.featuresSection;

  return (
      <>
        <Head>
          <title>{content.title}</title>
        </Head>
        <Layout>
          {content.index.content.carouselSection?<>
            <VStack
                backgroundColor="white"
                w="full"
                id="hero"
                spacing={16}
                py={[16, 20]}
              >
              <Carousel block={content.index.content.carouselSection}/>
            </VStack>               
          </>:<></>}     
          {content.index.content.heroSection?<>
            <VStack
                backgroundColor="white"
                w="full"
                id="hero"
                spacing={16}
                py={[16, 0]}
              >
              <HeroSection heroSection={content.index.content.heroSection}/>
            </VStack>

          </>:<></>}
          
          {/* <Container maxW="container.xl">
            <Center p={[0, 10]}>
              <video playsInline autoPlay muted poster="/image.png" loop>
                <source src="/video.mp4" type="video/mp4" />
              </video>
            </Center>
		      </Container>     */}
          {/* <SocialMediaSection/>     */}
          <VStack
              backgroundColor="white"
              w="full"
              id="features"
              spacing={[16, 16]}
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
            {/* <VStack
              backgroundColor="white"
              w="full"
              id="highlight"
              spacing={16}
              py={[16, 0]}
            >
              <HighlightsSection/>
            </VStack>             */}
            
            {/* <PricingSection /> */}
            {/* <FAQSection> */}
            <VStack
              bg="gray.50"
              w="full"
              id="footer"
              spacing={16}
              py={[16, 0]}
            >
              <FooterSection/>
            </VStack>               
            
        </Layout>
      </>
  );
}