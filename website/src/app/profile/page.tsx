"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Package, Truck, CheckCircle2, Clock, MapPin, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Orders");

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const fetchedOrders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, router]);

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-[var(--muted)] animate-pulse tracking-widest text-xs uppercase font-bold">Loading Profile...</div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending": return <Clock size={20} className="text-yellow-500" />;
      case "Processing": return <Package size={20} className="text-blue-500" />;
      case "Dispatched": return <Truck size={20} className="text-purple-500" />;
      case "Completed": return <CheckCircle2 size={20} className="text-green-500" />;
      default: return <Clock size={20} className="text-slate-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10">
        
        {/* Sidebar */}
        <div className="w-full md:w-1/4 flex flex-col gap-6">
          <div className="bg-black/5 border border-[var(--border)] rounded-2xl p-6 text-center">
            <div className="w-20 h-20 mx-auto bg-[var(--accent)]/10 text-[var(--accent)] rounded-full flex items-center justify-center text-3xl font-bold mb-4 shadow-inner border border-[var(--border)]">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-lg font-semibold text-[var(--foreground)] truncate px-2" style={{ fontFamily: "var(--font-serif)" }}>
              {user.email}
            </h2>
            <p className="text-xs text-[var(--muted)] mt-1 tracking-widest uppercase">Member</p>
          </div>

          <div className="bg-black/5 border border-[var(--border)] rounded-2xl p-4 flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab("Orders")}
              className={`text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === "Orders" ? "bg-[var(--foreground)] text-[var(--background)] shadow-md" : "text-[var(--muted)] hover:bg-black/10 hover:text-[var(--foreground)]"
              }`}
            >
              Order History
            </button>
            <button 
              onClick={() => setActiveTab("Settings")}
              className={`text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === "Settings" ? "bg-[var(--foreground)] text-[var(--background)] shadow-md" : "text-[var(--muted)] hover:bg-black/10 hover:text-[var(--foreground)]"
              }`}
            >
              Account Settings
            </button>
            <Link 
              href="/"
              className="text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-[var(--muted)] hover:bg-black/10 hover:text-[var(--foreground)] transition-all flex items-center gap-2 mt-4 border-t border-[var(--border)] pt-4"
            >
              ← Back to Shop
            </Link>
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full md:w-3/4">
          
          {activeTab === "Orders" && (
            <div>
              <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-6 tracking-wide" style={{ fontFamily: "var(--font-serif)" }}>
                Order History & Tracking
              </h2>
              
              {orders.length === 0 ? (
                <div className="bg-black/5 border border-[var(--border)] rounded-2xl p-12 text-center flex flex-col items-center">
                  <Package size={48} className="text-[var(--muted)] mb-4 opacity-50" />
                  <p className="text-[var(--foreground)] font-semibold mb-2">No orders found.</p>
                  <p className="text-xs text-[var(--muted)] mb-6">Looks like you haven't placed any orders yet.</p>
                  <Link href="/shop" className="bg-[var(--accent)] text-[var(--background)] px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all shadow-[0_0_15px_var(--accent-glow)]">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-transparent border border-[var(--border)] rounded-2xl p-6 hover:border-[var(--accent)] transition-all duration-300">
                      
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[var(--border)] pb-4 mb-4 gap-4">
                        <div>
                          <p className="text-[10px] font-bold tracking-widest uppercase text-[var(--muted)]">Order ID</p>
                          <p className="text-sm font-semibold text-[var(--foreground)] uppercase mt-0.5">#{order.id.slice(-8)}</p>
                          <p className="text-xs text-[var(--muted)] mt-1">
                            {order.createdAt?.toDate().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-black/5 border border-[var(--border)] rounded-full">
                          {getStatusIcon(order.status)}
                          <span className="text-xs font-bold uppercase tracking-widest text-[var(--foreground)]">{order.status}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-4">
                          {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-xl overflow-hidden border border-[var(--border)] shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-[var(--foreground)]">{item.name}</p>
                                {item.selectedSize && <p className="text-[10px] text-[var(--accent)] font-bold uppercase tracking-wider mt-0.5">Size: {item.selectedSize}</p>}
                                <p className="text-xs text-[var(--muted)] mt-1">Qty: {item.quantity} × LKR {item.price.toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="bg-black/5 rounded-xl p-4 border border-[var(--border)] flex flex-col justify-center">
                          <p className="text-[10px] font-bold tracking-widest uppercase text-[var(--muted)] mb-1">Order Total</p>
                          <p className="text-lg font-bold text-[var(--accent)]">LKR {order.totalAmount.toLocaleString()}</p>
                          <div className="mt-4 pt-4 border-t border-[var(--border)]">
                            <p className="text-[10px] font-bold tracking-widest uppercase text-[var(--muted)] mb-1 flex items-center gap-1.5"><MapPin size={12} /> Shipped To</p>
                            <p className="text-xs text-[var(--foreground)] truncate">{order.shippingAddress}</p>
                          </div>
                        </div>
                      </div>
                      
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "Settings" && (
            <div>
              <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-6 tracking-wide" style={{ fontFamily: "var(--font-serif)" }}>
                Account Settings
              </h2>
              <div className="bg-black/5 border border-[var(--border)] rounded-2xl p-8">
                <p className="text-sm text-[var(--muted)] mb-4">You are logged in with the email address:</p>
                <div className="flex items-center justify-between p-4 bg-[var(--background)] border border-[var(--border)] rounded-xl">
                  <span className="font-semibold text-[var(--foreground)]">{user.email}</span>
                </div>
                <p className="text-xs text-[var(--muted)] mt-4">
                  Account settings (such as changing passwords or updating primary addresses) are currently managed via the checkout process or contact support.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
