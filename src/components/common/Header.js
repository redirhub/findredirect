import { Box, Flex, Button, useColorModeValue, Stack, useColorMode, Image, IconButton, useDisclosure, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { APP_LOGO, APP_NAME } from "@/configs/constant";
import { FaSun, FaMoon, FaHome, FaCheckCircle, FaBolt, FaBlog, FaBars } from "react-icons/fa";

const NavLink = ({ children, href, icon }) => (
    <Link
        px={3}
        py={2}
        rounded={"full"}
        _hover={{
            textDecoration: "none",
            bg: useColorModeValue("gray.100", "gray.700"),
        }}
        href={href}
        display="flex"
        alignItems="center"
        transition="all 0.3s"
    >
        {icon}
        <Box ml={2}>{children}</Box>
    </Link>
);

export default function Header() {
    const { colorMode, toggleColorMode } = useColorMode();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");

    return (
        <Box bg={bgColor} px={4} boxShadow="sm" position="sticky" top={0} zIndex="sticky" borderBottom={1} borderStyle={'solid'} borderColor={borderColor}>
            <Flex h={16} alignItems={"center"} justifyContent={"space-between"} maxW="container.xl" mx="auto">
                <Flex alignItems="center">
                    <Link href="/">
                        <Image src={APP_LOGO} alt={APP_NAME} width={'auto'} height={'53px'} />
                    </Link>
                </Flex>

                <Flex alignItems={"center"}>
                    <Stack direction={"row"} spacing={1} display={{ base: "none", md: "flex" }}>
                        <NavLink href="/" icon={<FaHome />}>Home</NavLink>
                        <NavLink href="/check" icon={<FaCheckCircle />}>Redirect Check</NavLink>
                        <NavLink href="#" icon={<FaBolt />}>Speed Analysis</NavLink>
                        <NavLink href="#" icon={<FaBlog />}>Blog</NavLink>
                    </Stack>
                    <Button onClick={toggleColorMode} aria-label="Toggle color mode" ml={4} rounded="full" size="sm">
                        {colorMode === "light" ? <FaMoon /> : <FaSun />}
                    </Button>
                    <IconButton
                        display={{ base: "flex", md: "none" }}
                        px={2}
                        onClick={onOpen}
                        icon={<FaBars />}
                        variant="ghost"
                        aria-label="Open menu"
                        ml={2}
                    />
                </Flex>
            </Flex>

            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Menu</DrawerHeader>
                    <DrawerBody>
                        <Stack as="nav" spacing={4}>
                            <NavLink href="/" icon={<FaHome />}>Home</NavLink>
                            <NavLink href="/check" icon={<FaCheckCircle />}>Redirect Check</NavLink>
                            <NavLink href="#" icon={<FaBolt />}>Speed Analysis</NavLink>
                            <NavLink href="#" icon={<FaBlog />}>Blog</NavLink>
                        </Stack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Box>
    );
}