import React, { ReactElement, ReactNode, useEffect, createElement, useState, useRef } from "react";
import { useDelayVisible } from "src/hooks/useDelayVisible";
import { eventInsideTarget } from "src/utils/eventInsideTarget";
import { eventOutsideTarget } from "src/utils/eventOutsideTarget";
import { PlacementEnum, TriggerModeEnum } from "typings/SLTooltipProps";
import Popper, { PopoverRef } from "./Popper";

interface Props {
    name: string;
    className: string;
    triggerMode: TriggerModeEnum;
    autoClose: boolean;
    showArrow: boolean;
    placement: PlacementEnum;
    tooltipTriggerContent: ReactNode;
    tooltipContent: ReactNode;
}

declare let window: any;

export function Tooltip(props: Props): ReactElement {
    const [isVisible, _setIsVisible] = useState(false);
    const isVisibleRef = useRef(false);
    const [menuTrigger, setMenuTrigger] = useState<HTMLElement | null>(null);
    const visibleByFocusRef = useRef(false);
    const shouldRenderTooltip = useDelayVisible(isVisible);
    const popover = useRef<PopoverRef>();

    const setIsVisible = (visible: boolean) => {
        isVisibleRef.current = visible;
        _setIsVisible(visible);
    };

    const setVisibleByFocus = (visible: boolean) => {
        visibleByFocusRef.current = visible;
    };

    const registerPublicApi = () => {
        if (window && !window.slPopover) {
            window.slPopover = {};
        }

        window.slPopover[props.name] = {
            hideMenu: () => hideMenu()
        };
    };

    const registerActivePopover = () => {
        if (window && !window.slPopover) {
            window.slPopover = {};
        }

        window.slPopover.activePopover = {
            name: props.name,
            autoClose: props.autoClose
        };
    };

    const showMenu = () => {
        if (window && window.slPopover) {
            const popoverName = window.slPopover.activePopover?.name;
            const autoClose = window.slPopover.activePopover?.autoClose;
            if (autoClose && popoverName && popoverName !== props.name) {
                if (window.slPopover[popoverName]) {
                    window.slPopover[popoverName].hideMenu();
                }
            }
        }

        if (!isVisibleRef.current) {
            popover?.current?.update();
            setIsVisible(true);
            registerActivePopover();
        }
    };

    const hideMenu = () => {
        if (isVisibleRef.current) {
            setIsVisible(false);
        }
    };

    const outsidePointerEventListener = (event: MouseEvent | TouchEvent | FocusEvent) => {
        const targetOutside = eventOutsideTarget(event, popover.current, menuTrigger);

        if (targetOutside) {
            hideMenu();
        }
    };

    const outsideFocusEvent = (event: FocusEvent) => {
        const targetOutside = eventOutsideTarget(event, popover.current, menuTrigger);

        if (visibleByFocusRef.current && targetOutside) {
            hideMenu();
            setVisibleByFocus(false);
        }
    };

    const outsideHoverEvent = (event: MouseEvent) => {
        const targetOutside = eventOutsideTarget(event, popover.current, menuTrigger);

        if (targetOutside) {
            hideMenu();
        }
    };

    const initOutsideListener = () => {
        if (props.triggerMode === "hover") {
            document.addEventListener("mouseover", outsideHoverEvent);
        } else {
            if (props.autoClose) {
                document.addEventListener("mousedown", outsidePointerEventListener);
                document.addEventListener("touchstart", outsidePointerEventListener);
            }
        }
    };

    const destroyOutsideListener = () => {
        document.removeEventListener("focusout", outsideFocusEvent);
        document.removeEventListener("mouseover", outsideHoverEvent);
        document.removeEventListener("mousedown", outsidePointerEventListener);
        document.removeEventListener("touchstart", outsidePointerEventListener);
    };

    const onHoverEvent = (event: MouseEvent) => {
        const insideTarget = eventInsideTarget(event, popover.current, menuTrigger);

        if (insideTarget) {
            showMenu();
        }
    };

    const onClickEvent = (event: MouseEvent | TouchEvent) => {
        const insideTarget = eventInsideTarget(event, popover.current, menuTrigger);

        if (insideTarget) {
            return isVisibleRef.current ? hideMenu() : showMenu();
        }
    };

    const onFocusEvent = (event: FocusEvent) => {
        const insideTarget = eventInsideTarget(event, popover.current, menuTrigger);

        if (insideTarget) {
            setVisibleByFocus(true);
            showMenu();
        }
    };

    const initInsideListener = () => {
        if (props.triggerMode === "leftClick") {
            document.addEventListener("mousedown", onClickEvent);
            document.addEventListener("touchstart", onClickEvent);
        }

        if (props.triggerMode === "hover") {
            document.addEventListener("mouseover", onHoverEvent);
        }

        if (props.triggerMode === "leftClick" || props.triggerMode === "hover") {
            // document.addEventListener('focusin', onFocusEvent)
        }
    };

    const destroyInsideListener = () => {
        document.removeEventListener("mousedown", onClickEvent);
        document.removeEventListener("touchstart", onClickEvent);
        document.removeEventListener("mouseover", onHoverEvent);
        document.removeEventListener("focusin", onFocusEvent);
    };

    useEffect(() => {
        if (menuTrigger) {
            initInsideListener();
            initOutsideListener();
            registerPublicApi();
        }

        return () => {
            destroyOutsideListener();
            destroyInsideListener();
        };
    }, [menuTrigger]);

    const renderMenuTrigger = () => (
        <div tabIndex={0} className="sl-tooltip-trigger" ref={setMenuTrigger}>
            {props.tooltipTriggerContent}
        </div>
    );

    return (
        <React.Fragment>
            {renderMenuTrigger()}
            {shouldRenderTooltip && (
                <Popper
                    className={props.className}
                    ref={popover}
                    visible={isVisible}
                    showArrow={props.showArrow}
                    trigger={menuTrigger}
                    menuContent={props.tooltipContent}
                    placement={props.placement}
                    triggerMode={props.triggerMode}
                />
            )}
        </React.Fragment>
    );
}
