import { HamburgerIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  chakra,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  HStack,
  IconButton,
  Link,
  Spacer,
  Stack,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react'
import Image from 'next/image';
import { useRouter } from 'next/router'
import { GrLogin } from 'react-icons/gr'
import content from '../../static.content.json';

const navLinks = [
  { name: 'Home', link: '/' },
  { name: 'Features', link: '/static/features' },
  // { name: 'Pricing', link: '#pricing' },
]

const DesktopSidebarContents = ({ name }: any) => {
  const router = useRouter();
  return (
    <Container maxW={['full', 'container.lg']} p={0}>
      <Stack
        justify="space-between"
        p={[0, 4]}
        w="full"
        direction={['column', 'row']}
      >
        <Box display={{ base: 'none', md: 'flex' }}>
        <Image src="/boNeeds/logo.png" alt="boNeeds" width="75" height="75" />
        </Box>
        <Spacer />
        <Stack
          align="flex-start"
          spacing={[4, 10]}
          direction={['column', 'row']}
        >
          {navLinks.map((navLink: any, i: number) => {
            return (
              <Link
                href={navLink.link}
                key={`navlink_${i}`}
                fontWeight={500}
                variant="ghost"
              >
                {navLink.name}
              </Link>
            )
          })}
        </Stack>
        <Spacer />
        <Stack direction={["column", "row"]} spacing={[4, 9]}>       
          <Tooltip label='Request Demo' hasArrow arrowSize={15} placement='bottom'  borderRadius="9px" >
            <Link href="/demo">  
                Request Demo
            </Link>
          </Tooltip>
          <Tooltip label='Login' hasArrow arrowSize={15} placement='bottom'  borderRadius="9px">
            <Link href="/login">  
                Log In
            </Link>
          </Tooltip>
          <Button
            size="xs"
            mt={8}
            colorScheme="teal"
            onClick={() => router.push("/register")}
          >
            Start for free
          </Button>          
        </Stack>
        {/* <Button
          mt={8}
          colorScheme="teal"
          onClick={() => {
            window.open(content.index.content.heroSection.cta.url,);
          }}
        >
          {content.index.content.heroSection.cta.label}
        </Button> */}

      </Stack>
    </Container>
  )
}
const MobileSidebar = ({ name }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Flex w="full" align="center">
        <Heading fontSize="xl">{name}</Heading>
        <Spacer />
        <IconButton
          aria-label="Search database"
          icon={<HamburgerIcon />}
          onClick={onOpen}
        />
        <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
          <DrawerOverlay />
          <DrawerContent bg="gray.50">
            <DrawerCloseButton />
            <DrawerHeader>{name}</DrawerHeader>

            <DrawerBody>
              <DesktopSidebarContents />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>
    </>
  )
}

interface SidebarProps {
  name: string
}

const Sidebar = ({ name }: SidebarProps) => {
  return (
    <chakra.header id="header">
      <Box display={{ base: 'flex', md: 'none' }} p={4}>
        <MobileSidebar name={name} />
      </Box>

      <Box display={{ base: 'none', md: 'flex' }} bg="gray.50">
        <DesktopSidebarContents name={name} />
      </Box>
    </chakra.header>
  )
}

interface HeaderProps {
  name: string
}

export const Header = ({ name }: HeaderProps) => {
  return (
    <Box w="full">
      <Sidebar name={name} />
    </Box>
  )
}