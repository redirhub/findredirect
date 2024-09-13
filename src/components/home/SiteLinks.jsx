import { HStack, Button, Tooltip } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { FaExternalLinkAlt, FaInfoCircle } from "react-icons/fa";
import { getFluidFontSize } from "@/utils";

export default function SiteLinks({ url, token, official }) {
  return (
    <HStack spacing={2}>
      <Tooltip label="View full details" placement="top">
        <Button
          as={Link}
          href={`https://updown.io/${token}`}
          target="_blank"
          size="sm"
          colorScheme="blue"
          leftIcon={<FaInfoCircle />}
          variant="ghost"
          fontWeight="normal"
          fontSize={getFluidFontSize(14, 16)}
        >
          Details
        </Button>
      </Tooltip>
      <Tooltip label="Visit official website" placement="top">
        <Button
          as={Link}
          href={official}
          target="_blank"
          size="sm"
          colorScheme="green"
          leftIcon={<FaExternalLinkAlt />}
          variant="ghost"
          fontWeight="normal"
          fontSize={getFluidFontSize(14, 16)}
        >
          Website
        </Button>
      </Tooltip>
    </HStack>
  );
};