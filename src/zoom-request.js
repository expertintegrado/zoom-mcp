import { readFileSync, writeFileSync, existsSync } from "fs";
import { CLIENT_ID, CLIENT_SECRET, BASE_URL, TOKENS_PATH, ONBOARDING_MSG } from "./config.js";

let cachedTokens = null;

const RETRYABLE_STATUSES = [408, 429, 500, 502, 503, 504];

export function isAuthorized() {
  return existsSync(TOKENS_PATH);
}

export function loadTokens() {
  if (!existsSync(TOKENS_PATH)) {
    throw new Error(ONBOARDING_MSG);
  }
  const data = JSON.parse(readFileSync(TOKENS_PATH, "utf-8"));
  cachedTokens = data;
  return data;
}

export function saveTokens(tokens) {
  cachedTokens = tokens;
  writeFileSync(TOKENS_PATH, JSON.stringify(tokens, null, 2));
}

function isTokenExpired(tokens) {
  if (!tokens?.created_at || !tokens?.expires_in) return true;
  return Date.now() > tokens.created_at + tokens.expires_in * 1000 - 60_000;
}

async function refreshAccessToken(tokens) {
  const response = await fetch("https://zoom.us/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: tokens.refresh_token,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(
      `Falha ao renovar token (HTTP ${response.status}): ${errText}\n` +
      "Execute `npm run auth` novamente para reautorizar."
    );
  }

  const data = await response.json();
  const newTokens = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    token_type: data.token_type,
    expires_in: data.expires_in,
    scope: data.scope,
    created_at: Date.now(),
  };
  saveTokens(newTokens);
  return newTokens;
}

export async function getAccessToken() {
  let tokens = cachedTokens || loadTokens();
  if (isTokenExpired(tokens)) {
    tokens = await refreshAccessToken(tokens);
  }
  return tokens.access_token;
}

function friendlyError(status) {
  const messages = {
    400: "Requisição inválida. Verifique os parâmetros.",
    401: "Token expirado ou inválido. Execute `npm run auth` novamente.",
    403: "Sem permissão. Verifique os escopos do app no Zoom Marketplace.",
    404: "Recurso não encontrado no Zoom.",
    429: "Limite de requisições do Zoom atingido. Tente novamente em alguns segundos.",
    500: "Erro interno do servidor Zoom.",
    502: "Zoom temporariamente indisponível.",
    503: "Zoom em manutenção.",
  };
  return messages[status] || `Erro ${status} na API do Zoom.`;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function zoomRequest(method, path, { query = {}, body = null, retries = 3 } = {}) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const accessToken = await getAccessToken();

    const url = new URL(`${BASE_URL}${path}`);
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }

    const options = {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    };

    if (body && method !== "GET" && method !== "DELETE") {
      options.body = JSON.stringify(body);
    }

    let response;
    try {
      response = await fetch(url.toString(), options);
    } catch (err) {
      if (attempt < retries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 8000);
        console.error(`[Zoom] Erro de rede (tentativa ${attempt}/${retries}): ${err.message}. Retry em ${delay}ms...`);
        await sleep(delay);
        continue;
      }
      throw new Error(`Erro de conexão com Zoom após ${retries} tentativas: ${err.message}`);
    }

    if (response.status === 401 && attempt === 1) {
      try {
        const tokens = cachedTokens || loadTokens();
        await refreshAccessToken(tokens);
        continue;
      } catch {
        throw new Error(friendlyError(401));
      }
    }

    if (!response.ok && RETRYABLE_STATUSES.includes(response.status) && attempt < retries) {
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 8000);
      console.error(`[Zoom] HTTP ${response.status} (tentativa ${attempt}/${retries}). Retry em ${delay}ms...`);
      await sleep(delay);
      continue;
    }

    if (!response.ok) {
      let errDetail = "";
      try {
        const errJson = await response.json();
        errDetail = errJson.message || errJson.error || JSON.stringify(errJson);
      } catch {
        errDetail = await response.text().catch(() => "");
      }
      throw new Error(`${friendlyError(response.status)} ${errDetail}`.trim());
    }

    if (response.status === 204) return {};

    return await response.json();
  }
}

export async function zoomRequestAllPages(path, { query = {}, resultKey = null, maxPages = 10 } = {}) {
  const allItems = [];
  let pageToken = "";
  let pages = 0;

  do {
    const q = { ...query, page_size: 50 };
    if (pageToken) q.next_page_token = pageToken;

    const data = await zoomRequest("GET", path, { query: q });

    const key = resultKey || Object.keys(data).find(
      (k) => Array.isArray(data[k]) && k !== "page_size"
    );
    if (key && data[key]) allItems.push(...data[key]);

    pageToken = data.next_page_token || "";
    pages++;
  } while (pageToken && pages < maxPages);

  return allItems;
}

export function toZoomDate(d) {
  return new Date(d).toISOString().replace(/\.\d{3}Z$/, "Z");
}
