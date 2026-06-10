import React, { useEffect, useRef, useState } from "react";
import { eliminarTaller } from "../../api/api";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  ClickAwayListener,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Fade,
  IconButton,
  MenuItem,
  Paper,
  Popper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AddIcon from "@mui/icons-material/Add";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

// ─────────────────────────────────────────────
// Constantes compartidas
// ─────────────────────────────────────────────
const BASE_URL = "http://localhost:81/creditos_api/admin";
const HORAS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const MINUTOS = ["00", "15", "30", "45"];
const DIAS = [
  ["1", "Lunes"],
  ["2", "Martes"],
  ["3", "Miércoles"],
  ["4", "Jueves"],
  ["5", "Viernes"],
];
const horarioVacio = () => ({
  dia_semana: "",
  hora_inicio: "",
  hora_fin: "",
  cupo_maximo: 30,
  espacio: "",
});

// ─────────────────────────────────────────────
// TimePicker
// ─────────────────────────────────────────────
function fmtTime(val) {
  if (!val) return null;
  const [h, m] = val.split(":");
  return `${h}:${m}`;
}

function TimePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const [selH, selM] = value ? value.split(":") : ["", ""];

  const pick = (part, v) => {
    const h = selH || "07";
    const m = selM || "00";
    onChange(part === "h" ? `${v}:${m}` : `${h}:${v}`);
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!anchorRef.current?.closest("[data-tp]")?.contains(e.target))
        setOpen(false);
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
          <Typography sx={{ flex: 1, fontSize: 14, color: value ? "text.primary" : "text.disabled" }}>
            {value ? fmtTime(value) : "— : —"}
          </Typography>
        </Box>

        <Popper open={open} anchorEl={anchorRef.current} placement="bottom-start" transition sx={{ zIndex: 1400 }}>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={120}>
              <Paper
                elevation={3}
                sx={{ mt: 0.5, p: 1.5, border: "1px solid", borderColor: "divider", borderRadius: 2, display: "flex", gap: 2 }}
              >
                <Box>
                  <Typography sx={{ fontSize: 11, color: "text.disabled", mb: 0.75, letterSpacing: "0.05em" }}>
                    HORA
                  </Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0.5, maxWidth: 168 }}>
                    {HORAS.map((h) => {
                      const hh = String(h).padStart(2, "0");
                      const active = selH === hh;
                      return (
                        <Button
                          key={hh}
                          size="small"
                          variant={active ? "contained" : "outlined"}
                          onClick={() => pick("h", hh)}
                          disableElevation
                          sx={{
                            minWidth: 36, height: 30, fontSize: 13, p: 0,
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

                <Box>
                  <Typography sx={{ fontSize: 11, color: "text.disabled", mb: 0.75, letterSpacing: "0.05em" }}>
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
                          disableElevation
                          sx={{
                            minWidth: 48, height: 30, fontSize: 13, p: 0,
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

// ─────────────────────────────────────────────
// NuevoTallerDialog — form completo en modal
// ─────────────────────────────────────────────
function NuevoTallerDialog({ open, onClose, onSuccess, toast }) {
  const [formTaller, setFormTaller] = useState({ nombre: "", tipo: "", promotor: "" });
  const [horarios, setHorarios] = useState([horarioVacio()]);

  const handleClose = () => {
    setFormTaller({ nombre: "", tipo: "", promotor: "" });
    setHorarios([horarioVacio()]);
    onClose();
  };

  const actualizarHorario = (index, campo, valor) =>
    setHorarios((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [campo]: valor };
      return next;
    });

  const validar = () => {
    if (!formTaller.nombre || !formTaller.tipo || !formTaller.promotor) {
      toast("Completa los datos generales del taller", "error");
      return false;
    }
    if (horarios.some((h) => !h.dia_semana || !h.hora_inicio || !h.hora_fin || !h.espacio)) {
      toast("Hay horarios incompletos", "error");
      return false;
    }
    if (horarios.some((h) => h.hora_inicio >= h.hora_fin)) {
      toast("La hora de fin debe ser mayor que la hora de inicio", "error");
      return false;
    }
    return true;
  };

  const guardar = async () => {
    if (!validar()) return;
    try {
      const res = await fetch(`${BASE_URL}/talleres/crear_taller_con_horarios.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formTaller, horarios }),
      });
      const data = await res.json();
      toast(data.mensaje, data.ok ? "success" : "error");
      if (data.ok) { onSuccess(); handleClose(); }
    } catch {
      toast("Error de conexión", "error");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
        <Typography fontWeight={500}>Nuevo taller</Typography>
        <IconButton size="small" onClick={handleClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <Divider />

      <DialogContent sx={{ pt: 2.5, pb: 3 }}>
        {/* Datos generales */}
        <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2 }}>
          <SectionLabel>DATOS GENERALES</SectionLabel>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 160px 1fr", gap: 1.5 }}>
            <TextField
              label="Nombre del taller" size="small" fullWidth
              value={formTaller.nombre}
              onChange={(e) => setFormTaller((p) => ({ ...p, nombre: e.target.value }))}
            />
            <TextField
              select label="Tipo" size="small" fullWidth
              value={formTaller.tipo}
              onChange={(e) => setFormTaller((p) => ({ ...p, tipo: e.target.value }))}
            >
              <MenuItem value="deportivo">Deportivo</MenuItem>
              <MenuItem value="cultural">Cultural</MenuItem>
              <MenuItem value="civico">Cívico</MenuItem>
            </TextField>
            <TextField
              label="Promotor" size="small" fullWidth
              value={formTaller.promotor}
              onChange={(e) => setFormTaller((p) => ({ ...p, promotor: e.target.value }))}
            />
          </Box>
        </Paper>

        {/* Horarios */}
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
          <SectionLabel>HORARIOS</SectionLabel>

          <Box sx={{ display: "grid", gridTemplateColumns: "150px 1fr 1fr 70px 1fr 40px", gap: 1, px: 0.5, mb: 0.5 }}>
            {["Día", "Hora inicio", "Hora fin", "Cupo", "Espacio", ""].map((col, i) => (
              <Typography key={i} sx={{ fontSize: 11, color: "text.disabled" }}>{col}</Typography>
            ))}
          </Box>
          <Divider sx={{ mb: 1 }} />

          {horarios.map((h, index) => (
            <Box
              key={index}
              sx={{
                display: "grid",
                gridTemplateColumns: "150px 1fr 1fr 70px 1fr 40px",
                gap: 1, alignItems: "center", py: 1,
                borderBottom: index < horarios.length - 1 ? "1px solid" : "none",
                borderColor: "divider",
              }}
            >
              <TextField
                select size="small" fullWidth value={h.dia_semana}
                onChange={(e) => actualizarHorario(index, "dia_semana", e.target.value)}
              >
                <MenuItem value="" disabled>Día</MenuItem>
                {DIAS.map(([v, l]) => <MenuItem key={v} value={v}>{l}</MenuItem>)}
              </TextField>

              <TimePicker value={h.hora_inicio} onChange={(v) => actualizarHorario(index, "hora_inicio", v)} />
              <TimePicker value={h.hora_fin} onChange={(v) => actualizarHorario(index, "hora_fin", v)} />

              <TextField
                type="number" size="small" fullWidth value={h.cupo_maximo}
                onChange={(e) => actualizarHorario(index, "cupo_maximo", +e.target.value)}
                inputProps={{ min: 1, max: 200, style: { textAlign: "center" } }}
              />
              <TextField
                size="small" fullWidth value={h.espacio} placeholder="Sala A, Gym..."
                onChange={(e) => actualizarHorario(index, "espacio", e.target.value)}
              />
              <IconButton
                size="small" color="error"
                onClick={() => setHorarios((p) => p.filter((_, i) => i !== index))}
                disabled={horarios.length === 1}
                sx={{ borderRadius: 1 }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}

          <Box mt={1.5}>
            <Button
              variant="outlined" size="small" startIcon={<AddIcon />}
              onClick={() => setHorarios((p) => [...p, horarioVacio()])}
              sx={{ borderColor: "divider", color: "text.secondary", "&:hover": { borderColor: "text.primary", color: "text.primary" } }}
            >
              Agregar horario
            </Button>
          </Box>
        </Paper>

        {/* Acciones del dialog */}
        <Box sx={{ display: "flex", gap: 1.5, mt: 2.5, justifyContent: "flex-end" }}>
          <Button variant="outlined" onClick={handleClose} sx={{ borderColor: "divider", color: "text.secondary" }}>
            Cancelar
          </Button>
          <Button variant="contained" startIcon={<SaveOutlinedIcon />} onClick={guardar} disableElevation>
            Guardar taller
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────
// Helpers UI
// ─────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <Typography sx={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", color: "text.secondary", mb: 2 }}>
      {children}
    </Typography>
  );
}

function ColLabel({ children }) {
  return (
    <TableCell sx={{ fontSize: 11, color: "text.disabled", borderBottom: "1px solid", borderColor: "divider", pb: 0.75 }}>
      {children}
    </TableCell>
  );
}

// ─────────────────────────────────────────────
// AdminIndex — componente principal
// ─────────────────────────────────────────────
export default function AdminIndex() {
  const navigate = useNavigate();

  const [talleres, setTalleres] = useState([]);
  const [tallerSeleccionado, setTallerSeleccionado] = useState("");
  const [horarios, setHorarios] = useState([]);
  const [inscritos, setInscritos] = useState([]);
  const [horarioActivo, setHorarioActivo] = useState(null);
  const [horarioEditando, setHorarioEditando] = useState(null);
  const [modalInscritos, setModalInscritos] = useState(false);
  const [dialogNuevoTaller, setDialogNuevoTaller] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

  const [formHorario, setFormHorario] = useState(horarioVacio());

  const toast = (msg, severity = "success") =>
    setSnack({ open: true, msg, severity });

  // ── Cargas ──────────────────────────────────
  const cargarTalleres = async () => {
    const res = await fetch(`${BASE_URL}/talleres/obtener_talleres.php`, { credentials: "include" });
    setTalleres(await res.json());
  };

  const cargarHorarios = async (id) => {
    if (!id) return;
    const res = await fetch(`${BASE_URL}/horarios/obtener_horarios.php?taller_id=${id}`, { credentials: "include" });
    const data = await res.json();
    if (Array.isArray(data)) {
      setHorarios(data);
    } else {
      setHorarios([]);
      toast(data.mensaje || "Error cargando horarios", "error");
    }
  };

  const verInscritos = async (horario_id) => {
    const res = await fetch(`${BASE_URL}/inscripciones/obtener_inscritos.php?horario_id=${horario_id}`, { credentials: "include" });
    setInscritos(await res.json());
    setHorarioActivo(horario_id);
    setModalInscritos(true);
  };

  // ── Talleres ─────────────────────────────────
  const handleEliminarTaller = async (id) => {
    if (!window.confirm("Esto eliminará el taller, horarios e inscripciones.\n¿Continuar?")) return;
    const res = await eliminarTaller(id);
    if (res.ok) {
      toast("Taller eliminado correctamente");
      cargarTalleres();
      setTallerSeleccionado("");
      setHorarios([]);
    } else {
      toast(res.mensaje || "Error al eliminar", "error");
    }
  };

  // ── Horarios ─────────────────────────────────
  const editarHorario = async () => {
    const res = await fetch(`${BASE_URL}/horarios/editar_horario.php`, {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: horarioEditando.id, ...formHorario }),
    });
    const data = await res.json();
    if (data.ok) { toast("Horario actualizado"); limpiarEdicion(); cargarHorarios(tallerSeleccionado); }
    else toast(data.mensaje, "error");
  };

  const cancelarHorario = async (id) => {
    await fetch(`${BASE_URL}/horarios/cancelar_horario.php`, {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    cargarHorarios(tallerSeleccionado);
  };

  const iniciarEdicion = (h) => {
    setHorarioEditando(h);
    setFormHorario({ dia_semana: h.dia_semana, hora_inicio: h.hora_inicio, hora_fin: h.hora_fin, cupo_maximo: h.cupo_maximo, espacio: h.espacio });
  };

  const limpiarEdicion = () => {
    setHorarioEditando(null);
    setFormHorario(horarioVacio());
  };

  // ── Inscripciones ────────────────────────────
  const acreditarInscripcion = async (inscripcion_id) => {
    const res = await fetch(`${BASE_URL}/inscripciones/acreditar_inscripcion.php`, {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inscripcion_id }),
    });
    const data = await res.json();
    toast(data.mensaje, data.ok ? "success" : "error");
    if (data.ok) { verInscritos(horarioActivo); cargarHorarios(tallerSeleccionado); }
  };

  const cancelarInscripcion = async (alumno_id) => {
    await fetch(`${BASE_URL}/inscripciones/cancelar_inscripcion.php`, {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alumno_id, horario_id: horarioActivo }),
    });
    verInscritos(horarioActivo);
    cargarHorarios(tallerSeleccionado);
  };

  useEffect(() => { cargarTalleres(); }, []);

  const tallerActual = talleres.find((t) => String(t.id) === String(tallerSeleccionado));

  // ── Render ───────────────────────────────────
  return (
    <Box sx={{ p: 4, maxWidth: 1200 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
        <Box>
          <Typography variant="h5" fontWeight={500}>Panel de administración</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Gestión de talleres, horarios e inscripciones
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogNuevoTaller(true)}
          disableElevation
        >
          Nuevo taller
        </Button>
      </Box>

      {/* Grid principal */}
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 2.5, alignItems: "start" }}>

        {/* ── Columna izquierda ── */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

          {/* Seleccionar taller */}
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <SectionLabel>TALLER ACTIVO</SectionLabel>
            <TextField
              select fullWidth size="small" label="Seleccionar taller"
              value={tallerSeleccionado}
              onChange={(e) => {
                const id = e.target.value ? parseInt(e.target.value) : "";
                setTallerSeleccionado(id);
                cargarHorarios(id);
                limpiarEdicion();
              }}
            >
              <MenuItem value="">— Ninguno seleccionado —</MenuItem>
              {talleres.map((t) => <MenuItem key={t.id} value={t.id}>{t.nombre}</MenuItem>)}
            </TextField>

            {tallerActual && (
              <Box mt={1.5} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
                <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
                  <Chip label={tallerActual.nombre} size="small" />
                  <Chip label={tallerActual.tipo} size="small" variant="outlined" />
                  {tallerActual.promotor && <Chip label={tallerActual.promotor} size="small" variant="outlined" />}
                </Box>
                <Button
                  size="small" color="error" variant="outlined"
                  startIcon={<DeleteOutlineIcon />}
                  onClick={() => handleEliminarTaller(tallerSeleccionado)}
                  sx={{ borderColor: "divider", whiteSpace: "nowrap" }}
                >
                  Eliminar
                </Button>
              </Box>
            )}
          </Paper>

          {/* Editar horario */}
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <SectionLabel>EDITAR HORARIO</SectionLabel>

            {!horarioEditando ? (
              <Typography variant="body2" color="text.disabled">
                Selecciona un horario de la tabla y presiona Editar.
              </Typography>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <TextField
                  select fullWidth size="small" label="Día"
                  value={formHorario.dia_semana}
                  onChange={(e) => setFormHorario((p) => ({ ...p, dia_semana: e.target.value }))}
                >
                  {DIAS.map(([v, l]) => <MenuItem key={v} value={v}>{l}</MenuItem>)}
                </TextField>

                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                  {[["hora_inicio", "Hora inicio"], ["hora_fin", "Hora fin"]].map(([campo, label]) => (
                    <Box key={campo} sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                      <Typography sx={{ fontSize: 13, color: "text.secondary" }}>{label}</Typography>
                      <TimePicker
                        value={formHorario[campo]}
                        onChange={(v) => setFormHorario((p) => ({ ...p, [campo]: v }))}
                      />
                    </Box>
                  ))}
                </Box>

                <Box sx={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 1 }}>
                  <TextField
                    size="small" label="Cupo" type="number"
                    value={formHorario.cupo_maximo}
                    onChange={(e) => setFormHorario((p) => ({ ...p, cupo_maximo: +e.target.value }))}
                    inputProps={{ min: 1, max: 200, style: { textAlign: "center" } }}
                  />
                  <TextField
                    size="small" label="Espacio" value={formHorario.espacio}
                    placeholder="Sala A, Gym..."
                    onChange={(e) => setFormHorario((p) => ({ ...p, espacio: e.target.value }))}
                  />
                </Box>

                <Box sx={{ display: "flex", gap: 1, pt: 0.5 }}>
                  <Button variant="contained" size="small" startIcon={<SaveOutlinedIcon />} onClick={editarHorario} disableElevation>
                    Guardar cambios
                  </Button>
                  <Button
                    variant="outlined" size="small" onClick={limpiarEdicion}
                    sx={{ borderColor: "divider", color: "text.secondary" }}
                  >
                    Cancelar
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </Box>

        {/* ── Columna derecha: tabla horarios ── */}
        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
          <SectionLabel>
            HORARIOS DEL TALLER{horarios.length > 0 ? ` (${horarios.length})` : ""}
          </SectionLabel>

          {!tallerSeleccionado ? (
            <Typography variant="body2" color="text.disabled">
              Selecciona un taller para ver sus horarios.
            </Typography>
          ) : horarios.length === 0 ? (
            <Typography variant="body2" color="text.disabled">
              Este taller no tiene horarios registrados.
            </Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  {["Día", "Horario", "Espacio", "Cupo", ""].map((col, i) => (
                    <ColLabel key={i}>{col}</ColLabel>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {horarios.map((h) => (
                  <TableRow
                    key={h.id}
                    sx={{
                      "&:last-child td": { borderBottom: 0 },
                      bgcolor: horarioEditando?.id === h.id ? "action.selected" : "transparent",
                    }}
                  >
                    <TableCell sx={{ fontSize: 13 }}>{h.dia_nombre}</TableCell>
                    <TableCell sx={{ fontSize: 13 }}>{h.hora_inicio} – {h.hora_fin}</TableCell>
                    <TableCell sx={{ fontSize: 13 }}>{h.espacio || "—"}</TableCell>
                    <TableCell>
                      <Chip
                        label={`${h.inscritos} / ${h.cupo_total}`}
                        size="small"
                        color={h.inscritos >= h.cupo_total ? "error" : "default"}
                        variant="outlined"
                        sx={{ fontSize: 12 }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                      <IconButton size="small" title="Ver alumnos" onClick={() => verInscritos(h.id)}>
                        <PeopleOutlineIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" title="Editar" onClick={() => iniciarEdicion(h)}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" title="Cancelar horario" color="error" onClick={() => cancelarHorario(h.id)}>
                        <BlockOutlinedIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      </Box>

      {/* ── Dialog nuevo taller ── */}
      <NuevoTallerDialog
        open={dialogNuevoTaller}
        onClose={() => setDialogNuevoTaller(false)}
        onSuccess={cargarTalleres}
        toast={toast}
      />

      {/* ── Dialog inscritos ── */}
      <Dialog open={modalInscritos} onClose={() => setModalInscritos(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
          <Typography fontWeight={500}>Alumnos inscritos</Typography>
          <IconButton size="small" onClick={() => setModalInscritos(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2 }}>
          {inscritos.length === 0 ? (
            <Typography variant="body2" color="text.disabled">No hay alumnos inscritos en este horario.</Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  {["Nombre", "No. control", "Carrera", ""].map((col, i) => <ColLabel key={i}>{col}</ColLabel>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {inscritos.map((a) => (
                  <TableRow key={a.id} sx={{ "&:last-child td": { borderBottom: 0 } }}>
                    <TableCell sx={{ fontSize: 13 }}>{a.nombre}</TableCell>
                    <TableCell sx={{ fontSize: 13 }}>{a.numero_control}</TableCell>
                    <TableCell sx={{ fontSize: 13 }}>{a.carrera}</TableCell>
                    <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                      <Button
                        size="small" variant="outlined" startIcon={<CheckCircleOutlineIcon />}
                        onClick={() => acreditarInscripcion(a.inscripcion_id)}
                        sx={{ mr: 1, borderColor: "divider", color: "success.main", "&:hover": { borderColor: "success.main" } }}
                      >
                        Acreditar
                      </Button>
                      <Button
                        size="small" variant="outlined" color="error" startIcon={<BlockOutlinedIcon />}
                        onClick={() => cancelarInscripcion(a.id)}
                        sx={{ borderColor: "divider" }}
                      >
                        Cancelar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Snackbar global ── */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={() => setSnack((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snack.severity} onClose={() => setSnack((p) => ({ ...p, open: false }))} variant="filled" sx={{ width: "100%" }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}