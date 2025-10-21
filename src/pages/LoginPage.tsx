import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Flex,
  VStack,
  Input,
  Button,
  Text,
  Heading,
  Fieldset,
} from "@chakra-ui/react";

// Схема валидации
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Введите корректный email")
    .required("Email обязателен"),
  password: yup
    .string()
    .min(8, "Пароль должен быть минимум 8 символов")
    .required("Пароль обязателен"),
});

type LoginFormInputs = yup.InferType<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormInputs) => {
    // В реальном приложении здесь будет API запрос
    console.log("Login data:", data);
    navigate("/");
  };

  return (
    <Box flex="1" p={{ base: "4", md: "8" }} overflowY="auto">
      <Flex
        flexDir="column"
        align="center"
        justify="center"
        minH="100%"
        py={{ base: "8", md: "12" }}
      >
        <VStack
          gap={{ base: "6", md: "8" }}
          w="100%"
          maxW={{ base: "100%", md: "500px" }}
          px={{ base: "4", md: "0" }}
        >
          {/* Заголовок */}
          <Heading size={{ base: "lg", md: "2xl" }} color="white" w="100%">
            Вход
          </Heading>

          {/* Форма входа */}
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
            <VStack gap={{ base: "5", md: "6" }} w="100%">
              {/* Email */}
              <Fieldset.Root w="100%">
                <Fieldset.Legend fontSize={{ base: "sm", md: "md" }} mb={{ base: "2", md: "3" }}>
                  Логин
                </Fieldset.Legend>
                <Input
                  type="email"
                  placeholder="Введите логин"
                  {...register("email")}
                  bg="gray.900"
                  borderColor="gray.700"
                  borderWidth="1px"
                  _focusVisible={{
                    borderColor: "blue.500",
                    boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.5)",
                  }}
                  _hover={{
                    borderColor: "gray.600",
                  }}
                  py={{ base: "2", md: "2.5" }}
                  px={{ base: "3", md: "4" }}
                  fontSize={{ base: "sm", md: "md" }}
                />
                {errors.email && (
                  <Text fontSize={{ base: "xs", md: "sm" }} color="red.400" mt="2">
                    {errors.email.message}
                  </Text>
                )}
              </Fieldset.Root>

              {/* Пароль */}
              <Fieldset.Root w="100%">
                <Fieldset.Legend fontSize={{ base: "sm", md: "md" }} mb={{ base: "2", md: "3" }}>
                  Пароль
                </Fieldset.Legend>
                <Input
                  type="password"
                  placeholder="Введите пароль"
                  {...register("password")}
                  bg="gray.900"
                  borderColor="gray.700"
                  borderWidth="1px"
                  _focusVisible={{
                    borderColor: "blue.500",
                    boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.5)",
                  }}
                  _hover={{
                    borderColor: "gray.600",
                  }}
                  py={{ base: "2", md: "2.5" }}
                  px={{ base: "3", md: "4" }}
                  fontSize={{ base: "sm", md: "md" }}
                />
                {errors.password && (
                  <Text fontSize={{ base: "xs", md: "sm" }} color="red.400" mt="2">
                    {errors.password.message}
                  </Text>
                )}
              </Fieldset.Root>

              {/* Кнопка входа */}
              <Button
                type="submit"
                w={{ base: "100%", md: "auto" }}
                minW={{ base: "auto", md: "120px" }}
                bg="transparent"
                borderColor="white"
                borderWidth="1px"
                color="white"
                py={{ base: "2", md: "2.5" }}
                px={{ base: "4", md: "6" }}
                fontSize={{ base: "sm", md: "md" }}
                fontWeight="500"
                _hover={{
                  bg: "white",
                  color: "black",
                }}
                _active={{
                  bg: "gray.200",
                }}
                mt={{ base: "4", md: "6" }}
              >
                Войти
              </Button>
            </VStack>
          </form>

          {/* Ссылка на регистрацию */}
          <Text fontSize={{ base: "sm", md: "md" }} color="gray.300" mt={{ base: "4", md: "8" }}>
            Если у вас нет аккаунта{" "}
            <Text
              as="span"
              color="blue.400"
              cursor="pointer"
              _hover={{ color: "blue.300", textDecoration: "underline" }}
              onClick={() => navigate("/register")}
            >
              зарегистрируйтесь
            </Text>
          </Text>
        </VStack>
      </Flex>
    </Box>
  );
}
