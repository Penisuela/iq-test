import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { ArrowIcon } from "@/components/icons";
import { Header } from "@/components/ui";
import { LEGAL_DOCS } from "@/lib/legalDocs";

export const metadata: Metadata = { title: "Документы — Mindmark" };

export default function LegalPage() {
  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 pb-16 pt-6">
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Документы</h1>
        <ul className="flex flex-col gap-3 rounded-[2rem] bg-accent-soft p-4 sm:p-6">
          {LEGAL_DOCS.map((doc) => (
            <li key={doc.slug}>
              <Link
                href={`/legal/${doc.slug}`}
                className="flex items-center gap-4 rounded-3xl bg-surface p-5 transition hover:shadow-[0_0_0_2px_var(--color-accent)]"
              >
                <span className="flex flex-1 flex-col gap-1">
                  <span className="text-lg font-bold">{doc.title}</span>
                  <span className="text-sm text-muted">{doc.summary}</span>
                </span>
                <ArrowIcon className="size-5 shrink-0 text-accent" />
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}
