import { Box, VStack, HStack, Button, Text, Stack } from "@chakra-ui/react";

interface Ticket {
  id: number;
  film: string;
  cinema: string;
  date: string;
  seats: string[];
  timeLeft?: string;
  status: string;
}

export function TicketsPage() {
  const ticketCategories = [
    {
      title: "Не оплаченные",
      color: "red.400",
      tickets: [
        {
          id: 1,
          film: "Мстители",
          cinema: "Skyline Cinema",
          date: "24.03 22:15",
          seats: ["Ряд 1, место 1", "Ряд 1, место 2"],
          timeLeft: "Осталось 2:59",
          status: "unpaid",
        },
      ],
    },
    {
      title: "Будущие",
      color: "white",
      tickets: [
        {
          id: 2,
          film: "Мстители",
          cinema: "Skyline Cinema",
          date: "24.03 22:15",
          seats: ["Ряд 1, место 1", "Ряд 1, место 2"],
          status: "future",
        },
        {
          id: 3,
          film: "Темный рыцарь",
          cinema: "Салют",
          date: "20.03 22:15",
          seats: ["Ряд 1, место 1", "Ряд 1, место 2"],
          status: "future",
        },
      ],
    },
    {
      title: "Прошедшие",
      color: "white",
      tickets: [
        {
          id: 4,
          film: "Мстители",
          cinema: "Skyline Cinema",
          date: "24.01 22:15",
          seats: ["Ряд 1, место 1", "Ряд 1, место 2"],
          status: "past",
        },
      ],
    },
  ];

  return (
    <Box flex="1" p={{ base: "4", md: "8" }} overflowY="auto">
      {/* Заголовок */}
      <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" mb={{ base: "6", md: "8" }}>
        Мои билеты
      </Text>

      {/* Категории билетов */}
      <VStack align="stretch" gap={{ base: "6", md: "8" }}>
        {ticketCategories.map((category, idx) => (
          <Box key={idx}>
            {/* Заголовок категории */}
            <Text
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="600"
              color={category.color}
              pb={{ base: "2", md: "3" }}
              borderBottom="1px"
              borderColor="gray.700"
              mb={{ base: "4", md: "6" }}
            >
              {category.title}
            </Text>

            {/* Список билетов в категории */}
            <VStack align="stretch" gap={{ base: "3", md: "4" }}>
              {category.tickets.map((ticket: Ticket) => (
                <Stack
                  key={ticket.id}
                  direction={{ base: "column", md: "row" }}
                  gap={{ base: "3", md: "6" }}
                  p={{ base: "3", md: "4" }}
                  borderWidth="1px"
                  borderColor="gray.700"
                  borderRadius={{ base: "md", md: "none" }}
                  align={{ base: "stretch", md: "center" }}
                >
                  {/* Информация о фильме и кинотеатре */}
                  <VStack
                    align={{ base: "stretch", md: "flex-start" }}
                    gap="1"
                    minW={{ base: "auto", md: "200px" }}
                  >
                    <Text fontSize={{ base: "sm", md: "xs" }} color="gray.400">
                      Фильм
                    </Text>
                    <Text fontWeight="600" fontSize={{ base: "md", md: "lg" }}>
                      {ticket.film}
                    </Text>
                    <Text fontSize={{ base: "sm", md: "md" }} color="gray.300">
                      {ticket.cinema}
                    </Text>
                    <Text fontSize={{ base: "xs", md: "sm" }} color="gray.400">
                      {ticket.date}
                    </Text>
                  </VStack>

                  {/* Информация о местах */}
                  <VStack align={{ base: "stretch", md: "flex-start" }} gap="1" flex="1">
                    {ticket.seats.map((seat, seatIdx) => (
                      <Text key={seatIdx} fontSize={{ base: "sm", md: "md" }}>
                        {seat}
                      </Text>
                    ))}
                  </VStack>

                  {/* Кнопка оплаты или время */}
                  {ticket.status === "unpaid" ? (
                    <HStack gap={{ base: "2", md: "4" }} w={{ base: "100%", md: "auto" }}>
                      <Button
                        borderColor="white"
                        borderWidth="1px"
                        bg="transparent"
                        color="white"
                        px={{ base: "4", md: "6" }}
                        py={{ base: "1.5", md: "2" }}
                        fontSize={{ base: "sm", md: "md" }}
                        _hover={{ bg: "white", color: "black" }}
                        w={{ base: "100%", md: "auto" }}
                      >
                        Оплатить
                      </Button>
                      <Text
                        fontSize={{ base: "sm", md: "md" }}
                        color="gray.300"
                        whiteSpace="nowrap"
                      >
                        {ticket.timeLeft}
                      </Text>
                    </HStack>
                  ) : (
                    <Text fontSize={{ base: "sm", md: "md" }} color="gray.400" whiteSpace="nowrap">
                      {ticket.status === "past" ? "Просмотрено" : "Ждём вас"}
                    </Text>
                  )}
                </Stack>
              ))}
            </VStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
