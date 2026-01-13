import { client } from "@/sanity/lib/client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import BlogListLayout from "@/components/blog/BlogListLayout";
import BlogPostGrid from "@/components/blog/BlogPostGrid";
import BlogPagination from "@/components/blog/BlogPagination";
import { fetchAllPagesForFooter } from "@/services/pageService";

const PER_PAGE = 12;

export default function IndexPage({ posts, pagination, pages = [] }) {
  const { t } = useTranslation();
  const { currentPage, totalPages } = pagination || {
    currentPage: 1,
    totalPages: 1,
  };
  const isFirstPage = currentPage === 1;

  return (
    <BlogListLayout
      title={t('blog.title', 'BLOG')}
      description={t('blog.description', 'Explore our latest blog posts and articles about web development, design, and more.')}
      pages={pages}
    >
      <BlogPostGrid posts={posts} showHero={isFirstPage} />
      <BlogPagination currentPage={currentPage} totalPages={totalPages} />
    </BlogListLayout>
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
      start,
      end,
    });

    const pages = await fetchAllPagesForFooter(locale || "en");

    return {
      props: {
        posts: posts || [],
        pagination: {
          currentPage: safePage,
          totalPages,
        },
        pages,
        ...(await serverSideTranslations(locale, [ "common" ])),
      },
    };
  } catch (error) {
    const pages = await fetchAllPagesForFooter(locale || "en");

    return {
      props: {
        posts: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
        },
        pages,
        ...(await serverSideTranslations(locale, [ "common" ])),
      },
    };
  }
}
