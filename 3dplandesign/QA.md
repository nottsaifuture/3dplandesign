# Website QA — 15 September 2026

## Completed

- Local HTTP server run; actual pages opened in the Codex browser.
- All 11 marketing/project/legal/error pages inspected in the browser.
- Responsive DOM checks at 320, 375, 390, 430, 768, 1024 and 1280 pixels: 77 page/width combinations, no horizontal overflow, one H1 per marketing page, no broken loaded preview images.
- Desktop visual checks of all page types; mobile visual checks of homepage, form, pricing and viewer.
- Main navigation menu opened and closed with Escape at phone width.
- Portfolio Developments filter produced the empty state, then Residential restored the featured project.
- Quote form blocked missing required fields, selected the package from the URL and generated the download-ready message for a completed test brief. No enquiry was transmitted.
- 268 static local references checked: no missing files. JavaScript syntax checks passed.
- Embedded 3D viewer reached its ready state on desktop and phone-width project pages.
- Ground-floor switching and standalone Dimensions toggle checked; room labels displayed approximate model sizes such as Lounge 3.80 m × 3.35 m.
- First-floor and bathroom views inspected for furniture/landing/door layout; first-person main-bedroom entry rendered successfully.
- Original viewer rebuilt; its existing 14 automated tests passed. These cover front/porch/cellar doors, floor/explode restoration, main and cellar stairs, ground-floor routes, both bedrooms/bathroom landing routes, garden steps, covered passage and all starting positions.
- No captured browser console errors during the page, form and embedded viewer checks.

## Practical limits

Viewport testing is not physical iOS/Android testing. Touch joystick feel, touch-look behaviour, browser safe-area changes and extended roof-flicker checks still need a real-device review. The existing model geometry was reused; the model was not re-surveyed or exhaustively compared against every reference photo. Its dimensions are approximate.

The WebGL failure and slow-load paths are implemented but GPU failure was not forcibly simulated. Python's local server does not apply Cloudflare `_headers`/`_redirects` or automatic branded 404 routing; verify these after deployment.

No public deployment, custom domain, enquiry backend, live uploads or reviewed legal documents are configured. The local brief download is explicitly labelled as unsent. The Three.js build reports a bundle-size advisory; the bundle is deferred until the visitor launches the viewer.
