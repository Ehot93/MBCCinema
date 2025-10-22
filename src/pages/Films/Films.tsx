import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, SimpleGrid, VStack, Button, Text, Heading, Image, Spinner } from "@chakra-ui/react";
import { useFilmStore } from "../../entities/Film";
import { getImageUrl } from "../../shared/lib/api";

export function FilmsPage() {
  const navigate = useNavigate();
  const { films, isLoading, error, fetchFilms } = useFilmStore();

  useEffect(() => {
    fetchFilms();
  }, [fetchFilms]);

  if (isLoading) {
    return (
      <Box
        flex="1"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={{ base: "4", md: "8" }}
      >
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        flex="1"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={{ base: "4", md: "8" }}
      >
        <VStack gap="4">
          <Text color="red.400" fontSize="lg">
            {error}
          </Text>
          <Button onClick={() => fetchFilms()}>Попробовать снова</Button>
        </VStack>
      </Box>
    );
  }

  return (
    <Box flex="1" overflowY="auto" p={{ base: "4", md: "8" }}>
      <Heading size={{ base: "lg", md: "2xl" }} mb={{ base: "6", md: "8" }}>
        Фильмы
      </Heading>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={{ base: "4", md: "6" }}>
        {films.map((film) => (
          <VStack
            key={film.id}
            gap="4"
            borderWidth="1px"
            borderColor="gray.700"
            borderRadius="lg"
            overflow="hidden"
            transition="all 0.3s"
            _hover={{ borderColor: "white", boxShadow: "0 0 10px rgba(255,255,255,0.1)" }}
          >
            {/* Постер */}
            <Box
              w="100%"
              h={{ base: "200px", md: "250px" }}
              bg="gray.800"
              overflow="hidden"
              position="relative"
            >
              <Image
                src={getImageUrl(film.posterImage)}
                alt={film.title}
                w="100%"
                h="100%"
                objectFit="cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </Box>

            {/* Информация */}
            <VStack align="stretch" gap="3" px="4" pb="4" flex="1">
              <VStack align="stretch" gap="1">
                <Heading
                  size={{ base: "sm", md: "md" }}
                  noOfLines={2}
                  fontSize={{ base: "md", md: "lg" }}
                >
                  {film.title}
                </Heading>
                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.400">
                  {film.year}
                </Text>
              </VStack>

              <VStack align="stretch" gap="1" fontSize={{ base: "xs", md: "sm" }}>
                <Text color="gray.300">
                  ⏱️ {Math.floor(film.lengthMinutes / 60)}:
                  {(film.lengthMinutes % 60).toString().padStart(2, "0")}
                </Text>
                <Text color="yellow.400">⭐ {film.rating.toFixed(1)}</Text>
              </VStack>

              <Text fontSize={{ base: "xs", md: "sm" }} color="gray.300" noOfLines={3} flex="1">
                {film.description}
              </Text>

              {/* Кнопка */}
              <Button
                borderColor="white"
                borderWidth="1px"
                bg="transparent"
                color="white"
                w="100%"
                mt="auto"
                fontSize={{ base: "sm", md: "md" }}
                _hover={{ bg: "white", color: "black" }}
                onClick={() => navigate(`/film/${film.id}`)}
              >
                Посмотреть сеансы
              </Button>
            </VStack>
          </VStack>
        ))}
      </SimpleGrid>
    </Box>
  );
}
