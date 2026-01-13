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
import { allLanguages } from '@/sanity/config/i18n';

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
                {allLanguages()?.map((lang) => (
                    <MenuItem
                        key={lang.value}
                        onClick={() => router.push(router.pathname, router.asPath, { locale: lang.value })}
                        borderRadius={'md'}
                    >
                        <Box {...textStyles}>
                            {lang.text}
                        </Box>
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
    );
}

