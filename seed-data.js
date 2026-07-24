import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// You need to configure your firebase config here to run this script standalone.
// For now, it is a template for the user to run.
const firebaseConfig = {
  // Add config here
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sampleProducts = [
  {
    name: "Classic Gold Butterfly Ring",
    price: 1500,
    stockQuantity: 20,
    category: "Accessories",
    description: "An elegant gold ring with a delicate butterfly design.",
    imageAlt: "Gold butterfly ring on hand",
    requiresCustomerImage: false,
    hasFrameSizes: false,
    frameSizes: [],
    images: ["https://placehold.co/400x500/eaeaea/555555?text=Gold+Ring"],
    isActive: true,
    createdAt: new Date(),
  },
  {
    name: "Custom Polaroid Frame (A4)",
    price: 3500,
    stockQuantity: 10,
    category: "Frames",
    description: "A beautiful A4 frame tailored with your custom photos.",
    imageAlt: "A4 custom photo frame hanging on wall",
    requiresCustomerImage: true,
    hasFrameSizes: true,
    frameSizes: [
      { size: "A4 Frame", price: 3500 },
      { size: "A3 Frame", price: 4500 }
    ],
    images: ["https://placehold.co/400x500/eaeaea/555555?text=Photo+Frame"],
    isActive: true,
    createdAt: new Date(),
  },
  {
    name: "Minimalist Pearl Necklace",
    price: 2200,
    stockQuantity: 15,
    category: "Accessories",
    description: "A sleek, single-pearl necklace perfect for any occasion.",
    imageAlt: "Pearl necklace",
    requiresCustomerImage: false,
    hasFrameSizes: false,
    frameSizes: [],
    images: ["https://placehold.co/400x500/eaeaea/555555?text=Pearl+Necklace"],
    isActive: true,
    createdAt: new Date(),
  }
];

async function seedProducts() {
  console.log("Seeding products...");
  try {
    for (const product of sampleProducts) {
      const docRef = await addDoc(collection(db, "products"), product);
      console.log("Added product:", product.name, "with ID:", docRef.id);
    }
    console.log("Seeding complete!");
  } catch (error) {
    console.error("Error seeding products:", error);
  }
}

// seedProducts();
