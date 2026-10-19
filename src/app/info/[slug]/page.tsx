import Link from "next/link";
import { notFound } from "next/navigation";
import { INFO_PAGES } from "@/data/products";

export function generateStaticParams() {
  return Object.keys(INFO_PAGES).map((slug) => ({ slug }));
}

export default async function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = INFO_PAGES[slug];
  if (!page) notFound();
  return (
    <main className="container-x flex min-h-[70vh] flex-col justify-center pb-20 pt-40">
      <p className="eyebrow">Demo page</p>
      <h1 className="mt-4 font-display text-5xl font-extrabold sm:text-7xl">{page.title}</h1>
      <p className="mt-6 max-w-xl text-lg text-white/65">{page.body}</p>
      <p className="mt-3 max-w-xl text-sm text-white/40">This is a placeholder route in a static demo site. No content or service sits behind it.</p>
      <Link href="/" className="btn-volt mt-10 self-start">Back to home</Link>
    </main>
  );
}
