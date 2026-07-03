import FlopWizard from "@/components/flop/FlopWizard";

export const metadata = {
    title: "New flop — Flopfolio",
};

export default function NewFlopPage() {
    return (
        <div className="w-full max-w-2xl mx-auto bg-white border border-zinc-200 rounded-3xl shadow-xl p-6 my-8">
            <FlopWizard />
        </div>
    );
}
