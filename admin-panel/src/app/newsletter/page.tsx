"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";
import { Mail, Trash2, Download } from "lucide-react";

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscribers = async () => {
    try {
      const q = query(collection(db, "newsletter"), orderBy("subscribedAt", "desc"));
      const snapshot = await getDocs(q);
      setSubscribers(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      toast.error("Failed to load subscribers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubscribers(); }, []);

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Remove ${email} from newsletter?`)) return;
    try {
      await deleteDoc(doc(db, "newsletter", id));
      toast.success("Subscriber removed.");
      setSubscribers(prev => prev.filter(s => s.id !== id));
    } catch {
      toast.error("Failed to remove subscriber.");
    }
  };

  const handleExportCSV = () => {
    const csv = ["Email,Subscribed At", ...subscribers.map(s =>
      `${s.email},${s.subscribedAt?.toDate().toLocaleString() || "Unknown"}`
    )].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter_subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported!");
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#C9A84C] mb-1">Marketing</p>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            Newsletter Subscribers
          </h1>
          <p className="text-sm text-slate-400 mt-1">{subscribers.length} total subscriber{subscribers.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={subscribers.length === 0}
          className="flex items-center gap-2 bg-[#C9A84C] text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#b8943e] transition disabled:opacity-50"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : subscribers.length === 0 ? (
        <div className="text-center py-20 bg-[#1A1A1E] border border-[#2A2A2E] rounded-2xl">
          <Mail size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 font-semibold">No subscribers yet.</p>
          <p className="text-slate-600 text-xs mt-1">Subscribers will appear here when customers sign up from the website footer.</p>
        </div>
      ) : (
        <div className="bg-[#1A1A1E] border border-[#2A2A2E] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2A2A2E]">
                  <th className="text-left px-6 py-4 text-[10px] font-bold tracking-widest uppercase text-slate-500">#</th>
                  <th className="text-left px-6 py-4 text-[10px] font-bold tracking-widest uppercase text-slate-500">Email</th>
                  <th className="text-left px-6 py-4 text-[10px] font-bold tracking-widest uppercase text-slate-500">Subscribed At</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub, index) => (
                  <tr key={sub.id} className="border-b border-[#2A2A2E] hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-slate-500 text-xs">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#C9A84C]/20 flex items-center justify-center shrink-0">
                          <Mail size={12} className="text-[#C9A84C]" />
                        </div>
                        <span className="text-slate-200 font-medium">{sub.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {sub.subscribedAt?.toDate().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) || "Unknown"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(sub.id, sub.email)}
                        className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        title="Remove subscriber"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
