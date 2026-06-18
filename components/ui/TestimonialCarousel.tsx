"use client";

import React from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

const TESTIMONIAL_IMAGES = [
  {
    id: 1,
    src: "https://res.cloudinary.com/djpsoc2jh/image/upload/v1781784311/testimonial1_gpz8el.jpg",
  },
  {
    id: 2,
    src: "https://res.cloudinary.com/djpsoc2jh/image/upload/v1781784310/testimonial2_dzz6wv.jpg",
  },
  {
    id: 3,
    src: "https://res.cloudinary.com/djpsoc2jh/image/upload/v1781784310/testimonial3_odguev.jpg",
  },
  {
    id: 4,
    src: "https://res.cloudinary.com/djpsoc2jh/image/upload/v1781784310/testimonial4_psllav.jpg",
  },
  {
    id: 5,
    src: "https://res.cloudinary.com/djpsoc2jh/image/upload/v1781784310/testimonial5_jbw3e5.jpg",
  },
];

export default function TestimonialCarousel() {
  // Triple the array to ensure a seamless infinite scroll loop regardless of screen size
  const scrollingItems = [
    ...TESTIMONIAL_IMAGES,
    ...TESTIMONIAL_IMAGES,
    ...TESTIMONIAL_IMAGES,
  ];

  return (
    <div className="w-full mb-16 overflow-hidden py-4">
      {/* Inline styles for the infinite scrolling marquee animation */}
      <style>{`
        @keyframes marquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-33.333%, 0, 0);
          }
        }
        .animate-marquee-loop {
          animation: marquee 35s linear infinite;
        }
        .animate-marquee-loop:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Header section for the visual testimonials */}
      <div className="text-center mb-8">
        <span className="text-[10px] uppercase tracking-widest text-[#C9A84C] font-sans font-bold flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#C9A84C] animate-pulse" />
          Delivered Showcase
        </span>
        <h2 className="mt-1 text-2xl sm:text-3xl font-display font-light text-[#1C1C1E]">
          Client <span className="font-bold text-[#C9A84C] italic">Installations</span>
        </h2>
        <p className="mt-1 text-[11px] text-stone-500 font-sans tracking-wide">
          (Hover to pause showcase)
        </p>
      </div>

      {/* Continuous Marquee Wrapper */}
      <div className="relative w-full overflow-hidden flex animate-fade-in">
        {/* Soft radial gradients on the edges to fade in/out for a premium visual effect */}
        <div className="absolute top-0 left-0 bottom-0 w-20 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-l from-[#FAF8F5] via-[#FAF8F5]/80 to-transparent z-10 pointer-events-none" />

        {/* Sliding Track */}
        <div className="flex space-x-6 animate-marquee-loop whitespace-nowrap min-w-full">
          {scrollingItems.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="flex-shrink-0 w-[240px] sm:w-[320px] aspect-[3/4] bg-white border border-[#E0DDD8] p-3 hover:border-[#C9A84C] hover:shadow-[0_8px_24px_rgba(201,168,76,0.06)] transition-all duration-300 rounded-sm"
            >
              {/* Photo Frame Area */}
              <div className="bg-stone-50 border border-stone-200/80 rounded w-full h-full relative overflow-hidden">
                <Image
                  src={item.src}
                  alt={`Client Installation ${item.id}`}
                  fill
                  sizes="(max-width: 640px) 240px, 320px"
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />

                {/* Subtly animated decorative lines simulating scanner corner guides */}
                <span className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/60 mix-blend-difference" />
                <span className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/60 mix-blend-difference" />
                <span className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/60 mix-blend-difference" />
                <span className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-white/60 mix-blend-difference" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
