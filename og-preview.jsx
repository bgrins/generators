/** @jsxImportSource https://esm.sh/preact */
import { render } from "npm:preact-render-to-string";
import prettier from "npm:prettier";

// TODO: intermittently description not showing up

const truncate = (input, len) =>
  input?.length > len ? `${input?.substring(0, len)}...` : input;

function Card(meta) {
  let host = meta?.host; // || twitter
  let title = meta?.og?.title; // || twitter
  let description = meta?.og?.description; // || twitter
  let src = (meta?.og?.image || [])[0]?.url; // || twitter
  // TODO: copy css from twitter cards
  console.log(meta);

  return (
    <div class="EmbeddedTweet">
      <div class="TwitterCardsGrid TwitterCard TwitterCard--animation">
        <div class="TwitterCardsGrid-col--12 TwitterCardsGrid-col--spacerBottom CardContent">
          <a
            class="js-openLink u-block TwitterCardsGrid-col--12 TwitterCard-container TwitterCard-container--clickable SummaryCard--large"
            href="https://www.cnn.com/2022/04/26/economy/inflation-recession-economy-deutsche-bank/index.html"
            rel="noopener"
            data-card-breakpoints="w400 w350 w300 w250 w200 w150 w100 w50 "
          >
            <div class="SummaryCard-image TwitterCardsGrid-col--12">
              <div class="tcu-imageContainer tcu-imageAspect--2to1">
                <div
                  class="tcu-imageWrapper"
                  style='opacity: 1; background-image: url("https://pbs.twimg.com/card_img/1519028940576223233/iTU-B976?format=jpg&amp;name=600x314"); background-size: cover;'
                  data-style="background-image: url(https://pbs.twimg.com/card_img/1519028940576223233/iTU-B976?format=jpg&amp;name=600x314); background-size: cover;"
                >
                  <img class="u-block" alt="" src={src}></img>
                </div>
              </div>
            </div>
            <div class="SummaryCard-contentContainer TwitterCardsGrid-col--12">
              <div class="SummaryCard-content TwitterCardsGrid-ltr">
                <h2
                  class="TwitterCard-title js-cardClick tcu-textEllipse--multiline"
                  dir="ltr"
                >
                  {title}
                </h2>

                <p
                  class="tcu-resetMargin u-block TwitterCardsGrid-col--spacerTop tcu-textEllipse--multiline"
                  dir="ltr"
                >
                  {truncate(description, 125)}
                </p>

                <span
                  class="u-block TwitterCardsGrid-col--spacerTop SummaryCard-destination"
                  dir="ltr"
                >
                  {host}
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

function App(meta) {
  return (
    <html lang="en" dir="ltr" class="no-js">
      <head>
        <meta charset="utf-8"></meta>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        ></meta>
        <link rel="stylesheet" href="./og-preview-style.css"></link>
        <title>Preview</title>
      </head>
      <body>
        <Card {...meta}></Card>
      </body>
    </html>
  );
}
export function previewResponse(meta) {
  const html = prettier.format(
    `<!DOCTYPE html>${render(<App {...meta}></App>)}`,
    { parser: "html" }
  );
  return html;
}

/*

  let metaTags = <>
    <title>Mozilla’s vision for the evolution of the Web</title>
    <meta name="description" content="The Web is an enormous asset and Mozilla is committed to protecting it and making it better. Powerful economic and technological forces have combined to make the Web the way it is today. Making it better won’t be easy and we can’t do it alone.">

    <meta property="og:url" content="https://webvision.mozilla.org/"></meta>
    <meta property="og:type" content="website"></meta>
    <meta property="og:title" content="Mozilla’s vision for the evolution of the Web"></meta>
    <meta property="og:description" content="The Web is an enormous asset and Mozilla is committed to protecting it and making it better. Powerful economic and technological forces have combined to make the Web the way it is today. Making it better won’t be easy and we can’t do it alone."></meta>
    <meta property="og:image" content="https://webvision.mozilla.org/bg.jpg"></meta>

    <meta name="twitter:card" content="summary_large_image"></meta>
    <meta property="twitter:domain" content="webvision.mozilla.org"></meta>
    <meta property="twitter:url" content="https://webvision.mozilla.org/"></meta>
    <meta name="twitter:title" content="Mozilla’s vision for the evolution of the Web"></meta>
    <meta name="twitter:description" content="The Web is an enormous asset and Mozilla is committed to protecting it and making it better. Powerful economic and technological forces have combined to make the Web the way it is today. Making it better won’t be easy and we can’t do it alone."></meta>
    <meta name="twitter:image" content="https://webvision.mozilla.org/bg.jpg"></meta>
    </>;
*/

/*


<!-- HTML Meta Tags -->
<title>Mozilla’s vision for the evolution of the Web</title>
<meta name="description" content="The Web is an enormous asset and Mozilla is committed to protecting it and making it better. Powerful economic and technological forces have combined to make the Web the way it is today. Making it better won’t be easy and we can’t do it alone.">

<!-- Facebook Meta Tags -->
<meta property="og:url" content="http://webvision.mozilla.org/">
<meta property="og:type" content="website">
<meta property="og:title" content="Mozilla’s vision for the evolution of the Web">
<meta property="og:description" content="The Web is an enormous asset and Mozilla is committed to protecting it and making it better. Powerful economic and technological forces have combined to make the Web the way it is today. Making it better won’t be easy and we can’t do it alone.">
<meta property="og:image" content="https://webvision.mozilla.org/bg.jpg">

<!-- Twitter Meta Tags -->
<meta name="twitter:card" content="summary_large_image">
<meta property="twitter:domain" content="webvision.mozilla.org">
<meta property="twitter:url" content="http://webvision.mozilla.org/">
<meta name="twitter:title" content="Mozilla’s vision for the evolution of the Web">
<meta name="twitter:description" content="The Web is an enormous asset and Mozilla is committed to protecting it and making it better. Powerful economic and technological forces have combined to make the Web the way it is today. Making it better won’t be easy and we can’t do it alone.">
<meta name="twitter:image" content="https://webvision.mozilla.org/bg.jpg">


*/

/*
<div class="TwitterCardsGrid TwitterCard TwitterCard--animation">
  <div class="TwitterCardsGrid-col--12 TwitterCardsGrid-col--spacerBottom CardContent">
    <a class="js-openLink u-block TwitterCardsGrid-col--12 TwitterCard-container TwitterCard-container--clickable SummaryCard--large" href="https://www.cnn.com/2022/04/26/economy/inflation-recession-economy-deutsche-bank/index.html" rel="noopener" data-card-breakpoints="w400 w350 w300 w250 w200 w150 w100 w50 ">
  <div class="SummaryCard-image TwitterCardsGrid-col--12">
    <div class="tcu-imageContainer tcu-imageAspect--2to1">
  <div class="tcu-imageWrapper" style="opacity: 1; background-image: url(&quot;https://pbs.twimg.com/card_img/1519028940576223233/iTU-B976?format=jpg&amp;name=600x314&quot;); background-size: cover;" data-style="background-image: url(https://pbs.twimg.com/card_img/1519028940576223233/iTU-B976?format=jpg&amp;name=600x314); background-size: cover;">
    <img class="u-block" data-src="https://pbs.twimg.com/card_img/1519028940576223233/iTU-B976?format=jpg&amp;name=600x314" alt="" src="https://pbs.twimg.com/card_img/1519028940576223233/iTU-B976?format=jpg&amp;name=600x314">
  </div>
</div>

  </div>
  <div class="SummaryCard-contentContainer TwitterCardsGrid-col--12">
    <div class="SummaryCard-content TwitterCardsGrid-ltr">
  
  <h2 class="TwitterCard-title js-cardClick tcu-textEllipse--multiline" dir="ltr">A major recession is coming, Deutsche Bank warns</h2>

  <p class="tcu-resetMargin u-block TwitterCardsGrid-col--spacerTop tcu-textEllipse--multiline" dir="ltr">Deutsche Bank raised eyebrows earlier this month by becoming the first major bank to forecast a US recession, albeit a "mild...</p>

  <span class="u-block TwitterCardsGrid-col--spacerTop SummaryCard-destination" dir="ltr">cnn.com</span>

</div>

  </div>
</a>

  </div>


</div>
*/

/*

    <div class="EmbeddedTweet">
      <a
        class="js-openLink u-block TwitterCardsGrid-col--12 TwitterCard-container TwitterCard-container--clickable SummaryCard--large"
        href="http://blog.mozilla.com"
        rel="noopener"
        data-card-breakpoints="w400 w350 w300 w250 w200 w150 w100 w50 "
      >
        <div class="SummaryCard-image TwitterCardsGrid-col--12">
          <div class="tcu-imageContainer tcu-imageAspect--2to1">
            <div
              class="tcu-imageWrapper"
              style='opacity: 1; background-image: url("https://pbs.twimg.com/card_img/1517599164753858560/ByCiuGcR?format=jpg&amp;name=600x314"); background-size: cover;'
              data-style="background-image: url(https://pbs.twimg.com/card_img/1517599164753858560/ByCiuGcR?format=jpg&amp;name=600x314); background-size: cover;"
            >
              <img
                width="600"
                height="314"
                class="u-block"
                alt=""
                src={src}
              ></img>
            </div>
          </div>
        </div>
        <div class="SummaryCard-contentContainer TwitterCardsGrid-col--12">
          <div class="SummaryCard-content TwitterCardsGrid-ltr">
            <h2
              class="TwitterCard-title js-cardClick tcu-textEllipse--multiline"
              dir="ltr"
            >
              {title}
            </h2>

            <p
              class="tcu-resetMargin u-block TwitterCardsGrid-col--spacerTop tcu-textEllipse--multiline"
              dir="ltr"
            >
              {description}
            </p>

            <span
              class="u-block TwitterCardsGrid-col--spacerTop SummaryCard-destination"
              dir="ltr"
            >
              {host}
            </span>
          </div>
        </div>
      </a>
    </div>
*/
