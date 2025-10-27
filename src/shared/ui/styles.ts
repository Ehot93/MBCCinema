// Переиспользуемые стили для компонентов

export const commonStyles = {
    button: {
        backButton: {
            variant: "ghost" as const,
            color: "white",
            mb: { base: "4", md: "6" },
            _hover: { bg: "gray.800" },
        },
        sessionButton: {
            borderColor: "white",
            borderWidth: "1px",
            bg: "transparent",
            color: "white",
            px: { base: "2", md: "3" },
            py: { base: "1", md: "2" },
            fontSize: { base: "xs", md: "sm" },
            _hover: { bg: "white", color: "black" },
        },
    },
    box: {
        posterContainer: {
            bg: "gray.800",
            borderRadius: "lg",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            overflow: "hidden",
            w: { base: "100%", md: "300px" },
            h: { base: "300px", md: "400px" },
        },
    },
    text: {
        characteristicLabel: {
            color: "gray.400",
            fontSize: { base: "xs", md: "sm" },
        },
        characteristicValue: {
            fontSize: { base: "md", md: "lg" },
        },
        sectionLabel: {
            fontSize: { base: "md", md: "lg" },
            fontWeight: "600",
        },
    },
    vstack: {
        filmDetails: {
            align: "stretch",
            gap: { base: "4", md: "6" },
        },
        filmInfo: {
            align: "stretch",
            gap: "2",
        },
        characteristics: {
            align: "stretch",
            gap: "2",
        },
    },
    hstack: {
        characteristics: {
            gap: { base: "4", md: "8" },
        },
        sessionTimes: {
            gap: "2",
            flexWrap: "wrap",
        },
    },
    stack: {
        mainContent: {
            direction: { base: "column" as const, md: "row" as const },
            gap: { base: "4", md: "8" },
            align: { base: "stretch" as const, md: "flex-start" as const },
        },
    },
};
