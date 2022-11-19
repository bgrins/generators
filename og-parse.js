import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
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
  const { og_response_fields } = options;
  const og_response_fields_set = new Set(og_response_fields);
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

    if (!og_response_fields_set.has(property)) {
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

export function parseFromHTML(html, options) {
  return parseFromDocument(
    new DOMParser().parseFromString(html, "text/html"),
    options
  );
}

export async function fetchAndParse(url, options) {
  url = fixupURL(url);
  let resp = await fetch(url);
  let text = await resp.text();
  console.log(`Recieved ${text.length} characters from ${url}`);
  // Todo handle error vs just empty meta
  let r = parseFromHTML(text, options);

  console.log(r);

  // meta.host = url.hostname;
  return {
    final_url: resp.url,
    response_length: text.length,
    ...r,
  };
}

export function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

export function fixupURL(url) {
  if (!isValidHttpUrl(url)) {
    url = `https://${url}`;
    if (!isValidHttpUrl(url)) {
      return null;
    }
  }
  return new URL(url);
}
