import { useState, useContext } from "react";
import { useLocation, Routes, Route, Navigate } from "react-router-dom";

import { CssBaseline, ThemeProvider } from "@mui/material";

import { ColorModeContext, useMode } from "./theme";

import { AuthContext } from "./context/AuthContext";

import RoleRoute from "./components/RoleRoute";

import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";

import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Alumno from "./scenes/alumno/index.jsx";
import Invoices from "./scenes/invoices";
import Form from "./scenes/form";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import Calendar from "./scenes/calendar/calendar.jsx";
import TestApi from "./scenes/pages/Testapi.jsx";
import Login from "./scenes/login";
import Configuracion from "./scenes/configuracion";
import Usuarios from "./scenes/usuarios/index.jsx";
import AdminIndex from "./scenes/talleres";
import Inscripciones from "./scenes/Inscripciones/index.jsx";
import HistorialAlumno from "./scenes/alumno/historial/index.jsx";
import HorariosLote from "./scenes/admin/horarios_lote/index.jsx";


function App() {
  const [theme, colorMode] = useMode();

  const [isOpen, setIsOpen] = useState(false);

  const { user } = useContext(AuthContext);

  const location = useLocation();

  const isLoginPage = location.pathname === "/login";

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <div className="app">
          {/* SIDEBAR */}
          {user && !isLoginPage && (
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
          )}

          {/* CONTENT */}
          <main
            className="content"
            style={{
              flexGrow: 1,
              height: "100vh",
              overflow: "auto"
            }}
          >
            {/* TOPBAR */}
            {user && !isLoginPage && (
              <Topbar
                onMenuClick={() =>
                  setIsOpen((prev) => !prev)
                }
              />
            )}

            <Routes>

              {/* ========================= */}
              {/* REDIRECT INICIAL */}
              {/* ========================= */}
              <Route
                path="/"
                element={
                  user ? (
                    user.rol === "admin" ? (
                      <Navigate to="/dashboard" replace />
                    ) : (
                      <Navigate to="/alumno" replace />
                    )
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              {/* ========================= */}
              {/* LOGIN */}
              {/* ========================= */}
              <Route
                path="/login"
                element={<Login />}
              />

              {/* ========================= */}
              {/* ADMIN */}
              {/* ========================= */}

              <Route
                path="/dashboard"
                element={
                  <RoleRoute role="admin">
                    <Dashboard />
                  </RoleRoute>
                }
              />
              <Route
                path="/talleres/nuevo"
                element={
                  <RoleRoute role="admin">
                    <HorariosLote />
                  </RoleRoute>
                }
              />

              <Route
                path="/team"
                element={
                  <RoleRoute role="admin">
                    <Team />
                  </RoleRoute>
                }
              />

              <Route
                path="/usuarios"
                element={
                  <RoleRoute role="admin">
                    <Usuarios />
                  </RoleRoute>
                }
              />

              <Route
                path="/talleres"
                element={
                  <RoleRoute role="admin">
                    <AdminIndex />
                  </RoleRoute>
                }
              />

              <Route
                path="/configuracion"
                element={
                  <RoleRoute role="admin">
                    <Configuracion />
                  </RoleRoute>
                }
              />

              <Route
                path="/contacts"
                element={
                  <RoleRoute role="admin">
                    <Contacts />
                  </RoleRoute>
                }
              />

              <Route
                path="/invoices"
                element={
                  <RoleRoute role="admin">
                    <Invoices />
                  </RoleRoute>
                }
              />

              <Route
                path="/form"
                element={
                  <RoleRoute role="admin">
                    <Form />
                  </RoleRoute>
                }
              />

              <Route
                path="/bar"
                element={
                  <RoleRoute role="admin">
                    <Bar />
                  </RoleRoute>
                }
              />

              <Route
                path="/pie"
                element={
                  <RoleRoute role="admin">
                    <Pie />
                  </RoleRoute>
                }
              />

              <Route
                path="/line"
                element={
                  <RoleRoute role="admin">
                    <Line />
                  </RoleRoute>
                }
              />

              <Route
                path="/faq"
                element={
                  <RoleRoute role="admin">
                    <FAQ />
                  </RoleRoute>
                }
              />

              <Route
                path="/geography"
                element={
                  <RoleRoute role="admin">
                    <Geography />
                  </RoleRoute>
                }
              />

              <Route
                path="/calendar"
                element={
                  <RoleRoute role="admin">
                    <Calendar />
                  </RoleRoute>
                }
              />

              <Route
                path="/testapi"
                element={
                  <RoleRoute role="admin">
                    <TestApi />
                  </RoleRoute>
                }
              />

              {/* ========================= */}
              {/* ALUMNO */}
              {/* ========================= */}

              <Route
                path="/alumno"
                element={
                  <RoleRoute role="alumno">
                    <Alumno />
                  </RoleRoute>
                }
              />

              <Route
                path="/inscripciones"
                element={
                  <RoleRoute role="alumno">
                    <Inscripciones />
                  </RoleRoute>
                }
              />
              <Route
                path="/alumno/historial"
                element={<HistorialAlumno />}
              />

              {/* ========================= */}
              {/* 404 */}
              {/* ========================= */}

              <Route
                path="*"
                element={<Navigate to="/" replace />}
              />

            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;