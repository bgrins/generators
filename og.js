import { existsSync } from "https://deno.land/std/fs/exists.ts";
import { serve } from "https://deno.land/std@0.120.0/http/server.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";
// import { parseFromDocument } from "./og-parse.js";
import { previewResponse } from "./og-preview.jsx";
import { initialize, generate_fixtures, addRequest } from "./og-db.js";

let corsHeaders = {};

// deno run -A og-db.js --file tmp.db --num_sites 1
const args = parse(Deno.args, {
  default: {
    file: "og-db.db",
    serve: false,
    port: 8080,
    init: false,
    fetch: false,
    cors: true,
    "generate-fixture-data": false,
    "num-fixture-pages": 20,
  },
});

const {
  file,
  init,
  fetch,
  cors,
  port,
  serve: server,
  "generate-fixture-data": generate_fixture_data,
  "num-fixture-pages": num_fixture_pages,
} = args;

console.log(args);
if (!server && !init && !generate_fixture_data && !fetch) {
  console.log("no action specified. try with --server");
  Deno.exit();
}

let db;
if (init) {
  console.log("initializing db");
  if (existsSync(file)) {
    Deno.removeSync(file);
  }
  db = new DB(file, { verbose: true });
  initialize({ db });
}

if (!existsSync(file)) {
  throw new Error(`Database ${file} does not exist`);
}

if (!db) {
  db = new DB(file, { verbose: true });
}

if (generate_fixture_data) {
  console.log("Seeding data");
  await generate_fixtures({ db, num_fixture_pages });
}

if (fetch) {
  console.log(`fetching ${fetch}`);
  let response = await addRequest({ db, url: fetch, wait: true });
  console.log(response);
  Deno.exit();
}

if (server) {
  console.log(`Hosting web server for ${file} on port ${port}`);
  if (cors) {
    corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey",
    };
  }
  await serve(handleRequest, {
    port,
  });
}

export async function handleRequest(req) {
  // Allow CORS for browser
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // TODO:
  // /preview/http://webvision.mozilla.com: HTML preview
  // /metadata/http://webvision.mozilla.com
  // /health/: print metrics
  // /: Print process info -> eventually splash page
  const requestURL = new URL(req.url);
  const { pathname } = requestURL;

  if (pathname.startsWith("/style.css")) {
    // Read the style.css file from the file system.
    const file = await Deno.readFile("./static/style.css");
    // Respond to the request with the style.css file.
    return new Response(file, {
      headers: {
        "content-type": "text/css",
      },
    });
  }

  try {
    if (pathname == "/") {
      return new Response(JSON.stringify({ todo: "implement" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
    if (pathname == "/health/" || pathname == "/health") {
      return new Response(JSON.stringify({ todo: "implement" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
    if (pathname == "/results/" || pathname == "/results") {
      // Todo - take an api_lookup_id, morph the result into an object, then call previewResponse
      let html = previewResponse({
        og: {
          description:
            "The Web is an enormous asset and Mozilla is committed to protecting it and making it better. Powerful economic and technological forces have combined to make the Web the way it is today. Making it better won’t be easy and we can’t do it alone.",
          image: [
            {
              url: "https://webvision.mozilla.org/bg.jpg",
            },
          ],
          title: "Mozilla’s vision for the evolution of the Web",
        },
      });

      return new Response(html, {
        headers: { ...corsHeaders, "Content-Type": "text/html" },
        status: 200,
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }

  return new Response(JSON.stringify({ error: "Invalid route" }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 404,
  });
}
