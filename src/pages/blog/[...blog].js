import { client } from "@/sanity/lib/client";
import { PortableText } from "@portabletext/react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import {
  Box,
  Container,
  Heading,
  Text,
  Flex,
  Avatar,
  Tag,
  Wrap,
  WrapItem,
  Divider,
  VStack,
  HStack,
} from "@chakra-ui/react";
import MainLayout from "@/layouts/MainLayout";
import { urlFor } from "@/sanity/lib/image";
import { generateHrefLangsAndCanonicalTag } from "@/utils";
import { APP_NAME } from "@/configs/constant";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function PostPage({ postData }) {
  const router = useRouter();
  const { locale, asPath } = router;

  if (!postData) {
    return (
      <MainLayout>
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
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ""}${asPath}`;
  const ogImage = postData.image
    ? urlFor(postData.image).width(1200).height(630).url()
    : `${process.env.NEXT_PUBLIC_SITE_URL || ""}/images/og-default.jpg`;

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

  return (
    <MainLayout>
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

        {generateHrefLangsAndCanonicalTag(locale, asPath)}
      </Head>

      <Box
        paddingX={{ base: "16px", md: "32px", "2xl": "64px" }}
        maxW={"1200px"}
        mx={"auto"}
        py={10}
      >
        <article>
          <Box as="header" mb={10}>
            <Heading
              as="h1"
              fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
              fontWeight="bold"
              lineHeight="1.2"
              mb={6}
              color="gray.900"
            >
              {postData.title}
            </Heading>


            <Flex
              direction={{ base: "column", md: "row" }}
              align={{ base: "start", md: "center" }}
              gap={4}
              color="gray.600"
              mb={6}
            >
              {postData.publishedAt && (
                <Text
                  as="time"
                  dateTime={postData.publishedAt}
                  fontSize="md"
                  fontWeight="500"
                >
                  {formattedDate}
                </Text>
              )}

              {postData.author && (
                <HStack spacing={3}>
                  {postData.author.image && (
                    <Avatar
                      size="sm"
                      name={postData.author.name}
                      src={urlFor(postData.author.image)
                        .width(40)
                        .height(40)
                        .url()}
                    />
                  )}
                  <Text fontSize="md">by {postData.author.name}</Text>
                </HStack>
              )}
            </Flex>

            {postData.tags && postData.tags.length > 0 && (
              <Wrap spacing={2} mb={8}>
                {postData.tags.map((tag, index) => (
                  <WrapItem key={index}>
                    <Tag
                      size="md"
                      borderRadius="full"
                      colorScheme="purple"
                      px={4}
                      py={2}
                    >
                      {tag}
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
            )}
          </Box>

          {postData.image && (
            <Box
              mb={12}
              borderRadius="16px"
              overflow="hidden"
              boxShadow="0 20px 60px rgba(0, 0, 0, 0.15)"
            >
              <Image
                src={urlFor(postData.image).width(1200).height(630).url()}
                alt={postData.title}
                style={{ objectFit: "cover" }}
                width={1200}
                height={630}
              />
            </Box>
          )}

          {postData.content && (
            <Box
              mb={4}
              sx={{
                "& p": {
                  fontSize: { base: "md", md: "lg" },
                  lineHeight: "1.8",
                  color: "gray.700",
                },
                "& h1": {
                  fontSize: { base: "2xl", md: "3xl" },
                  fontWeight: "bold",
                  mt: 10,
                  color: "gray.900",
                },
                "& h2": {
                  fontSize: { base: "2xl", md: "3xl" },
                  fontWeight: "bold",
                  mt: 10,
                  color: "gray.900",
                },
                "& h3": {
                  fontSize: { base: "xl", md: "2xl" },
                  fontWeight: "bold",
                  mt: 4,
                  color: "gray.900",
                },
                "& ul, & ol": {
                  pl: 6,
                },
                "& li": {
                  fontSize: { base: "md", md: "lg" },
                  color: "gray.700",
                },
                "& a": {
                  color: "#7D65DB",
                  textDecoration: "underline",
                  _hover: {
                    color: "#6550C0",
                  },
                },
                "& img": {
                  borderRadius: "12px",
                  my: 4,
                },
              }}
            >
              <PortableText value={postData.content} />
            </Box>
          )}
          {postData.excerpt && (
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color="gray.600"
              mb={2}
              lineHeight="1.6"
            >
              {postData.excerpt}
            </Text>
          )}
          {postData.faqs && postData.faqs.length > 0 && (
            <Box as="section" mt={10}>
              <Divider mb={8} />
              <Heading
                as="h2"
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="bold"
                mb={8}
                color="gray.900"
              >
                Frequently Asked Questions
              </Heading>
              <VStack spacing={6} align="stretch">
                {postData.faqs.map((faq, index) => (
                  <Box
                    key={index}
                    p={6}
                    borderLeft="4px solid"
                    borderColor="#7D65DB"
                    bg="gray.50"
                    borderRadius="md"
                  >
                    <Heading
                      as="h3"
                      fontSize={{ base: "lg", md: "xl" }}
                      fontWeight="semibold"
                      mb={3}
                      color="gray.900"
                    >
                      {faq.question}
                    </Heading>
                    <Text
                      fontSize={{ base: "md", md: "lg" }}
                      color="gray.700"
                      lineHeight="1.6"
                    >
                      {faq.answer}
                    </Text>
                  </Box>
                ))}
              </VStack>
            </Box>
          )}
        </article>
      </Box>
    </MainLayout>
  );
}

export async function getStaticPaths() {
  const SLUGS_QUERY = `*[
    _type == "post" && defined(slug.current)
  ][0...50] {
    "slug": slug.current
  }`;

  const allLanguages = ["en", "de", "es", "fr", "it", "pt", "ja", "zh", "ko"];

  try {
    const posts = await client.fetch(SLUGS_QUERY);

    const paths = posts.map((post) => ({
      params: { blog: [post.slug] },
      locale: "en",
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
  const POST_QUERY = `*[
    _type == "post" && slug.current == $slug
  ][0] {
    _id,
    title,
    slug,
    excerpt,
    tags,
    content,
    image,
    publishedAt,
    author->{
      name,
      image
    },
    faqs
  }`;
  const slug = params.blog ? params.blog[0] : null;

  if (!slug) {
    return {
      notFound: true,
    };
  }

  try {
    const postData = await client.fetch(POST_QUERY, { slug });

    if (!postData) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        postData,
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

