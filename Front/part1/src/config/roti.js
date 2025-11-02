export const ROTI = {
  nombre: "Rotisería Don Sabor",
  telefonoWhatsApp: "5493564651874",
  direccion: "Av. Siempre Viva 742, San Francisco, Córdoba",
  horario: [
    { dias: "Lun a Vie", horas: "11:30–15:00 / 20:00–23:00" },
    { dias: "Sáb", horas: "11:30–15:30 / 20:00–23:30" },
    { dias: "Dom", horas: "11:30–15:30" },
  ],
  mapsEmbed:
    "https://www.google.com/maps?q=Av.+Siempre+Viva+742,+San+Francisco,+C%C3%B3rdoba&output=embed",
};
export const waBase = (phone = ROTI.telefonoWhatsApp) =>
  `https://wa.me/${phone}?text=`;
