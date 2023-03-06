import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    Icon,
    Stack,
    Text,
    useColorModeValue,
  } from '@chakra-ui/react';
  import { ReactElement } from 'react';
  import {
    FcDonate,
  } from 'react-icons/fc';
  import * as Icons from 'react-icons/fc';

  interface DescriptionsArray extends Array<string>{}

  interface CardProps {
    heading: string;
    descriptions: DescriptionsArray;
    icon: string;
    href: string;
    buttonLabel: string;
    buttonLink: string;
  }
  
  const Card = ({ heading, descriptions, icon, href, buttonLabel, buttonLink }: CardProps) => {
    
    return (
      <Box
        maxW={{ base: 'full', md: '275px' }}
        w={'full'}
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        p={5}>
        <Stack align={'start'} spacing={2}>
          <Flex
            w={16}
            h={16}
            align={'center'}
            justify={'center'}
            color={'white'}
            rounded={'full'}
            bg={useColorModeValue('gray.100', 'gray.700')}>
            <Icon as={Icons[icon]} w={10} h={10} />
          </Flex>
          <Box mt={2}>
            <Heading size="md">{heading}</Heading>
            {descriptions.map(description => 
                <Text mt={1} fontSize={'sm'} padding={1}>
                    {description}
                </Text>
            )}
          </Box>
          <Button variant={'link'} colorScheme={'blue'} size={'sm'}>
            {buttonLabel}
          </Button>
        </Stack>
      </Box>
    );
  };
  
  export default function gridListWith(props) {    
    return (
      <Box p={4}>
        <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
          <Heading fontSize={{ base: '2xl', sm: '4xl' }} fontWeight={'bold'}>
          {props.block?.data?.heading}
          </Heading>
          <Text color={'gray.600'} fontSize={{ base: 'sm', sm: 'lg' }}>
            {props.block?.data?.detail}
          </Text>
        </Stack>
  
        <Container maxW={'5xl'} mt={12}>
          <Flex flexWrap="wrap" gridGap={6} justify="center">
            {props.block?.data?.featureCards?.map(featureCard => 
                <Card
                    heading={featureCard.heading}
                    icon={featureCard.icon}
                    descriptions={featureCard.descriptions}
                    href={featureCard.link}
                    buttonLabel={featureCard.buttonLabel}
                    buttonLink={featureCard.buttonLink}
                />            
            )}
          </Flex>
        </Container>
      </Box>
    );
  }