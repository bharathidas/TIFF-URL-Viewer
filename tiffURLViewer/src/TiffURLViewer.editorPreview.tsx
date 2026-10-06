import { ReactElement, createElement } from "react";
import classNames from "classnames";

import { TiffURLViewerPreviewProps } from "../typings/TiffURLViewerProps";

// Design mode cannot load the file (the URL is only known at run time), so it shows a placeholder.
export function preview(props: TiffURLViewerPreviewProps): ReactElement {
    return (
        <div className={classNames("widget-tiffurlviewer", props.class)} style={props.styleObject}>
            {props.ZoomControlsKey ? (
                <div className="widget-tiffurlviewer-toolbar">
                    <span>Zoom in · Zoom out · Reset</span>
                </div>
            ) : null}
            <div className="widget-tiffurlviewer-preview">
                TIFF image from {props.ImageKey ? `[${props.ImageKey}]` : "(no attribute selected)"}
            </div>
        </div>
    );
}

export function getPreviewCss(): string {
    return require("./ui/TiffURLViewer.css");
}
