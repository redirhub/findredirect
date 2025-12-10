import { client } from "@/sanity/lib/client";
import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import MainLayout from "@/layouts/MainLayout";
import { generateHrefLangsAndCanonicalTag } from "@/utils";
import { APP_NAME } from "@/configs/constant";
import PostCard from "@/components/blog/PostCard";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import PonponManiaCard from "@/components/blog/PonponManiaCard";

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
          console.log(posts),
          <Box textAlign="center" py={20}>
            <Text fontSize="2xl" color="gray.600">
              No posts available yet. Check back soon!
            </Text>
          </Box>
        ) : (
          <Box>
            {posts.map((post, index) => {
              const position = index % 4;
              if (position === 0) {
                const groupIndex = Math.floor(index / 4);
                const reverse = groupIndex % 2 !== 0;
                return (
                  <PonponManiaCard
                    key={post._id}
                    post={post}
                    reverse={reverse}
                  />
                );
              }
              if (position === 1) {
                const remainingPosts = posts.slice(index, index + 3);
                return (
                  <SimpleGrid
                    key={`grid-${index}`}
                    columns={{ base: 1, md: 2, xl: 3 }}
                    spacing={{ base: 4, "2xl": 8 }}
                    mb={8}
                  >
                    {remainingPosts.map((gridPost) => (
                      <PostCard key={gridPost._id} post={gridPost} />
                    ))}
                  </SimpleGrid>
                );
              }
              return null;
            })}
          </Box>
        )}
      </Box>
    </MainLayout>
  );
}

export async function getStaticProps({ locale }) {
  const POSTS_QUERY = `*[
    _type == "post" && 
    defined(slug.current) && 
    locale == $locale
  ] | order(publishedAt desc)[0...12] {
    _id,
    title,
    slug,
    excerpt,
    image,
    publishedAt,
    locale,
    baseSlug,
    author->{
      name,
      image
    }
  }`;

  try {
    const posts = await client.fetch(POSTS_QUERY, {
      locale: locale || 'en'
    });

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
