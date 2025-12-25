import { Box, Flex, Heading, Container, Link as ChakraLink } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { useTranslation } from "next-i18next";
import PostMetadata from "./PostMetadata";
import { urlFor } from "@/sanity/lib/image";

export default function PostHeader({
  title,
  author,
  publishedAt,
  readTimeMinutes,
  tags,
  image
}) {
  const { t } = useTranslation();
  const imageUrl = image
    ? urlFor(image).width(1600).height(900).url()
    : null;

  return (
    <Box as="header" mb={8} bg="#f8f9fa" w="100vw" position="relative" left="50%" right="50%" ml="-50vw" mr="-50vw">
      <Container maxW="1400px" px={{ base: 4, md: 8 }} py={{ base: 6, md: 8 }}>
        <Flex
          direction={{ base: "column", lg: "row" }}
          gap={{ base: 6, lg: 8 }}
          align={{ base: "start", lg: "center" }}
        >
          {/* Left Column */}
          <Box flex="1.5">
            <Link href="/blog" passHref legacyBehavior>
              <ChakraLink
                display="inline-flex"
                alignItems="center"
                gap={2}
                mb={4}
                fontSize="sm"
                fontWeight="600"
                color="gray.600"
                _hover={{
                  color: "#7D65DB",
                  textDecoration: "none",
                }}
                transition="color 0.2s"
              >
                <FiArrowLeft size={16} />
                {t('blog.back-to-blog', 'Blog')}
              </ChakraLink>
            </Link>

            <Heading
              as="h1"
              fontSize={{ base: "24px", md: "32px", lg: "36px" }}
              fontWeight="700"
              lineHeight="1.2"
              mb={4}
              color="gray.900"
              letterSpacing="-0.01em"
            >
              {title}
            </Heading>

            <PostMetadata
              publishedAt={publishedAt}
              author={author}
              readTimeMinutes={readTimeMinutes}
              tags={tags}
              layout="horizontal"
            />
          </Box>

          {/* Right Column */}
          {imageUrl && (
            <Box
              flex="1"
              w="100%"
              maxW={{ lg: "450px" }}
            >
              <Box
                borderRadius="lg"
                overflow="hidden"
                boxShadow="md"
                position="relative"
                w="100%"
                paddingBottom="56.25%"
              >
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  style={{ objectFit: "cover", position: "absolute" }}
                  priority
                />
              </Box>
            </Box>
          )}
        </Flex>
      </Container>
    </Box>
  );
}
