import type { Plugin } from "vite";
import { profile } from "../shared/profile";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const stripTag = (title: string) => title.replace(/\s*\[.*?\]\s*$/, "");

const description =
  "Raleigh-based fintech partnerships and enterprise GTM executive across wealth, banking, credit, and crypto. Back-to-back Sales Leader of the Year.";

function jsonLd(today: string) {
  const personId = `${profile.url}/#person`;
  const current = profile.experiences.find((e) => e.current);
  const past = profile.experiences.filter((e) => !e.current);

  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebSite",
      "@id": `${profile.url}/#website`,
      url: profile.url,
      name: profile.name,
      inLanguage: "en-US",
      publisher: { "@id": personId },
    },
    {
      "@type": "ProfilePage",
      "@id": `${profile.url}/#profilepage`,
      url: profile.url,
      name: `${profile.name} | ${profile.headline}`,
      description,
      dateModified: today,
      isPartOf: { "@id": `${profile.url}/#website` },
      mainEntity: { "@id": personId },
    },
    {
      "@type": "Person",
      "@id": personId,
      name: profile.name,
      givenName: profile.givenName,
      familyName: profile.familyName,
      url: profile.url,
      image: profile.image,
      email: `mailto:${profile.email}`,
      jobTitle: profile.headline,
      description: `${profile.tagline} ${description}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: profile.location.city,
        addressRegion: profile.location.region,
        addressCountry: profile.location.country,
      },
      ...(current && {
        worksFor: { "@type": "Organization", name: current.company, url: current.companyUrl },
      }),
      alumniOf: past.map((e) => ({ "@type": "Organization", name: e.company })),
      hasOccupation: {
        "@type": "Occupation",
        name: profile.headline,
        occupationLocation: { "@type": "City", name: `${profile.location.city}, ${profile.location.region}` },
        skills: profile.expertise.join(", "),
      },
      knowsAbout: profile.expertise,
      award: profile.awards,
      subjectOf: {
        "@type": "NewsArticle",
        headline: profile.press.title,
        url: profile.press.url,
        publisher: { "@type": "Organization", name: profile.press.outlet },
      },
      sameAs: [profile.linkedin],
    },
    ...profile.projects.map((p) => ({
      "@type": "CreativeWork",
      name: stripTag(p.title),
      url: p.link,
      description: p.description,
      keywords: p.tags.join(", "),
      creator: { "@id": personId },
    })),
  ];

  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
}

function crawlerHtml() {
  const li = (items: string[]) => `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
  return [
    `<header><h1>${esc(profile.name)}</h1><p>${esc(profile.headline)}: ${esc(profile.verticals.join(", "))}</p><p>${esc(profile.tagline)}</p><p>Based in ${esc(profile.location.label)}</p></header>`,
    `<section><h2>About</h2>${profile.summary.map((p) => `<p>${esc(p)}</p>`).join("")}</section>`,
    `<section><h2>Recognition &amp; Results</h2>${li([
      ...profile.stats.map((s) => `${s.target}${s.suffix} ${s.label}`),
      ...profile.awards,
      `Featured on ${profile.press.outlet} (${profile.press.year}): ${profile.press.title}`,
    ])}</section>`,
    `<section><h2>Professional Experience</h2>${profile.experiences
      .map(
        (e) =>
          `<article><h3>${esc(e.title)}, ${esc(e.company)}</h3><p>${esc(e.period)} · ${esc(e.location)}</p>${li(e.achievements)}</article>`,
      )
      .join("")}</section>`,
    `<section><h2>Core Skills</h2>${li(profile.skills.map((s) => `${s.name}: ${s.years}+ years`))}<h3>Areas of Expertise</h3>${li(profile.expertise)}</section>`,
    `<section><h2>Featured Projects</h2>${profile.projects
      .map(
        (p) =>
          `<article><h3><a href="${esc(p.link)}">${esc(stripTag(p.title))}</a></h3><p>${esc(p.description)}</p></article>`,
      )
      .join("")}</section>`,
    `<section><h2>Contact</h2><p><a href="${esc(profile.linkedin)}" rel="me">LinkedIn</a> · <a href="mailto:${esc(profile.email)}">${esc(profile.email)}</a></p></section>`,
  ].join("");
}

function llmsTxt() {
  const lines = [
    `# ${profile.name}`,
    "",
    `> ${profile.headline} (${profile.verticals.join(", ")}), based in ${profile.location.label}. ${profile.tagline}`,
    "",
    description,
    "",
    "## Summary",
    "",
    ...profile.summary.flatMap((p) => [p, ""]),
    "## Recognition",
    "",
    ...profile.awards.map((a) => `- ${a}`),
    ...profile.stats.map((s) => `- ${s.target}${s.suffix} ${s.label}`),
    `- Featured on ${profile.press.outlet} (${profile.press.year}): [${profile.press.title}](${profile.press.url})`,
    "",
    "## Experience",
    "",
    ...profile.experiences.flatMap((e) => [
      `### ${e.title}, ${e.company} (${e.period}, ${e.location})`,
      "",
      ...e.achievements.map((a) => `- ${a}`),
      "",
    ]),
    "## Areas of Expertise",
    "",
    profile.expertise.join(", "),
    "",
    "## Core Skills",
    "",
    ...profile.skills.map((s) => `- ${s.name}: ${s.years}+ years`),
    "",
    "## Projects",
    "",
    ...profile.projects.map((p) => `- [${stripTag(p.title)}](${p.link}): ${p.description}`),
    "",
    "## Links",
    "",
    `- [Website](${profile.url})`,
    `- [LinkedIn](${profile.linkedin})`,
    `- Email: ${profile.email}`,
    "",
  ];
  return lines.join("\n");
}

const robotsTxt = `User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: ${profile.url}/sitemap.xml
`;

const sitemapXml = (today: string) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${profile.url}/</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>1.0</priority></url>
</urlset>
`;

export function seo(): Plugin {
  const today = new Date().toISOString().slice(0, 10);
  return {
    name: "profile-seo",
    transformIndexHtml(html) {
      return html
        .split("<!--seo:description-->").join(esc(description))
        .replace("<!--seo:jsonld-->", `<script type="application/ld+json">${jsonLd(today)}</script>`)
        .replace(
          '<div id="root"></div>',
          `<div id="root"><div style="position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">${crawlerHtml()}</div></div>`,
        );
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "robots.txt", source: robotsTxt });
      this.emitFile({ type: "asset", fileName: "sitemap.xml", source: sitemapXml(today) });
      this.emitFile({ type: "asset", fileName: "llms.txt", source: llmsTxt() });
    },
  };
}
