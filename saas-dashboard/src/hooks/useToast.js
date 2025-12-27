// src/hooks/useToast.js
import { useState, useCallback } from "react";

export function useToast() {
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type = "success", duration = 3000) => {
        setToast({ message, type, duration });
    }, []);

    const hideToast = useCallback(() => {
        setToast(null);
    }, []);

    return {
        toast,
        showToast,
        hideToast,
        success: (message, duration) => showToast(message, "success", duration),
        error: (message, duration) => showToast(message, "error", duration),
        warning: (message, duration) => showToast(message, "warning", duration)
    };
}