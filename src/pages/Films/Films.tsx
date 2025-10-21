import { useNavigate } from "react-router-dom";
import { Box, HStack, VStack, Button, Text } from "@chakra-ui/react";
import { MdImage } from "react-icons/md";

export function FilmsPage() {
    const navigate = useNavigate();
    const films = [
        {
            id: 1,
            title: "Мстители",
            duration: "2:20",
            rating: "4.21",
        },
        {
            id: 2,
            title: "Темный рыцарь",
            duration: "1:45",
            rating: "4.79",
        },
    ];

    return (
        <Box flex="1" overflowY="auto">
            {/* Заголовки колонок - видны только на десктопе */}
            <HStack
                gap={{ base: "2", md: "20" }}
                mb={{ base: "6", md: "8" }}
                pb={{ base: "3", md: "4" }}
                borderBottom="1px"
                borderColor="gray.700"
                display={{ base: "none", md: "flex" }}
                px={{ base: "4", md: "6" }}
            >
                <Box w="80px" flexShrink="0" />
                <Box w="40%">
                    <Text fontWeight="bold" fontSize="lg">
                        Название
                    </Text>
                </Box>
                <Box flex="1">
                    <Text fontWeight="bold" fontSize="lg">
                        Продолжительность
                    </Text>
                </Box>
                <Box flex="1">
                    <Text fontWeight="bold" fontSize="lg">
                        Рейтинг
                    </Text>
                </Box>
                <Box w="200px" />
            </HStack>

            {/* Таблица фильмов */}
            <VStack align="stretch" gap={{ base: "3", md: "4" }} px={{ base: "4", md: "6" }}>
                {films.map((film) => (
                    <HStack
                        key={film.id}
                        gap={{ base: "3", md: "6" }}
                        p={{ base: "3", md: "4" }}
                        borderWidth="1px"
                        borderColor="gray.700"
                        borderRadius={{ base: "md", md: "none" }}
                        align={{ base: "flex-start", md: "center" }}
                        display={{ base: "flex", md: "flex" }}
                        flexDir={{ base: "column", md: "row" }}
                    >
                        {/* Мобильная версия: все вертикально */}
                        <VStack align={{ base: "stretch", md: "flex-start" }} w={{ base: "100%", md: "auto" }} gap="2" display={{ base: "flex", md: "none" }}>
                            {/* Иконка фильма */}
                            <Box
                                w="100%"
                                h="150px"
                                bg="gray.800"
                                borderRadius="md"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                flexShrink="0"
                            >
                                <MdImage size={40} />
                            </Box>

                            {/* Название */}
                            <Box>
                                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.400">
                                    Название
                                </Text>
                                <Text w="100%" fontSize={{ base: "lg", md: "lg" }} fontWeight="500">
                                    {film.title}
                                </Text>
                            </Box>

                            {/* Продолжительность и Рейтинг */}
                            <HStack gap="8" w="100%">
                                <Box>
                                    <Text fontSize={{ base: "xs", md: "sm" }} color="gray.400">
                                        Продолжительность
                                    </Text>
                                    <Text fontSize={{ base: "md", md: "lg" }}>{film.duration}</Text>
                                </Box>

                                <Box>
                                    <Text fontSize={{ base: "xs", md: "sm" }} color="gray.400">
                                        Рейтинг
                                    </Text>
                                    <Text fontSize={{ base: "md", md: "lg" }}>{film.rating}</Text>
                                </Box>
                            </HStack>
                        </VStack>

                        {/* Иконка фильма - только на десктопе */}
                        <Box
                            w="80px"
                            h="60px"
                            bg="gray.800"
                            borderRadius="md"
                            display={{ base: "none", md: "flex" }}
                            alignItems="center"
                            justifyContent="center"
                            flexShrink="0"
                        >
                            <MdImage size={40} />
                        </Box>

                        {/* Название - только на десктопе */}
                        <Box w={{ base: "100%", md: "40%" }} display={{ base: "none", md: "block" }}>
                            <Text fontSize={{ base: "md", md: "lg" }} fontWeight="500">
                                {film.title}
                            </Text>
                        </Box>

                        {/* Продолжительность - только на десктопе */}
                        <Box flex="1" display={{ base: "none", md: "block" }}>
                            <Text fontSize={{ base: "md", md: "lg" }}>
                                {film.duration}
                            </Text>
                        </Box>

                        {/* Рейтинг - только на десктопе */}
                        <Box flex="1" display={{ base: "none", md: "block" }}>
                            <Text fontSize={{ base: "md", md: "lg" }}>
                                {film.rating}
                            </Text>
                        </Box>

                        {/* Кнопка */}
                        <Button
                            borderColor="white"
                            borderWidth="1px"
                            bg="transparent"
                            color="white"
                            px={{ base: "4", md: "6" }}
                            py={{ base: "2", md: "2" }}
                            fontSize={{ base: "sm", md: "md" }}
                            whiteSpace="nowrap"
                            _hover={{ bg: "white", color: "black" }}
                            w={{ base: "100%", md: "auto" }}
                            onClick={() => navigate(`/film/${film.id}`)}
                        >
                            Посмотреть сеансы
                        </Button>
                    </HStack>
                ))}
            </VStack>
        </Box>
    );
}
