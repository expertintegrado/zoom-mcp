#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CLIENT_ID, CLIENT_SECRET } from "./src/config.js";

// Canais
import { listChannels, listChannelsSchema } from "./src/tools/list-channels.js";
import { getChannel, getChannelSchema } from "./src/tools/get-channel.js";
import { createChannel, createChannelSchema } from "./src/tools/create-channel.js";
import { listChannelMembers, listChannelMembersSchema } from "./src/tools/list-channel-members.js";
import { inviteChannelMembers, inviteChannelMembersSchema } from "./src/tools/invite-channel-members.js";
import { searchChannels, searchChannelsSchema } from "./src/tools/search-channels.js";

// Mensagens
import { sendMessage, sendMessageSchema } from "./src/tools/send-message.js";
import { sendFile, sendFileSchema } from "./src/tools/send-file.js";
import { listMessages, listMessagesSchema } from "./src/tools/list-messages.js";
import { getMessage, getMessageSchema } from "./src/tools/get-message.js";
import { updateMessage, updateMessageSchema } from "./src/tools/update-message.js";
import { deleteMessage, deleteMessageSchema } from "./src/tools/delete-message.js";
import { reactMessage, reactMessageSchema } from "./src/tools/react-message.js";
import { listThread, listThreadSchema } from "./src/tools/list-thread.js";
import { downloadFile, downloadFileSchema } from "./src/tools/download-file.js";

// Contatos e sessões
import { listContacts, listContactsSchema } from "./src/tools/list-contacts.js";
import { searchCompanyContacts, searchCompanyContactsSchema } from "./src/tools/search-company-contacts.js";
import { listSessions, listSessionsSchema } from "./src/tools/list-sessions.js";

// Bookmarks, pinados e espaços
import { listBookmarks, listBookmarksSchema } from "./src/tools/list-bookmarks.js";
import { listPinnedMessages, listPinnedMessagesSchema } from "./src/tools/list-pinned-messages.js";
import { listSharedSpaces, listSharedSpacesSchema } from "./src/tools/list-shared-spaces.js";

// Status / onboarding
import { status, statusSchema } from "./src/tools/status.js";

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    "ERRO: Variáveis de ambiente obrigatórias não definidas.\n" +
    "Defina: ZOOM_CLIENT_ID e ZOOM_CLIENT_SECRET\n\n" +
    "Veja o README: https://github.com/expertintegrado/zoom-mcp#readme"
  );
  process.exit(1);
}

const server = new McpServer({ name: "zoom-mcp", version: "1.0.0" });

function tool(name, description, schema, handler) {
  server.tool(name, description, schema.shape ?? schema, async (params) => {
    try {
      const result = await handler(params);
      if (result && typeof result === "object" && result.type === "image") {
        return {
          content: [
            { type: "text", text: result.caption || "" },
            { type: "image", data: result.data, mimeType: result.mimeType },
          ],
        };
      }
      return { content: [{ type: "text", text: String(result) }] };
    } catch (err) {
      return { content: [{ type: "text", text: `Erro: ${err.message}` }], isError: true };
    }
  });
}

// ─── Status ─────────────────────────────────────────────────────────────────

tool("zoom_status",
  "Verifica a conexão com o Zoom Team Chat. Mostra se o usuário está autorizado e exibe os dados da conta. Execute aqui em caso de dúvida sobre a autenticação.",
  statusSchema, status);

// ─── Canais ──────────────────────────────────────────────────────────────────

tool("zoom_list_channels",
  "Lista todos os canais do Zoom Team Chat do usuário. Retorna ID, nome, tipo e número de membros de cada canal.",
  listChannelsSchema, listChannels);

tool("zoom_get_channel",
  "Retorna detalhes de um canal específico do Zoom Team Chat (nome, tipo, configurações, membros).",
  getChannelSchema, getChannel);

tool("zoom_create_channel",
  "Cria um novo canal no Zoom Team Chat. Pode criar canal público, privado ou DM.",
  createChannelSchema, createChannel);

