import { APP_NAME, GITHUB_URL, LINKEDIN_URL, TELEGRAM_URL, X_URL } from "@/configs/constant";
import {
    Box,
    Container,
    Stack,
    SimpleGrid,
    Text,
    Link,
    Heading,
    useColorModeValue,
} from "@chakra-ui/react";
import { FaTwitter, FaGithub, FaLinkedin, FaTelegram } from "react-icons/fa";
import NextLink from "next/link";
import { useTranslation } from "next-i18next";
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

const ListHeader = ({ children }) => {
    return (
        <Heading
            as="h4"
            fontSize={"sm"}
            fontWeight={"700"}
            textTransform={"uppercase"}
            mb={4}
            color={useColorModeValue("gray.800", "gray.200")}
        >
            {children}
        </Heading>
    );
};

const FooterLink = ({ href, children, isExternal = false }) => {
    const linkColor = useColorModeValue("gray.600", "gray.400");
    const hoverColor = useColorModeValue("purple.600", "purple.300");

    if (isExternal) {
        return (
            <Link
                href={href}
                color={linkColor}
                _hover={{ color: hoverColor, textDecoration: "none" }}
                fontSize="sm"
                target="_blank"
                rel="noopener noreferrer"
            >
                {children}
            </Link>
        );
    }

    return (
        <Link
            as={NextLink}
            href={href}
            color={linkColor}
            _hover={{ color: hoverColor, textDecoration: "none" }}
            fontSize="sm"
        >
            {children}
        </Link>
    );
};

export default function FooterWithLinks({ pages = [] }) {
    const { t } = useTranslation();
    const bgColor = useColorModeValue("gray.50", "gray.900");
    const borderColor = useColorModeValue("gray.200", "gray.700");

    // Categorize pages by category field
    const toolPages = pages.filter(page => (page.category || 'tools') === 'tools');
    const companyPages = pages.filter(page => page.category === 'company');
    const resourcePages = pages.filter(page => page.category === 'resources');

    // Further categorize tool pages by slug patterns for better organization
    const mainTools = toolPages.filter(page =>
        ['redirect', 'expander', 'block'].includes(page.slug)
    );

    const redirectTypeTools = toolPages.filter(page =>
        page.slug && page.slug.match(/^(301|302|303|307|308)-redirect-checker$/)
    ).sort((a, b) => a.slug.localeCompare(b.slug));

    const useCaseTools = toolPages.filter(page =>
        page.slug && (
            page.slug.includes('migration') ||
            page.slug.includes('domain-change') ||
            page.slug.includes('monitoring')
        )
    );

    const platformTools = toolPages.filter(page =>
        page.slug && (
            page.slug.includes('wordpress') ||
            page.slug.includes('shopify') ||
            page.slug.includes('wix')
        )
    );

    return (
        <Box bg={bgColor} color={useColorModeValue("gray.700", "gray.200")}>
            <Container as={Stack} maxW={"6xl"} py={10}>
                <SimpleGrid columns={{ base: 1, sm: 2, md: 5 }} spacing={8}>
                    {/* Main Tools */}
                    <Stack align={"flex-start"}>
                        <ListHeader>{t('footer.tools', 'Tools')}</ListHeader>
                        <FooterLink href="/redirect">
                            {t('footer.redirect-checker', 'Redirect Checker')}
                        </FooterLink>
                        <FooterLink href="/expander">
                            {t('footer.url-expander', 'URL Expander')}
                        </FooterLink>
                        <FooterLink href="/block">
                            {t('footer.block-checker', 'Block Checker')}
                        </FooterLink>
                    </Stack>

                    {/* Redirect Types */}
                    {redirectTypeTools.length > 0 && (
                        <Stack align={"flex-start"}>
                            <ListHeader>{t('footer.redirect-types', 'By Redirect Type')}</ListHeader>
                            {redirectTypeTools.map((tool) => (
                                <FooterLink key={tool.slug} href={`/${tool.slug}`}>
                                    {tool.title.replace(' Checker', '')}
                                </FooterLink>
                            ))}
                        </Stack>
                    )}

                    {/* Use Cases */}
                    {(useCaseTools.length > 0 || platformTools.length > 0) && (
                        <Stack align={"flex-start"}>
                            <ListHeader>{t('footer.use-cases', 'By Use Case')}</ListHeader>
                            {useCaseTools.map((tool) => (
                                <FooterLink key={tool.slug} href={`/${tool.slug}`}>
                                    {tool.title.replace(' Redirect Checker', '').replace(' Checker', '')}
                                </FooterLink>
                            ))}
                        </Stack>
                    )}

                    {/* Platforms */}
                    {platformTools.length > 0 && (
                        <Stack align={"flex-start"}>
                            <ListHeader>{t('footer.platforms', 'By Platform')}</ListHeader>
                            {platformTools.map((tool) => (
                                <FooterLink key={tool.slug} href={`/${tool.slug}`}>
                                    {tool.title.replace(' Redirect Checker', '')}
                                </FooterLink>
                            ))}
                        </Stack>
                    )}

                    {/* Company - Read from CMS if available, otherwise fallback to hardcoded */}
                    <Stack align={"flex-start"}>
                        <ListHeader>{t('footer.company', 'Company')}</ListHeader>
                        {companyPages.length > 0 ? (
                            companyPages.map((page) => (
                                <FooterLink key={page.slug} href={`/${page.slug}`} isExternal={false}>
                                    {page.title}
                                </FooterLink>
                            ))
                        ) : (
                            <>
                                <FooterLink href="/blog">
                                    {t('footer.blog', 'Blog')}
                                </FooterLink>
                                <FooterLink href="/about" isExternal={false}>
                                    {t('footer.about', 'About')}
                                </FooterLink>
                                <FooterLink href="/contact" isExternal={false}>
                                    {t('footer.contact', 'Contact')}
                                </FooterLink>
                                <FooterLink href="/privacy" isExternal={false}>
                                    {t('footer.privacy', 'Privacy Policy')}
                                </FooterLink>
                                <FooterLink href="/terms" isExternal={false}>
                                    {t('footer.terms', 'Terms of Service')}
                                </FooterLink>
                            </>
                        )}
                    </Stack>
                </SimpleGrid>
            </Container>

            {/* Bottom Bar */}
            <Box borderTopWidth={1} borderColor={borderColor}>
                <Container
                    as={Stack}
                    maxW={"6xl"}
                    py={6}
                    direction={{ base: "column", md: "row" }}
                    spacing={{ base: 4, md: 4 }}
                    justify={{ base: "center", md: "space-between" }}
                    align={{ base: "center", md: "center" }}
                >
                    <Text fontSize="sm" textAlign={{ base: "center", md: "left" }}>
                        © {new Date().getFullYear()} {APP_NAME}. {t('footer.rights', 'All rights reserved')}
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
        </Box>
    );
}
