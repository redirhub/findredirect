import { Box, Flex, HStack, Skeleton, Stack } from "@chakra-ui/react";
import { getFluidFontSize } from "@/utils";

const styles = {
  card: {
    transition: "all 0.3s ease",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    bg: "gray.50",
    borderRadius: "md",
    p: 4,
    minWidth: "120px",
  },
};

export default function CardListSkeleton() {
  return (
    <Stack spacing={4} width="100%">
      {[...Array(3)].map((_, index) => (
        <Box
          key={`skeleton-${index}`}
          {...styles.card}
          bg="white"
          borderRadius="xl"
          p={6}
          boxShadow="md"
          border="1px solid"
          borderColor="gray.100"
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
}
