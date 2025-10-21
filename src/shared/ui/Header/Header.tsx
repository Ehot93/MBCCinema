import { Box, Flex, Button, HStack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../entities/User";
import { MdLogout } from "react-icons/md";

interface HeaderProps {
    columns?: { label: string; width?: string }[];
}

export function Header({ columns }: HeaderProps) {
    const navigate = useNavigate();
    const { logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <Box>
            {/* Кнопка выхода */}
            <Flex justify="flex-end" p={{ base: "3", md: "4" }} borderBottom="1px" borderColor="gray.700">
                <Button
                    size="sm"
                    variant="ghost"
                    color="white"
                    _hover={{ bg: "gray.700" }}
                    onClick={handleLogout}
                >
                    <MdLogout />
                    Выход
                </Button>
            </Flex>

            {/* Заголовки колонок */}
            {columns && columns.length > 0 && (
                <HStack
                    gap={{ base: "2", md: "20" }}
                    px={{ base: "4", md: "6" }}
                    py={{ base: "3", md: "4" }}
                    pb={{ base: "3", md: "4" }}
                    borderBottom="1px"
                    borderColor="gray.700"
                    display={{ base: "none", md: "flex" }}
                >
                    {columns.map((col, idx) => (
                        <Box key={idx} w={col.width || "100%"} textAlign="center">
                            <Text fontWeight="bold" fontSize="lg">
                                {col.label}
                            </Text>
                        </Box>
                    ))}
                </HStack>
            )}
        </Box>
    );
}
