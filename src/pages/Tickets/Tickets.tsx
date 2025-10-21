import { Box, VStack, HStack, Button, Text } from "@chakra-ui/react";
import { MdImage } from "react-icons/md";

interface Ticket {
  id: number;
  filmTitle: string;
  cinemaName: string;
  date: string;
  time: string;
  seats: string[];
}

export function TicketsPage() {
  const tickets = [
    {
      id: 1,
      filmTitle: "Мстители",
      cinemaName: "Skyline Cinema",
      date: "24.07",
      time: "18:30",
      seats: ["1A", "1B"],
    },
    {
      id: 2,
      filmTitle: "Темный рыцарь",
      cinemaName: "Салют",
      date: "25.07",
      time: "20:00",
      seats: ["5C"],
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
        {tickets.map((ticket, idx) => (
          <HStack
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
                {ticket.filmTitle}
              </Text>
              <Text fontSize={{ base: "sm", md: "md" }} color="gray.300">
                {ticket.cinemaName}
              </Text>
              <Text fontSize={{ base: "xs", md: "sm" }} color="gray.400">
                {ticket.date} {ticket.time}
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
            <Text fontSize={{ base: "sm", md: "md" }} color="gray.400" whiteSpace="nowrap">
              Просмотрено
            </Text>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}
