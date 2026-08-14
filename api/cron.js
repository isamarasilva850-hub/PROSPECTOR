// GET /api/cron?key=SEGREDO
// Motor SEM BANCO DE DADOS. Le a agenda fixa (schedule-data.js).
//  - Carrossel: confere no Instagram se ja postou (idempotente). Posta o proximo
//    vencido que ainda NAO esta la. Nunca duplica; recupera dias perdidos.
//  - Story: nao da pra conferir no feed, entao posta so se caiu na "janela" deste
//    cron (entre a execucao anterior e agora) — assim nunca republica.
// Publica UM item por execucao (rapido, dentro do limite de 60s).

import { publicarPorId, jaPublicado } from "../lib/comum.js";
import agenda from "../schedule-data.js";

export const config = { maxDuration: 60 };

// Horarios nominais dos crons em UTC (12h05 e 20h05 BRT = 15:05 e 23:05 UTC).
const CRON_UTC = [[15, 5], [23, 5]];

function horariosCron(now) {
  const out = [];
  for (let d = 0; d >= -2; d--) {
    for (const [h, m] of CRON_UTC) {
      out.push(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + d, h, m)));
    }
  }
  return out.sort((a, b) => b - a); // desc
}

// Inicio da janela = a execucao de cron IMEDIATAMENTE anterior a esta.
function inicioJanela(now) {
  const ts = horariosCron(now);
  const tNow = ts.find((t) => t <= now) || ts[ts.length - 1];
  return ts.find((t) => t < tNow) || null;
}

export default async function handler(req, res) {
  const key = req.query.key || "";
  if (process.env.CRON_KEY && key !== process.env.CRON_KEY) {
    return res.status(401).json({ ok: false, erro: "Chave invalida." });
  }

  try {
    const now = new Date();
    const jaInicio = inicioJanela(now);

    const vencidos = agenda
      .filter((a) => new Date(a.quando) <= now)
      .sort((a, b) => new Date(a.quando) - new Date(b.quando));

    for (const item of vencidos) {
      if (item.tipo === "story") {
        // So posta se virou "vencido" nesta janela (evita republicar sem estado).
        if (!(jaInicio && new Date(item.quando) > jaInicio)) continue;
        try {
          const r = await publicarPorId({ carrosselId: item.carrosselId, contaKey: item.conta, tipo: "story" });
          return res.status(200).json({ ok: true, publicados: 1, tipo: "story", item: item.carrosselId, postId: r.postId });
        } catch (e) {
          return res.status(200).json({ ok: false, tipo: "story", item: item.carrosselId, erro: e.message });
        }
      } else {
        // Carrossel: se ja esta no Instagram, pula para o proximo.
        let existente = null;
        try {
          existente = await jaPublicado({ carrosselId: item.carrosselId, conta: item.conta, tipo: "carrossel" });
        } catch { /* se falhar a checagem, tenta publicar */ }
        if (existente) continue;
        try {
          const r = await publicarPorId({ carrosselId: item.carrosselId, contaKey: item.conta, tipo: "carrossel" });
          return res.status(200).json({ ok: true, publicados: 1, tipo: "carrossel", item: item.carrosselId, postId: r.postId });
        } catch (e) {
          return res.status(200).json({ ok: false, tipo: "carrossel", item: item.carrosselId, erro: e.message });
        }
      }
    }

    return res.status(200).json({ ok: true, publicados: 0, msg: "Nada a publicar." });
  } catch (e) {
    return res.status(500).json({ ok: false, erro: e.message });
  }
}
