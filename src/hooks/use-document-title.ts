// src/hooks/use-document-title.ts
// Sets the browser tab title dynamically.
// Resets to the site default when the component unmounts.

import { useEffect } from 'react';

const SITE_NAME = 'Raphael G. K.';

/**
 * useDocumentTitle('My Post Title')
 * → browser tab shows: "My Post Title — Raphael G. K."
 *
 * useDocumentTitle() or useDocumentTitle('')
 * → browser tab shows: "Raphael G. K. — Think Spatial. Build Smart. Lead Change."
 */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    const prev = document.title;

    document.title = title
      ? `${title} — ${SITE_NAME}`
      : `${SITE_NAME} — Think Spatial. Build Smart. Lead Change.`;

    return () => {
      document.title = prev;
    };
  }, [title]);
}
