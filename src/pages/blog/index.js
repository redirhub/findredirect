import { client } from "@/sanity/lib/client";
import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import MainLayout from "@/layouts/MainLayout";
import { generateHrefLangsAndCanonicalTag } from "@/utils";
import { APP_NAME } from "@/configs/constant";
import PostCard from "@/components/blog/PostCard";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function IndexPage({ posts }) {
  const router = useRouter();
  const { locale, asPath } = router;

  const title = `Blog Posts | ${APP_NAME}`;
  const description =
    "Explore our latest blog posts and articles about web development, design, and more.";
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ""}${asPath}`;

  return (
    <MainLayout>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content={APP_NAME} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />

        {generateHrefLangsAndCanonicalTag(locale, asPath)}
      </Head>
      <Box
        paddingX={{ base: "16px", "2xl": "64px" }}
        maxW={"1400px"}
        mx={"auto"}
        minH="100vh"
      >
        <Heading
          as="h1"
          textAlign="center"
          fontSize={{
            base: "60px",
            sm: "100px",
            md: "140px",
            xl: "165px",
          }}
          fontWeight={"bold"}
          color={"#222"}
          py={8}
        >
          BLOGS
        </Heading>

        {posts.length === 0 ? (
          <Box textAlign="center" py={20}>
            <Text fontSize="2xl" color="gray.600">
              No posts available yet. Check back soon!
            </Text>
          </Box>
        ) : (
          <SimpleGrid
            columns={{ base: 1, md: 2, xl: 3 }}
            spacing={{ base: 4, "2xl": 8 }}
          >
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </SimpleGrid>
        )}
      </Box>
    </MainLayout>
  );
}

export async function getStaticProps({ locale }) {
  const POSTS_QUERY = `*[
    _type == "post" && defined(slug.current)
  ] | order(publishedAt desc)[0...12] {
    _id,
    title,
    slug,
    excerpt,
    image,
    publishedAt,
    author->{
      name,
      image
    }
  }`;

  try {
    const posts = await client.fetch(POSTS_QUERY);

    return {
      props: {
        posts: posts || [],
        ...(await serverSideTranslations(locale, ["common"])),
      },
        revalidate: 60,
    };
  } catch (error) {
    return {
      props: {
        posts: [],
        ...(await serverSideTranslations(locale, ["common"])),
      },
      revalidate: 60,
    };
  }
}
