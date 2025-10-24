import { Router } from "./config/router";
import { Provider } from "../shared/ui/chakra-ui";
import { QueryProvider } from "../shared/providers/QueryProvider";

export function App() {
    return (
        <QueryProvider>
            <Provider>
                <Router />
            </Provider>
        </QueryProvider>
    );
}
