import { APP_NAME, GITHUB_URL, LINKEDIN_URL, TELEGRAM_URL, X_URL } from "@/configs/constant";
import { Box, Container, Stack, Text, Link, useColorModeValue } from "@chakra-ui/react";
import { FaTwitter, FaGithub, FaLinkedin, FaTelegram } from "react-icons/fa";
import { LanguageMenu } from "./LanguageMenu";

const SocialButton = ({ children, label, href }) => {
    return (
        <Link
            bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
            rounded={"full"}
            w={8}
            h={8}
            cursor={"pointer"}
            as={"a"}
            href={href}
            display={"inline-flex"}
            alignItems={"center"}
            justifyContent={"center"}
            transition={"background 0.3s ease"}
            _hover={{
                bg: useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
            }}
            target="_blank"
            rel="noopener noreferrer"
        >
            {children}
        </Link>
    );
};

export default function Footer() {
    return (
        <Box
            bg={useColorModeValue("gray.50", "gray.900")}
            color={useColorModeValue("gray.700", "gray.200")}
        >
            <Container
                as={Stack}
                maxW={"6xl"}
                mt={8}
                py={6}
                direction={{ base: "column", md: "row" }}
                spacing={{ base: 6, md: 4 }}
                justify={{ base: "center", md: "space-between" }}
                align={{ base: "center", md: "center" }}
            >
                <Text textAlign={{ base: "center", md: "left" }}>
                    © {new Date().getFullYear()} {APP_NAME}. All rights reserved
                </Text>
                <LanguageMenu />
                <Stack direction={"row"} spacing={{ base: 4, md: 6 }}>
                    {X_URL && (
                        <SocialButton label={"Twitter"} href={X_URL}>
                            <FaTwitter />
                        </SocialButton>
                    )}
                    {GITHUB_URL && (
                        <SocialButton label={"GitHub"} href={GITHUB_URL}>
                            <FaGithub />
                        </SocialButton>
                    )}
                    {LINKEDIN_URL && (
                        <SocialButton label={"LinkedIn"} href={LINKEDIN_URL}>
                            <FaLinkedin />
                        </SocialButton>
                    )}
                    {TELEGRAM_URL && (
                        <SocialButton label={"Telegram"} href={TELEGRAM_URL}>
                            <FaTelegram />
                        </SocialButton>
                    )}
                </Stack>
            </Container>
        </Box>
    );
}