import { useNavigate } from "react-router-dom";
import { Box, HStack, VStack, Button, Text, Stack } from "@chakra-ui/react";
import { MdImage } from "react-icons/md";

export function FilmsPage() {
  const navigate = useNavigate();
  const films = [
    {
      id: 1,
      title: "Мстители",
      duration: "2:20",
      rating: "4.21",
    },
    {
      id: 2,
      title: "Темный рыцарь",
      duration: "1:45",
      rating: "4.79",
    },
  ];

  return (
    <Box flex="1" p={{ base: "4", md: "8" }} overflowY="auto">
      {/* Заголовки колонок - скрыты на мобильных */}
      <HStack justifyContent="space-between">
        <Box w="100%" textAlign="center">
          <Text fontWeight="bold" fontSize="lg">
            Название
          </Text>
        </Box>
        <Box w="100%" textAlign="center">
          <Text fontWeight="bold" fontSize="lg">
            Продолжительность
          </Text>
        </Box>
        <Box w="100%" textAlign="center">
          <Text fontWeight="bold" fontSize="lg">
            Рейтинг
          </Text>
        </Box>
      </HStack>

      {/* Таблица фильмов */}
      <VStack align="stretch" gap={{ base: "3", md: "4" }}>
        {films.map((film) => (
          <Stack
            key={film.id}
            direction={{ base: "column", md: "row" }}
            gap={{ base: "3", md: "6" }}
            p={{ base: "3", md: "4" }}
            borderWidth="1px"
            borderColor="gray.700"
            borderRadius={{ base: "md", md: "none" }}
            align={{ base: "stretch", md: "center" }}
          >
            {/* Иконка фильма */}
            <Box
              w={{ base: "100%", md: "60px" }}
              h={{ base: "150px", md: "60px" }}
              bg="gray.800"
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexShrink="0"
            >
              <MdImage size={40} />
            </Box>

            {/* Информация */}
            <VStack align={{ base: "stretch", md: "flex-start" }} flex="1" gap="2">
              {/* Название */}
              <Box>
                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.400">
                  Название
                </Text>
                <Text w="100%" fontSize={{ base: "lg", md: "lg" }} fontWeight="500">
                  {film.title}
                </Text>
              </Box>

              {/* Продолжительность и Рейтинг в строку */}
              <HStack gap={{ base: "8", md: "16" }} w="100%">
                <Box>
                  <Text fontSize={{ base: "xs", md: "sm" }} color="gray.400">
                    Продолжительность
                  </Text>
                  <Text fontSize={{ base: "md", md: "lg" }}>{film.duration}</Text>
                </Box>

                <Box>
                  <Text fontSize={{ base: "xs", md: "sm" }} color="gray.400">
                    Рейтинг
                  </Text>
                  <Text fontSize={{ base: "md", md: "lg" }}>{film.rating}</Text>
                </Box>
              </HStack>
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
              onClick={() => navigate(`/film/${film.id}`)}
            >
              Посмотреть сеансы
            </Button>
          </Stack>
        ))}
      </VStack>
    </Box>
  );
}
