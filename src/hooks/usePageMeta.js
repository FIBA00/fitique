import { useEffect } from "react";
export function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title
      ? `${title} — Fitique`
      : "Fitique — Boutique Delivery & Fit Check";

    if (description)
      document
        .querySelector('meta[name="description"]')
        ?.setAttribute("content", description);
  }, [title, description]);
}
