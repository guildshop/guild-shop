import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDesigner, designers } from "@/lib/designers";
import { VesperPage } from "@/components/designers/VesperPage";
import { NovaAuraPage } from "@/components/designers/NovaAuraPage";
import { TerraPage } from "@/components/designers/TerraPage";
import { LumiPage } from "@/components/designers/LumiPage";
import { SoleilPage } from "@/components/designers/SoleilPage";
import { OndoPage } from "@/components/designers/OndoPage";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return designers.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const designer = getDesigner(params.slug);
  if (!designer) return { title: "Not Found" };
  return {
    title: `${designer.name} — ${designer.tagline}`,
    description: designer.shortBio,
  };
}

export default function DesignerPage({ params }: Props) {
  const designer = getDesigner(params.slug);
  if (!designer) notFound();

  if (designer.slug === "vesper")    return <VesperPage designer={designer} />;
  if (designer.slug === "nova-aura") return <NovaAuraPage designer={designer} />;
  if (designer.slug === "terra")     return <TerraPage designer={designer} />;
  if (designer.slug === "lumi")      return <LumiPage designer={designer} />;
  if (designer.slug === "soleil")    return <SoleilPage designer={designer} />;
  if (designer.slug === "ondo")      return <OndoPage designer={designer} />;

  notFound();
}
