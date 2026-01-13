import { Box, Flex, Button, useColorModeValue, Stack, useColorMode, Image, IconButton, useDisclosure } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { APP_LOGO, APP_LOGO_DARK, APP_NAME, LOCALE } from "@/configs/constant";
import { FaSun, FaMoon, FaHome, FaCheckCircle, FaBlog, FaBars, FaRocket, FaExpand } from "react-icons/fa";
import NavLink from "./NavLink";
import MobileDrawer from "./MobileDrawer";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useTranslation } from "next-i18next";

function navUrl(page, locale) {
    if (page === 'home') {
        return locale !== LOCALE ? `/${locale}` : '/';
    }
    return locale !== LOCALE ? `/${locale}/${page}` : `/${page}`;
}

export default function Header() {
    const { t } = useTranslation();
    const { locale } = useRouter();
    const { colorMode, toggleColorMode } = useColorMode();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");

    const navsInUse = useMemo(() => {
        const links = [
            { id: 'home', icon: <FaHome />, label: "Home" },
            { id: 'uptime', icon: <FaRocket />, label: "Uptime" },
            { id: 'expander', icon: <FaExpand />, label: "URL Expander" },
            { id: 'blog', icon: <FaBlog />, label: "Blog" },
        ];
        return links;
    }, []);

    const navItems = navsInUse.map((link) => ({
        id: link.id,
        href: navUrl(link.id, locale),
        icon: link.icon,
        label: t(`tool.${link.id}`, link.label),
    }));

    return (
        <Box bg={bgColor} px={4} boxShadow="sm" position="sticky" top={0} zIndex="sticky" borderBottom={1} borderStyle={'solid'} borderColor={borderColor}>
            <Flex h={16} alignItems={"center"} justifyContent={"space-between"} maxW="container.xl" mx="auto">
                <Logo locale={locale} />
                <Flex alignItems={"center"}>
                    <DesktopNav navItems={navItems} />
                    <ColorModeToggle colorMode={colorMode} toggleColorMode={toggleColorMode} />
                    <MobileMenuButton onOpen={onOpen} />
                </Flex>
            </Flex>
            <MobileDrawer isOpen={isOpen} onClose={onClose} navItems={navItems} />
        </Box>
    );
}

const Logo = ({ locale }) => (
    <Flex alignItems="center">
        <Link href={`/${locale !== 'en' ? locale : ''}`}>
            <Image
                src={useColorModeValue(APP_LOGO, APP_LOGO_DARK)}
                alt={APP_NAME}
                width={'auto'}
                height={{ base: "32px", lg: "40px" }}
            />
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