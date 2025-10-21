import { Router } from "./config/router";
import { Provider } from "../components/ui/provider";

export function App() {
    return (
        <Provider>
            <Router />
        </Provider>
    );
}
