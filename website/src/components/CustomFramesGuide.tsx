"use client";

import { motion } from "framer-motion";
import { Image as ImageIcon, Camera, ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

const frames = [
  {
    id: "mini",
    title: "Mini Frame",
    price: 575,
    aspect: "aspect-square",
    icon: <ImageIcon size={24} strokeWidth={1.5} />,
    description: "Perfect for desks & small spaces"
  },
  {
    id: "5x5",
    title: "5x5 Inch",
    price: 750,
    aspect: "aspect-square",
    icon: <ImageIcon size={24} strokeWidth={1.5} />,
    description: "Classic square format for IG photos"
  },
  {
    id: "6x8",
    title: "6x8 Inch",
    price: 1500,
    aspect: "aspect-[3/4]",
    icon: <ImageIcon size={24} strokeWidth={1.5} />,
    description: "Standard portrait perfection"
  },
  {
    id: "a4",
    title: "A4 Frame",
    price: 1950,
    aspect: "aspect-[1/1.414]",
    icon: <ImageIcon size={24} strokeWidth={1.5} />,
    description: "Ideal for wall collages & gifts"
  },
  {
    id: "a3",
    title: "A3 Frame",
    price: 3000,
    aspect: "aspect-[1/1.414]",
    icon: <ImageIcon size={30} strokeWidth={1.5} />,
    description: "Large statement piece for your home"
  },
  {
    id: "polaroid",
    title: "Polaroid Photo",
    price: 100,
    aspect: "aspect-[3/4]",
    icon: <Camera size={24} strokeWidth={1.5} />,
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
              {/* Visual representation of the frame ratio */}
              <div className="mb-4 flex items-end justify-center h-32 w-full p-2">
                <div className={`${frame.aspect} bg-black/5 border border-black/10 rounded-lg flex items-center justify-center w-full max-h-full group-hover:border-[var(--accent)] group-hover:bg-black/10 group-hover:shadow-[0_0_15px_var(--accent-glow)] transition-all duration-300 relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors duration-300 group-hover:scale-110 transform">
                    {frame.icon}
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="text-center flex-1 flex flex-col">
                <h3 className="text-sm font-semibold text-[var(--foreground)] mb-1 tracking-wide" style={{ fontFamily: "var(--font-serif)" }}>{frame.title}</h3>
                <p className="text-[10px] text-[var(--muted)] mb-3 flex-1">{frame.description}</p>
                <div className="inline-block mt-auto">
                  <span className="text-[11px] font-bold tracking-widest text-[var(--accent)] bg-[var(--accent)]/10 px-3 py-1.5 rounded-full border border-[var(--accent)]/20 shadow-sm">
                    LKR {frame.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <div className="glass-glow border border-[var(--border)] rounded-2xl p-8 sm:p-12 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-[var(--accent)] transition-colors duration-500 group">
            <div className="text-left">
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2 tracking-wide" style={{ fontFamily: "var(--font-serif)" }}>Ready to frame a memory?</h3>
              <p className="text-sm text-[var(--muted)]">Customized frames are also available via direct order.</p>
            </div>
            <button 
              onClick={() => router.push("/shop")}
              className="flex-shrink-0 flex items-center justify-center gap-2 bg-[var(--accent)] text-[var(--background)] text-[11px] font-bold uppercase tracking-widest px-8 py-4 rounded-full hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all duration-300 shadow-[0_0_15px_var(--accent-glow)] hover:shadow-[0_0_25px_var(--accent-glow)] group-hover:scale-105"
            >
              Order Now <ArrowRight size={14} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
