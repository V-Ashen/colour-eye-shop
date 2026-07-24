"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, collection, getDocs, addDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Save, Plus, Trash2, Settings, ListTree, Image as ImageIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import ImageUpload from "@/components/ImageUpload";

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

  // Gallery state
  const [galleryImages, setGalleryImages] = useState<{id: string, url: string, alt: string}[]>([]);
  const [newGalleryAlt, setNewGalleryAlt] = useState("");
  const [newGalleryUrl, setNewGalleryUrl] = useState("");
  const [addingGalleryImage, setAddingGalleryImage] = useState(false);

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

      // Fetch Gallery Images
      const gallerySnapshot = await getDocs(collection(db, "gallery"));
      const gallery = gallerySnapshot.docs.map(d => ({ id: d.id, url: d.data().url, alt: d.data().alt }));
      setGalleryImages(gallery);
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
      toast.success("Settings saved successfully!");
    } catch (error: any) {
      toast.error("Failed to save settings: " + error.message);
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
      toast.error("Failed to add category: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteDoc(doc(db, "categories", id));
      setCategories(categories.filter(c => c.id !== id));
      toast.success("Category deleted!");
    } catch (error: any) {
      toast.error("Failed to delete category: " + error.message);
    }
  };

  const handleAddGalleryImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryUrl) {
      toast.error("Please upload an image first.");
      return;
    }
    setAddingGalleryImage(true);
    try {
      const docRef = await addDoc(collection(db, "gallery"), {
        url: newGalleryUrl,
        alt: newGalleryAlt.trim(),
        createdAt: new Date()
      });
      setGalleryImages([...galleryImages, { id: docRef.id, url: newGalleryUrl, alt: newGalleryAlt.trim() }]);
      setNewGalleryUrl("");
      setNewGalleryAlt("");
      toast.success("Image added to gallery!");
    } catch (error: any) {
      toast.error("Failed to add image: " + error.message);
    } finally {
      setAddingGalleryImage(false);
    }
  };

  const handleDeleteGalleryImage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      await deleteDoc(doc(db, "gallery", id));
      setGalleryImages(galleryImages.filter(img => img.id !== id));
      toast.success("Image deleted from gallery!");
    } catch (error: any) {
      toast.error("Failed to delete image: " + error.message);
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

      {/* Gallery Management (Full Width) */}
      <div className="bg-[#121214] border border-[#2A2A2E] rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#2A2A2E]">
          <ImageIcon className="text-[#C9A84C]" size={24} />
          <h2 className="text-xl font-semibold text-white">Gallery & Previous Works</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Upload New Image */}
          <div className="lg:col-span-1 bg-[#0B0C10]/30 rounded-xl border border-[#2A2A2E] p-4 flex flex-col gap-4">
            <h3 className="text-[10px] font-bold text-[#C9A84C] tracking-widest uppercase">Upload New Image</h3>
            
            <div className="border border-dashed border-[#2A2A2E] rounded-xl bg-[#0B0C10]/50 p-2 text-white">
              {newGalleryUrl ? (
                <div className="text-center">
                  <img src={newGalleryUrl} alt="Preview" className="h-32 mx-auto object-cover rounded-lg mb-2 border border-[#2A2A2E]" />
                  <button type="button" onClick={() => setNewGalleryUrl("")} className="text-red-400 text-xs font-bold uppercase tracking-widest hover:text-red-300">Remove</button>
                </div>
              ) : (
                <ImageUpload onUpload={(url) => setNewGalleryUrl(url)} />
              )}
            </div>

            <input 
              type="text" 
              value={newGalleryAlt}
              onChange={(e) => setNewGalleryAlt(e.target.value)}
              className="w-full px-4 py-2 bg-[#0B0C10]/50 border border-[#2A2A2E] rounded-lg focus:ring-1 focus:ring-[#C9A84C] outline-none text-white text-sm"
              placeholder="Short description (alt text)..."
            />
            
            <button 
              onClick={handleAddGalleryImage}
              disabled={addingGalleryImage || !newGalleryUrl}
              className="w-full bg-[#C9A84C] text-[#121214] font-bold py-2 rounded-lg hover:bg-[#D4B65F] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Plus size={16} />
              {addingGalleryImage ? "Adding..." : "Add to Gallery"}
            </button>
          </div>

          {/* Image Grid */}
          <div className="lg:col-span-2">
            <h3 className="text-[10px] font-bold text-[#C9A84C] tracking-widest uppercase mb-4">Current Gallery Images</h3>
            {galleryImages.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-10 bg-[#0B0C10]/30 rounded-xl border border-[#2A2A2E] border-dashed">No images in gallery.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {galleryImages.map(img => (
                  <div key={img.id} className="relative group rounded-xl overflow-hidden border border-[#2A2A2E] aspect-square bg-[#0B0C10]/50">
                    <img src={img.url} alt={img.alt || "Gallery Image"} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      {img.alt && <p className="text-white text-[10px] px-2 text-center truncate w-full">{img.alt}</p>}
                      <button 
                        onClick={() => handleDeleteGalleryImage(img.id)}
                        className="bg-red-500/20 text-red-400 hover:bg-red-500/40 hover:text-red-300 p-2 rounded-full transition-colors"
                        title="Delete Image"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
