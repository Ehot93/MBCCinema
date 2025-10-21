import { useNavigate } from "react-router-dom";
import { Box, VStack, HStack, Button, Text, Heading, Stack, Separator } from "@chakra-ui/react";
import { MdImage, MdArrowBack } from "react-icons/md";

export function FilmDetailsPage() {
  const navigate = useNavigate();

  // Mock data - в реальном приложении будет из API
  const film = {
    id: 1,
    title: "Темный рыцарь",
    image: null,
    description:
      "Когда Джокер сеет хаос в Готэме, Бэтмен сталкивается с величайшими исполнителями своих способностей и морали.",
    year: 2008,
    duration: "2:32",
    rating: 9.0,
    showtimes: [
      {
        date: "24.07",
        cinemas: [
          {
            name: "Skyline Cinema",
            times: ["15:30", "18:30", "20:30"],
          },
          {
            name: "Салют",
            times: ["11:30", "13:30"],
          },
        ],
      },
      {
        date: "25.07",
        cinemas: [
          {
            name: "Skyline Cinema",
            times: ["15:30", "18:30", "20:30"],
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
        onClick={() => navigate("/")}
      >
        <MdArrowBack />
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
        >
          <MdImage size={100} color="gray" />
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
                <Text fontSize={{ base: "md", md: "lg" }}>{film.duration}</Text>
              </VStack>
              <VStack align="flex-start" gap="0">
                <Text color="gray.400" fontSize={{ base: "xs", md: "sm" }}>
                  Рейтинг
                </Text>
                <Text fontSize={{ base: "md", md: "lg" }}>{film.rating}</Text>
              </VStack>
            </HStack>
          </VStack>

          <Separator borderColor="gray.700" />

          {/* Расписание сеансов */}
          <VStack align="stretch" gap={{ base: "4", md: "6" }}>
            <Heading size="md">Доступные сеансы</Heading>

            {film.showtimes.map((showDate) => (
              <VStack key={showDate.date} align="stretch" gap={{ base: "3", md: "4" }}>
                {/* Дата */}
                <Text fontSize={{ base: "md", md: "lg" }} fontWeight="600">
                  {showDate.date}
                </Text>

                {/* Кинотеатры и время */}
                <VStack
                  align="stretch"
                  gap={{ base: "3", md: "3" }}
                  pl={{ base: "0", md: "4" }}
                >
                  {showDate.cinemas.map((cinema) => (
                    <VStack key={cinema.name} align="stretch" gap="2">
                      {/* Название кинотеатра */}
                      <Text fontSize={{ base: "sm", md: "md" }} color="gray.300">
                        {cinema.name}
                      </Text>

                      {/* Время сеансов */}
                      <HStack gap={{ base: "2", md: "3" }} flexWrap="wrap">
                        {cinema.times.map((time) => (
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
                    </VStack>
                  ))}
                </VStack>

                {showDate !== film.showtimes[film.showtimes.length - 1] && (
                  <Separator borderColor="gray.700" />
                )}
              </VStack>
            ))}
          </VStack>
        </VStack>
      </Stack>
    </Box>
  );
}
