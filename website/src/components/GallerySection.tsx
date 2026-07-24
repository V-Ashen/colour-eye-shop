"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function GallerySection() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"), limit(6));
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setImages(fetched);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  if (loading || images.length === 0) return null;

  return (
    <section className="bg-[var(--background)] py-20 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--accent)] mb-1" style={{ textShadow: "0 0 8px var(--accent-glow)" }}>
            Our Portfolio
          </p>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-medium text-[var(--foreground)] tracking-tight mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Previous Works
          </h2>
          <p className="text-sm text-[var(--muted)] max-w-xl mx-auto leading-relaxed">
            A glimpse into the custom frames and curated accessories we've crafted for our amazing customers.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12">
          {images.map((img, index) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group aspect-square rounded-2xl overflow-hidden bg-black/5"
            >
              <img 
                src={img.url} 
                alt={img.alt || "Previous Work"} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 sm:p-6">
                {img.alt && (
                  <p className="text-white text-xs sm:text-sm font-semibold tracking-wide" style={{ fontFamily: "var(--font-serif)" }}>
                    {img.alt}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            href="/gallery"
            className="bg-[var(--accent)] text-[var(--background)] px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[var(--foreground)] transition shadow-[0_0_15px_var(--accent-glow)]"
          >
            View Full Gallery
          </Link>
        </div>
      </div>
    </section>
  );
}
