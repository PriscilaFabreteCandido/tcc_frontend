import { Fragment } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import routes from "./routes.tsx";

import Login from "../views/app/Login/Login";
import SessionService from "../services/SessionService.tsx";
import RootLayout from "../layout/index.tsx";
import AlertListener from "../components/alertlistener/AlertListener.tsx";

export default function AppRoutes() {
  const isAuthenticated = new SessionService().getSession().isAuthenticated

  return (
    <BrowserRouter>
      <AlertListener />
      <Fragment>
        <Routes>
          {!isAuthenticated ? (
            <Route element={<RootLayout />}>
              {/* Renderiza as rotas dentro de RootLayout */}
              {routes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element}>
                  {route.children &&
                    route.children.map((child) => (
                      <Route
                        key={child.path}
                        path={child.path}
                        element={child.element}
                      />
                    ))}
                </Route>
              ))}
            </Route>
          ) : (
            <Route path="*" element={<Login />} />
          )}
        </Routes>
      </Fragment>
    </BrowserRouter>
  );
}
