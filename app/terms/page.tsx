import { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = { title: "Terms & Conditions" };

const SECTIONS = [
  {
    n: "01",
    title: "The Guild",
    body: [
      "Guild Shop is a curated digital marketplace connecting independent fashion designers and jewellery artists with collectors worldwide. By accessing or using the platform, you agree to these Terms & Conditions in full. If you do not agree, please do not use the platform.",
      "Each designer presented on Guild Shop operates as an independent studio. Guild Shop facilitates the presentation, sale, and fulfilment of their work but does not manufacture the garments itself.",
    ],
  },
  {
    n: "02",
    title: "Made to Order",
    body: [
      "All pieces sold through Guild Shop are made to order. Production does not begin until your order is placed and your measurements are confirmed. Because each garment is crafted individually to your specifications, production typically takes three to six weeks before dispatch.",
      "You are responsible for the accuracy of the measurements you provide. Guild Shop and its designers craft each piece to the dimensions submitted at checkout and cannot be held responsible for fit issues arising from inaccurate measurements.",
    ],
  },
  {
    n: "03",
    title: "Orders & Payment",
    body: [
      "All prices are listed in USD unless otherwise stated and are inclusive of made-to-order crafting. Applicable taxes and duties may be calculated at checkout or collected on delivery depending on your jurisdiction.",
      "Placing an order constitutes an offer to purchase. An order is confirmed only once payment is processed and a confirmation is issued. Guild Shop reserves the right to refuse or cancel any order at its discretion.",
    ],
  },
  {
    n: "04",
    title: "Shipping & Delivery",
    body: [
      "Guild Shop ships worldwide. Estimated delivery times are provided at checkout and begin once production is complete. White-glove shipping is included on eligible orders.",
      "Risk of loss passes to you upon delivery to the address provided. Guild Shop is not liable for delays caused by customs, carriers, or events beyond its reasonable control.",
    ],
  },
  {
    n: "05",
    title: "Returns & Exchanges",
    body: [
      "Because every piece is made to order to your individual measurements, all sales are final and items are not eligible for return or exchange except where a piece arrives faulty or materially differs from its description.",
      "If you believe your piece is defective, contact support@guildshop.co within seven days of delivery with your order number and photographs. Remedies are assessed on a case-by-case basis in coordination with the designer.",
    ],
  },
  {
    n: "06",
    title: "Intellectual Property",
    body: [
      "All designs, imagery, text, and branding presented on Guild Shop are the property of Guild Shop or its designers and are protected by intellectual property laws. Nothing on the platform grants you any license to reproduce, distribute, or create derivative works without express written permission.",
    ],
  },
  {
    n: "07",
    title: "Limitation of Liability",
    body: [
      "Guild Shop provides the platform on an \"as is\" basis. To the fullest extent permitted by law, Guild Shop disclaims all warranties and shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform or purchase of any piece.",
    ],
  },
  {
    n: "08",
    title: "Changes & Contact",
    body: [
      "Guild Shop may update these Terms & Conditions from time to time. Continued use of the platform after changes are posted constitutes acceptance of the revised terms.",
      "Questions about these terms may be directed to hello@guildshop.co.",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <div style={{ background: "var(--color-bg)", minHeight: "100vh", paddingTop: "var(--nav-h)" }}>
        {/* Top info grid */}
        <section style={{ borderBottom: "1px solid var(--color-fg)" }}>
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ borderBottom: "1px solid var(--color-fg)" }}>
            {[
              { label: "Section:", value: "Legal" },
              { label: "Updated:", value: "MMXXVI" },
              { label: "Articles:", value: "Eight" },
            ].map((col, i) => (
              <div
                key={i}
                style={{
                  padding: "clamp(20px,3vw,36px) clamp(20px,3vw,40px)",
                  borderRight: i < 2 ? "1px solid var(--color-fg)" : "none",
                }}
              >
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-fg-mid)", marginBottom: "10px" }}>
                  {col.label}
                </p>
                <p style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontSize: "clamp(20px, 2.5vw, 32px)", fontWeight: 900, textTransform: "uppercase", color: "var(--color-fg)" }}>
                  {col.value}
                </p>
              </div>
            ))}
          </div>

          {/* Wordmark */}
          <div style={{ padding: "clamp(24px,4vw,56px) var(--content-pad)" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-fg-mid)", marginBottom: "clamp(12px,2vw,20px)" }}>
              The Fine Print
            </p>
            <h1
              style={{
                fontFamily: "'Barlow', system-ui, sans-serif",
                fontSize: "clamp(40px, 8vw, 120px)",
                fontWeight: 900,
                textTransform: "uppercase",
                lineHeight: 0.88,
                color: "var(--color-fg)",
                letterSpacing: "-0.01em",
              }}
            >
              Terms &<br />Conditions.
            </h1>
          </div>
        </section>

        {/* Sections */}
        <section style={{ borderBottom: "1px solid var(--color-fg)" }}>
          {SECTIONS.map((s, i) => (
            <div
              key={s.n}
              className="grid grid-cols-1 md:grid-cols-12"
              style={{ borderBottom: i < SECTIONS.length - 1 ? "1px solid var(--color-fg)" : "none" }}
            >
              {/* Left: number + title */}
              <div
                className="md:col-span-4"
                style={{
                  padding: "clamp(24px,3.5vw,48px) clamp(20px,3vw,40px)",
                  borderRight: "1px solid var(--color-fg)",
                }}
              >
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.14em", color: "var(--color-fg-subtle)", display: "block", marginBottom: "16px" }}>
                  {s.n}
                </span>
                <h2
                  style={{
                    fontFamily: "'Barlow', system-ui, sans-serif",
                    fontSize: "clamp(22px, 2.4vw, 36px)",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    color: "var(--color-fg)",
                    lineHeight: 1.0,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {s.title}
                </h2>
              </div>

              {/* Right: body */}
              <div
                className="md:col-span-8 flex flex-col"
                style={{ padding: "clamp(24px,3.5vw,48px) clamp(20px,3vw,40px)", gap: "18px" }}
              >
                {s.body.map((para, j) => (
                  <p
                    key={j}
                    style={{ fontFamily: "var(--font-mono)", fontSize: "12px", lineHeight: 1.9, color: "var(--color-fg-mid)" }}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Bottom strip */}
        <div className="flex items-center justify-between flex-wrap gap-4" style={{ padding: "clamp(16px,2vw,22px) var(--content-pad)" }}>
          <Link href="/" style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-fg)" }}>
            ← Back to Guild Shop
          </Link>
          <Link href="/contact" style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-fg-mid)" }}>
            Questions? Contact Us →
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}
