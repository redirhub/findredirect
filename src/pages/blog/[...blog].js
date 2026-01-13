import { client } from "@/sanity/lib/client";
import { PortableText } from "@portabletext/react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  Box,
  Container,
  Heading,
  Text,
  Divider,
  Flex,
  Image as ChakraImage,
} from "@chakra-ui/react";
import MainLayout from "@/layouts/MainLayout";
import { urlFor } from "@/sanity/lib/image";
import { APP_NAME } from "@/configs/constant";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import PostHeader from "@/components/blog/PostHeader";
import TableOfContents from "@/components/blog/TableOfContents";
import AuthorBox from "@/components/blog/AuthorBox";
import RelatedArticles from "@/components/blog/RelatedArticles";
import FAQSection from "@/components/common/FAQSection";
import { fetchAllPagesForFooter } from "@/services/pageService";

const WORDS_PER_MINUTE = 200;

const getWordCountFromContent = (content) => {
  if (!Array.isArray(content)) return 0;

  return content.reduce((count, block) => {
    if (block?._type === "block" && Array.isArray(block.children)) {
      const text = block.children.map((child) => child?.text || "").join(" ");
      const words = text.trim().split(/\s+/).filter(Boolean);
      return count + words.length;
    }
    return count;
  }, 0);
};

const calculateReadTimeMinutes = (content) => {
  const wordCount = getWordCountFromContent(content);
  if (!wordCount) return 0;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
};

