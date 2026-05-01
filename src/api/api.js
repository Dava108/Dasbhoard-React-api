const API_URL = "http://localhost:81/creditos_api";

export const getAlumnos = async () => {
  const res = await fetch(`${API_URL}/alumnos/get_alumnos.php`);
  return res.json();
};

export const getAlumnosFiltrados = async (generacion, carrera) => {
  const res = await fetch(
    `http://localhost:81/creditos_api/alumnos/get_alumnos_filtrados.php?generacion_id=${generacion}&carrera_id=${carrera}`
  );

  const text = await res.text(); // IMPORTANTE
  console.log("RESPUESTA RAW:", text);

  return JSON.parse(text);
};

export const getHistorialAlumno = async (id) => {
  const res = await fetch(`${API_URL}/alumnos/historial_alumno.php?alumno_id=${id}`);
  return res.json();
};

export const crearRegistro = async (data) => {
  const res = await fetch(`${API_URL}/actividades/create_registro.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const actualizarRegistro = async (id, data) => {
  const res = await fetch(
    `http://localhost:81/creditos_api/actividades/update_registro.php`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...data, id })
    }
  );

  return res.json();
};

export const eliminarRegistro = async (id) => {
  return fetch(`${API_URL}/actividades/delete_registro.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  }).then((res) => res.json());
};

export const importarAlumnos = async (file, generacion_id, carrera_id) => {
  const formData = new FormData();
  formData.append("archivo", file);
  formData.append("generacion_id", generacion_id);
  formData.append("carrera_id", carrera_id);

  const res = await fetch(`${API_URL}/alumnos/importar_alumnos.php`, {
    method: "POST",
    body: formData,
  });

  const text = await res.text();
  console.log("IMPORT RAW:", text);

  return JSON.parse(text);
};

export const generarConstancia = (alumno_id) => {
  window.open(
    `${API_URL}/creditos/generar_constancia.php?alumno_id=${alumno_id}`,
    "_blank"
  );
};
export const importarKardex = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/creditos/importar_kardex.php`, {
    method: "POST",
    body: formData,
  });

  return res.json();
};

export const login = async (data) => {
  const res = await fetch(`${API_URL}/auth/login.php`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.json();
};
export const cambiarPassword = async (data) => {
  const res = await fetch(`${API_URL}/auth/cambiar_password.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
  });

  return res.json();
};
export const getUsuarios = async () => {
  const res = await fetch(`${API_URL}/usuarios/get_usuarios.php`);
  return res.json();
};

export const crearUsuario = async (data) => {
  const res = await fetch(`${API_URL}/usuarios/crear_usuario.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const actualizarUsuario = async (data) => {
  const res = await fetch(`${API_URL}/usuarios/actualizar_usuario.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const eliminarUsuario = async (id) => {
  const res = await fetch(`${API_URL}/usuarios/eliminar_usuario.php?id=${id}`);
  return res.json();
};








//TALLERES HORARIO 
const BASE_URL = "http://localhost:81/creditos_api";

// 🔹 Obtener calendario
export const obtenerCalendario = async () => {
  const res = await fetch(`${BASE_URL}/talleres/obtener_calendario.php`);
  return await res.json();
};

// 🔹 Crear taller
export const crearTaller = async (data) => {
  const res = await fetch(`${BASE_URL}/talleres/crear_taller.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  // 1. Obtenemos la respuesta como texto plano primero
  const text = await res.text();
  
  // 2. Lo mostramos en la consola para ver el Warning de PHP
  console.log("CONTENIDO DEL SERVIDOR:", text);

  // 3. Intentamos convertirlo a objeto solo si es posible
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("No se pudo parsear JSON porque el PHP envió un error.");
    return { error: "Fallo en el servidor", raw: text };
  }
};

// 🔹 Agregar horario
export const agregarHorario = async (data) => {
  const res = await fetch(`${BASE_URL}/talleres/agregar_horario.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return await res.json();
};

//  Editar horario
export const editarHorario = async (data) => {
  const res = await fetch(`${BASE_URL}/talleres/editar_horario.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return await res.json();
};

// 🔹 Eliminar horario
export const eliminarHorario = async (id) => {
  const res = await fetch(`${BASE_URL}/talleres/eliminar_horario.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id })
  });

  return await res.json();
};