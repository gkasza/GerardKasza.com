import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildJsonLd,
  llmsTxt,
  llmsFullTxt,
  robotsTxt,
  sitemapXml,
  privacyHtml,
  notFoundHtml,
} from "../script/seo";
import { privacyMarkdown } from "../shared/privacy";
import { profile } from "../shared/profile";

const shell = `<!DOCTYPE html><html><head>
<title>Gerard Kasza | Fintech Partnerships & Enterprise GTM Executive</title>
<meta name="robots" content="index, follow" />
<meta property="og:title" content="Gerard Kasza | Fintech Partnerships & Enterprise GTM Executive" />
<meta property="og:url" content="https://gerardkasza.com/" />
<link rel="canonical" href="https://gerardkasza.com/" />
<script type="application/ld+json">{"@type":"Person"}</script>
</head><body><div id="root"><div style="position:absolute">HOME CONTENT</div></div></body></html>`;

test("llms.txt keeps the llmstxt.org shape, Quick Facts table, and FAQ", () => {
  const txt = llmsTxt();
  assert.match(txt, /^# Gerard Kasza\n\n> /);
  assert.match(txt, /\n## Quick Facts \(Verified\)\n/);
  assert.match(txt, /\n## When to use this profile\n/);
  assert.match(txt, /\n## How agents should use this site\n/);
  assert.match(txt, /Accept: text\/markdown/);
  assert.match(txt, /llms-full\.txt/);
  assert.match(txt, /\n## Frequently Asked Questions\n/);
});

test("llms-full.txt includes ready-to-cite bios, Q&A, career dates, and sameAs links", () => {
  const full = llmsFullTxt();
  assert.match(full, /## Verified Third-Person Bios/);
  assert.match(full, /## Direct Q&A/);
  assert.match(full, /## Verified Career Ledger/);
  assert.match(full, /2026-04 to present/);
  assert.match(full, /https:\/\/held-away\.com\//);
});

test("JSON-LD graph includes Person with OrganizationRole dates, SoftwareApplication, BreadcrumbList, and FAQPage", () => {
  const parsed = JSON.parse(buildJsonLd());
  const graph = parsed["@graph"] as Record<string, any>[];
  const person = graph.find((n) => n["@type"] === "Person");
  const faq = graph.find((n) => n["@type"] === "FAQPage");
  const breadcrumb = graph.find((n) => n["@type"] === "BreadcrumbList");
  const apps = graph.filter((n) => n["@type"] === "SoftwareApplication");

  assert.ok(person, "Person node present");
  assert.equal(person.worksFor["@type"], "OrganizationRole");
  assert.equal(person.worksFor.startDate, "2026-04");
  assert.ok(Array.isArray(person.sameAs) && person.sameAs.length >= 4);
  assert.ok(Array.isArray(person.alumniOf) && person.alumniOf[0]["@type"] === "OrganizationRole");
  assert.ok(faq && faq.mainEntity.length === profile.faq.length);
  assert.ok(breadcrumb);
  assert.equal(apps.length, 2);
});

test("robots.txt explicitly allows major AI search and user fetchers", () => {
  assert.match(robotsTxt, /# llms\.txt: https:\/\/gerardkasza\.com\/llms\.txt/);
  assert.match(robotsTxt, /User-agent: GPTBot/);
  assert.match(robotsTxt, /User-agent: Perplexity-User/);
  assert.match(robotsTxt, /User-agent: Claude-User/);
  assert.match(robotsTxt, /User-agent: DuckAssistBot/);
});

test("sitemap lists the homepage with honest lastmod and privacy page", () => {
  const xml = sitemapXml("2026-11-07");
  assert.match(xml, /<loc>https:\/\/gerardkasza\.com\/<\/loc><lastmod>2026-11-07<\/lastmod>/);
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
