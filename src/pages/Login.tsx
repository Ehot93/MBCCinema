import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Flex, VStack, Input, Button, Text, Heading, Fieldset } from "@chakra-ui/react";
import { useAuthStore } from "../entities/User";

// Схема валидации
const loginSchema = yup.object().shape({
    username: yup.string().required("Логин обязателен"),
    password: yup
        .string()
        .min(8, "Пароль должен быть минимум 8 символов")
        .required("Пароль обязателен"),
});

type LoginFormInputs = yup.InferType<typeof loginSchema>;

export function LoginPage() {
    const navigate = useNavigate();
    const { login, isLoading, error: storeError } = useAuthStore();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormInputs>({
        resolver: yupResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormInputs) => {
        try {
            await login(data);
            // После успешного входа переходим на страницу билетов
            navigate("/tickets");
        } catch (err) {
            // Ошибка уже в store
            console.error("Ошибка входа:", err);
        }
    };

    return (
        <Flex
            h="100vh"
            color="white"
            align="center"
            justify="center"
            p={{ base: "4", md: "0" }}
        >
            <VStack
                gap={{ base: "6", md: "8" }}
                w="100%"
                maxW={{ base: "100%", md: "400px" }}
                px={{ base: "4", md: "6" }}
            >
                {/* Заголовок */}
                <Heading size={{ base: "lg", md: "2xl" }} color="white">
                    Вход
                </Heading>

                {/* Форма входа */}
                <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
                    <VStack gap={{ base: "4", md: "6" }} w="100%">
                        {/* Логин */}
                        <Fieldset.Root w="100%">
                            <Fieldset.Legend fontSize={{ base: "sm", md: "md" }} mb={{ base: "2", md: "3" }}>
                                Логин
                            </Fieldset.Legend>
                            <Input
                                type="text"
                                placeholder="Введите логин"
                                {...register("username")}
                                bg="gray.900"
                                borderColor={errors.username ? "red.600" : "gray.700"}
                                borderWidth="1px"
                                _focusVisible={{
                                    borderColor: errors.username ? "red.500" : "blue.500",
                                    boxShadow: errors.username
                                        ? "0 0 0 1px rgba(239, 68, 68, 0.5)"
                                        : "0 0 0 1px rgba(59, 130, 246, 0.5)",
                                }}
                                _hover={{
                                    borderColor: errors.username ? "red.700" : "gray.600",
                                }}
                                py={{ base: "2", md: "2.5" }}
                                px={{ base: "3", md: "4" }}
                                fontSize={{ base: "sm", md: "md" }}
                            />
                            {errors.username && (
                                <Text fontSize={{ base: "xs", md: "sm" }} color="red.400" mt="2">
                                    {errors.username.message}
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
                                borderColor={errors.password ? "red.600" : "gray.700"}
                                borderWidth="1px"
                                _focusVisible={{
                                    borderColor: errors.password ? "red.500" : "blue.500",
                                    boxShadow: errors.password
                                        ? "0 0 0 1px rgba(239, 68, 68, 0.5)"
                                        : "0 0 0 1px rgba(59, 130, 246, 0.5)",
                                }}
                                _hover={{
                                    borderColor: errors.password ? "red.700" : "gray.600",
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

                        {/* Ошибка из store */}
                        {storeError && (
                            <Text fontSize={{ base: "sm", md: "md" }} color="red.400" w="100%">
                                {storeError}
                            </Text>
                        )}

                        {/* Кнопка входа */}
                        <Button
                            type="submit"
                            w={{ base: "100%", md: "auto" }}
                            bg="transparent"
                            borderColor="white"
                            borderWidth="1px"
                            color="white"
                            py={{ base: "2", md: "2.5" }}
                            px={{ base: "6", md: "8" }}
                            fontSize={{ base: "md", md: "md" }}
                            fontWeight="500"
                            disabled={isLoading}
                            _hover={{
                                bg: isLoading ? "transparent" : "white",
                                color: isLoading ? "white" : "black",
                            }}
                            _active={{
                                bg: "gray.200",
                            }}
                        >
                            {isLoading ? "Загрузка..." : "Войти"}
                        </Button>
                    </VStack>
                </form>

                {/* Ссылка на регистрацию */}
                <Text fontSize={{ base: "sm", md: "md" }} color="gray.300">
                    Нет аккаунта?{" "}
                    <Text
                        as="span"
                        color="blue.400"
                        cursor="pointer"
                        _hover={{ color: "blue.300", textDecoration: "underline" }}
                        onClick={() => navigate("/register")}
                    >
                        Зарегистрируйтесь
                    </Text>
                </Text>
            </VStack>
        </Flex>
    );
}
