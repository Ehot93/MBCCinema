import { useEffect } from "react";
import { Box, SimpleGrid, VStack, Button, Text, Heading, Spinner } from "@chakra-ui/react";
import { useFilmStore } from "../entities/Film";
import { FilmCard } from "../features/Films/components/FilmCard";

export function FilmsPage() {
    const { films, isLoading, error, fetchFilms } = useFilmStore();

    useEffect(() => {
        fetchFilms();
    }, [fetchFilms]);

    if (isLoading) {
        return (
            <Box
                flex="1"
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={{ base: "4", md: "8" }}
            >
                <Spinner size="xl" color="blue.500" />
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                flex="1"
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={{ base: "4", md: "8" }}
            >
                <VStack gap="4">
                    <Text color="red.400" fontSize="lg">
                        {error}
                    </Text>
                    <Button onClick={() => fetchFilms()}>Попробовать снова</Button>
                </VStack>
            </Box>
        );
    }

    return (
        <Box flex="1" overflowY="auto" p={{ base: "4", md: "8" }}>
            <Heading size={{ base: "lg", md: "2xl" }} mb={{ base: "6", md: "8" }}>
                Фильмы в прокате
            </Heading>

            <SimpleGrid minChildWidth='sm' gap={{ base: "4", md: "6" }}>
                {films.map((film) => (
                    <FilmCard key={film.id} film={film} />
                ))}
            </SimpleGrid>
        </Box>
    );
}
