"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, collection, getDocs, addDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Save, Plus, Trash2, Settings, ListTree } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Global Settings state
  const [metaPixel, setMetaPixel] = useState("");
  const [tiktokPixel, setTiktokPixel] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [tiktokUrl, setTiktokUrl] = useState("");
  
  // Delivery Settings state
  const [deliveryFee, setDeliveryFee] = useState("0");
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState("0");

  // Categories state
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setFetching(true);
    try {
      // Fetch Global Settings
      const settingsDoc = await getDoc(doc(db, "settings", "global"));
      if (settingsDoc.exists()) {
        const data = settingsDoc.data();
        setMetaPixel(data.metaPixel || "");
        setTiktokPixel(data.tiktokPixel || "");
        setFacebookUrl(data.facebookUrl || "");
        setInstagramUrl(data.instagramUrl || "");
        setTiktokUrl(data.tiktokUrl || "");
        setDeliveryFee(data.deliveryFee?.toString() || "0");
        setFreeDeliveryThreshold(data.freeDeliveryThreshold?.toString() || "0");
      }

      // Fetch Categories
      const catsSnapshot = await getDocs(collection(db, "categories"));
      const cats = catsSnapshot.docs.map(d => ({ id: d.id, name: d.data().name }));
      setCategories(cats);
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setFetching(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setDoc(doc(db, "settings", "global"), {
        metaPixel,
        tiktokPixel,
        facebookUrl,
        instagramUrl,
        tiktokUrl,
        deliveryFee: parseFloat(deliveryFee) || 0,
        freeDeliveryThreshold: parseFloat(freeDeliveryThreshold) || 0
      }, { merge: true });
      alert("Settings saved successfully!");
    } catch (error: any) {
      alert("Failed to save settings: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "categories"), {
        name: newCategoryName.trim()
      });
      setCategories([...categories, { id: docRef.id, name: newCategoryName.trim() }]);
      setNewCategoryName("");
    } catch (error: any) {
      alert("Failed to add category: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteDoc(doc(db, "categories", id));
      setCategories(categories.filter(c => c.id !== id));
    } catch (error: any) {
      alert("Failed to delete category: " + error.message);
    }
  };

  if (fetching) return <div className="p-8 text-white">Loading Settings...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Platform Settings</h1>
        <p className="text-slate-400 mt-2">Manage tracking pixels, social links, and product categories.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Global Settings Form */}
        <div className="bg-[#121214] border border-[#2A2A2E] rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#2A2A2E]">
            <Settings className="text-[#C9A84C]" size={24} />
            <h2 className="text-xl font-semibold text-white">Global Configurations</h2>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-5">
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-[#C9A84C] tracking-widest uppercase">Tracking Pixels</h3>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Meta Pixel ID</label>
                <input 
                  type="text" 
                  value={metaPixel} 
                  onChange={(e) => setMetaPixel(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0B0C10]/50 border border-[#2A2A2E] rounded-xl focus:ring-1 focus:ring-[#C9A84C] outline-none text-white"
                  placeholder="e.g. 123456789012345"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">TikTok Pixel ID</label>
                <input 
                  type="text" 
                  value={tiktokPixel} 
                  onChange={(e) => setTiktokPixel(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0B0C10]/50 border border-[#2A2A2E] rounded-xl focus:ring-1 focus:ring-[#C9A84C] outline-none text-white"
                  placeholder="e.g. CABC1234DEF567"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#2A2A2E]">
              <h3 className="text-[10px] font-bold text-[#C9A84C] tracking-widest uppercase">Social Links</h3>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Facebook URL</label>
                <input 
                  type="url" 
                  value={facebookUrl} 
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0B0C10]/50 border border-[#2A2A2E] rounded-xl focus:ring-1 focus:ring-[#C9A84C] outline-none text-white"
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Instagram URL</label>
                <input 
                  type="url" 
                  value={instagramUrl} 
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0B0C10]/50 border border-[#2A2A2E] rounded-xl focus:ring-1 focus:ring-[#C9A84C] outline-none text-white"
                  placeholder="https://instagram.com/yourpage"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">TikTok URL</label>
                <input 
                  type="url" 
                  value={tiktokUrl} 
                  onChange={(e) => setTiktokUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0B0C10]/50 border border-[#2A2A2E] rounded-xl focus:ring-1 focus:ring-[#C9A84C] outline-none text-white"
                  placeholder="https://tiktok.com/@yourpage"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#2A2A2E]">
              <h3 className="text-[10px] font-bold text-[#C9A84C] tracking-widest uppercase">Delivery Settings</h3>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Standard Delivery Fee (LKR)</label>
                <input 
                  type="number" 
                  value={deliveryFee} 
                  onChange={(e) => setDeliveryFee(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0B0C10]/50 border border-[#2A2A2E] rounded-xl focus:ring-1 focus:ring-[#C9A84C] outline-none text-white"
                  placeholder="e.g. 500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Free Delivery Above (LKR)</label>
                <input 
                  type="number" 
                  value={freeDeliveryThreshold} 
                  onChange={(e) => setFreeDeliveryThreshold(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0B0C10]/50 border border-[#2A2A2E] rounded-xl focus:ring-1 focus:ring-[#C9A84C] outline-none text-white"
                  placeholder="e.g. 15000"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#C9A84C] text-[#121214] font-bold py-3 rounded-xl hover:bg-[#D4B65F] transition-all flex items-center justify-center gap-2 mt-4"
            >
              <Save size={18} />
              {loading ? "Saving..." : "Save Settings"}
            </button>
          </form>
        </div>

        {/* Category Management */}
        <div className="bg-[#121214] border border-[#2A2A2E] rounded-2xl p-6 shadow-xl flex flex-col">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#2A2A2E]">
            <ListTree className="text-[#C9A84C]" size={24} />
            <h2 className="text-xl font-semibold text-white">Category Management</h2>
          </div>

          <form onSubmit={handleAddCategory} className="flex gap-2 mb-6">
            <input 
              type="text" 
              required
              value={newCategoryName} 
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-[#0B0C10]/50 border border-[#2A2A2E] rounded-xl focus:ring-1 focus:ring-[#C9A84C] outline-none text-white"
              placeholder="New category name"
            />
            <button 
              type="submit" 
              disabled={loading || !newCategoryName.trim()}
              className="bg-[#C9A84C] text-[#121214] font-bold px-4 rounded-xl hover:bg-[#D4B65F] transition-all flex items-center justify-center disabled:opacity-50"
            >
              <Plus size={20} />
            </button>
          </form>

          <div className="flex-1 bg-[#0B0C10]/30 rounded-xl border border-[#2A2A2E] p-4 overflow-y-auto max-h-[400px]">
            {categories.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">No categories found.</p>
            ) : (
              <ul className="space-y-2">
                {categories.map(cat => (
                  <li key={cat.id} className="flex items-center justify-between bg-[#1A1A1E] px-4 py-3 rounded-lg border border-[#2A2A2E]/50">
                    <span className="text-slate-200 font-medium text-sm">{cat.name}</span>
                    <button 
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
