import React from 'react';
import {
  Box,
  Heading,
  Link,
  Image,
  Text,
  useColorModeValue,
  Container,
  VStack,
} from '@chakra-ui/react';



const GeneralContent = (props) => {
  return (
    <Container maxW={'7xl'} p="12">
      <Heading textAlign={'center'} as="h1">{props.block?.data?.heading}</Heading>
      {props.block?.data?.twoCloumnImageText?<>
        <Box
          marginTop={{ base: '1', sm: '5' }}
          display="flex"
          flexDirection={{ base: 'column', sm: 'row' }}
          justifyContent="space-between">
          <Box
            display="flex"
            flex="1"
            marginRight="3"
            position="relative"
            alignItems="center">
            <Box
              width={{ base: '100%', sm: '85%' }}
              zIndex="2"
              marginLeft={{ base: '0', sm: '5%' }}
              marginTop="5%">
              <Link textDecoration="none" _hover={{ textDecoration: 'none' }}>
                <Image
                  borderRadius="lg"
                  src={props.block?.data?.twoCloumnImageText?.image?.src}
                  alt={props.block?.data?.twoCloumnImageText?.image?.alt}
                  objectFit="contain"
                />
              </Link>
            </Box>
            <Box zIndex="1" width="100%" position="absolute" height="100%">
              <Box
                bgGradient={useColorModeValue(
                  'radial(orange.600 1px, transparent 1px)',
                  'radial(orange.300 1px, transparent 1px)'
                )}
                backgroundSize="20px 20px"
                opacity="0.4"
                height="100%"
              />
            </Box>
          </Box>
          <Box
            display="flex"
            flex="1"
            flexDirection="column"
            justifyContent="center"
            marginTop={{ base: '3', sm: '0' }}>          
            <Heading marginTop="1">
               {props.block?.data?.twoCloumnImageText?.heading}
            </Heading>
            <Text
              as="p"
              marginTop="2"
              color={useColorModeValue('gray.700', 'gray.200')}
              fontSize="lg">
                {props.block?.data?.twoCloumnImageText?.details}
            </Text>          
          </Box>
        </Box>         
      </>:<></>} 
      <VStack paddingTop="40px" spacing="2" alignItems="flex-start">
        <Heading as="h2">{props.block?.data?.mainContent?.heading}</Heading>
        {props.block?.data?.mainContent?.paraDetails?.map(detail => 
          <Text as="p" fontSize="lg">
            {detail}
          </Text>        
        )}
      </VStack>
    </Container>
  );
};

export default GeneralContent;