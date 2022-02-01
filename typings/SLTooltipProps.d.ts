/**
 * This file was generated from SLTooltip.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { ComponentType, CSSProperties, ReactNode } from "react";

export type TriggerModeEnum = "hover" | "leftClick";

export type PlacementEnum = "top" | "topStart" | "topEnd" | "bottom" | "bottomStart" | "bottomEnd" | "right" | "rightStart" | "rightEnd" | "left" | "leftStart" | "leftEnd";

export interface SLTooltipContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    triggerMode: TriggerModeEnum;
    offsetDistance: number;
    autoClose: boolean;
    showArrow: boolean;
    placement: PlacementEnum;
    tooltipTriggerContent: ReactNode;
    tooltipContent: ReactNode;
}

export interface SLTooltipPreviewProps {
    className: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    triggerMode: TriggerModeEnum;
    offsetDistance: number | null;
    autoClose: boolean;
    showArrow: boolean;
    placement: PlacementEnum;
    tooltipTriggerContent: { widgetCount: number; renderer: ComponentType<{ caption?: string }> };
    tooltipContent: { widgetCount: number; renderer: ComponentType<{ caption?: string }> };
}
