// Stores Liv's scrum board as one JSON document in Netlify Blobs.
// Access is gated by the edge function in netlify/edge-functions/auth.js.
import { getStore } from "@netlify/blobs";

const KEY = "board";
const EMPTY = { cards: [], sprint: { name: "", goal: "" } };

export default async (req) => {
  const store = getStore("daisys-board");
  const json = (body, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });

  if (req.method === "GET") {
    return json((await store.get(KEY, { type: "json" })) || EMPTY);
  }

  if (req.method === "PUT") {
    let data;
    try {
      data = await req.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }
    if (!data || !Array.isArray(data.cards)) return json({ error: "Invalid board" }, 400);
    const clean = {
      cards: data.cards.slice(0, 2000),
      sprint: {
        name: String(data.sprint?.name ?? "").slice(0, 200),
        goal: String(data.sprint?.goal ?? "").slice(0, 500),
      },
    };
    await store.setJSON(KEY, clean);
    return json({ ok: true });
  }

  return json({ error: "Method not allowed" }, 405);
};

export const config = { path: "/api/board" };
