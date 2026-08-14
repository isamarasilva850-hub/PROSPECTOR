// comum.js — Utilidades compartilhadas: senha, catalogos e publicar por id.
import catalogo from "../carrosseis-data.js";
import stories from "../stories-data.js";
import { publicarCarrossel, publicarStory, idDaConta, CONTAS, graphGet } from "./graph.js";

export function checarSenha(req) {
  const esperada = process.env.APP_SENHA;
  if (!esperada) return true;
  const enviada = req.headers["x-senha"] || "";
  return enviada === esperada;
}

export function lerCatalogo() {
  return catalogo;
}

export function lerStories() {
  return stories;
}

export function acharCarrossel(id) {
  return lerCatalogo().find((c) => c.id === id) || null;
}

export function acharStory(id) {
  return lerStories().find((s) => s.id === id) || null;
}

// Acha um item (carrossel ou story) e informa o tipo.
export function acharItem(id, tipo) {
  if (tipo === "story") return acharStory(id);
  return acharCarrossel(id);
}

// Publica um carrossel OU uma sequencia de Stories, conforme o tipo.
export async function publicarPorId({ carrosselId, contaKey, tipo = "carrossel" }) {
  if (!CONTAS[contaKey]) throw new Error("Conta invalida.");
  const igUserId = idDaConta(contaKey);

  if (tipo === "story") {
    const s = acharStory(carrosselId);
    if (!s) throw new Error(`Story nao encontrado: ${carrosselId}`);
    const ids = await publicarStory(igUserId, s.frames);
    return { postId: ids.join(","), conta: CONTAS[contaKey].nome, titulo: s.titulo };
  }

  const c = acharCarrossel(carrosselId);
  if (!c) throw new Error(`Carrossel nao encontrado: ${carrosselId}`);
  const postId = await publicarCarrossel(igUserId, c.slides, c.legenda || "");
  return { postId, conta: CONTAS[contaKey].nome, titulo: c.titulo };
}

// Idempotencia: verifica se o item ja esta publicado no Instagram (compara o
// inicio da legenda com os posts recentes da conta). Evita duplicar e recupera
// agendamentos que postaram mas perderam o registro de status.
// Retorna o postId se ja estiver la, senao null. (Stories nao tem legenda no
// feed, entao nao da pra checar -> retorna null.)
export async function jaPublicado(item) {
  if (item.tipo === "story") return null;
  const c = acharCarrossel(item.carrosselId);
  if (!c || !c.legenda) return null;
  const chave = c.legenda.replace(/\s+/g, " ").trim().slice(0, 40);
  if (!chave) return null;
  const igUserId = idDaConta(item.conta);
  const r = await graphGet(`${igUserId}/media`, { fields: "id,caption", limit: "10" });
  const achado = (r.data || []).find(
    (p) => (p.caption || "").replace(/\s+/g, " ").trim().slice(0, 40) === chave
  );
  return achado ? achado.id : null;
}
