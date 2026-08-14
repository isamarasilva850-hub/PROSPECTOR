// GET /api/state -> catalogo (carrosseis + stories) + agenda fixa + contas.
// Sem banco de dados (nao usa mais Vercel Blob).
import { lerCatalogo, lerStories } from "../lib/comum.js";
import { CONTAS } from "../lib/graph.js";
import agenda from "../schedule-data.js";

export default async function handler(req, res) {
  try {
    const carrosseis = lerCatalogo();
    const stories = lerStories();
    const nome = (a) => {
      const lista = a.tipo === "story" ? stories : carrosseis;
      return (lista.find((x) => x.id === a.carrosselId) || {}).titulo || a.carrosselId;
    };
    const agora = new Date();
    const agendamentos = agenda
      .map((a) => ({
        ...a,
        titulo: nome(a),
        contaNome: (CONTAS[a.conta] || {}).nome || a.conta,
        // sem estado persistido: passado = provavelmente publicado, futuro = pendente
        status: new Date(a.quando) <= agora ? "publicado" : "pendente",
      }))
      .sort((a, b) => new Date(a.quando) - new Date(b.quando));

    res.status(200).json({
      carrosseis,
      stories,
      agendamentos,
      contas: Object.entries(CONTAS).map(([key, c]) => ({ key, nome: c.nome })),
      protegido: !!process.env.APP_SENHA,
    });
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
}
