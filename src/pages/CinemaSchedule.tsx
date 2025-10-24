import { useEffect, memo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Box,
    VStack,
    HStack,
    Text,
    Heading,
    Separator,
    Spinner,
    Center,
    Image,
    Button
} from "@chakra-ui/react";
import { useCinemaDetails, usePrefetchCinemaData } from "../shared/hooks/useCinemaQueries";
import { getImageUrl } from "../shared/lib/api";
import { Calendar, Clock, Star } from "lucide-react";

// Мемоизированный компонент для фильма
const FilmCard = memo(({ film, onSessionClick }: {
    film: any;
    onSessionClick: (sessionId: number) => void;
}) => (
    <HStack
        gap={{ base: "4", md: "6" }}
        p={{ base: "4", md: "6" }}
        borderWidth="1px"
        borderColor="gray.700"
        borderRadius="md"
        align={{ base: "flex-start", md: "center" }}
        flexDir={{ base: "column", md: "row" }}
    >
        {/* Постер фильма */}
        <Box
            w={{ base: "80px", md: "100px" }}
            h={{ base: "120px", md: "150px" }}
            flexShrink="0"
            borderWidth="1px"
            borderColor="gray.600"
            borderRadius="md"
            overflow="hidden"
            bg="gray.800"
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
            {film.posterImage ? (
                <Image
                    src={getImageUrl(film.posterImage)}
                    alt={film.title}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    loading="lazy"
                    decoding="async"
                />
            ) : (
                <VStack gap="2" color="gray.400">
                    <Box fontSize="2xl">🎬</Box>
                    <Text fontSize="xs" textAlign="center">
                        {film.title}
                    </Text>
                </VStack>
            )}
        </Box>

        {/* Информация о фильме */}
        <VStack align={{ base: "stretch", md: "flex-start" }} gap="2" flex="1">
            <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="500">
                {film.title}
            </Text>
            <HStack gap="3" fontSize="sm" justifyContent={"space-around"} width="200px" color="gray.400">
                {film.year && <Box spaceY={'2'}><Calendar /> <Text>{film.year}</Text></Box>}
                {film.rating && <Box spaceY={'2'}><Star /> <Text>{film.rating}</Text></Box>}
                {film.lengthMinutes && <Box spaceY={'2'}><Clock /> <Text>{film.lengthMinutes} мин</Text></Box>}
            </HStack>
        </VStack>

        {/* Времена сеансов */}
        <HStack gap="3" flexWrap="wrap" justify={{ base: "center", md: "flex-end" }}>
            {film.times.map((time: string, timeIndex: number) => {
                const sessionId = film.sessionIds?.[timeIndex];
                return (
                    <Button
                        key={`${film.id}-${time}`}
                        borderColor="white"
                        borderWidth="1px"
                        bg="transparent"
                        color="white"
                        px={{ base: "4", md: "6" }}
                        py={{ base: "2", md: "3" }}
                        fontSize={{ base: "sm", md: "md" }}
                        fontWeight="500"
                        minW={{ base: "80px", md: "100px" }}
                        _hover={{ bg: "white", color: "black" }}
                        onClick={() => sessionId && onSessionClick(sessionId)}
                    >
                        {time}
                    </Button>
                );
            })}
        </HStack>
    </HStack>
));

FilmCard.displayName = 'FilmCard';

export function CinemaSchedulePage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const cinemaId = id ? parseInt(id) : 0;

    // Используем TanStack Query вместо Zustand store
    const { data: cinemaDetails, isLoading, error } = useCinemaDetails(cinemaId);

    // Предзагружаем данные для других кинотеатров
    const { prefetchCinemaDetails } = usePrefetchCinemaData();

    // Мемоизируем обработчик клика
    const handleSessionClick = useCallback((sessionId: number) => {
        navigate(`/seats/${sessionId}`);
    }, [navigate]);

    // Предзагружаем данные при монтировании
    useEffect(() => {
        if (cinemaId) {
            // Предзагружаем данные для соседних кинотеатров
            prefetchCinemaDetails(cinemaId + 1);
            prefetchCinemaDetails(cinemaId - 1);
        }
    }, [cinemaId, prefetchCinemaDetails]);

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
            <Center flex="1" flexDir="column" gap="4">
                <Text color="red.400" fontSize="lg">
                    {error instanceof Error ? error.message : "Кинотеатр не найден"}
                </Text>
                <Button
                    onClick={() => navigate("/cinemas")}
                    borderColor="white"
                    borderWidth="1px"
                    bg="transparent"
                    color="white"
                    _hover={{ bg: "white", color: "black" }}
                >
                    Назад к кинотеатрам
                </Button>
            </Center>
        );
    }

    return (
        <Box flex="1" p={{ base: "4", md: "8" }} overflowY="auto">
            {/* Заголовок кинотеатра */}
            <VStack align="stretch" gap={{ base: "4", md: "6" }} mb={{ base: "6", md: "8" }}>
                <Heading size={{ base: "lg", md: "2xl" }} textAlign="center">
                    {cinemaDetails.name}
                </Heading>
                <Separator borderColor="gray.700" />
            </VStack>

            {/* Расписание по датам */}
            <VStack align="stretch" gap={{ base: "6", md: "8" }}>
                {cinemaDetails.schedule && cinemaDetails.schedule.length > 0 ? (
                    cinemaDetails.schedule.map((day: any) => (
                        <VStack key={day.date} align="stretch" gap={{ base: "4", md: "6" }}>
                            {/* Дата */}
                            <Box>
                                <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="600" mb="2">
                                    {day.date}
                                </Text>
                                <Separator borderColor="gray.700" />
                            </Box>

                            {/* Фильмы */}
                            <VStack align="stretch" gap={{ base: "4", md: "6" }}>
                                {day.films.map((film: any) => (
                                    <FilmCard
                                        key={`${day.date}-${film.id}`}
                                        film={film}
                                        onSessionClick={handleSessionClick}
                                    />
                                ))}
                            </VStack>
                        </VStack>
                    ))
                ) : (
                    <Center py="8">
                        <Text color="gray.400" fontSize="lg">
                            Нет доступных сеансов
                        </Text>
                    </Center>
                )}
            </VStack>
        </Box>
    );
}
