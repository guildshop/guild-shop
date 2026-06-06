import { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = { title: "Terms & Conditions" };

const SECTIONS = [
  {
    n: "01",
    title: "About Us",
    body: [
      "The legal entity operating this website is Guild Enterprises, trading as Guild Shop.",
      "Country of registration: India. Registered address: [insert full Indian registered address]. Contact email: founders@guildshop.co. Guild Shop operates primarily from India and ships orders worldwide.",
    ],
  },
  {
    n: "02",
    title: "Scope of the Website and Services",
    body: [
      "The website allows customers to browse designers and products and to purchase made‑to‑order, custom‑made garments.",
      "All products available for purchase are made to order and produced only after an order is placed and paid for in full.",
      "Payments are pre‑paid only. We do not offer cash on delivery or delayed payment methods.",
      "Designers who wish to collaborate with Guild Shop may use the \"Join Us\" page to submit their details. Our team will review applications and contact designers with an acceptance or rejection. Submission of an application does not guarantee onboarding.",
    ],
  },
  {
    n: "03",
    title: "Eligibility and User Accounts",
    body: [
      "The website can be browsed by anyone, subject to these Terms.",
      "To place an order, you must create a user account, provide accurate information, and keep your login details confidential.",
      "You may browse products without an account, but checkout and purchasing require registration.",
      "You are responsible for all activity under your account. If you suspect unauthorised use, you must notify us as soon as possible.",
    ],
  },
  {
    n: "04",
    title: "Designers and Curation",
    body: [
      "Guild Shop is a curated platform. We onboard designers after careful review of their work and portfolio. We do not accept every applicant.",
      "Designers and products are curated, including by season (for example, Spring/Summer, Autumn/Winter), and products available on the website may change over time.",
      "Designers retain their independent status. They are free to open and operate their own websites or sell elsewhere. Guild Shop does not restrict designers from running their own channels or side business.",
      "Each designer has a dedicated area on the website where we present their aesthetic and visual identity. The details in those pages are provided or approved by the designer and are published with their consent.",
      "We reserve the right, at our discretion, to accept or decline any designer application and to remove designers or products that no longer fit our curation.",
    ],
  },
  {
    n: "05",
    title: "Ownership of Designs and Content",
    body: [
      "All fashion designs and garments displayed on the website remain the sole property of the respective designers.",
      "Guild Shop does not claim ownership of the designers' underlying designs; we act as a curated platform and co‑branding/marketing partner.",
      "Photos and visuals used on the website are created and/or posted with the designer's approval.",
      "Designers grant Guild Shop a worldwide, non‑exclusive licence to use their designs, photos, and related content for marketing, social media, PR, editorial, and sales purposes, in line with our agreements with them.",
      "All website design, layout, logo, text, and imagery created by or for Guild Shop (excluding designer materials) are the intellectual property of Guild Enterprises. Users may not copy, reproduce, or use them without our permission, except for sharing on social media as allowed in Section 6.5.",
    ],
  },
  {
    n: "06",
    title: "Intellectual Property and Permitted Use",
    body: [
      "All content on the website, including but not limited to text, images, graphics, logos, and layout, is protected by copyright and other intellectual property laws.",
      "You may view the website and print or download extracts for your personal, non‑commercial use only.",
      "You must not copy, reproduce, distribute, modify, or create derivative works from the content without prior written consent from Guild Shop and/or the relevant designer.",
      "Copying or reproducing the designs themselves (or commissioning copies of them) is strictly prohibited. Any attempt to copy or replicate designs may result in legal action, including claims for infringement and damages.",
      "We allow users to share our images on social media (for example, reposts, stories, moodboards) provided that Guild Shop and/or the relevant designer is clearly credited, and the sharing is not misleading, defamatory, or used to sell counterfeit or copycat products.",
    ],
  },
  {
    n: "07",
    title: "Orders, Pricing, and Payment",
    body: [
      "All products on Guild Shop are made to order and custom‑made based on your selection and measurements.",
      "All prices displayed are subject to change at any time. We reserve the right to update prices and correct errors in pricing or product descriptions, even after an order has been placed but before it is accepted and confirmed.",
      "Orders are only accepted once payment has been successfully processed. We do not offer cash on delivery or delayed payment arrangements.",
      "We accept payment via the payment providers integrated into the website. You agree to be bound by their terms when using their services.",
      "If we discover an error in the price or description of a product you have ordered, we will inform you and give you the option to reconfirm the order at the correct price or cancel it. If you cancel, you will receive a full refund.",
    ],
  },
  {
    n: "08",
    title: "Production, Shipping, and Customs",
    body: [
      "Because all garments are made to order, production typically takes 2–3 weeks from order confirmation.",
      "Once the garment is produced, shipping typically takes 3–4 days, depending on destination and logistics partners. These time frames are estimates and may vary.",
      "We ship worldwide. The list of available destination countries and any specific restrictions may change over time.",
      "Customs duties and import taxes for international orders are borne by Guild Shop, not by the individual designer. However, local regulations may apply, and any additional steps required by the customer (for example, providing documents) remain their responsibility.",
      "Delivery timelines are approximate and may be affected by external factors (customs clearance, carrier delays, holidays, etc.). We will not be liable for reasonable delays outside our control.",
    ],
  },
  {
    n: "09",
    title: "Returns, Refunds, and Alterations",
    body: [
      "Because all garments are custom‑made to order, they are generally non‑returnable and non‑refundable.",
      "Exceptions may apply where the garment arrives damaged, or the garment is not the right fit based on the measurements agreed at the time of order.",
      "In such cases, the garment may be eligible for return and alteration rather than a full refund. We will work with the designer to correct the fit or defect where reasonably possible.",
      "If the issue cannot be resolved through alteration, we may, at our discretion, offer a partial or full refund or store credit.",
      "Custom or made‑to‑measure nature of the products means that small variations in fit or appearance may occur; these are not considered defects if they are within reasonable expectations of handcrafted or made‑to‑order items.",
    ],
  },
  {
    n: "10",
    title: "Order Cancellation",
    body: [
      "You may cancel an order within 24 hours of placing it, provided the designer has not already started processing or creating the garment.",
      "After 24 hours, or once production has begun, orders cannot be cancelled except in the special circumstances described in these Terms.",
      "If, after you place an order, we find that specific materials or components are not in stock, we will contact you to offer either alternative materials with your approval, or a full refund if you do not wish to proceed with changes.",
    ],
  },
  {
    n: "11",
    title: "Designer–Customer Consultation",
    body: [
      "In some cases, once an order is placed, we may schedule a consultation call (e.g., Zoom) between the designer and the customer to clarify details about the garment, materials, and measurements.",
      "If after this consultation you are not satisfied with what the designer can offer, you may cancel the order at this stage and receive a refund.",
      "After the consultation is complete and you approve proceeding, further refund claims will not be accepted except as outlined in the returns section (e.g., damaged or mis‑fitting garments).",
    ],
  },
  {
    n: "12",
    title: "Acceptable Use and Prohibited Behaviour",
    body: [
      "You agree to use the website only for lawful purposes and in accordance with these Terms.",
      "You must not: engage in any illegal activities; attempt to hack, disrupt, or gain unauthorised access to the website, servers, or other systems; resell, rent, or otherwise exploit access to the website; attempt to copy, reproduce, or commission copies of the designs shown on the website; or scrape or harvest data from the website for commercial use without permission.",
      "Any attempt to copy the designs or misuse the platform may result in immediate suspension of access and legal action.",
    ],
  },
  {
    n: "13",
    title: "No Interactive Public Areas",
    body: [
      "At this time, the website does not provide public interactive areas such as comments sections, reviews, or community forums.",
      "Communication between customers, designers, and Guild Shop may occur through private channels (email, calls, or scheduled video consultations) as needed to fulfil orders and clarify details.",
    ],
  },
  {
    n: "14",
    title: "Disclaimers and Limitation of Liability",
    body: [
      "While we aim to present products as accurately as possible, colours and appearance may vary slightly due to lighting, screen settings, and the nature of materials. Such minor variations are not considered defects.",
      "To the maximum extent permitted by law, Guild Enterprises and Guild Shop will not be liable for indirect, incidental, special, or consequential damages, including but not limited to loss of profit, loss of business, or loss of data, arising out of or in connection with the use of the website or purchase of products.",
      "Our total liability for any claim relating to a product or service will be limited to the amount you paid for that specific product or service.",
      "Some information on the website, including timelines and availability, is approximate and subject to change. We reserve the right to modify or update such information at any time.",
    ],
  },
  {
    n: "15",
    title: "Privacy, Data, and Cookies",
    body: [
      "We collect personal data such as your name, contact details, shipping address, and order details to process orders and manage your account.",
      "We also use third‑party tools, including payment providers and services necessary to run the website online. These third parties have their own privacy and data practices.",
      "Our use of cookies and similar technologies is described in a separate Privacy Policy and/or Cookie Policy, which is incorporated by reference into these Terms.",
      "By using the website, you consent to our data practices as described in our Privacy Policy and Cookie Policy (linked from the footer of the site).",
    ],
  },
  {
    n: "16",
    title: "Changes to the Website and Terms",
    body: [
      "We may update, modify, or discontinue any part of the website, products, or services at any time without prior notice.",
      "We reserve the right to update these Terms and Conditions from time to time. When we do so, we will update the \"Last updated\" date at the top, display a banner on the website, and send an email notification to existing users/customers where appropriate.",
      "Your continued use of the website after changes are published constitutes acceptance of the updated Terms.",
    ],
  },
  {
    n: "17",
    title: "Governing Law and Dispute Resolution",
    body: [
      "These Terms are governed by and construed in accordance with the laws of India.",
      "In the event of any dispute, we encourage parties to first attempt to resolve the matter through good‑faith negotiation.",
      "If a dispute cannot be resolved amicably, it shall be submitted to the competent courts in India, which shall have exclusive jurisdiction, subject to any mandatory legal provisions that apply.",
    ],
  },
  {
    n: "18",
    title: "Contact",
    body: [
      "If you have any questions about these Terms, please contact us at: founders@guildshop.co",
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
              { label: "Last Updated:", value: "06-06-2026" },
              { label: "Articles:", value: "Eighteen" },
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
                <p style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontSize: "clamp(16px, 2vw, 28px)", fontWeight: 900, textTransform: "uppercase", color: "var(--color-fg)" }}>
                  {col.value}
                </p>
              </div>
            ))}
          </div>

          {/* Wordmark */}
          <div style={{ padding: "clamp(24px,4vw,56px) var(--content-pad)" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-fg-mid)", marginBottom: "clamp(12px,2vw,20px)" }}>
              Guild Enterprises · Guild Shop
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
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--color-fg-mid)", marginTop: "clamp(16px,2vw,24px)", lineHeight: 1.8, maxWidth: 720 }}>
              These Terms and Conditions ("Terms") govern your use of the website operated under the brand Guild Shop by Guild Enterprises ("Guild Enterprises", "Guild Shop", "we", "us", "our"). By accessing or using our website and services, you agree to be bound by these Terms. If you do not agree, please do not use the website or place any orders.
            </p>
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
                    fontSize: "clamp(18px, 2vw, 28px)",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    color: "var(--color-fg)",
                    lineHeight: 1.05,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {s.title}
                </h2>
              </div>

              {/* Right: body */}
              <div
                className="md:col-span-8 flex flex-col"
                style={{ padding: "clamp(24px,3.5vw,48px) clamp(20px,3vw,40px)", gap: "14px" }}
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
