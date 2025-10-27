import { useNavigate } from "react-router-dom";
import { Box, VStack, Button, Text, Heading, Image, HStack } from "@chakra-ui/react";
import { Clock, Star } from "lucide-react";
import { Film } from "../../../entities/Film/types";
import { getImageUrl } from "../../../shared/lib/api";

interface FilmCardProps {
  film: Film;
}

export function FilmCard({ film }: FilmCardProps) {
  const navigate = useNavigate();

  return (
    <HStack
      gap="4"
      borderWidth="1px"
      borderColor="gray.700"
      borderRadius="lg"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{ borderColor: "white", boxShadow: "0 0 10px rgba(255,255,255,0.1)" }}
    >
      {/* Постер */}
      <Box
        h={{ base: "200px", md: "250px" }}
        overflow="hidden"
        position="relative"
        objectFit={"contain"}
      >
        <Image
          src={getImageUrl(film.posterImage || "")}
          alt={film.title || "Фильм"}
          w="100%"
          h="100%"
          objectFit={"contain"}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </Box>

      {/* Информация */}
      <VStack align="stretch" gap="3" p="4 0" flex="1" width={"100%"}>
        <VStack align="stretch" gap="1" width={"100%"}>
          <Heading size={{ base: "sm", md: "md" }} fontSize={{ base: "md", md: "lg" }}>
            {film.title}
          </Heading>
          <Text fontSize={{ base: "xs", md: "sm" }} color="gray.400">
            {film.year}
          </Text>
        </VStack>

        <VStack align="stretch" gap="1" fontSize={{ base: "xs", md: "sm" }}>
          <HStack gap="1">
            <Clock />
            <Text color="gray.300">
              Длительность:{" "}
              {film.lengthMinutes
                ? `${Math.floor(film.lengthMinutes / 60)}:${(film.lengthMinutes % 60).toString().padStart(2, "0")}`
                : "Не указано"}
            </Text>
          </HStack>
          <HStack gap="1">
            <Star color="yellow" />
            <Text color="yellow.400">
              Рейтинг: {film.rating ? film.rating.toFixed(1) : "Не указан"}
            </Text>
          </HStack>
        </VStack>

        <Text fontSize={{ base: "xs", md: "sm" }} color="gray.300" flex="1">
          {film.description}
        </Text>

        {/* Кнопка */}
        <Button
          borderColor="white"
          borderWidth="1px"
          bg="transparent"
          color="white"
          w="100%"
          mt="auto"
          fontSize={{ base: "sm", md: "md" }}
          _hover={{ bg: "white", color: "black" }}
          onClick={() => navigate(`/film/${film.id}`)}
        >
          Посмотреть сеансы
        </Button>
      </VStack>
    </HStack>
  );
}
