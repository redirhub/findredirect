import { useState, useEffect, useCallback, useRef } from "react";
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
  Tooltip,
} from "@chakra-ui/react";
import { FaSearch, FaLink, FaLightbulb } from "react-icons/fa";
import { SiApple } from "react-icons/si"; // Import the Apple icon for Cmd
import RedirectResultList from "./RedirectResultList";
import { checkRedirects } from "./redirectUtils.jsx";
import { useDevice } from "@/hooks/useDevice";

export default function RedirectChecker({children, icon, buttonText, examples}) {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const toast = useToast();
  const router = useRouter();
  const [urls, setUrls] = useState('');
  const { isMobile } = useDevice();

  const { bgColor, borderColor } = useColorModeValue(
    { bgColor: "white", borderColor: "gray.200"  },
    { bgColor: "gray.800", borderColor: "gray.700" }
  );

  const textareaRef = useRef(null);

  const handleUrlsChange = (e) => {
    setUrls(e.target.value);
  };

  const handleCheck = useCallback(async () => {
    const handleUrlsCorrect = () => {
      const lines = urls.split('\n');
      const processedLines = lines.map(line => {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('http://') && !trimmedLine.startsWith('https://')) {
          return `http://${trimmedLine}`;
        }
        return trimmedLine;
      });
      setUrls(processedLines.join('\n'));
    };

    handleUrlsCorrect();
    setIsLoading(true);
    setProgress(0);
    const urlList = urls.split("\n").filter((url) => url.trim() !== "");

    const newResults = await checkRedirects(urlList, setProgress, toast);
    setResults(newResults);
    setIsLoading(false);
    scrollToResults();
  }, [urls, toast]);

  const handleShowExamples = () => {
    const exampleUrls = examples.join("\n");
    setUrls(exampleUrls);
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleCheck();
    }
  };

  const tooltipLabel = (
    <span>
      Press Ctrl (⌘) + Enter to submit
    </span>
  );

  return (
    <Container maxW="container.xl" py={{base: 6, md: 20}}>
      <VStack spacing={{base: 8, md: 16}} align="stretch">
        {children}
        <Box
          bg={bgColor}
          borderRadius="xl"
          boxShadow="lg"
          p={{base: 4, md: 8}}
          borderColor={borderColor}
          borderWidth={1}
        >
          <VStack spacing={6}>
            <Box position="relative" width="100%">
              <Tooltip label={tooltipLabel} hasArrow placement="bottom-start">
                <Textarea
                  ref={textareaRef}
                  value={urls}
                  onChange={handleUrlsChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter URLs (one per line)&#10;e.g., example.com"
                  rows={isMobile ? 2 : 5}
                  resize="vertical"
                  bg={useColorModeValue("gray.50", "gray.700")}
                  borderColor={borderColor}
                  borderRadius="lg"
                  _hover={{ borderColor: "blue.400" }}
                  _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)" }}
                  fontSize={{base: "sm", md: "md"}}
                  pr="100px" // Add right padding to accommodate the button
                />
              </Tooltip>
              <Button
                position="absolute"
                top="2"
                right="2"
                size="sm"
                variant="ghost"
                colorScheme="blue"
                onClick={handleShowExamples}
                leftIcon={<FaLightbulb />}
                fontWeight="normal"
                _hover={{ bg: "blue.50" }}
                _active={{ bg: "blue.100" }}
                transition="all 0.2s"
              >
                Examples
              </Button>
            </Box>
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
              {buttonText}
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