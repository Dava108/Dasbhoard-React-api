/**
 * adminStyles.js
 * Estilos centralizados para AdminIndex.
 * Recibe { colors, isDark } del tema MUI y devuelve el objeto `s`.
 */

export function getStyles(colors, isDark) {
  return {
    page: {
      minHeight: "100vh",
      background: colors.primary[900],
      padding: "32px 24px",
      fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif",
    },

    /* ── Header ── */
    header: {
      marginBottom: 32,
      borderBottom: `1.5px solid ${colors.primary[700]}`,
      paddingBottom: 20,
    },
    headerTitle: {
      fontSize: "clamp(18px, 4vw, 26px)",
      fontWeight: 700,
      color: colors.grey[100],
      margin: 0,
      letterSpacing: "-0.5px",
    },
    headerSub: {
      fontSize: 14,
      color: colors.grey[400],
      margin: "4px 0 0",
    },

    /* ── Layout principal — 2 columnas en desktop, 1 en móvil ── */
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
      gap: 24,
      alignItems: "start",
    },

    /* ── Cards ── */
    card: {
      background: colors.primary[400],
      borderRadius: 12,
      border: `0.5px solid ${colors.primary[600]}`,
      padding: "20px 22px",
      marginBottom: 20,
    },

    /* ── Tipografía de sección ── */
    sectionTitle: {
      fontSize: 12,
      fontWeight: 600,
      color: colors.grey[300],
      textTransform: "uppercase",
      letterSpacing: "0.7px",
      margin: "0 0 16px",
      display: "flex",
      alignItems: "center",
      gap: 8,
    },
    label: {
      display: "block",
      fontSize: 12,
      fontWeight: 500,
      color: colors.grey[400],
      marginBottom: 4,
      marginTop: 12,
    },

    /* ── Inputs ── */
    input: {
      width: "100%",
      padding: "8px 12px",
      border: `0.5px solid ${isDark ? colors.primary[600] : colors.grey[600]}`,
      borderRadius: 8,
      fontSize: 14,
      color: colors.grey[100],
      background: isDark ? colors.primary[500] : "#ffffff",
      boxSizing: "border-box",
      outline: "none",
    },
    select: {
      width: "100%",
      padding: "8px 12px",
      border: `0.5px solid ${isDark ? colors.primary[600] : colors.grey[600]}`,
      borderRadius: 8,
      fontSize: 14,
      color: colors.grey[100],
      background: isDark ? colors.primary[500] : "#ffffff",
      boxSizing: "border-box",
      outline: "none",
      appearance: "none",
      cursor: "pointer",
    },

    /* ── Botones ── */
    btnPrimary: {
      padding: "9px 18px",
      background: colors.greenAccent[500],
      color: colors.primary[900],
      border: "none",
      borderRadius: 8,
      fontSize: 13,
      fontWeight: 700,
      cursor: "pointer",
      marginTop: 14,
      width: "100%",
    },
    btnDanger: {
      padding: "8px 14px",
      background: "transparent",
      color: colors.redAccent[400],
      border: `0.5px solid ${colors.redAccent[500]}`,
      borderRadius: 8,
      fontSize: 13,
      fontWeight: 500,
      cursor: "pointer",
      marginTop: 10,
      width: "100%",
    },
    btnDisabled: {
      opacity: 0.35,
      cursor: "not-allowed",
    },
    btnSmall: {
      padding: "5px 10px",
      border: `0.5px solid ${isDark ? colors.primary[600] : colors.grey[600]}`,
      borderRadius: 6,
      fontSize: 12,
      cursor: "pointer",
      background: isDark ? colors.primary[500] : "#ffffff",
      color: colors.grey[200],
      marginLeft: 4,
    },
    btnSmallDanger: {
      padding: "5px 10px",
      border: `0.5px solid ${colors.redAccent[500]}`,
      borderRadius: 6,
      fontSize: 12,
      cursor: "pointer",
      background: "transparent",
      color: colors.redAccent[400],
      marginLeft: 4,
    },
    btnSmallGhost: {
      padding: "5px 10px",
      border: `0.5px solid ${colors.greenAccent[600]}`,
      borderRadius: 6,
      fontSize: 12,
      cursor: "pointer",
      background: "transparent",
      color: colors.greenAccent[500],
      marginLeft: 4,
    },

    /* ── Tabla ── */
    tableWrapper: {
      width: "100%",
      overflowX: "auto",   // scroll horizontal en pantallas pequeñas
      WebkitOverflowScrolling: "touch",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: 13,
      marginTop: 4,
      minWidth: 500,        // evita que la tabla se comprima demasiado
    },
    th: {
      textAlign: "left",
      padding: "10px 14px",
      fontSize: 11,
      fontWeight: 600,
      color: colors.grey[400],
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      borderBottom: `1px solid ${isDark ? colors.primary[600] : colors.grey[700]}`,
      background: isDark ? colors.primary[500] : colors.grey[800],
    },
    td: {
      padding: "11px 14px",
      borderBottom: `0.5px solid ${colors.primary[600]}`,
      color: colors.grey[200],
      verticalAlign: "middle",
    },

    /* ── Badges ── */
    badge: {
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 600,
    },
    badgeGreen: {
      background: isDark ? colors.greenAccent[900] : colors.greenAccent[800],
      color: isDark ? colors.greenAccent[500] : colors.greenAccent[400],
    },
    badgeAmber: {
      background: isDark ? "#1e1507" : "#fff3db",
      color: isDark ? "#f0b040" : "#7a4f0a",
    },

    /* ── Alertas ── */
    alert: {
      padding: "10px 14px",
      borderRadius: 8,
      fontSize: 13,
      marginBottom: 16,
    },
    alertError: {
      background: colors.redAccent[900],
      color: isDark ? colors.redAccent[300] : colors.redAccent[400],
      border: `0.5px solid ${isDark ? colors.redAccent[700] : colors.redAccent[600]}`,
    },
    alertSuccess: {
      background: colors.greenAccent[900],
      color: isDark ? colors.greenAccent[400] : colors.greenAccent[300],
      border: `0.5px solid ${isDark ? colors.greenAccent[700] : colors.greenAccent[600]}`,
    },

    /* ── Misceláneos ── */
    tallerPreview: {
      marginTop: 12,
      padding: "10px 12px",
      background: isDark ? colors.primary[500] : colors.grey[800],
      borderRadius: 8,
      fontSize: 13,
    },
    emptyState: {
      textAlign: "center",
      padding: "40px 0",
      color: colors.grey[500],
    },
    emptyIcon: { fontSize: 36, marginBottom: 8 },

    selectWrapper: { position: "relative" },
    chevron: {
      position: "absolute",
      right: 12,
      top: "50%",
      transform: "translateY(-50%)",
      pointerEvents: "none",
      color: colors.grey[400],
      fontSize: 12,
    },

    /* ── Formulario en 2 columnas (colapsa en móvil con auto-fit) ── */
    formRow: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
      gap: 10,
    },

    /* ── Barra de modo horario ── */
    horarioModeBar: { display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" },
    modeTab: (active) => ({
      padding: "6px 14px",
      borderRadius: 8,
      border: active
        ? `1.5px solid ${colors.greenAccent[500]}`
        : `0.5px solid ${isDark ? colors.primary[600] : colors.grey[600]}`,
      background: active ? colors.greenAccent[500] : (isDark ? colors.primary[500] : "#ffffff"),
      color: active ? colors.primary[900] : colors.grey[300],
      fontSize: 12,
      fontWeight: 600,
      cursor: "pointer",
    }),

    /* ── Acciones de tabla en móvil ── */
    actionGroup: {
      display: "flex",
      flexWrap: "wrap",
      gap: 4,
    },

    /* ── Modal ── */
    modalOverlay: {
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: isDark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.45)",
      zIndex: 999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px",           // margen en móvil
    },
    modalBox: {
      background: colors.primary[400],
      borderRadius: 14,
      border: `0.5px solid ${colors.primary[600]}`,
      padding: "24px 28px",
      width: "100%",
      maxWidth: 640,
      maxHeight: "90vh",
      overflowY: "auto",
    },
    modalHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 18,
      gap: 12,
    },
    modalTitle: {
      fontSize: 16,
      fontWeight: 700,
      color: colors.grey[100],
      margin: 0,
    },
    closeBtn: {
      background: isDark ? colors.primary[500] : "#ffffff",
      border: `0.5px solid ${isDark ? colors.primary[600] : colors.grey[600]}`,
      borderRadius: 6,
      padding: "5px 12px",
      cursor: "pointer",
      fontSize: 13,
      color: colors.grey[300],
      flexShrink: 0,
    },

    /* ── Avatar ── */
    avatarCircle: {
      width: 30, height: 30, borderRadius: "50%",
      background: isDark ? colors.greenAccent[800] : colors.greenAccent[700],
      color: isDark ? colors.greenAccent[300] : colors.greenAccent[400],
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 11, fontWeight: 700, flexShrink: 0,
    },
  };
}