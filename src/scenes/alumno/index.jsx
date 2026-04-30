import {
  Box,
  Typography,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Button
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

import { getHistorialAlumno, generarConstancia } from "../../api/api";

const Alumno = () => {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [historial, setHistorial] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const totalCreditos = historial.reduce(
    (sum, a) => sum + Number(a.creditos || 0),
    0
  );

  useEffect(() => {
    if (user) {
      getHistorialAlumno(user.id).then(setHistorial);
    }
  }, []);

  // construir kardex
  const construirKardex = () => {
    const kardex = [];

    for (let i = 1; i <= 14; i++) {
      const actividades = historial.filter(
        (h) => Number(h.periodo_id) === i
      );

      kardex.push({
        id: i,
        semestre: i,
        act1: actividades[0]?.actividad || "",
        act2: actividades[1]?.actividad || "",
        creditos: actividades.reduce(
          (sum, a) => sum + Number(a.creditos || 0),
          0
        )
      });
    }

    return kardex;
  };

  const kardexColumns = [
    { field: "semestre", headerName: "Semestre", width: 100 },
    { field: "act1", headerName: "Actividad 1", flex: 1 },
    { field: "act2", headerName: "Actividad 2", flex: 1 },
    { field: "creditos", headerName: "Créditos", width: 120 },
  ];

  return (
    <Box m={isMobile ? "10px" : "20px"}>

      <Typography variant={isMobile ? "h5" : "h4"} mb="20px">
        Bienvenido {user?.nombre}
      </Typography>

      <Typography variant={isMobile ? "h6" : "h5"}>
        Progreso: {totalCreditos} / 5
      </Typography>

      <LinearProgress
        variant="determinate"
        value={(totalCreditos / 5) * 100}
        sx={{
          height: 10,
          borderRadius: 5,
          mt: 2,
          backgroundColor: '#e0e0e0', // Color del fondo de la barra (opcional)
          '& .MuiLinearProgress-bar': {
            backgroundColor: 'green', // Aquí defines el color verde
          }
        }}
      />

      {totalCreditos >= 5 && (
        <Typography color="green" mt="10px">
          Créditos completos ✅
        </Typography>
      )}

      {totalCreditos >= 5 && (
        <Button
          fullWidth={isMobile}
          variant="contained"
          color="success"
          sx={{ mt: 2 }}
          onClick={() => generarConstancia(user.id)}
        >
          Descargar Constancia
        </Button>
      )}

      <Box mt="30px">
        <Typography variant="h5">Tu Kardex</Typography>

        {isMobile ? (
          construirKardex().map((row) => (
            <Box
              key={row.id}
              p={2}
              mb={2}
              borderRadius="10px"
              bgcolor="#1f2a40"
            >
              <Typography variant="h6">
                Semestre {row.semestre}
              </Typography>

              <Typography>
                Actividad 1: {row.act1 || "N/A"}
              </Typography>

              <Typography>
                Actividad 2: {row.act2 || "N/A"}
              </Typography>

              <Typography fontWeight="bold">
                Créditos: {row.creditos}
              </Typography>
            </Box>
          ))
        ) : (
          <DataGrid
            rows={construirKardex()}
            columns={kardexColumns}
            autoHeight
            hideFooter
          />
        )}
      </Box>

    </Box>
  );
};

export default Alumno;