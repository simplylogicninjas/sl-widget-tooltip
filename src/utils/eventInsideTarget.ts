import { PopoverRef } from "../components/Popper";

export const eventInsideTarget = (
    event: MouseEvent | TouchEvent | FocusEvent,
    popover: PopoverRef | undefined,
    menuTrigger: HTMLElement | null
): boolean => {
    const target = event.target as Element;
    const targetInsideContentElement = menuTrigger?.contains(target);
    const targetInsideMenuElement = popover?.getMenuElement()?.contains(target);

    return !!targetInsideContentElement || !!targetInsideMenuElement;
};
