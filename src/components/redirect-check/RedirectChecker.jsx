import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Textarea,
  VStack,
  Heading,
  Text,
  useToast,
  Progress,
  Container,
  useColorModeValue,
  Icon,
  Flex,
  Divider,
} from "@chakra-ui/react";
import { FaSearch, FaLink } from "react-icons/fa";
import RedirectResultList from "./RedirectResultList";
import { checkRedirects } from "./redirectUtils.jsx";

export default function RedirectChecker() {
  const [urls, setUrls] = useState('http://redirhub.com');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const toast = useToast();
  const router = useRouter();

  const { bgColor, borderColor, headingColor, subheadingColor } = useColorModeValue(
    { bgColor: "white", borderColor: "gray.200", headingColor: "gray.800", subheadingColor: "gray.600" },
    { bgColor: "gray.800", borderColor: "gray.700", headingColor: "white", subheadingColor: "gray.400" }
  );

  const handleCheck = useCallback(async () => {
    setIsLoading(true);
    setProgress(0);
    setResults([]);
    const urlList = urls.split("\n").filter((url) => url.trim() !== "");

    const newResults = await checkRedirects(urlList, setProgress, toast);
    setResults(newResults);
    setIsLoading(false);
    scrollToResults();
  }, [urls, toast]);

  useEffect(() => {
    if (router.isReady && router.query.url) {
      setUrls(decodeURIComponent(router.query.url));
      handleCheck();
    }
  }, [router.isReady, router.query, handleCheck]);

  return (
    <Container maxW="container.xl" py={20}>
      <VStack spacing={16} align="stretch">
        <Flex direction="column" align="center" textAlign="center">
          <Box
            bg="blue.500"
            p={4}
            borderRadius="full"
            mb={6}
            boxShadow="lg"
          >
            <Icon as={FaLink} w={10} h={10} color="white" />
          </Box>
          <Heading as="h1" size="3xl" mb={4} color={headingColor} fontWeight="extrabold">
            Redirect Checker
          </Heading>
          <Text fontSize="xl" color={subheadingColor} maxW="2xl" lineHeight="tall">
            Analyze redirect chains and performance for multiple URLs at once.
          </Text>
        </Flex>
        <Box
          bg={bgColor}
          borderRadius="2xl"
          boxShadow="xl"
          p={10}
          borderColor={borderColor}
          borderWidth={1}
        >
          <VStack spacing={8}>
            <Textarea
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              placeholder="Enter URLs (one per line)&#10;e.g., https://example.com"
              rows={6}
              resize="vertical"
              bg={useColorModeValue("gray.50", "gray.700")}
              borderColor={borderColor}
              borderRadius="lg"
              _hover={{ borderColor: "blue.400" }}
              _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)" }}
              fontSize="md"
            />
            <Divider />
            <Button
              leftIcon={<FaSearch />}
              colorScheme="blue"
              onClick={handleCheck}
              isLoading={isLoading}
              loadingText="Checking..."
              width={{ base: "full", md: "auto" }}
              size="lg"
              fontWeight="bold"
              px={10}
              py={7}
              borderRadius="full"
              boxShadow="md"
              _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
              transition="all 0.2s"
            >
              Check Redirects
            </Button>
          </VStack>
        </Box>
        {isLoading && (
          <Progress
            value={progress}
            size="xs"
            colorScheme="blue"
            borderRadius="full"
            isAnimated
            hasStripe
          />
        )}
        {results.length > 0 && (
          <Box id="redirect-results">
            <RedirectResultList results={results} />
          </Box>
        )}
      </VStack>
    </Container>
  );
}

function scrollToResults() {
  setTimeout(() => {
    const resultsElement = document.getElementById('redirect-results');
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, 100);
}