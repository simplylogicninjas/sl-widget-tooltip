function getKeyboardFocusableElements(element: HTMLElement): HTMLElement[] {
    return Array.from(
        element.querySelectorAll('a[href], button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])')
    ).filter(item => !item.hasAttribute("disabled") || !item.hasAttribute("aria-hidden")) as HTMLElement[];
}

export function trapFocus(element: HTMLElement) {
    const focusable = getKeyboardFocusableElements(element);

    if (focusable.length) {
        setTimeout(() => focusable[0].focus(), 100);
    }
}
