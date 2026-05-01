import React, { useEffect, useState } from "react";

const BASE_URL = "http://localhost:81/creditos_api/admin";

export default function AdminIndex() {
    const [talleres, setTalleres] = useState([]);
    const [tallerSeleccionado, setTallerSeleccionado] = useState(null);
    const [horarios, setHorarios] = useState([]);
    const [inscritos, setInscritos] = useState([]);
    const [verModal, setVerModal] = useState(false);

    // 🔥 NUEVO (fix real)
    const [horarioActivo, setHorarioActivo] = useState(null);

    // 🔹 cargar talleres
    const cargarTalleres = async () => {
        const res = await fetch(`${BASE_URL}/talleres/obtener_talleres.php`);
        const data = await res.json();
        setTalleres(data);
    };

    // 🔹 cargar horarios
    const cargarHorarios = async (taller_id) => {
        const res = await fetch(
            `${BASE_URL}/horarios/obtener_horarios.php?taller_id=${taller_id}`
        );
        const data = await res.json();
        setHorarios(data);
    };

    // 🔹 ver inscritos
    const verInscritos = async (horario_id) => {
        const res = await fetch(
            `${BASE_URL}/inscripciones/obtener_inscritos.php?horario_id=${horario_id}`
        );
        const data = await res.json();

        setInscritos(data);
        setHorarioActivo(horario_id); // 🔥 guardamos el horario correcto
        setVerModal(true);
    };

    // 🔹 cancelar inscripción
    const cancelarInscripcion = async (alumno_id) => {
        await fetch(`${BASE_URL}/inscripciones/cancelar_inscripcion.php`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                alumno_id,
                horario_id: horarioActivo, // 🔥 usamos el correcto
            }),
        });

        // refrescar
        verInscritos(horarioActivo);
        cargarHorarios(tallerSeleccionado);
    };

    // 🔹 cancelar horario
    const cancelarHorario = async (id) => {
        await fetch(`${BASE_URL}/horarios/cancelar_horario.php`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        });

        cargarHorarios(tallerSeleccionado);
    };

    useEffect(() => {
        cargarTalleres();
    }, []);

    const [formHorario, setFormHorario] = useState({
        dia_semana: "",
        hora_inicio: "",
        hora_fin: "",
        cupo_maximo: 30,
        espacio: ""
    });

    const crearHorario = async () => {

        if (!tallerSeleccionado) {
            alert("Selecciona un taller");
            return;
        }

        if (!formHorario.dia_semana || !formHorario.hora_inicio || !formHorario.hora_fin) {
            alert("Faltan datos");
            return;
        }

        if (formHorario.hora_inicio >= formHorario.hora_fin) {
            alert("Hora inválida");
            return;
        }

        const res = await fetch(`${BASE_URL}/horarios/crear_horario.php`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...formHorario,
                taller_id: tallerSeleccionado
            })
        });

        const data = await res.json();

        if (data.ok) {
            alert("Horario creado");

            // limpiar
            setFormHorario({
                dia_semana: "",
                hora_inicio: "",
                hora_fin: "",
                cupo_maximo: 30,
                espacio: ""
            });

            // refrescar tabla
            cargarHorarios(tallerSeleccionado);

        } else {
            alert("Error al crear");
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormHorario({
            ...formHorario,
            [name]: value
        });
    };
    const [formTaller, setFormTaller] = useState({
        nombre: "",
        tipo: "",
        promotor: ""
    });

    const crearTaller = async () => {

        if (!formTaller.nombre || !formTaller.tipo) {
            alert("Faltan datos");
            return;
        }

        const res = await fetch(`${BASE_URL}/talleres/crear_taller.php`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formTaller)
        });

        const data = await res.json();

        if (data.ok) {
            alert("Taller creado");

            setFormTaller({
                nombre: "",
                tipo: "",
                promotor: ""
            });

            cargarTalleres(); // 🔥 refresca lista

        } else {
            alert("Error al crear taller");
        }
    };
    const handleChangeTaller = (e) => {
        const { name, value } = e.target;

        setFormTaller({
            ...formTaller,
            [name]: value
        });
    };



    return (
        <div style={{ padding: 20 }}>
            <h2>Panel Admin - Talleres</h2>

            {/* selector */}
            <div style={{ marginBottom: 20 }}>
                <h3>Crear Taller</h3>

                <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre del taller"
                    onChange={handleChangeTaller}
                />

                <select name="tipo" onChange={handleChangeTaller}>
                    <option value="">Tipo</option>
                    <option value="deportivo">Deportivo</option>
                    <option value="cultural">Cultural</option>
                </select>

                <input
                    type="text"
                    name="promotor"
                    placeholder="Promotor"
                    onChange={handleChangeTaller}
                />

                <button onClick={crearTaller}>
                    Crear Taller
                </button>
            </div>
            <select
                onChange={(e) => {
                    const id = e.target.value;
                    setTallerSeleccionado(id);
                    cargarHorarios(id);
                }}
            >
                <option value="">Selecciona un taller</option>
                {talleres.map((t) => (
                    <option key={t.id} value={t.id}>
                        {t.nombre} ({t.tipo})
                    </option>
                ))}
            </select>
            <div style={{ marginTop: 20 }}>
                <h3>Crear Horario</h3>

                <select name="dia_semana" onChange={handleChange}>
                    <option value="">Día</option>
                    <option value="1">Lunes</option>
                    <option value="2">Martes</option>
                    <option value="3">Miércoles</option>
                    <option value="4">Jueves</option>
                    <option value="5">Viernes</option>
                </select>

                <input
                    type="time"
                    name="hora_inicio"
                    onChange={handleChange}
                />

                <input
                    type="time"
                    name="hora_fin"
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="cupo_maximo"
                    placeholder="Cupo"
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="espacio"
                    placeholder="Espacio"
                    onChange={handleChange}
                />

                <button onClick={crearHorario}>
                    Crear
                </button>
            </div>

            {/* tabla */}
            <table border="1" cellPadding="8" style={{ marginTop: 20 }}>
                <thead>
                    <tr>
                        <th>Día</th>
                        <th>Hora</th>
                        <th>Espacio</th>
                        <th>Cupo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {horarios.map((h) => (
                        <tr key={h.id}>
                            <td>{h.dia_nombre}</td>
                            <td>
                                {h.hora_inicio} - {h.hora_fin}
                            </td>
                            <td>{h.espacio}</td>
                            <td>
                                {h.inscritos} / {h.cupo_total}
                            </td>
                            <td>
                                <button onClick={() => verInscritos(h.id)}>
                                    Ver inscritos
                                </button>

                                <button onClick={() => cancelarHorario(h.id)}>
                                    Cancelar horario
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* modal */}
            {verModal && (
                <div
                    style={{
                        position: "fixed",
                        top: 50,
                        left: "20%",
                        background: "#fff",
                        padding: 20,
                        border: "1px solid #000",
                    }}
                >
                    <h3>Inscritos</h3>

                    <table border="1" cellPadding="6">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Control</th>
                                <th>Carrera</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inscritos.map((a) => (
                                <tr key={a.id}>
                                    <td>{a.nombre}</td>
                                    <td>{a.numero_control}</td>
                                    <td>{a.carrera}</td>
                                    <td>
                                        <button onClick={() => cancelarInscripcion(a.id)}>
                                            Cancelar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <button onClick={() => setVerModal(false)}>Cerrar</button>
                </div>
            )}
        </div>
    );
}