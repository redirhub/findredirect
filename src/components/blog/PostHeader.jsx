import { Box, Flex, Heading, Container, Text, Link as ChakraLink } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { useTranslation } from "next-i18next";
import { formatPostDate } from "@/utils/blogHelpers";
import { normalizeTag } from "@/utils/blogHelpers";
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
      <Container maxW="1100px" px={{ base: 4, md: 6 }} py={{ base: 8, md: 12 }}>
        <Flex
          direction={{ base: "column", lg: "row" }}
          gap={{ base: 6, lg: 8 }}
          align={{ base: "start", lg: "center" }}
        >
          {/* Left Column */}
          <Box flex="1.5">
            {/* Back to Blog Link and Tags in one line */}
            <Flex gap={3} mb={5} flexWrap="wrap" alignItems="center">
              {/* Back to Blog Link */}
              <Link href="/blog" passHref legacyBehavior>
                <ChakraLink
                  display="inline-flex"
                  alignItems="center"
                  gap={2}
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

              {/* Separator */}
              {tags && tags.length > 0 && (
                <Text fontSize="sm" color="gray.400">
                  |
                </Text>
              )}

              {/* Tags */}
              {tags && tags.length > 0 && (
                <Flex gap={1} flexWrap="wrap">
                  {tags.slice(0, 3).map((tag, index) => (
                    <Box key={tag}>
                      <Link href={`/blog/tag/${normalizeTag(tag)}`} passHref legacyBehavior>
                        <ChakraLink
                          fontSize="sm"
                          fontWeight="600"
                          color="gray.600"
                          textTransform="uppercase"
                          letterSpacing="0.05em"
                          _hover={{
                            color: "#7D65DB",
                            textDecoration: "none",
                          }}
                          transition="color 0.2s"
                        >
                          {tag}
                        </ChakraLink>
                      </Link>
                      {index < Math.min(tags.length, 3) - 1 && (
                        <Text as="span" fontSize="sm" color="gray.600" mx={1}>
                          ,
                        </Text>
                      )}
                    </Box>
                  ))}
                </Flex>
              )}
            </Flex>

            {/* Title */}
            <Heading
              as="h1"
              fontSize={{ base: "28px", md: "36px", lg: "44px" }}
              fontWeight="800"
              lineHeight="1.15"
              mb={5}
              color="#1a202c"
              letterSpacing="-0.02em"
            >
              {title}
            </Heading>

            {/* Metadata: Date and Read Time */}
            <Flex
              align="center"
              gap={2}
              fontSize="md"
              color="gray.600"
              fontWeight="400"
            >
              {publishedAt && (
                <>
                  <Text>{formatPostDate(publishedAt)}</Text>
                  {readTimeMinutes && <Text>•</Text>}
                </>
              )}
              {readTimeMinutes && (
                <Text>{t('blog.min-read', '{{minutes}} min read', { minutes: readTimeMinutes })}</Text>
              )}
            </Flex>
          </Box>

          {/* Right Column - Image */}
          {imageUrl && (
            <Box
              flex="1"
              w="100%"
              maxW={{ lg: "450px" }}
            >
              <Box
                borderRadius="12px"
                overflow="hidden"
                boxShadow="lg"
                position="relative"
                w="100%"
                paddingBottom="56.25%"
                bg="gray.100"
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
