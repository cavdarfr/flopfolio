/* Dev-only gallery to compare share-card templates and formats.
   Visit /dev/cards with the dev server running. Not linked anywhere. */

const templates = ["tombstone", "autopsy", "editorial"] as const;
const formats = [
    { id: "og", label: "Link preview · 1200×630" },
    { id: "square", label: "Instagram square · 1080×1080" },
    { id: "story", label: "Instagram post · 1080×1350" },
] as const;

export default function CardsGallery() {
    if (process.env.NODE_ENV === "production") {
        return null;
    }
    return (
        <div className="mx-auto max-w-6xl px-4 py-10">
            <h1 className="text-2xl font-bold">Share-card templates</h1>
            <p className="mt-1 text-sm text-zinc-500">
                Rendered live by <code>/api/card/preview</code> with sample
                data. Append query params (title, oneLiner, cause, years,
                lesson, author) to test your own content.
            </p>
            {templates.map((t) => (
                <section key={t} className="mt-10">
                    <h2 className="font-mono text-sm uppercase tracking-widest text-zinc-400">
                        {t}
                    </h2>
                    <div className="mt-3 grid grid-cols-1 gap-6 md:grid-cols-3">
                        {formats.map((f) => (
                            <figure key={f.id}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={`/api/card/preview?template=${t}&format=${f.id}`}
                                    alt={`${t} — ${f.label}`}
                                    className="w-full rounded-lg border border-zinc-200 shadow-sm dark:border-zinc-800"
                                />
                                <figcaption className="mt-1 text-xs text-zinc-400">
                                    {f.label}
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}
