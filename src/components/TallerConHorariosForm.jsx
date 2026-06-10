import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  Paper,
  Divider,
  Snackbar,
  Alert,
  ClickAwayListener,
  Popper,
  Fade,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CodeIcon from "@mui/icons-material/Code";

const HORAS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const MINUTOS = ["00", "15", "30", "45"];

const horarioVacio = () => ({
  dia_semana: "",
  hora_inicio: "",
  hora_fin: "",
  cupo_maximo: 30,
  espacio: "",
});

function fmtTime(val) {
  if (!val) return null;
  const [h, m] = val.split(":");
  return `${h}:${m}`;
}

function TimePicker({ label, value, onChange }) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const [selH, selM] = value ? value.split(":") : ["", ""];

  const pick = (part, v) => {
    const currentH = selH || "07";
    const currentM = selM || "00";
    const next =
      part === "h" ? `${v}:${currentM}` : `${currentH}:${v}`;
    onChange(next);
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (anchorRef.current && !anchorRef.current.closest("[data-tp]")?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box data-tp="true" sx={{ position: "relative" }}>
        <Box
          ref={anchorRef}
          onClick={() => setOpen((p) => !p)}
          sx={{
            height: 40,
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1.5,
            border: "1px solid",
            borderColor: open ? "primary.main" : "divider",
            borderRadius: 1,
            cursor: "pointer",
            bgcolor: "background.paper",
            userSelect: "none",
            "&:hover": { borderColor: "text.primary" },
            transition: "border-color 0.15s",
          }}
        >
          <AccessTimeIcon sx={{ fontSize: 16, color: "text.disabled" }} />
          <Typography
            sx={{
              flex: 1,
              fontSize: 14,
              color: value ? "text.primary" : "text.disabled",
            }}
          >
            {value ? fmtTime(value) : "— : —"}
          </Typography>
        </Box>

        <Popper
          open={open}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          transition
          sx={{ zIndex: 1300 }}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={120}>
              <Paper
                elevation={3}
                sx={{
                  mt: 0.5,
                  p: 1.5,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  display: "flex",
                  gap: 2,
                }}
              >
                {/* Horas */}
                <Box>
                  <Typography
                    sx={{ fontSize: 11, color: "text.disabled", mb: 0.75, letterSpacing: "0.05em" }}
                  >
                    HORA
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: 0.5,
                      maxWidth: 168,
                    }}
                  >
                    {HORAS.map((h) => {
                      const hh = String(h).padStart(2, "0");
                      const active = selH === hh;
                      return (
                        <Button
                          key={hh}
                          size="small"
                          variant={active ? "contained" : "outlined"}
                          onClick={() => pick("h", hh)}
                          sx={{
                            minWidth: 36,
                            height: 30,
                            fontSize: 13,
                            p: 0,
                            borderColor: active ? undefined : "divider",
                            color: active ? undefined : "text.secondary",
                            "&:hover": { borderColor: "text.primary", color: "text.primary" },
                          }}
                        >
                          {hh}
                        </Button>
                      );
                    })}
                  </Box>
                </Box>

                <Divider orientation="vertical" flexItem />

                {/* Minutos */}
                <Box>
                  <Typography
                    sx={{ fontSize: 11, color: "text.disabled", mb: 0.75, letterSpacing: "0.05em" }}
                  >
                    MIN
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                    {MINUTOS.map((m) => {
                      const active = selM === m;
                      return (
                        <Button
                          key={m}
                          size="small"
                          variant={active ? "contained" : "outlined"}
                          onClick={() => pick("m", m)}
                          sx={{
                            minWidth: 48,
                            height: 30,
                            fontSize: 13,
                            p: 0,
                            borderColor: active ? undefined : "divider",
                            color: active ? undefined : "text.secondary",
                            "&:hover": { borderColor: "text.primary", color: "text.primary" },
                          }}
                        >
                          :{m}
                        </Button>
                      );
                    })}
                  </Box>
                </Box>
              </Paper>
            </Fade>
          )}
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}

const DIAS = [
  ["1", "Lunes"],
  ["2", "Martes"],
  ["3", "Miércoles"],
  ["4", "Jueves"],
  ["5", "Viernes"],
];

