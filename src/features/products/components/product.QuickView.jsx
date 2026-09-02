import {
	ArrowUpRight,
	Heart,
	Ruler,
	ShoppingBag,
	Sparkles,
} from "lucide-react";
import React from "react";
import { Link } from "react-router";
import { toast } from "sonner";

// ! internal imports
// ? missing imports
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";

import QuantitySelector from "../commerce/QuantitySelector";

// # hooks
import { useCartStore } from "../hooks/useCart";
import { formatCurrency } from "../../../lib/utils";
// ? missing imports
import { useWishlistStore } from "../../store/wishlistStore";


export default function ProductQuickView({ product, open, onOpenChange }) {
	const addItem = useCartStore((state) => state.addItem);
	const wishlist = useWishlistStore((state) => state.productIds);
	const toggleWishlist = useWishlistStore((state) => state.toggle);
	const [size, setSize] = React.useState(product?.sizes?.[0] || "");
	const [color, setColor] = React.useState(product?.colors?.[0] || "");
	const [quantity, setQuantity] = React.useState(1);
	const saved = product ? wishlist.includes(product.id) : false;

	React.useEffect(() => {
		if (product) {
			setSize(product.sizes?.[0] || "");
			setColor(product.colors?.[0] || "");
			setQuantity(1);
		}
	}, [product]);
	if (!product) return null;
	function addToBag() {
		if (!product.inStock) return;
		addItem(product, { size, color, quantity });
		toast(`${product.name} is in your bag`);
		onOpenChange(false);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[92vh] max-w-4xl overflow-y-auto rounded-none border-fitique-line bg-fitique-ivory p-0 text-fitique-ink sm:max-w-4xl">
				<div className="grid md:grid-cols-[.88fr_1fr]">
					<div className="relative min-h-72 bg-fitique-paper">
						<img
							src={product.image}
							alt={product.name}
							className="h-full min-h-72 w-full object-cover saturate-[.78] sepia-[.04]"
						/>
						{product.badge && (
							<span className="absolute left-4 top-4 bg-fitique-ivory px-3 py-1.5 text-[.6rem] font-extrabold uppercase tracking-[.1em] text-fitique-plum">
								{product.badge}
							</span>
						)}
					</div>
					<div className="p-6 sm:p-8">
						<DialogHeader className="text-left">
							<p className="eyebrow text-fitique-brown">
								Quick view · {product.category}
							</p>
							<DialogTitle className="serif text-4xl tracking-[-.04em] text-fitique-plum">
								{product.name}
							</DialogTitle>
							<DialogDescription className="mt-2 pr-8 leading-6 text-fitique-ink/65">
								{product.description}
							</DialogDescription>
						</DialogHeader>
						<div className="mt-5 flex items-center justify-between border-y border-fitique-line py-4">
							<span className="text-xl font-extrabold text-fitique-plum">
								{formatCurrency(product.price)}
							</span>
							<button
								onClick={() => {
									toggleWishlist(product.id);
									toast(
										saved
											? "Removed from your saved edit"
											: "Saved to your edit",
									);
								}}
								className="focus-ring inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.08em] text-fitique-brown hover:text-fitique-plum">
								<Heart
									size={16}
									fill={saved ? "currentColor" : "none"}
								/>{" "}
								{saved ? "Saved" : "Save piece"}
							</button>
						</div>
						<div className="mt-5">
							<p className="field-label">Size</p>
							<div className="mt-2 flex flex-wrap gap-2">
								{product.sizes.map((option) => (
									<button
										key={option}
										onClick={() => setSize(option)}
										className={`focus-ring border px-3 py-2 text-sm font-bold ${size === option ? "border-fitique-plum bg-fitique-plum text-white" : "border-fitique-line bg-white hover:border-fitique-plum"}`}>
										{option}
									</button>
								))}
							</div>
							<div className="mt-5 flex items-center justify-between">
								<p className="field-label">Colour · {color}</p>
								<button className="focus-ring inline-flex items-center gap-1 text-xs font-bold text-fitique-brown hover:text-fitique-plum">
									<Ruler size={14} /> Size guide
								</button>
							</div>
							<div className="mt-2 flex flex-wrap gap-2">
								{product.colors.map((option) => (
									<button
										key={option}
										onClick={() => setColor(option)}
										className={`focus-ring border px-3 py-2 text-sm font-bold ${color === option ? "border-fitique-plum bg-fitique-lilac/55 text-fitique-plum" : "border-fitique-line bg-white hover:border-fitique-plum"}`}>
										{option}
									</button>
								))}
							</div>
						</div>
						<div className="mt-6 flex items-center justify-between">
							<QuantitySelector
								value={quantity}
								onChange={setQuantity}
							/>
							<span
								className={`text-xs font-bold ${product.inStock ? "text-[#345c39]" : "text-[#8b4040]"}`}>
								{product.inStock
									? "Available for boutique delivery"
									: "Currently unavailable"}
							</span>
						</div>
						<button
							disabled={!product.inStock}
							onClick={addToBag}
							className="plum-button focus-ring mt-6 w-full disabled:cursor-not-allowed disabled:opacity-45">
							<ShoppingBag size={15} /> Add to bag ·{" "}
							{formatCurrency(product.price * quantity)}
						</button>
						<div className="mt-4 flex items-center justify-between">
							<Link
								to={`/fit-check?product=${product.id}`}
								onClick={() => onOpenChange(false)}
								className="focus-ring inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-[.08em] text-fitique-brown hover:text-fitique-plum">
								<Sparkles size={14} /> Check my fit
							</Link>
							<Link
								to={`/products/${product.id}`}
								onClick={() => onOpenChange(false)}
								className="focus-ring inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-[.08em] text-fitique-plum hover:underline">
								View full piece <ArrowUpRight size={14} />
							</Link>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
