// Case Component - Responsive
"use client";

import { useEffect, useState } from "react";
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";

// Sample testimonials data
const testimonials = [
    {
        id: 1,
        name: "Alex M.",
        quote: "Flopfolio transformed the way I view my past ventures. Every setback is now a lesson that propels me forward. Connecting with mentors and peers has been invaluable.",
    },
    {
        id: 2,
        name: "Jamie L.",
        quote: "I used to hide my failures, but with Flopfolio, I proudly showcase them as badges of honor. The community support and insights have been game changers.",
    },
    {
        id: 3,
        name: "Jordan P.",
        quote: "Flopfolio is a game-changer! The platform provided actionable insights and connected me with like-minded entrepreneurs who truly understand the journey.",
    },
    {
        id: 4,
        name: "Taylor S.",
        quote: "The detailed project showcase and reflective lessons have helped me understand my business better. Flopfolio is a must-have tool for every entrepreneur.",
    },
    {
        id: 5,
        name: "Jordan P.",
        quote: "Flopfolio is a game-changer! The platform provided actionable insights and connected me with like-minded entrepreneurs who truly understand the journey.",
    },
    {
        id: 6,
        name: "Taylor S.",
        quote: "The detailed project showcase and reflective lessons have helped me understand my business better. Flopfolio is a must-have tool for every entrepreneur.",
    },
];

function Case() {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!api) {
            return;
        }

        setTimeout(() => {
            if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
                setCurrent(0);
                api.scrollTo(0);
            } else {
                api.scrollNext();
                setCurrent(current + 1);
            }
        }, 3000);
    }, [api, current]);

    return (
        <section className="mt-16 md:mt-32 px-4 md:px-16 py-8 md:py-20 bg-white rounded-2xl shadow-lg">
            <div className="container mx-auto">
                <div className="flex flex-col gap-6 md:gap-10">
                    <h2 className="text-2xl md:text-3xl lg:text-5xl tracking-tighter font-regular text-center md:text-right">
                        Some testimonials
                    </h2>

                    <Carousel setApi={setApi} className="w-full" opts={{ align: "start" }}>
                        <CarouselContent className="-ml-2 md:-ml-4">
                            {testimonials.map((testimonial) => (
                                <CarouselItem
                                    key={testimonial.id}
                                    className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 p-2 md:p-4"
                                >
                                    <div className="h-full flex flex-col justify-between bg-slate-100 dark:bg-slate-800 rounded-xl p-5 md:p-6 shadow-sm">
                                        <p className="text-sm md:text-base italic text-zinc-600 dark:text-zinc-300">
                                            &ldquo;{testimonial.quote}&rdquo;
                                        </p>
                                        <span className="mt-4 text-sm md:text-base font-semibold text-right">
                                            - {testimonial.name}
                                        </span>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
            </div>
        </section>
    );
}

export { Case };
