import {
  Box,
  Typography,
  useTheme,
  TextField,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";



import { generarConstancia } from "../../api/api";

import {
  crearRegistro,
  actualizarRegistro,
  eliminarRegistro,
  getAlumnos,
  getAlumnosFiltrados,
  getHistorialAlumno,
  importarAlumnos,
  importarKardex
} from "../../api/api";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [file, setFile] = useState(null);

  const [busqueda, setBusqueda] = useState("");

  const [rows, setRows] = useState([]);
  const [historial, setHistorial] = useState([]);

  const totalCreditos = historial.reduce(
    (sum, a) => sum + Number(a.creditos || 0),
    0
  );
  const [generacion, setGeneracion] = useState("");

  const [carrera, setCarrera] = useState("");
  const [periodo, setPeriodo] = useState("");


  const [fileKardex, setFileKardex] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [semestreSeleccionado, setSemestreSeleccionado] = useState(null);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);

  const [actividadExtra, setActividadExtra] = useState("");
  const [creditos, setCreditos] = useState("");

  const [registroEditar, setRegistroEditar] = useState(null);


  const rowsFiltrados = rows.filter((row) => {
    const nombre = row.nombre?.toLowerCase() || "";
    const control = row.numero_control?.toLowerCase() || "";
    const busq = busqueda.toLowerCase();

    return nombre.includes(busq) || control.includes(busq);
  });
  const resultadoUnico = rowsFiltrados.slice(0, 1);



  // Cargar alumnos
  useEffect(() => {
    getAlumnos().then(setRows);
  }, []);

  const buscar = () => {
    getAlumnosFiltrados(generacion, carrera).then(setRows);
    console.log("FILTROS:", generacion, carrera);
  };

  // Refrescar historial
  const refrescarHistorial = () => {
    if (!alumnoSeleccionado) return;

    getHistorialAlumno(alumnoSeleccionado).then((data) => {
      setHistorial(data);
    });

    setOpenModal(false);
    setRegistroEditar(null);
    setActividadExtra("");
    setCreditos("");
  };

  // Guardar / actualizar
  const guardarActividad = () => {
    if (!alumnoSeleccionado || !semestreSeleccionado) return;

    const datos = {
      alumno_id: alumnoSeleccionado,
      actividad_id: null,
      actividad_extra: actividadExtra,
      periodo_id: semestreSeleccionado,
      creditos: creditos
    };

    console.log("ENVIANDO:", datos);

    if (registroEditar) {
      actualizarRegistro(registroEditar, datos).then((res) => {
        console.log(res);
        refrescarHistorial();
      });
    } else {
      crearRegistro(datos).then((res) => {
        console.log(res);

        if (res.status === "error") {
          alert(res.error); // muestra error de "máximo 2 actividades"
          return;
        }

        refrescarHistorial();
      });
    }
  };

  const handleImportKardex = async () => {
    if (!fileKardex) {
      alert("Selecciona un archivo CSV");
      return;
    }

    try {
      const res = await importarKardex(fileKardex);

      alert(`
  Insertados: ${res.insertados}
  Rechazados: ${res.rechazados}
  No encontrados: ${res.no_encontrados}
      `);
    } catch (error) {
      console.error(error);
      alert("Error al importar kardex");
    }
  };





  // Construir Kardex
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
        ),
        registro1: actividades[0]?.id || null,
        registro2: actividades[1]?.id || null
      });
    }

    return kardex;
  };

  //  Columnas
  const columns = [

    // { field: "id", headerName: "ID", width: 80 },
    { field: "numero_control", headerName: "Numero de Control", flex: 1 },
    { field: "nombre", headerName: "Nombre", flex: 1 },
    { field: "generacion", headerName: "Generación", flex: 1 },
    {
      field: "carrera_nombre",
      headerName: "Carrera",
      flex: 1
    }
  ];

  const kardexColumns = [
    { field: "semestre", headerName: "Semestre", width: 100 },
    { field: "act1", headerName: "Actividad 1", flex: 1 },
    { field: "act2", headerName: "Actividad 2", flex: 1 },
    { field: "creditos", headerName: "Créditos", width: 120 },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 200,
      renderCell: (params) => (
        <>
          {params.row.registro1 && (
            <Button
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                eliminarRegistro(params.row.registro1).then(() =>
                  refrescarHistorial()
                );
              }}
            >
              Eliminar 1
            </Button>
          )}
          {params.row.registro2 && (
            <Button
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                eliminarRegistro(params.row.registro2).then(() =>
                  refrescarHistorial()
                );
              }}
            >
              Eliminar 2
            </Button>
          )}
        </>
      )
    }
  ];
  const handleImport = async () => {
    if (!file) return alert("Selecciona un archivo");
    if (!generacion || !carrera || !periodo) return alert("Selecciona generación, carrera y semestre");

    const res = await importarAlumnos(file, generacion, carrera, periodo);

    if (res.status === "ok") {
      alert(`Importados: ${res.insertados}`);
      buscar();
    } else {
      alert("Error al importar");
    }
  };
  return (
    <Box m="20px">
      <Header title="ALUMNOS" subtitle="Gestión de alumnos" />

      {/* 🔹 FILTROS */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          backgroundColor: colors.primary[400],
          p: 2,
          borderRadius: "12px",
          mb: 3
        }}
      >
        <Box display="flex" gap="15px">
          <TextField
            select
            label="Generación"
            value={generacion}
            onChange={(e) => setGeneracion(e.target.value)}
            size="small"
          >
            <MenuItem value="1">2022-2027</MenuItem>
            <MenuItem value="2">2023-2028</MenuItem>
            <MenuItem value="3">2024-2029</MenuItem>
            <MenuItem value="4">2025-2030</MenuItem>
            <MenuItem value="5">2026-2031</MenuItem>
            <MenuItem value="6">2027-2032</MenuItem>
            <MenuItem value="7">2028-2033</MenuItem>
            <MenuItem value="8">2029-2034</MenuItem>
          </TextField>

          <TextField
            select
            label="Carrera"
            value={carrera}
            onChange={(e) => setCarrera(e.target.value)}
            size="small"
          >
            <MenuItem value="1">Administracion</MenuItem>
            <MenuItem value="2">I.Alimentarias</MenuItem>
            <MenuItem value="3">Sistemas Computacionales</MenuItem>
            <MenuItem value="4">Arquitectura</MenuItem>
            <MenuItem value="5">Electronica</MenuItem>
            <MenuItem value="6">I.Agricola Sustentable</MenuItem>
            <MenuItem value="7">Turismo</MenuItem>
            <MenuItem value="8">Industrial</MenuItem>
          </TextField>

          <TextField
            select
            label="Semestre"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            size="small"
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

          <Button variant="contained" onClick={buscar} sx={{ backgroundColor: "#4cceac" }}>
            Buscar
          </Button>
        </Box>

        <Box display="flex" alignItems="center" gap="10px">
          <Button
            variant="outlined"
            component="label"
            sx={{
              textTransform: "none",
              color: "#fff",
              borderColor: "#fff",
              backgroundColor: "transparent",
              "&:hover": {
                borderColor: "#fff",
                backgroundColor: "rgba(255,255,255,0.1)"
              }
            }}
          >
            Seleccionar archivo
            <input
              type="file"
              hidden
              accept=".csv"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Button>

          <Typography variant="body2" sx={{ maxWidth: 120 }} noWrap>
            {file ? file.name : "Sin archivo"}
          </Typography>

          <Button
            variant="contained"
            onClick={handleImport}
            sx={{ backgroundColor: "#4cceac" }}
          >
            Importar Alumnos
          </Button>
        </Box>
        <Box display="flex" alignItems="center" gap="10px">
          <Button
            variant="outlined"
            component="label"
            sx={{
              textTransform: "none",
              color: "#fff",
              borderColor: "#fff",
              backgroundColor: "transparent",
              "&:hover": {
                borderColor: "#fff",
                backgroundColor: "rgba(255,255,255,0.1)"
              }
            }}
          >
            Seleccionar archivo
            <input
              type="file"
              hidden
              accept=".csv"
              onChange={(e) => setFileKardex(e.target.files[0])}
            />
          </Button>

          <Typography variant="body2" sx={{ maxWidth: 120 }} noWrap>
            {fileKardex ? fileKardex.name : "Sin archivo"}
          </Typography>

          <Button
            variant="contained"
            onClick={handleImportKardex}
            sx={{ backgroundColor: "#4cceac" }}
          >
            Importar Creditos
          </Button>
        </Box>
      </Box>


      {/* 🔹 TABLA */}
      <Box
        sx={{
          backgroundColor: colors.primary[400],
          borderRadius: "12px",
          p: 2,
          mb: 3
        }}
      >
        <TextField
          placeholder="Buscar alumno..."
          fullWidth
          size="small"
          sx={{ mb: 2 }}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <DataGrid
          rows={busqueda ? resultadoUnico : rows.slice(0, 1)}
          columns={[
            ...columns,
            {
              field: "estado",
              headerName: "Estado",
              flex: 1,
              renderCell: (params) => {
                const completo = totalCreditos >= 5;
                return (
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: "20px",
                      fontSize: "12px",
                      backgroundColor: completo ? "#4caf50" : "#ff9800",
                      color: "#fff"
                    }}
                  >
                    {completo ? "Completo" : "Pendiente"}
                  </Box>
                );
              }
            }
          ]}
          autoHeight
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.primary[500],
              fontWeight: "bold"
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: colors.primary[300]
            }
          }}
          onRowClick={(params) => {
            setAlumnoSeleccionado(params.row.id);
            getHistorialAlumno(params.row.id).then(setHistorial);
          }}
        />
      </Box>

      {/* 🔹 KARDEX */}
      <Box
        sx={{
          backgroundColor: colors.primary[400],
          borderRadius: "12px",
          p: 3
        }}
      >
        <Typography variant="h5" mb={2}>
          Kardex del Alumno
        </Typography>

        {/* PROGRESO */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Box width="70%">
            <LinearProgress
              variant="determinate"
              value={(totalCreditos / 5) * 100}
              sx={{
                height: 12,
                borderRadius: 6,
                "& .MuiLinearProgress-bar": {
                  backgroundColor:
                    totalCreditos >= 5 ? "#4caf50" : "#2196f3"
                }
              }}
            />
          </Box>

          <Typography fontWeight="bold">
            {totalCreditos} / 5 créditos
          </Typography>

          {totalCreditos >= 5 && (
            <Button
              variant="contained"
              color="success"
              onClick={() => generarConstancia(alumnoSeleccionado)}
            >
              Descargar constancia
            </Button>
          )}
        </Box>

        {/* MENSAJE */}
        {totalCreditos >= 5 && (
          <Typography color="lightgreen" mb={2}>
            ✔ Créditos completos
          </Typography>
        )}

        {/* TABLA KARDEX */}
        <DataGrid
          rows={construirKardex()}
          columns={[
            ...kardexColumns,
            {
              field: "estado",
              headerName: "Estado",
              width: 130,
              renderCell: (params) => {
                const lleno = params.row.creditos > 0;
                return (
                  <Box
                    sx={{
                      px: 1,
                      py: 0.5,
                      borderRadius: "10px",
                      fontSize: "12px",
                      backgroundColor: lleno ? "#4caf50" : "#9e9e9e",
                      color: "#fff"
                    }}
                  >
                    {lleno ? "Registrado" : "Vacío"}
                  </Box>
                );
              }
            }
          ]}
          autoHeight
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.primary[500]
            }
          }}
          onRowClick={(params) => {
            setSemestreSeleccionado(params.row.semestre);

            const actividades = historial.filter(
              (h) => Number(h.periodo_id) === params.row.semestre
            );

            if (actividades.length >= 2) {
              alert("Máximo 2 actividades por semestre");
              return;
            }

            setRegistroEditar(null);
            setActividadExtra("");
            setCreditos("");
            setOpenModal(true);
          }}
        />
      </Box>

      {/* 🔹 MODAL */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Registrar Actividad</DialogTitle>

        <DialogContent>
          <TextField
            label="Actividad"
            value={actividadExtra}
            onChange={(e) => setActividadExtra(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />

          <TextField
            label="Créditos"
            type="number"
            value={creditos}
            onChange={(e) => setCreditos(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancelar</Button>

          <Button variant="contained" onClick={guardarActividad}>
            Guardar
          </Button>

          {registroEditar && (
            <Button
              color="error"
              onClick={() => {
                eliminarRegistro(registroEditar).then(() =>
                  refrescarHistorial()
                );
              }}
            >
              Eliminar
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box >
  );

};

export default Team;
