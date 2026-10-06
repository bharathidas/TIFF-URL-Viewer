import { CSSProperties, ReactElement, createElement, useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import * as UTIF from "utif2";

export interface TiffURLViewerProps {
    tiffvalueURI: string;
    widthValue: string;
    heightValue: string;
    showZoomControls: boolean;
    className?: string;
    style?: CSSProperties;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 5;
const ZOOM_STEP = 1.2;

// Feather icons (MIT), inlined so the widget does not ship the whole icon set.
const ICONS: Record<string, ReactElement> = {
    "zoom-in": (
        <g>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
        </g>
    ),
    "zoom-out": (
        <g>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
        </g>
    ),
    "rotate-ccw": (
        <g>
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </g>
    )
};

interface IconButtonProps {
    icon: string;
    onClick: () => void;
    disabled?: boolean;
    title: string;
}

function IconButton({ icon, onClick, disabled, title }: IconButtonProps): ReactElement {
    return (
        <button
            type="button"
            className="widget-tiffurlviewer-button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            aria-label={title}
        >
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                {ICONS[icon]}
            </svg>
        </button>
    );
}

// Mendix file URLs carry extra parameters (such as changedDate); only the guid identifies the file.
function normalizeUrl(url: string): string {
    try {
        const parsed = new URL(url, window.location.href);
        const guid = parsed.searchParams.get("guid");
        if (guid && /\/file$/.test(parsed.pathname)) {
            return `${parsed.origin}${parsed.pathname}?guid=${encodeURIComponent(guid)}`;
        }
    } catch {
        // Not a URL that can be parsed; fetch it as it is.
    }
    return url;
}

// Reduced-resolution images (thumbnails) are skipped when the file also has full-size pages.
function isThumbnail(ifd: UTIF.IFD): boolean {
    const subfileType = ifd.t254 as number[] | undefined;
    return Array.isArray(subfileType) && subfileType[0] % 2 === 1;
}

function renderPages(buffer: ArrayBuffer): HTMLCanvasElement[] {
    let ifds: UTIF.IFD[];
    try {
        ifds = UTIF.decode(buffer);
    } catch {
        throw new Error("The file is not a valid TIFF image.");
    }
    const pages = ifds.some(ifd => !isThumbnail(ifd)) ? ifds.filter(ifd => !isThumbnail(ifd)) : ifds;

    const canvases: HTMLCanvasElement[] = [];
    for (const ifd of pages) {
        try {
            UTIF.decodeImage(buffer, ifd);
        } catch {
            continue;
        }
        if (!ifd.width || !ifd.height) {
            continue;
        }
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            continue;
        }
        canvas.width = ifd.width;
        canvas.height = ifd.height;
        canvas.className = "widget-tiffurlviewer-page";
        const imageData = ctx.createImageData(ifd.width, ifd.height);
        imageData.data.set(UTIF.toRGBA8(ifd));
        ctx.putImageData(imageData, 0, 0);
        canvases.push(canvas);
    }
    if (canvases.length === 0) {
        throw new Error("The file is not a valid TIFF image.");
    }
    return canvases;
}

export function TiffURLViewerInput(props: TiffURLViewerProps): ReactElement {
    const { tiffvalueURI, widthValue, heightValue, showZoomControls } = props;

    const containerRef = useRef<HTMLDivElement>(null);
    const toolbarRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [pageCount, setPageCount] = useState(0);
    const [zoom, setZoom] = useState(MIN_ZOOM);
    const [baseScale, setBaseScale] = useState(1);

    // Scale that makes the widest and tallest page fit in the space below the toolbar.
    const updateFitScale = useCallback(() => {
        const container = containerRef.current;
        const content = contentRef.current;
        if (!container || !content) {
            return;
        }
        const canvases = Array.from(content.querySelectorAll("canvas"));
        if (canvases.length === 0) {
            return;
        }
        const maxWidth = Math.max(...canvases.map(canvas => canvas.width));
        const maxHeight = Math.max(...canvases.map(canvas => canvas.height));
        const contentStyle = window.getComputedStyle(content);
        const paddingX = parseFloat(contentStyle.paddingLeft) + parseFloat(contentStyle.paddingRight);
        const paddingY = parseFloat(contentStyle.paddingTop) + parseFloat(contentStyle.paddingBottom);
        const availableWidth = container.clientWidth - paddingX;
        const availableHeight = container.clientHeight - (toolbarRef.current?.offsetHeight ?? 0) - paddingY;
        const fitScale = Math.min(availableWidth / maxWidth, availableHeight / maxHeight);
        // A hidden widget (for example in a closed tab) has no size yet; keep the natural size.
        setBaseScale(fitScale > 0 && isFinite(fitScale) ? fitScale : 1);
    }, []);

    useEffect(() => {
        const content = contentRef.current;
        if (content) {
            content.innerHTML = "";
        }
        setError("");
        setPageCount(0);
        setZoom(MIN_ZOOM);
        if (!tiffvalueURI) {
            setLoading(false);
            return;
        }

        const controller = new AbortController();
        setLoading(true);

        (async () => {
            try {
                const response = await fetch(normalizeUrl(tiffvalueURI), {
                    credentials: "same-origin",
                    cache: "no-store",
                    signal: controller.signal
                });
                if (!response.ok) {
                    throw new Error(`The TIFF file could not be loaded (HTTP ${response.status}).`);
                }
                const buffer = await response.arrayBuffer();
                if (controller.signal.aborted || !contentRef.current) {
                    return;
                }
                const canvases = renderPages(buffer);
                contentRef.current.replaceChildren(...canvases);
                setPageCount(canvases.length);
                updateFitScale();
            } catch (e) {
                if (controller.signal.aborted) {
                    return;
                }
                setError(
                    e instanceof TypeError
                        ? "The TIFF file could not be loaded. Check the URL and, for another server, its CORS settings."
                        : (e as Error).message || "The TIFF file could not be shown."
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        })();

        return () => controller.abort();
    }, [tiffvalueURI, updateFitScale]);

    // Fit again when the widget is resized, for example with a percentage width.
    useEffect(() => {
        const container = containerRef.current;
        if (!container || typeof ResizeObserver === "undefined") {
            return;
        }
        const observer = new ResizeObserver(() => updateFitScale());
        observer.observe(container);
        return () => observer.disconnect();
    }, [updateFitScale, showZoomControls]);

    useEffect(() => {
        const content = contentRef.current;
        if (!content) {
            return;
        }
        const scale = baseScale * zoom;
        content.querySelectorAll("canvas").forEach(canvas => {
            canvas.style.width = `${canvas.width * scale}px`;
            canvas.style.height = `${canvas.height * scale}px`;
        });
    }, [zoom, baseScale, pageCount]);

    return (
        <div
            ref={containerRef}
            className={classNames("widget-tiffurlviewer", props.className)}
            style={{ width: widthValue, height: heightValue, ...props.style }}
        >
            {showZoomControls && (
                <div ref={toolbarRef} className="widget-tiffurlviewer-toolbar">
                    <IconButton
                        icon="zoom-in"
                        title="Zoom in"
                        onClick={() => setZoom(z => Math.min(MAX_ZOOM, z * ZOOM_STEP))}
                        disabled={pageCount === 0 || zoom >= MAX_ZOOM}
                    />
                    <IconButton
                        icon="zoom-out"
                        title="Zoom out"
                        onClick={() => setZoom(z => Math.max(MIN_ZOOM, z / ZOOM_STEP))}
                        disabled={pageCount === 0 || zoom <= MIN_ZOOM}
                    />
                    <IconButton
                        icon="rotate-ccw"
                        title="Reset"
                        onClick={() => setZoom(MIN_ZOOM)}
                        disabled={pageCount === 0 || zoom === MIN_ZOOM}
                    />
                </div>
            )}
            {loading && <div className="widget-tiffurlviewer-message">Loading TIFF...</div>}
            {error && (
                <div className="widget-tiffurlviewer-message widget-tiffurlviewer-error" role="alert">
                    {error}
                </div>
            )}
            <div ref={contentRef} className="widget-tiffurlviewer-content" />
        </div>
    );
}
