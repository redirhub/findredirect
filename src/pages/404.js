import Head from "next/head";
import { Box, Heading, Text, Button, VStack, useColorModeValue } from "@chakra-ui/react";
import { useRouter } from "next/router";
import MainLayout from "@/layouts/MainLayout";
import { AppContainer } from "@/components/common/AppContainer";
import { APP_NAME } from "@/configs/constant";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Custom404() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const bgGradient = useColorModeValue(
    "linear(to-br, purple.50, blue.50)",
    "linear(to-br, gray.900, gray.800)"
  );
  const textColor = useColorModeValue("gray.600", "gray.400");

  return (
    <MainLayout pages={[]}>
      <Head>
        <title>{`404 - Page Not Found | ${APP_NAME}`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <AppContainer>
        <Box
          my={20}
          textAlign="center"
          py={16}
          px={6}
          borderRadius="xl"
          bgGradient={bgGradient}
        >
          <VStack spacing={6}>
            <Heading
              as="h1"
              fontSize={{ base: "6xl", md: "8xl" }}
              fontWeight="bold"
              bgGradient="linear(to-r, purple.400, blue.500)"
              bgClip="text"
            >
              404
            </Heading>

            <Heading
              as="h2"
              size="xl"
              color={useColorModeValue("gray.800", "gray.100")}
            >
              {t('error.page-not-found', 'Page Not Found')}
            </Heading>

            <Text fontSize="lg" color={textColor} maxW="md">
              {t('error.page-not-found-description', "The page you're looking for doesn't exist or has been moved.")}
            </Text>

            <Button
              colorScheme="purple"
              size="lg"
              mt={4}
              onClick={() => router.push('/')}
            >
              {t('error.back-to-home', 'Back to Home')}
            </Button>
          </VStack>
        </Box>
      </AppContainer>
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
