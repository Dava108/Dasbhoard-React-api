import { useState } from "react";
import PrivateRoute from "./components/PrivateRoute";
import RoleRoute from "./components/RoleRoute";
import { useLocation } from "react-router-dom";
import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from "@mui/material"
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import { Routes, Route } from "react-router-dom";
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
import { Navigate } from "react-router-dom";
import Configuracion from "./scenes/configuracion";
import Usuarios from "./scenes/usuarios/index.jsx";
import TalleresAdmin from "./scenes/talleres";












function App() {
  const [theme, colorMode] = useMode();
  const [isOpen, setIsOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";



  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* <div className="app">
          <Sidebar />
          <main className="content" style={{ flexGrow: 1, height: "100vh", overflow: "auto" }}>
            <Topbar /> */}
        <div className="app">
          {user && !isLoginPage && (
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
          )}

          <main className="content" style={{ flexGrow: 1, height: "100vh", overflow: "auto" }}>
            {user && !isLoginPage && (
              <Topbar onMenuClick={() => setIsOpen(prev => !prev)} />
            )}

            <Routes>
              {/* Ruta inicial inteligente */}
              <Route
                path="/"
                element={
                  JSON.parse(localStorage.getItem("user"))
                    ? <Navigate to="/Dashboard" replace />
                    : <Navigate to="/login" replace />
                }
              />

              <Route path="/login" element={<Login />} />

              <Route
                path="/Dashboard"
                element={
                  <PrivateRoute>
                    <RoleRoute role="admin">
                      <Dashboard />
                    </RoleRoute>
                  </PrivateRoute>
                }
              />

              <Route
                path="/team"
                element={
                  <PrivateRoute>
                    <RoleRoute role="admin">
                      <Team />
                    </RoleRoute>
                  </PrivateRoute>
                }
              />
              <Route
                path="/alumno"
                element={
                  <RoleRoute role="alumno">
                    <Alumno />
                  </RoleRoute>
                }
              />

              <Route
                path="/configuracion"
                element={
                  <PrivateRoute>
                    <Configuracion />
                  </PrivateRoute>
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
                    <TalleresAdmin />
                  </RoleRoute>
                }
              />

              <Route path="/contacts" element={<Contacts />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/form" element={<Form />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/geography" element={<Geography />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/Testapi" element={<TestApi />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
