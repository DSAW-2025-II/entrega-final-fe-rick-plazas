import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [viajes, setViajes] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.log("No token found");
            return;
        }

        try {
            const decoded = jwtDecode(token);
            console.log("Decoded token:", decoded);
            setUser(decoded);

            fetchUserViajes(decoded.id);
        } catch (err) {
            console.error("Error decoding token", err);
        }
    }, []);

    const fetchUserViajes = async (userId) => {
        try {
            const response = await fetch(`https://wheels-back-production.up.railway.app/api/viajes/usuario/${userId}`);
            const data = await response.json();
            setViajes(data);
        } catch (error) {
            console.error("Error fetching viajes:", error);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Dashboard</h2>

            {user ? (
                <div>
                    <p><strong>ID:</strong> {user.id}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                </div>
            ) : (
                <p>Cargando usuario...</p>
            )}

            <h3>Mis viajes</h3>
            <ul>
                {viajes.map(v => (
                    <li key={v.id}>{v.destino} — {v.fecha}</li>
                ))}
            </ul>
        </div>
    );
}
