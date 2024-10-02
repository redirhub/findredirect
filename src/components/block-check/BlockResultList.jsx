import React from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  Badge,
  Flex,
  Icon,
  Tooltip,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  useBreakpointValue,
  Divider,
  Button,
} from "@chakra-ui/react";
import { FaCheckCircle, FaTimesCircle, FaExternalLinkAlt } from "react-icons/fa";

export default function BlockResultList({ results }) {
  const color = useColorModeValue("blue.500", "blue.300");
  const hoverColor = useColorModeValue("blue.600", "blue.400");
  const bgColor = useColorModeValue("gray.100", "gray.700"); // Store the value in a variable

  return (
    <VStack spacing={6} align="stretch">
      <Heading as="h2" size="xl" mb={4} textAlign="center">
        Block Check Results
      </Heading>
      <Box
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        overflow="hidden"
        bg={useColorModeValue("white", "gray.800")}
      >
        <Table variant="striped" colorScheme="gray" size={useBreakpointValue({ base: "sm", md: "md" })}>
          <Thead>
            <Tr>
              <Th fontWeight="bold" fontSize="lg">Domain</Th>
              <Th fontWeight="bold" fontSize="lg">HTTP Pass</Th>
              <Th fontWeight="bold" fontSize="lg">HTTPS Pass</Th>
              <Th fontWeight="bold" fontSize="lg">Total Time (s)</Th>
            </Tr>
          </Thead>
          <Tbody>
            {results.map((result, index) => (
              <Tr key={`${result.url}-${index}`} 
                  _hover={{ bg: bgColor, boxShadow: "lg" }} // Added hover effect
                  transition="background 0.3s ease, transform 0.3s ease" // Smooth transition
              >
                <Td>
                  <Flex alignItems="center" justifyContent="space-between"> 
                    <Text fontWeight="medium" fontSize="md">{result.url}</Text>
                    <Tooltip label="Open URL in new tab">
                      <Icon
                        as={FaExternalLinkAlt}
                        cursor="pointer"
                        ml={2}
                        boxSize={4}
                        color={color}
                        onClick={() => window.open('http://' + result.url, '_blank')}
                      />
                    </Tooltip>
                  </Flex>
                </Td>
                <Td>
                    <Icon 
                    as={result.http_pass ? FaCheckCircle : FaTimesCircle} 
                    size={'lg'}
                    mr={2}
                    color={result.http_pass ? "green.500" : "red.500"}
                    />
                    <span>{result.http_pass ? "Yes" : "No"}</span>
                </Td>
                <Td>
                    <Icon 
                    as={result.https_pass ? FaCheckCircle : FaTimesCircle} 
                    size={'lg'}
                    mr={2}
                    color={result.https_pass ? "green.500" : "red.500"}
                    />
                    <span>{result.https_pass ? "Yes" : "No"}</span>
                </Td>
                <Td>
                  <Text fontWeight="medium">{(result.total_time / 1000).toFixed(2)} s</Text>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Divider />
    </VStack>
  );
}