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
import { useDevice } from "@/hooks/useDevice";

export default function RedirectChecker() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const toast = useToast();
  const router = useRouter();
  const [urls, setUrls] = useState('');
  const { isMobile } = useDevice();

  const { bgColor, borderColor, headingColor, subheadingColor } = useColorModeValue(
    { bgColor: "white", borderColor: "gray.200", headingColor: "gray.800", subheadingColor: "gray.600" },
    { bgColor: "gray.800", borderColor: "gray.700", headingColor: "white", subheadingColor: "gray.400" }
  );

  useEffect(() => {
    if (router.isReady && router.query.url) {
      setUrls(decodeURIComponent(router.query.url));
    }
  }, [router.isReady, router.query.url]);

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

  return (
    <Container maxW="container.xl" py={{base: 6, md: 20}}>
      <VStack spacing={{base: 8, md: 16}} align="stretch">
        <Flex direction="column" align="center" textAlign="center">
          <Box
            bg="blue.500"
            p={3}
            borderRadius="full"
            mb={4}
            boxShadow="lg"
          >
            <Icon as={FaLink} w={8} h={8} color="white" />
          </Box>
          <Heading as="h1" size={{base: "2xl", md: "3xl"}} mb={3} color={headingColor} fontWeight="extrabold">
            Redirect Checker
          </Heading>
          <Text fontSize={{base: "lg", md: "xl"}} color={subheadingColor} maxW="2xl" lineHeight="tall">
            Analyze redirect chains and performance for multiple URLs at once.
          </Text>
        </Flex>
        <Box
          bg={bgColor}
          borderRadius="xl"
          boxShadow="lg"
          p={{base: 4, md: 8}}
          borderColor={borderColor}
          borderWidth={1}
        >
          <VStack spacing={6}>
            <Textarea
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              placeholder="Enter URLs (one per line)&#10;e.g., https://example.com"
              rows={isMobile ? 2 : 5}
              resize="vertical"
              bg={useColorModeValue("gray.50", "gray.700")}
              borderColor={borderColor}
              borderRadius="lg"
              _hover={{ borderColor: "blue.400" }}
              _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)" }}
              fontSize={{base: "sm", md: "md"}}
            />
            <Button
              leftIcon={<FaSearch />}
              colorScheme="blue"
              onClick={handleCheck}
              isLoading={isLoading}
              loadingText="Checking..."
              width={{ base: "full", md: "auto" }}
              size={{base: "md", md: "lg"}}
              fontWeight="bold"
              px={{base: 6, md: 10}}
              py={{base: 5, md: 7}}
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