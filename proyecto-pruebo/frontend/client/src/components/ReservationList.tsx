// src/components/ReservationList.tsx
import { useTravel } from "../hooks/useTravel";

const ReservationList = () => {
  const { reservations, packages } = useTravel();

  const getPackageTitle = (id: number) =>
    packages.find(pkg => pkg.id === id)?.nombre || "Paquete desconocido";

  return (
    <div>
      <h2>Reservas hechas</h2>
      {reservations.map(res => (
        <div key={res.id}>
          <p><strong>{res.name}</strong> ({res.email})</p>
          <p>Fecha: {res.date}</p>
          <p>Paquete: {getPackageTitle(res.packageId)}</p>
        </div>
      ))}
    </div>
  );
};

export default ReservationList;