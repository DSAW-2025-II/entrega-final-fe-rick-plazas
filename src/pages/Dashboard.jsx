import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

const Dashboard = () => {
  const navigate = useNavigate();
  const [viajes, setViajes] = useState([]);
  const [nuevoViaje, setNuevoViaje] = useState({
    puntoInicio: "",
    puntoFinal: "",
    ruta: "",
    horaSalida: "",
    cuposDisponibles: "",
    tarifa: "",
    estado: "DISPONIBLE",
  });

  const token = localStorage.getItem("token");

  // Si no hay token, redirige al login
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      cargarViajes();
    }
  }, []);

  // 🔹 Cargar lista de viajes
  const cargarViajes = async () => {
    try {
      const res = await API.get("/viajes");
      setViajes(res.data);
    } catch (err) {
      console.error("Error cargando viajes", err);
    }
  };

  // Obtener idConductor desde el token
const getIdConductor = () => {
  if (!token) return null;
  try {
    const decoded = jwt_decode(token); // decodifica el JWT
    return decoded.id; //  asegurarse que el backend incluya el campo 'id' en el token
  } catch (err) {
    console.error("Error decodificando token", err);
    return null;
  }
};

  // 🔹 Crear nuevo viaje
  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const idConductor = getIdConductor(); // ✅ ahora dinámico
    if (!idConductor) throw new Error("No se pudo obtener el ID del usuario");

    await API.post(`/api/viajes/${idConductor}`, nuevoViaje);

    alert("Viaje creado con éxito");
    cargarViajes();
    setNuevoViaje({
      puntoInicio: "",
      puntoFinal: "",
      ruta: "",
      horaSalida: "",
      cuposDisponibles: "",
      tarifa: "",
      estado: "DISPONIBLE",
    });
  } catch (err) {
    alert("Error creando el viaje");
    console.error(err);
  }
};


  const handleChange = (e) => {
    setNuevoViaje({ ...nuevoViaje, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Wheels 🚗</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-3 py-1 rounded-lg hover:bg-red-600"
        >
          Cerrar sesión
        </button>
      </header>

      <div className="p-6 grid md:grid-cols-2 gap-6">
        {/* Lista de viajes */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Viajes disponibles</h2>
          {viajes.length === 0 ? (
            <p>No hay viajes aún</p>
          ) : (
            <ul className="space-y-3">
              {viajes.map((v) => (
                <li
                  key={v.id}
                  className="bg-white p-4 rounded-xl shadow flex flex-col"
                >
                  <span className="font-semibold text-blue-700">
                    {v.puntoInicio} → {v.puntoFinal}
                  </span>
                  <span className="text-gray-700">{v.ruta}</span>
                  <span className="text-gray-600">
                    🕓 {new Date(v.horaSalida).toLocaleString()}
                  </span>
                  <span className="text-gray-700">
                    💺 Cupos: {v.cuposDisponibles}
                  </span>
                  <span className="text-green-700 font-bold">
                    💰 ${v.tarifa}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Formulario para crear viaje */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Crear nuevo viaje</h2>
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow space-y-3"
          >
            {[
              "puntoInicio",
              "puntoFinal",
              "ruta",
              "horaSalida",
              "cuposDisponibles",
              "tarifa",
            ].map((field) => (
              <div key={field}>
                <label className="block text-gray-700 mb-1 capitalize">
                  {field}
                </label>
                <input
                  type={
                    field === "horaSalida"
                      ? "datetime-local"
                      : field === "tarifa" || field === "cuposDisponibles"
                      ? "number"
                      : "text"
                  }
                  name={field}
                  value={nuevoViaje[field]}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
            ))}
            <button
              type="submit"
              className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700"
            >
              Crear viaje
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
