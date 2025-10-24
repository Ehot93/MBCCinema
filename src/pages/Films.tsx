import { Box, SimpleGrid, VStack, Button, Text, Heading, Spinner } from "@chakra-ui/react";
import { useMovies } from "../shared/hooks/useMovieQueries";
import { FilmCard } from "../features/Films/components/FilmCard";

export function FilmsPage() {
    const { data: films, isLoading, error, refetch } = useMovies();

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
                        {error?.message || "Произошла ошибка"}
                    </Text>
                    <Button onClick={() => refetch()}>Попробовать снова</Button>
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
                {films?.map((film) => (
                    <FilmCard key={film.id} film={film} />
                ))}
            </SimpleGrid>
        </Box>
    );
}
