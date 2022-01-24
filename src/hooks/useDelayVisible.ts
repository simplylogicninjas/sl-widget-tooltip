import { useEffect, useState } from "react";

export const useDelayVisible = (isVisible: boolean) => {
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        let timeoutId: any;

        if (isVisible && !shouldRender) {
            setShouldRender(true);
        } else if (!isVisible && shouldRender) {
            timeoutId = setTimeout(() => setShouldRender(false), 500);
        }

        return () => clearTimeout(timeoutId);
    }, [isVisible, shouldRender]);

    return shouldRender;
};
