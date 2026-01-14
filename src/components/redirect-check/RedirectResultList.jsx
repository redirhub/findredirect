import React, { useState } from "react";
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
  Button,
  ButtonGroup,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { FaLink, FaClock, FaServer, FaChevronRight, FaBolt, FaCheckCircle, FaSmile, FaSadTear, FaArrowDown, FaThumbsUp, FaLock, FaExternalLinkAlt, FaShareAlt, FaArrowRight, FaChevronDown, FaEye, FaDownload, FaShare, FaEyeSlash } from "react-icons/fa";
import { getFluidFontSize } from "@/utils";
import { FiZap } from "react-icons/fi";
import { GiTurtle } from "react-icons/gi";
import { FaBicycle, FaCar, FaCode } from "react-icons/fa";
import { styles } from "@/configs/checker";
import { useDevice } from '@/hooks/useDevice';
import { useTranslation } from "next-i18next";

const DetailButton = ({ isOpen, onToggle, onShare }) => {
  const {t} = useTranslation();
  return (
    <ButtonGroup size="sm" isAttached variant="outline">
      <Button
        onClick={onToggle}
        leftIcon={isOpen ? <FaEyeSlash /> : <FaEye />}
        variant="ghost"
        colorScheme="blue"
      >
        {t('tool.details', 'Details')}
      </Button>
      <Button
        onClick={onShare}
        leftIcon={<FaShare />}
        variant="ghost"
        colorScheme="blue"
      >
        {t('tool.share', 'Share')}
      </Button>
    </ButtonGroup>
  );
};

export default function RedirectResultList({ results }) {
  const {t} = useTranslation();
  const { isMobile } = useDevice();
  const arrowColor = useColorModeValue("gray.300", "gray.600");
  const toast = useToast();
  const [showDetails, setShowDetails] = useState({});

  // Find the fastest result (only for 30x redirects)
  const fastestResult = results.reduce((fastest, current) => {
    const currentTime = current.totalTime;
    const fastestTime = fastest ? fastest.totalTime : Infinity;
    const isValidRedirect = !current.error_msg && current.statusCode >= 300 && current.statusCode < 400;
    return currentTime < fastestTime && isValidRedirect ? current : fastest;
  }, null);

  const handleOpenUrl = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShare = (urls) => {
    const urlString = Array.isArray(urls) ? urls.join(',') : urls;
    const shareUrl = `${window.location.origin}${window.location.pathname}?url=${encodeURIComponent(urlString)}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        toast({
          title: t('tool.share-url-copied', 'Share URL copied!'),
          description: t('tool.share-url-copied-description', 'The result URL has been copied to your clipboard.'),
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

  const handleShareResult = (url) => handleShare(url);
  const handleShareAllResults = () => handleShare(results.map(result => result.url));

  return (
    <VStack spacing={6} align="stretch">
      <Flex justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
        <Heading as="h2" size={isMobile ? "lg" : "xl"}>
          {t('tool.analysis-results', 'Analysis Results')}
        </Heading>
        <Button
          leftIcon={<FaShareAlt />}
          onClick={handleShareAllResults}
          variant="outline"
          colorScheme="blue"
          size={isMobile ? "sm" : "md"}
        >
          {t('tool.share-all', 'Share All')}
        </Button>
      </Flex>
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
                    <FaBolt /> {t('tool.fastest', 'Fastest')}
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
              </Flex>
              <VStack align="flex-start" spacing={isMobile ? 2 : 4} width="100%">
                <Flex alignItems="center" width="100%">
                  <Icon as={FaArrowRight} color={arrowColor} boxSize={isMobile ? 3 : 4} mr={isMobile ? 2 : 4} />
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
                </Flex>
                {(!result.error_msg && !isMobile) && (
                  <DetailButton
                    isOpen={showDetails[index]}
                    onToggle={() => setShowDetails(prevState => ({ ...prevState, [index]: !prevState[index] }))}
                    onShare={() => handleShareResult(result.url)}
                  />
                )}
              </VStack>
            </VStack>
            <HStack spacing={isMobile ? 2 : 4} justifyContent={isMobile ? "space-between" : "flex-end"} flexWrap="wrap">
              <StatItem
                label={t('tool.redirect-status', 'Status')}
                value={result.statusCode || "N/A"}
                icon={<Icon as={FaCode} color={result.error_msg ? "red.500" : "purple.500"} boxSize={isMobile ? 6 : 8} />}
                isMobile={isMobile}
              />
              <StatItem
                label={t('tool.redirects-count', 'Redirects')}
                value={result.chainNumber}
                icon={getRedirectIcon(result.chainNumber, isMobile)}
                isMobile={isMobile}
              />
              <StatItem
                label={t('tool.response-time', 'Response')}
                value={result.error_msg ? "N/A" : `${result.totalTime.toFixed(2)}s`}
                icon={getResponseIcon(result.totalTime * 1000, isMobile)}
                isMobile={isMobile}
              />
            </HStack>
                {(!result.error_msg && isMobile) && (
                  <DetailButton
                    isOpen={showDetails[index]}
                    onToggle={() => setShowDetails(prevState => ({ ...prevState, [index]: !prevState[index] }))}
                    onShare={() => handleShareResult(result.url)}
                  />
                )}
          </Flex>
          {!result.error_msg && showDetails[index] && (
            <Box mt={4} overflowX="auto">
              <Table variant="simple" size="sm" style={{ minWidth: '800px' }}>
                <Thead>
                  <Tr>
                    <Th>{t('tool.redirect-step', 'Step')}</Th>
                    <Th>{t('tool.redirect-url', 'URL')}</Th>
                    <Th>{t('tool.redirect-status', 'Status')}</Th>
                    <Th>{t('tool.redirect-time', 'Time')}</Th>
                    <Th>{t('tool.redirect-details', 'Details')}</Th>
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
                                {t('tool.redirect-view-details', 'View Details')}
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