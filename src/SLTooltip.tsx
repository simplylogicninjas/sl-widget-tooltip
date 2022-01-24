import { ReactElement, createElement } from "react";
import { SLTooltipContainerProps } from "typings/SLTooltipProps";
import { Tooltip } from "./components/Tooltip";

import "./ui/SLTooltip.css";

export function SLTooltip(props: SLTooltipContainerProps): ReactElement {
    return <Tooltip {...props} className={props.class} />;
}
