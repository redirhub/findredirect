import { Box, Flex, Heading, Text, Avatar, Link as ChakraLink } from "@chakra-ui/react";
import { FaLinkedin } from "react-icons/fa";
import { urlFor } from "@/sanity/lib/image";

export default function AuthorBox({ author }) {
  if (!author) return null;

  const avatarUrl = author.image
    ? urlFor(author.image).width(200).height(200).url()
    : null;

  return (
    <Box
      bg="linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)"
      borderRadius="xl"
      p={{ base: 6, md: 8 }}
      my={10}
    >
      <Flex gap={6} align="start" direction={{ base: "column", sm: "row" }}>
        {/* Avatar */}
        <Avatar
          size="xl"
          name={author.name}
          src={avatarUrl}
          border="4px solid white"
          boxShadow="md"
          flexShrink={0}
        />

        {/* Author Info */}
        <Box flex="1">
          <Flex justify="space-between" align="start" mb={2}>
            <Box>
              <Heading
                as="h3"
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="700"
                color="gray.900"
                mb={1}
              >
                {author.name}
              </Heading>
              {author.title && (
                <Text
                  fontSize={{ base: "md", md: "lg" }}
                  color="gray.600"
                  fontWeight="500"
                >
                  {author.title}
                </Text>
              )}
            </Box>

            {/* LinkedIn Icon */}
            {author.linkedin && (
              <ChakraLink
                href={author.linkedin}
                isExternal
                display="flex"
                alignItems="center"
                justifyContent="center"
                w="40px"
                h="40px"
                borderRadius="md"
                border="1px solid"
                borderColor="gray.300"
                bg="white"
                color="gray.700"
                _hover={{
                  bg: "#0077B5",
                  borderColor: "#0077B5",
                  color: "white",
                }}
                transition="all 0.2s"
              >
                <FaLinkedin size={20} />
              </ChakraLink>
            )}
          </Flex>

          {/* Bio */}
          {author.bio && (
            <Text
              fontSize={{ base: "sm", md: "md" }}
              color="gray.700"
              lineHeight="1.7"
              mt={3}
            >
              {author.bio}
            </Text>
          )}
        </Box>
      </Flex>
    </Box>
  );
}
