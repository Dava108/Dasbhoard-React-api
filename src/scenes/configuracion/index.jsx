import { Box, Typography, TextField, Button } from "@mui/material";
import { useState } from "react";
import { cambiarPassword } from "../../api/api";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";


const Configuracion = () => {

    const [showActual, setShowActual] = useState(false);
    const [showNuevo, setShowNuevo] = useState(false);
    const [showConfirmar, setShowConfirmar] = useState(false);
    const [confirmar, setConfirmar] = useState("");

    const [actual, setActual] = useState("");
    const [nuevo, setNuevo] = useState("");
    const [error, setError] = useState("");

    const handleChange = async () => {
        setError(""); // limpiar errores

        const user = JSON.parse(localStorage.getItem("user"));

        // VALIDACIONES PRIMERO
        if (nuevo !== confirmar) {
            setError("Las contraseñas no coinciden");
            return;
        }

        if (nuevo.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        // petición
        const res = await cambiarPassword({
            id: user.id,
            password_actual: actual,
            password_nuevo: nuevo
        });

        if (res.status === "ok") {
            alert("Contraseña actualizada");
            setActual("");
            setNuevo("");
            setConfirmar("");
        } else {
            setError(res.message);
        }
    };
    return (
        <Box m="20px">
            <Typography variant="h4">Configuración</Typography>

            <Box mt="20px">
                <Typography variant="h6">Cambiar contraseña</Typography>

                <TextField
                    label="Contraseña actual"
                    type={showActual ? "text" : "password"}
                    fullWidth
                    sx={{ mt: 2 }}
                    value={actual}
                    onChange={(e) => setActual(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowActual(!showActual)}>
                                    {showActual ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />

                <TextField
                    label="Nueva contraseña"
                    type={showNuevo ? "text" : "password"}
                    fullWidth
                    sx={{ mt: 2 }}
                    value={nuevo}
                    onChange={(e) => setNuevo(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowNuevo(!showNuevo)}>
                                    {showNuevo ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />

                <TextField
                    label="Confirmar contraseña"
                    type={showConfirmar ? "text" : "password"}
                    fullWidth
                    sx={{ mt: 2 }}
                    value={confirmar}
                    onChange={(e) => setConfirmar(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowConfirmar(!showConfirmar)}>
                                    {showConfirmar ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />

                {error && (
                    <Typography color="error" mt={1} fontSize="14px">
                        {error}
                    </Typography>
                )}

                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "#4cceac",
                        color: "#ffffff",
                        fontWeight: "bold",
                        textTransform: "none", // Evita que todo salga en mayúsculas
                        "&:hover": {
                            backgroundColor: "#3da58a", // Un tono más oscuro al pasar el mouse
                        },
                        mt: 2
                    }}
                    onClick={handleChange}
                >
                    Cambiar contraseña
                </Button>
            </Box>
        </Box>
    );
};

export default Configuracion;