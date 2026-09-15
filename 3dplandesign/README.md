# 3DPlanDesign

A static, responsive UK property-visualisation website for **3dplandesign.co.uk**. HTML, CSS and vanilla JavaScript; the Birley Street viewer is a locally built Three.js application. No framework, server, external fonts, analytics or public credentials are required.

## Pages

- `index.html`: service overview, real viewer preview, click-to-load demo, process and prices.
- `services.html`, `portfolio.html`, `pricing.html`, `developers.html`.
- `contact.html`: validated project brief with a local text-file download.
- `projects/birley-street/index.html`: case study, viewer, features and controls.
- `privacy.html`, `terms.html`, `cookies.html`: clearly labelled drafts requiring review.
- `404.html`: branded error page.

The public name is **Birley Street**. The house number is not used in the website’s project titles or copy. The legacy numbered project path has a redirect in `_redirects`.

## Structure

```text
assets/                 Favicon and genuine viewer screenshots
css/global.css          Shared design and responsive rules
js/main.js              Navigation, gallery, viewer loading, brief download
data/projects.js        Portfolio entries
projects/birley-street/
  index.html            Project presentation
  viewer/               Built viewer only (HTML and hashed assets)
_headers, _redirects     Cloudflare configuration
robots.txt, sitemap.xml  Search-engine metadata
```

## Local development

From this folder:

```sh
python3 -m http.server 5180 --bind 127.0.0.1
```

Open `http://127.0.0.1:5180/`. ES modules need HTTP; do not double-click the HTML file. No npm installation or build is needed for the business website. Edit the HTML/CSS/JS directly, then reload. Navigation/footer markup is intentionally static for reliable no-JavaScript access; apply shared markup changes to all pages.

## Birley Street integration

The existing viewer was retained and built locally. The source project remains separately in `50 Birley Street/birley-3d` beside this website folder. The website contains only its compiled distribution, not its source project or ZIP archives.

Changes in the viewer: public title changed to Birley Street, BS monogram, an approximate room-dimensions toggle based on existing room data, mobile title spacing, a startup failure message and a ready notification for the embedding page. The model geometry and collision system were retained.

The homepage and project page initially show a genuine screenshot. The Three.js bundle is requested only when a visitor launches the demo. A same-origin message reveals the frame when ready. The page checks for WebGL2 and offers a useful slow-loading message. Preview and project details remain available when 3D fails. A standalone link gives phone users more space.

To refresh this viewer after changing its separate source project:

1. Run `npm run build` in the viewer source folder.
2. Replace the contents of `projects/birley-street/viewer/` with that build’s `dist/` contents. Keep no source ZIPs or source maps in the website.
3. Verify the embed still sends `{type: 'birley-ready'}` to its parent using the same origin when ready.
4. Check the standalone view, embedded loading, floor views, dimensions and walkthrough before deploying.

## Add a portfolio project

1. Create `projects/your-project/viewer/` and copy your new viewer’s compiled files there. Use relative asset paths.
2. Copy `projects/birley-street/index.html` to `projects/your-project/index.html`. Both project folders are at the same depth, so shared `../../` paths still work. Replace the project name, title, description, canonical/OG URLs, facts, actual capabilities, viewer URLs and screenshot paths. Do not copy Birley Street facts into a different house.
3. Save a real compressed preview under `assets/images/your-project.webp`.
4. Add one object to `data/projects.js`:

```js
{
  slug: 'your-project',
  title: 'Your Project',
  category: 'residential', // or 'development'
  categoryLabel: 'Residential / Interactive 3D',
  summary: 'Use only verified project facts',
  thumbnail: 'assets/images/your-project.webp',
  alt: 'Describe what the real preview shows',
  url: 'projects/your-project/'
}
```

The gallery and project count update automatically. The homepage displays the first entry; reorder the array to change the featured project. The no-JavaScript gallery fallback is static HTML and should be updated manually if the flagship changes. Add the new project URL to `sitemap.xml`.

