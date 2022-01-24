import { ReactElement, createElement } from "react";
import { SLTooltipPreviewProps } from "typings/SLTooltipProps";
import { Tooltip } from "./components/Tooltip";

let tooltipIndex = 0;

export function preview(props: SLTooltipPreviewProps): ReactElement {
    return (
        <Tooltip
            {...props}
            name={`popover-${tooltipIndex++}`}
            tooltipContent={
                <props.tooltipContent.renderer>
                    <div />
                </props.tooltipContent.renderer>
            }
            tooltipTriggerContent={
                <props.tooltipContent.renderer>
                    <div />
                </props.tooltipContent.renderer>
            }
        />
    );
}

export function getPreviewCss(): string {
    return require("./ui/SLTooltip.css");
}
