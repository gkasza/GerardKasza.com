import { test } from "node:test";
import assert from "node:assert/strict";
import { llmsTxt, sitemapXml, privacyHtml, notFoundHtml } from "../script/seo";
import { privacyMarkdown } from "../shared/privacy";

const shell = `<!DOCTYPE html><html><head>
<title>Gerard Kasza | Fintech Partnerships & Enterprise GTM Executive</title>
<meta name="robots" content="index, follow" />
<meta property="og:title" content="Gerard Kasza | Fintech Partnerships & Enterprise GTM Executive" />
<meta property="og:url" content="https://gerardkasza.com/" />
<link rel="canonical" href="https://gerardkasza.com/" />
<script type="application/ld+json">{"@type":"Person"}</script>
</head><body><div id="root"><div style="position:absolute">HOME CONTENT</div></div></body></html>`;

test("llms.txt keeps the llmstxt.org shape and adds when-to-use guidance", () => {
  const txt = llmsTxt();
  assert.match(txt, /^# Gerard Kasza\n\n> /);
  assert.match(txt, /\n## When to use this profile\n/);
  assert.match(txt, /\n## How agents should use this site\n/);
  assert.match(txt, /Accept: text\/markdown/);
});

test("sitemap lists the homepage and privacy page", () => {
  const xml = sitemapXml("2026-11-07");
  assert.match(xml, /<loc>https:\/\/gerardkasza\.com\/<\/loc>/);
  assert.match(xml, /<loc>https:\/\/gerardkasza\.com\/privacy<\/loc>/);
});

test("privacy content is substantial in Markdown", () => {
  const md = privacyMarkdown();
  assert.match(md, /^# Privacy Policy/);
  assert.ok(md.length >= 500, `privacy markdown is only ${md.length} chars`);
});

test("privacy.html swaps title, canonical and crawler content", () => {
  const html = privacyHtml(shell);
  assert.match(html, /<title>Privacy Policy \| Gerard Kasza<\/title>/);
  assert.match(html, /og:title" content="Privacy Policy \| Gerard Kasza"/);
  assert.match(html, /<link rel="canonical" href="https:\/\/gerardkasza\.com\/privacy" \/>/);
  assert.match(html, /<h1>Privacy Policy<\/h1>/);
  assert.doesNotMatch(html, /HOME CONTENT|ld\+json/);
  const text = html.match(/<div id="root">([\s\S]*)<\/div><\/div>/)![1].replace(/<[^>]+>/g, "");
  assert.ok(text.length >= 500);
});

test("404.html is noindex with no canonical and points to llms.txt", () => {
  const html = notFoundHtml(shell);
  assert.match(html, /<meta name="robots" content="noindex" \/>/);
  assert.doesNotMatch(html, /rel="canonical"/);
  assert.match(html, /404 Not Found/);
  assert.match(html, /llms\.txt/);
  assert.doesNotMatch(html, /HOME CONTENT/);
});
