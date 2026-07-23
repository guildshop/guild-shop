"use client";

/**
 * When arriving on a designer's page via a `?product=<id>` link (e.g. from
 * clicking a product tile on the homepage marquee), automatically open that
 * product's detail modal once the page mounts.
 */

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { Product } from "@/lib/types";

export function useOpenProductFromQuery(
  products: Product[],
  setSelectedProduct: (p: Product) => void
) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get("product");
    if (!id) return;
    const match = products.find((p) => p.id === id);
    if (match) setSelectedProduct(match);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);
}
