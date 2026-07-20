"use client";

import Image from "next/image";
import { MapPin, Mail, PhoneCall } from "lucide-react";
import { useEffect, useState } from "react";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ContactSection() {
  const [socials, setSocials] = useState({
    facebook: "https://www.facebook.com/profile.php?id=100090141546352",
    instagram: "https://www.instagram.com/accessories_by_dn_?igsh=bjNqbDV5MHBIOWlt",
    tiktok: "https://www.tiktok.com/@dnfashionjewellery25?_r=1&_t=ZS-972Dv3H8MdD"
  });

  // Message Form States
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

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

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setIsSubmitting(true);
    setSubmitStatus("idle");
    
    try {
      await addDoc(collection(db, "messages"), {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        status: "Unread",
        createdAt: serverTimestamp()
      });
      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch (error) {
      console.error("Error sending message:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-[var(--background)] py-20 px-4 sm:px-6 lg:px-8" id="contact">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--accent)] mb-1" style={{ textShadow: "0 0 8px var(--accent-glow)" }}>
            Contact
          </p>
          <h2
            className="text-3xl font-semibold text-[var(--foreground)] tracking-wide mb-3"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Get In Touch
          </h2>
          <p className="text-sm text-[var(--muted)] max-w-xl mx-auto leading-relaxed">
            Have a question about our collections or need help with your order? Reach out to our dedicated team anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1: Location */}
          <div className="group flex flex-col items-center text-center bg-black/5 border border-[var(--border)] rounded-2xl p-8 hover:bg-black/10 hover:border-[var(--accent)] transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-black/10 border border-[var(--border)] flex items-center justify-center mb-5 group-hover:scale-105 group-hover:border-[var(--accent)] transition-all duration-300 shadow-sm">
              <MapPin size={20} className="text-[var(--accent)]" strokeWidth={1.5} />
            </div>
            <h3
              className="text-lg font-semibold text-[var(--foreground)] mb-3 tracking-wide"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Our Store
            </h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed max-w-[200px]">
              158, Rajamahavihara Rd, Mirihana, Kotte, Sri Lanka 10100
            </p>
          </div>

          {/* Card 2: Email */}
          <div className="group flex flex-col items-center text-center bg-black/5 border border-[var(--border)] rounded-2xl p-8 hover:bg-black/10 hover:border-[var(--accent)] transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-black/10 border border-[var(--border)] flex items-center justify-center mb-5 group-hover:scale-105 group-hover:border-[var(--accent)] transition-all duration-300 shadow-sm">
              <Mail size={20} className="text-[var(--accent)]" strokeWidth={1.5} />
            </div>
            <h3
              className="text-lg font-semibold text-[var(--foreground)] mb-2 tracking-wide"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Email Us
            </h3>
            <p className="text-xs text-[var(--muted)] mb-5 tracking-wide">
              chamudigunawardana071@gmail.com
            </p>
            <a
              href="mailto:chamudigunawardana071@gmail.com"
              className="inline-flex items-center gap-1.5 border border-[var(--border)] text-[var(--foreground)] text-[10px] font-semibold tracking-widest uppercase px-5 py-2 rounded-full hover:bg-[var(--accent)] hover:text-[var(--background)] hover:border-[var(--accent)] transition-all duration-200 shadow-sm"
            >
              Send an Email
            </a>
          </div>

          {/* Card 3: Social */}
          <div className="group flex flex-col items-center text-center bg-black/5 border border-[var(--border)] rounded-2xl p-8 hover:bg-black/10 hover:border-[var(--accent)] transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-black/10 border border-[var(--border)] flex items-center justify-center mb-5 group-hover:scale-105 group-hover:border-[var(--accent)] transition-all duration-300 shadow-sm">
              <PhoneCall size={20} className="text-[var(--accent)]" strokeWidth={1.5} />
            </div>
            <h3
              className="text-lg font-semibold text-[var(--foreground)] mb-2 tracking-wide"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Connect Socially
            </h3>
            <p className="text-sm text-[var(--muted)] mb-5 leading-relaxed">
              Follow us for daily drops and style inspiration!
            </p>
            <div className="flex items-center gap-3">
              <a
                href={socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border)] hover:border-[var(--accent)] hover:bg-black/5 transition-all duration-200"
                aria-label="Facebook"
              >
                <Image src="/icons/facebook.svg" alt="Facebook" width={18} height={18} className="opacity-70 hover:opacity-100" />
              </a>
              <a
                href={socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border)] hover:border-[var(--accent)] hover:bg-black/5 transition-all duration-200"
                aria-label="Instagram"
              >
                <Image src="/icons/instagram.svg" alt="Instagram" width={18} height={18} className="opacity-70 hover:opacity-100" />
              </a>
              <a
                href={socials.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border)] hover:border-[var(--accent)] hover:bg-black/5 transition-all duration-200"
                aria-label="TikTok"
              >
                <Image src="/icons/tiktok.svg" alt="TikTok" width={18} height={18} className="opacity-70 hover:opacity-100" />
              </a>
            </div>
          </div>

        </div>

        {/* Message Form */}
        <div id="message-form" className="mt-16 max-w-2xl mx-auto bg-black/5 border border-[var(--border)] rounded-2xl p-8 shadow-sm">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-[var(--foreground)] tracking-wide mb-2" style={{ fontFamily: "var(--font-serif)" }}>
              Send Us a Message
            </h3>
            <p className="text-sm text-[var(--muted)]">Inquire about custom orders, bulk purchasing, or support.</p>
          </div>

          <form onSubmit={handleMessageSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-[var(--muted)] mb-2">Name</label>
                <input 
                  type="text" required 
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-transparent border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--foreground)] focus:border-[var(--accent)] outline-none transition"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-[var(--muted)] mb-2">Email</label>
                <input 
                  type="email" required 
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-transparent border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--foreground)] focus:border-[var(--accent)] outline-none transition"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[var(--muted)] mb-2">Message</label>
              <textarea 
                required rows={4}
                value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full bg-transparent border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--foreground)] focus:border-[var(--accent)] outline-none transition resize-none"
                placeholder="How can we help you?"
              />
            </div>

            <button 
              type="submit" disabled={isSubmitting}
              className="w-full bg-[var(--accent)] text-white text-xs font-bold tracking-widest uppercase py-4 rounded-xl hover:bg-[var(--foreground)] transition shadow-[0_0_15px_var(--accent-glow)] disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>

            {submitStatus === "success" && (
              <p className="text-green-600 text-xs font-bold text-center mt-3 tracking-wide">Your message has been sent successfully!</p>
            )}
            {submitStatus === "error" && (
              <p className="text-red-500 text-xs font-bold text-center mt-3 tracking-wide">Failed to send message. Please try again.</p>
            )}
          </form>
        </div>

      </div>
    </section>
  );
}