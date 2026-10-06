# TIFF URL Viewer – Marketplace Documentation

Widget version 1.1.0 · Mendix Studio Pro 10.24.17 · Web

## Industry

All industries (cross-industry).

## Categories

- Widgets
- User Interface / Display

## Component tagline

Show every page of a TIFF file from a URL in the browser, fitted to the box, with zoom buttons.

(94 characters)

## About

Browsers cannot show TIFF images in an image widget. TIFF URL Viewer loads a TIFF file from a URL, decodes it in the browser with the utif2 library and shows every page of the file below each other. The pages are scaled to fit the box, and optional Zoom in, Zoom out and Reset buttons let users look at the details.

The URL comes from a String attribute, for example the URL of a Mendix file document (`/file?guid=…`) or a file on another server that allows CORS. The width, height and the zoom buttons also come from attributes, so they can change at run time.

Version 1.1.0 is rebuilt for Mendix Studio Pro 10.24.17. An empty width or height now uses 600px, numbers without a unit are read as pixels, the page fits the box without scroll bars, the box never gets wider than a phone screen, files on other servers with CORS load, and clear error messages replace the empty box of 1.0.0. The package is about 96 KB (1.0.0: about 1.6 MB per bundle).

The source code is on GitHub: https://github.com/bharathidas/TIFF-URL-Viewer

## Typical usage scenario

TIFF URL Viewer is for apps that store documents or images as TIFF files and need to show them on a page without a download or a conversion on the server.

- Scanned documents such as delivery notes, invoices, contracts and forms.
- Faxes, which are usually stored as multi-page TIFF files.
- Technical drawings, plans and medical or archive images in TIFF format.
- Previewing an uploaded TIFF file before it is processed.

## Features and limitations

**Features**

- Shows every page of single and multi-page TIFF files; reduced-resolution thumbnails inside the file are skipped.
- Supports the common TIFF compressions: none, LZW, PackBits, Deflate, CCITT fax G3/G4 and JPEG.
- Loads Mendix file documents (`/file?guid=…`, with the session of the user) and files on other servers that allow CORS.
- Pages are fitted to the box and fitted again when the box changes size.
- Optional Zoom in, Zoom out and Reset buttons (1.2x per step, up to 5x); the toolbar stays visible while the zoomed page scrolls.
- Width and height in any CSS unit (px, %, rem, vh); a number without a unit is read as pixels; default 600 x 600 px.
- Clear messages while loading and when the file is not a TIFF image or cannot be loaded (with the HTTP status).
- Class and style from Studio Pro, and CSS classes for the toolbar, buttons, pages and messages.
- Offline capable.

**Limitations**

- Web only; not available for native mobile.
- The whole file is loaded and decoded in the browser, so very large files take time and memory.
- No page navigation, rotation or print button; pages are shown below each other.
- Files on another server need CORS; the widget cannot load a file the browser is not allowed to read.
- Width, height and zoom controls are attributes, not fixed values in the widget properties.
- Studio Pro design mode shows a placeholder, because the URL is only known at run time.

## Dependencies

- Mendix Studio Pro 10.24.17 or a later 10.24 version.
- No other modules or libraries are needed. To build a file document URL you can use getGUID (Community Commons) or GetGuid (Nanoflow Commons).

## Installation

1. Download `mendix.TiffURLViewer.mpk` from the Marketplace (or from the GitHub release Version1.1.0).
2. Copy it into the `widgets` folder of your app (App > Show App Directory in Explorer).
3. In Studio Pro, press F4 (App > Synchronize App Directory).
4. The widget appears in the Toolbox as **TIFF URL Viewer** (category Display).

**Upgrading from 1.0.0:** replace the file in the `widgets` folder and press F4. If Studio Pro reports that the widget definition changed, right-click the error and choose **Update all widgets**. Your settings are kept. If the running app still shows the old widget, choose App > Clean Deployment Directory and run the app again. If a Width or Height attribute is empty, the viewer is now 600px instead of the full page width; put `100%` in the Width attribute to keep the old width.

## Configuration

1. Add a String attribute for the URL to an entity, for example `TiffUrl` on a non-persistent `TiffViewerHelper`.
2. Fill the attribute in the microflow or nanoflow that opens the page: for a file document `'/file?guid=' + $Guid`, or the full URL of a file on another server.
3. Put a data view with that object on the page.
4. Drag **TIFF URL Viewer** into the data view and select the **TIFF URL** attribute.
5. Optionally select attributes for **Width** and **Height** (String) and **Show zoom controls** (Boolean).

Recommended settings:

- Document preview on a detail page: width 100%, height 700px, zoom controls true.
- Small preview in a list or card: width 240, height 320, zoom controls false.
- Full-screen review in a pop-up: width 100%, height 80vh, zoom controls true.
- Phone: width 100%, height 70vh.

The user needs read access to the file document; otherwise the widget shows the HTTP status (401 or 404).

Styling: the outer element has the class `widget-tiffurlviewer`, the toolbar `widget-tiffurlviewer-toolbar`, each button `widget-tiffurlviewer-button`, each page `widget-tiffurlviewer-page` and error messages `widget-tiffurlviewer-error`.

## Known bugs

- None known in version 1.1.0.
- Small images are enlarged to fit the box.
- Report bugs on GitHub: https://github.com/bharathidas/TIFF-URL-Viewer/issues

## FAQ

**Why does the widget show "The file is not a valid TIFF image."?**
The URL returns another file type, often a login or error page. Check that the URL points to a TIFF file and that the user may read it.

**Why does a file from another server not load?**
That server must allow CORS for the URL of your app (`Access-Control-Allow-Origin`). Without it the browser blocks the file and the widget shows a message about the URL and CORS.

**How do I show a TIFF file that is stored in my app?**
Set the attribute to `'/file?guid='` plus the GUID of the file document, for example with getGUID from Community Commons.

**Why is my viewer 600px wide after the upgrade?**
In 1.1.0 an empty Width uses 600px, as the description says. Put `100%` in the Width attribute to fill the page width.

**How do I hide the zoom buttons?**
Leave Show zoom controls empty or set the Boolean attribute to false.

**Does it work in older Mendix versions?**
Version 1.1.0 is built and tested for Studio Pro 10.24.17. Version 1.0.0 (GitHub release Version1.0.0) was made for Mendix 10.18.4.
