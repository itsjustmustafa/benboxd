import { useEffect } from "react";

export default function useBodyClass(className: string, enabled: boolean) {
    useEffect(() => {
        const body = document.body;
        if (enabled) {
            body.classList.add(className);
        } else {
            body.classList.remove(className);
        }
        return () => {
            body.classList.remove(className);
        };
    }, [className, enabled]);
}
