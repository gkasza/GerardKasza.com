import { profile } from "../shared/profile";

const INDEXNOW_KEY = "4e7a9c2b8f1d40e6a3c5b7d9e1f2a4b6";
const HOST = new URL(profile.url).host;

const urls = [
  `${profile.url}/`,
  `${profile.url}/privacy`,
  `${profile.url}/llms.txt`,
  `${profile.url}/llms-full.txt`,
];

async function pingIndexNow() {
  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: `${profile.url}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`IndexNow failed (${res.status}): ${body}`);
  }

  console.log(`IndexNow pinged successfully (${res.status}) for ${urls.length} URLs.`);
}

pingIndexNow().catch((err) => {
  console.error(err);
  process.exit(1);
});
