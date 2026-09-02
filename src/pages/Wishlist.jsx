/* Lavender Lookbook saved edit: a personal, image-led holding space for styles worth coming back to. */
import { Heart } from "lucide-react";
import { useWishlistStore } from "../store/wishlistStore";
import { usePageMeta } from "../hooks/usePageMeta";
import { useProducts } from "../hooks/useProducts";
import ProductGrid from "../components/product/ProductGrid";
import EmptyState from "../components/feedback/EmptyState";
export default function Wishlist() { usePageMeta("Saved edit", "Review the Fitique pieces you have saved for later."); const savedIds = useWishlistStore((state) => state.productIds); const { data: products = [], isLoading } = useProducts({}); const saved = products.filter((product) => savedIds.includes(product.id)); return <div className="content-shell py-8 lg:py-12"><div className="border-b border-fitique-line pb-6"><p className="eyebrow text-fitique-brown">Personal shortlist</p><h1 className="serif mt-2 text-5xl tracking-[-.04em] text-fitique-plum">Your saved edit</h1><p className="mt-3 text-sm text-fitique-ink/65">A small collection of pieces that caught your eye.</p></div><div className="mt-8">{isLoading ? <div className="h-64 animate-pulse bg-fitique-paper" /> : saved.length ? <ProductGrid products={saved} priority /> : <EmptyState icon={Heart} title="Nothing saved yet." description="Tap the heart on a piece to return to it later, build a look, or check its fit." />}</div></div>; }
