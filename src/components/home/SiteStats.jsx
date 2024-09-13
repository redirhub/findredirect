import { HStack, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { FaClock, FaArrowUp } from "react-icons/fa";
import { getFluidFontSize } from "@/utils";

export default function SiteStats({ uptime, timings, token }) {
  const statItemBgColor = useColorModeValue("gray.50", "gray.700");

  const statItemStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    bg: statItemBgColor,
    borderRadius: "md",
    p: 4,
    minWidth: "120px",
  };

  return (
    <HStack spacing={4} justifyContent="flex-end" flexWrap="wrap">
      <Stack {...statItemStyle}>
        <FaClock size={24} />
        <Text fontSize={getFluidFontSize(22, 26)} fontWeight="bold">
          {timings.total.toFixed(2)}
        </Text>
        <Text fontSize={getFluidFontSize(14, 16)}>ms</Text>
      </Stack>
      <Stack {...statItemStyle}>
        <FaArrowUp size={24} />
        <Text fontSize={getFluidFontSize(22, 26)} fontWeight="bold">
          {uptime.toFixed(2)}%
        </Text>
        <Text fontSize={getFluidFontSize(14, 16)}>Uptime</Text>
      </Stack>
    </HStack>
  );
}