import { Box, Heading, Text, Link, Image, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

const MotionBox = motion(Box);

export default function PonponManiaCard({
  reverse = false,
  title = "Ponpon Mania: A comic that breathes Through web interaction",
  date = "Nov 26, 2025",
  description = `"What if we do a comic that could be animated for the web ?" Ponpon Mania began with that question...`,
  articleLink = "#",
  image = "/images/Ponpon Mania.jpg",
}) {
  return (
    <Box
      bg="#f5f5f5"
      display="flex"
      alignItems="center"
      justifyContent="center"
      paddingX={6}
      py={{ base: 12, lg: 20 }}
      my={4}
    >
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        w="100%"
      >
        <Flex
          direction={{ base: "column", lg: reverse ? "row-reverse" : "row" }}
          gap={8}
          align="center"
          justify="space-evenly"
        >
          <Box flex="1">
            <Text fontSize="sm" color="gray.600" mb={4} fontWeight="500">
              {date}
            </Text>

            <Heading
              as="h1"
              fontSize={{ base: "2xl", md: "3xl", lg: "39px" }}
              fontWeight="bold"
              lineHeight="1.2"
              mb={6}
              color="gray.900"
              noOfLines={2}
            >
              {title}
            </Heading>

            <Text
              fontSize={{ base: "16px", lg: "20px" }}
              color="gray.700"
              mb={8}
              lineHeight="1.6"
            >
              {description}
            </Text>

            <MotionBox whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
              <Link
                href={articleLink}
                display="inline-flex"
                alignItems="center"
                gap={2}
                fontSize="md"
                fontWeight="600"
                color="gray.900"
                textDecoration="underline"
                textUnderlineOffset="4px"
                _hover={{ color: "#7D65DB" }}
              >
                <FiArrowRight />
                Read Article
              </Link>
            </MotionBox>
          </Box>

          <MotionBox
            flex="1"
            position="relative"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              position="relative"
              borderRadius="16px"
              overflow="hidden"
              boxShadow="0 20px 60px rgba(0, 0, 0, 0.15)"
              cursor="pointer"
            >
              <Image
                src={image}
                alt={title}
                w="100%"
                h="auto"
                minH={'380px'}
                maxH={'380px'}
                objectFit="cover"
              />
            </Box>
          </MotionBox>
        </Flex>
      </MotionBox>
    </Box>
  );
}
