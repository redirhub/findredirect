import { HStack, Button } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { FaExternalLinkAlt } from "react-icons/fa";

export default function SiteLinks({ url, token, official }) {
  return (
    <HStack spacing={2}>
      <Button
        as={Link}
        href={url}
        size="sm"
        variant="outline"
        rightIcon={<FaExternalLinkAlt />}
        target="_blank"
        rel="noopener noreferrer"
      >
        Visit
      </Button>
      {official && (
        <Button
          as={Link}
          href={official}
          size="sm"
          variant="outline"
          rightIcon={<FaExternalLinkAlt />}
          target="_blank"
          rel="noopener noreferrer"
        >
          Official
        </Button>
      )}
    </HStack>
  );
}