/**
 * Shopify Storefront API client (server-side only).
 *
 * Uses the private access token — never bundle this into client code.
 * Every call goes through here, so the token never reaches the browser.
 */

const API_VERSION = "2024-10";

export async function shopifyFetch<T = unknown>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN?.trim();
  const token = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN?.trim();

  if (!domain || !token) {
    throw new Error("Shopify credentials are not configured");
  }

  const res = await fetch(`https://${domain}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Shopify-Storefront-Private-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors.map((e: { message: string }) => e.message).join("; "));
  }
  return json.data as T;
}
