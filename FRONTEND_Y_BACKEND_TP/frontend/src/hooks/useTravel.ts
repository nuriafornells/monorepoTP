import { useContext } from "react";
import { TravelContext } from "../context/TravelContext";

export const useTravel = () => {
  const context = useContext(TravelContext);
  if (!context) throw new Error("useTravel must be used within TravelProvider");
  return context;
};
// Hook personalizado para acceder al contexto de viaje
// Proporciona acceso a paquetes turísticos y reservas realizadas por el usuario
//permite a los componentes funcionales de React consumir el contexto TravelContext
//ANTES LO TENIA DUPLICADO al travel. YA BORRE EL OTRO ARCHIVO
//tmb tenia uno para reservas aparte, pero lo unifique todo en este useTravel