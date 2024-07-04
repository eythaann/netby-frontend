import { Link, Outlet } from "react-router-dom";

import cs from "./app.module.css";
import { Button } from "antd";
import { useToken } from "./modules/Shared/application/hooks";

export function AppLayout() {
  const token = useToken();

  function onLogout() {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("storage"));
  }

  return (
    <>
      <header className={cs.header}>
        <Link to="/" className={cs.title}>
          Netby Client
        </Link>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              {token ? (
                <Button type="text" onClick={onLogout} size="small">
                  Logout
                </Button>
              ) : (
                <Link to="/login">Login</Link>
              )}
            </li>
          </ul>
        </nav>
      </header>
      <Outlet />
      <footer></footer>
    </>
  );
}
