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
import { useState } from "react";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import SelectStatus from "./SelectStatus";
import { saveUser } from "@/actions/action";
import { useAuth } from "@clerk/nextjs";
import SelectSocial from "./SelectSocial";

export default function UserForm({ user }: { user: UserFormValues | null }) {
    const { toast } = useToast();
    const { userId } = useAuth();

    const [avatarUrl, setAvatarUrl] = useState<string | null>(
        "https://api.dicebear.com/9.x/pixel-art/svg?seed=3"
    );

    const form = useForm<UserFormValues>({
        resolver: zodResolver(UserSchema),
        defaultValues: {
            name: user?.name || "",
            slug: user?.slug || "",
            bio: user?.bio || "",
            avatarUrl:
                user?.avatarUrl ||
                "https://api.dicebear.com/9.x/pixel-art/svg?seed=9",
            socials: user?.socials || [],
            business: user?.business || [],
        },
    });

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

        const finalData = {
            ...data,
            avatarUrl:
                data.avatarUrl ??
                "https://api.dicebear.com/9.x/pixel-art/svg?seed=9",
        };

        console.log(finalData.business, "finalData");

        const res = await saveUser(finalData, userId);
        if (res?.success) {
            toast({
                title: "User data saved",
                variant: "success",
                description: "User data has been saved successfully",
            });
        } else {
            console.error("Error saving user:", res?.error);
        }
    };

    console.log(form.formState.errors, "errors");

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
                                                <Input
                                                    placeholder="Enter your slug"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
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
