"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ShippingReturnsPage() {
  const [deliveryCharge, setDeliveryCharge] = useState<number>(400);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState<number>(10000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeliverySettings = async () => {
      try {
        const docSnap = await getDoc(doc(db, "settings", "delivery"));
        if (docSnap.exists()) {
          setDeliveryCharge(docSnap.data().charge || 400);
          setFreeDeliveryThreshold(docSnap.data().freeDeliveryThreshold || 10000);
        }
      } catch (error) {
        console.error("Error fetching delivery settings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDeliverySettings();
  }, []);
  return (
    <div className="min-h-screen bg-[var(--background)] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-semibold text-[var(--foreground)] mb-4 tracking-wide text-center" style={{ fontFamily: "var(--font-serif)" }}>
          Shipping & Returns
        </h1>
        <p className="text-[var(--muted)] text-center mb-12 max-w-xl mx-auto">
          Everything you need to know about our delivery times, costs, and exchange policies.
        </p>

        <div className="space-y-12">
          
          {/* Shipping Section */}
          <section className="bg-black/5 border border-[var(--border)] rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-6 flex items-center gap-3" style={{ fontFamily: "var(--font-serif)" }}>
              <span className="w-8 h-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accent)]"><path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"/><path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>
              </span>
              Shipping Information
            </h2>
            
            <div className="space-y-4 text-sm text-[var(--muted)] leading-relaxed">
              <p>
                We currently ship everywhere within <strong>Sri Lanka</strong>. Our team works hard to process and dispatch all orders within 1-2 business days of receiving them.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="border border-[var(--border)] rounded-xl p-4 bg-[var(--background)]">
                  <h4 className="font-semibold text-[var(--foreground)] mb-1">Standard Delivery</h4>
                  <p className="text-xs">2-4 Business Days</p>
                  <p className="text-[var(--accent)] font-semibold mt-2">
                    {loading ? "..." : `LKR ${deliveryCharge.toLocaleString()}`}
                  </p>
                </div>
                <div className="border border-[var(--border)] rounded-xl p-4 bg-[var(--background)]">
                  <h4 className="font-semibold text-[var(--foreground)] mb-1">Free Delivery</h4>
                  <p className="text-xs">On all orders above</p>
                  <p className="text-[var(--accent)] font-semibold mt-2">
                    {loading ? "..." : `LKR ${freeDeliveryThreshold.toLocaleString()}`}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Returns Section */}
          <section className="bg-black/5 border border-[var(--border)] rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-6 flex items-center gap-3" style={{ fontFamily: "var(--font-serif)" }}>
              <span className="w-8 h-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accent)]"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              </span>
              Returns & Exchanges
            </h2>
            
            <div className="space-y-4 text-sm text-[var(--muted)] leading-relaxed">
              <p>
                Because many of our products are customized and personalized specifically for you, <strong>we do not offer refunds or returns for change of mind.</strong>
              </p>
              <p>
                However, if your item arrives damaged, defective, or incorrect, we will happily arrange a replacement or exchange at no extra cost to you. 
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-4 text-xs">
                <li>Claims must be made within <strong>7 days</strong> of delivery.</li>
                <li>Items must be in their original packaging.</li>
                <li>Photographic proof of the damage is required.</li>
              </ul>
              
              <div className="mt-8 pt-6 border-t border-[var(--border)] text-center">
                <p className="mb-4">Need to process a return?</p>
                <Link href="/contact" className="inline-block bg-[var(--foreground)] text-[var(--background)] px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[var(--accent)] transition-colors">
                  Contact Support
                </Link>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
