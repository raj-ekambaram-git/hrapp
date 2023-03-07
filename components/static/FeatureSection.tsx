import {
    Container,
    SimpleGrid,
    Image,
    Flex,
    Heading,
    Text,
    Stack,
    StackDivider,
    Icon,
    useColorModeValue,
  } from '@chakra-ui/react';
  import {
    IoAnalyticsSharp,
    IoLogoBitcoin,
    IoSearchSharp,
  } from 'react-icons/io5';
  import { ReactElement } from 'react';
  
  interface FeatureProps {
    text: string;
    iconBg: string;
    icon?: ReactElement;
  }
  
  const Feature = ({ text, icon, iconBg }: FeatureProps) => {
    return (
      <Stack direction={'row'} align={'center'}>
        <Flex
          w={8}
          h={8}
          align={'center'}
          justify={'center'}
          rounded={'full'}
          bg={iconBg}>
          {icon}
        </Flex>
        <Text fontWeight={600}>{text}</Text>
      </Stack>
    );
  };
  
  export default function SplitWithImage(props) {
    return (
      <Container maxW={'5xl'} py={12}>
        <SimpleGrid columns={{ base: 1, md: 2 }}>
          <Stack spacing={2}>
            <Text
              textTransform={'uppercase'}
              color={'blue.400'}
              fontWeight={600}
              fontSize={'sm'}
              bg={useColorModeValue('blue.50', 'blue.900')}
              p={1}
              alignSelf={'flex-start'}
              rounded={'md'}>
              {props.block?.data?.tag1}
            </Text>
            <Heading>{props.block?.data?.heading1}</Heading>
            <Text color={'gray.500'} fontSize={'lg'}>
              {props.block?.data?.details1}              
            </Text>
            <Stack
              spacing={4}
              divider={
                <StackDivider
                  borderColor={useColorModeValue('gray.100', 'gray.700')}
                />
              }>
              {props.block?.data?.features?.map(feature => 
                  <Feature icon={
                    <Icon as={feature.icon} color={feature.iconColor} w={5} h={5} />
                  }
                  iconBg={useColorModeValue(feature.iconBg_1, feature.iconBg_2)}
                  text={feature.text}
                />
              )}
            </Stack>
          </Stack>
          <Flex maxH={props.block?.data?.image1.maxH?props.block?.data?.image1.maxH:""} width={props.block?.data?.image1.width?props.block?.data?.image1.width:""}>
            <Image
              rounded={'md'}
              alt={props.block?.data?.image1.alt}
              src={props.block?.data?.image1.source}
              objectFit={'cover'}
            />
          </Flex>
        </SimpleGrid>
      </Container>
    );
  }