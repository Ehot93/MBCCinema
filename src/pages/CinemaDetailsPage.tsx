import { useNavigate } from "react-router-dom";
import { Box, VStack, HStack, Button, Text, Heading, Separator } from "@chakra-ui/react";
import { MdImage, MdArrowBack } from "react-icons/md";

export function CinemaDetailsPage() {
  const navigate = useNavigate();

  // Mock data - в реальном приложении будет из API
  const cinema = {
    id: 1,
    name: "Skyline Cinema",
    address: "ТРЦ Galileo, ул. Бобруйская, 6",
    schedule: [
      {
        date: "24.07",
        films: [
          {
            id: 1,
            title: "Мстители",
            times: ["15:30", "18:30", "20:30"],
          },
          {
            id: 2,
            title: "Темный рыцарь",
            times: ["11:30", "13:30"],
          },
        ],
      },
      {
        date: "25.07",
        films: [
          {
            id: 1,
            title: "Мстители",
            times: ["15:30", "18:30", "20:30"],
          },
          {
            id: 2,
            title: "Темный рыцарь",
            times: ["11:30", "13:30"],
          },
        ],
      },
    ],
  };

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
        <MdArrowBack />
        Назад
      </Button>

      {/* Заголовок с названием кинотеатра */}
      <Heading size={{ base: "lg", md: "2xl" }} mb={{ base: "4", md: "6" }}>
        {cinema.name}
      </Heading>

      <Separator borderColor="gray.700" mb={{ base: "6", md: "8" }} />

      {/* Расписание по датам */}
      <VStack align="stretch" gap={{ base: "6", md: "8" }}>
        {cinema.schedule.map((daySchedule) => (
          <Box key={daySchedule.date}>
            {/* Дата */}
            <Text fontSize={{ base: "md", md: "lg" }} fontWeight="600" mb={{ base: "4", md: "5" }}>
              {daySchedule.date}
            </Text>

            <Separator borderColor="gray.700" mb={{ base: "4", md: "6" }} />

            {/* Фильмы на дату */}
            <VStack align="stretch" gap={{ base: "4", md: "6" }}>
              {daySchedule.films.map((film) => (
                <HStack
                  key={`${daySchedule.date}-${film.id}`}
                  gap={{ base: "3", md: "6" }}
                  align={{ base: "flex-start", md: "center" }}
                  flexWrap={{ base: "wrap", md: "nowrap" }}
                >
                  {/* Иконка постера */}
                  <Box
                    w={{ base: "60px", md: "80px" }}
                    h={{ base: "60px", md: "80px" }}
                    bg="gray.800"
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                  >
                    <MdImage size={30} />
                  </Box>

                  {/* Название фильма */}
                  <Text
                    fontSize={{ base: "md", md: "lg" }}
                    fontWeight="500"
                    minW={{ base: "120px", md: "auto" }}
                  >
                    {film.title}
                  </Text>

                  {/* Время сеансов */}
                  <HStack
                    gap={{ base: "2", md: "3" }}
                    ml={{ base: "auto", md: "auto" }}
                    flexWrap="wrap"
                    justify={{ base: "flex-end", md: "flex-start" }}
                  >
                    {film.times.map((time) => (
                      <Button
                        key={time}
                        borderColor="white"
                        borderWidth="1px"
                        bg="transparent"
                        color="white"
                        px={{ base: "3", md: "4" }}
                        py={{ base: "1", md: "2" }}
                        fontSize={{ base: "sm", md: "md" }}
                        _hover={{ bg: "white", color: "black" }}
                        size={{ base: "sm", md: "md" }}
                        onClick={() => navigate("/seats")}
                      >
                        {time}
                      </Button>
                    ))}
                  </HStack>
                </HStack>
              ))}
            </VStack>

            {daySchedule !== cinema.schedule[cinema.schedule.length - 1] && (
              <Separator borderColor="gray.700" mt={{ base: "6", md: "8" }} />
            )}
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
