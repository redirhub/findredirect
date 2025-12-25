import { Box, Heading, Text, Image, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { urlFor } from "@/sanity/lib/image";
import PostMetadata from "./PostMetadata";

const MotionBox = motion(Box);

export default function PostCard({ post }) {
  const router = useRouter();
  const { title, excerpt, slug, publishedAt, image, author, tags } = post;

  const imageUrl = image
    ? urlFor(image).width(800).height(600).url()
    : "/images/Case Study.jpg";

  return (
    <Box
      display="flex"
      alignItems="start"
      justifyContent="center"
      py={{ base: 4, md: 8 }}
      my={3}
    >
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        w="100%"
        border="1px solid"
        borderColor="transparent"
        borderRadius="12px"
        p={{ base: 4, md: 6 }}
        cursor="pointer"
        onClick={() => router.push(`/blog/${slug.current}`)}
        _hover={{
          borderColor: "purple.200",
          transform: "translateY(-4px)",
          boxShadow: "xl",
        }}
        sx={{ transition: "all 0.3s ease" }}
      >
        <Flex
          direction={{ base: "column" }}
          gap={{ base: 4, lg: 6 }}
          align={"start"}
        >
          <Box flex="1">
            <Box alignSelf="flex-start" mb={4}>
              <Heading
                as="h2"
                fontSize={{ base: "18px", md: "20px", "2xl": "22px" }}
                fontWeight="700"
                lineHeight="1.3"
                mb={4}
                color="gray.900"
              >
                {title}
              </Heading>
            </Box>

            <Box
              flex="1"
              position="relative"
              w="100%"
            >
              <Box
                position="relative"
                borderRadius="12px"
                overflow="hidden"
                boxShadow="0 20px 60px rgba(0, 0, 0, 0.15)"
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

            {excerpt && (
              <Text
                fontSize={{ base: "md", md: "lg" }}
                color="gray.700"
                mb={4}
                noOfLines={3}
                lineHeight="1.6"
                pt={5}
              >
                {excerpt}
              </Text>
            )}

            <Box mb={4} position="relative" zIndex={10}>
              <PostMetadata
                publishedAt={publishedAt}
                author={author}
                tags={tags}
                compact={true}
              />
            </Box>
          </Box>
        </Flex>
      </MotionBox>
    </Box>
  );
}

