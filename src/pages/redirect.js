import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import { PortableText } from "@portabletext/react";
import MainLayout from "@/layouts/MainLayout";
import { AppContainer } from "@/components/common/AppContainer";
import RedirectChecker from "@/components/redirect-check/RedirectChecker";
import { APP_NAME } from "@/configs/constant";
import { FaLink, FaBan, FaSearch, FaExternalLinkAlt } from "react-icons/fa";
import { styles } from "@/configs/checker";
import FAQSection from "@/components/common/FAQSection";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { generateHrefLangsAndCanonicalTag } from "@/utils";
import { fetchAllPagesForFooter, fetchPageBySlug } from "@/services/pageService";

// Map icon names to icon components
const ICON_MAP = {
  FaLink,
  FaBan,
  FaSearch,
  FaExternalLinkAlt,
};

// Helper function to convert widgetConfig array to object
function parseWidgetConfig(config) {
  if (!config) return {};
  if (Array.isArray(config)) {
    return config.reduce((acc, item) => {
      if (item.key && item.value !== undefined) {
        acc[item.key] = item.value;
      }
      return acc;
    }, {});
  }
  // Support old format (plain object)
  return config;
}

export default function RedirectCheckPage({ toolData, pages = [] }) {
    const router = useRouter();
    const { locale, asPath } = router;

    // Use data from CMS if available, otherwise show 404
    if (!toolData) {
        return (
            <MainLayout pages={pages}>
                <Head>
                    <title>{`Page Not Found | ${APP_NAME}`}</title>
                </Head>
                <AppContainer>
                    <Box my={12} textAlign="center">
                        <Heading as="h1" size="2xl" mb={4}>
                            Page not found
                        </Heading>
                        <Text fontSize="xl" color="gray.600">
                            This page content could not be loaded.
                        </Text>
                    </Box>
                </AppContainer>
            </MainLayout>
        );
    }

    const IconComponent = ICON_MAP[toolData.heroIcon] || FaLink;
    const pageTitle = toolData.metaTitle || `${toolData.title} | ${APP_NAME}`;
    const pageDescription = toolData.metaDescription || toolData.heroDescription;
    const faqData = toolData.faqs || [];

    // Parse widgetConfig from array to object
    const config = parseWidgetConfig(toolData.widgetConfig);

    return (
        <MainLayout pages={pages}>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />

                {/* hreflangs and canonical tag */}
                {generateHrefLangsAndCanonicalTag(locale, asPath)}

                {/* FAQ Schema */}
                {faqData.length > 0 && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "FAQPage",
                                "mainEntity": faqData.map(({ question, answer }) => ({
                                    "@type": "Question",
                                    "name": question,
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": answer
                                    }
                                }))
                            })
                        }}
                    />
                )}

                {/* Custom Structured Data if provided */}
                {toolData.customStructuredData && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: toolData.customStructuredData
                        }}
                    />
                )}
            </Head>
            <AppContainer>
                <Box my={12}>
                    {/* Content Before Widget */}
                    {toolData.contentBeforeWidget && toolData.contentBeforeWidget.length > 0 && (
                        <Box mb={8}>
                            <PortableText value={toolData.contentBeforeWidget} />
                        </Box>
                    )}

                    {/* Widget Section */}
                    <RedirectChecker
                        icon={IconComponent}
                        buttonText={config.buttonText || toolData.buttonText}
                        examples={
                          typeof config.examples === 'string'
                            ? config.examples.split(',').map(s => s.trim()).filter(Boolean)
                            : config.examples || toolData.exampleUrls || []
                        }
                    >
                        <Flex direction="column" align="center" textAlign="center">
                            <Box {...styles.checkPage.heroBox}>
                                <Icon as={IconComponent} {...styles.checkPage.heroIcon} />
                            </Box>
                            <Heading as="h1" {...styles.checkPage.heading}>
                                {toolData.heroHeading}
                            </Heading>
                            {toolData.heroDescription && (
                                <Text {...styles.checkPage.description}>
                                    {toolData.heroDescription}
                                </Text>
                            )}
                        </Flex>
                    </RedirectChecker>

                    {/* Content After Widget */}
                    {toolData.contentAfterWidget && toolData.contentAfterWidget.length > 0 && (
                        <Box
                            mt={8}
                            sx={{
                                "& p": {
                                    fontSize: { base: "md", md: "lg" },
                                    lineHeight: "1.8",
                                    color: "gray.700",
                                    mb: 4,
                                },
                                "& h2": {
                                    fontSize: { base: "2xl", md: "3xl" },
                                    fontWeight: "bold",
                                    mt: 8,
                                    mb: 4,
                                    color: "gray.900",
                                },
                                "& h3": {
                                    fontSize: { base: "xl", md: "2xl" },
                                    fontWeight: "bold",
                                    mt: 6,
                                    mb: 3,
                                    color: "gray.900",
                                },
                                "& ul, & ol": {
                                    pl: 6,
                                    mb: 4,
                                },
                                "& li": {
                                    fontSize: { base: "md", md: "lg" },
                                    color: "gray.700",
                                    mb: 2,
                                },
                            }}
                        >
                            <PortableText value={toolData.contentAfterWidget} />
                        </Box>
                    )}

                    {/* FAQ Section */}
                    {faqData.length > 0 && <FAQSection data={faqData} />}
                </Box>
            </AppContainer>
        </MainLayout>
    );
}

export async function getStaticProps({ locale }) {
    // Fetch tool page data from Sanity
    const toolData = await fetchPageBySlug('redirect', locale || 'en');
    const pages = await fetchAllPagesForFooter(locale);

    return {
        props: {
            toolData,
            pages,
            ...(await serverSideTranslations(locale, [ 'common' ])),
        },
        revalidate: 3600, // Revalidate every hour
    };
}