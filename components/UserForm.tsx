"use client";
import { UserFormValues, UserSchema } from "@/lib/userValidation";
import { useFieldArray, useForm, SubmitHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import SelectStatus from "./SelectStatus";
import { saveUser, checkSlugAvailability } from "@/actions/action";
import { useAuth } from "@clerk/nextjs";
import SelectSocial from "./SelectSocial";
import { Loader2 } from "lucide-react";

export default function UserForm({ user }: { user: UserFormValues | null }) {
    const { toast } = useToast();
    const { userId } = useAuth();
    const [isCheckingSlug, setIsCheckingSlug] = useState(false);
    const [slugError, setSlugError] = useState<string | null>(null);

    // Initialize avatarUrl state with user's avatar if available, or default
    const [avatarUrl, setAvatarUrl] = useState<string>(
        user?.avatarUrl || "https://api.dicebear.com/9.x/pixel-art/svg?seed=3"
    );

    const form = useForm<UserFormValues>({
        resolver: zodResolver(UserSchema),
        defaultValues: {
            name: user?.name || "",
            slug: user?.slug || "",
            bio: user?.bio || "",
            avatarUrl: avatarUrl, // Use the state value
            socials: user?.socials || [],
            business: user?.business || [],
        },
    });

    // Debounced slug validation
    const validateSlug = useCallback(
        async (slug: string) => {
            if (!slug || slug === user?.slug) {
                setSlugError(null);
                return;
            }

            setIsCheckingSlug(true);
            try {
                const response = await checkSlugAvailability(slug, userId);
                if (response.success) {
                    const { available } = response.data;
                    if (!available) {
                        setSlugError("This slug is already taken");
                    } else {
                        setSlugError(null);
                    }
                } else {
                    setSlugError("Error checking slug availability");
                }
            } catch (error) {
                console.error("Error checking slug availability:", error);
                setSlugError("Error checking slug availability");
            } finally {
                setIsCheckingSlug(false);
            }
        },
        [userId, user?.slug]
    );

    // Watch slug changes and validate
    useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            if (name === "slug") {
                const slug = value.slug;
                if (slug) {
                    const timeoutId = setTimeout(() => {
                        validateSlug(slug);
                    }, 500); // 500ms debounce
                    return () => clearTimeout(timeoutId);
                }
            }
        });
        return () => subscription.unsubscribe();
    }, [form, validateSlug]);

    // Update form value when avatarUrl state changes
    useEffect(() => {
        form.setValue("avatarUrl", avatarUrl);
    }, [avatarUrl, form]);

    const {
        fields: socialsFields,
        append: appendSocial,
        remove: removeSocial,
    } = useFieldArray({
        control: form.control,
        name: "socials",
    });

    const {
        fields: businessFields,
        append: appendBusiness,
        remove: removeBusiness,
    } = useFieldArray({
        control: form.control,
        name: "business",
    });

    const generateRandomAvatar = () => {
        const randomSeed = Math.random().toString(36).substring(2, 25);
        const randomAvatar = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${randomSeed}`;
        setAvatarUrl(randomAvatar);
    };

    const onSubmit: SubmitHandler<UserFormValues> = async (data) => {
        if (!userId) {
            toast({
                title: "Error",
                description: "User ID is required",
                variant: "destructive",
            });
            return;
        }

        try {
            // No need to manually set avatarUrl here, it's already in the form data
            const finalData = data;

            const res = await saveUser(finalData, userId);

            if (res?.success) {
                toast({
                    title: "Success",
                    description: "User data has been saved successfully",
                    variant: "success",
                });
            } else {
                // Display error with location for easier debugging
                const errorLocation = res?.errorLocation
                    ? ` (in ${res.errorLocation})`
                    : "";

                toast({
                    title: "Error Saving Data",
                    description: `${
                        res?.error || "Unknown error"
                    }${errorLocation}`,
                    variant: "destructive",
                });

                // Log for debugging
                console.error("Error saving user:", {
                    message: res?.error,
                    location: res?.errorLocation,
                });
            }
        } catch (error) {
            console.error("Form submission error:", error);
            toast({
                title: "Submission Error",
                description: "An unexpected error occurred. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 w-full"
            >
                {/* User Profile Accordion */}
                <Accordion
                    type="single"
                    collapsible
                    defaultValue="user-profile"
                >
                    <AccordionItem value="user-profile">
                        <AccordionTrigger
                            className={cn(
                                "text-lg font-semibold",
                                (form.formState.errors.name ||
                                    form.formState.errors.slug) &&
                                    "text-red-500",
                                "no-underline hover:no-underline"
                            )}
                        >
                            User Profile
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4">
                            <div className="flex flex-col items-center gap-4">
                                {/* Avatar Section */}
                                <div className="relative flex">
                                    <Image
                                        src={avatarUrl ?? ""}
                                        alt="Avatar"
                                        className="w-24 h-24 rounded-full border"
                                        width={96}
                                        height={96}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={generateRandomAvatar}
                                    >
                                        Random Avatar
                                    </Button>
                                    <UploadButton
                                        endpoint="imageUploader"
                                        onClientUploadComplete={(res) => {
                                            if (res?.[0]?.url) {
                                                setAvatarUrl(res[0].url);
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Name and Slug in the same row */}
                            {/* <div className="flex flex-col sm:flex-row gap-4"> */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Slug</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        placeholder="Enter your slug"
                                                        {...field}
                                                        className={cn(
                                                            slugError &&
                                                                "border-red-500"
                                                        )}
                                                    />
                                                    {isCheckingSlug && (
                                                        <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
                                                    )}
                                                </div>
                                            </FormControl>
                                            <FormMessage>
                                                {slugError ||
                                                    form.formState.errors.slug
                                                        ?.message}
                                            </FormMessage>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Bio Field */}
                            <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bio</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter your bio"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                {/* Socials Accordion */}
                <Accordion type="single" collapsible>
                    <AccordionItem value="socials">
                        <AccordionTrigger
                            className={cn(
                                "text-lg font-semibold",
                                form.formState.errors.socials && "text-red-500",
                                "no-underline hover:no-underline"
                            )}
                        >
                            Socials
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4">
                            {socialsFields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="space-y-2 border p-4 rounded"
                                >
                                    <FormField
                                        control={form.control}
                                        name={`socials.${index}.name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Platform</FormLabel>
                                                <FormControl>
                                                    <SelectSocial
                                                        value={field.value}
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`socials.${index}.url`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>URL</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter social URL"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => removeSocial(index)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() =>
                                    appendSocial({
                                        _id: "",
                                        name: "github",
                                        url: "",
                                    })
                                }
                            >
                                Add Social
                            </Button>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                {/* Business Accordion */}
                <Accordion type="single" collapsible>
                    <AccordionItem value="business">
                        <AccordionTrigger
                            className={cn(
                                "text-lg font-semibold",
                                form.formState.errors.business &&
                                    "text-red-500",
                                "no-underline hover:no-underline"
                            )}
                        >
                            Business
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4">
                            {businessFields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="space-y-2 border p-4 rounded"
                                >
                                    <div className="flex items-center gap-4">
                                        <FormField
                                            control={form.control}
                                            name={`business.${index}.logoUrl`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Logo</FormLabel>
                                                    <FormControl>
                                                        <div className="flex items-center gap-2">
                                                            {field.value && (
                                                                <Image
                                                                    src={
                                                                        field.value
                                                                    }
                                                                    alt="Business Logo"
                                                                    width={68}
                                                                    height={68}
                                                                    className="border rounded-full w-20 h-20"
                                                                />
                                                            )}
                                                            <UploadButton
                                                                endpoint="imageUploader"
                                                                onClientUploadComplete={(
                                                                    res
                                                                ) => {
                                                                    if (
                                                                        res?.[0]
                                                                            ?.url
                                                                    ) {
                                                                        form.setValue(
                                                                            `business.${index}.logoUrl`,
                                                                            res[0]
                                                                                .url
                                                                        );
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="w-full flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                        <FormField
                                            control={form.control}
                                            name={`business.${index}.name`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Name</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter business name"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`business.${index}.status`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Status
                                                    </FormLabel>
                                                    <FormControl>
                                                        <SelectStatus
                                                            value={
                                                                field.value ||
                                                                "active"
                                                            }
                                                            onValueChange={
                                                                field.onChange
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
                                        name={`business.${index}.description`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Description
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter business description"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name={`business.${index}.lessons`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Lessons</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Enter lessons"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => removeBusiness(index)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() =>
                                    appendBusiness({
                                        _id: "",
                                        name: "",
                                        description: "",
                                        status: "pending",
                                        lessons: "",
                                        logoUrl: "",
                                    })
                                }
                            >
                                Add Business
                            </Button>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                {/* Submit Button */}
                <Button type="submit">Save</Button>
            </form>
        </Form>
    );
}
