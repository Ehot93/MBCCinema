import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, VStack, HStack, Button, Text, Heading } from "@chakra-ui/react";
import { MdArrowBack } from "react-icons/md";

const ROWS = 6;
const SEATS_PER_ROW = 10;

export function SeatsPage() {
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());

  // Mock data
  const showtime = {
    film: "Темный рыцарь",
    cinema: "Skyline Cinema",
    date: "24.07",
    time: "17:30",
  };

  // Зарезервированные места (mock data)
  const reservedSeats = new Set(["1-3", "2-5", "2-6", "3-5", "4-3"]);

  const toggleSeat = (row: number, seat: number) => {
    const seatId = `${row}-${seat}`;
    if (reservedSeats.has(seatId)) return;

    const newSelected = new Set(selectedSeats);
    if (newSelected.has(seatId)) {
      newSelected.delete(seatId);
    } else {
      newSelected.add(seatId);
    }
    setSelectedSeats(newSelected);
  };

  const handleBooking = () => {
    if (selectedSeats.size === 0) return;
    // В реальном приложении здесь будет API запрос
    navigate("/tickets");
  };

  const getSeatColor = (row: number, seat: number) => {
    const seatId = `${row}-${seat}`;
    if (selectedSeats.has(seatId)) return "blue.500";
    if (reservedSeats.has(seatId)) return "gray.600";
    return "transparent";
  };

  const getSeatBorderColor = (row: number, seat: number) => {
    const seatId = `${row}-${seat}`;
    if (reservedSeats.has(seatId)) return "gray.600";
    return "white";
  };

  return (
    <Box flex="1" p={{ base: "4", md: "8" }} overflowY="auto">
      <VStack align="flex-start" gap="1" mb={{ base: "6", md: "8" }}>
        <Text color="gray.400" fontSize={{ base: "sm", md: "md" }}>
          Фильм: {showtime.film}
        </Text>
        <Text color="gray.400" fontSize={{ base: "sm", md: "md" }}>
          Кинотеатр: {showtime.cinema}
        </Text>
        <Text color="gray.400" fontSize={{ base: "sm", md: "md" }}>
          Время: {showtime.date}, {showtime.time}
        </Text>
      </VStack>

      {/* Экран */}
      <Box
        bg="gray.800"
        p={{ base: "3", md: "4" }}
        borderRadius="md"
        mb={{ base: "6", md: "8" }}
        textAlign="center"
      >
        <Text fontSize={{ base: "xs", md: "sm" }} color="gray.400">
          ЭКРАН
        </Text>
      </Box>

      {/* Схема мест */}
      <VStack align="center" gap={{ base: "3", md: "4" }} mb={{ base: "8", md: "10" }}>
        {Array.from({ length: ROWS }, (_, rowIdx) => {
          const row = rowIdx + 1;
          return (
            <HStack key={row} gap={{ base: "1", md: "2" }} justify="center">
              {/* Номер ряда */}
              <Text
                w={{ base: "30px", md: "40px" }}
                fontSize={{ base: "xs", md: "sm" }}
                color="gray.400"
                textAlign="center"
              >
                ряд {row}
              </Text>

              {/* Места в ряду */}
              <HStack gap={{ base: "1", md: "2" }}>
                {Array.from({ length: SEATS_PER_ROW }, (_, seatIdx) => {
                  const seat = seatIdx + 1;
                  const seatId = `${row}-${seat}`;
                  const isReserved = reservedSeats.has(seatId);
                  const isSelected = selectedSeats.has(seatId);

                  return (
                    <Box
                      key={seatId}
                      w={{ base: "24px", md: "32px" }}
                      h={{ base: "24px", md: "32px" }}
                      borderWidth="1px"
                      borderColor={getSeatBorderColor(row, seat)}
                      bg={getSeatColor(row, seat)}
                      borderRadius="md"
                      cursor={isReserved ? "not-allowed" : "pointer"}
                      opacity={isReserved ? 0.5 : 1}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontSize={{ base: "8px", md: "10px" }}
                      transition="all 0.2s"
                      _hover={
                        !isReserved
                          ? {
                            borderColor: "blue.400",
                            boxShadow: "0 0 8px rgba(59, 130, 246, 0.5)",
                          }
                          : {}
                      }
                      onClick={() => toggleSeat(row, seat)}
                      color={isSelected ? "white" : "gray.500"}
                    >
                      {isSelected ? "✓" : ""}
                    </Box>
                  );
                })}
              </HStack>

              {/* Номер места */}
              <Text
                w={{ base: "30px", md: "40px" }}
                fontSize={{ base: "xs", md: "sm" }}
                color="gray.400"
                textAlign="center"
              >
                {SEATS_PER_ROW}
              </Text>
            </HStack>
          );
        })}
      </VStack>

      {/* Легенда */}
      <HStack
        gap={{ base: "4", md: "8" }}
        justify="center"
        mb={{ base: "6", md: "8" }}
        flexWrap="wrap"
      >
        <HStack gap="2">
          <Box w="20px" h="20px" borderWidth="1px" borderColor="white" borderRadius="sm" />
          <Text fontSize={{ base: "xs", md: "sm" }} color="gray.400">
            Свободно
          </Text>
        </HStack>
        <HStack gap="2">
          <Box w="20px" h="20px" bg="blue.500" borderRadius="sm" />
          <Text fontSize={{ base: "xs", md: "sm" }} color="gray.400">
            Выбрано
          </Text>
        </HStack>
        <HStack gap="2">
          <Box
            w="20px"
            h="20px"
            bg="gray.600"
            borderWidth="1px"
            borderColor="gray.600"
            borderRadius="sm"
          />
          <Text fontSize={{ base: "xs", md: "sm" }} color="gray.400">
            Занято
          </Text>
        </HStack>
      </HStack>

      {/* Кнопка бронирования */}
      <HStack justify="center" mb={{ base: "4", md: "0" }}>
        <Button
          borderColor="white"
          borderWidth="1px"
          bg="transparent"
          color="white"
          px={{ base: "6", md: "8" }}
          py={{ base: "2", md: "3" }}
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="600"
          disabled={selectedSeats.size === 0}
          _hover={selectedSeats.size > 0 ? { bg: "white", color: "black" } : { opacity: 0.5 }}
          onClick={handleBooking}
        >
          Забронировать ({selectedSeats.size})
        </Button>
      </HStack>
    </Box>
  );
}
