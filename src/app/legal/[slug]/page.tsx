import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { BackIcon } from "@/components/icons";
import { Header } from "@/components/ui";
import { LEGAL_DOCS, LEGAL_UPDATED } from "@/lib/legalDocs";

export function generateStaticParams() {
  return LEGAL_DOCS.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/legal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const doc = LEGAL_DOCS.find((d) => d.slug === slug);
  return { title: doc ? `${doc.title} — Mindmark` : "Документ не найден" };
}

export default async function LegalDocPage({ params }: PageProps<"/legal/[slug]">) {
  const { slug } = await params;
  const doc = LEGAL_DOCS.find((d) => d.slug === slug);
  if (!doc) notFound();

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 pb-16 pt-6">
        <Link
          href="/legal"
          className="flex items-center gap-2 self-start text-sm font-semibold text-muted transition hover:text-foreground"
        >
          <BackIcon className="size-4" />
          Все документы
        </Link>

        <div className="flex flex-col gap-3">
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {doc.title}
          </h1>
          <p className="text-sm text-muted">Редакция от {LEGAL_UPDATED}</p>
        </div>

        {doc.sections.map((section) => (
          <section key={section.heading} className="flex flex-col gap-2">
            <h2 className="text-xl font-bold">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="leading-relaxed text-muted">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </main>
      <Footer />
    </>
  );
}
