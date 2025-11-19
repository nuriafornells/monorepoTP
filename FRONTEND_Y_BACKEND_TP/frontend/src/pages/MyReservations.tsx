// src/pages/MyReservations.tsx
import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../hooks/useAuth";
import React from "react";
// Página para que los usuarios vean sus reservas
// Carga las reservas del usuario desde el backend al montar el componente
// Muestra una tabla con las reservas y sus estados correspondientes 

type Reservation = {
  id: number;
  fechaInicio: string | null;
  fechaFin: string | null;
  paquete: {
    nombre: string;
    destino: string | null;
  };
  status: "pendiente" | "aceptada" | "rechazada";
  instrucciones?: {
    mensaje: string;
    numeroReserva: number;
    paquete: string
    mensaje2: string;
    contactoWhatsapp: string;
    numeroWhatsapp: string;
    email: string;
    metodo: string;
    plazo: string;
  } | null;
};

function formatDate(dateString?: string | null) {
  if (!dateString) return "-";
  const d = new Date(dateString);
  return d.toLocaleDateString("es-AR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default function MyReservations() {
  const { user } = useAuth();
  const [reservas, setReservas] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReservas() {
      try {
        const res = await api.get<{ reservas: Reservation[] }>(
          `/reservations/user/${user?.id}`
        );
        setReservas(res.data.reservas);
      } catch {
        alert("No se pudieron cargar tus reservas.");
      } finally {
        setLoading(false);
      }
    }

    if (user?.id) fetchReservas();
  }, [user]);

  if (loading) return <p>Cargando tus reservas…</p>;

  return (
    <div className="page-container">
      <div className="card">
        <h2>Mis reservas</h2>
        {reservas.length === 0 ? (
          <p>No tenés reservas registradas.</p>
        ) : (
          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Paquete</th>
                  <th>Destino</th>
                  <th>Inicio</th>
                  <th>Fin</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((r) => (
                  <React.Fragment key={`reserva-block-${r.id}`}>
                    <tr key={`reserva-${r.id}`}>
                      <td>{r.paquete.nombre}</td>
                      <td>{r.paquete.destino ?? "-"}</td>
                      <td>{formatDate(r.fechaInicio)}</td>
                      <td>{formatDate(r.fechaFin)}</td>
                      <td>
                        {r.status === "pendiente" && "⏳ Pendiente"}
                        {r.status === "aceptada" && "✅ Aceptada"}
                        {r.status === "rechazada" && "❌ Rechazada"}
                      </td>
                    </tr>

                    {/* Instrucciones para reservas PENDIENTES - mostrar info de pago */}
                    {r.status === "pendiente" && (
                      <tr key={`instrucciones-pendiente-${r.id}`}>
                        <td colSpan={5}>
                          <div className="alert warning" style={{ marginTop: 8, backgroundColor: '#fff3cd', borderColor: '#ffeaa7', color: '#856404', padding: '12px', borderRadius: '4px' }}>
                            {r.instrucciones ? (
                              <>
                                <h4>{r.instrucciones.mensaje}</h4>
                                <p>{r.instrucciones.mensaje2}</p>
                                <p><strong>WhatsApp:</strong> <a href={r.instrucciones.contactoWhatsapp} target="_blank" rel="noopener noreferrer">{r.instrucciones.numeroWhatsapp}</a></p>
                                <p><strong>Método de pago:</strong> {r.instrucciones.metodo}</p>
                                <p><strong>Plazo:</strong> {r.instrucciones.plazo}</p>
                              </>
                            ) : (
                              <>
                                <h4>Pago Pendiente</h4>
                                <p>Comunicarse al WhatsApp indicando su nombre y número de reserva para concretar el pago.</p>
                                <p><strong>WhatsApp:</strong> <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">+54 9 11 1234-5678</a></p>
                                <p><strong>Método de pago:</strong> Transferencia bancaria o tarjeta de crédito (consultar promociones vigentes)</p>
                                <p><strong>Plazo:</strong> 48 horas para confirmar el pago</p>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}                    {/* Instrucciones para reservas ACEPTADAS - solo info básica */}
                    {r.status === "aceptada" && r.instrucciones && (
                      <tr key={`instrucciones-aceptada-${r.id}`}>
                        <td colSpan={5}>
                          <div className="alert success" style={{ marginTop: 8 }}>
                            <p><strong>Número de reserva:</strong> #{r.instrucciones.numeroReserva}</p>
                            <p><strong>Paquete:</strong> {r.instrucciones.paquete}</p>
                            <p><strong>WhatsApp:</strong> <a href={r.instrucciones.contactoWhatsapp} target="_blank" rel="noopener noreferrer">{r.instrucciones.numeroWhatsapp}</a></p>
                            <p><strong>Email:</strong> {r.instrucciones.email}</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}