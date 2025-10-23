import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, VStack, HStack, Button, Text, Heading, Spinner, Center } from "@chakra-ui/react";
import { MdArrowBack, MdCheck } from "react-icons/md";
import { useAuthStore } from "../entities/User";
import { useFilmSessionStore } from "../entities/Film/model";

export function SeatsPage() {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const { isAuthenticated } = useAuthStore();
  const { session, isLoading, error, fetchSession, bookSeats, clearError } = useFilmSessionStore();
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());
  const [isBooking, setIsBooking] = useState(false);

  // Загрузить данные сеанса при монтировании
  useEffect(() => {
    if (sessionId) {
      fetchSession(parseInt(sessionId));
    }
  }, [sessionId, fetchSession]);

  if (isLoading) {
    return (
      <Center flex="1" flexDir="column" gap="4">
        <Spinner size="lg" color="white" />
        <Text color="gray.400">Загрузка данных сеанса...</Text>
      </Center>
    );
  }

  if (!session) {
    return (
      <Center flex="1" flexDir="column" gap="4">
        <Text color="red.400">Сеанс не найден</Text>
        <Button onClick={() => navigate(-1)} variant="ghost" color="white">
          Вернуться назад
        </Button>
      </Center>
    );
  }

  const bookedSeatsSet = new Set(session.bookedSeats);
  const rows = session.seats.rows;
  const cols = session.seats.seatsPerRow;

  // Debug logging
  console.log("Session data:", session);
  console.log("Rows:", rows, "Cols:", cols);
  console.log("Booked seats:", session.bookedSeats);

  // Для неавторизованных пользователей отключаем выбор мест
  const canSelectSeats = isAuthenticated;

  const toggleSeat = (row: number, seat: number) => {
    if (!canSelectSeats) return;

    const seatId = `${row}-${seat}`;
    if (bookedSeatsSet.has(seatId)) return;

    const newSelected = new Set(selectedSeats);
    if (newSelected.has(seatId)) {
      newSelected.delete(seatId);
    } else {
      newSelected.add(seatId);
    }
    setSelectedSeats(newSelected);
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (selectedSeats.size === 0 || !sessionId) return;

    try {
      setIsBooking(true);
      clearError();
      await bookSeats(parseInt(sessionId), Array.from(selectedSeats));
      // После успешного бронирования переходим на страницу билетов
      navigate("/tickets");
    } catch (err) {
      console.error("Ошибка бронирования:", err);
    } finally {
      setIsBooking(false);
    }
  };

  const getSeatColor = (row: number, seat: number) => {
    const seatId = `${row}-${seat}`;
    if (selectedSeats.has(seatId)) return "blue.500";
    if (bookedSeatsSet.has(seatId)) return "gray.600";
    return "transparent";
  };

  const getSeatBorderColor = (row: number, seat: number) => {
    const seatId = `${row}-${seat}`;
    if (bookedSeatsSet.has(seatId)) return "gray.600";
    return "white";
  };

  const getSeatCursor = (row: number, seat: number) => {
    const seatId = `${row}-${seat}`;
    if (bookedSeatsSet.has(seatId)) return "not-allowed";
    if (!canSelectSeats) return "not-allowed";
    return "pointer";
  };

  return (
    <Box flex="1" p={{ base: "4", md: "8" }} overflowY="auto">
      {/* Кнопка назад */}
      <Button
        variant="ghost"
        color="white"
        mb={{ base: "4", md: "6" }}
        _hover={{ bg: "gray.800" }}
        onClick={() => navigate(-1)}
      >
        <MdArrowBack />
        Назад
      </Button>

      {/* Заголовок */}
      <Heading size={{ base: "lg", md: "2xl" }} mb={{ base: "6", md: "8" }}>
        Выбрать места
      </Heading>

      {/* Информация о сеансе */}
      <VStack align="flex-start" gap="1" mb={{ base: "6", md: "8" }}>
        <Text color="gray.400" fontSize={{ base: "sm", md: "md" }}>
          Время: {session.startTime}
        </Text>
      </VStack>

      {/* Статус авторизации */}
      {!isAuthenticated && (
        <Box
          bg="blue.900"
          border="1px solid"
          borderColor="blue.500"
          p="3"
          borderRadius="md"
          mb={{ base: "6", md: "8" }}
        >
          <Text fontSize={{ base: "sm", md: "md" }} color="blue.100">
            Для выбора и бронирования мест требуется авторизация
          </Text>
        </Box>
      )}

      {/* Ошибка */}
      {error && (
        <Box
          bg="red.900"
          border="1px solid"
          borderColor="red.500"
          p="3"
          borderRadius="md"
          mb={{ base: "6", md: "8" }}
        >
          <Text fontSize={{ base: "sm", md: "md" }} color="red.100">
            {error}
          </Text>
        </Box>
      )}

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
        {Array.from({ length: rows }, (_, rowIdx) => {
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
                {Array.from({ length: cols }, (_, seatIdx) => {
                  const seat = seatIdx + 1;
                  const seatId = `${row}-${seat}`;
                  const isBooked = bookedSeatsSet.has(seatId);
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
                      cursor={getSeatCursor(row, seat)}
                      opacity={isBooked ? 0.5 : 1}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontSize={{ base: "8px", md: "10px" }}
                      transition="all 0.2s"
                      _hover={
                        !isBooked && canSelectSeats
                          ? {
                            borderColor: "blue.400",
                            boxShadow: "0 0 8px rgba(59, 130, 246, 0.5)",
                          }
                          : {}
                      }
                      onClick={() => toggleSeat(row, seat)}
                      color={isSelected ? "white" : "gray.500"}
                    >
                      {isSelected ? <MdCheck /> : ""}
                    </Box>
                  );
                })}
              </HStack>

              {/* Номер последнего места */}
              <Text
                w={{ base: "30px", md: "40px" }}
                fontSize={{ base: "xs", md: "sm" }}
                color="gray.400"
                textAlign="center"
              >
                {cols}
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
        {canSelectSeats && (
          <HStack gap="2">
            <Box w="20px" h="20px" bg="blue.500" borderRadius="sm" />
            <Text fontSize={{ base: "xs", md: "sm" }} color="gray.400">
              Выбрано
            </Text>
          </HStack>
        )}
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
          disabled={
            isBooking ||
            (isAuthenticated && selectedSeats.size === 0) ||
            !isAuthenticated
          }
          _hover={
            selectedSeats.size > 0 && isAuthenticated && !isBooking
              ? { bg: "white", color: "black" }
              : { opacity: 0.5 }
          }
          onClick={handleBooking}
        >
          {isAuthenticated ? `Забронировать (${selectedSeats.size})` : "Войти для бронирования"}
        </Button>
      </HStack>
    </Box>
  );
}
