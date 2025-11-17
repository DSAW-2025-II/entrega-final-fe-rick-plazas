import React, { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ correo: "", contrasena: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      const token = res.data;
      if (token.startsWith("ey")) {
        localStorage.setItem("token", token);
        alert("Inicio de sesión exitoso");
        navigate("/dashboard");
      } else {
        alert("Credenciales incorrectas");
      }
    } catch (err) {
      alert("Error al iniciar sesión");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
          Iniciar Sesión
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Correo</label>
          <input
            type="email"
            name="correo"
            value={form.correo}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Contrasena</label>
          <input
            type="password"
            name="contrasena"
            value={form.contrasena}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Entrar
        </button>

        <p className="mt-4 text-center text-sm">
          ¿No tienes cuenta?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Regístrate
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
