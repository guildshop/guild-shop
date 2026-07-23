"use client";

/**
 * When arriving on a designer's page via a `?product=<id>` link (e.g. from
 * clicking a product tile on the homepage marquee), automatically open that
 * product's detail modal once the page mounts.
 *
 * Reads window.location directly (rather than useSearchParams) so this
 * doesn't force the statically-generated designer pages into a Suspense
 * boundary / client-side bailout at build time.
 */

import { useEffect } from "react";
import type { Product } from "@/lib/types";

export function useOpenProductFromQuery(
  products: Product[],
  setSelectedProduct: (p: Product) => void
) {
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("product");
    if (!id) return;
    const match = products.find((p) => p.id === id);
    if (match) setSelectedProduct(match);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
