import { useState } from "react";
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
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import RedirectResultList from "./RedirectResultList";

export default function RedirectChecker() {
  const [urls, setUrls] = useState('http://redirhub.com');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const toast = useToast();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const handleCheck = async () => {
    setIsLoading(true);
    setProgress(0);
    setResults([]);
    const urlList = urls.split("\n").filter((url) => url.trim() !== "");
    const totalUrls = urlList.length;

    for (let i = 0; i < totalUrls; i++) {
      try {
        const response = await fetch("/api/redirects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: urlList[i] }),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch redirect data for ${urlList[i]}`);
        }

        const data = await response.json();
        setResults((prevResults) => [...prevResults, {
          url: urlList[i],
          chainNumber: data.filter(item => /^30\d/.test(item.http_code)).length,
          statusCode: data[0].http_code,
          finalUrl: data[data.length - 1].url,
          totalTime: data.slice(0, data.length > 1 ? data.length - 1 : 1).reduce((sum, item) => sum + (item.alltime || 0), 0),
          chain: data,
        }]);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setProgress(((i + 1) / totalUrls) * 100);
      }
    }

    setIsLoading(false);
  };

  return (
    <Container maxW="container.xl" py={12}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            Redirect Checker
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Enter URLs (one per line) to analyze their redirect chains and performance.
          </Text>
        </Box>
        <Box bg={bgColor} borderRadius="lg" boxShadow="md" p={6} borderWidth={1} borderColor={borderColor}>
          <VStack spacing={4}>
            <Textarea
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              placeholder="https://example.com"
              rows={5}
              resize="vertical"
            />
            <Button
              leftIcon={<FaSearch />}
              colorScheme="blue"
              onClick={handleCheck}
              isLoading={isLoading}
              loadingText="Checking..."
              width="full"
              size="lg"
            >
              Check Redirects
            </Button>
          </VStack>
        </Box>
        {isLoading && (
          <Progress value={progress} size="sm" colorScheme="blue" borderRadius="full" />
        )}
        {results.length > 0 && <RedirectResultList results={results} />}
      </VStack>
    </Container>
  );
}