// POST /api/agendar — DESATIVADO.
// A agenda agora e um arquivo fixo (schedule-data.js), sem banco de dados,
// para nunca mais estourar limite/suspender. Para agendar, peca ao assistente.
export default async function handler(req, res) {
  res.status(200).json({
    ok: false,
    erro: "Agendamento pelo site está pausado. Peça ao seu assistente para agendar — a agenda agora é fixa e à prova de falhas. Você continua podendo PUBLICAR AGORA normalmente.",
  });
}