export default function PostPage({ postData, pages = [] }) {
  const router = useRouter();
  const { asPath } = router;

  if (!postData) {
    return (
      <MainLayout pages={pages}>
        <Head>
          <title>{`Post Not Found | ${APP_NAME}`}</title>
        </Head>
        <Container maxW="container.xl" py={20} textAlign="center">
          <Heading as="h1" size="2xl" mb={4} color="gray.800">
            Post not found
          </Heading>
          <Text fontSize="xl" color="gray.600">
            The post you&apos;re looking for doesn&apos;t exist.
          </Text>
        </Container>
      </MainLayout>
    );
  }

  const title = `${postData.title} | ${APP_NAME}`;
  const description = postData.excerpt || postData.title;
  const firstContentImage =
    postData.content?.find?.((block) => block._type === "image") || null;
  const primaryImage = postData.image || firstContentImage;
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ""}${asPath}`;
  const ogImage = primaryImage
    ? urlFor(primaryImage).width(1200).height(630).url()
    : `${process.env.NEXT_PUBLIC_SITE_URL || ""}/images/og-default.jpg`;
  const heroImage = primaryImage
    ? {
      src: urlFor(primaryImage).width(1200).height(630).url(),
      alt:
        primaryImage?.alt ||
        primaryImage?.caption ||
        postData.title ||
        "Post image",
    }
    : null;

  const formattedDate = postData.publishedAt
    ? new Date(postData.publishedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "";

  const publishedTime = postData.publishedAt
    ? new Date(postData.publishedAt).toISOString()
    : "";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: postData.title,
    description: description,
    image: ogImage,
    datePublished: publishedTime,
    dateModified: publishedTime,
    author: postData.author
      ? {
        "@type": "Person",
        name: postData.author.name,
        ...(postData.author.image && {
          image: urlFor(postData.author.image).width(200).height(200).url(),
        }),
      }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: APP_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/logo.png`,
      },
    },
    timeRequired: postData.readTimeMinutes
      ? `PT${postData.readTimeMinutes}M`
      : undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    keywords: postData.tags?.join(", "),
  };

  const faqSchema =
    postData.faqs && postData.faqs.length > 0
      ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: postData.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }
      : null;

  let currentHeadingIndex = -1;

  const portableComponents = {
    types: {
      image: ({ value }) => {
        const src = value?.asset
          ? urlFor(value).width(1200).fit("max").url()
          : value?.url;

        if (!src) return null;

        return (
          <Box my={6} textAlign="center">
            <ChakraImage
              src={src}
              alt={value?.alt || postData.title}
              mx="auto"
              maxH="640px"
              maxWidth={'800px'}
              w="100%"
              objectFit="contain"
              loading="lazy"
            />
            {value?.caption && (
              <Text mt={2} fontSize="sm" color="gray.500">
                {value.caption}
              </Text>
            )}
          </Box>
        );
      },
    },
    block: {
      h2: ({ children }) => {
        currentHeadingIndex++;
        return (
          <Heading
            as="h2"
            id={`heading-${currentHeadingIndex}`}
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="bold"
            mt={10}
            mb={4}
            color="gray.900"
            scrollMarginTop="100px"
          >
            {children}
          </Heading>
        );
      },
      h3: ({ children }) => {
        currentHeadingIndex++;
        return (
          <Heading
            as="h3"
            id={`heading-${currentHeadingIndex}`}
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="bold"
            mt={6}
            mb={3}
            color="gray.900"
            scrollMarginTop="100px"
          >
            {children}
          </Heading>
        );
      },
    },
  };

  return (
    <MainLayout pages={pages}>
      <Head>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={postData.title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content={APP_NAME} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={postData.title} />
        {publishedTime && (
          <meta property="article:published_time" content={publishedTime} />
        )}
        {postData.author?.name && (
          <meta property="article:author" content={postData.author.name} />
        )}
        {postData.tags &&
          postData.tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={postData.title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content={postData.title} />

        {postData.author?.name && (
          <meta name="author" content={postData.author.name} />
        )}
        {postData.tags && (
          <meta name="keywords" content={postData.tags.join(", ")} />
        )}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />

        {faqSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        )}

        {postData.availableTranslations &&
          postData.availableTranslations.map((translation) => (
            <link
              key={translation.locale}
              rel="alternate"
              hrefLang={translation.locale}
              href={`${process.env.NEXT_PUBLIC_SITE_URL}/${translation.locale === "en" ? "" : `${translation.locale}/`
                }blog/${translation.slug}`}
            />
          ))}

        {postData.availableTranslations && (
          <link
            rel="alternate"
            hrefLang="x-default"
            href={`${process.env.NEXT_PUBLIC_SITE_URL}/blog/${postData.availableTranslations.find((t) => t.locale === "en")
              ?.slug || postData.slug.current
              }`}
          />
        )}
      </Head>

      <Box>
        <PostHeader
          title={postData.title}
          author={postData.author}
          publishedAt={postData.publishedAt}
          readTimeMinutes={postData.readTimeMinutes}
          tags={postData.tags}
          image={postData.image}
        />

        <Box maxW="1100px" mx="auto" px={{ base: 4, md: 6 }} py={10}>
          <Box
            display="grid"
            gridTemplateColumns={{ base: "1fr", xl: "1fr 280px" }}
            gap={8}
          >
            {/* Main Content */}
            <Box minW="0">
              <Container maxW="800px" px={0}>
                <article>
                  {postData.content && (
                    <Box
                      mb={4}
                      sx={{
                        "& p": {
                          fontSize: { base: "md", md: "lg" },
                          lineHeight: "1.8",
                          color: "gray.700",
                          mb: 4,
                        },
                        "& h1": {
                          fontSize: { base: "2xl", md: "3xl" },
                          fontWeight: "bold",
                          mt: 10,
                          mb: 4,
                          color: "gray.900",
                        },
                        "& h4": {
                          fontSize: { base: "lg", md: "xl" },
                          fontWeight: "bold",
                          mt: 6,
                          mb: 3,
                          color: "gray.900",
                        },
                        "& ul, & ol": {
                          pl: 6,
                          mb: 4,
                        },
                        "& li": {
                          fontSize: { base: "md", md: "lg" },
                          color: "gray.700",
                          mb: 2,
                        },
                        "& a": {
                          color: "#7D65DB",
                          textDecoration: "underline",
                          _hover: {
                            color: "#6550C0",
                          },
                        },
                        "& img": {
                          my: 4,
                        },
                      }}
                    >
                      <PortableText
                        value={postData.content}
                        components={portableComponents}
                      />
                    </Box>
                  )}

                  {/* FAQ Section */}
                  {postData.faqs && postData.faqs.length > 0 && (
                    <Box as="section" mt={10}>
                      <Divider mb={6} />
                      <FAQSection
                        data={postData.faqs}
                        title="Frequently Asked Questions"
                        showContactButton={false}
                        accentColor="#7D65DB"
                      />
                    </Box>
                  )}

                  {/* Author Box */}
                  <AuthorBox author={postData.author} />
                </article>
              </Container>
            </Box>

            {/* Table of Contents - Desktop Only */}
            <Box display={{ base: "none", xl: "block" }}>
              <TableOfContents content={postData.content} />
            </Box>
          </Box>

          {/* Related Articles - Full Width */}
          {postData.relatedPosts && postData.relatedPosts.length > 0 && (
            <Box mt={12}>
              <RelatedArticles posts={postData.relatedPosts} />
            </Box>
          )}
        </Box>
      </Box>
    </MainLayout>
  );
}

export async function getStaticPaths() {
  const SLUGS_QUERY = `*[
    _type == "post" && defined(slug.current)
  ][0...50] {
    "slug": slug.current,
    locale
  }`;


  try {
    const posts = await client.fetch(SLUGS_QUERY);

    const paths = posts.map((post) => ({
      params: { blog: [post.slug] },
      locale: post.locale || "en",
    }));

    return {
      paths,
      fallback: "blocking",
    };
  } catch (error) {
    console.error("Error fetching post slugs:", error);
    return {
      paths: [],
      fallback: "blocking",
    };
  }
}

export async function getStaticProps({ params, locale }) {
  const slug = params.blog ? params.blog[0] : null;

  if (!slug) {
    return {
      notFound: true,
    };
  }

  try {
    const POST_QUERY = `*[
      _type == "post" &&
      slug.current == $slug &&
      locale == $locale
    ][0] {
      _id,
      title,
      slug,
      excerpt,
      tags,
      content,
      image,
      publishedAt,
      locale,
      author->{
        name,
        image,
        bio,
        title,
        linkedin
      },
      faqs
    }`;

    let postData = await client.fetch(POST_QUERY, { slug, locale: locale || 'en' });

    if (!postData && locale !== 'en') {
      postData = await client.fetch(POST_QUERY, { slug, locale: 'en' });
    }

    if (!postData) {
      return {
        notFound: true,
      };
    }

    const TRANSLATIONS_QUERY = `*[
      _type == "post" &&
      slug.current == $slug
    ] {
      locale,
      "slug": slug.current
    }`;

    const availableTranslations = await client.fetch(TRANSLATIONS_QUERY, {
      slug: postData.slug.current,
    });

    const readTimeMinutes = calculateReadTimeMinutes(postData.content);

    // Fetch related posts by tags
    const RELATED_POSTS_QUERY = `*[
      _type == "post" &&
      _id != $postId &&
      defined(slug.current) &&
      locale == $locale &&
      count((tags[])[@ in $tags]) > 0
    ] | order(publishedAt desc) [0...6] {
      _id,
      title,
      slug,
      excerpt,
      image,
      publishedAt,
      tags,
      author->{
        name,
        image,
        slug
      }
    }`;

    const relatedPosts = postData.tags && postData.tags.length > 0
      ? await client.fetch(RELATED_POSTS_QUERY, {
          postId: postData._id,
          locale: locale || 'en',
          tags: postData.tags,
        })
      : [];

    const pages = await fetchAllPagesForFooter(locale || 'en');

    return {
      props: {
        postData: {
          ...postData,
          availableTranslations: availableTranslations || [],
          readTimeMinutes,
          relatedPosts: relatedPosts || [],
        },
        pages,
        ...(await serverSideTranslations(locale, ["common"])),
      },
      revalidate: 60,
    };
  } catch (error) {
    return {
      notFound: true,
      revalidate: 10,
    };
  }
}

