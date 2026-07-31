"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { doc, getDoc, collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const [socials, setSocials] = useState({
    facebook: "https://www.facebook.com/profile.php?id=100090141546352",
    instagram: "https://www.instagram.com/accessories_by_dn_?igsh=bjNqbDV5MHBIOWlt",
    tiktok: "https://www.tiktok.com/@dnfashionjewellery25?_r=1&_t=ZS-972Dv3H8MdD"
  });
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docSnap = await getDoc(doc(db, "settings", "global"));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSocials(prev => ({
            facebook: data.facebookUrl || prev.facebook,
            instagram: data.instagramUrl || prev.instagram,
            tiktok: data.tiktokUrl || prev.tiktok
          }));
        }
      } catch (err) {
        console.error("Error fetching global settings:", err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-[var(--background)] text-[var(--muted)] py-16 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-white/10 flex-shrink-0 shadow-[0_0_10px_var(--accent-glow)]">
                <Image
                  src="/logo.jpg"
                  alt="Colour Eye Logo"
                  width={36}
                  height={36}
                  className="object-cover w-full h-full"
                />
              </div>
              <span
                className="text-[var(--foreground)] text-sm font-semibold tracking-[0.12em] uppercase"
                style={{ fontFamily: "var(--font-serif)", fontSize: "15px" }}
              >
                Colour Eye
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-[200px]">
              Your destination for trendy and aesthetic fashion jewelry.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2 mt-5">
              <a
                href={socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--border)] hover:border-[var(--accent)] hover:bg-black/5 transition-all duration-200"
              >
                <Image src="/icons/facebook.svg" alt="Facebook" width={15} height={15} className="opacity-70 hover:opacity-100" />
              </a>
              <a
                href={socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--border)] hover:border-[var(--accent)] hover:bg-black/5 transition-all duration-200"
              >
                <Image src="/icons/instagram.svg" alt="Instagram" width={15} height={15} className="opacity-70 hover:opacity-100" />
              </a>
              <a
                href={socials.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--border)] hover:border-[var(--accent)] hover:bg-black/5 transition-all duration-200"
              >
                <Image src="/icons/tiktok.svg" alt="TikTok" width={15} height={15} className="opacity-70 hover:opacity-100" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--accent)] mb-4" style={{ textShadow: "0 0 8px var(--accent-glow)" }}>
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "Home", href: "/" },
                { label: "About Us", href: "/about" },
                { label: "Services", href: "/#services" },
                { label: "Contact", href: "/contact" },
                
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-xs text-slate-600 hover:text-[var(--accent)] tracking-wide transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--accent)] mb-4" style={{ textShadow: "0 0 8px var(--accent-glow)" }}>
              Customer Service
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "FAQ", href: "/faq" },
                { label: "Shipping & Returns", href: "/shipping-and-returns" },
                { label: "My Profile", href: "/profile" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-xs text-slate-600 hover:text-[var(--accent)] tracking-wide transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--accent)] mb-4" style={{ textShadow: "0 0 8px var(--accent-glow)" }}>
              Contact Us
            </h3>
            <address className="not-italic space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                158, Rajamahavihara Rd,<br />
                Mirihana, Kotte,<br />
                Sri Lanka 10100
              </p>
              <a
                href="mailto:chamudigunawardana071@gmail.com"
                className="text-xs text-slate-600 hover:text-[var(--accent)] tracking-wide transition-colors duration-150 block break-all"
              >
                chamudigunawardana071@gmail.com
              </a>
            </address>
          </div>

          {/* Newsletter / Highlight */}
          <div className="md:col-span-1">
            <h3 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--accent)] mb-4" style={{ textShadow: "0 0 8px var(--accent-glow)" }}>
              Join Our Newsletter
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newsletterEmail.trim()) return;
                setNewsletterLoading(true);
                try {
                  // Check for duplicate
                  const existing = await getDocs(query(collection(db, "newsletter"), where("email", "==", newsletterEmail.trim().toLowerCase())));
                  if (!existing.empty) {
                    toast.error("You're already subscribed!");
                  } else {
                    await addDoc(collection(db, "newsletter"), {
                      email: newsletterEmail.trim().toLowerCase(),
                      subscribedAt: new Date(),
                    });
                    toast.success("You're subscribed! 🎉");
                    setNewsletterEmail("");
                  }
                } catch (err) {
                  toast.error("Something went wrong. Please try again.");
                } finally {
                  setNewsletterLoading(false);
                }
              }}
              className="flex"
            >
              <input 
                type="email" 
                placeholder="Enter your email" 
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full bg-transparent border border-[var(--border)] border-r-0 rounded-l-full px-4 py-2.5 text-xs text-[var(--foreground)] focus:border-[var(--accent)] outline-none transition"
              />
              <button 
                type="submit"
                disabled={newsletterLoading}
                className="bg-[var(--accent)] text-[var(--background)] px-4 py-2.5 rounded-r-full text-[10px] font-bold uppercase tracking-widest hover:bg-[var(--foreground)] transition shadow-sm disabled:opacity-60"
              >
                {newsletterLoading ? "..." : "Join"}
              </button>
            </form>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-[var(--border)] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-slate-500 tracking-wide">
            &copy; {currentYear} Colour Eye. All rights reserved.
          </p>
          <div className="flex gap-4 items-center">
            <span className="text-[11px] text-slate-500 tracking-wide">
              Crafted with care in Sri Lanka
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}