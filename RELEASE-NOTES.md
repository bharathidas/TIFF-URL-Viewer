TIFF URL Viewer 1.1.0 for **Mendix Studio Pro 10.24.17** (web).

## Compatibility
- Mendix Studio Pro 10.24.17 or a later 10.24 version, web profiles only.
- Built with `@mendix/pluggable-widgets-tools` 10.16.0 and React 18, with utif2 4.1.0.
- The package is about 96 KB. 1.0.0 was about 1.6 MB per bundle because it contained the whole Feather icon set.
- The widget ID (`mendix.tiffurlviewer.TiffURLViewer`) and property keys are the same as in 1.0.0, so existing pages keep their settings.

## Changes and fixes
- An empty Width or Height attribute now uses 600px, as the description says. In 1.0.0 the box filled the page width and grew to the height of the image.
- A number without a unit (for example `400`) is read as pixels. In 1.0.0 it was ignored.
- The page fits the box: the padding and the zoom toolbar are taken into account, so the fitted page no longer shows scroll bars. The fit is calculated again when the box changes size, for example with a percentage width.
- On a phone the box is never wider than the screen.
- TIFF files from another server work when that server allows CORS. 1.0.0 always sent cookies, which browsers block with `Access-Control-Allow-Origin: *`. Cookies are still sent to your own app, so Mendix file documents keep working.
- Clear error messages: "The file is not a valid TIFF image." for other files, and the HTTP status (for example 404) when the file cannot be loaded. In 1.0.0 a non-TIFF file showed an empty box.
- Clearing the URL removes the old image. A new URL no longer shows the previous image while it loads.
- Reduced-resolution thumbnails stored in a TIFF are no longer shown as an extra page.
- Only the guid is kept from Mendix file URLs (`/file?guid=...`); other URLs are fetched unchanged. In 1.0.0 every URL with a `guid` parameter lost its other parameters.
- The toolbar stays visible when a zoomed page is scrolled sideways. Buttons have accessible labels; Zoom in is disabled at the maximum zoom (5x).
- The class and style set in Studio Pro are applied.
- No messages in the browser console.
- Studio Pro design mode shows a placeholder instead of trying to load the attribute name as a URL. Clearer captions and descriptions.

Tested in a Mendix 10.24.17 app (27 automated checks; 1.0.0 fails 13 of them): single and multi-page files, thumbnails, the default and custom sizes (px, %, rem), fitting, zoom in/out/reset, the toolbar while scrolling, a non-TIFF file, a missing file, clearing the URL, a file on another server with CORS, a 2400x3200 page, class and style, and a phone-sized window.

## Install
1. Download `mendix.TiffURLViewer.mpk` below.
2. Copy it into the `widgets` folder of your app and press **F4** (App > Synchronize App Directory).
3. Place **TIFF URL Viewer** in a data view and select the String attribute with the URL of the TIFF file.

## Upgrade from 1.0.0
1. Replace the old `mendix.TiffURLViewer.mpk` in the `widgets` folder and press **F4**.
2. If Studio Pro reports that the widget definition changed, right-click the error and choose **Update all widgets**. Your settings are kept.
3. If the running app still shows the old widget, stop it, choose **App > Clean Deployment Directory** and run it again.

Check after upgrading: if a Width or Height attribute is empty, the viewer is now 600px instead of the full width; put `100%` in the attribute to keep the old width.
