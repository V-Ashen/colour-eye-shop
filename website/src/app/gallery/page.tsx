"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import Link from "next/link";

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
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

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      
      <main className="flex-1 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16">
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--accent)] mb-2" style={{ textShadow: "0 0 8px var(--accent-glow)" }}>
              Our Portfolio
            </p>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-medium text-[var(--foreground)] tracking-tight mb-4"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Previous Works
            </h1>
            <p className="text-sm text-[var(--muted)] max-w-xl mx-auto leading-relaxed mb-8">
              Explore our curated collection of custom frames, aesthetic accessories, and beautifully crafted pieces we have created for our beloved customers.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] hover:text-[var(--foreground)] border border-[var(--border)] px-6 py-3 rounded-full hover:border-[var(--accent)] transition-all"
            >
              ← Back to Shop
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_var(--accent-glow)]"></div>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-20 bg-black/5 border border-[var(--border)] rounded-3xl">
              <p className="text-sm font-semibold text-[var(--foreground)]">Nothing to show yet</p>
              <p className="text-xs text-[var(--muted)]">Check back later for our new works.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {images.map((img, index) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="relative group aspect-square rounded-2xl overflow-hidden bg-black/5 border border-[var(--border)]"
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
          )}

        </div>
      </main>
    </div>
  );
}
