"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Path, type Resolver, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    FlopSchema,
    flopSlugFromTitle,
    type FlopFormValues,
    type StructuredFlop,
} from "@/lib/flopValidation";
import { FLOP_OUTCOMES } from "@/models/FlopSchema";
import { outcomeConfig } from "@/lib/config/outcome";
import { saveFlop } from "@/actions/flop-actions";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Loader2, Plus, Trash2 } from "lucide-react";
import BrainDumpStep from "./BrainDumpStep";
import CardTemplatePicker from "./CardTemplatePicker";

const STEP_LABELS = ["Start", "The pitch", "The story", "The lessons", "Publish"];
const LAST_STEP = 4;

const STEP_FIELDS: Record<number, Path<FlopFormValues>[]> = {
    1: [
        "title",
        "oneLiner",
        "sector",
        "startedYear",
        "endedYear",
        "outcome",
        "causeOfFailure",
    ],
    2: ["story.context", "story.attempt", "story.downfall"],
    3: ["lessons", "wouldDoDifferently", "costs.monthsSpent", "costs.moneyLost"],
    4: ["slug", "cardTemplate", "published"],
};

type FlopWizardProps = {
    existingFlop?: FlopFormValues & { _id: string };
};

function CharCounter({ value, max }: { value: string; max: number }) {
    return (
        <span
            className={cn(
                "text-xs tabular-nums",
                value.length > max ? "text-red-500" : "text-zinc-400"
            )}
        >
            {value.length}/{max}
        </span>
    );
}

