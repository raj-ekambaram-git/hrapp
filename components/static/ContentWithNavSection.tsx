import React, { ReactNode, useState } from 'react';
import {
  IconButton,
  Heading,
  Box,
  Flex,
  HStack,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Container,
} from '@chakra-ui/react';
import {
  FiMenu,
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { ReactText } from 'react';

interface LinkItemProps {
  name: string;
  icon: IconType;
  content: string;
  heading: string;
}


export default function SidebarWithHeader(props) {
  const LinkItems: Array<LinkItemProps> = props.block?.data?.items;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [htmlPart, setHtmlPart] = useState(LinkItems[0].content);
  const [heading, setHeading] = useState(LinkItems[0].heading);
  

  const handleMainContent = (index, onClose) => {
    console.log("index:::"+index)
    LinkItems[index].content?setHtmlPart(LinkItems[index].content):"No content to display"
    LinkItems[index].heading?setHeading(LinkItems[index].heading):"No content to display"

    if(onClose) {
      onClose();
    }
  }
  return (
    <Container maxW={'7xl'} p="1">
      <Box minH="100vh">
        <SidebarContent
          onClose={() => onClose}
          handleMainContent={handleMainContent}
          LinkItems={LinkItems}
          display={{ base: 'none', md: 'block' }}
        />
        <Drawer
          autoFocus={false}
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          returnFocusOnClose={false}
          onOverlayClick={onClose}
          size="full">
          <DrawerContent>
            <SidebarContent onClose={onClose} handleMainContent={handleMainContent} LinkItems={LinkItems}/>
          </DrawerContent>
        </Drawer>
        {/* mobilenav */}
        <MobileNav onOpen={onOpen} heading={heading}/>
        <Box ml={{ base: 0, md: 60 }} p="4">
          <div dangerouslySetInnerHTML={ {__html: htmlPart} } />
        </Box>
      </Box>
    </Container>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;  
  handleMainContent: any;
  LinkItems: any;
}

const SidebarContent = ({ onClose, handleMainContent, LinkItems, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 40 }}
      pos="fixed"
      {...rest}>
      {LinkItems.map((link, index) => (
        <NavItem key={link.name} onClick={() => handleMainContent(index, onClose)} >
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {  
  children: ReactText;
}
const NavItem = ({ children, ...rest }: NavItemProps) => {
  return (
    <Link href="#" style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="2"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'teal.400',
          color: 'white',
        }}
        {...rest}>
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
  heading: string;
}
const MobileNav = ({ onOpen, heading, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"    
      borderBottomWidth="1px"
      justifyContent={{ base: 'space-between', md: 'center' }}
      {...rest}>
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />
      <HStack spacing={{ base: '0', md: '6' }}>
        <Heading alignContent={'center'}>
         {heading}
        </Heading>
      </HStack>      
    </Flex>
  );
};