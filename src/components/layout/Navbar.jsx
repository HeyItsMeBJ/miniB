import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  useColorModeValue,
  Stack,
  useColorMode,
  Container,
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  Tooltip,
  Image,
  background,
} from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import { RiLogoutCircleLine } from "react-icons/ri";
import {
  HamburgerIcon,
  CloseIcon,
  AddIcon,
  MoonIcon,
  SunIcon,
} from "@chakra-ui/icons";

import { NavLink, Link as routerLink } from "react-router-dom";
import Newpost from "../posts/NewPost";
import logo from "../../assets/logo.png";

import { useUserContext } from "../../context/UserContext";

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logout, isLoading } = useUserContext();

  const {
    isOpen: isMenuOpen,
    onOpen: onMenuOpen,
    onClose: onMenuClose,
  } = useDisclosure();
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const Links = [
    { id: 1, path: '/', name: "Home" },
    { id: 2, path: '/login', name: "Sign in" },
    { id: 3, path: '/register', name: "Create an account" },
  ];
  return (
    <Container maxW="1300px">
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isMenuOpen ? onMenuClose : onMenuOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Box as="b" fontSize="2xl">
              <Link
                as={routerLink}
                to={'/'}
                _hover={{
                  textDecoration: "none",
                }}
              >
                <Image src={logo} width="50px" height={"50px"} />
              </Link>
            </Box>

            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {!user ? (
                Links.map((link) => (
                  <Link
                    px={2}
                    py={1}
                    as={routerLink}
                    to={link.path}
                    rounded={"md"}
                    _hover={{
                      textDecoration: "none",
                      bg: useColorModeValue("gray.200", "gray.700"),
                    }}
                    key={link.id}
                  >
                    {link.name}
                  </Link>
                ))
              ) : (
                <NavLink
                  to={"/user-posts"}
                  style={({ isActive }) => ({
                    background: !isActive ? "#81e6d9" : "#aee0d1",
                    width:'fit-content',
                    borderRadius: "5px",
                    color: "#1a202c",
                    fontSize: "0.875rem",
                    textAlign: "center",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  })}
                >
                  <Button
                    padding="5px"
                    paddingLeft="20px"
                    paddingRight="20px"
                    width="100%"
                    height="100%"
                    backgroundColor={"inherit"}
                    _hover={{ backgroundColor: "#5cb8ab" }}
                  >
                    My Posts
                  </Button>
                </NavLink>
              )}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <Button mr={4} onClick={toggleColorMode}>
              {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            </Button>
            {user ? (
              <Link
                as={NavLink}
                to={"/posts/create-post"}
                _hover={{
                  textDecoration: "none",
                }}
              >
                <Button
                  variant={"solid"}
                  colorScheme={"teal"}
                  size={"sm"}
                  mr={4}
                  // onClick={onModalOpen}
                  leftIcon={<AddIcon />}
                >
                  Create Post
                </Button>
              </Link>
            ) : (
              <Tooltip label="Activate me, captain! Login required">
                <Button
                  variant={"solid"}
                  colorScheme={"teal"}
                  isDisabled={true}
                  size={"sm"}
                  mr={4}
                  onClick={onModalOpen}
                  leftIcon={<AddIcon />}
                >
                  Action
                </Button>
              </Tooltip>
            )}
            {/* Modal */}
            <Modal
              closeOnOverlayClick={false}
              isOpen={isModalOpen}
              onClose={onModalClose}
              size={"xl"}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalCloseButton />
                {/* <ModalBody pb={12}>
                  <Newpost onModalClose={onModalClose} />
                </ModalBody> */}
              </ModalContent>
            </Modal>
            {/* Modal end */}
            {user && (
              <Button
                ml="auto"
                colorScheme="teal"
                size="sm"
                onClick={logout}
                isLoading={isLoading}
              >
                <Icon as={RiLogoutCircleLine} />
              </Button>
            )}
          </Flex>
        </Flex>

        {isMenuOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {!user ? (
                Links.map((link) => (
                  <Link
                    px={2}
                    py={1}
                    as={routerLink}
                    to={link.path}
                    rounded={"md"}
                    _hover={{
                      textDecoration: "none",
                      bg: useColorModeValue("gray.200", "gray.700"),
                    }}
                    key={link.id}
                  >
                    {link.name}
                  </Link>
                ))
              ) : (
                <Link
                  px={2}
                  py={1}
                  rounded={"md"}
                  _hover={{
                    textDecoration: "none",
                  }}
                >
                  Glad you're here!😍
                </Link>
              )}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </Container>
  );
}
