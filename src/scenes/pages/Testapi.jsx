import { useEffect, useState } from "react";
import { getAlumnos } from "../../api/api";

const TestApi = () => {

  const [alumnos, setAlumnos] = useState([]);

  useEffect(() => {
    getAlumnos().then(data => {
      setAlumnos(data);
    });
  }, []);

  return (
    <div>
      <h2>Alumnos</h2>

      {alumnos.map((a) => (
        <div key={a.id}>
          {a.nombre} - {a.generacion}
        </div>
      ))}

    </div>
  );
};

export default TestApi;