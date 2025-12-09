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

  // Handle 404
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
            The post you're looking for doesn't exist.
          </Text>
        </Container>
      </MainLayout>
    );
  }

  const title = `${postData.title} | ${APP_NAME}`;

  const formattedDate = postData.publishedAt
    ? new Date(postData.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <MainLayout>
      <Head>
        <title>{title}</title>
        {postData.excerpt && (
          <meta name="description" content={postData.excerpt} />
        )}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {generateHrefLangsAndCanonicalTag(locale, asPath)}
      </Head>

      <Box
        paddingX={{ base: "16px", md: "32px", "2xl": "64px" }}
        maxW={"1200px"}
        mx={"auto"}
        py={10}
      >
        <article>
          {/* Header */}
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

            {postData.excerpt && (
              <Text
                fontSize={{ base: "lg", md: "xl" }}
                color="gray.600"
                mb={6}
                lineHeight="1.6"
              >
                {postData.excerpt}
              </Text>
            )}

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

          {/* Featured Image */}
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

          {/* Content */}
          {postData.content && (
            <Box
              mb={12}
              sx={{
                "& p": {
                  fontSize: { base: "md", md: "lg" },
                  lineHeight: "1.8",
                  mb: 6,
                  color: "gray.700",
                },
                "& h2": {
                  fontSize: { base: "2xl", md: "3xl" },
                  fontWeight: "bold",
                  mt: 10,
                  mb: 4,
                  color: "gray.900",
                },
                "& h3": {
                  fontSize: { base: "xl", md: "2xl" },
                  fontWeight: "bold",
                  mt: 8,
                  mb: 3,
                  color: "gray.900",
                },
                "& ul, & ol": {
                  pl: 6,
                  mb: 6,
                },
                "& li": {
                  fontSize: { base: "md", md: "lg" },
                  mb: 2,
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
                  my: 8,
                },
              }}
            >
              <PortableText value={postData.content} />
            </Box>
          )}

          {/* FAQs Section */}
          {postData.faqs && postData.faqs.length > 0 && (
            <Box as="section" mt={16}>
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

export async function getServerSideProps({ params, locale }) {
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

  // Extract slug from catch-all route
  const slug = params.post ? params.post[0] : null;

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
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return {
      notFound: true,
    };
  }
}

