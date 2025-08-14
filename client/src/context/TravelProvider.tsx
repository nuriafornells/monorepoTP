import React, { useState, useEffect } from "react";
import { TravelContext } from "./TravelContext";
import type { TravelDataType, Package, Reservation } from "./TravelContext";

const TravelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [travelData, setTravelData] = useState<TravelDataType[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const mockData: TravelDataType[] = [
      { id: 1, destination: "Bariloche", price: 850 },
      { id: 2, destination: "Río de Janeiro", price: 1200 },
    ];
    setTravelData(mockData);

    const mockPackages: Package[] = [
      {
        id: 1,
        title: "Aventura en Bariloche",
        description: "Paquete de 5 días con excursiones",
        priceUSD: 950,
        imageUrl: "/images/bariloche.jpg",
        published: true,
      },
    ];
    setPackages(mockPackages);

    const mockReservations: Reservation[] = [
      {
        id: 1,
        packageId: 1,
        name: "Nuri",
        email: "nuri@example.com",
        date: "2025-08-20",
      },
    ];
    setReservations(mockReservations);
  }, []);

  return (
    <TravelContext.Provider
      value={{
        travelData,
        setTravelData,
        packages,
        setPackages,
        reservations,
        setReservations,
      }}
    >
      {children}
    </TravelContext.Provider>
  );
};

export default TravelProvider;