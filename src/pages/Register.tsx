import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Flex, VStack, Input, Button, Text, Heading, Fieldset } from "@chakra-ui/react";
import { useAuthStore } from "../entities/User";

// Схема валидации
const registerSchema = yup.object().shape({
    email: yup
        .string()
        .email("Введите корректный email")
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email должен содержать доменную зону (например: .com, .ru)")
        .required("Email обязателен"),
    username: yup
        .string()
        .min(8, "Логин должен быть минимум 8 символов")
        .required("Логин обязателен"),
    password: yup
        .string()
        .min(8, "Пароль должен быть минимум 8 символов")
        .matches(/[A-Z]/, "Пароль должен содержать минимум 1 заглавную букву")
        .matches(/[0-9]/, "Пароль должен содержать минимум 1 цифру")
        .required("Пароль обязателен"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Пароли не совпадают")
        .required("Подтверждение пароля обязательно"),
});

type RegisterFormInputs = yup.InferType<typeof registerSchema>;

export function RegisterPage() {
    const navigate = useNavigate();
    const { register: registerUser, isLoading, error: storeError } = useAuthStore();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormInputs>({
        resolver: yupResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormInputs) => {
        try {
            await registerUser({
                email: data.email,
                username: data.username,
                password: data.password,
            });
            // После успешной регистрации переходим на страницу билетов
            navigate("/tickets");
        } catch (err) {
            // Ошибка уже в store
            console.error("Ошибка регистрации:", err);
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
                    Регистрация
                </Heading>

                {/* Форма регистрации */}
                <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
                    <VStack gap={{ base: "4", md: "6" }} w="100%">
                        {/* Email */}
                        <Fieldset.Root w="100%">
                            <Fieldset.Legend fontSize={{ base: "sm", md: "md" }} mb={{ base: "2", md: "3" }}>
                                Email
                            </Fieldset.Legend>
                            <Input
                                type="email"
                                placeholder="Введите email"
                                {...register("email")}
                                bg="gray.900"
                                borderColor={errors.email ? "red.600" : "gray.700"}
                                borderWidth="1px"
                                _focusVisible={{
                                    borderColor: errors.email ? "red.500" : "blue.500",
                                    boxShadow: errors.email
                                        ? "0 0 0 1px rgba(239, 68, 68, 0.5)"
                                        : "0 0 0 1px rgba(59, 130, 246, 0.5)",
                                }}
                                _hover={{
                                    borderColor: errors.email ? "red.700" : "gray.600",
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

                        {/* Подтверждение пароля */}
                        <Fieldset.Root w="100%">
                            <Fieldset.Legend fontSize={{ base: "sm", md: "md" }} mb={{ base: "2", md: "3" }}>
                                Подтверждение пароля
                            </Fieldset.Legend>
                            <Input
                                type="password"
                                placeholder="Подтвердите пароль"
                                {...register("confirmPassword")}
                                bg="gray.900"
                                borderColor={errors.confirmPassword ? "red.600" : "gray.700"}
                                borderWidth="1px"
                                _focusVisible={{
                                    borderColor: errors.confirmPassword ? "red.500" : "blue.500",
                                    boxShadow: errors.confirmPassword
                                        ? "0 0 0 1px rgba(239, 68, 68, 0.5)"
                                        : "0 0 0 1px rgba(59, 130, 246, 0.5)",
                                }}
                                _hover={{
                                    borderColor: errors.confirmPassword ? "red.700" : "gray.600",
                                }}
                                py={{ base: "2", md: "2.5" }}
                                px={{ base: "3", md: "4" }}
                                fontSize={{ base: "sm", md: "md" }}
                            />
                            {errors.confirmPassword && (
                                <Text fontSize={{ base: "xs", md: "sm" }} color="red.400" mt="2">
                                    {errors.confirmPassword.message}
                                </Text>
                            )}
                        </Fieldset.Root>

                        {/* Ошибка из store */}
                        {storeError && (
                            <Text fontSize={{ base: "sm", md: "md" }} color="red.400" w="100%">
                                {storeError}
                            </Text>
                        )}

                        {/* Кнопка регистрации */}
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
                            {isLoading ? "Загрузка..." : "Зарегистрироваться"}
                        </Button>
                    </VStack>
                </form>

                {/* Ссылка на вход */}
                <Text fontSize={{ base: "sm", md: "md" }} color="gray.300">
                    Если вы уже зарегистрированы{" "}
                    <Text
                        as="span"
                        color="blue.400"
                        cursor="pointer"
                        _hover={{ color: "blue.300", textDecoration: "underline" }}
                        onClick={() => navigate("/login")}
                    >
                        войдите
                    </Text>
                </Text>
            </VStack>
        </Flex>
    );
}
