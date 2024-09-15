import { Box, Flex, Button, useColorModeValue, Stack, useColorMode, Image, IconButton, useDisclosure } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { APP_LOGO, APP_NAME, HIDE_NAV, INDEX_PAGE } from "@/configs/constant";
import { FaSun, FaMoon, FaHome, FaCheckCircle, FaBlog, FaBars, FaRocket, FaExpand } from "react-icons/fa";
import NavLink from "./NavLink";
import MobileDrawer from "./MobileDrawer";

function navUrl(page) {
    if (INDEX_PAGE === page || page === 'home') {
        return '/';
    }
    return `/${page}`;
}

export default function Header() {
    const { colorMode, toggleColorMode } = useColorMode();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");

    const links = [
        { id: 'home', icon: <FaHome />, label: "Home" },
        { id: 'uptime', icon: <FaRocket />, label: "Uptime" },
        { id: 'redirect', icon: <FaCheckCircle />, label: "Redirect Check" },
        { id: 'expander', icon: <FaExpand />, label: "URL Expander" },
        { id: 'blog', icon: <FaBlog />, label: "Blog" },
    ];

    // put the item id = INDEX_PAGE to the first item
    const navItems = links.filter((link) => link.id !== INDEX_PAGE).map((link) => ({
        id: link.id,
        href: navUrl(link.id),
        icon: link.icon,
        label: link.label,
    }));

    return (
        <Box bg={bgColor} px={4} boxShadow="sm" position="sticky" top={0} zIndex="sticky" borderBottom={1} borderStyle={'solid'} borderColor={borderColor}>
            <Flex h={16} alignItems={"center"} justifyContent={"space-between"} maxW="container.xl" mx="auto">
                <Logo />
                <Flex alignItems={"center"}>
                    {!HIDE_NAV && <DesktopNav navItems={navItems} />}
                    <ColorModeToggle colorMode={colorMode} toggleColorMode={toggleColorMode} />
                    {!HIDE_NAV && <MobileMenuButton onOpen={onOpen} />}
                </Flex>
            </Flex>
            <MobileDrawer isOpen={isOpen} onClose={onClose} navItems={navItems} />
        </Box>
    );
}

const Logo = () => (
    <Flex alignItems="center">
        <Link href="/">
            <Image src={APP_LOGO} alt={APP_NAME} width={'auto'} height={'53px'} />
        </Link>
    </Flex>
);

const DesktopNav = ({ navItems }) => (
    <Stack direction={"row"} spacing={1} display={{ base: "none", lg: "flex" }}>
        {navItems.map((item) => (
            <NavLink key={item.href} href={item.href} icon={item.icon}>
                {item.label}
            </NavLink>
        ))}
    </Stack>
);

const ColorModeToggle = ({ colorMode, toggleColorMode }) => (
    <Button onClick={toggleColorMode} aria-label="Toggle color mode" ml={4} rounded="full" size="sm">
        {colorMode === "light" ? <FaMoon /> : <FaSun />}
    </Button>
);

const MobileMenuButton = ({ onOpen }) => (
    <IconButton
        display={{ base: "flex", lg: "none" }}
        px={2}
        onClick={onOpen}
        icon={<FaBars />}
        variant="ghost"
        aria-label="Open menu"
        ml={2}
    />
);