import { client } from "@/sanity/lib/client";
import { Box, Heading } from "@chakra-ui/react";
import BlogListLayout from "@/components/blog/BlogListLayout";
import BlogPostGrid from "@/components/blog/BlogPostGrid";
import BlogPagination from "@/components/blog/BlogPagination";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { denormalizeTag } from "@/utils/blogHelpers";

const PER_PAGE = 12;

export default function TagPage({ tag, posts, pagination }) {
  const { currentPage, totalPages } = pagination;
  const displayTag = tag.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  return (
    <BlogListLayout
      title={`Tag: ${displayTag}`}
      description={`Blog posts tagged with "${displayTag}"`}
      showTitle={false}
    >
      <Heading
        as="h1"
        textAlign="center"
        fontSize={{ base: "40px", md: "60px", xl: "80px" }}
        fontWeight="800"
        color="#222"
        py={6}
      >
        Posts tagged with <Box as="span" color="#7D65DB">#{displayTag}</Box>
      </Heading>

      <BlogPostGrid posts={posts} showHero={false} />
      <BlogPagination currentPage={currentPage} totalPages={totalPages} />
    </BlogListLayout>
  );
}

export async function getServerSideProps({ locale, params, query }) {
  const tag = decodeURIComponent(params.tag);
  const denormalizedTag = denormalizeTag(tag);

  const rawPage = typeof query.page === "string" ? query.page : "1";
  const currentPage = Math.max(Number.parseInt(rawPage, 10) || 1, 1);

  // Count query
  const totalCountQuery = `count(*[
    _type == "post" &&
    defined(slug.current) &&
    locale == $locale &&
    $tag in tags
  ])`;

  const totalCount = await client.fetch(totalCountQuery, {
    locale: locale || "en",
    tag: denormalizedTag,
  });

  if (totalCount === 0) {
    return {
      props: {
        tag,
        posts: [],
        pagination: { currentPage: 1, totalPages: 1 },
        ...(await serverSideTranslations(locale, ["common"])),
      },
    };
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * PER_PAGE;
  const end = start + PER_PAGE;

  // Posts query
  const POSTS_QUERY = `*[
    _type == "post" &&
    defined(slug.current) &&
    locale == $locale &&
    $tag in tags
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
      tag: denormalizedTag,
      start,
      end,
    });

    return {
      props: {
        tag,
        posts: posts || [],
        pagination: { currentPage: safePage, totalPages },
        ...(await serverSideTranslations(locale, ["common"])),
      },
    };
  } catch (error) {
    console.error("Error fetching tag posts:", error);
    return {
      props: {
        tag,
        posts: [],
        pagination: { currentPage: 1, totalPages: 1 },
        ...(await serverSideTranslations(locale, ["common"])),
      },
    };
  }
}
