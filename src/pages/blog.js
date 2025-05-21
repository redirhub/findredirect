import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Container, VStack, Heading, Text, useColorModeValue, Icon } from "@chakra-ui/react";
import { FaTools } from "react-icons/fa";
import MainLayout from "@/layouts/MainLayout";
import { generateHrefLangsAndCanonicalTag, getFluidFontSize } from "@/utils";
import { APP_NAME } from "@/configs/constant";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export default function BlogPage() {
    const router = useRouter();
    const { locale, asPath } = router;
    const bgGradient = useColorModeValue(
        "linear(to-r, purple.100, pink.100)",
        "linear(to-r, purple.800, pink.800)"
    );
    const headingColor = useColorModeValue("gray.800", "white");
    const title = `Blog Under Construction | ${APP_NAME}`;

    return (
        <MainLayout>
            <Head>
                <title>{title}</title>
                <meta
                    name="description"
                    content="Our blog is currently under construction. Stay tuned for exciting content coming soon!"
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                {/* hreflangs and canonical tag */}
                {generateHrefLangsAndCanonicalTag(locale, asPath)}
            </Head>
            <Box bgGradient={bgGradient} py={20} minHeight="calc(100vh - 100px)" display="flex" alignItems="center">
                <Container maxW="container.xl">
                    <VStack spacing={8} alignItems="center" textAlign="center">
                        <Icon as={FaTools} w={20} h={20} color={headingColor} />
                        <Heading as="h1" fontSize={getFluidFontSize(36, 48)} fontWeight="800" lineHeight="1.2" color={headingColor}>
                            Blog Under Construction
                        </Heading>
                        <Text fontSize={getFluidFontSize(18, 22)} maxW="800px" color={headingColor}>
                            We&apos;re working hard to bring you an amazing blog experience. Check back soon for insightful articles,
                            industry news, and helpful tips.
                        </Text>
                    </VStack>
                </Container>
            </Box>
        </MainLayout>
    );
}

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    };
}