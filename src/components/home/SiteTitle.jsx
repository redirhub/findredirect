import { Flex, Heading, Text, Badge, useColorModeValue } from "@chakra-ui/react";
import { FaBolt } from "react-icons/fa";
import { getFluidFontSize } from "@/utils";

export default function SiteTitle({ alias, name, url, isFastest }) {
  const textColor = useColorModeValue("gray.600", "gray.400");
  
  return (
    <Flex alignItems="center" gap={2} flexWrap="wrap">
      <Heading as="h4" fontSize={getFluidFontSize(20, 24)} fontWeight="600">
        {name || alias || url}
      </Heading>
      {name && (alias || url) && (
        <Text color={textColor} fontSize={getFluidFontSize(14, 16)}>
          ({alias || url})
        </Text>
      )}
      {isFastest && (
        <Badge colorScheme="green" display="flex" alignItems="center" gap={1}>
          <FaBolt /> Fastest
        </Badge>
      )}
    </Flex>
  );
}