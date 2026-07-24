"use client";

import Image from "next/image";
import { MapPin, Mail, PhoneCall } from "lucide-react";
import { useEffect, useState } from "react";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";

export default function ContactSection() {
  const [socials, setSocials] = useState({
    facebook: "https://www.facebook.com/profile.php?id=100090141546352",
    instagram: "https://www.instagram.com/accessories_by_dn_?igsh=bjNqbDV5MHBIOWlt",
    tiktok: "https://www.tiktok.com/@dnfashionjewellery25?_r=1&_t=ZS-972Dv3H8MdD"
  });

  const [activeTab, setActiveTab] = useState<"general" | "custom">("general");

  // Message Form States
  const [formData, setFormData] = useState({ name: "", email: "", message: "", orderDetails: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    
    try {
      await addDoc(collection(db, "messages"), {
        type: activeTab, // "general" or "custom"
        name: formData.name,
        email: formData.email,
        message: formData.message,
        orderDetails: activeTab === "custom" ? formData.orderDetails : null,
        status: "Unread",
        createdAt: serverTimestamp()
      });
      toast.success(activeTab === "custom" ? "Custom order request sent successfully!" : "Your message has been sent successfully!");
      setFormData({ name: "", email: "", message: "", orderDetails: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-[var(--background)] py-20 px-4 sm:px-6 lg:px-8" id="contact">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="text-center mb-16">
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
            Whether you have a question about our collections or you want to place a highly personalized custom order, we are here for you.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column: Contact Cards */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            
            {/* Card 1: Location */}
            <div className="flex items-start gap-4 p-6 bg-black/5 border border-[var(--border)] rounded-2xl">
              <div className="w-10 h-10 rounded-full bg-[var(--background)] border border-[var(--border)] flex items-center justify-center shrink-0">
                <MapPin size={18} className="text-[var(--accent)]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--foreground)] mb-1" style={{ fontFamily: "var(--font-serif)" }}>Our Store</h3>
                <p className="text-xs text-[var(--muted)] leading-relaxed">158, Rajamahavihara Rd, Mirihana, Kotte, Sri Lanka 10100</p>
              </div>
            </div>

            {/* Card 2: Email */}
            <div className="flex items-start gap-4 p-6 bg-black/5 border border-[var(--border)] rounded-2xl">
              <div className="w-10 h-10 rounded-full bg-[var(--background)] border border-[var(--border)] flex items-center justify-center shrink-0">
                <Mail size={18} className="text-[var(--accent)]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--foreground)] mb-1" style={{ fontFamily: "var(--font-serif)" }}>Email Us</h3>
                <a href="mailto:chamudigunawardana071@gmail.com" className="text-xs text-[var(--muted)] hover:text-[var(--accent)] break-all transition">
                  chamudigunawardana071@gmail.com
                </a>
              </div>
            </div>

            {/* Card 3: Socials */}
            <div className="flex items-start gap-4 p-6 bg-black/5 border border-[var(--border)] rounded-2xl">
              <div className="w-10 h-10 rounded-full bg-[var(--background)] border border-[var(--border)] flex items-center justify-center shrink-0">
                <PhoneCall size={18} className="text-[var(--accent)]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--foreground)] mb-2" style={{ fontFamily: "var(--font-serif)" }}>Connect Socially</h3>
                <div className="flex gap-2">
                  <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--background)] border border-[var(--border)] hover:border-[var(--accent)] transition">
                    <Image src="/icons/facebook.svg" alt="Facebook" width={14} height={14} className="opacity-70" />
                  </a>
                  <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--background)] border border-[var(--border)] hover:border-[var(--accent)] transition">
                    <Image src="/icons/instagram.svg" alt="Instagram" width={14} height={14} className="opacity-70" />
                  </a>
                  <a href={socials.tiktok} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--background)] border border-[var(--border)] hover:border-[var(--accent)] transition">
                    <Image src="/icons/tiktok.svg" alt="TikTok" width={14} height={14} className="opacity-70" />
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Dynamic Form */}
          <div className="w-full lg:w-2/3 bg-black/5 border border-[var(--border)] rounded-2xl p-6 sm:p-10 shadow-sm" id="message-form">
            
            {/* Tabs */}
            <div className="flex bg-[var(--background)] border border-[var(--border)] rounded-xl p-1 mb-8">
              <button 
                onClick={() => setActiveTab("general")}
                className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg transition ${
                  activeTab === "general" ? "bg-[var(--foreground)] text-[var(--background)] shadow-md" : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                General Inquiry
              </button>
              <button 
                onClick={() => setActiveTab("custom")}
                className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg transition ${
                  activeTab === "custom" ? "bg-[var(--accent)] text-white shadow-md shadow-[var(--accent-glow)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                Customized Order
              </button>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-[var(--foreground)] tracking-wide mb-2" style={{ fontFamily: "var(--font-serif)" }}>
                {activeTab === "general" ? "Send Us a Message" : "Request a Custom Creation"}
              </h3>
              <p className="text-sm text-[var(--muted)]">
                {activeTab === "general" 
                  ? "Inquire about bulk purchasing, shipping support, or general questions." 
                  : "Tell us exactly what you want! We specialize in custom frames and aesthetic accessories tailored to your style."}
              </p>
            </div>

            <form onSubmit={handleMessageSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-[var(--muted)] mb-2">Name</label>
                  <input 
                    type="text" required 
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--foreground)] focus:border-[var(--accent)] outline-none transition shadow-inner"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-[var(--muted)] mb-2">Email</label>
                  <input 
                    type="email" required 
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--foreground)] focus:border-[var(--accent)] outline-none transition shadow-inner"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              
              {activeTab === "custom" && (
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-[var(--muted)] mb-2">Desired Details (Size, Material, Theme)</label>
                  <input 
                    type="text" required 
                    value={formData.orderDetails} onChange={(e) => setFormData({...formData, orderDetails: e.target.value})}
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--foreground)] focus:border-[var(--accent)] outline-none transition shadow-inner"
                    placeholder="e.g. A4 size wooden frame with minimalist aesthetic"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-[var(--muted)] mb-2">Message</label>
                <textarea 
                  required rows={4}
                  value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--foreground)] focus:border-[var(--accent)] outline-none transition resize-none shadow-inner"
                  placeholder={activeTab === "general" ? "How can we help you?" : "Describe your custom request in detail..."}
                />
              </div>

              <button 
                type="submit" disabled={isSubmitting}
                className="w-full bg-[var(--accent)] text-[var(--background)] text-xs font-bold tracking-widest uppercase py-4 rounded-xl hover:bg-[var(--foreground)] hover:text-[var(--background)] transition shadow-[0_0_15px_var(--accent-glow)] disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Submit Request"}
              </button>

            </form>
          </div>

        </div>

      </div>
    </section>
  );
}