import type { Category, Order, Product } from "@/lib/types";

export const categories: Category[] = [
  { id: "cat-electro", name: "Électronique", slug: "electronique", icon: "Smartphone" },
  { id: "cat-maison", name: "Maison", slug: "maison", icon: "Home" },
  { id: "cat-beaute", name: "Beauté", slug: "beaute", icon: "Sparkles" },
  { id: "cat-mode", name: "Mode", slug: "mode", icon: "Shirt" },
  { id: "cat-cuisine", name: "Cuisine", slug: "cuisine", icon: "Utensils" },
  { id: "cat-gadgets", name: "Gadgets", slug: "gadgets", icon: "Zap" },
  { id: "cat-accessoires", name: "Accessoires", slug: "accessoires", icon: "Watch" }
];

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

export const products: Product[] = [
  {
    id: "p1",
    name: "Écouteurs Bluetooth Mini",
    description: "Son clair, boîtier compact et autonomie longue durée.",
    category_id: "cat-electro",
    category: "Électronique",
    price: 99,
    image_url: img("photo-1606220945770-b5b6c2c55bf1"),
    images: [img("photo-1606220945770-b5b6c2c55bf1")],
    specs: [{ label: "Autonomie", value: "Jusqu'à 6h" }],
    rating: 4.8,
    reviews_count: 238,
    stock: 42,
    is_flash_sale: true,
    flash_sale_end: new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString(),
    is_active: true
  },
  {
    id: "p2",
    name: "Organisateur de Cuisine",
    description: "Rangement modulable pour épices, bocaux et accessoires.",
    category_id: "cat-cuisine",
    category: "Cuisine",
    price: 99,
    image_url: img("photo-1556911220-bff31c812dba"),
    images: [img("photo-1556911220-bff31c812dba")],
    specs: [{ label: "Matière", value: "Plastique renforcé" }],
    rating: 4.7,
    reviews_count: 184,
    stock: 78,
    is_flash_sale: true,
    flash_sale_end: new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString(),
    is_active: true
  },
  {
    id: "p3",
    name: "Lampe LED Tactile",
    description: "Éclairage doux avec trois intensités pour bureau ou chevet.",
    category_id: "cat-maison",
    category: "Maison",
    price: 99,
    image_url: img("photo-1507473885765-e6ed057f782c"),
    images: [img("photo-1507473885765-e6ed057f782c")],
    specs: [{ label: "Modes", value: "3 intensités" }],
    rating: 4.9,
    reviews_count: 321,
    stock: 35,
    is_flash_sale: true,
    flash_sale_end: new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString(),
    is_active: true
  },
  {
    id: "p4",
    name: "Kit Skincare Voyage",
    description: "Routine compacte pour garder l'essentiel avec soi.",
    category_id: "cat-beaute",
    category: "Beauté",
    price: 99,
    image_url: img("photo-1556228720-195a672e8a03"),
    images: [img("photo-1556228720-195a672e8a03")],
    specs: [{ label: "Format", value: "Voyage" }],
    rating: 4.6,
    reviews_count: 147,
    stock: 61,
    is_flash_sale: true,
    flash_sale_end: new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString(),
    is_active: true
  },
  {
    id: "p5",
    name: "Sac Bandoulière Urbain",
    description: "Format léger avec compartiments sécurisés.",
    category_id: "cat-mode",
    category: "Mode",
    price: 99,
    image_url: img("photo-1542291026-7eec264c27ff"),
    images: [img("photo-1542291026-7eec264c27ff")],
    specs: [{ label: "Usage", value: "Quotidien" }],
    rating: 4.7,
    reviews_count: 203,
    stock: 54,
    is_flash_sale: false,
    is_active: true
  },
  {
    id: "p6",
    name: "Support Téléphone Flexible",
    description: "Grip stable pour bureau, voiture ou cuisine.",
    category_id: "cat-gadgets",
    category: "Gadgets",
    price: 99,
    image_url: img("photo-1516321318423-f06f85e504b3"),
    images: [img("photo-1516321318423-f06f85e504b3")],
    specs: [{ label: "Compatibilité", value: "Smartphones" }],
    rating: 4.5,
    reviews_count: 92,
    stock: 88,
    is_flash_sale: false,
    is_active: true
  }
];

export const testimonials = [
  { name: "Sara El Amrani", city: "Casablanca", quote: "Commande reçue le lendemain, prix clair et produits très corrects.", avatar: img("photo-1494790108377-be9c29b29330") },
  { name: "Yassine Berrada", city: "Rabat", quote: "J'aime le concept du prix unique, ça rend l'achat rapide.", avatar: img("photo-1500648767791-00dcc994a43e") },
  { name: "Imane Zahraoui", city: "Marrakech", quote: "Le paiement à la livraison m'a rassurée pour ma première commande.", avatar: img("photo-1534528741775-53994a69daeb") }
];

export const demoOrders: Order[] = [
  {
    id: "o1",
    order_number: 1001,
    full_name: "Nadia Ait",
    phone: "0612345678",
    city: "Casablanca",
    address: "Maarif, près Twin Center",
    total_amount: 198,
    status: "en_attente",
    created_at: new Date().toISOString(),
    order_items: [
      { product_name: "Écouteurs Bluetooth Mini", quantity: 1, unit_price: 99, subtotal: 99 },
      { product_name: "Lampe LED Tactile", quantity: 1, unit_price: 99, subtotal: 99 }
    ]
  },
  {
    id: "o2",
    order_number: 1002,
    full_name: "Hamza Rami",
    phone: "0676543210",
    city: "Fès",
    address: "Route Imouzzer, résidence Atlas",
    total_amount: 99,
    status: "en_cours",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    order_items: [{ product_name: "Organisateur de Cuisine", quantity: 1, unit_price: 99, subtotal: 99 }]
  }
];
