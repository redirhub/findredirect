import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Container, VStack, Heading, Text, useColorModeValue } from "@chakra-ui/react";
import MainLayout from "@/layouts/MainLayout";
import { AppContainer } from "@/components/common/AppContainer";
import { getFluidFontSize, generateHrefLangsAndCanonicalTag } from "@/utils";
import Uptime from "@/components/uptime/Uptime";
import { APP_NAME } from "@/configs/constant";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { fetchAllPagesForFooter } from "@/services/pageService";

export default function UptimePage({ pages = [] }) {
    const { t } = useTranslation();
    const router = useRouter();
    const { locale, asPath } = router;
    const bgGradient = useColorModeValue(
        "linear(to-r, blue.100, green.100)",
        "linear(to-r, blue.800, green.800)"
    );
    const headingColor = useColorModeValue("gray.800", "white");
    const title = `${t('tool.uptime-title')} | ${APP_NAME}`;

    return (
        <MainLayout pages={pages}>
            <Head>
                <title>{title}</title>
                <meta
                    name="description"
                    content={t('tool.uptime-description', 'Find the fastest redirect services from RedirHub, Redirect.pizza, and EasyRedir with our comprehensive speed comparison tool. Check uptime, response times, and performance details in real-time.')}
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta property="og:image" content="/preview.png" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:alt" content={t('tool.uptime-image-alt', 'Redirect Services Performance Comparison')} />
                {/* hreflangs and canonical tag */}
                {generateHrefLangsAndCanonicalTag(locale, asPath)}
            </Head>
            <Box bgGradient={bgGradient} py={20}>
                <Container maxW="container.xl">
                    <VStack spacing={8} alignItems="center" textAlign="center">
                        <Heading as="h1" fontSize={getFluidFontSize(36, 48)} fontWeight="800" lineHeight="1.2">
                            {t('tool.uptime-heading', 'Redirect Services Performance Comparison')}
                        </Heading>
                        <Text fontSize={getFluidFontSize(18, 22)} maxW="800px">
                            {t('tool.uptime-subheading', 'Discover which redirect service delivers the fastest response times and highest uptime with our real-time comparison tool. Make data-driven decisions for your website\'s performance.')}
                        </Text>
                    </VStack>
                </Container>
            </Box>
            <AppContainer>
                <Uptime />
            </AppContainer>
        </MainLayout>
    );
}

export async function getStaticProps({ locale }) {
    const pages = await fetchAllPagesForFooter(locale);

    return {
        props: {
            pages,
            ...(await serverSideTranslations(locale, ['common'])),
        },
        revalidate: 3600, // Revalidate every hour to pick up new pages
    };
}