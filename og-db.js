import { fetchAndParse } from "./og-parse.js";

// https://github.com/ai/nanoid/blob/main/nanoid.js
const nanoid = (t = 21) =>
  crypto
    .getRandomValues(new Uint8Array(t))
    .reduce(
      (t, e) =>
        (t +=
          (e &= 63) < 36
            ? e.toString(36)
            : e < 62
            ? (e - 26).toString(36).toUpperCase()
            : e > 62
            ? "-"
            : "_"),
      ""
    );

export function migrate({ db }) {
  const NEW_VERSION = 2;
  const CURRENT_VERSION = db.query(`PRAGMA user_version`)[0][0];

  if (CURRENT_VERSION >= NEW_VERSION) {
    return;
  }

  console.log(`Migrating from ${CURRENT_VERSION} to ${NEW_VERSION}`);

  if (CURRENT_VERSION < 1) {
    // Found these on facebook properties and amazon
    db.query(`ALTER TABLE og_response ADD 'fb:app_id' TEXT`);
    db.query(`ALTER TABLE og_response ADD 'fb:page_id' TEXT`);
  }

  db.query(`PRAGMA user_version = ${NEW_VERSION}`);
}

export async function initialize({ db }) {
  console.log("Creating request table");
  db.transaction(() => {
    db.query(`DROP TABLE IF EXISTS request`);
    db.query(`CREATE TABLE request (
      id INTEGER PRIMARY KEY,
      url TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      api_lookup_id TEXT UNIQUE,
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
  console.log("Creating og_response table");
  db.transaction(() => {
    db.query(`DROP TABLE IF EXISTS og_response`);
    db.query(`CREATE TABLE og_response (
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
  
      'unknown_fields' TEXT,
  
      FOREIGN KEY (request_id) REFERENCES request(id)
    )`);
  });

  migrate({ db });
}

export function get_response_fields({ db }) {
  return db
    .query(`pragma table_info("og_response")`)
    .slice(2)
    .map((x) => x[1]);
}

export async function generate_fixtures({ db, num_fixture_pages }) {
  // Top 20 domains from https://radar.cloudflare.com/domains
  const PAGES = [
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
    for (const url of PAGES.slice(0, num_fixture_pages)) {
      addRequest({ db, url });
    }
  });

  console.log({
    numRequests: db.query(`SELECT COUNT(*) from request`),
    sampleRequests: db
      .query(`SELECT * from request LIMIT 3`)
      .map((r) => r.filter((x) => x !== null)),
  });

  // Find requests which don't have a request_queue
  const requestsWithoutQueue = getUnqueuedRequests({ db });

  let promises = [];
  for (const [request_id, page] of requestsWithoutQueue) {
    promises.push(processIndividualRequestQueue({ db, request_id, page }));
  }

  await Promise.all(promises);
  console.log({
    requestQueue: db.query(`SELECT * from request_queue`),
    numResponses: db.query(`SELECT COUNT(*) from og_response`),
    sampleResponses: db
      .query(`SELECT * from og_response LIMIT 3`)
      .map((r) => r.filter((x) => x !== null)),
  });
}

export function getUnqueuedRequests({ db }) {
  return db.query(`
    SELECT request.id, request.url
    FROM request
    LEFT JOIN request_queue
    ON request.id = request_queue.request_id
    WHERE request_queue.request_id IS NULL
  `);
}
export function getRequestQueueErrors({ db }) {
  return db.query(`
    SELECT request.id, request.url
    FROM request
    LEFT JOIN request_queue
    ON request.id = request_queue.request_id
    WHERE request_queue.status = 'error'
  `);
}
export function getRequestQueuePending({ db }) {
  return db.query(`
    SELECT request.id, request.url
    FROM request
    LEFT JOIN request_queue
    ON request.id = request_queue.request_id
    WHERE request_queue.status = 'pending'
  `);
}
export function getRequestQueueDone({ db }) {
  return db.query(`
    SELECT request.id, request.url
    FROM request
    LEFT JOIN request_queue
    ON request.id = request_queue.request_id
    WHERE request_queue.status = 'done'
  `);
}
export function getRequestQueueRunning({ db }) {
  return db.query(`
    SELECT request.id, request.url
    FROM request
    LEFT JOIN request_queue
    ON request.id = request_queue.request_id
    WHERE request_queue.status = 'running'
  `);
}

export async function addRequest({ db, url, wait = false }) {
  let r = db.query(`INSERT INTO request (url, api_lookup_id) VALUES (?, ?)`, [
    url,
    nanoid(10),
  ]);

  // This may require a round trip to get the actual request id
  let request_id = db.query(`SELECT id FROM request where rowid = ?`, [
    db.lastInsertRowId,
  ])[0][0];

  if (wait) {
    await processIndividualRequestQueue({ db, request_id });
  }
}

export async function processIndividualRequestQueue({ db, request_id }) {
  const og_response_fields = get_response_fields({ db });
  const page = db.query(`SELECT url from request WHERE id = ?`, [
    request_id,
  ])[0][0];
  // Todo - this should add when the request is added and then query for the pending ones

  db.query(`INSERT INTO request_queue (request_id, status) VALUES (?, ?)`, [
    request_id,
    "pending",
  ]);
  let request_queue_id = db.query(
    `SELECT id FROM request_queue where rowid = ?`,
    [db.lastInsertRowId]
  )[0][0];

  let response;
  try {
    response = await fetchAndParse(page, { og_response_fields });
  } catch (e) {
    console.error(e);
    db.query(
      `UPDATE request_queue SET status = ?, detail = ? WHERE request_id = ?`,
      ["error", e.toString(), request_id]
    );
    return;
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
    return;
  }
  let keys = Object.keys(result);
  let values = keys.map((k) => result[k]);
  let placeholders = keys.map((k) => "?").join(", ");
  let sql = `INSERT INTO og_response (request_id, final_url, unknown_fields, ${keys
    .map((key) => `[${key}]`)
    .join(", ")}) VALUES (?, ?, ?, ${placeholders})`;
  let params = [
    request_id,
    final_url,
    Object.keys(unknown_properties).length
      ? JSON.stringify(unknown_properties)
      : null,
    ...values,
  ];
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
// deno run -A og-db.js --file tmp.db --num_sites 1
// const args = parse(Deno.args, {
//   default: {
//     file: "og-db.db",
//     num_sites: PAGES.length,
//   },
// });

// const { file, num_sites } = args;
// if (existsSync(file)) {
//   Deno.removeSync(file);
// }

// const db = new DB(file, { verbose: true });

// // console.log({
// //   request_schema: db.query(`pragma table_info("request")`),
// //   og_response_schema: db.query(`pragma table_info("og_response")`),
// //   col: db.query(`SELECT [og:date] from og_response`),
// // });
