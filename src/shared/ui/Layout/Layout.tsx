import { Outlet } from "react-router-dom";
import { Sidebar } from "../Sidebar/Sidebar";
import { Flex } from "@chakra-ui/react";

export function Layout() {
    return (
        <Flex h="100vh" w="100vw" bg="black" color="white" flexDir={{ base: "column", md: "row" }}>
            <Sidebar />
            <Flex flex="1" flexDir="column" overflowY="auto" w={{ base: "100%", md: "auto" }} p={{ base: "4", md: "8" }} h="100%">
                <Outlet />
            </Flex>
        </Flex>
    );
}