export default function FlopWizard({ existingFlop }: FlopWizardProps) {
    const isEdit = Boolean(existingFlop);
    const firstStep = isEdit ? 1 : 0;
    const router = useRouter();
    const { toast } = useToast();
    const [step, setStep] = useState(firstStep);
    const [brainDump, setBrainDump] = useState("");
    const [previewKey, setPreviewKey] = useState(0);
    const currentYear = new Date().getFullYear();

    const form = useForm<FlopFormValues>({
        resolver: zodResolver(FlopSchema) as unknown as Resolver<FlopFormValues>,
        defaultValues: existingFlop ?? {
            slug: "",
            title: "",
            oneLiner: "",
            sector: "",
            startedYear: currentYear,
            endedYear: undefined,
            outcome: "shutdown",
            causeOfFailure: "",
            story: { context: "", attempt: "", downfall: "" },
            lessons: [""],
            wouldDoDifferently: "",
            costs: { monthsSpent: undefined, moneyLost: "" },
            logoUrl: "",
            cardTemplate: "tombstone",
            published: true,
        },
    });

    const handleStructured = (data: StructuredFlop) => {
        form.reset({
            slug: flopSlugFromTitle(data.title ?? ""),
            title: data.title ?? "",
            oneLiner: data.oneLiner ?? "",
            sector: data.sector ?? "",
            startedYear: data.startedYear ?? currentYear,
            endedYear: data.endedYear ?? undefined,
            outcome: data.outcome ?? "shutdown",
            causeOfFailure: data.causeOfFailure ?? "",
            story: {
                context: data.story?.context ?? "",
                attempt: data.story?.attempt ?? "",
                downfall: data.story?.downfall ?? "",
            },
            lessons: data.lessons?.length ? data.lessons.slice(0, 3) : [""],
            wouldDoDifferently: data.wouldDoDifferently ?? "",
            costs: {
                monthsSpent: data.costs?.monthsSpent ?? undefined,
                moneyLost: data.costs?.moneyLost ?? "",
            },
            logoUrl: "",
            cardTemplate: "tombstone", // stays default — picked at the publish step
            published: true,
        });
        setStep(1);
    };

    const goNext = async () => {
        const fields = STEP_FIELDS[step];
        if (fields) {
            const valid = await form.trigger(fields);
            if (!valid) return;
        }
        if (step === 3) {
            // Entering the publish step: prefill the slug and refresh card previews
            if (!form.getValues("slug") && form.getValues("title")) {
                form.setValue("slug", flopSlugFromTitle(form.getValues("title")));
            }
            setPreviewKey((k) => k + 1);
        }
        setStep((s) => Math.min(s + 1, LAST_STEP));
    };

    const goBack = () => setStep((s) => Math.max(s - 1, firstStep));

    const onSubmit: SubmitHandler<FlopFormValues> = async (values) => {
        const res = await saveFlop(values, existingFlop?._id);
        if (res.success) {
            toast({
                title: isEdit ? "Flop updated" : "Flop saved",
                description: values.published
                    ? "It's live on your public profile."
                    : "Saved as a draft — publish it whenever you're ready.",
                variant: "success",
            });
            router.push("/dashboard");
        } else {
            toast({
                title: "Error saving flop",
                description: res.error || "Unknown error",
                variant: "destructive",
            });
        }
    };

    // Reactive values for counters and card previews
    const oneLiner = form.watch("oneLiner");
    const causeOfFailure = form.watch("causeOfFailure");
    const lessons = form.watch("lessons");

    const addLesson = () => {
        if (lessons.length < 3) {
            form.setValue("lessons", [...form.getValues("lessons"), ""]);
        }
    };
    const removeLesson = (index: number) => {
        form.setValue(
            "lessons",
            form.getValues("lessons").filter((_, i) => i !== index)
        );
        form.trigger("lessons");
    };

    const visibleSteps = isEdit ? [1, 2, 3, 4] : [0, 1, 2, 3, 4];

    const previewValues = () => {
        const v = form.getValues();
        return {
            title: v.title,
            oneLiner: v.oneLiner,
            cause: v.causeOfFailure,
            years: v.endedYear
                ? `${v.startedYear}–${v.endedYear}`
                : `${v.startedYear}`,
            lesson: v.lessons[0] ?? "",
        };
    };

    return (
        <div className="w-full space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-zinc-900">
                    {isEdit ? "Edit flop" : "New flop"}
                </h1>
                <p className="text-sm text-zinc-500">
                    {isEdit
                        ? "Refine the post-mortem — changes go live on save."
                        : "Every failure deserves a proper post-mortem."}
                </p>
            </div>

            {/* Progress indicator */}
            <ol className="flex items-center gap-1">
                {visibleSteps.map((s, i) => {
                    const done = s < step;
                    const current = s === step;
                    return (
                        <li key={s} className="flex flex-1 items-center gap-1">
                            <div className="flex min-w-0 items-center gap-2">
                                <span
                                    className={cn(
                                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                                        current
                                            ? "bg-zinc-900 text-white"
                                            : done
                                              ? "bg-zinc-200 text-zinc-700"
                                              : "bg-zinc-100 text-zinc-400"
                                    )}
                                >
                                    {i + 1}
                                </span>
                                <span
                                    className={cn(
                                        "hidden truncate text-xs sm:block",
                                        current
                                            ? "font-medium text-zinc-900"
                                            : "text-zinc-400"
                                    )}
                                >
                                    {STEP_LABELS[s]}
                                </span>
                            </div>
                            {i < visibleSteps.length - 1 && (
                                <div
                                    className={cn(
                                        "h-px flex-1",
                                        done ? "bg-zinc-400" : "bg-zinc-200"
                                    )}
                                />
                            )}
                        </li>
                    );
                })}
            </ol>

            {step === 0 && (
                <BrainDumpStep
                    value={brainDump}
                    onChange={setBrainDump}
                    onStructured={handleStructured}
                    onManual={() => setStep(1)}
                />
            )}

            {step > 0 && (
                <Form {...form}>
                    <form
                        onSubmit={(e) => {
                            if (step !== LAST_STEP) {
                                e.preventDefault();
                                return;
                            }
                            form.handleSubmit(onSubmit)(e);
                        }}
                        className="space-y-6"
                    >
                        {/* ─── Step 1: The pitch ─── */}
                        {step === 1 && (
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="What was the project called?"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="oneLiner"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center justify-between">
                                                <FormLabel>One-liner</FormLabel>
                                                <CharCounter
                                                    value={oneLiner}
                                                    max={140}
                                                />
                                            </div>
                                            <FormControl>
                                                <Textarea
                                                    rows={2}
                                                    placeholder="One punchy sentence — what was it?"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <FormField
                                        control={form.control}
                                        name="sector"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Sector</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="SaaS, e-commerce…"
                                                        {...field}
                                                        value={field.value ?? ""}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="startedYear"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Started</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="2022"
                                                        {...field}
                                                        value={field.value ?? ""}
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="endedYear"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Ended</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="2024"
                                                        {...field}
                                                        value={field.value ?? ""}
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                e.target.value === ""
                                                                    ? undefined
                                                                    : e.target.value
                                                            )
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="outcome"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Outcome</FormLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="How did it end?" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {FLOP_OUTCOMES.map((o) => (
                                                        <SelectItem
                                                            key={o}
                                                            value={o}
                                                        >
                                                            {
                                                                outcomeConfig[o]
                                                                    .label
                                                            }
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="causeOfFailure"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center justify-between">
                                                <FormLabel>
                                                    Cause of failure
                                                </FormLabel>
                                                <CharCounter
                                                    value={causeOfFailure}
                                                    max={80}
                                                />
                                            </div>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. No distribution channel"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Keep it short — this goes on the
                                                share card.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}

                        {/* ─── Step 2: The story ─── */}
                        {step === 2 && (
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="story.context"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                The idea — what was it, for whom?
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    rows={5}
                                                    placeholder="The problem you saw, the people you built it for, why you believed in it…"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="story.attempt"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                The execution — what did you
                                                actually build and try?
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    rows={5}
                                                    placeholder="What you shipped, how you launched, what you tried to make it work…"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="story.downfall"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                The downfall — what went wrong,
                                                concretely?
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    rows={5}
                                                    placeholder="The moment it stopped working, the numbers, the decision to call it…"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}

                        {/* ─── Step 3: The lessons ─── */}
                        {step === 3 && (
                            <div className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <FormLabel>Lessons (1–3)</FormLabel>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="sm"
                                            onClick={addLesson}
                                            disabled={lessons.length >= 3}
                                        >
                                            <Plus className="mr-1 h-4 w-4" />
                                            Add lesson
                                        </Button>
                                    </div>
                                    {lessons.map((_, index) => (
                                        <FormField
                                            key={index}
                                            control={form.control}
                                            name={`lessons.${index}`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="flex items-start gap-2">
                                                            <Textarea
                                                                rows={2}
                                                                placeholder={`Lesson ${index + 1} — standalone and quotable`}
                                                                {...field}
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() =>
                                                                    removeLesson(
                                                                        index
                                                                    )
                                                                }
                                                                disabled={
                                                                    lessons.length <=
                                                                    1
                                                                }
                                                                aria-label={`Remove lesson ${index + 1}`}
                                                            >
                                                                <Trash2 className="h-4 w-4 text-zinc-400" />
                                                            </Button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    ))}
                                    {form.formState.errors.lessons?.message && (
                                        <p className="text-sm font-medium text-red-500">
                                            {form.formState.errors.lessons.message}
                                        </p>
                                    )}
                                </div>
                                <FormField
                                    control={form.control}
                                    name="wouldDoDifferently"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                What would you do differently?{" "}
                                                <span className="font-normal text-zinc-400">
                                                    (optional)
                                                </span>
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    rows={3}
                                                    placeholder="With hindsight, what's the one thing you'd change?"
                                                    {...field}
                                                    value={field.value ?? ""}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="costs.monthsSpent"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Months spent{" "}
                                                    <span className="font-normal text-zinc-400">
                                                        (optional)
                                                    </span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="18"
                                                        {...field}
                                                        value={field.value ?? ""}
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                e.target.value === ""
                                                                    ? undefined
                                                                    : e.target.value
                                                            )
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="costs.moneyLost"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Money lost{" "}
                                                    <span className="font-normal text-zinc-400">
                                                        (optional)
                                                    </span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="$4,000"
                                                        {...field}
                                                        value={field.value ?? ""}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        )}

                        {/* ─── Step 4: Publish ─── */}
                        {step === 4 && (
                            <div className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Slug</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="my-failed-startup"
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(
                                                            e.target.value
                                                        );
                                                        form.trigger("slug");
                                                    }}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Lowercase letters, numbers and
                                                hyphens — the public URL of this
                                                flop.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="cardTemplate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Share card</FormLabel>
                                            <FormControl>
                                                <CardTemplatePicker
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    preview={previewValues()}
                                                    cacheKey={previewKey}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                This is the image people see when
                                                you share your flop.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="published"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center justify-between rounded-2xl border border-zinc-200 p-4">
                                            <div>
                                                <FormLabel>Published</FormLabel>
                                                <FormDescription>
                                                    Visible on your public
                                                    profile. Turn off to keep it
                                                    as a draft.
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={goBack}
                                disabled={step <= firstStep}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Button>
                            {step < LAST_STEP ? (
                                <Button type="button" onClick={goNext}>
                                    Next
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={form.formState.isSubmitting}
                                >
                                    {form.formState.isSubmitting && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    {isEdit ? "Save changes" : "Save flop"}
                                </Button>
                            )}
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
}
