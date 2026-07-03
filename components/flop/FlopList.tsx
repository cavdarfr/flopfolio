"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteFlop, type SerializedFlop } from "@/actions/flop-actions";
import { outcomeConfig } from "@/lib/config/outcome";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Eye, Loader2, Pencil, Trash2 } from "lucide-react";

export default function FlopList({ flops }: { flops: SerializedFlop[] }) {
    const router = useRouter();
    const { toast } = useToast();
    const [flopToDelete, setFlopToDelete] = useState<SerializedFlop | null>(
        null
    );
    const [isDeleting, setIsDeleting] = useState(false);

    const confirmDelete = async () => {
        if (!flopToDelete) return;
        setIsDeleting(true);
        try {
            const res = await deleteFlop(flopToDelete._id);
            if (res.success) {
                toast({
                    title: "Flop deleted",
                    description: `"${flopToDelete.title}" is gone for good.`,
                    variant: "success",
                });
                router.refresh();
            } else {
                toast({
                    title: "Error deleting flop",
                    description: res.error || "Unknown error",
                    variant: "destructive",
                });
            }
        } finally {
            setIsDeleting(false);
            setFlopToDelete(null);
        }
    };

    if (flops.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-zinc-200 p-8 text-center">
                <p className="font-medium text-zinc-700">No flops yet</p>
                <p className="mt-1 text-sm text-zinc-500">
                    Your failures deserve a proper post-mortem — add your first
                    one.
                </p>
            </div>
        );
    }

    return (
        <>
            <ul className="divide-y divide-zinc-100 rounded-2xl border border-zinc-200">
                {flops.map((flop) => {
                    const outcome = outcomeConfig[flop.outcome];
                    const years = flop.endedYear
                        ? `${flop.startedYear}–${flop.endedYear}`
                        : `${flop.startedYear}`;
                    return (
                        <li
                            key={flop._id}
                            className="flex items-center justify-between gap-3 p-4"
                        >
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="truncate font-medium text-zinc-900">
                                        {flop.title}
                                    </span>
                                    <Badge
                                        variant="outline"
                                        className={`border-transparent ${outcome.badgeClass}`}
                                    >
                                        {outcome.label}
                                    </Badge>
                                    {!flop.published && (
                                        <Badge
                                            variant="outline"
                                            className="border-zinc-300 text-zinc-500"
                                        >
                                            Draft
                                        </Badge>
                                    )}
                                </div>
                                <div className="mt-1 flex items-center gap-3 text-xs text-zinc-400">
                                    <span>{years}</span>
                                    <span className="flex items-center gap-1">
                                        <Eye className="h-3 w-3" />
                                        {flop.views} view
                                        {flop.views === 1 ? "" : "s"}
                                    </span>
                                </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-1">
                                <Button variant="ghost" size="icon" asChild>
                                    <Link
                                        href={`/dashboard/flops/${flop._id}/edit`}
                                        aria-label={`Edit ${flop.title}`}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setFlopToDelete(flop)}
                                    aria-label={`Delete ${flop.title}`}
                                >
                                    <Trash2 className="h-4 w-4 text-zinc-400" />
                                </Button>
                            </div>
                        </li>
                    );
                })}
            </ul>

            <Dialog
                open={flopToDelete !== null}
                onOpenChange={(open) => {
                    if (!open && !isDeleting) setFlopToDelete(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete this flop?</DialogTitle>
                        <DialogDescription>
                            {flopToDelete
                                ? `"${flopToDelete.title}" and its post-mortem will be permanently deleted. This cannot be undone.`
                                : ""}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="secondary"
                            onClick={() => setFlopToDelete(null)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
