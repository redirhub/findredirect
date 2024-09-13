import { Text, useColorModeValue } from "@chakra-ui/react";
import { getFluidFontSize, getFormattedTimeDiff } from "@/utils";

export default function SiteLastCheck({ lastCheckAt, token }) {
  const textColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Text color={textColor} fontSize={getFluidFontSize(14, 16)}>
      Last check: {getFormattedTimeDiff(lastCheckAt)}
    </Text>
  );
}