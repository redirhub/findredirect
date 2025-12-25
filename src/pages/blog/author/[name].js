import { client } from "@/sanity/lib/client";
import { Box, Heading, Text, Avatar, VStack } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import BlogListLayout from "@/components/blog/BlogListLayout";
import BlogPostGrid from "@/components/blog/BlogPostGrid";
import BlogPagination from "@/components/blog/BlogPagination";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { urlFor } from "@/sanity/lib/image";

const PER_PAGE = 12;

export default function AuthorPage({ author, posts, pagination, totalCount }) {
  const { t } = useTranslation();
  const { currentPage, totalPages } = pagination;

  return (
    <BlogListLayout
      title={t('blog.author-posts-title', "{{name}}'s Posts", { name: author.name })}
      description={t('blog.author-posts-description', 'Blog posts by {{name}}', { name: author.name })}
      showTitle={false}
    >
      {/* Author Hero Section */}
      <Box
        bg="linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)"
        borderRadius="2xl"
        p={{ base: 8, md: 12 }}
        mb={12}
        mt={4}
        textAlign="center"
      >
        <VStack spacing={4}>
          <Avatar
            size="2xl"
            name={author.name}
            src={author.image ? urlFor(author.image).width(200).height(200).url() : undefined}
            border="4px solid"
            borderColor="purple.200"
          />
          <Heading
            as="h1"
            fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
            fontWeight="800"
            color="gray.900"
          >
            {author.name}
          </Heading>
          {author.bio && (
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color="gray.700"
              maxW="2xl"
              lineHeight="1.75"
            >
              {author.bio}
            </Text>
          )}
          <Text fontSize="sm" color="gray.600" fontWeight="600">
            {totalCount} {t('blog.posts', totalCount === 1 ? 'post' : 'posts')}
          </Text>
        </VStack>
      </Box>

      <BlogPostGrid posts={posts} showHero={false} />
      <BlogPagination currentPage={currentPage} totalPages={totalPages} />
    </BlogListLayout>
  );
}

export async function getServerSideProps({ locale, params, query }) {
  const authorSlug = params.name;

  // First, fetch author info
  const AUTHOR_QUERY = `*[
    _type == "author" &&
    slug.current == $authorSlug
  ][0] {
    _id,
    name,
    slug,
    image,
    bio
  }`;

  const author = await client.fetch(AUTHOR_QUERY, { authorSlug });

  if (!author) {
    return { notFound: true };
  }

  const rawPage = typeof query.page === "string" ? query.page : "1";
  const currentPage = Math.max(Number.parseInt(rawPage, 10) || 1, 1);

  // Count posts by author
  const totalCountQuery = `count(*[
    _type == "post" &&
    defined(slug.current) &&
    locale == $locale &&
    author._ref == $authorId
  ])`;

  const totalCount = await client.fetch(totalCountQuery, {
    locale: locale || "en",
    authorId: author._id,
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * PER_PAGE;
  const end = start + PER_PAGE;

  // Fetch posts
  const POSTS_QUERY = `*[
    _type == "post" &&
    defined(slug.current) &&
    locale == $locale &&
    author._ref == $authorId
  ] | order(publishedAt desc) [$start...$end] {
    _id,
    title,
    slug,
    excerpt,
    image,
    publishedAt,
    locale,
    tags,
    content,
    author->{
      name,
      image,
      slug
    }
  }`;

  try {
    const posts = await client.fetch(POSTS_QUERY, {
      locale: locale || "en",
      authorId: author._id,
      start,
      end,
    });

    return {
      props: {
        author,
        posts: posts || [],
        pagination: { currentPage: safePage, totalPages },
        totalCount,
        ...(await serverSideTranslations(locale, [ "common" ])),
      },
    };
  } catch (error) {
    console.error("Error fetching author posts:", error);
    return {
      props: {
        author,
        posts: [],
        pagination: { currentPage: 1, totalPages: 1 },
        totalCount: 0,
        ...(await serverSideTranslations(locale, [ "common" ])),
      },
    };
  }
}
