import { next } from "@vercel/functions/middleware";

// Self-contained on purpose: shared/ imports have crashed Vercel's function bundling before.
const SITE = "https://gerardkasza.com";

const MARKDOWN_SOURCES: Record<string, string> = {
  "/": "/llms.txt",
  "/privacy": "/privacy.md",
};

export const config = {
  matcher: ["/((?!api/|assets/).*)"],
};

export function prefersMarkdown(accept: string | null): boolean {
  if (!accept) return false;
  let markdownQ = 0;
  let htmlQ = 0;
  for (const part of accept.split(",")) {
    const [type, ...params] = part.trim().toLowerCase().split(";");
    const qParam = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
    const q = qParam ? Number(qParam.slice(2)) : 1;
    if (Number.isNaN(q)) continue;
    if (type.trim() === "text/markdown") markdownQ = Math.max(markdownQ, q);
    if (type.trim() === "text/html") htmlQ = Math.max(htmlQ, q);
  }
  return markdownQ > 0 && markdownQ >= htmlQ;
}

export function notFoundMarkdown(pathname: string): string {
  const safePath = pathname.replace(/[`\r\n]/g, "").slice(0, 200);
  return [
    "# 404 Not Found",
    "",
    `There is no page at \`${safePath}\` on gerardkasza.com. This is a personal profile site with a single main page.`,
    "",
    `- Profile summary for AI agents (Markdown): ${SITE}/llms.txt`,
    `- Homepage: ${SITE}/`,
    `- Privacy policy: ${SITE}/privacy`,
    `- Sitemap: ${SITE}/sitemap.xml`,
    "",
  ].join("\n");
}

function markdownResponse(body: string, status: number): Response {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}

export default async function middleware(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const { pathname } = url;

  if (/\.[a-z0-9]+$/i.test(pathname)) return next();

  const wantsMarkdown = prefersMarkdown(request.headers.get("accept"));
  const source = MARKDOWN_SOURCES[pathname];

  if (source) {
    if (!wantsMarkdown) return next({ headers: { Vary: "Accept" } });
    const res = await fetch(new URL(source, url.origin));
    if (!res.ok) return next({ headers: { Vary: "Accept" } });
    return markdownResponse(await res.text(), 200);
  }

  if (wantsMarkdown) return markdownResponse(notFoundMarkdown(pathname), 404);

  // Unknown path: Vercel serves dist/public/404.html with a 404 status.
  return next({ headers: { Vary: "Accept" } });
}
