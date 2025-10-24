import { useNavigate } from "react-router-dom";
import { Box, HStack, VStack, Button, Text, Spinner, Center } from "@chakra-ui/react";
import { useCinemas, usePrefetchCinemaData } from "../shared/hooks/useCinemaQueries";

export function CinemasPage() {
  const navigate = useNavigate();
  const { data: cinemas, isLoading, error, refetch } = useCinemas();
  const { prefetchCinemaDetails } = usePrefetchCinemaData();

  const handleCinemaClick = (cinemaId: number) => {
    // Предзагружаем данные кинотеатра перед навигацией
    prefetchCinemaDetails(cinemaId);
    navigate(`/cinema/${cinemaId}/schedule`);
  };

  if (isLoading) {
    return (
      <Center flex="1" flexDir="column" gap="4">
        <Spinner size="lg" color="white" />
        <Text color="gray.400">Загрузка кинотеатров...</Text>
      </Center>
    );
  }

  if (error) {
    return (
      <Center flex="1" flexDir="column" gap="4">
        <Text color="red.400" fontSize="lg">
          {error}
        </Text>
        <Button onClick={() => refetch()}>Попробовать снова</Button>
      </Center>
    );
  }

  return (
    <Box flex="1" overflowY="auto">
      {/* Заголовки колонок - видны только на десктопе */}
      <HStack
        gap={{ base: "2", md: "20" }}
        mb={{ base: "6", md: "8" }}
        pb={{ base: "1", md: "2" }}
        borderBottom="1px"
        borderColor="gray.700"
        display={{ base: "none", md: "flex" }}
        px={{ base: "4", md: "6" }}
      >
        <Box w="40%">
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
        {cinemas?.map((cinema: any) => (
          <HStack
            key={cinema.id}
            gap={{ base: "3", md: "6" }}
            p={{ base: "3", md: "4" }}
            borderWidth="1px"
            borderColor="gray.700"
            borderRadius={{ base: "md", md: "none" }}
            align={{ base: "flex-start", md: "center" }}
            display={{ base: "flex", md: "flex" }}
            flexDir={{ base: "column", md: "row" }}
          >
            {/* Мобильная версия: название + адрес вертикально */}
            <VStack align={{ base: "stretch", md: "flex-start" }} w={{ base: "100%", md: "40%" }} gap="2" display={{ base: "flex", md: "none" }}>
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

            {/* Десктопная версия: название слева */}
            <Box w={{ base: "100%", md: "40%" }} display={{ base: "none", md: "block" }}>
              <Text fontSize={{ base: "md", md: "lg" }} fontWeight="500">
                {cinema.name}
              </Text>
            </Box>

            {/* Десктопная версия: адрес посередине */}
            <Box flex={{ base: "1", md: "1" }} display={{ base: "none", md: "block" }}>
              <Text fontSize={{ base: "md", md: "lg" }}>
                {cinema.address}
              </Text>
            </Box>

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
              onClick={() => handleCinemaClick(cinema.id!)}
            >
              Посмотреть сеансы
            </Button>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}
