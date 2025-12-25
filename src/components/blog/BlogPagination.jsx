import { Flex, HStack, Button } from "@chakra-ui/react";
import { useBlogPagination } from "@/hooks/useBlogPagination";
import { useTranslation } from "next-i18next";

export default function BlogPagination({ currentPage, totalPages }) {
  const { t } = useTranslation();
  const { visiblePages, handlePageChange } = useBlogPagination(currentPage, totalPages);

  if (totalPages <= 1) return null;

  return (
    <Flex justify="center" mt={10} mb={12}>
      <HStack spacing={3}>
        <Button
          size="sm"
          rounded="lg"
          onClick={() => handlePageChange(currentPage - 1)}
          isDisabled={currentPage === 1}
          variant="outline"
          _hover={currentPage === 1 ? {} : { bg: "#d2e1f0", color: "#1d6db6" }}
        >
          {t('blog.previous', 'Previous')}
        </Button>

        {visiblePages.map((page) => {
          const isActive = page === currentPage;
          return (
            <Button
              key={`page-${page}`}
              size="sm"
              rounded="lg"
              bg={isActive ? "#d2e1f0" : "transparent"}
              _hover={isActive ? { bg: "#d2e1f0" } : { bg: "gray.100" }}
              boxShadow={isActive ? "0 2px 8px rgba(210, 225, 240, 0.3)" : "none"}
              textColor="#1d6db6"
              variant="solid"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          );
        })}

        <Button
          size="sm"
          rounded="lg"
          onClick={() => handlePageChange(currentPage + 1)}
          isDisabled={currentPage === totalPages}
          variant="outline"
          _hover={currentPage === totalPages ? {} : { bg: "#d2e1f0", color: "#1d6db6" }}
        >
          {t('blog.next', 'Next')}
        </Button>
      </HStack>
    </Flex>
  );
}
