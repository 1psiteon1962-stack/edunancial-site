"use client";

import { useEffect } from "react";

export default function AdminErrorLogger() {
  useEffect(() => {
    function handleError(event: ErrorEvent) {
      console.error("[Admin] window.onerror", {
        message: event.message,
        source: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
      });
    }

    function handleUnhandledRejection(event: PromiseRejectionEvent) {
      console.error("[Admin] window.onunhandledrejection", {
        reason: event.reason,
        stack: event.reason?.stack,
      });
    }

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  return null;
}
