import React, { useEffect, useState } from "react";
import { eliminarTaller } from "../../api/api";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { getStyles } from "../../components/adminStyles"; // ← estilos extraídos

const BASE_URL = "http://localhost:81/creditos_api/admin";

export default function AdminIndex() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDark = theme.palette.mode === "dark";

  // Estilos centralizados, generados según el tema activo
  const s = getStyles(colors, isDark);

  // ── Estado ────────────────────────────────────────────────────────────────
  const [talleres, setTalleres] = useState([]);
  const [tallerSeleccionado, setTallerSeleccionado] = useState("");
  const [horarios, setHorarios] = useState([]);
  const [inscritos, setInscritos] = useState([]);
  const [verModal, setVerModal] = useState(false);
  const [horarioActivo, setHorarioActivo] = useState(null);
  const [modoHorario, setModoHorario] = useState("crear");
  const [horarioEditando, setHorarioEditando] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formHorario, setFormHorario] = useState({
    dia_semana: "", hora_inicio: "", hora_fin: "", cupo_maximo: 30, espacio: "",
  });
  const [formTaller, setFormTaller] = useState({ nombre: "", tipo: "", promotor: "" });

  // ── Cargas ────────────────────────────────────────────────────────────────
  const acreditarInscripcion = async (inscripcion_id) => {
    const res = await fetch(
      `${BASE_URL}/inscripciones/acreditar_inscripcion.php`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inscripcion_id
        })
      }
    );

    const data = await res.json();

    if (data.ok) {
      alert(data.mensaje);

      // recargar lista de inscritos
      verInscritos(horarioActivo);

      // recargar horarios para actualizar cupos
      cargarHorarios(tallerSeleccionado);

    } else {
      alert(data.mensaje);
    }
  };
  const cargarTalleres = async () => {
    const res = await fetch(`${BASE_URL}/talleres/obtener_talleres.php`,
      {
        credentials: "include"
      }
    );
    const data = await res.json();
    setTalleres(data);
  };

  const cargarHorarios = async (id) => {
    if (!id) return;
    const res = await fetch(`${BASE_URL}/horarios/obtener_horarios.php?taller_id=${id}`,
      {
        credentials: "include"
      }
    );
    const data = await res.json();
    if (Array.isArray(data)) setHorarios(data);
    else { setHorarios([]); setError(data.mensaje || "Error cargando horarios"); }
  };

  const verInscritos = async (horario_id) => {
    const res = await fetch(`${BASE_URL}/inscripciones/obtener_inscritos.php?horario_id=${horario_id}`,
      {
        credentials: "include"
      }

    );
    const data = await res.json();
    setInscritos(data);
    setHorarioActivo(horario_id);
    setVerModal(true);
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleEliminarTaller = async (id) => {
    if (!window.confirm("⚠️ Esto eliminará el taller, horarios e inscripciones.\n¿Continuar?")) return;
    const res = await eliminarTaller(id);
    if (res.ok) { alert("Taller eliminado correctamente"); cargarTalleres(); setTallerSeleccionado(""); }
    else alert(res.mensaje || "Error al eliminar");
  };

  const handleChange = (e) => setFormHorario({ ...formHorario, [e.target.name]: e.target.value });
  const handleChangeTaller = (e) => setFormTaller({ ...formTaller, [e.target.name]: e.target.value });

  // ── Taller ────────────────────────────────────────────────────────────────
  const crearTaller = async () => {
    if (!formTaller.nombre || !formTaller.tipo) { setError("Faltan datos del taller"); return; }
    const res = await fetch(`${BASE_URL}/talleres/crear_taller.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formTaller),
    });
    const data = await res.json();
    if (data.ok) {
      setSuccess("Taller creado correctamente");
      setFormTaller({ nombre: "", tipo: "", promotor: "" });
      cargarTalleres();
    } else setError(data.mensaje || "Error al crear taller");
  };

  // ── Horarios ──────────────────────────────────────────────────────────────
  const crearHorario = async () => {
    if (!tallerSeleccionado) { setError("Selecciona un taller"); return; }
    const res = await fetch(`${BASE_URL}/horarios/crear_horario.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ ...formHorario, taller_id: parseInt(tallerSeleccionado) }),
    });
    const data = await res.json();
    if (data.ok) { setSuccess("Horario creado"); limpiarFormulario(); cargarHorarios(tallerSeleccionado); }
    else setError(data.mensaje);
  };

  const editarHorario = async () => {
    const res = await fetch(`${BASE_URL}/horarios/editar_horario.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id: horarioEditando.id, ...formHorario }),
    });
    const data = await res.json();
    if (data.ok) { setSuccess("Horario actualizado"); limpiarFormulario(); cargarHorarios(tallerSeleccionado); }
    else setError(data.mensaje);
  };

  const cancelarHorario = async (id) => {
    await fetch(`${BASE_URL}/horarios/cancelar_horario.php`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id }),
    });
    cargarHorarios(tallerSeleccionado);
  };

  const cancelarInscripcion = async (alumno_id) => {
    await fetch(`${BASE_URL}/inscripciones/cancelar_inscripcion.php`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ alumno_id, horario_id: horarioActivo }),
    });
    verInscritos(horarioActivo);
    cargarHorarios(tallerSeleccionado);
  };

  const iniciarEdicion = (h) => {
    setModoHorario("editar");
    setHorarioEditando(h);
    setFormHorario({
      dia_semana: h.dia_semana, hora_inicio: h.hora_inicio,
      hora_fin: h.hora_fin, cupo_maximo: h.cupo_maximo, espacio: h.espacio,
    });
  };

  const limpiarFormulario = () => {
    setModoHorario("crear");
    setHorarioEditando(null);
    setFormHorario({ dia_semana: "", hora_inicio: "", hora_fin: "", cupo_maximo: 30, espacio: "" });
  };

  // ── Efectos ───────────────────────────────────────────────────────────────
  useEffect(() => { cargarTalleres(); }, []);

  useEffect(() => {
    if (error || success) {
      const t = setTimeout(() => { setError(""); setSuccess(""); }, 3000);
      return () => clearTimeout(t);
    }
  }, [error, success]);

  const tallerActual = talleres.find((t) => String(t.id) === String(tallerSeleccionado));

  // ── Punto de color indicador ──────────────────────────────────────────────
  const Dot = ({ color }) => (
    <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, display: "inline-block" }} />
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={s.page}>

      {/* HEADER */}
      <div style={s.header}>
        <h1 style={s.headerTitle}>Panel de Administración</h1>
        <p style={s.headerSub}>Gestión de talleres, horarios e inscripciones</p>
      </div>

      {/* ALERTAS */}
      {error && <div style={{ ...s.alert, ...s.alertError }}>⚠ {error}</div>}
      {success && <div style={{ ...s.alert, ...s.alertSuccess }}>✓ {success}</div>}

      <div style={s.grid}>

        {/* ══════════ COLUMNA IZQUIERDA ══════════ */}
        <div>

          {/* CREAR TALLER */}
          <div style={s.card}>
            <p style={s.sectionTitle}>
              <Dot color={colors.greenAccent[500]} />
              Nuevo taller
            </p>

            <label style={s.label}>Nombre del taller</label>
            <input style={s.input} name="nombre" placeholder="Ej. Fútbol sala"
              value={formTaller.nombre} onChange={handleChangeTaller} />

            <label style={s.label}>Tipo</label>
            <div style={s.selectWrapper}>
              <select style={s.select} name="tipo" value={formTaller.tipo} onChange={handleChangeTaller}>
                <option value="">Seleccionar tipo</option>
                <option value="deportivo">Deportivo</option>
                <option value="cultural">Cultural</option>
              </select>
              <span style={s.chevron}>▾</span>
            </div>

            <label style={s.label}>Promotor</label>
            <input style={s.input} name="promotor" placeholder="Nombre del promotor"
              value={formTaller.promotor} onChange={handleChangeTaller} />

            <button style={s.btnPrimary} onClick={crearTaller}>+ Crear taller</button>
          </div>

          {/* SELECCIONAR TALLER */}
          <div style={s.card}>
            <p style={s.sectionTitle}>
              <Dot color={colors.blueAccent[500]} />
              Taller activo
            </p>

            <label style={s.label}>Seleccionar taller</label>
            <div style={s.selectWrapper}>
              <select style={s.select} value={tallerSeleccionado}
                onChange={(e) => {
                  const id = e.target.value ? parseInt(e.target.value) : "";
                  setTallerSeleccionado(id);
                  cargarHorarios(id);
                }}>
                <option value="">— Ninguno seleccionado —</option>
                {talleres.map((t) => (
                  <option key={t.id} value={t.id}>{t.nombre}</option>
                ))}
              </select>
              <span style={s.chevron}>▾</span>
            </div>

            {tallerActual && (
              <div style={s.tallerPreview}>
                <span style={{ fontWeight: 600, color: colors.grey[100], fontSize: 14 }}>
                  {tallerActual.nombre}
                </span>
                <span style={{
                  ...s.badge,
                  ...(tallerActual.tipo === "deportivo" ? s.badgeGreen : s.badgeAmber),
                  marginLeft: 8,
                }}>
                  {tallerActual.tipo}
                </span>
                {tallerActual.promotor && (
                  <p style={{ margin: "4px 0 0", color: colors.grey[400], fontSize: 12 }}>
                    Promotor: {tallerActual.promotor}
                  </p>
                )}
              </div>
            )}

            <button
              style={{ ...s.btnDanger, ...(tallerSeleccionado ? {} : s.btnDisabled) }}
              disabled={!tallerSeleccionado}
              onClick={() => handleEliminarTaller(tallerSeleccionado)}
            >
              Eliminar taller seleccionado
            </button>
          </div>

          {/* FORM HORARIO */}
          <div style={s.card}>
            <div style={s.horarioModeBar}>
              <button style={s.modeTab(modoHorario === "crear")} onClick={limpiarFormulario}>
                Crear horario
              </button>
              {modoHorario === "editar" && (
                <button style={s.modeTab(true)}>Editar horario</button>
              )}
            </div>

            <label style={s.label}>Día de la semana</label>
            <div style={s.selectWrapper}>
              <select style={s.select} name="dia_semana" value={formHorario.dia_semana} onChange={handleChange}>
                <option value="">Seleccionar día</option>
                <option value="1">Lunes</option>
                <option value="2">Martes</option>
                <option value="3">Miércoles</option>
                <option value="4">Jueves</option>
                <option value="5">Viernes</option>
              </select>
              <span style={s.chevron}>▾</span>
            </div>

            <div style={s.formRow}>
              <div>
                <label style={s.label}>Hora inicio</label>
                <input type="time" style={s.input} name="hora_inicio" value={formHorario.hora_inicio} onChange={handleChange} />
              </div>
              <div>
                <label style={s.label}>Hora fin</label>
                <input type="time" style={s.input} name="hora_fin" value={formHorario.hora_fin} onChange={handleChange} />
              </div>
            </div>

            <div style={s.formRow}>
              <div>
                <label style={s.label}>Cupo máximo</label>
                <input type="number" style={s.input} name="cupo_maximo" value={formHorario.cupo_maximo} onChange={handleChange} />
              </div>
              <div>
                <label style={s.label}>Espacio / Lugar</label>
                <input type="text" style={s.input} name="espacio" placeholder="Ej. Gym A" value={formHorario.espacio} onChange={handleChange} />
              </div>
            </div>

            <button style={s.btnPrimary} onClick={modoHorario === "crear" ? crearHorario : editarHorario}>
              {modoHorario === "crear" ? "+ Crear horario" : "✓ Guardar cambios"}
            </button>

            {modoHorario === "editar" && (
              <button style={{ ...s.btnDanger, marginTop: 8 }} onClick={limpiarFormulario}>
                Cancelar edición
              </button>
            )}
          </div>
        </div>

        {/* ══════════ COLUMNA DERECHA ══════════ */}
        <div>
          <div style={s.card}>
            <p style={s.sectionTitle}>
              <Dot color={colors.blueAccent[400]} />
              Horarios del taller
              {horarios.length > 0 && (
                <span style={{ ...s.badge, ...s.badgeAmber, marginLeft: "auto" }}>
                  {horarios.length} horario{horarios.length !== 1 ? "s" : ""}
                </span>
              )}
            </p>

            {!tallerSeleccionado ? (
              <div style={s.emptyState}>
                <div style={s.emptyIcon}>📋</div>
                <p style={{ margin: 0, fontSize: 14 }}>Selecciona un taller para ver sus horarios</p>
              </div>
            ) : horarios.length === 0 ? (
              <div style={s.emptyState}>
                <div style={s.emptyIcon}>🕐</div>
                <p style={{ margin: 0, fontSize: 14 }}>Este taller no tiene horarios registrados</p>
              </div>
            ) : (
              /* Wrapper con scroll horizontal en móvil */
              <div style={s.tableWrapper}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      <th style={s.th}>Día</th>
                      <th style={s.th}>Horario</th>
                      <th style={s.th}>Espacio</th>
                      <th style={s.th}>Cupo</th>
                      <th style={s.th}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {horarios.map((h) => {
                      const lleno = h.inscritos >= h.cupo_total;
                      return (
                        <tr key={h.id}>
                          <td style={s.td}>
                            <span style={{ fontWeight: 600, color: colors.grey[100] }}>{h.dia_nombre}</span>
                          </td>
                          <td style={s.td}>
                            <span style={{ fontFamily: "monospace", fontSize: 13, color: colors.grey[200] }}>
                              {h.hora_inicio} – {h.hora_fin}
                            </span>
                          </td>
                          <td style={s.td}>
                            {h.espacio || <span style={{ color: colors.grey[500] }}>—</span>}
                          </td>
                          <td style={s.td}>
                            <span style={{ ...s.badge, ...(lleno ? s.badgeAmber : s.badgeGreen) }}>
                              {h.inscritos} / {h.cupo_total}
                            </span>
                          </td>
                          <td style={s.td}>
                            <div style={s.actionGroup}>
                              <button style={s.btnSmallGhost} onClick={() => verInscritos(h.id)}>Ver alumnos</button>
                              <button style={s.btnSmall} onClick={() => iniciarEdicion(h)}>Editar</button>
                              <button style={s.btnSmallDanger} onClick={() => cancelarHorario(h.id)}>Cancelar</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL INSCRITOS */}
      {verModal && (
        <div style={s.modalOverlay}>
          <div style={s.modalBox}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>Alumnos inscritos</h2>
              <button style={s.closeBtn} onClick={() => setVerModal(false)}>✕ Cerrar</button>
            </div>

            {inscritos.length === 0 ? (
              <div style={s.emptyState}>
                <div style={s.emptyIcon}>👤</div>
                <p style={{ margin: 0, fontSize: 14 }}>No hay alumnos inscritos en este horario</p>
              </div>
            ) : (
              <>
                <p style={{ fontSize: 13, color: colors.grey[400], marginBottom: 14, marginTop: 0 }}>
                  {inscritos.length} alumno{inscritos.length !== 1 ? "s" : ""} inscrito{inscritos.length !== 1 ? "s" : ""}
                </p>
                {/* Scroll horizontal en el modal también */}
                <div style={s.tableWrapper}>
                  <table style={s.table}>
                    <thead>
                      <tr>
                        <th style={s.th}>Nombre</th>
                        <th style={s.th}>No. Control</th>
                        <th style={s.th}>Carrera</th>
                        <th style={s.th}>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inscritos.map((a) => (
                        <tr key={a.id}>
                          <td style={s.td}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={s.avatarCircle}>
                                {a.nombre?.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase()}
                              </div>
                              <span style={{ fontWeight: 500, color: colors.grey[100] }}>{a.nombre}</span>
                            </div>
                          </td>
                          <td style={s.td}>
                            <span style={{ fontFamily: "monospace", fontSize: 13 }}>{a.numero_control}</span>
                          </td>
                          <td style={s.td}>{a.carrera}</td>
                          <td style={s.td}>
                            <button style={s.btnSmallDanger} onClick={() => acreditarInscripcion(a.inscripcion_id)}>
                              Acreditar
                            </button>
                            <button style={s.btnSmallDanger} onClick={() => cancelarInscripcion(a.id)}>
                              Cancelar inscripción
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
