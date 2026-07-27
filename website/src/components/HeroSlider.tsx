"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const banners = [
  {
    image: "/banners/banner1-clean.png",
    title: "Frame Your Best Moments.",
    subtitle: "Custom photo frames crafted with love in Sri Lanka.",
    buttonText: "SHOP FRAMES"
  },
  {
    image: "/banners/banner2-clean.png",
    title: "Make Their Birthday Unforgettable.",
    subtitle: "Personalized birthday cards, gift hampers & custom frames.",
    buttonText: "SHOP BIRTHDAY GIFTS"
  },
  {
    image: "/banners/banner3-clean.png",
    title: "Gifting, Reimagined.",
    subtitle: "From custom frames to curated hampers — every gift tells your story.",
    buttonText: "EXPLORE ALL GIFTS"
  }
];

export default function HeroSlider() {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goTo = (index: number) => setCurrentBanner(index);
  const goPrev = () => goTo((currentBanner - 1 + banners.length) % banners.length);
  const goNext = () => goTo((currentBanner + 1) % banners.length);

  return (
    <div 
      className="relative w-full h-[250px] sm:h-[400px] md:h-[600px] bg-[var(--background)] overflow-hidden cursor-pointer"
      onClick={() => document.getElementById("trending")?.scrollIntoView({ behavior: "smooth" })}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={currentBanner}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <Image
            src={banners[currentBanner].image}
            alt={banners[currentBanner].title}
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority={currentBanner === 0}
            className="transition-transform duration-[10000ms] ease-linear scale-100 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          
          <div className="absolute inset-0 flex flex-col justify-center items-start px-6 sm:px-16 md:px-24">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-[var(--accent)] mb-2 sm:mb-4 drop-shadow-md"
            >
              Colour Eye
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-3xl sm:text-5xl md:text-6xl text-white leading-tight mb-4 max-w-2xl drop-shadow-lg"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {banners[currentBanner].title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-sm sm:text-base md:text-lg text-slate-200 mb-8 max-w-lg drop-shadow-md"
            >
              {banners[currentBanner].subtitle}
            </motion.p>
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="bg-[var(--background)] text-[var(--foreground)] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[var(--accent)] hover:text-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            >
              {banners[currentBanner].buttonText}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Prev/Next arrows - Hidden on small mobile, visible on sm+ */}
      <div className="hidden sm:block">
        <button
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          aria-label="Previous banner"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full border border-black/10 glass-dark text-[var(--background)] opacity-0 hover:opacity-100 transition-all duration-300 hover:scale-110 hover:border-[var(--accent)]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          aria-label="Next banner"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full border border-black/10 glass-dark text-[var(--background)] opacity-0 hover:opacity-100 transition-all duration-300 hover:scale-110 hover:border-[var(--accent)]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      {/* Invisible hover zones to trigger arrow opacity */}
      <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-24 z-10 group" onMouseEnter={(e) => { const btn = e.currentTarget.previousElementSibling?.previousElementSibling?.previousElementSibling as HTMLElement; if(btn) btn.style.opacity = '1'; }} onMouseLeave={(e) => { const btn = e.currentTarget.previousElementSibling?.previousElementSibling?.previousElementSibling as HTMLElement; if(btn) btn.style.opacity = '0'; }} />
      <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-24 z-10 group" onMouseEnter={(e) => { const btn = e.currentTarget.previousElementSibling?.previousElementSibling as HTMLElement; if(btn) btn.style.opacity = '1'; }} onMouseLeave={(e) => { const btn = e.currentTarget.previousElementSibling?.previousElementSibling as HTMLElement; if(btn) btn.style.opacity = '0'; }} />

      {/* Animated Progress Bars */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-3">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={(e) => { e.stopPropagation(); goTo(index); }}
            aria-label={`Go to banner ${index + 1}`}
            className="h-1 sm:h-1.5 rounded-full overflow-hidden bg-black/5 relative transition-all duration-300"
            style={{ width: index === currentBanner ? "30px" : "15px" }}
          >
            {index === currentBanner && (
              <motion.div
                layoutId="active-indicator"
                className="absolute inset-0 bg-[var(--accent)] shadow-[0_0_8px_var(--accent-glow)]"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 5, ease: "linear" }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}