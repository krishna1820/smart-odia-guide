import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { logVisit } from "@/lib/portal.functions";

export function VisitTracker() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const log = useServerFn(logVisit);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Skip admin paths from public analytics
    if (path.startsWith("/admin") || path.startsWith("/_authenticated")) return;
    log({
      data: {
        path,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent.slice(0, 500),
      },
    }).catch(() => { /* silent */ });
  }, [path, log]);

  return null;
}
