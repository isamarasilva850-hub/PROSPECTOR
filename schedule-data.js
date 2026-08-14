// schedule-data.js — Agenda FIXA (sem banco de dados).
// Carrossel: confere no Instagram (idempotente, nunca duplica). Story: janela do cron.
// Editar aqui + redeploy para (re)agendar. quando = ISO com fuso (-03:00 = BRT).
// Regra: 1 item por janela de cron (meio-dia 12h / noite 20h). BN à noite, ebook ao meio-dia.
export default [
  // ---- NOITE (20h) = Beleza Nativa (foco lojistas/revendedoras) ----
  { quando: "2026-08-07T20:00:00-03:00", conta: "beleza",      tipo: "carrossel", carrosselId: "7-3-mitos-da-revenda" },
  { quando: "2026-08-08T20:00:00-03:00", conta: "beleza",      tipo: "carrossel", carrosselId: "18-dia-dos-pais" },
  { quando: "2026-08-09T20:00:00-03:00", conta: "beleza",      tipo: "carrossel", carrosselId: "8-por-que-a-revendedora-desiste" },
  { quando: "2026-08-10T20:00:00-03:00", conta: "beleza",      tipo: "carrossel", carrosselId: "9-por-que-comecar-agora" },
  { quando: "2026-08-11T20:00:00-03:00", conta: "beleza",      tipo: "carrossel", carrosselId: "10-pecas-que-vendem" },
  { quando: "2026-08-12T20:00:00-03:00", conta: "beleza",      tipo: "carrossel", carrosselId: "16-toda-mulher-usa" },
  { quando: "2026-08-13T20:00:00-03:00", conta: "beleza",      tipo: "carrossel", carrosselId: "11-lojista-moda-intima" },
  { quando: "2026-08-14T20:00:00-03:00", conta: "beleza",      tipo: "carrossel", carrosselId: "17-comece-essa-semana" },
  { quando: "2026-08-15T20:00:00-03:00", conta: "beleza",      tipo: "carrossel", carrosselId: "12-novidades" },
  { quando: "2026-08-16T20:00:00-03:00", conta: "beleza",      tipo: "carrossel", carrosselId: "13-lojista-concorrente" },
  { quando: "2026-08-17T20:00:00-03:00", conta: "beleza",      tipo: "carrossel", carrosselId: "14-lojista-5-motivos" },
  { quando: "2026-08-18T20:00:00-03:00", conta: "beleza",      tipo: "carrossel", carrosselId: "15-lojista-estoque" },
  // ---- SEMANA QUE VEM (novos, criados 07/08) ----
  { quando: "2026-08-19T20:00:00-03:00", conta: "beleza",      tipo: "carrossel", carrosselId: "19-consignado-x-revenda" },
  { quando: "2026-08-20T20:00:00-03:00", conta: "beleza",      tipo: "carrossel", carrosselId: "20-quanto-deixa-de-ganhar" },
  { quando: "2026-08-21T20:00:00-03:00", conta: "beleza",      tipo: "carrossel", carrosselId: "24-primeira-venda" },
  { quando: "2026-08-22T20:00:00-03:00", conta: "beleza",      tipo: "carrossel", carrosselId: "21-nao-tenho-tempo" },
  { quando: "2026-08-23T20:00:00-03:00", conta: "beleza",      tipo: "carrossel", carrosselId: "22-nao-sei-vender" },
  { quando: "2026-08-24T20:00:00-03:00", conta: "beleza",      tipo: "carrossel", carrosselId: "25-nasceu-pra-revender" },
  { quando: "2026-08-25T20:00:00-03:00", conta: "beleza",      tipo: "carrossel", carrosselId: "23-lojista-estoque-parado" },

  // ---- MEIO-DIA (12h) = Ebook Sobrancelha (@isamaracsilva) ----
  { quando: "2026-08-08T12:00:00-03:00", conta: "sobrancelha", tipo: "carrossel", carrosselId: "ebook-3-sobrancelha-rala" },
  { quando: "2026-08-09T12:00:00-03:00", conta: "sobrancelha", tipo: "carrossel", carrosselId: "ebook-4-sobrancelha-40" },
  { quando: "2026-08-10T12:00:00-03:00", conta: "sobrancelha", tipo: "carrossel", carrosselId: "ebook-5-a-oferta" },
];
