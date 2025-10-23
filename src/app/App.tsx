import { Router } from "./config/router";
import { Provider } from "../shared/ui/chakra-ui";

export function App() {
    return (
        <Provider>
            <Router />
        </Provider>
    );
}
