import { existsSync } from "https://deno.land/std/fs/exists.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
// deno run --allow-read --allow-write ob-db.js

const file = "og-db.db";
if (existsSync(file)) {
  Deno.removeSync(file);
}

const db = new DB(file, { verbose: true });

console.log("Creating request table");
db.transaction(() => {
  db.query(`DROP TABLE IF EXISTS request`);
  db.query(`CREATE TABLE request (
    id INTEGER PRIMARY KEY,
    url TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    use_dom INTEGER,
    cache_max_age TEXT,
    lang TEXT,
    api_key TEXT
  )`);
});
console.log("Creating request_queue table");
db.transaction(() => {
  db.query(`DROP TABLE IF EXISTS request_queue`);
  db.query(`CREATE TABLE request_queue (
    id INTEGER PRIMARY KEY,
    request_id INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    status TEXT,
    detail TEXT,
    FOREIGN KEY(request_id) REFERENCES request(id)
  )`);
});

// Fields from https://github.com/jshemas/openGraphScraper/blob/05bda0b170bf3240ddfcdcdd6201389a891d135c/lib/fields.js
console.log("Creating response table");
db.transaction(() => {
  db.query(`DROP TABLE IF EXISTS response`);
  db.query(`CREATE TABLE response (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    request_id INTEGER,
    final_url TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    'og:title' TEXT,
    'og:type' TEXT,
    'og:logo' TEXT,
    'og:image' TEXT,
    'og:image:url' TEXT,
    'og:image:secure_url' TEXT,
    'og:image:width' TEXT,
    'og:image:height' TEXT,
    'og:image:type' TEXT,
    'og:url' TEXT,
    'og:audio' TEXT,
    'og:audio:url' TEXT,
    'og:audio:secure_url' TEXT,
    'og:audio:type' TEXT,
    'og:description' TEXT,
    'og:determiner' TEXT,
    'og:locale' TEXT,
    'og:locale:alternate' TEXT,
    'og:site_name' TEXT,
    'og:product:retailer_item_id' TEXT,
    'og:product:price:amount' TEXT,
    'og:product:price:currency' TEXT,
    'og:product:availability' TEXT,
    'og:product:condition' TEXT,
    'og:price:amount' TEXT,
    'og:price:currency' TEXT,
    'og:availability' TEXT,
    'og:video' TEXT,
    'og:video:url' TEXT,
    'og:video:secure_url' TEXT,
    'og:video:actor:id' TEXT,
    'og:video:width' TEXT,
    'og:video:height' TEXT,
    'og:video:type' TEXT,
    'twitter:card' TEXT,
    'twitter:url' TEXT,
    'twitter:site' TEXT,
    'twitter:site:id' TEXT,
    'twitter:creator' TEXT,
    'twitter:creator:id' TEXT,
    'twitter:title' TEXT,
    'twitter:description' TEXT,
    'twitter:image' TEXT,
    'twitter:image:height' TEXT,
    'twitter:image:width' TEXT,
    'twitter:image:src' TEXT,
    'twitter:image:alt' TEXT,
    'twitter:player' TEXT,
    'twitter:player:width' TEXT,
    'twitter:player:height' TEXT,
    'twitter:player:stream' TEXT,
    'twitter:player:stream:content_type' TEXT,
    'twitter:app:name:iphone' TEXT,
    'twitter:app:id:iphone' TEXT,
    'twitter:app:url:iphone' TEXT,
    'twitter:app:name:ipad' TEXT,
    'twitter:app:id:ipad' TEXT,
    'twitter:app:url:ipad' TEXT,
    'twitter:app:name:googleplay' TEXT,
    'twitter:app:id:googleplay' TEXT,
    'twitter:app:url:googleplay' TEXT,
    'music:song' TEXT,
    'music:song:disc' TEXT,
    'music:song:track' TEXT,
    'music:song:url' TEXT,
    'music:musician' TEXT,
    'music:release_date' TEXT,
    'music:duration' TEXT,
    'music:creator' TEXT,
    'music:album' TEXT,
    'music:album:disc' TEXT,
    'music:album:track' TEXT,
    'music:album:url' TEXT,
    'article:published_time' TEXT,
    'article:modified_time' TEXT,
    'article:expiration_time' TEXT,
    'article:author' TEXT,
    'article:section' TEXT,
    'article:tag' TEXT,
    'article:publisher' TEXT,
    'og:article:published_time' TEXT,
    'og:article:modified_time' TEXT,
    'og:article:expiration_time' TEXT,
    'og:article:author' TEXT,
    'og:article:section' TEXT,
    'og:article:tag' TEXT,
    'og:article:publisher' TEXT,
    'books:book' TEXT,
    'book:author' TEXT,
    'book:isbn' TEXT,
    'book:release_date' TEXT,
    'book:canonical_name' TEXT,
    'book:tag' TEXT,
    'books:rating:value' TEXT,
    'books:rating:scale' TEXT,
    'profile:first_name' TEXT,
    'profile:last_name' TEXT,
    'profile:username' TEXT,
    'profile:gender' TEXT,
    'business:contact_data:street_address' TEXT,
    'business:contact_data:locality' TEXT,
    'business:contact_data:region' TEXT,
    'business:contact_data:postal_code' TEXT,
    'business:contact_data:country_name' TEXT,
    'restaurant:menu' TEXT,
    'restaurant:restaurant' TEXT,
    'restaurant:section' TEXT,
    'restaurant:variation:price:amount' TEXT,
    'restaurant:variation:price:currency' TEXT,
    'restaurant:contact_info:website' TEXT,
    'restaurant:contact_info:street_address' TEXT,
    'restaurant:contact_info:locality' TEXT,
    'restaurant:contact_info:region' TEXT,
    'restaurant:contact_info:postal_code' TEXT,
    'restaurant:contact_info:country_name' TEXT,
    'restaurant:contact_info:email' TEXT,
    'restaurant:contact_info:phone_number' TEXT,
    'place:location:latitude' TEXT,
    'place:location:longitude' TEXT,
    'og:date' TEXT,
    'author' TEXT,
    'updated_time' TEXT,
    'modified_time' TEXT,
    'published_time' TEXT,
    'release_date' TEXT,
    'dc.source' TEXT,
    'dc.subject' TEXT,
    'dc.title' TEXT,
    'dc.type' TEXT,
    'dc.creator' TEXT,
    'dc.coverage' TEXT,
    'dc.language' TEXT,
    'dc.contributor' TEXT,
    'dc.date' TEXT,
    'dc.date.issued' TEXT,
    'dc.date.created' TEXT,
    'dc.description' TEXT,
    'dc.identifier' TEXT,
    'dc.publisher' TEXT,
    'dc.rights' TEXT,
    'dc.relation' TEXT,
    'dc.format.media' TEXT,
    'dc.format.size' TEXT,
    'al:ios:url' TEXT,
    'al:ios:app_store_id' TEXT,
    'al:ios:app_name' TEXT,
    'al:iphone:url' TEXT,
    'al:iphone:app_store_id' TEXT,
    'al:iphone:app_name' TEXT,
    'al:ipad:url' TEXT,
    'al:ipad:app_store_id' TEXT,
    'al:ipad:app_name' TEXT,
    'al:android:url' TEXT,
    'al:android:package' TEXT,
    'al:android:class' TEXT,
    'al:android:app_name' TEXT,
    'al:windows_phone:url' TEXT,
    'al:windows_phone:app_id' TEXT,
    'al:windows_phone:app_name' TEXT,
    'al:windows:url' TEXT,
    'al:windows:app_id' TEXT,
    'al:windows:app_name' TEXT,
    'al:windows_universal:url' TEXT,
    'al:windows_universal:app_id' TEXT,
    'al:windows_universal:app_name' TEXT,
    'al:web:url' TEXT,
    'al:web:should_fallback' TEXT,

    FOREIGN KEY (request_id) REFERENCES request(id)
  )`);
});

