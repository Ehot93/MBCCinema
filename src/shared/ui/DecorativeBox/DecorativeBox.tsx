import { Box, BoxProps } from "@chakra-ui/react";

interface DecorativeBoxProps extends Omit<BoxProps, "bg"> {
    children?: React.ReactNode;
}

export function DecorativeBox({ children, ...props }: DecorativeBoxProps) {
    return (
        <Box
            bg="gray.800"
            borderWidth="1px"
            borderColor="gray.700"
            position="absolute"
            inset="0"
            display="flex"
            alignItems="center"
            justifyContent="center"
            {...props}
        >
            {children}
        </Box>
    );
}
