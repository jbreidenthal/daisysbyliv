// Password gate for the board page and its data. Set MANAGE_PASSWORD in Netlify.
// Fails closed: with no password configured, nobody gets in.
export default async (request, context) => {
  const password = Netlify.env.get("MANAGE_PASSWORD");
  const deny = (status, extra = {}) =>
    new Response(status === 503 ? "The board is not set up yet." : "Password needed.", {
      status,
      headers: { "Cache-Control": "no-store", ...extra },
    });

  if (!password) return deny(503);

  const header = request.headers.get("Authorization") || "";
  if (header.startsWith("Basic ")) {
    try {
      const decoded = atob(header.slice(6));
      const given = decoded.slice(decoded.indexOf(":") + 1);
      if (given.length === password.length) {
        let diff = 0;
        for (let i = 0; i < given.length; i++) diff |= given.charCodeAt(i) ^ password.charCodeAt(i);
        if (diff === 0) return context.next();
      }
    } catch {
      /* fall through to the prompt */
    }
  }
  return deny(401, { "WWW-Authenticate": 'Basic realm="Daisys Manage", charset="UTF-8"' });
};

export const config = { path: ["/cockpit", "/cockpit/*", "/api/board"] };
