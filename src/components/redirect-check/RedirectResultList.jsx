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
} from "@chakra-ui/react";
import { FaLink, FaClock, FaServer, FaChevronRight, FaBolt, FaCheckCircle, FaSmile, FaSadTear, FaArrowDown } from "react-icons/fa";
import { getFluidFontSize } from "@/utils";
import { FiZap } from "react-icons/fi";
import { GiTurtle } from "react-icons/gi";
import { FaBicycle, FaCar, FaCode } from "react-icons/fa";
import { styles } from "@/configs/checker";

export default function RedirectResultList({ results }) {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const arrowColor = useColorModeValue("gray.300", "gray.600");

  // Find the fastest result
  const fastestResult = results.reduce((fastest, current) => {
    const currentTime = current.totalTime;
    const fastestTime = fastest ? fastest.totalTime : Infinity;
    return currentTime < fastestTime ? current : fastest;
  }, null);

  return (
    <VStack spacing={6} align="stretch">
      <Heading as="h2" size="xl" mb={4}>
        Redirect Analysis Results
      </Heading>
      {results.map((result) => (
        <Box
          {...styles.card}
          key={result.url}
          bg={bgColor}
          borderRadius="xl"
          boxShadow="md"
          p={6}
          borderWidth={1}
          borderColor={borderColor}
        >
          <Flex direction={{ base: "column", md: "row" }} justifyContent="space-between" alignItems="stretch" gap={6}>
            <VStack align="flex-start" spacing={4} flex={1}>
              <Flex alignItems="center" gap={2} flexWrap="wrap">
                <Tooltip label={result.url} placement="top">
                  <Heading as="h4" fontSize={getFluidFontSize(20, 24)} fontWeight="600" isTruncated maxWidth="100%">
                    {truncateUrl(result.url, 30)}
                  </Heading>
                </Tooltip>
                <Badge colorScheme={result.chain[result.chain.length - 1].succeed ? "green" : "red"} {...styles.statusBadge}>
                  {result.statusCode}
                </Badge>
                {getProviderBadge(result.chain[0].header)}
                {result === fastestResult && results.length > 1 && (
                  <Badge {...styles.fastestBadge}>
                    <FaBolt /> Fastest
                  </Badge>
                )}
              </Flex>
              <Flex alignItems="center" width="100%">
                <Icon as={FaArrowDown} color={arrowColor} boxSize={4} mx={4} />
              </Flex>
              <Tooltip label={result.chain[result.chain.length - 1].url} placement="top">
                <Text fontSize={getFluidFontSize(16, 17)} fontWeight="500" isTruncated maxWidth="100%">
                  {truncateUrl(result.chain[result.chain.length - 1].url, 40)}
                </Text>
              </Tooltip>
            </VStack>
            <HStack spacing={4} justifyContent="flex-end" flexWrap="wrap">
              <StatItem
                label="Redirects"
                value={result.chainNumber}
                icon={getRedirectIcon(result.chainNumber)}
              />
              <StatItem
                label="Status"
                value={result.statusCode}
                icon={<Icon as={FaCode} color="purple.500" boxSize={8} />}
              />
              <StatItem
                label="Response"
                value={`${result.totalTime.toFixed(2)}s`}
                icon={getResponseIcon(result.totalTime * 1000)}
              />
            </HStack>
          </Flex>
          <Accordion allowToggle mt={4}>
            <AccordionItem border="none">
              <AccordionButton px={0} _hover={{ bg: "transparent" }}>
                <Text color="blue.500" fontWeight="medium">
                  Show Details
                </Text>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4} px={0}>
                <Table variant="simple" size="sm">
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
                    {result.chain.map((redirect, index) => (
                      <Tr key={index}>
                        <Td>{index + 1}</Td>
                        <Td>
                          <Text fontSize="sm" fontWeight="medium">
                            {redirect.url}
                          </Text>
                        </Td>
                        <Td>
                          <Badge
                            colorScheme={redirect.succeed ? "green" : "red"}
                            borderRadius="full"
                            px={2}
                            py={1}
                          >
                            {redirect.http_code}
                          </Badge>
                        </Td>
                        <Td>{redirect.alltime.toFixed(2)}s</Td>
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
                                    <Text ml={2}>{redirect.ip}</Text>
                                  </Flex>
                                  <Flex>
                                    <Icon as={FaLink} mr={2} />
                                    <Text fontWeight="bold">Scheme:</Text>
                                    <Text ml={2}>{redirect.scheme}</Text>
                                  </Flex>
                                  {redirect.scheme.toLowerCase() === 'https' && (
                                    <Flex>
                                      <Icon as={FaClock} mr={2} />
                                      <Text fontWeight="bold">SSL Verify Result:</Text>
                                      <Text ml={2}>
                                        {redirect.ssl_verify_result ? "Success" : "Failed"}
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
                                      borderRadius="md"
                                      overflowX="auto"
                                    >
                                      {JSON.stringify(redirect.header, null, 2)}
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
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
      ))}
    </VStack>
  );
}

const getResponseIcon = (responseTime) => {
  if (responseTime <= 150) {
    return <Icon as={FiZap} color="green.500" boxSize={8} />;
  } else if (responseTime <= 300) {
    return <Icon as={FaCar} color="blue.500" boxSize={8} />;
  } else if (responseTime <= 500) {
    return <Icon as={FaBicycle} color="orange.500" boxSize={8} />;
  } else {
    return <Icon as={GiTurtle} color="red.500" boxSize={8} />;
  }
};

const getRedirectIcon = (chainNumber) => {
  if (chainNumber === 0) {
    return <Icon as={FaCheckCircle} color="green.500" boxSize={8} />;
  } else if (chainNumber <= 2) {
    return <Icon as={FaSmile} color="yellow.500" boxSize={8} />;
  } else {
    return <Icon as={FaSadTear} color="red.500" boxSize={8} />;
  }
};

const StatItem = ({ label, value, icon }) => (
  <Tooltip label={label} placement="top">
    <VStack spacing={1} align="center" {...styles.statItem}>
      {React.cloneElement(icon, { size: 32 })}
      <Text fontWeight="bold" fontSize={getFluidFontSize(22, 26)}>
        {value}
      </Text>
      <Text color="gray.500" fontSize={getFluidFontSize(14, 16)}>
        {label}
      </Text>
    </VStack>
  </Tooltip>
);

// Helper function to truncate URLs
function truncateUrl(url, maxLength) {
  if (url.length <= maxLength) return url;
  const start = url.substring(0, maxLength / 2 - 2);
  const end = url.substring(url.length - maxLength / 2 + 2);
  return `${start}...${end}`;
}

// New function to get the provider badge
const getProviderBadge = (headers) => {
  const poweredBy = headers['x-powered-by'] || headers['X-Powered-By'];
  if (poweredBy) {
    return (
      <Badge colorScheme="blue" {...styles.providerBadge}>
        {poweredBy}
      </Badge>
    );
  }
  return null;
};