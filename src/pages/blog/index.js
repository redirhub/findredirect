import { client } from "@/sanity/lib/client";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Button,
  HStack,
  Flex,
  useBreakpointValue,
} from "@chakra-ui/react";
import MainLayout from "@/layouts/MainLayout";
import { generateHrefLangsAndCanonicalTag } from "@/utils";
import { APP_NAME } from "@/configs/constant";
import PostCard from "@/components/blog/PostCard";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import PonponManiaCard from "@/components/blog/PonponManiaCard";

const PER_PAGE = 12;
export default function IndexPage({ posts, pagination }) {
  const router = useRouter();
  const { locale, asPath } = router;

  const { currentPage, totalPages } = pagination || {
    currentPage: 1,
    totalPages: 1,
  };
  const isFirstPage = currentPage === 1;

  const maxPageButtons = useBreakpointValue({
    base: 3,
    sm: 5,
    md: 7,
    lg: 9,
  }) || 5;
  const visiblePages = useMemo(() => {
    if (!maxPageButtons) return [];
    if (totalPages <= maxPageButtons) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }
    const halfWindow = Math.floor((maxPageButtons - 1) / 2);
    let start = Math.max(1, currentPage - halfWindow);
    let end = start + maxPageButtons - 1;
    if (end > totalPages) {
      end = totalPages;
      start = end - maxPageButtons + 1;
    }
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [ currentPage, maxPageButtons, totalPages ]);
  const handlePageChange = useCallback(
    (page) => {
      const safePage = Math.min(Math.max(page, 1), totalPages);
      const nextQuery = { ...router.query };
      if (safePage === 1) {
        delete nextQuery.page;
      } else {
        nextQuery.page = String(safePage);
      }
      router.push({ pathname: router.pathname, query: nextQuery });
    },
    [ router, totalPages ]
  );

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
          BLOG
        </Heading>
        {posts.length === 0 ? (
          <Box textAlign="center" py={20}>
            <Text fontSize="2xl" color="gray.600">
              No posts available yet. Check back soon!
            </Text>
          </Box>
        ) : (
          <Box>
            {/* First post as hero (only on first page) */}
            {isFirstPage && posts[ 0 ] && (
              <Box mb={{ base: 8, md: 12 }}>
                <PonponManiaCard post={posts[ 0 ]} />
              </Box>
            )}

            {/* Remaining posts in grid */}
            {posts.length > 0 && (
              <SimpleGrid
                columns={{ base: 1, md: 2, xl: 3 }}
                spacing={{ base: 4, "2xl": 8 }}
              >
                {(isFirstPage ? posts.slice(1) : posts).map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </SimpleGrid>
            )}

            {totalPages > 1 && (
              <Flex justify="center" mt={10} mb={12}>
                <HStack spacing={3}>
                  <Button
                    size="sm"
                    rounded={'lg'}
                    onClick={() => handlePageChange(currentPage - 1)}
                    isDisabled={currentPage === 1}
                    variant="outline"
                    _hover={currentPage === 1 ? {} : { bg: '#d2e1f0', color: '#1d6db6' }}
                  >
                    Previous
                  </Button>
                  {visiblePages.map((page) => {
                    const isActive = page === currentPage;
                    return (
                      <Button
                        key={`page-${page}`}
                        size="sm"
                        rounded={'lg'}
                        bg={isActive ? "#d2e1f0" : "transparent"}
                        _hover={isActive ? { bg: "#d2e1f0" } : { bg: "gray.100" }}
                        boxShadow={isActive ? "0 2px 8px rgba(210, 225, 240, 0.3)" : "none"}
                        textColor={"#1d6db6"}
                        variant={isActive ? "solid" : "solid"}
                        onClick={() => handlePageChange(page)}
                      >{page}</Button>
                    );
                  })}
                  <Button
                    size="sm"
                    rounded={'lg'}
                    onClick={() => handlePageChange(currentPage + 1)}
                    isDisabled={currentPage === totalPages}
                    variant="outline"
                    _hover={currentPage === totalPages ? {} : { bg: '#d2e1f0', color: '#1d6db6' }}
                  >
                    Next
                  </Button>
                </HStack>
              </Flex>
            )}
          </Box>
        )}
      </Box>
    </MainLayout>
  );
}

export async function getServerSideProps({ locale, query }) {
  const rawPage =
    typeof query.page === "string"
      ? query.page
      : Array.isArray(query.page)
        ? query.page[ 0 ]
        : "1";
  const requestedPage = Number.parseInt(rawPage, 10);
  const currentPage = Math.max(Number.isNaN(requestedPage) ? 1 : requestedPage, 1);

  const totalCountQuery = `count(*[
    _type == "post" &&
    defined(slug.current) &&
    locale == $locale
  ])`;

  const totalCount = await client.fetch(totalCountQuery, {
    locale: locale || "en",
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * PER_PAGE;
  const end = safePage > 1 ? start + PER_PAGE : start + PER_PAGE + 1;

  const POSTS_QUERY = `*[
    _type == "post" &&
    defined(slug.current) &&
    locale == $locale
  ] | order(publishedAt desc) [$start...$end] {
    _id,
    title,
    slug,
    excerpt,
    image,
    publishedAt,
    locale,
    author->{
      name,
      image
    }
  }`;

  try {
    const posts = await client.fetch(POSTS_QUERY, {
      locale: locale || "en",
      start,
      end,
    });

    return {
      props: {
        posts: posts || [],
        pagination: {
          currentPage: safePage,
          totalPages,
        },
        ...(await serverSideTranslations(locale, [ "common" ])),
      },
    };
  } catch (error) {
    return {
      props: {
        posts: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
        },
        ...(await serverSideTranslations(locale, [ "common" ])),
      },
    };
  }
}
