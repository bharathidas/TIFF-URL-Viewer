import { ReactElement, createElement } from "react";

import { TiffURLViewerContainerProps } from "../typings/TiffURLViewerProps";
import { TiffURLViewerInput } from "./components/TiffURLViewerInput";
import "./ui/TiffURLViewer.css";

const DEFAULT_SIZE = "600px";

// "600" is read as "600px"; anything else is passed to CSS as it is. Empty values use the default size.
export function toCssSize(value: string | undefined): string {
    const size = value?.trim();
    if (!size) {
        return DEFAULT_SIZE;
    }
    return /^\d+(\.\d+)?$/.test(size) ? `${size}px` : size;
}

export function TiffURLViewer(props: TiffURLViewerContainerProps): ReactElement {
    const { ImageKey, WidthKey, HeightKey, ZoomControlsKey } = props;

    return (
        <TiffURLViewerInput
            className={props.class}
            style={props.style}
            tiffvalueURI={ImageKey.value?.trim() ?? ""}
            widthValue={toCssSize(WidthKey?.value)}
            heightValue={toCssSize(HeightKey?.value)}
            showZoomControls={ZoomControlsKey?.value === true}
        />
    );
}
