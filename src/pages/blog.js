import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Heading, SimpleGrid } from "@chakra-ui/react";
import MainLayout from "@/layouts/MainLayout";
import {
  articles,
  generateHrefLangsAndCanonicalTag,
  otherArticles,
} from "@/utils";
import { APP_NAME } from "@/configs/constant";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import PonponManiaCard from "@/components/blog/PonponManiaCard";
import ArticleCard from "@/components/blog/ArticleCard";

export default function BlogPage() {
  const router = useRouter();
  const { locale, asPath } = router;

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
      <Box
        paddingX={{ base: "16px", "2xl": "64px" }}
        maxW={"1400px"}
        mx={"auto"}
      >
        <Heading
          as="h2"
          textAlign="center"
          fontSize={{
            base: "60px",
            sm: "100px",
            md: "150px",
            xl: "180px",
          }}
          fontWeight={"bold"}
          color={"#222"}
          py={8}
        >
          BLOG
        </Heading>
        <PonponManiaCard />
        <SimpleGrid
          columns={{ base: 1, md: 2, xl: 3 }}
          spacing={{ base: 4, "2xl": 8 }}
        >
          {articles.map((item, index) => (
            <ArticleCard
              key={index}
              {...item}
              hasOverlay={false}
              showBadge={false}
            />
          ))}
        </SimpleGrid>
        <PonponManiaCard
          reverse={true}
          title="Bittercreek.Studio"
          date="Nov 5, 2025"
          description="Bitter creek is a visual production studio shaped by culture, built to influence. Our goal was to redesign their"
          articleLink="#"
          image="/images/Studio.jpg"
        />
        <SimpleGrid
          columns={{ base: 1, md: 2, xl: 3 }}
          spacing={{ base: 4, "2xl": 8 }}
        >
          {otherArticles.map((item, index) => (
            <ArticleCard
              key={index}
              {...item}
              hasOverlay={false}
              showBadge={false}
            />
          ))}
        </SimpleGrid>
      </Box>
    </MainLayout>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
