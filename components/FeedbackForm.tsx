"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FeedbackFormValues, FeedbackSchema } from "@/lib/feedbackValidation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { submitFeedback } from "@/actions/action";
import { useToast } from "@/hooks/use-toast";

export default function FeedbackForm() {
    const { toast } = useToast();
    
    const form = useForm<FeedbackFormValues>({
        resolver: zodResolver(FeedbackSchema),
        defaultValues: {
            name: "",
            email: "",
            message: "",
        },
    });

    const onSubmit = async (data: FeedbackFormValues) => {
        const result = await submitFeedback(data);
        
        if (result.success) {
            toast({
                title: "Feedback submitted",
                description: "Thank you for your feedback!",
                variant: "success",
            });
            form.reset();
        } else {
            toast({
                title: "Error",
                description: "Failed to submit feedback. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="Your email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                                <Textarea 
                                    placeholder="Your feedback message" 
                                    className="min-h-[120px]"
                                    {...field} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">Submit Feedback</Button>
            </form>
        </Form>
    );
} 