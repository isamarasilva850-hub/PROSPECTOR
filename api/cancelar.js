// POST /api/cancelar — DESATIVADO (agenda agora e fixa em schedule-data.js).
export default async function handler(req, res) {
  res.status(200).json({
    ok: false,
    erro: "Para cancelar/alterar um agendamento, peça ao seu assistente (a agenda agora é fixa).",
  });
}
