import { Box, Heading, Text, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { urlFor } from "@/sanity/lib/image";

const MotionBox = motion(Box);

export default function PostCard({ post }) {
  const router = useRouter();
  const { title, excerpt, slug, image, tags } = post;

  const imageUrl = image
    ? urlFor(image).width(800).height(600).url()
    : "/images/Case Study.jpg";

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      w="100%"
      bg="white"
      borderRadius="16px"
      overflow="hidden"
      cursor="pointer"
      onClick={() => router.push(`/blog/${slug.current}`)}
      _hover={{
        transform: "translateY(-8px)",
        boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)",
      }}
      sx={{ transition: "all 0.3s ease" }}
      boxShadow="0 4px 12px rgba(0, 0, 0, 0.08)"
    >
      {/* Featured Image */}
      <Box
        position="relative"
        w="100%"
        paddingBottom="60%"
        overflow="hidden"
        bg="gray.100"
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

      {/* Content */}
      <Box p={6}>
        {/* Category/Tags */}
        {tags && tags.length > 0 && (
          <Text
            fontSize="xs"
            fontWeight="700"
            textTransform="uppercase"
            letterSpacing="0.05em"
            color="gray.600"
            mb={3}
          >
            {tags[0]}
          </Text>
        )}

        {/* Title */}
        <Heading
          as="h3"
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="700"
          lineHeight="1.3"
          mb={3}
          color="gray.900"
          noOfLines={2}
        >
          {title}
        </Heading>

        {/* Excerpt */}
        {excerpt && (
          <Text
            fontSize="md"
            color="gray.600"
            lineHeight="1.6"
            noOfLines={3}
          >
            {excerpt}
          </Text>
        )}
      </Box>
    </MotionBox>
  );
}

