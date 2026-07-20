"use client";

import { useEffect, useState, useRef } from "react";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Bell, X, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useAdminAuthStore } from "@/store/adminAuthStore";

interface Notification {
  id: string; // The order ID
  customerName: string;
  totalAmount: number;
}

export default function OrderNotifier() {
  const { user } = useAdminAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // We use a ref to track initial load so we don't alert on existing orders
  const isInitialLoad = useRef(true);
  
  // Keep track of IDs we've already notified about in this session to prevent duplicates
  const notifiedIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;

    // We only care about Pending orders
    const q = query(
      collection(db, "orders"),
      where("status", "==", "Pending"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (isInitialLoad.current) {
        // First execution just initializes the listener, ignore the current docs
        isInitialLoad.current = false;
        // Mark all existing pending orders as 'seen' so they don't trigger if modified
        snapshot.docs.forEach(doc => notifiedIds.current.add(doc.id));
        return;
      }

      const newNotifs: Notification[] = [];

      snapshot.docChanges().forEach((change) => {
        if (change.type === "added" && !notifiedIds.current.has(change.doc.id)) {
          const data = change.doc.data();
          notifiedIds.current.add(change.doc.id);
          
          newNotifs.push({
            id: change.doc.id,
            customerName: data.customerName || "Customer",
            totalAmount: data.totalAmount || 0,
          });
        }
      });

      if (newNotifs.length > 0) {
        setNotifications((prev) => [...prev, ...newNotifs]);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {notifications.map((notif) => (
        <div 
          key={notif.id}
          className="pointer-events-auto bg-white border border-[#E0DDD6] shadow-2xl rounded-2xl p-4 flex flex-col animate-in slide-in-from-right-8 duration-500"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 text-[#C9A84C]">
              <div className="bg-[#C9A84C]/10 p-2 rounded-full">
                <Bell size={16} className="text-[#C9A84C]" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">New Order</span>
            </div>
            <button 
              onClick={() => removeNotification(notif.id)}
              className="text-slate-400 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          
          <h3 className="text-lg font-bold text-[#1C1C1E] mb-1 truncate">
            {notif.customerName}
          </h3>
          <p className="text-sm font-semibold text-slate-600 mb-4">
            LKR {notif.totalAmount.toLocaleString()}
          </p>

          <div className="flex gap-2">
            <Link 
              href="/orders" 
              onClick={() => removeNotification(notif.id)}
              className="flex-1 bg-[#1C1C1E] hover:bg-[#2A2A2E] text-[#C9A84C] text-xs font-bold uppercase tracking-widest py-2.5 rounded-xl transition-colors text-center shadow-md flex items-center justify-center gap-2"
            >
               <ShoppingBag size={14} /> View Orders
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
