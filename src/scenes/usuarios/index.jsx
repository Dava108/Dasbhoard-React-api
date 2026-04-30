import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

import {
  getUsuarios,
  crearUsuario,
  eliminarUsuario
} from "../../api/api";

const Usuarios = () => {

  const [rows, setRows] = useState([]);
  const [nombre, setNombre] = useState("");
  const [numero, setNumero] = useState("");
  const [rol, setRol] = useState("alumno");

  const cargar = () => {
    getUsuarios().then(setRows);
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleCrear = async () => {
    await crearUsuario({ nombre, numero_control: numero, rol });
    setNombre("");
    setNumero("");
    setRol("alumno");
    cargar();
  };

  const handleEliminar = async (id) => {
    await eliminarUsuario(id);
    cargar();
  };

  const columns = [
    { field: "nombre", headerName: "Nombre", flex: 1 },
    { field: "numero_control", headerName: "Control", flex: 1 },
    { field: "rol", headerName: "Rol", flex: 1 },
    {
      field: "acciones",
      headerName: "Acciones",
      renderCell: (params) => (
        <Button
          color="error"
          onClick={() => handleEliminar(params.row.id)}
        >
          Eliminar
        </Button>
      )
    }
  ];

  return (
    <Box m="20px">
      <Typography variant="h4">Usuarios</Typography>

      <Box display="flex" gap="10px" mt="20px">
        <TextField label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <TextField label="No. Control" value={numero} onChange={(e) => setNumero(e.target.value)} />

        <TextField select value={rol} onChange={(e) => setRol(e.target.value)}>
          <MenuItem value="alumno">Alumno</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="promotor">Promotor</MenuItem>
        </TextField>

        <Button variant="contained" onClick={handleCrear}
          sx={{
            mt: 2,
            backgroundColor: "#4cceac",
            color: "#ffffff",
            fontWeight: "bold",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#3da58a",
            },
          }}
        >
          Crear
        </Button>
      </Box>

      <Box mt="20px" height="400px">
        <DataGrid rows={rows} columns={columns} />
      </Box>
    </Box>
  );
};

export default Usuarios;