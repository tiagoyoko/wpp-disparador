import { NextRequest, NextResponse } from "next/server";
import { sendAdvanced, dateTimeToTimestamp, formatPhone } from "@/lib/uazapi";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  // Verificar autenticação
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const {
      name,
      message,
      instanceId,
      instanceKey,
      contactList,
      sendingSpeed,
      isScheduled,
      scheduledDate,
      scheduledTime,
      useVariations,
      variations,
    } = data;

    // Validar dados obrigatórios
    if (!instanceKey || !message || !contactList || contactList.length === 0) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    // Calcular delay com base na velocidade de envio
    // sendingSpeed é mensagens por minuto, convertemos para segundos entre mensagens
    const baseDelay = Math.floor(60 / sendingSpeed);
    const delayMin = Math.max(2, baseDelay - 1);
    const delayMax = baseDelay + 1;

    // Preparar mensagens
    const messages = contactList.map((contact: any) => ({
      number: formatPhone(contact.phone),
      message:
        useVariations && variations && variations.length > 0
          ? variations[Math.floor(Math.random() * variations.length)] || message
          : message,
    }));

    // Configurar agendamento
    let scheduled_for: number | undefined = undefined;
    if (isScheduled && scheduledDate && scheduledTime) {
      scheduled_for = dateTimeToTimestamp(scheduledDate, scheduledTime);
    }

    // Preparar payload para a API
    const payload = {
      delayMin,
      delayMax,
      info: name,
      scheduled_for,
      messages,
    };

    // Enviar para a API da uazapi
    const response = await sendAdvanced(instanceKey, payload);

    if (!response.status) {
      return NextResponse.json({ error: response.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Campanha enviada com sucesso",
      info: response.info,
    });
  } catch (error) {
    console.error("Erro ao processar campanha:", error);
    return NextResponse.json(
      { error: "Erro ao processar campanha" },
      { status: 500 }
    );
  }
}
