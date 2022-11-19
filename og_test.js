import { assertEquals } from "https://deno.land/std@0.165.0/testing/asserts.ts";
import { fixupURL, isFetchableURL } from "./og-parse.js";

Deno.test("url test", () => {
  const url = new URL("./foo.js", "https://deno.land/");
  assertEquals(url.href, "https://deno.land/foo.js");
});

Deno.test("isFetchableURL", () => {
  assertEquals(isFetchableURL("example.com"), false);
  assertEquals(isFetchableURL("http://example"), true); // Todo - this should probably check for existance of a valid TLD

  assertEquals(isFetchableURL("data:text/html,<body></body>"), true);
  assertEquals(isFetchableURL("http://example.com"), true);
  assertEquals(isFetchableURL("https://example.com"), true);
});

Deno.test("fixupURL", () => {
  assertEquals(
    fixupURL("https://example.com"),
    new URL("https://example.com/")
  );
  assertEquals(fixupURL("example.com"), new URL("https://example.com/"));
  assertEquals(fixupURL("http://example.com"), new URL("http://example.com/"));


  assertEquals(
    fixupURL("data:text/html,<body></body>"),
    new URL("data:text/html,<body></body>")
  );

  assertEquals(fixupURL("localhost"), new URL("http://localhost"));
  assertEquals(fixupURL("0.0.0.1"), new URL("http://0.0.0.1"));
  assertEquals(fixupURL("1"), new URL("http://0.0.0.1"));

  // There are edge cases with how these get handled. The URL constructor turns these in to valid IPs but
  // fixupURL doesn't match them so it adds the https:// prefix. This could be fixed.  
  assertEquals(fixupURL("1.2"), new URL("https://1.0.0.2"));
  assertEquals(fixupURL("1.2.3"), new URL("https://1.2.0.3"));
});
