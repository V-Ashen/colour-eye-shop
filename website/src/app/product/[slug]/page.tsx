"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useCartStore } from "@/store/cartStore";
import { ArrowLeft, ShoppingBag } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  stockQuantity: number;
  images: string[];
  category?: string;
  description?: string;
  requiresCustomerImage?: boolean;
  hasFrameSizes?: boolean;
  frameSizes?: { size: string; price: number }[];
}

function ProductDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedFrameSize, setSelectedFrameSize] = useState<{size: string, price: number} | null>(null);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    if (!productId) {
      router.push("/");
      return;
    }

    const fetchProductDetails = async () => {
      try {
        const docSnap = await getDoc(doc(db, "products", productId));
        if (docSnap.exists()) {
          const data = docSnap.data() as Product;
          setProduct({ id: docSnap.id, ...data });
          if (data.hasFrameSizes && data.frameSizes && data.frameSizes.length > 0) {
            setSelectedFrameSize(data.frameSizes[0]);
          }
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId, router]);

  if (loading) return <div className="min-h-screen bg-[var(--background)] flex items-center justify-center font-bold text-[var(--muted)] tracking-widest uppercase text-xs">Loading Product details...</div>;
  if (!product) return null;


  return (
    <div className="min-h-screen bg-[var(--background)] py-24 px-4 sm:px-6 lg:px-8 text-[var(--foreground)]">
      <div className="max-w-5xl mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--accent)] mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 glass-glow border border-[var(--border)] p-8 rounded-2xl shadow-sm">
          
          {/* Left: Image Carousel placeholder */}
          <div className="aspect-square bg-black/5 rounded-xl overflow-hidden border border-[var(--border)] relative">
            <img 
              src={product.images[0] || "/placeholder-image.jpg"} 
              alt={`${product.name} - Premium ${product.category || 'Aesthetic Accessory'} | Colour Eye`} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right: Info Column */}
          <div className="flex flex-col justify-center">
            <p className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-[0.2em] mb-1" style={{ textShadow: "0 0 8px var(--accent-glow)" }}>
              {product.category || "Accessories"}
            </p>
            <h1 className="text-3xl font-semibold text-[var(--foreground)] mb-4 tracking-wide" style={{ fontFamily: "var(--font-serif)" }}>{product.name}</h1>
            
            <p className="text-2xl font-bold text-[var(--accent)] mb-6" style={{ fontFamily: "var(--font-serif)" }}>
              LKR {(selectedFrameSize ? selectedFrameSize.price : product.price).toLocaleString()}
            </p>
            
            {/* Frame Size Selector */}
            {product.hasFrameSizes && product.frameSizes && product.frameSizes.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-[var(--foreground)] mb-3 text-sm uppercase tracking-widest">Select Size</h3>
                <div className="flex flex-wrap gap-3">
                  {product.frameSizes.map((frame, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedFrameSize(frame)}
                      className={`px-4 py-2 border rounded-full text-xs font-bold transition-all ${
                        selectedFrameSize?.size === frame.size 
                          ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-[0_0_10px_var(--accent-glow)]" 
                          : "bg-black/5 text-[var(--muted)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      {frame.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase border ${
                product.stockQuantity > 0 ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
              }`}>
                {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity})` : "Out of Stock"}
              </span>
            </div>

            {/* Product Details accordion */}
            {product.description && (
              <div className="border-t border-[var(--border)] pt-6 mt-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-[var(--foreground)] mb-2 text-lg" style={{ fontFamily: "var(--font-serif)" }}>Description</h3>
                  <p className="text-[var(--muted)] text-sm leading-relaxed text-justify whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              </div>
            )}

            {/* Add to Cart button */}
            <button 
              onClick={() => {
                addToCart({
                  ...product,
                  selectedSize: selectedFrameSize ? selectedFrameSize.size : undefined,
                  price: selectedFrameSize ? selectedFrameSize.price : product.price
                });
              }}
              disabled={product.stockQuantity === 0}
              className="mt-8 w-full bg-[var(--accent)] text-white font-bold text-xs tracking-widest uppercase py-4 rounded-full hover:bg-white hover:text-[var(--foreground)] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-[0_0_15px_var(--accent-glow)]"
            >
              <ShoppingBag size={18} /> {product.stockQuantity === 0 ? "Sold Out" : "Add to Cart"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// Wrapping PDP in Suspense to satisfy Vercel production build rules
export default function ProductDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--background)] flex items-center justify-center text-[10px] font-bold tracking-widest uppercase text-[var(--muted)]">Loading Product details...</div>}>
      <ProductDetailsContent />
    </Suspense>
  );
}