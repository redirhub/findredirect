import { Box, Heading, Text, Link, Image, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import NextLink from "next/link";
import { urlFor } from "@/sanity/lib/image";

const MotionBox = motion(Box);
const MotionImage = motion(Image);

export default function PostCard({ post }) {
  const { title, excerpt, slug, publishedAt, image, author } = post;

  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  const imageUrl = image
    ? urlFor(image).width(800).height(600).url()
    : "/images/placeholder.jpg";

  return (
    <Box
      display="flex"
      alignItems="start"
      justifyContent="center"
      py={{ base: 4, md: 8 }}
      my={4}
    >
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        w="100%"
      >
        <Flex
          direction={{ base: "column" }}
          gap={{ base: 6, lg: 8 }}
          align={"start"}
        >
          <Box flex="1">
            <Box alignSelf="flex-start">
              <Text fontSize="sm" color="gray.600" mb={4} fontWeight="500">
                {formattedDate}
              </Text>

              <Heading
                as="h2"
                fontSize={{ base: "22px", md: "26px", "2xl": "30px" }}
                fontWeight="bold"
                lineHeight="1.2"
                mb={6}
                color="gray.900"
                minH={{ base: "0px", md: "60px", xl: "68px" }}
                noOfLines={2}
              >
                {title}
              </Heading>
            </Box>

            <MotionBox
              flex="1"
              position="relative"
              w="100%"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <NextLink href={`/posts/${slug.current}`} passHref legacyBehavior>
                <Link>
                  <Box
                    position="relative"
                    borderRadius="12px"
                    overflow="hidden"
                    boxShadow="0 20px 60px rgba(0, 0, 0, 0.15)"
                    cursor="pointer"
                  >
                    <Image
                      src={imageUrl}
                      alt={title}
                      w="100%"
                      h="auto"
                      minH={"290px"}
                      maxH={"290px"}
                      objectFit="cover"
                    />
                  </Box>
                </Link>
              </NextLink>
            </MotionBox>

            {excerpt && (
              <Text
                fontSize={{ base: "md", md: "lg" }}
                color="gray.700"
                mb={8}
                noOfLines={3}
                lineHeight="1.6"
                pt={5}
              >
                {excerpt}
              </Text>
            )}

            <MotionBox
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
              alignSelf="flex-end"
            >
              <NextLink href={`/posts/${slug.current}`} passHref legacyBehavior>
                <Link
                  display="inline-flex"
                  alignItems="center"
                  gap={2}
                  fontSize="md"
                  fontWeight="600"
                  color="gray.900"
                  textDecoration="underline"
                  textUnderlineOffset="4px"
                  _hover={{
                    color: "#7D65DB",
                  }}
                >
                  <FiArrowRight />
                  Read Article
                </Link>
              </NextLink>
            </MotionBox>
          </Box>
        </Flex>
      </MotionBox>
    </Box>
  );
}

