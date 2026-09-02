/* Lavender Lookbook product card: photography-first merchandising with editorial captions and quiet, confident actions. */
import { Eye, Heart } from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";

// ! internal imports
import { formatCurrency, getDiscount } from "../../../lib/utils.js";
import { useCartStore } from "../../commerce/hooks/useCart.js";
import { useWishlistStore } from "../../store/wishlistStore";


export default function ProductCard({
  product,
  priority = false,
  onQuickView,
}) {
  const addItem = useCartStore(state => state.addItem);
  const wishlist = useWishlistStore(state => state.productIds);
  const toggleWishlist = useWishlistStore(state => state.toggle);
  const saved = wishlist.includes(product.id);
  const discount = getDiscount(product);
  function toggle(event) {
    event.preventDefault();
    event.stopPropagation();
    toggleWishlist(product.id);
    toast(saved ? "Removed from your saved edit" : "Saved to your edit");
  }
  return (
    <article className="group min-w-0">
      <Link
        to={`/products/${product.id}`}
        className="focus-ring block text-fitique-ink no-underline"
      >
        <div className="relative overflow-hidden bg-fitique-paper">
          <img
            src={product.image}
            alt={product.name}
            loading={priority ? "eager" : "lazy"}
            className="aspect-[.76] h-full w-full object-cover brightness-[.97] contrast-[.93] saturate-[.62] sepia-[.08] transition duration-500 group-hover:scale-[1.025]"
          />
          {product.badge && (
            <span className="absolute left-3 top-3 bg-fitique-ivory/90 px-2.5 py-1 text-[.6rem] font-extrabold uppercase tracking-[.1em] text-fitique-plum">
              {product.badge}
            </span>
          )}
          {!product.inStock && (
            <span className="absolute inset-x-0 bottom-0 bg-fitique-ink/80 px-3 py-2 text-center text-[.62rem] font-extrabold uppercase tracking-[.13em] text-white">
              Currently unavailable
            </span>
          )}
          <button
            onClick={toggle}
            aria-label={
              saved
                ? `Remove ${product.name} from your wishlist`
                : `Save ${product.name} to your wishlist`
            }
            className={`focus-ring absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full bg-fitique-ivory/90 ${saved ? "text-fitique-plum" : "text-fitique-ink"}`}
          >
            <Heart
              size={16}
              fill={saved ? "currentColor" : "none"}
              strokeWidth={1.7}
            />
          </button>
        </div>
        <div className="border-b border-fitique-line py-3">
          <p className="eyebrow text-fitique-brown">
            {product.category} · {product.type}
          </p>
          <div className="mt-1 flex items-start justify-between gap-2">
            <h3 className="text-sm font-bold leading-5">{product.name}</h3>
            <div className="shrink-0 text-right">
              <span className="text-sm font-extrabold text-fitique-plum">
                {formatCurrency(product.price)}
              </span>
              {discount && (
                <span className="ml-1.5 text-[.65rem] font-bold text-fitique-brown">
                  −{discount}%
                </span>
              )}
            </div>
          </div>
          {product.previousPrice && (
            <p className="mt-1 text-xs text-fitique-ink/45 line-through">
              {formatCurrency(product.previousPrice)}
            </p>
          )}
        </div>
      </Link>
      <div className="mt-2 flex items-center justify-between border-b border-fitique-line pb-2">
        <span className="text-[.6rem] font-bold uppercase tracking-[.11em] text-fitique-ink/45">
          Boutique edit
        </span>
        <button
          onClick={() => onQuickView?.(product)}
          className="focus-ring inline-flex items-center gap-1 text-[.62rem] font-extrabold uppercase tracking-[.07em] text-fitique-brown hover:text-fitique-plum"
        >
          <Eye size={13} /> Quick view
        </button>
      </div>
    </article>
  );
}
