import { Outlet } from "react-router-dom";
import { App } from "./App.tsx";

export function Layout() {
  return (
    <App>
      <Outlet />
    </App>
  );
}