5. For the shared loader, make the new viewer post `{type: 'birley-ready'}` to its parent with `location.origin` after its first render, or adapt the message type in `js/main.js`. This existing protocol name is internal and not shown to customers. If the new viewer has a different startup contract, implement its ready signal before reusing the loader. Set `data-viewer-title` on the viewer shell to the new project’s accessible title.

## Quote form: current behaviour

The form validates required fields, creates a UTF-8 text file and downloads it on the visitor’s device. **Nothing is submitted to the business.** The form and status message say this explicitly; all input is kept only in the current page. The submit button remains disabled without JavaScript. Floor-plan uploads are visibly unavailable, rather than pretending to accept files.

Before taking enquiries, supply a real email address and connect a submission service. The submit listener in `js/main.js` is the integration point. For Cloudflare Pages Functions, add a `/functions/api/quote.js` endpoint and POST the form there. Validate on the server, handle failures and spam, keep secrets in Cloudflare environment settings, and show success only after a confirmed response. For uploads, add size/type limits and an agreed storage/retention policy. Update privacy wording to describe the actual service. Do not put credentials in browser JavaScript.

## Deploy to Cloudflare Pages through GitHub

Publish **this folder’s contents** as the root of a dedicated GitHub repository. The larger 3D Plan Project folder contains working material and should not be uploaded wholesale. No remote repository has been created or configured for this site yet.

1. Create the intended GitHub repository and push this local project’s `main` branch.
2. In Cloudflare, open **Workers & Pages**, create a Pages project and connect that repository.
3. Production branch: `main`. Framework preset: **None**. Build command: `exit 0`. Build output directory: `.`. Root directory: leave blank when this folder is the repository root. No environment variables are needed for the current static site.
4. Deploy and check the generated `pages.dev` URL, including project/viewer paths and a nonexistent page.
5. In the Pages project’s **Custom domains**, add `3dplandesign.co.uk`. An apex domain needs to be a Cloudflare zone in the same account; follow the nameserver/DNS setup shown there. Let certificate activation finish, then check HTTPS.
6. Add `www.3dplandesign.co.uk` if wanted and configure a Cloudflare redirect to the apex domain, preserving path and query string. Canonicals already target the apex. No DNS or domain changes have been made by this build.

If you instead keep this folder inside a repository, set the Pages root directory to `3dplandesign`, with output `.`.

Official references: [Static HTML](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/), [build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/), [custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/).

## Cache, performance and portability

`_headers` gives fingerprinted viewer assets long cache lifetimes. Preview images get a shorter cache; use a new filename when replacing an image to avoid stale copies. The preview is WebP; the original PNG is retained for reuse. Fonts are local system fonts. All site navigation, CSS and JavaScript use relative URLs; `404.html` uses root-relative URLs so missing nested paths recover correctly. SEO URLs intentionally use the final public domain.

Three.js emits an advisory about its bundle size. The main viewer asset is approximately 145 KB gzipped, and does not load until clicked. Compress future images, keep textures modest and avoid importing full model bundles on initial page load. Use GLB compression only if future models need it.

A future `view.3dplandesign.co.uk` deployment can host the compiled viewers separately. This requires configuring that domain, changing viewer URLs, and explicitly allowlisting its origin in the ready-message handler. It is not configured now.

## Launch checklist

- Supply the enquiry email, legal business identity and optional telephone number.
- Connect and test real enquiry delivery and any uploads.
- Review privacy, terms and cookie wording; all three are currently drafts.
- Confirm service prices, tax treatment, delivery, revision and hosting terms.
- Connect the desired GitHub repository, Cloudflare project and domain.
- Real iPhone/iPad/Android touch testing remains recommended; browser viewport checks do not emulate physical devices.

A text wordmark, favicon and genuine project preview are already included. No invented testimonials, customers, performance statistics or certification claims were added. See `QA.md` for the performed checks.
