import { useCallback, useRef } from "react"

export const useDebounce = (delay = 300, notDelayInFirstTyme = true) => {
    const debouncing = useRef<NodeJS.Timeout>();
    const isfirstTime = useRef(notDelayInFirstTyme);

    const debounce = useCallback((func: () => void) => {
        if (isfirstTime.current) {
            isfirstTime.current = false;
            func()
        } else {
            if (debouncing.current) {
                clearTimeout(debouncing.current);
            }
            debouncing.current = setTimeout(() => func(), delay)
        }
    }, [delay])

    return { debounce }
}