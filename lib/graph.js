// graph.js — Conexao com a Graph API da Meta (Instagram). Token via env var.
const API_VERSION = "v21.0";
const BASE = `https://graph.facebook.com/${API_VERSION}`;

export function getToken() {
  const t = process.env.META_ACCESS_TOKEN?.trim();
  if (!t) throw new Error("META_ACCESS_TOKEN nao configurado nas variaveis de ambiente da Vercel.");
  return t;
}

export async function graphPost(path, body = {}, token = getToken()) {
  const res = await fetch(`${BASE}/${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(`Graph API (${path}): ${data.error?.message || res.statusText}`);
  }
  return data;
}

export async function graphGet(path, params = {}, token = getToken()) {
  const url = new URL(`${BASE}/${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(`Graph API GET (${path}): ${data.error?.message || res.statusText}`);
  }
  return data;
}

// Espera um container de midia ficar pronto (status_code = FINISHED) antes de publicar.
async function esperarPronto(creationId, { tentativas = 16, intervaloMs = 2000 } = {}) {
  for (let i = 0; i < tentativas; i++) {
    const r = await graphGet(creationId, { fields: "status_code" });
    if (r.status_code === "FINISHED") return true;
    if (r.status_code === "ERROR") throw new Error("O Instagram rejeitou o processamento de uma imagem.");
    await new Promise((s) => setTimeout(s, intervaloMs));
  }
  throw new Error("O Instagram demorou demais para processar as imagens. Tente publicar de novo.");
}

// Contas disponiveis -> variavel de ambiente com o ID do Instagram.
export const CONTAS = {
  beleza: { nome: "@belezanativaoficial", idEnv: "IG_BELEZA_NATIVA" },
  sobrancelha: { nome: "@isamaracsilva", idEnv: "IG_SOBRANCELHA_PERFEITA" },
};

export function idDaConta(contaKey) {
  const c = CONTAS[contaKey];
  if (!c) throw new Error(`Conta desconhecida: ${contaKey}`);
  const id = process.env[c.idEnv];
  if (!id) throw new Error(`ID do Instagram nao configurado (${c.idEnv}).`);
  return id;
}

// Publica um carrossel (2 a 10 imagens ja em URL publica https).
export async function publicarCarrossel(igUserId, imagens, legenda) {
  if (imagens.length < 2 || imagens.length > 10)
    throw new Error("Um carrossel precisa de 2 a 10 imagens.");

  const filhos = [];
  for (const url of imagens) {
    const r = await graphPost(`${igUserId}/media`, { image_url: url, is_carousel_item: true });
    filhos.push(r.id);
  }
  const carrossel = await graphPost(`${igUserId}/media`, {
    media_type: "CAROUSEL",
    children: filhos.join(","),
    caption: legenda,
  });
  // Espera o carrossel terminar de processar antes de publicar.
  await esperarPronto(carrossel.id);
  const post = await graphPost(`${igUserId}/media_publish`, { creation_id: carrossel.id });
  return post.id;
}

// Publica uma sequencia de Stories (cada imagem = 1 story, postados em ordem).
export async function publicarStory(igUserId, imagens) {
  if (!imagens.length) throw new Error("Nenhuma imagem para o Story.");
  const ids = [];
  for (const url of imagens) {
    const c = await graphPost(`${igUserId}/media`, { media_type: "STORIES", image_url: url });
    await esperarPronto(c.id);
    const post = await graphPost(`${igUserId}/media_publish`, { creation_id: c.id });
    ids.push(post.id);
  }
  return ids;
}
