import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, VStack, HStack, Button, Text, Spinner, Center, Separator } from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";
import { useAuthStore } from "../entities/User";
import { useTicketStore } from "../entities/Ticket/model";

// Функция для преобразования места в читаемый формат
function formatSeat(seat: { rowNumber: number; seatNumber: number }): string {
  return `Ряд ${seat.rowNumber}, место ${seat.seatNumber}`;
}

// Функция для форматирования даты и времени
function formatDateTime(dateString: string): { date: string; time: string } {
  try {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { date: formattedDate, time: formattedTime };
  } catch {
    return { date: dateString, time: "" };
  }
}

// Функция для форматирования времени оплаты
function formatTimeRemaining(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

// Компонент для таймера оплаты
function PaymentTimer({ bookingId, bookedAt, paymentTimeSeconds, onExpired }: any) {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (!paymentTimeSeconds) return;

    const bookedTime = new Date(bookedAt).getTime();
    const expiryTime = bookedTime + paymentTimeSeconds * 1000;

    const updateTimer = () => {
      const now = new Date().getTime();
      const remaining = Math.max(0, Math.floor((expiryTime - now) / 1000));

      setTimeRemaining(remaining);

      if (remaining === 0) {
        onExpired(bookingId);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [bookingId, bookedAt, paymentTimeSeconds, onExpired]);

  if (timeRemaining === null) return null;

  return (
    <Text fontSize={{ base: "sm", md: "md" }} color={timeRemaining < 300 ? "red.400" : "yellow.400"} fontWeight="600">
      ⏱ {formatTimeRemaining(timeRemaining)}
    </Text>
  );
}

// Компонент для отображения билета
function TicketCard({ booking, paymentTimeSeconds, onPaymentComplete, onExpired }: any) {
  const [isPaying, setIsPaying] = useState(false);
  const { payBooking } = useTicketStore();
  const { date, time } = formatDateTime(booking.bookedAt);

  const handlePay = async () => {
    try {
      setIsPaying(true);
      await payBooking(booking.id);
      onPaymentComplete();
    } catch (err) {
      console.error("Ошибка оплаты:", err);
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <HStack
      direction={{ base: "column", md: "row" }}
      gap={{ base: "3", md: "6" }}
      p={{ base: "3", md: "4" }}
      borderWidth="1px"
      borderColor="gray.700"
      borderRadius={{ base: "md", md: "none" }}
      align={{ base: "stretch", md: "center" }}
    >
      {/* Информация о бронировании */}
      <VStack align={{ base: "stretch", md: "flex-start" }} gap="1" minW={{ base: "auto", md: "180px" }}>
        <Text fontSize={{ base: "xs", md: "sm" }} color="gray.400" fontWeight="600">
          БРОНИРОВАНИЕ
        </Text>
        <Text fontWeight="600" fontSize={{ base: "md", md: "lg" }}>
          {booking.id.substring(0, 8).toUpperCase()}
        </Text>
        <Text fontSize={{ base: "xs", md: "sm" }} color="gray.400">
          {date} {time}
        </Text>
      </VStack>

      {/* Информация о местах */}
      <VStack align={{ base: "stretch", md: "flex-start" }} gap="1" flex="1">
        <Text fontSize={{ base: "xs", md: "sm" }} color="gray.400" fontWeight="600">
          МЕСТА
        </Text>
        <HStack gap="2" flexWrap="wrap">
          {booking.seats.map((seat: any, idx: number) => (
            <Text key={idx} fontSize={{ base: "sm", md: "md" }}>
              {formatSeat(seat)}
            </Text>
          ))}
        </HStack>
      </VStack>

      {/* Действия */}
      <HStack gap={{ base: "2", md: "3" }} ml={{ base: "0", md: "auto" }} w={{ base: "100%", md: "auto" }}>
        {booking.isPaid ? (
          <Text fontSize={{ base: "sm", md: "md" }} color="green.400" fontWeight="600">
            <MdCheckCircle /> Оплачено
          </Text>
        ) : (
          <>
            <PaymentTimer
              bookingId={booking.id}
              bookedAt={booking.bookedAt}
              paymentTimeSeconds={paymentTimeSeconds}
              onExpired={onExpired}
            />
            <Button
              borderColor="white"
              borderWidth="1px"
              bg="transparent"
              color="white"
              px={{ base: "3", md: "4" }}
              py={{ base: "1", md: "2" }}
              fontSize={{ base: "sm", md: "md" }}
              _hover={{ bg: "white", color: "black" }}
              disabled={isPaying}
              onClick={handlePay}
              w={{ base: "100%", md: "auto" }}
            >
              {isPaying ? "Оплата..." : "Оплатить"}
            </Button>
          </>
        )}
      </HStack>
    </HStack>
  );
}

export function TicketsPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { bookings, isLoading, paymentTimeSeconds, fetchBookings, fetchSettings, error } = useTicketStore();
  const [expiredBookingIds, setExpiredBookingIds] = useState<Set<string>>(new Set());

  // Перенаправляем неавторизованных пользователей
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Загружаем данные
    fetchBookings();
    fetchSettings();
  }, [isAuthenticated, navigate, fetchBookings, fetchSettings]);

  // Фильтруем и группируем билеты
  const categorizedBookings = useMemo(() => {
    const now = new Date();

    // Исключаем истекшие бронирования
    const activeBookings = bookings.filter((booking) => !expiredBookingIds.has(booking.id));

    const unpaid = activeBookings.filter((b) => !b.isPaid);
    const future = activeBookings.filter((b) => b.isPaid && new Date(b.bookedAt) > now);
    const past = activeBookings.filter((b) => b.isPaid && new Date(b.bookedAt) <= now);

    return { unpaid, future, past };
  }, [bookings, expiredBookingIds]);

  const handleBookingExpired = (bookingId: string) => {
    setExpiredBookingIds((prev) => new Set([...prev, bookingId]));
  };

  const handlePaymentComplete = () => {
    fetchBookings();
  };

  if (!isAuthenticated) {
    return null; // Редирект уже произойдёт через useEffect
  }

  if (isLoading) {
    return (
      <Center flex="1" flexDir="column" gap="4">
        <Spinner size="lg" color="white" />
        <Text color="gray.400">Загрузка билетов...</Text>
      </Center>
    );
  }

  return (
    <Box flex="1" p={{ base: "4", md: "8" }} overflowY="auto">
      {/* Заголовок */}
      <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" mb={{ base: "6", md: "8" }}>
        Мои билеты
      </Text>

      {error && (
        <Box bg="red.900" border="1px solid" borderColor="red.500" p="3" borderRadius="md" mb="6">
          <Text fontSize={{ base: "sm", md: "md" }} color="red.100">
            {error}
          </Text>
        </Box>
      )}

      {/* Секция: Неоплаченные */}
      {categorizedBookings.unpaid.length > 0 && (
        <VStack align="stretch" gap="4" mb="8">
          <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" color="yellow.400">
            К оплате ({categorizedBookings.unpaid.length})
          </Text>
          <Separator borderColor="gray.700" />
          <VStack align="stretch" gap="3">
            {categorizedBookings.unpaid.map((booking) => (
              <TicketCard
                key={booking.id}
                booking={booking}
                paymentTimeSeconds={paymentTimeSeconds}
                onPaymentComplete={handlePaymentComplete}
                onExpired={handleBookingExpired}
              />
            ))}
          </VStack>
        </VStack>
      )}

      {/* Секция: Будущие */}
      {categorizedBookings.future.length > 0 && (
        <VStack align="stretch" gap="4" mb="8">
          <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" color="blue.400">
            Будущие ({categorizedBookings.future.length})
          </Text>
          <Separator borderColor="gray.700" />
          <VStack align="stretch" gap="3">
            {categorizedBookings.future.map((booking) => (
              <TicketCard
                key={booking.id}
                booking={booking}
                paymentTimeSeconds={paymentTimeSeconds}
                onPaymentComplete={handlePaymentComplete}
                onExpired={handleBookingExpired}
              />
            ))}
          </VStack>
        </VStack>
      )}

      {/* Секция: Прошедшие */}
      {categorizedBookings.past.length > 0 && (
        <VStack align="stretch" gap="4">
          <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" color="gray.400">
            Прошедшие ({categorizedBookings.past.length})
          </Text>
          <Separator borderColor="gray.700" />
          <VStack align="stretch" gap="3">
            {categorizedBookings.past.map((booking) => (
              <TicketCard
                key={booking.id}
                booking={booking}
                paymentTimeSeconds={paymentTimeSeconds}
                onPaymentComplete={handlePaymentComplete}
                onExpired={handleBookingExpired}
              />
            ))}
          </VStack>
        </VStack>
      )}

      {/* Сообщение если нет билетов */}
      {categorizedBookings.unpaid.length === 0 &&
        categorizedBookings.future.length === 0 &&
        categorizedBookings.past.length === 0 && (
          <Text color="gray.400" fontSize={{ base: "md", md: "lg" }}>
            У вас пока нет билетов. Начните с просмотра фильмов!
          </Text>
        )}
    </Box>
  );
}
