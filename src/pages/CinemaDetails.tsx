import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, VStack, HStack, Button, Text, Heading, Separator, Spinner, Center } from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import { useCinemaStore } from "../entities/Cinema";

export function CinemaDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { cinemaDetails, isLoading, error, fetchCinemaDetails } = useCinemaStore();

  useEffect(() => {
    if (id) {
      fetchCinemaDetails(parseInt(id));
    }
  }, [id, fetchCinemaDetails]);

  if (isLoading) {
    return (
      <Center flex="1" flexDir="column" gap="4">
        <Spinner size="lg" color="white" />
        <Text color="gray.400">Загрузка расписания...</Text>
      </Center>
    );
  }

  if (error || !cinemaDetails) {
    return (
      <Box flex="1" p={{ base: "4", md: "8" }} overflowY="auto">
        <Button
          variant="ghost"
          color="white"
          mb={{ base: "4", md: "6" }}
          _hover={{ bg: "gray.800" }}
          onClick={() => navigate("/cinemas")}
        >
          <ArrowLeft />
          Назад
        </Button>
        <Text color="red.400" fontSize="lg">
          {error || "Кинотеатр не найден"}
        </Text>
      </Box>
    );
  }

  const cinema = cinemaDetails;

  return (
    <Box flex="1" p={{ base: "4", md: "8" }} overflowY="auto">
      {/* Кнопка назад */}
      <Button
        variant="ghost"
        color="white"
        mb={{ base: "4", md: "6" }}
        _hover={{ bg: "gray.800" }}
        onClick={() => navigate("/cinemas")}
      >
        <ArrowLeft />
        Назад
      </Button>

      {/* Заголовок кинотеатра */}
      <VStack align="stretch" gap={{ base: "4", md: "6" }} mb={{ base: "6", md: "8" }}>
        <Heading size={{ base: "lg", md: "2xl" }}>{cinema.name}</Heading>
        <Text color="gray.400" fontSize={{ base: "sm", md: "md" }}>
          {cinema.address}
        </Text>
      </VStack>

      <Separator borderColor="gray.700" mb={{ base: "6", md: "8" }} />

      {/* Расписание */}
      <VStack align="stretch" gap={{ base: "4", md: "6" }}>
        <Heading size="md">Расписание сеансов</Heading>

        {cinema.schedule && cinema.schedule.length > 0 ? (
          cinema.schedule.map((day) => (
            <VStack key={day.date} align="stretch" gap={{ base: "3", md: "4" }}>
              {/* Дата */}
              <Text fontSize={{ base: "md", md: "lg" }} fontWeight="600">
                {day.date}
              </Text>

              {/* Фильмы */}
              <VStack align="stretch" gap={{ base: "3", md: "4" }}>
                {day.films.map((film) => (
                  <HStack
                    key={`${day.date}-${film.id}`}
                    gap={{ base: "3", md: "4" }}
                    p={{ base: "3", md: "4" }}
                    borderWidth="1px"
                    borderColor="gray.700"
                    borderRadius="md"
                    align={{ base: "flex-start", md: "center" }}
                    flexDir={{ base: "column", md: "row" }}
                  >
                    {/* Информация о фильме */}
                    <VStack align={{ base: "stretch", md: "flex-start" }} gap="1" flex="1">
                      <Text fontSize={{ base: "md", md: "lg" }} fontWeight="500">
                        {film.title}
                      </Text>
                    </VStack>

                    {/* Времена сеансов */}
                    <HStack gap="2" flexWrap="wrap">
                      {film.times.map((time, timeIndex) => {
                        const sessionId = film.sessionIds?.[timeIndex];
                        return (
                          <Button
                            key={`${day.date}-${film.id}-${time}`}
                            borderColor="white"
                            borderWidth="1px"
                            bg="transparent"
                            color="white"
                            px={{ base: "3", md: "4" }}
                            py={{ base: "2", md: "2" }}
                            fontSize={{ base: "sm", md: "md" }}
                            _hover={{ bg: "white", color: "black" }}
                            onClick={() => {
                              if (sessionId) {
                                navigate(`/seats/${sessionId}`);
                              } else {
                                console.error(`SessionId не найден для фильма ${film.id} в ${time}`);
                              }
                            }}
                          >
                            {time}
                          </Button>
                        );
                      })}
                    </HStack>
                  </HStack>
                ))}
              </VStack>

              {day !== cinema.schedule[cinema.schedule.length - 1] && (
                <Separator borderColor="gray.700" />
              )}
            </VStack>
          ))
        ) : (
          <Text color="gray.400">Нет доступных сеансов</Text>
        )}
      </VStack>
    </Box>
  );
}