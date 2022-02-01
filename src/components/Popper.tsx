import { Placement } from "@popperjs/core";
import classNames from "classnames";
import React, { createElement, ReactNode, useEffect, useImperativeHandle, useState } from "react";
import ReactDOM from "react-dom";
import { usePopper } from "react-popper";
import { PlacementEnum, TriggerModeEnum } from "../../typings/SLTooltipProps";

interface Props {
    className: string;
    visible: boolean;
    showArrow: boolean;
    trigger: HTMLElement | null;
    menuContent: ReactNode;
    placement: PlacementEnum;
    triggerMode: TriggerModeEnum;
    offsetDistance: number;
}

export interface PopoverRef {
    update: () => void;
    getMenuElement: () => HTMLElement | null;
}

const placementEnumMapping: { [key: string]: Placement } = {
    auto: "auto",
    autoStart: "auto-start",
    autoEnd: "auto-end",
    top: "top",
    topStart: "top-start",
    topEnd: "top-end",
    bottom: "bottom",
    bottomStart: "bottom-start",
    bottomEnd: "bottom-end",
    right: "right",
    rightStart: "right-start",
    rightEnd: "right-end",
    left: "left",
    leftStart: "left-start",
    leftEnd: "left-end"
};

const useContextMenuPopper = (
    elements: {
        menuElement: HTMLElement | null;
        triggerElement: HTMLElement | null;
        arrowElement: HTMLElement | null;
    },
    placement: PlacementEnum,
    offsetDistance: number
) => {
    return usePopper(elements.triggerElement, elements.menuElement, {
        placement: placementEnumMapping[placement],
        modifiers: [
            {
                name: "arrow",
                options: {
                    element: elements.arrowElement,
                    padding: 5
                }
            },
            {
                name: 'offset',
                options: {
                    offset: [0, offsetDistance]
                }
            }
        ]
    });
};

const Popper = React.forwardRef<PopoverRef | undefined, Props>((props: Props, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const [menuElement, setMenuElement] = useState<HTMLElement | null>(null);
    const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null);
    // const [menuContentElement, setMenuContentElement] = useState<HTMLElement | null>(null);
    const { styles, attributes, update } = useContextMenuPopper(
        {
            triggerElement: props.trigger,
            menuElement,
            arrowElement
        },
        props.placement,
        props.offsetDistance
    );

    useImperativeHandle(ref, () => ({
        update: () => {
            update?.();
        },
        getMenuElement: () => menuElement
    }));

    const getClassNames = () => {
        return classNames("sl-tooltip", {
            [props.className]: true,
            "is-visible": isVisible,
            "is-hidden": !isVisible
        });
    };

    const renderMenu = () => (
        <div
            ref={setMenuElement}
            role="menu"
            aria-hidden={!isVisible}
            className={getClassNames()}
            style={styles.popper}
            {...attributes.popper}
        >
            <div className={`sl-tooltip-content`}>{props.menuContent}</div>
            {props.showArrow && renderArrow()}
        </div>
    );

    const renderArrow = () =>
        props.showArrow && (
            <div ref={setArrowElement} className={"sl-tooltip-arrow"} style={styles.arrow} {...attributes.arrow} />
        );

    const showPopper = () => {
        setIsVisible(true);
    };

    useEffect(() => {
        let timeoutId: any;
        if (props.visible) {
            timeoutId = setTimeout(showPopper, 50);
        } else {
            setIsVisible(false);
        }

        return () => clearTimeout(timeoutId);
    }, [props.visible]);

    /*
    TODO: Implement trapFocus if menuContent is rendered.
    Find focusable elements. Focus first found.

    useEffect(() => {
        if (menuContentElement) {
            trapFocus(menuContentElement);
        }
    }, [menuContentElement])
    */

    return ReactDOM.createPortal(renderMenu(), document.body);
});

export default Popper;
