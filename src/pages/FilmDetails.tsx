import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  VStack,
  HStack,
  Button,
  Text,
  Heading,
  Stack,
  Separator,
  Image,
  Spinner,
  Table,
} from "@chakra-ui/react";
import { ArrowLeft, Star } from "lucide-react";
import { useFilmStore } from "../entities/Film";
import { getImageUrl } from "../shared/lib/api";

export function FilmDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { filmDetails, isLoading, error, fetchFilmDetails } = useFilmStore();

  useEffect(() => {
    if (id) {
      fetchFilmDetails(parseInt(id));
    }
  }, [id, fetchFilmDetails]);

  if (isLoading) {
    return (
      <Box
        flex="1"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={{ base: "4", md: "8" }}
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error || !filmDetails) {
    return (
      <Box flex="1" p={{ base: "4", md: "8" }} overflowY="auto">
        <Button
          variant="ghost"
          color="white"
          mb={{ base: "4", md: "6" }}
          _hover={{ bg: "gray.800" }}
          onClick={() => navigate("/")}
        >
          <ArrowLeft />
          Назад
        </Button>
        <Text color="red.400" fontSize="lg">
          {error || "Фильм не найден"}
        </Text>
      </Box>
    );
  }

  const film = filmDetails;

  return (
    <Box flex="1" p={{ base: "4", md: "8" }} overflowY="auto">
      {/* Кнопка назад */}
      <Button
        variant="ghost"
        color="white"
        mb={{ base: "4", md: "6" }}
        _hover={{ bg: "gray.800" }}
        onClick={() => navigate("/")}
      >
        <ArrowLeft />
        Назад
      </Button>

      {/* Основной контент */}
      <Stack
        direction={{ base: "column", md: "row" }}
        gap={{ base: "4", md: "8" }}
        align={{ base: "stretch", md: "flex-start" }}
      >
        {/* Постер фильма */}
        <Box
          w={{ base: "100%", md: "300px" }}
          h={{ base: "300px", md: "400px" }}
          bg="gray.800"
          borderRadius="lg"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
          overflow="hidden"
        >
          <Image
            src={getImageUrl(film.posterImage || "")}
            alt={film.title || "Фильм"}
            w="100%"
            h="100%"
            objectFit="cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </Box>

        {/* Информация о фильме */}
        <VStack align="stretch" gap={{ base: "4", md: "6" }} flex={1}>
          {/* Заголовок */}
          <VStack align="stretch" gap="2">
            <Heading size={{ base: "lg", md: "2xl" }}>{film.title}</Heading>
            <Text color="gray.400" fontSize={{ base: "sm", md: "md" }}>
              {film.description}
            </Text>
          </VStack>

          {/* Характеристики фильма */}
          <VStack align="stretch" gap="2">
            <HStack gap={{ base: "4", md: "8" }}>
              <VStack align="flex-start" gap="0">
                <Text color="gray.400" fontSize={{ base: "xs", md: "sm" }}>
                  Год
                </Text>
                <Text fontSize={{ base: "md", md: "lg" }}>{film.year}</Text>
              </VStack>
              <VStack align="flex-start" gap="0">
                <Text color="gray.400" fontSize={{ base: "xs", md: "sm" }}>
                  Продолжительность
                </Text>
                <Text fontSize={{ base: "md", md: "lg" }}>
                  {film.lengthMinutes ? `${Math.floor(film.lengthMinutes / 60)}:${(film.lengthMinutes % 60).toString().padStart(2, "0")}` : "Не указано"}
                </Text>
              </VStack>
              <VStack align="flex-start" gap="0">
                <Text color="gray.400" fontSize={{ base: "xs", md: "sm" }}>
                  Рейтинг
                </Text>
                <Text fontSize={{ base: "md", md: "lg" }}>
                  <Star color="yellow" /> {film.rating ? film.rating.toFixed(1) : "Не указан"}
                </Text>
              </VStack>
            </HStack>
          </VStack>

          <Separator borderColor="gray.700" />

          {/* Расписание сеансов */}
          <VStack align="stretch" gap={{ base: "4", md: "6" }}>
            <Heading size="md">Доступные сеансы</Heading>

            {film.showtimes && film.showtimes.length > 0 ? (
              film.showtimes.map((showDate) => (
                <VStack key={showDate.date} align="stretch" gap={{ base: "3", md: "4" }}>
                  {/* Дата */}
                  <Text fontSize={{ base: "md", md: "lg" }} fontWeight="600">
                    {showDate.date}
                  </Text>

                  {/* Таблица с сеансами */}
                  <Box overflowX="auto">
                    <Table.Root size={{ base: "sm", md: "md" }}>
                      <Table.Header>
                        <Table.Row>
                          <Table.ColumnHeader>Кинотеатр</Table.ColumnHeader>
                          <Table.ColumnHeader>Время сеансов</Table.ColumnHeader>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {showDate.showtimes.map((showtime) => (
                          <Table.Row key={`${showDate.date}-${showtime.cinemaId}`}>
                            <Table.Cell>{showtime.cinemaName}</Table.Cell>
                            <Table.Cell>
                              <HStack gap="2" flexWrap="wrap">
                                {Array.isArray(showtime.times) &&
                                  showtime.times.map((slot) => (
                                    <Button
                                      key={slot.sessionId}
                                      borderColor="white"
                                      borderWidth="1px"
                                      bg="transparent"
                                      color="white"
                                      px={{ base: "2", md: "3" }}
                                      py={{ base: "1", md: "2" }}
                                      fontSize={{ base: "xs", md: "sm" }}
                                      _hover={{ bg: "white", color: "black" }}
                                      size={{ base: "sm", md: "md" }}
                                      onClick={() => navigate(`/seats/${slot.sessionId}`)}
                                    >
                                      {slot.time}
                                    </Button>
                                  ))}
                              </HStack>
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table.Root>
                  </Box>

                  {showDate !== film.showtimes[film.showtimes.length - 1] && (
                    <Separator borderColor="gray.700" />
                  )}
                </VStack>
              ))
            ) : (
              <Text color="gray.400">Нет доступных сеансов</Text>
            )}
          </VStack>
        </VStack>
      </Stack>
    </Box>
  );
}