// console.log({
//   request_schema: db.query(`pragma table_info("request")`),
//   response_schema: db.query(`pragma table_info("response")`),
//   col: db.query(`SELECT [og:date] from response`),
// });

const response_fields = db
  .query(`pragma table_info("response")`)
  .slice(2)
  .map((x) => x[1]);
const response_fields_set = new Set(response_fields);
// console.log(response_fields, response_fields_set.has("og:image"));

export function parseMetaFromDocument(document) {
  const elems = document.querySelectorAll("meta[property]");
  const result = [];

  for (const el of elems) {
    result.push({
      property: el.getAttribute("property"),
      content: el.getAttribute("content"), // deno-dom doesn't support the content property
    });
  }

  return result;
}

export function parseFromDocument(document, options) {
  let meta = parseMetaFromDocument(document);
  let arrays = new Set([
    "og:image",
    "og:video",
    "og:audio",
    "music:album",
    "music:song",
    "video:actor",
    "og:locale:alternate",
    "music:musician",
    "music:creator",
    "video:director",
    "video:writer",
    "video:tag",
    "article:author",
    "article:tag",
    "book:author",
    "book:tag",
  ]);

  const result = {};
  const unknown_properties = {};

  for (const m of meta) {
    const content = m.content;
    let property = m.property;
    console.log(content, property, Array.isArray(property));

    if (!response_fields_set.has(property)) {
      unknown_properties[property] = content;
      console.log("Skipping unknown property", property);
      continue;
    }
    // Todo handle arrays
    if (true || !arrays.has(property)) {
      result[property] = content;
    } else {
      if (!result[property]) {
        result[property] = [];
      }

      result[property].push(content);
    }
  }
  return {
    has_keys: !!Object.keys(result).length,
    result: Object.keys(result).length ? result : null,
    unknown_properties,
  };
}

