import FeedbackForm from "@/components/FeedbackForm";
import type { Metadata } from "next";

export default function FeedbackPage() {
    return (
        <div className="container mx-auto max-w-2xl py-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold mb-6">Send us your Feedback</h1>
                <FeedbackForm />
            </div>
        </div>
    );
}

export const metadata: Metadata = {
  title: "Feedback",
  description: "Share your thoughts and help us improve Flopfolio. Your feedback shapes the future of our platform.",
  openGraph: {
    title: "Give Feedback - Help Improve Flopfolio",
    description: "Share your thoughts and help us improve Flopfolio. Your feedback shapes the future of our platform."
  }
};
