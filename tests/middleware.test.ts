import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import middleware, { prefersMarkdown, notFoundMarkdown } from "../middleware";

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

function stubFetch(files: Record<string, string>) {
  const requested: string[] = [];
  globalThis.fetch = (async (input: string | URL | Request) => {
    const url = new URL(input instanceof Request ? input.url : input.toString());
    requested.push(url.pathname);
    const body = files[url.pathname];
    return body === undefined ? new Response("", { status: 404 }) : new Response(body, { status: 200 });
  }) as typeof fetch;
  return requested;
}

const req = (path: string, accept?: string) =>
  new Request(`https://gerardkasza.com${path}`, { headers: accept ? { accept } : {} });

const BROWSER_ACCEPT = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8";
const isPassThrough = (res: Response) => res.headers.get("x-middleware-next") === "1";

test("prefersMarkdown honours explicit markdown and q-values", () => {
  assert.equal(prefersMarkdown("text/markdown"), true);
  assert.equal(prefersMarkdown("text/markdown, text/html;q=0.5"), true);
  assert.equal(prefersMarkdown("text/markdown;q=0.5, text/html"), false);
  assert.equal(prefersMarkdown(BROWSER_ACCEPT), false);
  assert.equal(prefersMarkdown("*/*"), false);
  assert.equal(prefersMarkdown("text/markdown;q=0"), false);
  assert.equal(prefersMarkdown(null), false);
});

test("homepage serves llms.txt as Markdown when asked", async () => {
  const requested = stubFetch({ "/llms.txt": "# Gerard Kasza\n\nProfile" });
  const res = await middleware(req("/", "text/markdown"));
  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-type")!, /^text\/markdown/);
  assert.equal(res.headers.get("vary"), "Accept");
  assert.equal(await res.text(), "# Gerard Kasza\n\nProfile");
  assert.deepEqual(requested, ["/llms.txt"]);
});

test("homepage passes through to HTML for browsers, with Vary: Accept", async () => {
  const requested = stubFetch({});
  const res = await middleware(req("/", BROWSER_ACCEPT));
  assert.ok(isPassThrough(res));
  assert.equal(res.headers.get("vary"), "Accept");
  assert.deepEqual(requested, []);
});

test("privacy page serves privacy.md as Markdown when asked", async () => {
  stubFetch({ "/privacy.md": "# Privacy Policy" });
  const res = await middleware(req("/privacy", "text/markdown"));
  assert.equal(res.status, 200);
  assert.equal(await res.text(), "# Privacy Policy");
});

test("falls back to HTML if the Markdown source is unavailable", async () => {
  stubFetch({});
  const res = await middleware(req("/", "text/markdown"));
  assert.ok(isPassThrough(res));
});

test("unknown path returns a Markdown 404 for agents", async () => {
  stubFetch({});
  const res = await middleware(req("/some-path-that-does-not-exist", "text/markdown"));
  assert.equal(res.status, 404);
  assert.match(res.headers.get("content-type")!, /^text\/markdown/);
  const body = await res.text();
  assert.ok(body.length >= 20);
  assert.match(body, /\/some-path-that-does-not-exist/);
  assert.match(body, /llms\.txt/);
  assert.match(body, /sitemap\.xml/);
});

test("unknown path passes through for browsers so Vercel serves 404.html", async () => {
  const res = await middleware(req("/nope", BROWSER_ACCEPT));
  assert.ok(isPassThrough(res));
});

test("static files always pass through untouched", async () => {
  const requested = stubFetch({});
  const res = await middleware(req("/llms.txt", "text/markdown"));
  assert.ok(isPassThrough(res));
  assert.equal(res.headers.get("vary"), null);
  assert.deepEqual(requested, []);
});

test("404 Markdown strips characters that would break formatting", () => {
  const body = notFoundMarkdown("/a`b\nc");
  assert.match(body, /`\/abc`/);
});
