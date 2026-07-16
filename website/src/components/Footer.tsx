"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const [socials, setSocials] = useState({
    facebook: "https://www.facebook.com/profile.php?id=100090141546352",
    instagram: "https://www.instagram.com/accessories_by_dn_?igsh=bjNqbDV5MHBIOWlt",
    tiktok: "https://www.tiktok.com/@dnfashionjewellery25?_r=1&_t=ZS-972Dv3H8MdD"
  });

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
    <footer className="bg-[#161921] text-[var(--muted)] py-16 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

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
            <p className="text-xs text-[var(--muted)] leading-relaxed max-w-[200px]">
              Your destination for trendy and aesthetic fashion jewelry.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2 mt-5">
              <a
                href={socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--border)] hover:border-[var(--accent)] hover:bg-white/5 transition-all duration-200"
              >
                <Image src="/icons/facebook.svg" alt="Facebook" width={15} height={15} className="opacity-70 hover:opacity-100" />
              </a>
              <a
                href={socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--border)] hover:border-[var(--accent)] hover:bg-white/5 transition-all duration-200"
              >
                <Image src="/icons/instagram.svg" alt="Instagram" width={15} height={15} className="opacity-70 hover:opacity-100" />
              </a>
              <a
                href={socials.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--border)] hover:border-[var(--accent)] hover:bg-white/5 transition-all duration-200"
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
                    className="text-xs text-[var(--muted)] hover:text-[var(--accent)] tracking-wide transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--accent)] mb-4" style={{ textShadow: "0 0 8px var(--accent-glow)" }}>
              Follow Us
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Facebook", icon: "/icons/facebook.svg", href: socials.facebook },
                { label: "Instagram", icon: "/icons/instagram.svg", href: socials.instagram },
                { label: "TikTok", icon: "/icons/tiktok.svg", href: socials.tiktok },
              ].map(({ label, icon, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-xs text-[var(--muted)] hover:text-[var(--accent)] tracking-wide transition-colors duration-150 group"
                  >
                    <span className="w-6 h-6 flex items-center justify-center rounded-full border border-[var(--border)] group-hover:border-[var(--accent)] transition-colors duration-150">
                      <Image src={icon} alt={label} width={13} height={13} className="opacity-70 group-hover:opacity-100" />
                    </span>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--accent)] mb-4" style={{ textShadow: "0 0 8px var(--accent-glow)" }}>
              Contact Us
            </h3>
            <address className="not-italic space-y-3">
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                158, Rajamahavihara Rd,<br />
                Mirihana, Kotte,<br />
                Sri Lanka 10100
              </p>
              <a
                href="mailto:chamudigunawardana071@gmail.com"
                className="text-xs text-[var(--muted)] hover:text-[var(--accent)] tracking-wide transition-colors duration-150 block"
              >
                chamudigunawardana071@gmail.com
              </a>
            </address>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-[var(--border)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-[var(--muted)] opacity-70 tracking-wide">
            &copy; {currentYear} Colour Eye. All rights reserved.
          </p>
          <p className="text-[11px] text-[var(--muted)] opacity-50 tracking-wide">
            Crafted with care in Sri Lanka
          </p>
        </div>

      </div>
    </footer>
  );
}