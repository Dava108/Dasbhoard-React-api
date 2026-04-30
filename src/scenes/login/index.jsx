import { useState, useContext } from "react";
import {
  Box, TextField, Button, Typography,
  IconButton, InputAdornment, Link
} from "@mui/material";
import { Visibility, VisibilityOff, AccountCircleOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/api";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const [numero_control, setNumeroControl] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login: loginContext } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!numero_control || !password) {
      setError("Completa todos los campos.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await login({ numero_control, password });
      if (res.status === "ok") {
        loginContext(res.user);
        navigate(res.user.rol === "admin" ? "/dashboard" : "/alumno");
      } else {
        setError(res.message || "Credenciales incorrectas.");
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        backgroundImage: "url('/assets/fondo.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "380px",
          padding: "2rem 1.75rem",
          borderRadius: "16px",
          backgroundColor: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(8px)",
          border: "0.5px solid rgba(255,255,255,0.1)",
        }}
      >
        {/* Ícono central */}
        <Box
          sx={{
            width: 52, height: 52, borderRadius: "50%",
            backgroundColor: "rgba(76,206,172,0.15)",
            border: "1.5px solid rgba(76,206,172,0.4)",
            display: "flex", alignItems: "center",
            justifyContent: "center", margin: "0 auto 1rem",
          }}
        >
          <AccountCircleOutlined sx={{ color: "#4cceac", fontSize: 28 }} />
        </Box>

        <Typography variant="h5" mb={0.5} color="#fff" textAlign="center" fontWeight={500}>
          Bienvenido
        </Typography>
        <Typography variant="body2" mb={2.5} color="rgba(255,255,255,0.45)" textAlign="center">
          Sistema de control escolar
        </Typography>

        <TextField
          fullWidth
          label="Número de control"
          value={numero_control}
          onChange={(e) => setNumeroControl(e.target.value)}
          onKeyDown={handleKeyDown}
          margin="normal"
          size="small"
          InputLabelProps={{ style: { color: "rgba(255,255,255,0.5)", fontSize: 13 } }}
          InputProps={{ style: { color: "#fff" } }}
          sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "rgba(255,255,255,0.15)" }, "&:hover fieldset": { borderColor: "rgba(255,255,255,0.3)" }, "&.Mui-focused fieldset": { borderColor: "#4cceac" } } }}
        />

        <TextField
          fullWidth
          label="Contraseña"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          margin="normal"
          size="small"
          InputLabelProps={{ style: { color: "rgba(255,255,255,0.5)", fontSize: 13 } }}
          InputProps={{
            style: { color: "#fff" },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  onMouseDown={(e) => e.preventDefault()}
                  edge="end"
                  sx={{ color: "rgba(255,255,255,0.4)" }}
                >
                  {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "rgba(255,255,255,0.15)" }, "&:hover fieldset": { borderColor: "rgba(255,255,255,0.3)" }, "&.Mui-focused fieldset": { borderColor: "#4cceac" } } }}
        />

        {/* Mensaje de error */}
        {error && (
          <Typography variant="caption" color="#ff6b6b" mt={0.5} display="block">
            {error}
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          onClick={handleLogin}
          disabled={loading}
          sx={{
            mt: 2,
            py: 1.1,
            backgroundColor: "#4cceac",
            color: "#0d1b2a",
            fontWeight: 500,
            textTransform: "none",
            fontSize: "0.9rem",
            "&:hover": { backgroundColor: "#3bba9a" },
            "&:disabled": { backgroundColor: "rgba(76,206,172,0.4)", color: "rgba(0,0,0,0.5)" },
          }}
        >
          {loading ? "Iniciando sesión..." : "Iniciar sesión"}
        </Button>

        <Box textAlign="center" mt={1.5}>
          <Link
            href="#"
            underline="hover"
            sx={{ fontSize: 12, color: "rgba(76,206,172,0.7)", "&:hover": { color: "#4cceac" } }}
          >
            
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;