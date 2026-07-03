import { notFound } from "next/navigation";
import FlopWizard from "@/components/flop/FlopWizard";
import { getMyFlopById, type SerializedFlop } from "@/actions/flop-actions";
import type { FlopFormValues } from "@/lib/flopValidation";

export const metadata = {
    title: "Edit flop — Flopfolio",
};

export default async function EditFlopPage({
    params,
}: {
    params: Promise<{ flopId: string }>;
}) {
    const { flopId } = await params;
    const response = await getMyFlopById(flopId);
    if (!response.success || !response.data) {
        notFound();
    }
    const flop = response.data as SerializedFlop;

    const existingFlop: FlopFormValues & { _id: string } = {
        _id: flop._id,
        slug: flop.slug,
        title: flop.title,
        oneLiner: flop.oneLiner,
        sector: flop.sector ?? "",
        startedYear: flop.startedYear,
        endedYear: flop.endedYear,
        outcome: flop.outcome,
        causeOfFailure: flop.causeOfFailure,
        story: {
            context: flop.story?.context ?? "",
            attempt: flop.story?.attempt ?? "",
            downfall: flop.story?.downfall ?? "",
        },
        lessons: flop.lessons?.length ? flop.lessons : [""],
        wouldDoDifferently: flop.wouldDoDifferently ?? "",
        costs: {
            monthsSpent: flop.costs?.monthsSpent,
            moneyLost: flop.costs?.moneyLost ?? "",
        },
        logoUrl: flop.logoUrl ?? "",
        cardTemplate: flop.cardTemplate ?? "tombstone",
        published: flop.published ?? true,
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-white border border-zinc-200 rounded-3xl shadow-xl p-6 my-8">
            <FlopWizard existingFlop={existingFlop} />
        </div>
    );
}
