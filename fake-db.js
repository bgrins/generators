import { parse } from "https://deno.land/std/flags/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { faker } from "https://esm.sh/@faker-js/faker@7.4.0?dts";
import { existsSync } from "https://deno.land/std/fs/exists.ts";

// deno run --allow-read --allow-write fake-db.js --seed=1 --locale=fr --file=fake-data.db
const args = parse(Deno.args, {
  default: {
    seed: null,
    locale: "en",
    file: "fake-data.db",
    numUsers: 1000,
    numPosts: 200,
    numComments: 1000,
    numAccessLogs: 10000,
  },
});

console.log("Running with args:", args);

const { seed, locale, file, numUsers, numPosts, numComments, numAccessLogs } =
  args;

faker.setLocale(locale);

if (seed) {
  faker.seed(seed);
}

if (existsSync(file)) {
  Deno.removeSync(file);
}
const db = new DB(file, { verbose: true });

console.log("Creating user table");
db.transaction(() => {
  db.query(`DROP TABLE IF EXISTS user`);
  db.query(`
  CREATE TABLE user (
    id INTEGER PRIMARY KEY,
    name TEXT,
    email TEXT,
    phone TEXT,
    website TEXT
  )
`);

  for (let i = 0; i < numUsers; i++) {
    db.query(
      `INSERT INTO user (name, email, phone, website) VALUES (?, ?, ?, ?)`,
      [
        faker.name.fullName(),
        faker.internet.email(),
        faker.phone.number(),
        faker.internet.url(),
      ]
    );
  }
});

console.log("Creating post table");
db.transaction(() => {
  db.query(`DROP TABLE IF EXISTS post`);
  db.query(`
    CREATE TABLE post (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    title TEXT,
    body TEXT,
    FOREIGN KEY (user_id) REFERENCES user(id)
    )
`);
  for (let i = 0; i < numPosts; i++) {
    db.query(`INSERT INTO post (user_id, title, body) VALUES (?, ?, ?)`, [
      faker.datatype.number({ min: 1, max: numUsers }),
      faker.lorem.sentence(),
      faker.lorem.paragraphs(),
    ]);
  }
});

console.log({
  numUsers: db.query(`SELECT COUNT(*) from user`),
  sampleUsers: db.query(`SELECT * from user LIMIT 3`),
  numPosts: db.query(`SELECT COUNT(*) from post`),
  samplePosts: db.query(`SELECT * from post LIMIT 3`),
});
console.log("Creating comment table");
db.transaction(() => {
  db.query(`DROP TABLE IF EXISTS comment`);

  db.query(`
CREATE TABLE comment (
  id INTEGER PRIMARY KEY,
  post_id INTEGER,
  name TEXT,
  email TEXT,
  body TEXT,
  FOREIGN KEY (post_id) REFERENCES post(id)
)
`);

  for (let i = 0; i < numComments; i++) {
    db.query(
      `INSERT INTO comment (post_id, name, email, body) VALUES (?, ?, ?, ?)`,
      [
        faker.datatype.number({ min: 1, max: numPosts }),
        faker.name.fullName(),
        faker.internet.email(),
        faker.lorem.paragraph(),
      ]
    );
  }
});

console.log("Create post_meta table");
db.transaction(() => {
  db.query(`DROP TABLE IF EXISTS post_meta`);

  db.query(`
CREATE TABLE post_meta (
  id INTEGER PRIMARY KEY,
  post_id INTEGER,
  meta_key TEXT,
  meta_value TEXT,
  FOREIGN KEY (post_id) REFERENCES post(id)
)
`);
  // Make sure each post gets one meta
  for (let i = 0; i < numPosts; i++) {
    db.query(
      `INSERT INTO post_meta (post_id, meta_key, meta_value) VALUES (?, ?, ?)`,
      [i + 1, faker.lorem.word(), faker.lorem.word()]
    );
  }

  // And add some more randomly
  for (let i = 0; i < numPosts / 2; i++) {
    db.query(
      `INSERT INTO post_meta (post_id, meta_key, meta_value) VALUES (?, ?, ?)`,
      [
        faker.datatype.number({ min: 1, max: numPosts }),
        faker.lorem.word(),
        faker.lorem.word(),
      ]
    );
  }
});

console.log("Create access_log table");
db.transaction(() => {
  db.query(`DROP TABLE IF EXISTS access_log`);

  db.query(`
CREATE TABLE access_log (
  id INTEGER PRIMARY KEY,
  ip TEXT,
  user_agent TEXT,
  timestamp TEXT
)
`);

  for (let i = 0; i < numAccessLogs; i++) {
    db.query(
      `INSERT INTO access_log (ip, user_agent, timestamp) VALUES (?, ?, ?)`,
      [faker.internet.ip(), faker.internet.userAgent(), faker.date.past()]
    );
  }
});

console.log("Create site table");
db.transaction(() => {
  db.query(`DROP TABLE IF EXISTS site`);

  db.query(`
CREATE TABLE site (
  id INTEGER PRIMARY KEY,
  name TEXT,
  url TEXT
)
`);

  db.query(`INSERT INTO site (name, url) VALUES (?, ?)`, [
    faker.company.companyName(),
    faker.internet.url(),
  ]);
  db.query(`INSERT INTO site (name, url) VALUES (?, ?)`, [
    faker.company.companyName(),
    faker.internet.url(),
  ]);
});

console.log({
  numSites: db.query(`SELECT COUNT(*) from site`),
  sampleSites: db.query(`SELECT * from site LIMIT 3`),
  numUsers: db.query(`SELECT COUNT(*) from user`),
  sampleUsers: db.query(`SELECT * from user LIMIT 3`),
  numPosts: db.query(`SELECT COUNT(*) from post`),
  samplePosts: db.query(`SELECT * from post LIMIT 3`),
  numPostsMeta: db.query(`SELECT COUNT(*) from post_meta`),
  samplePostsMeta: db.query(`SELECT * from post_meta LIMIT 3`),
  numComments: db.query(`SELECT COUNT(*) from comment`),
  sampleComments: db.query(`SELECT * from comment LIMIT 3`),
  numAccessLogs: db.query(`SELECT COUNT(*) from access_log`),
  sampleAccessLogs: db.query(`SELECT * from access_log LIMIT 3`),
});

db.close();
console.log("Done.");
