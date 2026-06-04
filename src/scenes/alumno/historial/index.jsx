import React, { useEffect, useState } from "react";
import { obtenerHistorial } from "../../../api/api";

const HistorialAlumno = () => {

    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(true);

    const cargarHistorial = async () => {

        try {

            const data = await obtenerHistorial();

            console.log("HISTORIAL:", data);

            setHistorial(data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        cargarHistorial();

    }, []);



    if (loading) {

        return <h3>Cargando historial...</h3>;

    }

    return (

    <div style={{padding:"20px"}}>

        <h1>Mi historial</h1>

        {historial.length === 0 ? (

            <p>No tienes actividades registradas</p>

        ) : (

            historial.map((item) => (

                <div
                    key={item.id}
                    style={{
                        border:"1px solid #ddd",
                        borderRadius:"10px",
                        padding:"15px",
                        marginBottom:"15px",
                        
                    }}
                >

                    <h3>{item.taller}</h3>

                    <p>
                        <strong>Tipo:</strong>{" "}
                        {item.tipo}
                    </p>

                    <p>
                        <strong>Ciclo:</strong>{" "}
                        {item.ciclo}
                    </p>

                    <p>
                        <strong>Horario:</strong>{" "}
                        {item.horario}
                    </p>


                    <div>

                        <strong>Estado:</strong>{" "}

                        {item.estado === "activa" && (
                            <span>⏳ En curso</span>
                        )}

                        {item.estado === "acreditada" && (
                            <span>✅ Acreditada</span>
                        )}

                        {item.estado === "cancelada" && (
                            <span>❌ Cancelada</span>
                        )}

                    </div>


                    {item.created_at && (

                        <p>

                            <strong>Fecha inscripción:</strong>{" "}
                            {item.created_at}

                        </p>

                    )}


                    {item.fecha_acreditacion && (

                        <p>

                            <strong>Fecha acreditación:</strong>{" "}
                            {item.fecha_acreditacion}

                        </p>

                    )}

                </div>

            ))

        )}

    </div>

);

};

export default HistorialAlumno;