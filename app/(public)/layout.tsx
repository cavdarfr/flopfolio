import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Home",
  description: "Document your entrepreneurial journey, from successes to setbacks. Share your story and inspire others with Flopfolio.",
  openGraph: {
    title: "Flopfolio - Document Your Entrepreneurial Journey",
    description: "Document your entrepreneurial journey, from successes to setbacks. Share your story and inspire others with Flopfolio."
  }
};

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col max-w-7xl mx-auto">
            <Header />
            {children}
            <Footer />
        </div>
    );
}