tool("zoom_list_channel_members",
  "Lista os membros de um canal do Zoom Team Chat.",
  listChannelMembersSchema, listChannelMembers);

tool("zoom_invite_channel_members",
  "Convida membros para um canal do Zoom Team Chat por email.",
  inviteChannelMembersSchema, inviteChannelMembers);

tool("zoom_search_channels",
  "Busca canais pelo nome no Zoom Team Chat. Útil quando há muitos canais e você não lembra o ID exato.",
  searchChannelsSchema, searchChannels);

// ─── Mensagens ───────────────────────────────────────────────────────────────

tool("zoom_send_message",
  "Envia uma mensagem no Zoom Team Chat. Pode enviar para um canal (to_channel) ou como DM para um contato (to_contact). Para responder em thread, use reply_main_message_id com o ID da mensagem raiz.",
  sendMessageSchema, sendMessage);

tool("zoom_send_file",
  "Envia um arquivo (imagem, PDF, PPTX, etc) no Zoom Team Chat para um canal ou DM.",
  sendFileSchema, sendFile);

tool("zoom_list_messages",
  "Lista mensagens de um canal ou conversa DM no Zoom Team Chat. Retorna as mensagens mais recentes da data informada.",
  listMessagesSchema, listMessages);

tool("zoom_get_message",
  "Retorna detalhes completos de uma mensagem específica do Zoom Team Chat, incluindo arquivos, reações e dados de thread.",
  getMessageSchema, getMessage);

tool("zoom_update_message",
  "Edita o texto de uma mensagem já enviada no Zoom Team Chat. Só é possível editar mensagens enviadas pelo próprio usuário.",
  updateMessageSchema, updateMessage);

tool("zoom_delete_message",
  "Deleta uma mensagem do Zoom Team Chat.",
  deleteMessageSchema, deleteMessage);

tool("zoom_react_message",
  "Adiciona ou remove uma reação emoji em uma mensagem do Zoom Team Chat.",
  reactMessageSchema, reactMessage);

tool("zoom_list_thread",
  "Lista as respostas de uma thread (conversa encadeada) de uma mensagem no Zoom Team Chat.",
  listThreadSchema, listThread);

tool("zoom_download_file",
  "Baixa um arquivo ou imagem de uma mensagem do Zoom Team Chat. Imagens são retornadas inline para visualização. Outros arquivos são salvos em temp e o caminho é retornado.",
  downloadFileSchema, downloadFile);

// ─── Contatos e sessões ───────────────────────────────────────────────────────

tool("zoom_list_contacts",
  "Lista os contatos do Zoom Team Chat do usuário. Por padrão lista contatos da mesma organização (company). Use type='external' para contatos externos.",
  listContactsSchema, listContacts);

tool("zoom_search_company_contacts",
  "Busca contatos da empresa pelo nome ou email usando a API de busca do Zoom (server-side, funciona bem em organizações grandes).",
  searchCompanyContactsSchema, searchCompanyContacts);

tool("zoom_list_sessions",
  "Lista as sessões/conversas recentes do Zoom Team Chat (canais e DMs com atividade recente).",
  listSessionsSchema, listSessions);

// ─── Bookmarks, mensagens fixadas e espaços ───────────────────────────────────

tool("zoom_list_bookmarks",
  "Lista os bookmarks (favoritos) do Zoom Team Chat. Pode filtrar por canal específico ou listar todos os bookmarks do usuário.",
  listBookmarksSchema, listBookmarks);

tool("zoom_list_pinned_messages",
  "Lista as mensagens fixadas (pinned) de um canal do Zoom Team Chat.",
  listPinnedMessagesSchema, listPinnedMessages);

tool("zoom_list_shared_spaces",
  "Lista os espaços compartilhados (Zoom Spaces) do usuário no Zoom Team Chat.",
  listSharedSpacesSchema, listSharedSpaces);

// ─── Start ────────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
