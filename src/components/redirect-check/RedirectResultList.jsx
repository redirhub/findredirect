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
} from "@chakra-ui/react";
import { FaLink, FaClock, FaServer, FaChevronRight, FaBolt } from "react-icons/fa";
import { getFluidFontSize } from "@/utils";

export default function RedirectResultList({ results }) {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <VStack spacing={6} align="stretch">
      <Heading as="h2" size="xl" mb={4}>
        Redirect Analysis Results
      </Heading>
      {results.map((result) => (
        <Box
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
                <Heading as="h4" fontSize={getFluidFontSize(20, 24)} fontWeight="600">
                  {result.url}
                </Heading>
                <Badge colorScheme={result.chain[result.chain.length - 1].succeed ? "green" : "red"} fontSize="md" borderRadius="full" px={3} py={1}>
                  {result.statusCode}
                </Badge>
              </Flex>
              <Text fontSize="sm" color="gray.500">
                {result.chainNumber} redirect{result.chainNumber !== 1 ? "s" : ""}
              </Text>
              <Text fontSize="sm">
                Final URL: {result.chain[result.chain.length - 1].url}
              </Text>
            </VStack>
            <HStack spacing={4} justifyContent="flex-end" flexWrap="wrap">
              <StatItem
                label="Total Time"
                value={`${result.chain.reduce((sum, r) => sum + r.alltime, 0).toFixed(2)}s`}
                icon={<Icon as={FaClock} color="blue.500" boxSize={8} />}
              />
              <StatItem
                label="Redirects"
                value={result.chainNumber}
                icon={<Icon as={FaBolt} color="orange.500" boxSize={8} />}
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
                                  <Flex>
                                    <Icon as={FaClock} mr={2} />
                                    <Text fontWeight="bold">SSL Verify Result:</Text>
                                    <Text ml={2}>
                                      {redirect.ssl_verify_result ? "Success" : "Failed"}
                                    </Text>
                                  </Flex>
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

const StatItem = ({ label, value, icon }) => (
  <Tooltip label={label} placement="top">
    <VStack spacing={1} align="center">
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