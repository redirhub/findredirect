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
import { LANGUAGES } from '@/configs/languages';
import { useRouter } from 'next/router';

export function LanguageMenu() {
    const router = useRouter();
    const { locale } = router;

    const responsiveDisplay = useBreakpointValue({
        base: 'none',
        md: 'inline-flex',
    });

    const buttonStyles = {
        colorScheme: "white",
        px: 3,
        py: 2,
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
                        key={lang.value}
                        onClick={() => router.push(router.pathname, router.asPath, { locale: lang.value })}
                        borderRadius={'full'}
                    >
                        <FaCircle mr={5} size='8' colorScheme='primary' />
                        <Box {...textStyles}>
                            {lang.text}
                        </Box>
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
    );
}

