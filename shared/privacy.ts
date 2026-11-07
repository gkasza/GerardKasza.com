// Rendered by the /privacy React page and, at build time, into privacy.html and privacy.md.

export const privacy = {
  title: "Privacy Policy",
  updated: "2026-11-07",
  intro:
    "gerardkasza.com is the personal website of Gerard Kasza, based in Raleigh-Durham, North Carolina, USA. It is a profile site: there are no user accounts, no advertising, and nothing for sale. This page explains the limited information the site collects and how it is used.",
  sections: [
    {
      heading: "Contact form",
      paragraphs: [
        "If you use the contact form, the name, email address, subject and message you enter are sent to Gerard's inbox through Resend, an email delivery service. That information is used only to read and reply to your message. It is not sold, shared with third parties for marketing, or added to any mailing list.",
      ],
    },
    {
      heading: "Analytics",
      paragraphs: [
        "The site uses Google Analytics to understand which pages are visited and how people find the site. Google Analytics sets cookies and collects information such as pages viewed, referring site, approximate location, browser and device type. Gerard sees this information only in aggregate. You can opt out with Google's browser add-on at https://tools.google.com/dlpage/gaoptout or by blocking cookies in your browser.",
      ],
    },
    {
      heading: "Hosting and third-party services",
      paragraphs: [
        "The site is hosted on Vercel, which processes standard request logs (such as IP address and user agent) to deliver and secure the site. Web fonts are loaded from Google Fonts. Market prices shown in the ticker are fetched by the site's server from public market data providers, so your browser does not contact those providers directly.",
      ],
    },
    {
      heading: "Retention and your choices",
      paragraphs: [
        "Contact form messages are kept in Gerard's email for as long as they are useful for the conversation. Analytics data follows Google Analytics' standard retention settings. To ask what information about you has been received, or to have a message you sent deleted, email gjkasza@gmail.com.",
      ],
    },
  ],
};

export function privacyMarkdown(): string {
  return [
    `# ${privacy.title}`,
    "",
    `Last updated: ${privacy.updated}`,
    "",
    privacy.intro,
    "",
    ...privacy.sections.flatMap((s) => [`## ${s.heading}`, "", ...s.paragraphs.flatMap((p) => [p, ""])]),
  ].join("\n");
}
