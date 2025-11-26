import { QueryError } from "@/services/query-handler";

// Mapeamento de mensagens internas -> mensagens amigáveis
const messageDictionary: Record<string, string> = {
  "error-occurred": "Ocorreu um erro ao processar sua solicitação.",
  "network-error":
    "Falha de conexão. Verifique sua internet e tente novamente.",
  "user-exists": "Usuário já cadastrado.",
  "email-exists": "E-mail já cadastrado.",
  "username-exists": "Nome de usuário já cadastrado.",
};

export function mapQueryError(error: any): string[] {
  if (error instanceof QueryError) {
    const msgs: string[] = [];

    // Mensagem principal
    if (error.message) {
      msgs.push(messageDictionary[error.message] || error.message);
    }

    // Status específicos
    if (error.status === 409) {
      // Conflito (registro duplicado)
      if (!msgs.some((m) => /cadastrado/i.test(m))) {
        msgs.push("Registro já existente.");
      }
    } else if (error.status === 400) {
      if (!msgs.length)
        msgs.push("Dados inválidos. Verifique os campos e tente novamente.");
    } else if (error.isServerError()) {
      msgs.push("Erro interno do servidor. Tente novamente mais tarde.");
    }

    // Lista de erros detalhados vinda da API
    if (error.data?.errors && Array.isArray(error.data.errors)) {
      error.data.errors.forEach((e: any) => {
        if (typeof e === "string") msgs.push(e);
        else if (e?.message) msgs.push(e.message);
      });
    }

    // Remover duplicatas
    return Array.from(new Set(msgs));
  }
  return ["Erro inesperado. Tente novamente."];
}
