import { Box, Heading, Text, Link, Image, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { useTranslation } from "next-i18next";

const MotionBox = motion(Box);
const MotionImage = motion(Image);

export default function ArticleCard({
  date,
  title,
  authorName,
  authorImage,
  description,
  mainImage,
  link = "#",
  hasOverlay = false,
  overlayText,
  showBadge = false,
}) {
  const { t } = useTranslation();
  const defaultOverlayText = t('blog.read-now', 'read now');

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
                {date}
              </Text>

              <Heading
                as="h1"
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
              <Box
                position="relative"
                borderRadius="12px"
                overflow="hidden"
                boxShadow="0 20px 60px rgba(0, 0, 0, 0.15)"
                cursor="pointer"
                _hover={{
                  "& .read-now-btn": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                <Image
                  src={mainImage}
                  alt={title}
                  w="100%"
                  h="auto"
                  minH={"290px"}
                  maxH={"290px"}
                  objectFit="cover"
                />

                {hasOverlay && (
                  <MotionBox
                    className="read-now-btn"
                    position="absolute"
                    bottom={{ base: "20px", md: "40px" }}
                    right={{ base: "20px", md: "40px" }}
                    bg="black"
                    color="white"
                    px={{ base: 4, md: 6 }}
                    py={{ base: 2, md: 3 }}
                    borderRadius="full"
                    fontSize={{ base: "xs", md: "sm" }}
                    fontWeight="600"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {overlayText || defaultOverlayText}
                  </MotionBox>
                )}

                {showBadge && (
                  <MotionBox
                    position="absolute"
                    top={{ base: "15px", md: "20px" }}
                    right={{ base: "15px", md: "20px" }}
                    bg="rgba(255, 255, 255, 0.9)"
                    borderRadius="full"
                    p={2}
                    boxSize={{ base: "50px", md: "60px" }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Box
                      bg="red.500"
                      borderRadius="full"
                      boxSize={{ base: "38px", md: "45px" }}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontSize={{ base: "2xs", md: "xs" }}
                      fontWeight="bold"
                      color="white"
                    >
                      🏆
                    </Box>
                  </MotionBox>
                )}
              </Box>
            </MotionBox>

            <Text
              fontSize={{ base: "md", md: "lg" }}
              color="gray.700"
              mb={8}
              noOfLines={3}
              lineHeight="1.6"
              pt={5}
            >
              {description}
            </Text>

            <MotionBox
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
              alignSelf="flex-end"
            >
              <Link
                href={link}
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
                {t('blog.read-article', 'Read Article')}
              </Link>
            </MotionBox>
          </Box>
        </Flex>
      </MotionBox>
    </Box>
  );
}
