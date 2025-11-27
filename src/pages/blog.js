import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  useColorModeValue,
  SimpleGrid,
  Spinner,
  Alert,
  AlertIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Image,
  Badge,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import MainLayout from "@/layouts/MainLayout";
import { AppContainer } from "@/components/common/AppContainer";
import BlogCard from "@/components/common/BlogCard";
import { generateHrefLangsAndCanonicalTag, getFluidFontSize } from "@/utils";
import { APP_NAME } from "@/configs/constant";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function BlogPage() {
  const router = useRouter();
  const { locale, asPath } = router;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const bgGradient = useColorModeValue(
    "linear(to-r, purple.100, pink.100)",
    "linear(to-r, purple.800, pink.800)"
  );
  const headingColor = useColorModeValue("gray.800", "white");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const title = `Blog | ${APP_NAME}`;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // Fetch posts from DummyJSON (provides English content and tags)
        const response = await fetch("https://dummyjson.com/posts?limit=12");
        const data = await response.json();

        // Add images from Picsum Photos
        const postsWithImages = data.posts.map((post) => ({
          ...post,
          image: `https://picsum.photos/seed/${post.id}/600/400`,
        }));

        setPosts(postsWithImages);
        setError(null);
      } catch (err) {
        setError("Failed to load blog posts. Please try again later.");
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleCardClick = (post) => {
    setSelectedPost(post);
    onOpen();
  };

  return (
    <MainLayout>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content="Explore our latest blog posts covering insights, tips, and industry news."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* hreflangs and canonical tag */}
        {generateHrefLangsAndCanonicalTag(locale, asPath)}
      </Head>

      {/* Hero Section */}
      <Box bgGradient={bgGradient} py={20}>
        <Container maxW="container.xl">
          <VStack spacing={8} alignItems="center" textAlign="center">
            <Heading
              as="h1"
              fontSize={getFluidFontSize(36, 48)}
              fontWeight="800"
              lineHeight="1.2"
              color={headingColor}
            >
              Our Blog
            </Heading>
            <Text
              fontSize={getFluidFontSize(18, 22)}
              maxW="800px"
              color={headingColor}
            >
              Discover insightful articles, industry news, and helpful tips to
              enhance your knowledge.
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Blog Posts Section */}
      <AppContainer py={8}>
        {loading && (
          <Box textAlign="center" py={20}>
            <Spinner size="xl" color="purple.500" thickness="4px" />
            <Text mt={4} fontSize="lg" color={textColor}>
              Loading blog posts...
            </Text>
          </Box>
        )}

        {error && (
          <Alert status="error" borderRadius="md" mb={8}>
            <AlertIcon />
            {error}
          </Alert>
        )}

        {!loading && !error && posts.length > 0 && (
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing={{ base: 6, md: 8 }}
          >
            {posts.map((post) => (
              <BlogCard
                key={post.id}
                id={post.id}
                title={post.title}
                body={post.body}
                image={post.image}
                tags={post.tags}
                onClick={() => handleCardClick(post)}
              />
            ))}
          </SimpleGrid>
        )}

        {!loading && !error && posts.length === 0 && (
          <Box textAlign="center" py={20}>
            <Text fontSize="lg" color={textColor}>
              No blog posts available at the moment.
            </Text>
          </Box>
        )}
      </AppContainer>

      {/* Blog Details Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedPost?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedPost && (
              <VStack spacing={4} align="start">
                <Image
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  borderRadius="md"
                  width="100%"
                  maxH="400px"
                  objectFit="cover"
                />
                <Stack direction="row" flexWrap="wrap" spacing={2}>
                  {selectedPost.tags?.map((tag) => (
                    <Badge
                      key={tag}
                      colorScheme="purple"
                      borderRadius="full"
                      px={2}
                    >
                      {tag}
                    </Badge>
                  ))}
                </Stack>
                <Text fontSize="md" lineHeight="tall">
                  {selectedPost.body}
                </Text>
                <Text fontSize="md" lineHeight="tall">
                  {/* Dummy content to make the post look longer since API returns short body */}
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </Text>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="purple"
              mr={3}
              size="md"
              fontSize="sm"
              borderRadius="full"
              onClick={onClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </MainLayout>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
