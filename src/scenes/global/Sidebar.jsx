import { useState, useEffect } from "react";
import { Box, IconButton, Typography, useTheme, Divider } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { tokens } from "../../theme";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

// Icons
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlinedIcon from "@mui/icons-material/HelpOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import CloseIcon from "@mui/icons-material/Close";

// ─── helpers ──────────────────────────────────────────────────────────────────
const obtenerNombres = (nombreCompleto) => {
  if (!nombreCompleto) return "";
  const partes = nombreCompleto.trim().split(" ");
  return partes.slice(-2).join(" ");
};

// ─── Item ─────────────────────────────────────────────────────────────────────
const Item = ({ title, to, icon, selected, setSelected, onNavigate }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isActive = selected === title;

  return (
    <Link
      to={to}
      style={{ textDecoration: "none" }}
      onClick={() => {
        setSelected(title);
        onNavigate?.();
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        gap="12px"
        px="16px"
        py="10px"
        borderRadius="8px"
        mx="8px"
        sx={{
          cursor: "pointer",
          backgroundColor: isActive
            ? `${colors.blueAccent[700]}40`
            : "transparent",
          color: isActive ? colors.blueAccent[300] : colors.grey[200],
          borderLeft: isActive
            ? `3px solid ${colors.blueAccent[400]}`
            : "3px solid transparent",
          transition: "all 0.18s ease",
          "&:hover": {
            backgroundColor: `${colors.primary[300]}30`,
            color: colors.blueAccent[300],
            transform: "translateX(3px)",
          },
        }}
      >
        <Box sx={{ display: "flex", fontSize: "20px", flexShrink: 0 }}>
          {icon}
        </Box>
        <Typography fontSize="14px" fontWeight={isActive ? 600 : 400}>
          {title}
        </Typography>
      </Box>
    </Link>
  );
};

// ─── Section label ─────────────────────────────────────────────────────────────
const SectionLabel = ({ label, colors }) => (
  <Typography
    variant="caption"
    sx={{
      px: "24px",
      pt: "18px",
      pb: "4px",
      display: "block",
      color: colors.grey[500],
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      fontSize: "10px",
      fontWeight: 600,
    }}
  >
    {label}
  </Typography>
);

// ─── Sidebar ───────────────────────────────────────────────────────────────────
const Sidebar = ({isOpen, setIsOpen}) => {
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  // const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  const SIDEBAR_WIDTH = 260;

  const rolTexto = {
    admin: "Administrador",
    promotor: "Promotor",
    alumno: "Alumno",
  };

  const nombreMostrar = obtenerNombres(user?.nombre);

  // Cerrar con Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Cerrar al cambiar de ruta (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* ── Hamburger trigger (siempre visible) ── */}
      <Box
        // sx={{
        //   position: "fixed",
        //   top: "12px",
        //   left: "12px",
        //   zIndex: 1400,
        // }}
      >
        {/* <IconButton
          onClick={() => setIsOpen((p) => !p)}
          size="small"
          sx={{
            backgroundColor: colors.primary[400],
            borderRadius: "8px",
            width: 38,
            height: 38,
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            color: colors.grey[100],
            "&:hover": {
              backgroundColor: colors.primary[300],
            },
            transition: "background 0.2s",
          }}
        >
          {isOpen ? (
            <CloseIcon fontSize="small" />
          ) : (
            <MenuOutlinedIcon fontSize="small" />
          )}
        </IconButton> */}
      </Box>

      {/* ── Backdrop ── */}
      <Box
        onClick={() => setIsOpen(false)}
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: 1200,
          backgroundColor: "rgba(0,0,0,0.45)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.3s ease",
          backdropFilter: isOpen ? "blur(2px)" : "none",
        }}
      />

      {/* ── Drawer panel ── */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: `${SIDEBAR_WIDTH}px`,
          zIndex: 1300,
          backgroundColor: colors.primary[400],
          borderRight: `1px solid ${colors.primary[300]}40`,
          transform: isOpen ? "translateX(0)" : `translateX(-${SIDEBAR_WIDTH}px)`,
          transition: "transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          overflowX: "hidden",
          boxShadow: isOpen ? "4px 0 24px rgba(0,0,0,0.3)" : "none",
        }}
      >
        {/* Header */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          px="16px"
          py="14px"
          sx={{ borderBottom: `1px solid ${colors.primary[300]}30` }}
        >
          <Typography
            variant="h3"
            fontWeight={700}
            color={colors.grey[100]}
            letterSpacing="-0.3px"
          >
            {rolTexto[user?.rol] || "Usuario"}
          </Typography>
          <IconButton
            size="small"
            onClick={() => setIsOpen(false)}
            sx={{ color: colors.grey[400], borderRadius: "6px" }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Avatar + nombre */}
        <Box
          display="flex"
          alignItems="center"
          gap="12px"
          px="16px"
          py="16px"
          sx={{ borderBottom: `1px solid ${colors.primary[300]}20` }}
        >
          <Box
            component="img"
            src="../../assets/user.png"
            alt="avatar"
            sx={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              objectFit: "cover",
              border: `2px solid ${colors.blueAccent[500]}`,
            }}
          />
          <Box>
            <Typography
              fontSize="14px"
              fontWeight={600}
              color={colors.grey[100]}
              lineHeight={1.2}
            >
              {nombreMostrar}
            </Typography>
            <Typography fontSize="12px" color={colors.greenAccent[400]}>
              {rolTexto[user?.rol] || "Usuario"}
            </Typography>
          </Box>
        </Box>

        {/* Nav items */}
        <Box flex={1} py="8px">
          {user?.rol === "admin" && (
            <>
              <SectionLabel label="General" colors={colors} />
              <Item title="Dashboard" to="/dashboard" icon={<HomeOutlinedIcon />} selected={selected} setSelected={setSelected} onNavigate={() => setIsOpen(false)} />

              <SectionLabel label="Créditos escolares" colors={colors} />
              <Item title="Alumnos" to="/team" icon={<PeopleOutlinedIcon />} selected={selected} setSelected={setSelected} onNavigate={() => setIsOpen(false)} />

              <SectionLabel label="Talleres Escolares" colors={colors} />
              <Item title="Horarios" to="/talleres" icon={<CalendarTodayOutlinedIcon />} selected={selected} setSelected={setSelected} onNavigate={() => setIsOpen(false)} />
              <Item title="FAQ" to="/faq" icon={<HelpOutlinedIcon />} selected={selected} setSelected={setSelected} onNavigate={() => setIsOpen(false)} />
              <Item title="Calendario" to="/calendar" icon={<CalendarTodayOutlinedIcon />} selected={selected} setSelected={setSelected} onNavigate={() => setIsOpen(false)} />
              

              <SectionLabel label="Usuarios" colors={colors} />
              <Item title="Usuarios" to="/usuarios" icon={<ContactsOutlinedIcon />} selected={selected} setSelected={setSelected} onNavigate={() => setIsOpen(false)} />
            </>
          )}

          {user?.rol === "alumno" && (
            <>
              <SectionLabel label="General" colors={colors} />
              <Item title="Inscripcion" to="/inscripciones" icon={<HomeOutlinedIcon />} selected={selected} setSelected={setSelected} onNavigate={() => setIsOpen(false)} />
              
              <SectionLabel label="Créditos" colors={colors} />
              <Item title="Mi Kardex" to="/alumno" icon={<PersonOutlinedIcon />} selected={selected} setSelected={setSelected} onNavigate={() => setIsOpen(false)} />

              <SectionLabel label="Mis actividades" colors={colors} />
              <Item title="Calendario" to="/calendar" icon={<CalendarTodayOutlinedIcon />} selected={selected} setSelected={setSelected} onNavigate={() => setIsOpen(false)} />
            </>
          )}

          {user?.rol === "promotor" && (
            <>
              <SectionLabel label="Créditos" colors={colors} />
              <Item title="Registrar créditos" to="/team" icon={<PeopleOutlinedIcon />} selected={selected} setSelected={setSelected} onNavigate={() => setIsOpen(false)} />
            </>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Sidebar;