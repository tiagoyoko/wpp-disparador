/**
 * Utilitário para verificação de token da uazapi
 */

/**
 * Verifica se o token de administração da uazapi está válido
 * usando o endpoint /instance/all que requer permissões de administrador
 * @returns Resultado da verificação
 */
export async function checkAdminToken(): Promise<{
  valid: boolean;
  message?: string;
}> {
  try {
    const adminToken = process.env.UAZAPI_ADMINTOKEN;

    if (!adminToken) {
      return {
        valid: false,
        message: "UAZAPI_ADMINTOKEN não configurado no arquivo .env",
      };
    }

    const apiUrl =
      process.env.NEXT_PUBLIC_UAZAPI_URL || "https://free.uazapi.com";

    // No servidor de demonstração, usamos /instance/init para testar o token
    // Criamos uma instância temporária para validar o token
    console.log(`Verificando token com o endpoint: ${apiUrl}/instance/init`);

    const response = await fetch(`${apiUrl}/instance/init`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        admintoken: adminToken,
      },
      body: JSON.stringify({
        name: `test-token-${Date.now()}`
      }),
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        console.log("Resposta da API ao verificar token:", errorData);

        if (response.status === 401) {
          return {
            valid: false,
            message:
              "Token de administração inválido ou expirado. Verifique o UAZAPI_ADMINTOKEN no arquivo .env",
          };
        }

        return {
          valid: false,
          message:
            errorData.error ||
            `Erro ao verificar token: ${response.status} ${response.statusText}`,
        };
      } catch (jsonError) {
        if (response.status === 401) {
          return {
            valid: false,
            message:
              "Token de administração inválido ou expirado. Verifique o UAZAPI_ADMINTOKEN no arquivo .env",
          };
        }

        return {
          valid: false,
          message: `Erro ao verificar token: ${response.status} ${response.statusText}`,
        };
      }
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      message: `Erro ao verificar token: ${
        error instanceof Error ? error.message : "Erro desconhecido"
      }`,
    };
  }
}
