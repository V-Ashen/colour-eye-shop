"use client";

import { motion } from "framer-motion";
import { Image as ImageIcon, Camera, ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

const frames = [
  {
    id: "mini",
    title: "Mini Frame",
    description: "Perfect for desks & small spaces"
  },
  {
    id: "5x5",
    title: "5x5 Inch",
    description: "Classic square format for IG photos"
  },
  {
    id: "6x8",
    title: "6x8 Inch",
    description: "Standard portrait perfection"
  },
  {
    id: "a4",
    title: "A4 Frame",
    description: "Ideal for wall collages & gifts"
  },
  {
    id: "a3",
    title: "A3 Frame",
    description: "Large statement piece for your home"
  },
  {
    id: "polaroid",
    title: "Polaroid Photo",
    description: "Vintage vibes for your memory wall"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function CustomFramesGuide() {
  const router = useRouter();

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[var(--background)] relative overflow-hidden" id="custom-frames">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[var(--accent)] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 mb-3">
            <Sparkles size={14} className="text-[var(--accent)]" />
            <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--accent)]" style={{ textShadow: "0 0 10px var(--accent-glow)" }}>
              Our Specialty
            </p>
            <Sparkles size={14} className="text-[var(--accent)]" />
          </div>
          <h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-medium text-[var(--foreground)] leading-tight tracking-tight mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Custom Photo Frames
          </h2>
          <p className="text-sm text-[var(--muted)] max-w-xl mx-auto leading-relaxed">
            Turn your favorite memories into aesthetic masterpieces. Choose your perfect size, and we will craft a premium frame just for you.
          </p>
        </div>

        {/* Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6"
        >
          {frames.map((frame) => (
            <motion.div 
              key={frame.id} 
              variants={itemVariants}
              className="group flex flex-col relative"
            >
              {/* Details */}
              <div className="text-center flex-1 flex flex-col p-6 bg-white/40 border border-[var(--border)] rounded-2xl hover:border-[var(--accent)] hover:shadow-[0_0_15px_var(--accent-glow)] transition-all duration-300">
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2 tracking-wide" style={{ fontFamily: "var(--font-serif)" }}>{frame.title}</h3>
                <p className="text-xs text-[var(--muted)]">{frame.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <div className="glass-glow border border-[var(--border)] rounded-2xl p-8 sm:p-12 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-[var(--accent)] transition-colors duration-500 group">
            <div className="text-left">
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2 tracking-wide" style={{ fontFamily: "var(--font-serif)" }}>Ready to frame a memory?</h3>
              <p className="text-sm text-[var(--muted)]">If you want a customized order, drop us a message.</p>
            </div>
            <button 
              onClick={() => router.push("/contact#message-form")}
              className="flex-shrink-0 flex items-center justify-center gap-2 bg-[var(--accent)] text-[var(--background)] text-[11px] font-bold uppercase tracking-widest px-8 py-4 rounded-full hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all duration-300 shadow-[0_0_15px_var(--accent-glow)] hover:shadow-[0_0_25px_var(--accent-glow)] group-hover:scale-105"
            >
              Drop a Message <ArrowRight size={14} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
