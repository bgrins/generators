
Sratchpad for generating test data and pages

Faker example
```
deno run --allow-read --allow-write blog-db.js --seed=1 --file=locale-en-seed1.db
deno run --allow-read --allow-write blog-db.js --seed=1 --locale=fr --file=locale-fr-seed1.db
```

Opengraph example
```
deno run -A og-db.js
datasette -p 8080 og-db.db
```