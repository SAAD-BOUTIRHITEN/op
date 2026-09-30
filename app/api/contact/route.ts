import { NextResponse } from "next/server";
import { deliverContactMessage, isContactTransportConfigured } from "@/lib/contact/transport";
import { hasErrors, toContactInput, validateContact } from "@/lib/contact/validate";

export async function POST(request: Request) {
  if (!isContactTransportConfigured()) {
    return NextResponse.json(
      { ok: false, reason: "transport-non-configure" },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "json-invalide" }, { status: 400 });
  }

  const input = toContactInput(body);
  const { errors, isSpam } = validateContact(input);

  // Réponse volontairement identique à un succès : inutile d'apprendre au
  // robot que son message a été écarté.
  if (isSpam) return NextResponse.json({ ok: true });

  if (hasErrors(errors)) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  try {
    await deliverContactMessage(input);
  } catch {
    return NextResponse.json({ ok: false, reason: "envoi-impossible" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
