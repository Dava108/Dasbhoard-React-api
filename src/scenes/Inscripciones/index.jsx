import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  TextField,
  useTheme,
  useMediaQuery
} from "@mui/material";

import {
  obtenerTalleresAlumno,
  obtenerHorariosAlumno,
  inscribirse,
  cancelarInscripcionAlumno
} from "../../api/api";

const Inscripciones = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [talleres, setTalleres] = useState([]);
  const [tallerSeleccionado, setTallerSeleccionado] = useState("");

  const [horarios, setHorarios] = useState([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [periodo, setPeriodo] = useState("");

  // ========================
  // CARGAS
  // ========================
  const cargarTalleres = async () => {
    const data = await obtenerTalleresAlumno();
    setTalleres(data);
  };

  const cargarHorarios = async (id) => {
    if (!id) return;

    const data = await obtenerHorariosAlumno(id);

    console.log("HORARIOS BACKEND:", data); // 🔥 DEBUG

    if (Array.isArray(data)) {
      setHorarios(data);
    } else {
      setHorarios([]);
      setError("Error cargando horarios");

    }
  };

  useEffect(() => {
    cargarTalleres();
  }, []);

  useEffect(() => {
    if (error || success) {
      const t = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);

      return () => clearTimeout(t);
    }
  }, [error, success]);

  // ========================
  // ACCIONES
  // ========================
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("USER:", user);



  const handleInscribirse = async (horario_id) => {
    const res = await inscribirse(
      horario_id,
      periodo
    );
    console.log("HORARIO QUE ENVÍO:", horario_id);

    if (res.ok) {
      setSuccess("Inscripción exitosa");
      setError("");
      cargarHorarios(tallerSeleccionado);
    } else {
      setError(res.mensaje);
      setSuccess("");
    }
  };

  const handleCancelar = async (horario_id) => {

    const user = JSON.parse(localStorage.getItem("user"));

    const res = await cancelarInscripcionAlumno(
      user.id,
      horario_id
    );

    if (res.ok) {
      setSuccess("Inscripción cancelada");
      cargarHorarios(tallerSeleccionado);
    } else {
      setError(res.mensaje);
    }
  };

  // ========================
  // RENDER BOTÓN
  // ========================
  const renderBoton = (h) => {
    if (h.inscrito === 1) {
      return (
        <>
          <Button size="small" disabled>
            Inscrito
          </Button>
          <Button
            size="small"
            color="error"
            onClick={() => handleCancelar(h.id)}
          >
            Cancelar
          </Button>
        </>
      );
    }

    if (h.inscritos >= h.cupo_total) {
      return (
        <Button size="small" disabled color="error">
          Lleno
        </Button>
      );
    }

    return (
      <Box
        display="flex"
        gap={1}
        alignItems="center"
        flexWrap="wrap"
      >

        <TextField
          select
          label="Semestre actual"
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
          size="small"
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="1">1°</MenuItem>
          <MenuItem value="2">2°</MenuItem>
          <MenuItem value="3">3°</MenuItem>
          <MenuItem value="4">4°</MenuItem>
          <MenuItem value="5">5°</MenuItem>
          <MenuItem value="6">6°</MenuItem>
          <MenuItem value="7">7°</MenuItem>
          <MenuItem value="8">8°</MenuItem>
          <MenuItem value="9">9°</MenuItem>
        </TextField>

        <Button
          size="small"
          variant="contained"
          onClick={() => {

            if (!periodo) {
              setError("Selecciona tu semestre");
              return;
            }

            handleInscribirse(h.id);

          }}
        >
          Inscribirme
        </Button>

      </Box>
    );

  };

  // ========================
  // RENDER
  // ========================
  return (
    <Box p={isMobile ? 2 : 4}>
      <Typography variant="h4" mb={3}>
        Inscripción a Talleres
      </Typography>

      {/* MENSAJES */}
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="green">{success}</Typography>}

      {/* SELECT TALLER */}
      <Typography mb={1}>Selecciona un taller</Typography>

      <Select
        fullWidth
        value={tallerSeleccionado}
        onChange={(e) => {
          const id = e.target.value;
          setTallerSeleccionado(id);
          cargarHorarios(id);
        }}
      >
        <MenuItem value="">Seleccione</MenuItem>
        {talleres.map((t) => (
          <MenuItem key={t.id} value={t.id}>
            {t.nombre} ({t.tipo})
          </MenuItem>
        ))}
      </Select>

      {/* HORARIOS */}
      <Box mt={4}>
        {Array.isArray(horarios) &&
          horarios.map((h) => {
            console.log("HORARIO ITEM:", h); // 👈 AQUÍ EXACTO

            return (
              <Box
                key={h.id}
                p={2}
                mb={2}
                borderRadius="10px"
                bgcolor="#1f2a40"
                color="white"
              >
                <Typography fontWeight="bold">
                  {h.dia_nombre} | {h.hora_inicio} - {h.hora_fin}
                </Typography>

                <Typography>Espacio: {h.espacio}</Typography>

                <Typography>
                  Cupo: {h.inscritos} / {h.cupo_total}
                </Typography>

                <Box mt={1}>{renderBoton(h)}</Box>
              </Box>
            );
          })}
      </Box>
    </Box>
  );
};

export default Inscripciones;
