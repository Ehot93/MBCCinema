import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, VStack, Button, IconButton } from "@chakra-ui/react";
import { MdMenu, MdClose } from "react-icons/md";
import { useAuthStore } from "../../../entities/User";

const baseMenuItems = [
  { label: "Фильмы", path: "/" },
  { label: "Кинотеатры", path: "/cinemas" },
];

const authenticatedMenuItems = [
  { label: "Мои билеты", path: "/tickets" },
  { label: "Выход", path: "/logout", isLogout: true },
];

const unauthenticatedMenuItems = [{ label: "Вход", path: "/login" }];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuthStore();

  const isActive = (path: string) => location.pathname === path;

  const handleNavigate = (path: string, isLogout?: boolean) => {
    if (isLogout) {
      logout();
      navigate("/");
    } else {
      navigate(path);
    }
    setIsOpen(false);
  };

  const menuItems = [
    ...baseMenuItems,
    ...(isAuthenticated ? authenticatedMenuItems : unauthenticatedMenuItems),
  ];

  return (
    <>
      {/* Кнопка меню для мобильных */}
      <Box display={{ base: "block", md: "none" }} p="4" borderBottom="1px" borderColor="gray.700">
        <IconButton
          onClick={() => setIsOpen(!isOpen)}
          variant="ghost"
          color="white"
          _hover={{ bg: "gray.800" }}
          aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
        >
          {isOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
        </IconButton>
      </Box>

      {/* Боковая панель */}
      <Box
        w={{ base: "100%", md: "250px" }}
        bg="gray.900"
        borderRight={{ base: "none", md: "1px" }}
        borderBottom={{ base: "1px", md: "none" }}
        borderColor="gray.700"
        display={isOpen ? "block" : { base: "none", md: "block" }}
        maxH={{ base: isOpen ? "auto" : "0", md: "100vh" }}
        overflowY={{ base: "visible", md: "auto" }}
      >
        <VStack align="stretch" h="100%" w="100%" gap="0">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              bg={isActive(item.path) ? "gray.700" : "gray.900"}
              color="white"
              borderRadius="0"
              h={{ base: "50px", md: "60px" }}
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="normal"
              onClick={() => handleNavigate(item.path)}
              _hover={{ bg: "gray.700" }}
              justifyContent="space-around"
              pl={{ base: "4", md: "inherit" }}
            >
              {item.label}
            </Button>
          ))}
        </VStack>
      </Box>
    </>
  );
}
