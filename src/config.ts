// Central site configuration — single place to edit business details.

export const SITE = {
  name: 'Fab Flights',
  url: 'https://fab.flights',
  // Registered name + number exactly as on the Companies House register (verified 2026-06-12).
  company: 'Travel Fab Limited',
  companyNumber: '08910640',
  foundedYear: 2014,
  tagline: 'Vuelos a Latinoamérica desde Londres, con atención en español',
  description:
    'Te ayudamos a encontrar y reservar tu vuelo a Ecuador, Colombia, Brasil, Panamá o Perú desde el Reino Unido. Atención personal en español por WhatsApp.',
  // WhatsApp Business number — international format, digits only (no "+", no spaces).
  whatsappNumber: '442071481727',
} as const;

/** Build a click-to-chat link with a pre-filled message (also our per-page lead attribution). */
export function waLink(text: string): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export const DEFAULT_WA_TEXT = 'Hola, quiero información sobre vuelos a Latinoamérica';
