import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Flex, Heading, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { PortableText } from "@portabletext/react";
import MainLayout from "@/layouts/MainLayout";
import { AppContainer } from "@/components/common/AppContainer";
import RedirectChecker from "@/components/redirect-check/RedirectChecker";
import BlockChecker from "@/components/block-check/BlockChecker";
import UptimeWidget from "@/components/uptime/UptimeWidget";
import { toolPageComponents } from "@/components/common/PortableTextComponents";
import { APP_NAME } from "@/configs/constant";
import { FaLink, FaBan, FaSearch, FaExternalLinkAlt, FaServer, FaShieldAlt, FaNetworkWired, FaClock, FaCheckCircle, FaCloud } from "react-icons/fa";
import { styles } from "@/configs/checker";
import FAQSection from "@/components/common/FAQSection";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { generateHrefLangsAndCanonicalTag } from "@/utils";
import { fetchAllPagesForFooter, fetchPageBySlug, fetchAllPageSlugs } from "@/services/pageService";
import { allLanguages } from "@/config/i18n";

// Map widget types to components
const WIDGET_COMPONENTS = {
  redirect: RedirectChecker,
  block: BlockChecker,
  uptime: UptimeWidget,
};

// Map icon names to icon components
const ICON_MAP = {
  FaLink,
  FaBan,
  FaSearch,
  FaExternalLinkAlt,
  FaServer,
  FaShieldAlt,
  FaNetworkWired,
  FaClock,
  FaCheckCircle,
  FaCloud,
};

// Helper function to convert widgetConfig array to object
function parseWidgetConfig(config) {
  if (!config) return {};
  if (Array.isArray(config)) {
    return config.reduce((acc, item) => {
      if (item.key && item.value !== undefined) {
        acc[ item.key ] = item.value;
      }
      return acc;
    }, {});
  }
  // Support old format (plain object)
  return config;
}

export default function ToolPage({ toolData, pages = [] }) {
  const router = useRouter();
  const { locale, asPath } = router;

  // Content styles for rich text with dark mode support
  const contentStyles = {
    "& p": {
      fontSize: { base: "md", md: "lg" },
      lineHeight: "1.8",
      color: useColorModeValue("gray.700", "gray.300"),
      mb: 4,
    },
    "& h1": {
      fontSize: { base: "3xl", md: "4xl" },
      fontWeight: "bold",
      mt: 10,
      mb: 6,
      color: useColorModeValue("gray.900", "gray.100"),
    },
    "& h2": {
      fontSize: { base: "2xl", md: "3xl" },
      fontWeight: "bold",
      mt: 8,
      mb: 4,
      color: useColorModeValue("gray.900", "gray.100"),
    },
    "& h3": {
      fontSize: { base: "xl", md: "2xl" },
      fontWeight: "bold",
      mt: 6,
      mb: 3,
      color: useColorModeValue("gray.900", "gray.100"),
    },
    "& ul, & ol": {
      pl: 6,
      mb: 4,
    },
    "& li": {
      fontSize: { base: "md", md: "lg" },
      color: useColorModeValue("gray.700", "gray.300"),
      mb: 2,
    },
    "& a": {
      color: useColorModeValue("#7D65DB", "#9F7FFF"),
      textDecoration: "underline",
      _hover: {
        color: useColorModeValue("#6550C0", "#B99FFF"),
      },
    },
  };

  if (!toolData) {
    return (
      <MainLayout pages={pages}>
        <Head>
          <title>{`Tool Not Found | ${APP_NAME}`}</title>
        </Head>
        <AppContainer>
          <Box my={12} textAlign="center">
            <Heading as="h1" size="2xl" mb={4}>
              Tool not found
            </Heading>
            <Text fontSize="xl" color="gray.600">
              The tool you&apos;re looking for doesn&apos;t exist.
            </Text>
          </Box>
        </AppContainer>
      </MainLayout>
    );
  }

  const hasWidget = toolData.widget && toolData.widget !== 'none';
  const WidgetComponent = hasWidget ? WIDGET_COMPONENTS[ toolData.widget ] : null;
  const IconComponent = ICON_MAP[ toolData.heroIcon ] || FaLink;

  const pageTitle = toolData.metaTitle || `${toolData.title} | ${APP_NAME}`;
  const pageDescription = toolData.metaDescription || toolData.heroDescription;

  // Parse widgetConfig from array to object
  const config = parseWidgetConfig(toolData.widgetConfig);

  // Prepare FAQ data for schema
  const faqData = toolData.faqs || [];


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
          {/* For pages with widgets (tool pages) */}
          {hasWidget && (
            <>
              {/* Content Before Widget */}
              {toolData.contentBeforeWidget && toolData.contentBeforeWidget.length > 0 && (
                <Box mb={8} sx={contentStyles}>
                  <PortableText value={toolData.contentBeforeWidget} components={toolPageComponents} />
                </Box>
              )}

              {/* Widget Section */}
              <WidgetComponent
                {...config}
                icon={IconComponent}
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
              </WidgetComponent>

              {/* Content After Widget */}
              {toolData.contentAfterWidget && toolData.contentAfterWidget.length > 0 && (
                <Box mt={8} sx={contentStyles}>
                  <PortableText value={toolData.contentAfterWidget} components={toolPageComponents} />
                </Box>
              )}
            </>
          )}

          {/* For pages without widgets (content pages) */}
          {!hasWidget && (
            <>
              {/* Page Title */}
              <Heading as="h1" size="2xl" mb={6} textAlign="center">
                {toolData.title}
              </Heading>

              {/* Main Content */}
              {toolData.contentBeforeWidget && toolData.contentBeforeWidget.length > 0 && (
                <Box maxW="800px" mx="auto" sx={contentStyles}>
                  <PortableText value={toolData.contentBeforeWidget} components={toolPageComponents} />
                </Box>
              )}

              {/* Additional Content */}
              {toolData.contentAfterWidget && toolData.contentAfterWidget.length > 0 && (
                <Box maxW="800px" mx="auto" mt={8} sx={contentStyles}>
                  <PortableText value={toolData.contentAfterWidget} components={toolPageComponents} />
                </Box>
              )}
            </>
          )}

          {/* FAQ Section (for both types) */}
          {faqData.length > 0 && <FAQSection data={faqData} />}
        </Box>
      </AppContainer>
    </MainLayout>
  );
}

export async function getStaticPaths() {
  const tools = await fetchAllPageSlugs();

  // Get unique slugs (since we'll generate paths for all locales)
  // Exclude 'redirect' and 'home' since they have their own dedicated page files
  const uniqueSlugs = [ ...new Set(tools.map(t => t.slug)) ].filter(slug => slug !== 'home');

  // Generate paths for each slug in all locales
  const paths = uniqueSlugs.flatMap((slug) =>
    allLanguages.map((locale) => ({
      params: { tool: slug },
      locale,
    }))
  );

  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps({ params, locale }) {
  const slug = params.tool;

  if (!slug) {
    return {
      notFound: true,
    };
  }

  const toolData = await fetchPageBySlug(slug, locale || 'en');

  if (!toolData) {
    return {
      notFound: true,
    };
  }

  // Fetch all pages for footer links (categorized)
  const pages = await fetchAllPagesForFooter(locale || 'en');

  return {
    props: {
      toolData,
      pages,
      ...(await serverSideTranslations(locale, [ "common" ])),
    },
    revalidate: 3600, // Revalidate every hour
  };
}
