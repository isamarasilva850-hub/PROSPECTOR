// schedule-data.js — Agenda FIXA (sem banco de dados).
// Carrossel: confere no Instagram (idempotente, nunca duplica). Story: janela do cron.
// Editar aqui + redeploy para (re)agendar. quando = ISO com fuso (-03:00 = BRT).
// Regra: 1 item por janela de cron (meio-dia 12h / noite 20h). BN à noite, ebook ao meio-dia.
export default [
  // ---- MEIO-DIA (12h) = Ebook Sobrancelha V2 (@isamaracsilva) ----
  { quando: "2026-08-15T12:00:00-03:00", conta: "sobrancelha", tipo: "carrossel", carrosselId: "ebook-sobrancelha-v2-2025" },
  { quando: "2026-08-16T12:00:00-03:00", conta: "sobrancelha", tipo: "carrossel", carrosselId: "ebook-sobrancelha-v2-2025" },
  { quando: "2026-08-17T12:00:00-03:00", conta: "sobrancelha", tipo: "carrossel", carrosselId: "ebook-sobrancelha-v2-2025" },
  { quando: "2026-08-18T12:00:00-03:00", conta: "sobrancelha", tipo: "carrossel", carrosselId: "ebook-sobrancelha-v2-2025" },
  { quando: "2026-08-19T12:00:00-03:00", conta: "sobrancelha", tipo: "carrossel", carrosselId: "ebook-sobrancelha-v2-2025" },
];
