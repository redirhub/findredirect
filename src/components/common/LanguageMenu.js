import {
    Menu,
    MenuButton,
    Flex,
    Text,
    MenuList,
    MenuItem,
    Box,
    Button,
    useBreakpointValue,
} from '@chakra-ui/react';
import { FaArrowDown, FaCircle, FaLanguage } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { LANGUAGES } from '@/sanity/config/i18n';

export function LanguageMenu() {
    const router = useRouter();
    const { locale } = router;

    const buttonStyles = {
        rounded: "full",
    };

    const textStyles = {
        fontSize: '14px',
        fontWeight: '500',
        lineHeight: '20px',
        as: 'span',
    };

    return (
        <Menu placement="top-end" isLazy>
            <MenuButton as={Button} {...buttonStyles}>
                <Flex alignItems="center">
                    <FaLanguage size={20} color="primary" />
                    <Box ml={2}>
                        Language
                    </Box>
                </Flex>
            </MenuButton>
            <MenuList p={2} minW={'fit-content'} zIndex={999}>
                {LANGUAGES?.map((lang) => (
                    <MenuItem
                        key={lang.id}
                        onClick={() => router.push(router.pathname, router.asPath, { locale: lang.id })}
                        borderRadius={'md'}
                    >
                        <Box {...textStyles}>
                            {lang.flag} {lang.nativeName}
                        </Box>
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
    );
}

