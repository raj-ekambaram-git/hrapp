import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Container,
    Text,
    VStack,
  } from '@chakra-ui/react'
import { FunctionComponent } from 'react'
  
  export interface FAQType {
    q: string
    a: string
  }
  
  interface FAQSectionProps {
    items: FAQType[]
  }

  export default function FAQSection(props) {

    const faqs: FAQType[] = props.block?.data?.faqs;
    
    return (

        <Container py={28} maxW="container.md">
          <Box w="full">
            <VStack spacing={10} w="full">
              <Text fontWeight={500} fontSize="2xl" align="center">
                Frequently asked questions
              </Text>        
                <Box borderRadius="lg" w="full" p={4}>
                    <Accordion>
                    {faqs.map((item: any, i: number) => {
                        return (
                        <AccordionItem key={`faq_${i}`}>
                            <h2>
                            <AccordionButton>
                                <Box flex="1" textAlign="left">
                                {item.q}
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                            </h2>
            
                            <AccordionPanel pb={4}>{item.a}</AccordionPanel>
                        </AccordionItem>
                        )
                    })}
                    </Accordion>
                </Box>
            </VStack>
        </Box>
    </Container>
    )
  }