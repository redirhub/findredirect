import React from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Flex,
  Icon,
  useColorModeValue,
  HStack,
  Tooltip,
  Divider,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { FaLink, FaClock, FaServer, FaChevronRight, FaBolt, FaCheckCircle, FaSmile, FaSadTear, FaArrowDown, FaThumbsUp, FaLock, FaExternalLinkAlt, FaShareAlt } from "react-icons/fa";
import { getFluidFontSize } from "@/utils";
import { FiZap } from "react-icons/fi";
import { GiTurtle } from "react-icons/gi";
import { FaBicycle, FaCar, FaCode } from "react-icons/fa";
import { styles } from "@/configs/checker";
import { useDevice } from '@/hooks/useDevice';

export default function RedirectResultList({ results }) {
  const { isMobile } = useDevice();
  const arrowColor = useColorModeValue("gray.300", "gray.600");
  const toast = useToast();
  // Remove this line:
  // const { onCopy } = useClipboard(""); // Initialize useClipboard hook

  // Find the fastest result
  const fastestResult = results.reduce((fastest, current) => {
    const currentTime = current.totalTime;
    const fastestTime = fastest ? fastest.totalTime : Infinity;
    return currentTime < fastestTime && !current.error_msg ? current : fastest;
  }, null);

  const handleOpenUrl = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareResult = (url) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?url=${encodeURIComponent(url)}`;
    // Replace onCopy with navigator.clipboard.writeText
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        toast({
          title: "Share URL copied!",
          description: "The result URL has been copied to your clipboard.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
        toast({
          title: "Failed to copy",
          description: "An error occurred while copying the URL.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  return (
    <VStack spacing={6} align="stretch">
      <Heading as="h2" size={isMobile ? "lg" : "xl"} mb={4}>
        Redirect Analysis Results
      </Heading>
      {results.map((result, index) => (
        <Box
          {...styles.card}
          key={`${result.url}-${index}`}
          borderRadius="xl"
          boxShadow="md"
          p={isMobile ? 4 : 6}
          borderWidth={1}
        >
          <Flex direction={isMobile ? "column" : { base: "column", md: "row" }} justifyContent="space-between" alignItems="stretch" gap={isMobile ? 4 : 6}>
            <VStack align="flex-start" spacing={isMobile ? 2 : 4} flex={1}>
              <Flex alignItems="center" gap={2} flexWrap="wrap">
                <Tooltip label={result.url} placement="top">
                  <Heading as="h4" fontSize={isMobile ? getFluidFontSize(18, 20) : getFluidFontSize(20, 24)} fontWeight="600" isTruncated maxWidth="100%">
                    {truncateUrl(result.url, isMobile ? 36 : 45)}
                  </Heading>
                </Tooltip>
                {getProviderBadge(result?.chain?.[0]?.header)}
                {result === fastestResult && results.length > 1 && (
                  <Badge {...styles.fastestBadge}>
                    <FaBolt /> Fastest
                  </Badge>
                )}
                <Tooltip label="Open URL in new tab">
                  <IconButton
                    icon={<FaExternalLinkAlt />}
                    aria-label="Open URL"
                    onClick={() => handleOpenUrl(result.url)}
                    {...styles.iconButton}
                  />
                </Tooltip>
                <Tooltip label="Copy share link">
                  <IconButton
                    icon={<FaShareAlt />}
                    aria-label="Share result"
                    onClick={() => handleShareResult(result.url)}
                    {...styles.iconButton}
                  />
                </Tooltip>
              </Flex>
              <Flex alignItems="center" width="100%">
                <Icon as={FaArrowDown} color={arrowColor} boxSize={isMobile ? 3 : 4} mx={isMobile ? 2 : 4} />
              </Flex>
              {!result.error_msg ? (
                <Tooltip label={result.finalUrl} placement="top">
                  <Text fontSize={isMobile ? getFluidFontSize(14, 15) : getFluidFontSize(16, 17)} fontWeight="500" isTruncated maxWidth="100%">
                    {truncateUrl(result.finalUrl, isMobile ? 40 : 50)}
                  </Text>
                </Tooltip>
              ) : (
                <Text fontSize={isMobile ? getFluidFontSize(14, 15) : getFluidFontSize(16, 17)} fontWeight="500" color="red.500">
                  Error: {result.error_msg}
                </Text>
              )}
            </VStack>
            <HStack spacing={isMobile ? 2 : 4} justifyContent={isMobile ? "space-between" : "flex-end"} flexWrap="wrap">
              <StatItem
                label="Status"
                value={result.statusCode || "N/A"}
                icon={<Icon as={FaCode} color={result.error_msg ? "red.500" : "purple.500"} boxSize={isMobile ? 6 : 8} />}
                isMobile={isMobile}
              />
              <StatItem
                label="Redirects"
                value={result.chainNumber}
                icon={getRedirectIcon(result.chainNumber, isMobile)}
                isMobile={isMobile}
              />
              <StatItem
                label="Response"
                value={result.error_msg ? "N/A" : `${result.totalTime.toFixed(2)}s`}
                icon={getResponseIcon(result.totalTime * 1000, isMobile)}
                isMobile={isMobile}
              />
            </HStack>
          </Flex>
          {!result.error_msg && (
            <Accordion allowToggle mt={4}>
              <AccordionItem border="none">
                <AccordionButton px={0} _hover={{ bg: "transparent" }}>
                  <Text color="blue.500" fontWeight="medium">
                    Show Details
                  </Text>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4} px={0}>
                  <Box overflowX="auto">
                    <Table variant="simple" size="sm" style={{ minWidth: '800px' }}>
                      <Thead>
                        <Tr>
                          <Th>Step</Th>
                          <Th>URL</Th>
                          <Th>Status</Th>
                          <Th>Time</Th>
                          <Th>Details</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {result?.chain?.map((redirect, index) => (
                          <Tr key={index}>
                            <Td>{index + 1}</Td>
                            <Td>
                              <Text fontSize="sm" fontWeight="medium">
                                {redirect?.url}
                              </Text>
                            </Td>
                            <Td>
                              <Badge
                                colorScheme={redirect.succeed ? "green" : "red"}
                                borderRadius="full"
                                px={2}
                                py={1}
                              >
                                {redirect?.http_code}
                              </Badge>
                            </Td>
                            <Td>{redirect?.alltime?.toFixed(2) || 0}s</Td>
                            <Td>
                              <Accordion allowToggle>
                                <AccordionItem border="none">
                                  <AccordionButton p={0} _hover={{ bg: "transparent" }}>
                                    <Text color="blue.500" fontSize="sm">
                                      View Details
                                    </Text>
                                  </AccordionButton>
                                  <AccordionPanel pb={4}>
                                    <VStack align="stretch" spacing={2}>
                                      <Flex>
                                        <Icon as={FaServer} mr={2} />
                                        <Text fontWeight="bold">IP:</Text>
                                        <Text ml={2}>{redirect?.ip}</Text>
                                      </Flex>
                                      <Flex>
                                        <Icon as={FaLink} mr={2} />
                                        <Text fontWeight="bold">Scheme:</Text>
                                        <Text ml={2}>{redirect?.scheme}</Text>
                                      </Flex>
                                      {redirect?.scheme?.toLowerCase() === 'https' && (
                                        <Flex>
                                          <Icon as={FaLock} mr={2} />
                                          <Text fontWeight="bold">SSL:</Text>
                                          <Text ml={2}>
                                            {redirect?.ssl_verify_result ? "Verified" : "Unverified"}
                                          </Text>
                                        </Flex>
                                      )}
                                      <Box>
                                        <Text fontWeight="bold" mb={1}>
                                          Headers:
                                        </Text>
                                        <Box
                                          as="pre"
                                          fontSize="xs"
                                          p={2}
                                          bg="gray.50"
                                          _dark={{ bg: "gray.900" }}
                                          borderRadius="md"
                                          overflowX="auto"
                                        >
                                          {JSON.stringify(redirect?.header, null, 2)}
                                        </Box>
                                      </Box>
                                    </VStack>
                                  </AccordionPanel>
                                </AccordionItem>
                              </Accordion>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          )}
        </Box>
      ))}
    </VStack>
  );
}

const getResponseIcon = (responseTime, isMobile) => {
  const size = isMobile ? 6 : 8;
  if (responseTime <= 150) {
    return <Icon as={FiZap} color="green.500" boxSize={size} />;
  } else if (responseTime <= 300) {
    return <Icon as={FaCar} color="blue.500" boxSize={size} />;
  } else if (responseTime <= 500) {
    return <Icon as={FaBicycle} color="orange.500" boxSize={size} />;
  } else {
    return <Icon as={GiTurtle} color="red.500" boxSize={size} />;
  }
};

const getRedirectIcon = (chainNumber, isMobile) => {
  const size = isMobile ? 6 : 8;
  if (chainNumber <= 2 && chainNumber > 0) {
    return <Icon as={FaThumbsUp} color="green.500" boxSize={size} />;
  } else {
    return <Icon as={FaSadTear} color="red.500" boxSize={size} />;
  }
};

const StatItem = ({ label, value, icon, isMobile }) => (
  <Tooltip label={label} placement="top">
    <VStack spacing={1} align="center" {...styles.statItem} p={isMobile ? 2 : 4} minWidth={isMobile ? "80px" : "120px"}>
      {React.cloneElement(icon, { size: isMobile ? 24 : 32 })}
      <Text fontWeight="bold" fontSize={isMobile ? getFluidFontSize(18, 20) : getFluidFontSize(22, 26)}>
        {value}
      </Text>
      <Text color="gray.500" fontSize={isMobile ? getFluidFontSize(12, 14) : getFluidFontSize(14, 16)}>
        {label}
      </Text>
    </VStack>
  </Tooltip>
);

// Helper function to truncate URLs
function truncateUrl(url, maxLength) {
  if (url?.length <= maxLength) return url;
  const start = url?.substring(0, maxLength / 2 - 2);
  const end = url?.substring(url?.length - maxLength / 2 + 2);
  return `${start}...${end}`;
}

// Updated function to get the provider badge with tooltip
const getProviderBadge = (headers) => {
  const poweredBy = headers?.['x-powered-by'] || headers?.['X-Powered-By'];
  if (poweredBy) {
    return (
      <Tooltip label={`Server powered by ${poweredBy}`} placement="top">
        <Badge colorScheme="blue" {...styles.providerBadge}>
          {poweredBy}
        </Badge>
      </Tooltip>
    );
  }
  return null;
};