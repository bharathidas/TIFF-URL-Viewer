/**
 * This file was generated from TiffURLViewer.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { EditableValue } from "mendix";

export interface TiffURLViewerContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    ImageKey: EditableValue<string>;
    WidthKey?: EditableValue<string>;
    HeightKey?: EditableValue<string>;
    ZoomControlsKey?: EditableValue<boolean>;
}

export interface TiffURLViewerPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    renderMode?: "design" | "xray" | "structure";
    ImageKey: string;
    WidthKey: string;
    HeightKey: string;
    ZoomControlsKey: string;
}
