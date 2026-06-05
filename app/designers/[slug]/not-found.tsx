import Link from "next/link";

export default function DesignerNotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-6 px-8"
      style={{ background: "var(--color-bg)" }}
    >
      <p className="text-label" style={{ color: "var(--color-accent)" }}>404</p>
      <h1
        className="font-display text-display-md text-center"
        style={{ color: "var(--color-fg)", fontWeight: 300 }}
      >
        This world doesn't exist yet.
      </h1>
      <Link href="/designers">
        <span
          className="text-label border border-current px-8 py-4"
          style={{ color: "var(--color-fg-dim)" }}
        >
          Return to the Guild
        </span>
      </Link>
    </div>
  );
}
