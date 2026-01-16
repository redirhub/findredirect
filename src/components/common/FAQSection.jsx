import {
  Box,
  Text,
  VStack,
  Button,
  useColorModeValue,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Icon,
  Heading,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { FaQuestionCircle } from "react-icons/fa";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { QUESTION_URL } from "@/configs/constant";

// Styles object
const styles = {
  container: {
    py: 8,
    px: 0,
  },
  subtitle: {
    textAlign: "left",
    mb: 8,
  },
};

export default function FAQSection({
  data,
  title,
  showContactButton = true,
  accentColor = "blue.500",
}) {
  const { t } = useTranslation();

  // Color mode values
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const panelBgColor = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.300");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBgColor = useColorModeValue("gray.50", "gray.700");

  // Default title with i18n support
  const displayTitle =
    title || t("tool.faq-title", "FAQ: Common Questions Answered");

  return (
    <Box {...styles.container}>
      <VStack spacing={8} align="stretch">
        <Heading
          as="p"
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="bold"
          textAlign="left"
          mb={6}
        >
          {displayTitle}
        </Heading>

        {/* Single Column Accordion */}
        <VStack spacing={4} align="stretch" w="full">
          <Accordion allowMultiple allowToggle>
            {data.map((faq, index) => (
              <AccordionItem
                key={index}
                border="1px solid"
                borderColor={borderColor}
                borderRadius="lg"
                mb={4}
                overflow="hidden"
                bg={cardBgColor}
                transition="all 0.3s ease"
                _hover={{
                  boxShadow: "md",
                  borderColor: accentColor,
                }}
              >
                {({ isExpanded }) => (
                  <>
                    <AccordionButton
                      py={4}
                      px={6}
                      _hover={{ bg: hoverBgColor }}
                    >
                      <Heading
                        as="h2"
                        flex="1"
                        textAlign="left"
                        fontSize={{ base: "md", md: "lg" }}
                        fontWeight="semibold"
                      >
                        {faq.question}
                      </Heading>

                      {/* Plus/Minus Icons */}
                      <Icon
                        as={isExpanded ? MinusIcon : AddIcon}
                        fontSize="16px"
                        color={accentColor}
                        transition="all 0.2s"
                      />
                    </AccordionButton>

                    <AccordionPanel
                      pb={6}
                      pt={4}
                      px={6}
                      bg={panelBgColor}
                      borderTop="1px solid"
                      borderColor={borderColor}
                    >
                      <Text
                        fontSize={{ base: "md", md: "lg" }}
                        color={textColor}
                        lineHeight="1.7"
                      >
                        {faq.answer}
                      </Text>
                    </AccordionPanel>
                  </>
                )}
              </AccordionItem>
            ))}
          </Accordion>
        </VStack>

        {/* Optional Contact Button */}
        {showContactButton && (
          <Box mt={8}>
            <Link href={QUESTION_URL} target="_blank">
              <Button colorScheme="blue" leftIcon={<FaQuestionCircle />}>
                {t("tool.faq-contact-button", "Still have questions?")}
              </Button>
            </Link>
          </Box>
        )}
      </VStack>
    </Box>
  );
}
