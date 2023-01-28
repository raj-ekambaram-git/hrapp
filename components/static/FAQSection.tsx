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
  
  const faqs: FAQType[] = [
    {
      q: 'How many clients can I bring on?',
      a: 'You can bring on 3 clients with the Free plan. Upgrade to Pro for additional seats.',
    },
    {
      q: 'Can I connect it to my CRM?',
      a: 'Yes! We support Notion and PipeDrive currently.',
    },
    {
      q: 'Do you support international payments?',
      a: 'Yes - payments can be made from and to any country.',
    },
    {
      q: 'Who can I connect to for support?',
      a: 'Email me at sukh@saasbase.dev',
    },
  ]

  interface FAQSectionProps {
    items: FAQType[]
  }

  export const FAQSection: FunctionComponent<FAQSectionProps> = () => {
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