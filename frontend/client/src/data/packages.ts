// src/data/packages.ts
import type { Package } from "../types";

export const PACKAGES: Package[] = [
  {
    id: 1,
    title: "Aventura en Bariloche",
    slug: "aventura-en-bariloche",
    destination: "Bariloche, Argentina",
    description: "Paquete con excursiones al Cerro Catedral, Circuito Chico y navegación por el Nahuel Huapi.",
    priceUSD: 850,
    days: 5,
    nights: 4,
    published: true,
    imageUrl: "https://images.unsplash.com/photo-1558984853-d0490ee9f576?q=80&w=1200"
  },
  {
    id: 2,
    title: "Sol en Río de Janeiro",
    slug: "sol-en-rio-de-janeiro",
    destination: "Río de Janeiro, Brasil",
    description: "Playas de Copacabana e Ipanema, city tour y Pan de Azúcar. Ideal para descansar.",
    priceUSD: 1200,
    days: 7,
    nights: 6,
    published: true,
    imageUrl: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?q=80&w=1200"
  },
  {
    id: 3,
    title: "Norte Argentino Cultural",
    slug: "norte-argentino-cultural",
    destination: "Salta y Jujuy, Argentina",
    description: "Cafayate, Humahuaca y Salinas Grandes. Gastronomía regional y paisajes únicos.",
    priceUSD: 980,
    days: 6,
    nights: 5,
    published: false,
    imageUrl: "https://images.unsplash.com/photo-1590333748338-14b0a5e69062?q=80&w=1200"
  }
];