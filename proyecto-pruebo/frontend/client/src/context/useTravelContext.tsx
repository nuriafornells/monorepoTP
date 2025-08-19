import { useContext } from "react";
import { TravelContext } from "./TravelContext";

export const useTravelContext = () => {
  const context = useContext(TravelContext);
  if (!context) {
    throw new Error("useTravelContext debe usarse dentro de <TravelProvider>");
  }
  return context;
};