import { useNavigate } from "react-router-dom";
import { Box, HStack, VStack, Button, Text, Stack } from "@chakra-ui/react";

export function CinemasPage() {
  const navigate = useNavigate();
  const cinemas = [
    {
      id: 1,
      name: "Skyline Cinema",
      address: "ТРЦ Galileo, ул. Бобруйская, 6",
    },
    {
      id: 2,
      name: "Салют",
      address: "пр-т Рокоссовского, 150 а",
    },
  ];

  return (
    <Box flex="1" overflowY="auto">
      {/* Заголовки колонок - скрыты на мобильных */}
      <HStack
        gap={{ base: "2", md: "20" }}
        mb={{ base: "6", md: "8" }}
        pb={{ base: "3", md: "4" }}
        borderBottom="1px"
        borderColor="gray.700"
        display={{ base: "none", md: "flex" }}
        px={{ base: "4", md: "6" }}
      >
        <Box w="100%">
          <Text fontWeight="bold" fontSize="lg">
            Кинотеатр
          </Text>
        </Box>
        <Box flex="1">
          <Text fontWeight="bold" fontSize="lg">
            Адрес
          </Text>
        </Box>
        <Box w="200px" />
      </HStack>
      {/* Таблица кинотеатров */}
      <VStack align="stretch" gap={{ base: "3", md: "4" }} px={{ base: "4", md: "6" }}>
        {cinemas.map((cinema) => (
          <Stack
            key={cinema.id}
            direction={{ base: "column", md: "row" }}
            gap={{ base: "3", md: "6" }}
            p={{ base: "3", md: "4" }}
            borderWidth="1px"
            borderColor="gray.700"
            borderRadius={{ base: "md", md: "none" }}
            align={{ base: "stretch", md: "center" }}
          >
            {/* Информация */}
            <VStack align={{ base: "stretch", md: "flex-start" }} w="100%" gap="2">
              {/* Название кинотеатра */}
              <Box>
                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.400">
                  Кинотеатр
                </Text>
                <Text w="100%" fontSize={{ base: "lg", md: "lg" }} fontWeight="500">
                  {cinema.name}
                </Text>
              </Box>

              {/* Адрес */}
              <Box>
                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.400">
                  Адрес
                </Text>
                <Text w="100%" fontSize={{ base: "md", md: "lg" }}>
                  {cinema.address}
                </Text>
              </Box>
            </VStack>

            {/* Кнопка */}
            <Button
              borderColor="white"
              borderWidth="1px"
              bg="transparent"
              color="white"
              px={{ base: "4", md: "6" }}
              py={{ base: "2", md: "2" }}
              fontSize={{ base: "sm", md: "md" }}
              whiteSpace="nowrap"
              _hover={{ bg: "white", color: "black" }}
              w={{ base: "100%", md: "auto" }}
              onClick={() => navigate(`/cinema/${cinema.id}`)}
            >
              Посмотреть сеансы
            </Button>
          </Stack>
        ))}
      </VStack>
    </Box>
  );
}
