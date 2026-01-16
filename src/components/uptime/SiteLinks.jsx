import { HStack, Button, Tooltip } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { FaExternalLinkAlt, FaInfoCircle } from "react-icons/fa";
import { getFluidFontSize } from "@/utils";
import { useTranslation } from "next-i18next";

export default function SiteLinks({ url, token, official }) {
  const {t} = useTranslation();

  return (
    <HStack spacing={2}>
      <Tooltip label="View full details" placement="top">
        <Button
          as={Link}
          href={`https://updown.io/${token}`}
          rel="nofollow"
          target="_blank"
          size={{ base: "xs", sm: "sm" }}
          colorScheme="blue"
          leftIcon={<FaInfoCircle />}
          variant="ghost"
          fontWeight="normal"
          fontSize={{ base: "xs", sm: getFluidFontSize(14, 16) }}
        >
          {t('tool.details', 'Details')}
        </Button>
      </Tooltip>
      <Tooltip label="Visit official website" placement="top">
        <Button
          as={Link}
          href={official}
          target="_blank"
          rel="nofollow"
          size={{ base: "xs", sm: "sm" }}
          colorScheme="green"
          leftIcon={<FaExternalLinkAlt />}
          variant="ghost"
          fontWeight="normal"
          fontSize={{ base: "xs", sm: getFluidFontSize(14, 16) }}
        >
          {t('tool.website', 'Website')}
        </Button>
      </Tooltip>
    </HStack>
  );
};