"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Search, Eye, X, Mail, Clock } from "lucide-react";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  status: "Read" | "Unread";
  createdAt: any;
}

export default function MessagesPage() {
  const { hasPermission, roleCode } = useAdminAuthStore();
  const router = useRouter();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    // If not master admin and doesn't have permission, redirect
    if (roleCode !== 0 && !hasPermission("view messages")) {
      router.push("/");
      return;
    }
    fetchMessages();
  }, [roleCode, hasPermission, router]);

  const fetchMessages = async () => {
    try {
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Message[];
      setMessages(fetched);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (msgId: string, newStatus: "Read" | "Unread") => {
    try {
      await updateDoc(doc(db, "messages", msgId), { status: newStatus });
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: newStatus } : m));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate();
    return date.toLocaleDateString("en-GB", { 
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  const filteredMessages = messages.filter(msg => {
    const searchLower = searchQuery.toLowerCase().trim();
    return (
      msg.name.toLowerCase().includes(searchLower) ||
      msg.email.toLowerCase().includes(searchLower) ||
      msg.message.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return <div className="p-8 max-w-7xl mx-auto flex justify-center mt-20"><div className="w-8 h-8 border-4 border-[#C9A84C] border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <p className="text-[#C9A84C] font-bold text-xs tracking-[0.2em] uppercase mb-1">Inquiries</p>
          <h1 className="text-3xl font-extrabold text-[#1C1C1E] tracking-tight" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            Customer Messages
          </h1>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#E0DDD6] rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#C9A84C] transition shadow-sm"
          />
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white border border-[#E0DDD6] rounded-2xl shadow-sm overflow-hidden">
        {filteredMessages.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-medium">No messages found.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#FAF9F7] border-b border-[#E0DDD6]">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Snippet</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0DDD6]">
              {filteredMessages.map((msg) => (
                <tr key={msg.id} className={`hover:bg-[#FAF9F7] transition ${msg.status === "Unread" ? "bg-[#C9A84C]/5" : ""}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock size={14} className="text-[#C9A84C]" />
                      <span className={msg.status === "Unread" ? "font-bold text-[#1C1C1E]" : ""}>{formatDate(msg.createdAt)}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className={`text-sm ${msg.status === "Unread" ? "font-bold text-[#1C1C1E]" : "font-semibold text-slate-700"}`}>{msg.name}</p>
                    <p className="text-xs text-slate-500">{msg.email}</p>
                  </td>
                  <td className="p-4 hidden md:table-cell max-w-[200px] lg:max-w-[300px]">
                    <p className={`text-sm truncate ${msg.status === "Unread" ? "font-semibold text-[#1C1C1E]" : "text-slate-500"}`}>
                      {msg.message}
                    </p>
                  </td>
                  <td className="p-4">
                    <select
                      value={msg.status}
                      onChange={(e) => handleStatusChange(msg.id, e.target.value as "Read" | "Unread")}
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border outline-none cursor-pointer ${
                        msg.status === "Unread" 
                          ? "bg-red-50 text-red-600 border-red-200"
                          : "bg-green-50 text-green-600 border-green-200"
                      }`}
                    >
                      <option value="Unread">Unread</option>
                      <option value="Read">Read</option>
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => {
                        setSelectedMessage(msg);
                        if (msg.status === "Unread") handleStatusChange(msg.id, "Read");
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E0DDD6] rounded-lg text-xs font-bold text-slate-600 hover:text-[#1C1C1E] hover:border-[#1C1C1E] transition"
                    >
                      <Eye size={14} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* View Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-[#E0DDD6] flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-[#E0DDD6] flex justify-between items-center bg-[#FAF9F7]">
              <h2 className="text-lg font-bold text-[#1C1C1E] flex items-center gap-2">
                <Mail size={18} className="text-[#C9A84C]" /> Message Details
              </h2>
              <button 
                onClick={() => setSelectedMessage(null)}
                className="p-1.5 rounded-lg hover:bg-[#E0DDD6] text-slate-500 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto">
              <div className="mb-6 space-y-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">From</p>
                  <p className="text-sm font-semibold text-[#1C1C1E]">{selectedMessage.name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email</p>
                  <a href={`mailto:${selectedMessage.email}`} className="text-sm font-semibold text-[#C9A84C] hover:underline">
                    {selectedMessage.email}
                  </a>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Received On</p>
                  <p className="text-sm font-semibold text-slate-600">{formatDate(selectedMessage.createdAt)}</p>
                </div>
              </div>

              <div className="bg-[#FAF9F7] p-4 rounded-xl border border-[#E0DDD6]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Message</p>
                <p className="text-sm text-[#1C1C1E] whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </p>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-5 border-t border-[#E0DDD6] bg-[#FAF9F7] flex justify-end">
              <button 
                onClick={() => setSelectedMessage(null)}
                className="px-5 py-2 bg-white border border-[#E0DDD6] text-sm font-bold text-slate-600 rounded-xl hover:bg-[#E0DDD6] transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
