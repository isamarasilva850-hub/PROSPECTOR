// store.js — Guarda os agendamentos no Vercel Blob.
// Cada agendamento e um arquivo separado (agenda/<id>.json). Assim, criar/
// editar/remover um NUNCA sobrescreve outro (sem corrida de escrita).

import { put, list, del } from "@vercel/blob";
import { randomUUID } from "crypto";

const PREFIX = "agenda/";

export async function lerAgenda() {
  try {
    const { blobs } = await list({ prefix: PREFIX });
    const itens = await Promise.all(
      blobs.map(async (b) => {
        try {
          const r = await fetch(b.url + "?t=" + Date.now(), { cache: "no-store" });
          return r.ok ? await r.json() : null;
        } catch {
          return null;
        }
      })
    );
    return itens.filter(Boolean);
  } catch {
    return [];
  }
}

async function salvarItem(item) {
  await put(PREFIX + item.id + ".json", JSON.stringify(item), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });
}

export async function criarAgendamento({ carrosselId, titulo, conta, contaNome, quando, tipo = "carrossel" }) {
  const item = {
    id: randomUUID(),
    carrosselId, titulo, conta, contaNome, quando, tipo,
    status: "pendente", igPostId: null, erro: null,
    criadoEm: new Date().toISOString(),
  };
  await salvarItem(item);
  return item;
}

export async function atualizarAgendamento(id, campos) {
  const atual = (await lerAgenda()).find((a) => a.id === id);
  if (!atual) return null;
  const novo = { ...atual, ...campos };
  await salvarItem(novo);
  return novo;
}

export async function removerAgendamento(id) {
  try {
    const { blobs } = await list({ prefix: PREFIX + id });
    for (const b of blobs) await del(b.url);
  } catch {
    /* ignora */
  }
}
