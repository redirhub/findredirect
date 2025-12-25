import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import PostCard from "./PostCard";
import PonponManiaCard from "./PonponManiaCard";

export default function BlogPostGrid({ posts, showHero = false }) {
  if (!posts || posts.length === 0) {
    return (
      <Box textAlign="center" py={20}>
        <Text fontSize="2xl" color="gray.600">
          No posts available yet. Check back soon!
        </Text>
      </Box>
    );
  }

  const heroPost = showHero ? posts[0] : null;
  const gridPosts = showHero ? posts.slice(1) : posts;

  return (
    <Box>
      {heroPost && (
        <Box mb={{ base: 8, md: 12 }}>
          <PonponManiaCard post={heroPost} />
        </Box>
      )}

      {gridPosts.length > 0 && (
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          spacing={{ base: 6, md: 6, lg: 8 }}
        >
          {gridPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}