function parseFromHTML(html, options) {
  return parseFromDocument(
    new DOMParser().parseFromString(html, "text/html"),
    options
  );
}

async function fetchAndParse(url) {
  url = fixupURL(url);
  let resp = await fetch(url);
  let text = await resp.text();
  console.log(`Recieved ${text.length} characters from ${url}`);
  // Todo handle error vs just empty meta
  let r = parseFromHTML(text);

  console.log(r);

  // meta.host = url.hostname;
  return {
    final_url: resp.url,
    response_length: text.length,
    ...r,
  };
}

function fixupURL(url) {
  function isValidHttpUrl(string) {
    let url;
    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
  }
  if (!isValidHttpUrl(url)) {
    url = `https://${url}`;
    if (!isValidHttpUrl(url)) {
      return null;
    }
  }
  return new URL(url);
}

// Top 20 domains from https://radar.cloudflare.com/domains
const PAGES = [
  "invalid_url",
  "google.com",
  "googleapis.com",
  "facebook.com",
  "gstatic.com",
  "apple.com",
  "microsoft.com",
  "doubleclick.net",
  "amazonaws.com",
  "tiktokcdn.com",
  "googlevideo.com",
  "youtube.com",
  "fbcdn.net",
  "tiktokv.com",
  "googlesyndication.com",
  "root-servers.net",
  "facebook-hardware.com",
  "yahoo.com",
  "instagram.com",
  "amazon.com",
  "icloud.com",
];

db.transaction(() => {
  for (const page of PAGES) {
    db.query(`INSERT INTO request (url) VALUES (?)`, [page]);
  }
});

console.log({
  numRequests: db.query(`SELECT COUNT(*) from request`),
  sampleRequests: db
    .query(`SELECT * from request LIMIT 3`)
    .map((r) => r.filter((x) => x !== null)),
});

for (const [request_id, page] of db.query(`SELECT id, url from request`)) {
  db.query(`INSERT INTO request_queue (request_id, status) VALUES (?, ?)`, [
    request_id,
    "pending",
  ]);

  console.log(request_id, page);
  let response;
  try {
    response = await fetchAndParse(page);
  } catch (e) {
    db.query(
      `UPDATE request_queue SET status = ?, detail = ? WHERE request_id = ?`,
      ["error", e.toString(), request_id]
    );
    continue;
  }

  const { final_url, result, has_keys, response_length, unknown_properties } =
    response;
  if (!has_keys) {
    console.log("No og found for", page);
    db.query(
      `UPDATE request_queue SET status = ?, detail = ? WHERE request_id = ?`,
      [
        "done",
        `No og detected - response length ${response_length}${
          Object.keys(unknown_properties).length
            ? " - " + JSON.stringify(unknown_properties)
            : ""
        }`,
        request_id,
      ]
    );
    continue;
  }
  let keys = Object.keys(result);
  let values = keys.map((k) => result[k]);
  let placeholders = keys.map((k) => "?").join(", ");
  let sql = `INSERT INTO response (request_id, final_url, ${keys
    .map((key) => `[${key}]`)
    .join(", ")}) VALUES (NULL, ?, ${placeholders})`;
  let params = [final_url, ...values];
  console.log(sql, params);
  db.query(sql, params);

  db.query(
    `UPDATE request_queue SET status = ?, detail = ? WHERE request_id = ?`,
    [
      "done",
      `Detected ${keys.length} keys - response length ${response_length}${
        Object.keys(unknown_properties).length
          ? " - " + JSON.stringify(unknown_properties)
          : ""
      }`,
      request_id,
    ]
  );
}

console.log({
  requestQueue: db.query(`SELECT * from request_queue`),
  numResponses: db.query(`SELECT COUNT(*) from response`),
  sampleResponses: db
    .query(`SELECT * from response LIMIT 3`)
    .map((r) => r.filter((x) => x !== null)),
});
