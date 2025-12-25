import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { useBreakpointValue } from "@chakra-ui/react";

export function useBlogPagination(currentPage, totalPages) {
  const router = useRouter();

  const maxPageButtons = useBreakpointValue({
    base: 3,
    sm: 5,
    md: 7,
    lg: 9,
  }) || 5;

  const visiblePages = useMemo(() => {
    if (!maxPageButtons) return [];
    if (totalPages <= maxPageButtons) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }
    const halfWindow = Math.floor((maxPageButtons - 1) / 2);
    let start = Math.max(1, currentPage - halfWindow);
    let end = start + maxPageButtons - 1;
    if (end > totalPages) {
      end = totalPages;
      start = end - maxPageButtons + 1;
    }
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [currentPage, maxPageButtons, totalPages]);

  const handlePageChange = useCallback(
    (page) => {
      const safePage = Math.min(Math.max(page, 1), totalPages);
      const nextQuery = { ...router.query };
      if (safePage === 1) {
        delete nextQuery.page;
      } else {
        nextQuery.page = String(safePage);
      }
      router.push({ pathname: router.pathname, query: nextQuery });
    },
    [router, totalPages]
  );

  return {
    visiblePages,
    handlePageChange,
    maxPageButtons,
  };
}