const TallerConHorariosForm = () => {
  const [formTaller, setFormTaller] = useState({ nombre: "", tipo: "", promotor: "" });
  const [horarios, setHorarios] = useState([horarioVacio()]);
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "error" });

  const toast = (msg, severity = "error") =>
    setSnack({ open: true, msg, severity });

  const handleChangeTaller = (e) =>
    setFormTaller((p) => ({ ...p, [e.target.name]: e.target.value }));

  const actualizarHorario = (index, campo, valor) =>
    setHorarios((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [campo]: valor };
      return next;
    });

  const agregarFila = () => setHorarios((p) => [...p, horarioVacio()]);

  const eliminarFila = (index) =>
    setHorarios((p) => p.filter((_, i) => i !== index));

  const validar = () => {
    if (!formTaller.nombre || !formTaller.tipo || !formTaller.promotor) {
      toast("Completa los datos generales del taller");
      return false;
    }
    if (horarios.some((h) => !h.dia_semana || !h.hora_inicio || !h.hora_fin || !h.espacio)) {
      toast("Hay horarios incompletos");
      return false;
    }
    if (horarios.some((h) => h.hora_inicio >= h.hora_fin)) {
      toast("La hora de fin debe ser mayor que la hora de inicio");
      return false;
    }
    return true;
  };

  const guardarTallerCompleto = async () => {
    if (!validar()) return;
    const payload = { ...formTaller, horarios };
    try {
      const res = await fetch(
        "http://localhost:81/creditos_api/admin/talleres/crear_taller_con_horarios.php",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      toast(data.mensaje, data.ok ? "success" : "error");
      if (data.ok) {
        setFormTaller({ nombre: "", tipo: "", promotor: "" });
        setHorarios([horarioVacio()]);
      }
    } catch {
      toast("Error de conexión");
    }
  };

  const verJSON = () => {
    if (!validar()) return;
    console.log(JSON.stringify({ ...formTaller, horarios }, null, 2));
    toast("JSON impreso en consola", "info");
  };

  return (
    <Box sx={{ p: 4, maxWidth: 960 }}>
      <Typography variant="h5" fontWeight={500} mb={3}>
        Nuevo taller
      </Typography>

      {/* Datos generales */}
      <Paper variant="outlined" sx={{ p: 2.5, mb: 2, borderRadius: 2 }}>
        <Typography
          sx={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", color: "text.secondary", mb: 2 }}
        >
          DATOS GENERALES
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 180px 1fr", gap: 1.5 }}>
          <TextField
            label="Nombre del taller"
            name="nombre"
            value={formTaller.nombre}
            onChange={handleChangeTaller}
            size="small"
            fullWidth
          />
          <TextField
            select
            label="Tipo"
            name="tipo"
            value={formTaller.tipo}
            onChange={handleChangeTaller}
            size="small"
            fullWidth
          >
            <MenuItem value="deportivo">Deportivo</MenuItem>
            <MenuItem value="cultural">Cultural</MenuItem>
            <MenuItem value="civico">Cívico</MenuItem>
          </TextField>
          <TextField
            label="Promotor"
            name="promotor"
            value={formTaller.promotor}
            onChange={handleChangeTaller}
            size="small"
            fullWidth
          />
        </Box>
      </Paper>

      {/* Horarios */}
      <Paper variant="outlined" sx={{ p: 2.5, mb: 2.5, borderRadius: 2 }}>
        <Typography
          sx={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", color: "text.secondary", mb: 2 }}
        >
          HORARIOS
        </Typography>

        {/* Encabezados */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "160px 1fr 1fr 80px 1fr 40px",
            gap: 1,
            px: 0.5,
            mb: 0.5,
          }}
        >
          {["Día", "Hora inicio", "Hora fin", "Cupo", "Espacio", ""].map((col, i) => (
            <Typography key={i} sx={{ fontSize: 11, color: "text.disabled" }}>
              {col}
            </Typography>
          ))}
        </Box>

        <Divider sx={{ mb: 1 }} />

        {horarios.map((h, index) => (
          <Box
            key={index}
            sx={{
              display: "grid",
              gridTemplateColumns: "160px 1fr 1fr 80px 1fr 40px",
              gap: 1,
              alignItems: "center",
              py: 1,
              borderBottom: index < horarios.length - 1 ? "1px solid" : "none",
              borderColor: "divider",
            }}
          >
            <TextField
              select
              value={h.dia_semana}
              onChange={(e) => actualizarHorario(index, "dia_semana", e.target.value)}
              size="small"
              fullWidth
              placeholder="Día"
            >
              <MenuItem value="" disabled>
                Día
              </MenuItem>
              {DIAS.map(([v, l]) => (
                <MenuItem key={v} value={v}>
                  {l}
                </MenuItem>
              ))}
            </TextField>

            <TimePicker
              label="Inicio"
              value={h.hora_inicio}
              onChange={(v) => actualizarHorario(index, "hora_inicio", v)}
            />

            <TimePicker
              label="Fin"
              value={h.hora_fin}
              onChange={(v) => actualizarHorario(index, "hora_fin", v)}
            />

            <TextField
              type="number"
              value={h.cupo_maximo}
              onChange={(e) => actualizarHorario(index, "cupo_maximo", +e.target.value)}
              size="small"
              inputProps={{ min: 1, max: 200, style: { textAlign: "center" } }}
              fullWidth
            />

            <TextField
              value={h.espacio}
              onChange={(e) => actualizarHorario(index, "espacio", e.target.value)}
              size="small"
              placeholder="Sala A, Gym..."
              fullWidth
            />

            <IconButton
              size="small"
              color="error"
              onClick={() => eliminarFila(index)}
              disabled={horarios.length === 1}
              sx={{ borderRadius: 1 }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}

        <Box mt={2}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={agregarFila}
            sx={{ borderColor: "divider", color: "text.secondary", "&:hover": { borderColor: "text.primary", color: "text.primary" } }}
          >
            Agregar horario
          </Button>
        </Box>
      </Paper>

      {/* Acciones */}
      <Box sx={{ display: "flex", gap: 1.5 }}>
        <Button
          variant="contained"
          startIcon={<SaveOutlinedIcon />}
          onClick={guardarTallerCompleto}
          disableElevation
        >
          Guardar taller
        </Button>
      </Box>

      <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={() => setSnack((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snack.severity}
          onClose={() => setSnack((p) => ({ ...p, open: false }))}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};
export { TimePicker };
export default TallerConHorariosForm;
