import { systemPrompt } from "@/lib/utils";
import Together from "together-ai";

function chatErrorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const apiKey = process.env.TOGETHER_API_KEY;
  if (!apiKey) {
    return chatErrorResponse(
      "Chat is unavailable: TOGETHER_API_KEY is not configured.",
      503,
    );
  }

  let messages: Together.Chat.Completions.CompletionCreateParams.Message[];
  try {
    const body = await request.json();
    messages = body.messages;
    if (!Array.isArray(messages)) {
      return chatErrorResponse("Invalid request: messages must be an array.", 400);
    }
  } catch {
    return chatErrorResponse("Invalid request body.", 400);
  }

  try {
    const together = new Together({ apiKey });
    const res = await together.chat.completions.create({
      model: "zai-org/GLM-5",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...messages,
      ],
      stream: true,
    });

    return new Response(res.toReadableStream());
  } catch (err) {
    console.error("Together chat completion failed", err);

    const status =
      typeof err === "object" &&
      err !== null &&
      "status" in err &&
      typeof err.status === "number"
        ? err.status
        : 502;

    const message =
      status === 401
        ? "Chat is unavailable: invalid Together API key."
        : "Unable to reach Together AI. Please try again.";

    return chatErrorResponse(message, status >= 400 && status < 600 ? status : 502);
  }
}
