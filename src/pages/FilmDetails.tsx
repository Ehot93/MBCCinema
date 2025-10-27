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
  Center,
} from "@chakra-ui/react";
import { ArrowLeft, Star } from "lucide-react";
import { useMovieDetails } from "@/shared/hooks/useMovieQueries";
import { getImageUrl } from "@/shared/lib/api";
import { commonStyles } from "@/shared/ui";

export function FilmDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: filmDetails, isLoading, error } = useMovieDetails(id ? parseInt(id) : 0);

  if (isLoading) {
    return (
      <Center flex="1" flexDir="column" gap="4">
        <Spinner size="lg" color="white" />
        <Text color="gray.400">Загрузка фильма...</Text>
      </Center>
    );
  }

  if (error || !filmDetails) {
    return (
      <Box flex="1" p={{ base: "4", md: "8" }} overflowY="auto">
        <Button variant="ghost" color="white" mb={{ base: "4", md: "6" }} _hover={{ bg: "gray.800" }} onClick={() => navigate("/")}>
          <ArrowLeft />
          Назад
        </Button>
        <Text color="red.400" fontSize="lg">{error instanceof Error ? error.message : "Фильм не найден"}</Text>
      </Box>
    );
  }

  const film = filmDetails;

  return (
    <Box flex="1" p={{ base: "4", md: "8" }} overflowY="auto">
      {/* Кнопка назад */}
      <Button {...commonStyles.button.backButton} onClick={() => navigate("/")}>
        <ArrowLeft />
        Назад
      </Button>

      {/* Основной контент */}
      <Stack {...commonStyles.stack.mainContent}>
        {/* Постер фильма */}
        <Box {...commonStyles.box.posterContainer}>
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
        <VStack {...commonStyles.vstack.filmDetails} flex={1}>
          {/* Заголовок */}
          <VStack {...commonStyles.vstack.filmInfo}>
            <Heading size={{ base: "lg", md: "2xl" }}>{film.title}</Heading>
            <Text color="gray.400" fontSize={{ base: "sm", md: "md" }}>
              {film.description}
            </Text>
          </VStack>

          {/* Характеристики фильма */}
          <VStack {...commonStyles.vstack.characteristics}>
            <HStack {...commonStyles.hstack.characteristics}>
              <VStack align="flex-start" gap="0">
                <Text {...commonStyles.text.characteristicLabel}>Год</Text>
                <Text {...commonStyles.text.characteristicValue}>{film.year}</Text>
              </VStack>
              <VStack align="flex-start" gap="0">
                <Text {...commonStyles.text.characteristicLabel}>Продолжительность</Text>
                <Text {...commonStyles.text.characteristicValue}>
                  {film.lengthMinutes ? `${Math.floor(film.lengthMinutes / 60)}:${(film.lengthMinutes % 60).toString().padStart(2, "0")}` : "Не указано"}
                </Text>
              </VStack>
              <VStack align="flex-start" gap="0">
                <Text {...commonStyles.text.characteristicLabel}>Рейтинг</Text>
                <Text {...commonStyles.text.characteristicValue}>
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
                  <Text {...commonStyles.text.sectionLabel}>{showDate.date}</Text>

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
                              <HStack {...commonStyles.hstack.sessionTimes}>
                                {Array.isArray(showtime.times) &&
                                  showtime.times.map((slot) => (
                                    <Button
                                      key={slot.sessionId}
                                      {...commonStyles.button.sessionButton}
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
