"use client";
import { client } from "@/sanity/lib/client";
import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Heading, SimpleGrid, Text, Skeleton, Stack } from "@chakra-ui/react";
import MainLayout from "@/layouts/MainLayout";
import { generateHrefLangsAndCanonicalTag } from "@/utils";
import { APP_NAME } from "@/configs/constant";
import PostCard from "@/components/blog/PostCard";

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

const options = { next: { revalidate: 60 } };

export default function IndexPage() {
  const router = useRouter();
  const { locale, asPath } = router;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .fetch(POSTS_QUERY, {}, options)
      .then((posts) => {
        setPosts(posts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
      });
  }, []);

  const title = `Blog Posts | ${APP_NAME}`;

  return (
    <MainLayout>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content="Explore our latest blog posts and articles about web development, design, and more."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* hreflangs and canonical tag */}
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
            md: "150px",
            xl: "180px",
          }}
          fontWeight={"bold"}
          color={"#222"}
          py={8}
        >
          POSTS
        </Heading>

        {loading ? (
          <SimpleGrid
            columns={{ base: 1, md: 2, xl: 3 }}
            spacing={{ base: 4, "2xl": 8 }}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Stack key={i} spacing={4}>
                <Skeleton height="290px" borderRadius="12px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" width="70%" />
              </Stack>
            ))}
          </SimpleGrid>
        ) : posts.length === 0 ? (
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
