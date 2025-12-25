import { Box, Heading, Text, Image, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { urlFor } from "@/sanity/lib/image";
import PostMetadata from "./PostMetadata";

const MotionBox = motion(Box);

export default function PonponManiaCard({ post, reverse = false }) {
  const router = useRouter();
  const { title, excerpt, slug, publishedAt, image, author, tags } = post;

  const imageUrl = image
    ? urlFor(image).width(800).height(600).url()
    : "/images/Ponpon Mania.jpg";

  return (
    <Box
      bg="linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      paddingX={6}
      py={{ base: 12, lg: 20 }}
      my={4}
      borderRadius="16px"
      cursor="pointer"
      onClick={() => router.push(`/blog/${slug.current}`)}
      _hover={{ transform: "translateY(-2px)" }}
      transition="all 0.3s ease"
    >
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        w="100%"
      >
        <Flex
          direction={{ base: "column", lg: reverse ? "row-reverse" : "row" }}
          gap={8}
          align="center"
          justify="space-evenly"
        >
          <Box flex="1">
            <Heading
              as="h1"
              fontSize={{ base: "24px", md: "28px", lg: "32px" }}
              fontWeight="700"
              lineHeight="1.3"
              mb={5}
              color="gray.900"
            >
              {title}
            </Heading>

            {excerpt && (
              <Text
                fontSize={{ base: "16px", lg: "20px" }}
                color="gray.700"
                mb={6}
                lineHeight="1.6"
              >
                {excerpt}
              </Text>
            )}

            <Box mb={6} position="relative" zIndex={10}>
              <PostMetadata
                publishedAt={publishedAt}
                author={author}
                tags={tags}
                compact={false}
                layout="horizontal"
              />
            </Box>
          </Box>

          <Box
            flex="1"
            position="relative"
          >
            <Box
              position="relative"
              borderRadius="16px"
              overflow="hidden"
              boxShadow="0 30px 80px rgba(0, 0, 0, 0.2)"
              paddingBottom="56.25%"
            >
              <Image
                src={imageUrl}
                alt={title}
                position="absolute"
                top="0"
                left="0"
                w="100%"
                h="100%"
                objectFit="cover"
              />
            </Box>
          </Box>
        </Flex>
      </MotionBox>
    </Box>
  );
}