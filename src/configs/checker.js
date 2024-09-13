
// Extracted styles to a separate object
export const styles = {
    card: {
        transition: "all 0.3s ease",
        _hover: {
            boxShadow: "xl",
            transform: "translateY(-2px)",
        },
    },
    statusBadge: {
        display: "flex",
        alignItems: "center",
        fontSize: "md",
        gap: 2,
        px: 3,
        py: 1,
        borderRadius: "full",
        fontWeight: "medium",
    },
    providerBadge: {
        fontSize: "sm",
        gap: 2,
        px: 3,
        py: 1,
        borderRadius: "full",
        fontWeight: "medium",
        textTransform: "uppercase",
    },
    fastestBadge: {
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 2,
        py: 1,
        borderRadius: "full",
        bg: "yellow.100",
        color: "yellow.800",
        fontWeight: "medium",
        fontSize: "sm",
    },
    statItem: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bg: "gray.50",
        borderRadius: "md",
        p: 4, // Increased padding
        minWidth: "120px", // Increased minimum width
    },
};