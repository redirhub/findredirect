import { Box, Flex, HStack, Skeleton, Stack, useColorModeValue } from "@chakra-ui/react";
import { getFluidFontSize } from "@/utils";

const CardListSkeleton = () => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const statItemBgColor = useColorModeValue("gray.50", "gray.700");

  const styles = {
    card: {
      transition: "all 0.3s ease",
    },
    statItem: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      bg: statItemBgColor,
      borderRadius: "md",
      p: 4,
      minWidth: "120px",
    },
  };

  return (
    <Stack spacing={4} width="100%">
      {[...Array(3)].map((_, index) => (
        <Box
          key={`skeleton-${index}`}
          {...styles.card}
          bg={bgColor}
          borderRadius="xl"
          p={6}
          boxShadow="md"
          border="1px solid"
          borderColor={borderColor}
          width="100%"
        >
          <Flex direction={{ base: "column", md: "row" }} justifyContent="space-between" alignItems="stretch" gap={6}>
            <Stack spacing={4} flex={1}>
              <Flex alignItems="center" gap={2}>
                <Skeleton height={getFluidFontSize(20, 24)} width="200px" />
                <Skeleton height="20px" width="60px" borderRadius="full" />
              </Flex>
              <Skeleton height={getFluidFontSize(14, 16)} width="180px" />
              <HStack spacing={2}>
                <Skeleton height="32px" width="80px" borderRadius="md" />
                <Skeleton height="32px" width="80px" borderRadius="md" />
              </HStack>
            </Stack>
            <HStack spacing={4} justifyContent="flex-end" flexWrap="wrap">
              {[...Array(2)].map((_, i) => (
                <Stack key={i} {...styles.statItem}>
                  <Skeleton height="24px" width="24px" borderRadius="full" />
                  <Skeleton height={getFluidFontSize(22, 26)} width="60px" />
                  <Skeleton height={getFluidFontSize(14, 16)} width="40px" />
                </Stack>
              ))}
            </HStack>
          </Flex>
        </Box>
      ))}
    </Stack>
  );
};

export default CardListSkeleton;
