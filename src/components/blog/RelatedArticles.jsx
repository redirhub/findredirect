import { Box, Heading, SimpleGrid, Flex, Link as ChakraLink } from "@chakra-ui/react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { FiArrowRight } from "react-icons/fi";
import PostCard from "./PostCard";

export default function RelatedArticles({ posts }) {
  const { t } = useTranslation();

  if (!posts || posts.length === 0) return null;

  return (
    <Box as="section" mt={16} mb={8}>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading
          as="h2"
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="800"
          color="gray.900"
        >
          {t('blog.related-articles', 'Related Articles')}
        </Heading>

        <Link href="/blog" passHref legacyBehavior>
          <ChakraLink
            display="inline-flex"
            alignItems="center"
            gap={2}
            fontSize="md"
            fontWeight="600"
            color="#7D65DB"
            _hover={{
              color: "#6550C0",
              textDecoration: "none",
            }}
            transition="color 0.2s"
          >
            {t('blog.view-all-articles', 'View All Articles')}
            <FiArrowRight size={18} />
          </ChakraLink>
        </Link>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
        {posts.slice(0, 3).map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
