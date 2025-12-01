import { Box, Image, Heading, Text, useColorModeValue, Badge, Stack } from "@chakra-ui/react";

export default function BlogCard({ title, body, image, id, tags, onClick }) {
    const cardBg = useColorModeValue("white", "gray.800");
    const cardBorder = useColorModeValue("gray.200", "gray.700");
    const titleColor = useColorModeValue("gray.800", "white");
    const bodyColor = useColorModeValue("gray.600", "gray.300");

    return (
        <Box
            bg={cardBg}
            borderWidth="1px"
            borderColor={cardBorder}
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            transition="all 0.3s"
            _hover={{
                transform: "translateY(-4px)",
                boxShadow: "xl",
                cursor: "pointer",
            }}
            height="100%"
            display="flex"
            flexDirection="column"
            onClick={onClick}
        >
            <Image
                src={image}
                alt={title}
                objectFit="cover"
                height="200px"
                width="100%"
                fallbackSrc={`https://via.placeholder.com/600x200/9333ea/ffffff?text=Post+${id}`}
            />
            <Box p={6} flex="1" display="flex" flexDirection="column">
                <Stack direction="row" mb={3} flexWrap="wrap" spacing={2}>
                    {tags?.slice(0, 3).map((tag) => (
                        <Badge key={tag} colorScheme="purple" variant="subtle" borderRadius="full" px={2}>
                            {tag}
                        </Badge>
                    ))}
                </Stack>
                <Heading
                    as="h3"
                    size="md"
                    mb={3}
                    color={titleColor}
                    noOfLines={2}
                    fontWeight="700"
                >
                    {title}
                </Heading>
                <Text color={bodyColor} noOfLines={3} flex="1" fontSize="sm">
                    {body}
                </Text>
                <Text
                    mt={4}
                    fontSize="xs"
                    color={useColorModeValue("purple.600", "purple.300")}
                    fontWeight="600"
                >
                    Read More →
                </Text>
            </Box>
        </Box>
    );
}
