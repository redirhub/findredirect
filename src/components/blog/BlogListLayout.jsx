import { Box, Heading } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import MainLayout from "@/layouts/MainLayout";
import { generateHrefLangsAndCanonicalTag } from "@/utils";
import { APP_NAME } from "@/configs/constant";

export default function BlogListLayout({
  title,
  description,
  children,
  showTitle = true,
  pageTitle,
}) {
  const router = useRouter();
  const { locale, asPath } = router;

  const fullTitle = pageTitle || `${title} | ${APP_NAME}`;
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ""}${asPath}`;

  return (
    <MainLayout>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content={APP_NAME} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />

        {generateHrefLangsAndCanonicalTag(locale, asPath)}
      </Head>

      <Box
        paddingX={{ base: "16px", "2xl": "64px" }}
        maxW="1400px"
        mx="auto"
        minH="100vh"
      >
        {showTitle && (
          <Heading
            as="h1"
            textAlign="center"
            fontSize={{
              base: "70px",
              sm: "110px",
              md: "150px",
              xl: "180px",
            }}
            fontWeight="900"
            color="#222"
            py={8}
            letterSpacing="-0.02em"
          >
            {title}
          </Heading>
        )}

        {children}
      </Box>
    </MainLayout>
  );
}
