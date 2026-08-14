// POST /api/publicar { carrosselId, conta } -> publica agora no Instagram.
import { publicarPorId, checarSenha } from "../lib/comum.js";

export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, erro: "Metodo invalido" });
  if (!checarSenha(req)) return res.status(401).json({ ok: false, erro: "Senha incorreta." });
  try {
    const { carrosselId, conta, tipo } = req.body || {};
    const r = await publicarPorId({ carrosselId, contaKey: conta, tipo });
    res.status(200).json({ ok: true, ...r });
  } catch (e) {
    res.status(400).json({ ok: false, erro: e.message });
  }
}
